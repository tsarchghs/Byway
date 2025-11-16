const BASE = process.env.TCLAB_COURSES_API_BASE || '';

async function safeFetchJson(path) {
  if (!BASE) return null;
  if (typeof fetch !== 'function') {
    console.warn('[teacher-course-lab] global fetch not available; skipping remote course lookup');
    return null;
  }
  try {
    const res = await fetch(BASE.replace(/\/$/, '') + path, {
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) {
      console.warn('[teacher-course-lab] Remote API returned', res.status, 'for', path);
      return null;
    }
    return await res.json();
  } catch (e) {
    console.warn('[teacher-course-lab] Remote API error for', path, e?.message || e);
    return null;
  }
}

/**
 * Best-effort: pull extra metadata from external course/module/lesson APIs.
 * Env: TCLAB_COURSES_API_BASE, e.g. "http://localhost:3000/api/teach-internal"
 *
 * Expected (but customizable) paths:
 *  - /courses/:courseId
 *  - /modules/:moduleId
 *  - /lessons/:lessonId
 */
export async function fetchBindingMetaForChallenge(challenge) {
  if (!challenge) return null;

  const result = {};

  if (challenge.courseId) {
    result.course = await safeFetchJson(`/courses/${challenge.courseId}`);
  }
  if (challenge.moduleId) {
    result.module = await safeFetchJson(`/modules/${challenge.moduleId}`);
  }
  if (challenge.lessonId) {
    result.lesson = await safeFetchJson(`/lessons/${challenge.lessonId}`);
  }

  return result;
}
