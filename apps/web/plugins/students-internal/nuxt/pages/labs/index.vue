<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { message } from 'ant-design-vue'

const loading = ref(false)
const sessions = ref<any[]>([])

const columns = [
  { title: 'Challenge', dataIndex: ['challenge', 'title'], key: 'challenge' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
  { title: 'Last Result', dataIndex: ['lastSubmission', 'status'], key: 'lastStatus' },
  { title: 'Grade %', dataIndex: ['lastSubmission', 'gradePct'], key: 'gradePct' },
  { title: 'Attempts', dataIndex: 'attempts', key: 'attempts' },
  { title: 'Course Binding', dataIndex: 'binding', key: 'binding' },
  { title: 'Started', dataIndex: 'createdAtFormatted', key: 'createdAt' }
]

async function load() {
  loading.value = true
  try {
    const res = await fetch('/api/teacher-course-lab/sessions/me')
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data?.error || 'Failed to load lab sessions')
    }
    sessions.value = (data.sessions || []).map((s: any) => {
      const last = (s.submissions && s.submissions[0]) || null
      const c = s.challenge || {}
      return {
        ...s,
        lastSubmission: last,
        attempts: s.submissions ? s.submissions.length : 0,
        binding: [c.courseId, c.moduleId, c.lessonId].filter(Boolean).join(' / '),
        createdAtFormatted: s.createdAt ? new Date(s.createdAt).toLocaleString() : ''
      }
    })
  } catch (e: any) {
    console.error(e)
    message.error(e?.message || 'Failed to load lab sessions')
  } finally {
    loading.value = false
  }
}

const hasSessions = computed(() => sessions.value.length > 0)

onMounted(load)
</script>

<template>
  <div class="p-4">
    <a-page-header
      title="My Labs & Projects"
      sub-title="CS50-style labs connected to your courses and modules"
    />
    <a-row :gutter="16">
      <a-col :xs="24" :md="15">
        <a-card title="Lab sessions" :loading="loading">
          <a-empty v-if="!loading && !hasSessions" description="No lab sessions yet. Ask your teacher for a challenge ID." />
          <a-table
            v-else
            :columns="columns"
            :data-source="sessions"
            :loading="loading"
            size="small"
            row-key="id"
          />
        </a-card>
      </a-col>
      <a-col :xs="24" :md="9">
        <a-card title="How labs work">
          <p class="text-sm text-gray-600 mb-2">
            Labs run in a dedicated code-server instance, managed by the <strong>teacher-course-lab</strong> plugin.
          </p>
          <ul class="text-sm text-gray-700 mb-2">
            <li>1. Your teacher gives you a challenge ID.</li>
            <li>2. You start a session from the labs page in the platform.</li>
            <li>3. Code, run tests, and submit your work.</li>
          </ul>
          <p class="text-xs text-gray-500">
            This page reuses the teacher-course-lab plugin through its public REST API and keeps everything student-facing in the students-internal plugin.
          </p>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
