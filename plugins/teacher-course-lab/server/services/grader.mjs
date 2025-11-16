import prisma from '../db/client.mjs';

/**
 * (Re)run grading for a submission.
 * - Sets status to "running"
 * - Clears previous gradePct/feedback
 * - Applies new results
 */
export async function runGrading(submissionId) {
  const submission = await prisma.submission.findUnique({ where: { id: submissionId } });
  if (!submission) return;

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
    // TODO: integrate real grading (container exec, queue, etc.)
    const passed = true;
    const gradePct = 100;

    await prisma.submission.update({
      where: { id: submissionId },
      data: {
        status: passed ? 'passed' : 'failed',
        passed,
        gradePct,
        feedback: 'Auto-graded (mock). Replace runGrading() with real runner.'
      }
    });
  } catch (e) {
    console.error('[teacher-course-lab] Grading failed:', e?.message || e);
    await prisma.submission.update({
      where: { id: submissionId },
      data: {
        status: 'failed',
        passed: false,
        feedback: 'Grading failed. See server logs.'
      }
    });
  }
}
