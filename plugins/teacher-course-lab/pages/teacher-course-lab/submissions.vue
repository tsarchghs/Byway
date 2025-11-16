<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { message } from 'ant-design-vue'

const loading = ref(false)
const items = ref<any[]>([])

const rerunLoading = ref<Record<string, boolean>>({})

// Drawer state for per-session history
const drawerOpen = ref(false)
const drawerLoading = ref(false)
const activeSessionId = ref<string | null>(null)
const activeSession = ref<any | null>(null)

async function load() {
  loading.value = true
  try {
    const res = await fetch('/api/teacher-course-lab/teacher/submissions')
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data?.error || 'Failed to load submissions')
    }
    items.value = (data.items || []).map((row: any) => ({
      ...row,
      bindings: [row.courseId, row.moduleId, row.lessonId].filter(Boolean).join(' / '),
      createdAtFormatted: row.createdAt ? new Date(row.createdAt).toLocaleString() : ''
    }))
  } catch (e: any) {
    console.error(e)
    message.error(e?.message || 'Failed to load submissions')
  } finally {
    loading.value = false
  }
}

// Build Ant Design filters dynamically from loaded data
const columns = computed(() => {
  const challengeSet = new Set<string>()
  const statusSet = new Set<string>()

  items.value.forEach(row => {
    if (row.challengeTitle) challengeSet.add(row.challengeTitle)
    if (row.status) statusSet.add(row.status)
  })

  const challengeFilters = Array.from(challengeSet).map(label => ({
    text: label,
    value: label
  }))
  const statusFilters = Array.from(statusSet).map(label => ({
    text: label,
    value: label
  }))

  return [
    {
      title: 'Challenge',
      dataIndex: 'challengeTitle',
      key: 'challengeTitle',
      filters: challengeFilters,
      onFilter: (value: string, record: any) => record.challengeTitle === value
    },
    {
      title: 'Student',
      dataIndex: 'sessionUserId',
      key: 'student'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: statusFilters,
      onFilter: (value: string, record: any) => record.status === value
    },
    {
      title: 'Grade %',
      dataIndex: 'gradePct',
      key: 'gradePct'
    },
    {
      title: 'Difficulty',
      dataIndex: 'difficulty',
      key: 'difficulty'
    },
    {
      title: 'Bindings',
      dataIndex: 'bindings',
      key: 'bindings'
    },
    {
      title: 'Submitted',
      dataIndex: 'createdAtFormatted',
      key: 'createdAt'
    }
  ]
})

// Row click → open drawer with submission history for that session
async function rerunSubmission(record: any) {
  if (!record?.id) return
  const id = record.id as string
  rerunLoading.value = { ...rerunLoading.value, [id]: true }

  try {
    const res = await fetch(`/api/teacher-course-lab/teacher/submissions/${id}/rerun`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data?.error || 'Failed to re-run grading')
    }
    message.success('Grading re-run triggered')
    await load()
  } catch (e: any) {
    console.error(e)
    message.error(e?.message || 'Failed to re-run grading')
  } finally {
    rerunLoading.value = { ...rerunLoading.value, [id]: false }
  }
}

async function handleRowClick(record: any) {
  if (!record?.sessionId) return
  activeSessionId.value = record.sessionId
  drawerOpen.value = true
  drawerLoading.value = true
  activeSession.value = null

  try {
    const res = await fetch(`/api/teacher-course-lab/teacher/submissions/session/${record.sessionId}`)
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data?.error || 'Failed to load session history')
    }
    const session = data.session
    if (session) {
      // Format submissions a bit
      session.submissions = (session.submissions || []).map((sub: any) => ({
        ...sub,
        createdAtFormatted: sub.createdAt ? new Date(sub.createdAt).toLocaleString() : '',
        updatedAtFormatted: sub.updatedAt ? new Date(sub.updatedAt).toLocaleString() : ''
      }))
    }
    activeSession.value = session
  } catch (e: any) {
    console.error(e)
    message.error(e?.message || 'Failed to load session history')
  } finally {
    drawerLoading.value = false
  }
}

const drawerTitle = computed(() => {
  if (!activeSession.value) return 'Submission history'
  return `Submission history · ${activeSession.value.challenge?.title || 'Challenge'} · Student ${activeSession.value.userId}`
})

onMounted(load)
</script>

<template>
  <div class="p-4">
    <a-page-header
      title="Teacher • Lab Submissions"
      sub-title="Review student attempts, grades, and course bindings for your challenges"
    />
    <a-card>
      <a-alert
        type="info"
        show-icon
        class="mb-3"
        message="Tip"
        description="Click any row to see the full submission history for that lab session, including all attempts and feedback."
      />
      <a-table
        :columns="columns"
        :data-source="items"
        :loading="loading"
        row-key="id"
        size="small"
        :customRow="record => ({ onClick: () => handleRowClick(record) })"
      />
    </a-card>

    <a-drawer
      v-model:open="drawerOpen"
      :width="480"
      :title="drawerTitle"
      :destroyOnClose="true"
    >
      <a-spin :spinning="drawerLoading">
        <div v-if="activeSession">
          <div class="mb-3 text-sm text-gray-700">
            <div><strong>Challenge:</strong> {{ activeSession.challenge?.title }}</div>
            <div><strong>Student:</strong> {{ activeSession.userId }}</div>
            <div>
              <strong>Bindings:</strong>
              <span v-if="activeSession.challenge?.courseId">Course {{ activeSession.challenge.courseId }}</span>
              <span v-if="activeSession.challenge?.moduleId"> · Module {{ activeSession.challenge.moduleId }}</span>
              <span v-if="activeSession.challenge?.lessonId"> · Lesson {{ activeSession.challenge.lessonId }}</span>
            </div>
          </div>
          <a-timeline>
            <a-timeline-item
              v-for="sub in activeSession.submissions"
              :key="sub.id"
            >
              <div>
                <strong>Status:</strong> {{ sub.status }}
                <span v-if="sub.gradePct !== null && sub.gradePct !== undefined">
                  · <strong>Grade:</strong> {{ sub.gradePct }}%
                </span>
              </div>
              <div class="text-xs text-gray-600">
                <span>Created: {{ sub.createdAtFormatted }}</span>
                <span v-if="sub.updatedAtFormatted"> · Updated: {{ sub.updatedAtFormatted }}</span>
              </div>
              <div v-if="sub.feedback" class="mt-1 text-sm">
                <strong>Feedback:</strong> {{ sub.feedback }}
              </div>
            </a-timeline-item>
          </a-timeline>
          <div v-if="!activeSession.submissions || !activeSession.submissions.length" class="text-sm text-gray-500">
            No submissions for this session yet.
          </div>
        </div>
        <div v-else class="text-sm text-gray-500">
          No session selected.
        </div>
      </a-spin>
    </a-drawer>
  </div>
</template>
