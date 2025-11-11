<template>
  <a-layout class="p-6">
    <a-page-header
      :title="`Gradebook · ${courseId}`"
      @back="$router.back()"
      :breadcrumb="{ routes: [
        { path: '/', breadcrumbName: 'Home' },
        { path: '/students', breadcrumbName: 'Students' },
        { path: $route.fullPath, breadcrumbName: 'Gradebook' }
      ] }"
    >
      <template #tags>
        <a-tag color="blue">{{ entries.length }} records</a-tag>
      </template>
      <template #extra>
        <a-space>
          <a-button @click="refresh">Refresh</a-button>
          <a-button type="primary" @click="openRubric">Rubric</a-button>
        </a-space>
      </template>
    </a-page-header>

    <a-card :bordered="false">
      <a-tabs v-model:activeKey="tab">
        <a-tab-pane key="grades" tab="Grades">
          <a-table :data-source="entries" :columns="cols" row-key="id" :loading="loading" />
        </a-tab-pane>
        <a-tab-pane key="comments" tab="Comments">
          <a-empty description="Select a row to view/add comments." v-if="!selected" />
          <div v-else class="space-y-3">
            <a-input-textarea v-model:value="commentText" :rows="4" placeholder="Add a comment..." />
            <a-space>
              <a-button type="primary" @click="saveComment" :disabled="!commentText">Save</a-button>
              <a-button @click="commentText=''">Clear</a-button>
            </a-space>
          </div>
        </a-tab-pane>
        <a-tab-pane key="rubric" tab="Rubric">
          <a-empty description="Attach a rubric to guide grading." />
        </a-tab-pane>
      </a-tabs>
    </a-card>

    <a-drawer v-model:open="rubricOpen" title="Rubric" placement="right" width="420">
      <a-alert type="info" message="Provide a JSON rubric, e.g., [{label:'Code',weight:0.5},{label:'Report',weight:0.5}]" show-icon class="mb-2" />
      <a-textarea v-model:value="rubricJson" :rows="10" />
      <div class="mt-2"><a-button type="primary" @click="saveRubric">Save</a-button></div>
    </a-drawer>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from '#imports'
import { useGradebook } from '~/packages/shared-ui/src/composables/useGradebook'

definePageMeta({ middleware: ['role'], roles: ['teacher'] })

const route = useRoute()
const router = useRouter()
const courseId = computed(() => String(route.query.courseId ?? route.params.id ?? 'unknown'))

const { courseGradebook, upsertGrade } = useGradebook()
const loading = ref(false)
const entries = ref<any[]>([])
const selected = ref<any | null>(null)
const tab = ref('grades')

const cols = [
  { title: 'Student', dataIndex: 'studentId' },
  { title: 'Assignment', dataIndex: 'assignmentId' },
  { title: 'Grade', dataIndex: 'grade', customRender: ({ text, record }: any) => text ?? '—' },
  { title: 'Feedback', dataIndex: 'feedback' },
  { title: 'Updated', dataIndex: 'updatedAt' },
]

async function refresh(){
  loading.value = true
  try {
    entries.value = await courseGradebook(courseId.value)
  } finally {
    loading.value = false
  }
}

function openRubric(){ rubricOpen.value = true }
const rubricOpen = ref(false)
const rubricJson = ref('[]')
function saveRubric(){ rubricOpen.value = false }

const commentText = ref('')
async function saveComment(){
  if(!selected.value) return
  await upsertGrade({ assignmentId: selected.value.assignmentId, studentId: selected.value.studentId, courseId: selected.value.courseId, grade: selected.value.grade ?? null, feedback: commentText.value })
  commentText.value = ''
  await refresh()
}

onMounted(refresh)
</script>
