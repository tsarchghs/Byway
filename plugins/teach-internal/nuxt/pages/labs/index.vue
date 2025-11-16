<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { message } from 'ant-design-vue'

const loading = ref(false)
const submissions = ref<any[]>([])

const columns = [
  { title: 'Challenge', dataIndex: 'challengeTitle', key: 'challengeTitle' },
  { title: 'Student', dataIndex: 'sessionUserId', key: 'student' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
  { title: 'Grade %', dataIndex: 'gradePct', key: 'gradePct' },
  { title: 'Bindings', dataIndex: 'bindings', key: 'bindings' },
  { title: 'Submitted', dataIndex: 'createdAtFormatted', key: 'createdAt' }
]

const totalStudents = computed(() => {
  const ids = new Set(submissions.value.map(s => s.sessionUserId))
  return ids.size
})

const averageGrade = computed(() => {
  const graded = submissions.value.filter(s => typeof s.gradePct === 'number')
  if (!graded.length) return null
  const sum = graded.reduce((acc, s) => acc + (s.gradePct || 0), 0)
  return Math.round((sum / graded.length) * 10) / 10
})

async function load() {
  loading.value = true
  try {
    const res = await fetch('/api/teacher-course-lab/teacher/submissions')
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data?.error || 'Failed to load lab submissions')
    }
    submissions.value = (data.items || []).map((row: any) => ({
      ...row,
      bindings: [row.courseId, row.moduleId, row.lessonId].filter(Boolean).join(' / '),
      createdAtFormatted: row.createdAt ? new Date(row.createdAt).toLocaleString() : ''
    }))
  } catch (e: any) {
    console.error(e)
    message.error(e?.message || 'Failed to load lab submissions')
  } finally {
    loading.value = false
  }
}

const hasSubmissions = computed(() => submissions.value.length > 0)

onMounted(load)
</script>

<template>
  <div class="p-4">
    <a-page-header
      title="Labs Overview"
      sub-title="Monitor CS50-style labs across your courses"
    />
    <a-row :gutter="16">
      <a-col :xs="24" :md="8">
        <a-card>
          <div class="text-sm text-gray-700">
            <div><strong>Total submissions:</strong> {{ submissions.length }}</div>
            <div><strong>Unique students:</strong> {{ totalStudents }}</div>
            <div v-if="averageGrade !== null">
              <strong>Average grade:</strong> {{ averageGrade }}%
            </div>
            <div v-else class="text-xs text-gray-500">
              No graded submissions yet.
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :xs="24" :md="16">
        <a-card title="Latest lab submissions" :loading="loading">
          <a-empty v-if="!loading && !hasSubmissions" description="No lab submissions yet." />
          <a-table
            v-else
            :columns="columns"
            :data-source="submissions"
            :loading="loading"
            row-key="id"
            size="small"
          />
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
