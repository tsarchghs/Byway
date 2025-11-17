const BASE = process.env.TCLAB_COURSES_API_BASE || 'http://localhost:4000/api/teach-internal';

/**
 * Fetch data via GraphQL if available, otherwise fall back to REST
 */
async function safeFetchJson(path) {
  if (!BASE) return null;
  if (typeof fetch !== 'function') {
    console.warn('[teacher-course-lab] global fetch not available; skipping remote course lookup');
    return null;
  }
  try {
    const res = await fetch(BASE.replace(/\/$/, '') + path, {
      headers: { 'Accept': 'application/json' },
      credentials: 'include'
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
 * Normalize REST responses from teach-internal (which wrap payload in { success, data })
 */
async function safeTeachData(path) {
  const json = await safeFetchJson(path);
  if (!json) return null;
  if (typeof json === 'object' && json !== null && 'data' in json) {
    return json.data;
  }
  return json;
}

/**
 * Fetch lesson data via GraphQL
 */
async function fetchLessonViaGraphQL(lessonId) {
  const graphqlEndpoint = BASE.replace(/\/$/, '') + '/graphql';
  
  const query = `
    query GetLesson($id: String!) {
      lesson(id: $id) {
        id
        title
        type
        duration
        content
        videoUrl
        rubric
        metadata
      }
    }
  `;

  try {
    const res = await fetch(graphqlEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        query,
        variables: { id: lessonId }
      })
    });

    if (!res.ok) {
      console.warn('[teacher-course-lab] GraphQL returned', res.status);
      return null;
    }

    const json = await res.json();
    if (json.errors) {
      console.warn('[teacher-course-lab] GraphQL errors:', json.errors);
      return null;
    }

    return json.data?.lesson || null;
  } catch (e) {
    console.warn('[teacher-course-lab] GraphQL error:', e?.message || e);
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
    result.course = await safeTeachData(`/courses/${challenge.courseId}`);
  }
  if (challenge.moduleId) {
    result.module = await safeTeachData(`/modules/${challenge.moduleId}`);
  }
  if (challenge.lessonId) {
    // Try GraphQL first (better for metadata), then REST fallback
    const lesson = await fetchLessonViaGraphQL(challenge.lessonId);
    if (lesson) {
      result.lesson = lesson;
    } else {
      // Fallback to REST
      result.lesson = await safeTeachData(`/lessons/${challenge.lessonId}`);
    }
  }

  if (result.lesson && typeof result.lesson.metadata === 'string') {
    try {
      result.lesson.metadata = JSON.parse(result.lesson.metadata);
    } catch (_) {
      // ignore parse failure
    }
  }

  return result;
}

/**
 * Fetch lesson/module/course context for a given lesson ID.
 * Used when we only know the lesson identifier (e.g. student requests).
 */
export async function fetchLessonContextById(lessonId) {
  if (!lessonId) return null;

  let lesson = await fetchLessonViaGraphQL(lessonId);
  if (!lesson) {
    lesson = await safeTeachData(`/lessons/${lessonId}`);
  }
  if (lesson && typeof lesson.metadata === 'string') {
    try {
      lesson.metadata = JSON.parse(lesson.metadata);
    } catch (_) {
      // ignore parse error
    }
  }
  if (!lesson) return null;

  let module = null;
  if (lesson.moduleId) {
    module = await safeTeachData(`/modules/${lesson.moduleId}`);
  }

  let course = null;
  const courseId = module?.courseId || lesson.courseId;
  if (courseId) {
    course = await safeTeachData(`/courses/${courseId}`);
  }

  return { lesson, module, course };
}
