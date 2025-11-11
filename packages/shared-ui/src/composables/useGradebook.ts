import gql from 'graphql-tag';

const API = (path: string) => `${process.env.API_BASE_URL || 'http://localhost:4000'}${path}`;

export function useGradebook() {
  async function courseGradebook(courseId: string) {
    const q = gql`query($courseId: ID!) {
      courseGradebook(courseId: $courseId) {
        id assignmentId studentId courseId grade feedback updatedAt
      }
    }`;
    const r = await fetch(API('/api/students-internal/graphql'), {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ query: q.loc?.source.body, variables: { courseId } })
    });
    const j = await r.json();
    if (j.errors) throw new Error(j.errors[0]?.message || 'GraphQL error');
    return j.data.courseGradebook;
  }

  async function upsertGrade(input: { assignmentId: string, studentId: string, courseId: string, grade?: number, feedback?: string }) {
    const m = gql`mutation($input: GradebookInput!) {
      upsertGrade(input:$input){ id assignmentId studentId courseId grade feedback updatedAt }
    }`;
    const r = await fetch(API('/api/students-internal/graphql'), {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ query: m.loc?.source.body, variables: { input } })
    });
    const j = await r.json();
    if (j.errors) throw new Error(j.errors[0]?.message || 'GraphQL error');
    return j.data.upsertGrade;
  }

  return { courseGradebook, upsertGrade };
}
