<script setup lang="ts">
import { ref, onMounted, h } from 'vue'
import { message } from 'ant-design-vue'

const challengeId = ref('')
const session = ref<any | null>(null)
const starting = ref(false)

const loadingSessions = ref(false)
const sessions = ref<any[]>([])

const sessionColumns = [
  { title: 'Challenge', dataIndex: ['challenge', 'title'], key: 'challenge' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
  { 
    title: 'Code-Server', 
    key: 'codeServer',
    customRender: ({ record }: any) => {
      if (record.codeServerUrl) {
        return h('a', { href: record.codeServerUrl, target: '_blank' }, 'Open')
      }
      return h('span', { style: 'color: #999' }, 'Not started')
    }
  },
  { title: 'Last Result', dataIndex: ['lastSubmission', 'status'], key: 'lastStatus' },
  { title: 'Grade %', dataIndex: ['lastSubmission', 'gradePct'], key: 'gradePct' },
  { title: 'Attempts', dataIndex: 'attempts', key: 'attempts' },
  { title: 'Started', dataIndex: 'createdAt', key: 'createdAt' }
]

async function loadSessions() {
  loadingSessions.value = true
  try {
    const res = await fetch('http://localhost:4000/api/teacher-course-lab/sessions/me',
      {
        headers: {
          Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWh5dmN4cjgwMDAwdHcwa3JyODR5eHk4IiwiaWF0IjoxNzYzMTI1NTc1LCJleHAiOjE3NjM3MzAzNzV9.Q7ZrBeM8oZlFUQLKp5YtJsObOQ9AeChhXV3ZXc6797U"
        }
      }
    )
    if (!res.ok) throw new Error(await res.text())
    const data = await res.json()
    sessions.value = (data.sessions || []).map((s: any) => {
      const last = (s.submissions && s.submissions[0]) || null
      return {
        ...s,
        lastSubmission: last,
        attempts: s.submissions ? s.submissions.length : 0
      }
    })
  } catch (e: any) {
    console.error(e)
    message.error(e?.message || 'Failed to load sessions')
  } finally {
    loadingSessions.value = false
  }
}

async function startSession() {
  if (!challengeId.value) return message.warn('Enter a challenge ID to start')

  starting.value = true
  try {
    const res = await fetch('http://localhost:4000/api/teacher-course-lab/session/start', {
      method: 'POST',
      headers: { Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWh5dmN4cjgwMDAwdHcwa3JyODR5eHk4IiwiaWF0IjoxNzYzMTI1NTc1LCJleHAiOjE3NjM3MzAzNzV9.Q7ZrBeM8oZlFUQLKp5YtJsObOQ9AeChhXV3ZXc6797U", 'Content-Type': 'application/json' },
      body: JSON.stringify({ challengeId: challengeId.value })
    })
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data?.error || 'Failed to start lab session')
    }
    session.value = data.session
    message.success('Lab session started')
    await loadSessions()
  } catch (e: any) {
    console.error(e)
    message.error(e?.message || 'Failed to start lab session')
  } finally {
    starting.value = false
  }
}

onMounted(() => {
  loadSessions()
})
</script>

<template>
  <div class="p-4">
    <a-page-header
      title="Student • Course Labs"
      sub-title="Start a lab session, open code-server, and review your progress"
    />

    <a-row :gutter="16">
      <a-col :xs="24" :md="10">
        <a-card title="Start new lab session">
          <p class="mb-2 text-sm text-gray-600">
            Paste a challenge ID assigned by your teacher to start a new lab session.
          </p>
          <a-input
            v-model:value="challengeId"
            placeholder="Enter Challenge ID"
            style="max-width: 320px"
          />
          <a-button
            :loading="starting"
            class="ml-2 mt-2"
            type="primary"
            @click="startSession"
          >
            Start Session
          </a-button>

          <div v-if="session" class="mt-4">
            <a-result status="success" title="Session started">
              <template #extra>
                <div class="mb-2">
                  <strong>Session ID:</strong>
                  <a-typography-paragraph
                    style="display:inline-block;margin-left:4px;"
                    copyable
                    :content="session.id"
                  />
                </div>
                <div v-if="session.codeServerUrl" class="mb-2">
                  <strong>Code-Server URL:</strong>
                  <a-typography-paragraph
                    style="display:inline-block;margin-left:4px;"
                    copyable
                    :content="session.codeServerUrl"
                  />
                </div>
                <a-button
                  v-if="session.codeServerUrl"
                  type="primary"
                  :href="session.codeServerUrl"
                  target="_blank"
                >
                  Open code-server in new tab
                </a-button>
              </template>
            </a-result>
          </div>
        </a-card>
      </a-col>

      <a-col :xs="24" :md="14">
        <a-card title="My lab sessions">
          <a-table
            :columns="sessionColumns"
            :data-source="sessions"
            :loading="loadingSessions"
            size="small"
            row-key="id"
          />
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
