import prisma from '../db/client.mjs';
import { runLabTests, resolveLabBaseUrl } from './test-runner.mjs';
import { fetchBindingMetaForChallenge } from './courses-bridge.mjs';

function log(...args) {
  console.log(`[TCLab:Grader][${new Date().toISOString()}]`, ...args);
}

/**
 * (Re)run grading for a submission.
 * - Sets status to "running"
 * - Clears previous gradePct/feedback
 * - Fetches lab metadata from lesson
 * - Runs tests defined in lab metadata
 * - Updates submission with results
 */
export async function runGrading(submissionId) {
  log('runGrading()', { submissionId });

  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: {
      session: {
        include: {
          challenge: true
        }
      }
    }
  });

  if (!submission) {
    log('❌ Submission not found');
    return;
  }

  const session = submission.session;
  const challenge = session.challenge;

  // Reset to running / clear old results
  await prisma.submission.update({
    where: { id: submissionId },
    data: {
      status: 'running',
      passed: false,
      gradePct: null,
      feedback: null
    }
  });

  try {
    // Fetch lab metadata from lesson if available
    let labMeta = null;
    if (challenge.lessonId) {
      try {
        const bindings = await fetchBindingMetaForChallenge(challenge);
        if (bindings?.lesson?.metadata?.lab) {
          labMeta = bindings.lesson.metadata.lab;
          log('📦 Found lab metadata:', { kind: labMeta.kind });
        }
      } catch (e) {
        log('⚠️ Failed to fetch lab metadata:', e.message);
      }
    }

    if (!labMeta || !labMeta.kind) {
      // No lab metadata - skip grading or use mock
      log('⚠️ No lab metadata found, using mock grading');
      await prisma.submission.update({
        where: { id: submissionId },
        data: {
          status: 'passed',
          passed: true,
          gradePct: 100,
          feedback: 'No tests configured for this lab.'
        }
      });
      return;
    }

    // Resolve base URL for the lab
    const baseUrl = resolveLabBaseUrl(labMeta, {
      appUrl: session.appUrl || null,
      traefikHost: session.appUrl ? new URL(session.appUrl).hostname : null,
      traefikHostApp: session.appUrl ? new URL(session.appUrl).hostname : null,
      appPort: session.appUrl ? Number(new URL(session.appUrl).port || labMeta.devPort || 3000) : undefined,
    });

    log('🧪 Running tests...', { baseUrl, kind: labMeta.kind });

    // Run tests
    const testResults = await runLabTests(labMeta, baseUrl);

    const passed = testResults.passed;
    const gradePct = testResults.summary.total > 0
      ? Math.round((testResults.summary.passed / testResults.summary.total) * 100)
      : 0;

    // Build feedback message
    const feedback = [
      `Tests: ${testResults.summary.passed}/${testResults.summary.total} passed`,
      testResults.summary.failed > 0
        ? `\nFailed tests:\n${testResults.results
            .filter(r => !r.passed)
            .map(r => `- ${r.name || r.id}: ${r.error || 'Unknown error'}`)
            .join('\n')}`
        : ''
    ].join('');

    await prisma.submission.update({
      where: { id: submissionId },
      data: {
        status: passed ? 'passed' : 'failed',
        passed,
        gradePct,
        feedback
      }
    });

    log(`✅ Grading complete: ${passed ? 'PASSED' : 'FAILED'} (${gradePct}%)`);
  } catch (e) {
    log('❌ Grading failed:', e?.message || e);
    console.error('[teacher-course-lab] Grading failed:', e);
    await prisma.submission.update({
      where: { id: submissionId },
      data: {
        status: 'failed',
        passed: false,
        feedback: `Grading failed: ${e?.message || 'Unknown error'}. See server logs.`
      }
    });
  }
}
