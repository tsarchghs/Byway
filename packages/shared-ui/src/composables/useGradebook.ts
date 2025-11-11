import { ref } from 'vue';
import { useApolloClient, gql } from '@vue/apollo-composable';

const COURSE_GRADEBOOK = gql`
  query CourseGradebook($courseId: ID!) {
    courseGradebook(courseId: $courseId) {
      id assignmentId studentId courseId grade feedback updatedAt createdAt
    }
  }
`;

const UPSERT_GRADE = gql`
  mutation UpsertGrade($input: GradebookInput!) {
    upsertGrade(input: $input) {
      id assignmentId studentId courseId grade feedback updatedAt createdAt
    }
  }
`;

export function useGradebook() {
  const { client } = useApolloClient();
  const rows = ref<any[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchGradebook(courseId: string) {
    loading.value = true;
    try {
      const { data } = await client.query({
        query: COURSE_GRADEBOOK,
        variables: { courseId },
        fetchPolicy: 'network-only',
        context: { uri: '/api/students-internal/graphql' },
      });
      rows.value = data?.courseGradebook || [];
      error.value = null;
    } catch (e:any) {
      error.value = e?.message || String(e);
    } finally {
      loading.value = false;
    }
  }

  async function upsertGrade(input: any) {
    const { data } = await client.mutate({
      mutation: UPSERT_GRADE,
      variables: { input },
      context: { uri: '/api/students-internal/graphql' },
    });
    return data?.upsertGrade;
  }

  return { rows, loading, error, fetchGradebook, upsertGrade };
}
