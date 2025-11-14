<template>
  <a-config-provider :theme="{ algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm }">
    <a-layout class="classroom-wrap" :class="{ 'is-dark': isDark }" data-test-id="classroom-wrap">
      <!-- GLOBAL STATUS BANNERS -->
      <div class="global-banners">
        <a-alert
          v-if="!isOnline"
          type="warning"
          banner
          show-icon
          message="You're offline. Some actions are disabled; data may be stale."
          data-test-id="offline-banner"
        />
        <a-alert
          v-if="usingMocks"
          type="info"
          banner
          show-icon
          :message="`Mock data active${mockReason ? ` · ${mockReason}` : ''}`"
          data-test-id="mock-banner"
        />
        <a-alert
          v-if="!me"
          type="warning"
          banner
          show-icon
          message="Please sign in to see your assignments and submissions."
        />
      </div>

      <!-- HEADER -->
      <a-page-header
        class="page-header"
        :title="classroomTitle"
        :sub-title="classroomSubtitle"
        data-test-id="classroom-header"
      >
        <template #tags>
          <a-tag color="blue">{{ courseMeta.category || '—' }}</a-tag>
          <a-tag color="gold">{{ courseMeta.difficulty || '—' }}</a-tag>
          <a-tag v-if="dateRangeLabel" color="blue">
            <FieldTimeOutlined /> {{ dateRangeLabel }}
          </a-tag>
          <a-badge :status="isOnline ? 'processing' : 'default'" :text="isOnline ? t('Online') : t('Offline')" />
          <a-badge
            :status="usingMocks ? 'warning' : 'success'"
            :text="usingMocks ? t('Mock') : t('Live')"
            class="ml-1"
          />
        </template>

        <template #extra>
          <a-space wrap>
            <a-tooltip :title="t('Toggle dark mode')">
              <a-button type="default" @click="isDark = !isDark">
                <template #icon><BgColorsOutlined /></template>
              </a-button>
            </a-tooltip>

            <a-tooltip :title="t('Back to classrooms')">
              <a-button type="default" @click="goBack">
                <template #icon><ArrowLeftOutlined /></template>
                {{ t('Classrooms') }}
              </a-button>
            </a-tooltip>
          </a-space>
        </template>
      </a-page-header>

      <!-- CONTENT (no roster/teacher UI) -->
      <a-layout>
        <a-layout-content class="content" data-test-id="classroom-content">
          <div class="content-inner">
            <!-- Top stats -->
            <a-row :gutter="16" class="mb-4">
              <a-col :xs="24" :sm="12" :lg="6">
                <a-statistic
                  :title="t('Total assignments')"
                  :value="rows.length"
                  data-test-id="stat-assignments"
                />
              </a-col>
              <a-col :xs="24" :sm="12" :lg="6">
                <a-statistic
                  :title="t('My submissions')"
                  :value="mySubs.length"
                  data-test-id="stat-submissions"
                />
              </a-col>
              <a-col :xs="24" :sm="12" :lg="6">
                <a-statistic
                  :title="t('Graded')"
                  :value="gradedCount"
                  data-test-id="stat-graded"
                />
              </a-col>
              <a-col :xs="24" :sm="12" :lg="6">
                <a-statistic
                  :title="t('Average grade')"
                  :value="avgGrade"
                  suffix="%"
                  data-test-id="stat-avg-grade"
                />
              </a-col>
            </a-row>

            <!-- Status alert -->
            <div v-if="statusMessage" class="mb-4">
              <a-alert
                :message="statusMessage"
                :type="statusType"
                closable
                @close="statusMessage = ''"
                data-test-id="status-alert"
              />
            </div>

            <!-- Assignments + My Submissions + Right sidebar -->
            <a-row :gutter="16">
              <a-col :xs="24" :lg="14">
                <!-- Assignments -->
                <a-card
                  :title="t('My assignments')"
                  class="mb-4"
                  :bordered="false"
                  data-test-id="card-assignments"
                >
                  <template #extra>
                    <a-space>
                      <a-input-search
                        v-model:value="searchText"
                        :placeholder="t('Search assignments...')"
                        style="width: 200px"
                        data-test-id="assign-search"
                      />
                      <a-select
                        v-model:value="filterStatus"
                        style="width: 160px"
                        :placeholder="t('Filter by status')"
                        data-test-id="assign-status-filter"
                      >
                        <a-select-option value="">{{ t('All statuses') }}</a-select-option>
                        <a-select-option value="open">{{ t('Open') }}</a-select-option>
                        <a-select-option value="late">{{ t('Late window') }}</a-select-option>
                        <a-select-option value="closed">{{ t('Closed') }}</a-select-option>
                      </a-select>
                    </a-space>
                  </template>

                  <a-empty
                    v-if="!filteredAssignments.length"
                    :description="t('No assignments found')"
                  />

                  <a-list
                    v-else
                    :data-source="filteredAssignments"
                    class="assignment-list"
                  >
                    <template #renderItem="{ item }">
                      <a-list-item :key="item.id" class="assignment-row">
                        <a-card
                          :bordered="false"
                          :body-style="{ padding: '14px' }"
                          class="w-full"
                        >
                          <div class="ass-row">
                            <div class="ass-main">
                              <div class="ass-title-line">
                                <h3 class="ass-title">
                                  {{ item.title }}
                                </h3>
                                <a-tag :color="getStatusColor(item)">
                                  {{ getStatusLabel(item) }}
                                </a-tag>
                                <a-tag
                                  v-if="getSubmissionForAssignment(item.id)"
                                  color="green"
                                >
                                  {{ t('Submitted') }}
                                </a-tag>
                              </div>
                              <p class="ass-desc">
                                {{ item.description }}
                              </p>
                              <a-space size="small" class="ass-meta">
                                <span>
                                  📅
                                  {{ t('Due') }}:
                                  {{ item.dueDate ? formatDate(item.dueDate) : t('N/A') }}
                                </span>
                                <a-divider type="vertical" />
                                <span>
                                  🔄
                                  {{ t('Attempts left') }}:
                                  {{ attemptsLeft(item) }}
                                </span>
                                <a-divider type="vertical" />
                                <span v-if="getSubmissionForAssignment(item.id)?.grade">
                                  ⭐
                                  {{ t('Grade') }}:
                                  {{ getSubmissionForAssignment(item.id).grade }}%
                                </span>
                              </a-space>
                            </div>
                            <div class="ass-actions">
                              <a-button
                                type="primary"
                                size="small"
                                @click="openSubmitModal(item)"
                                :disabled="isAssignmentClosed(item) || !studentId"
                                data-test-id="btn-submit-assignment"
                              >
                                {{ isAssignmentClosed(item) ? t('Closed') : t('Submit') }}
                              </a-button>
                              <a-button
                                v-if="getSubmissionForAssignment(item.id)"
                                size="small"
                                @click="openDetailsDrawerByAssignment(item)"
                              >
                                {{ t('View details') }}
                              </a-button>
                            </div>
                          </div>
                        </a-card>
                      </a-list-item>
                    </template>
                  </a-list>
                </a-card>

                <!-- My submissions -->
                <a-card
                  :title="t('My submissions')"
                  :bordered="false"
                  data-test-id="card-submissions"
                >
                  <a-empty
                    v-if="!mySubs.length"
                    :description="t('No submissions yet')"
                    data-test-id="no-subs"
                  />
                  <a-table
                    v-else
                    :data-source="mySubs"
                    :columns="submissionColumns"
                    row-key="id"
                    :pagination="{ pageSize: 10 }"
                    size="small"
                  >
                    <template #bodyCell="{ column, record }">
                      <template v-if="column.key === 'assignment'">
                        <span>
                          {{
                            rows.find((r) => r.id === record.assignmentId)?.title ||
                            record.assignmentId
                          }}
                        </span>
                      </template>
                      <template v-else-if="column.key === 'submittedAt'">
                        <span>{{ formatDate(record.submittedAt) }}</span>
                      </template>
                      <template v-else-if="column.key === 'status'">
                        <a-tag :color="record.grade != null ? 'green' : 'blue'">
                          {{ record.grade != null ? t('Graded') : t('Pending') }}
                        </a-tag>
                      </template>
                      <template v-else-if="column.key === 'grade'">
                        <span>
                          {{ record.grade != null ? `${record.grade}%` : '—' }}
                        </span>
                      </template>
                      <template v-else-if="column.key === 'actions'">
                        <a-space>
                          <a-button
                            type="link"
                            size="small"
                            @click="openDetailsDrawer(record)"
                          >
                            {{ t('View') }}
                          </a-button>
                          <a-popconfirm
                            :title="t('Delete this submission?')"
                            @confirm="deleteSubmission(record.id)"
                          >
                            <a-button type="link" size="small" danger>
                              {{ t('Delete') }}
                            </a-button>
                          </a-popconfirm>
                        </a-space>
                      </template>
                    </template>
                  </a-table>
                </a-card>
              </a-col>

              <!-- RIGHT SIDER CONTENT -->
              <a-col :xs="24" :lg="10">
                <a-card class="right-card" :bordered="false" body-style="padding:0;">
                  <div class="right-inner">
                    <a-tabs v-model:activeKey="rightTab" size="small" :animated="false" data-test-id="right-tabs">
                      <!-- A · Progress -->
                      <a-tab-pane :key="'progress'" :tab="t('Progress')">
                        <div class="tab-pane-inner">
                          <a-card size="small" :title="t('Per-assignment progress')" :bordered="false">
<a-steps
  direction="vertical"
  size="small"
  :current="stepsCurrentIndex ?? 0"
>
                              <a-step
                                v-for="(a, idx) in rows"
                                :key="a.id"
                                :title="a.title"
                                :description="stepDescriptionFor(a)"
                                :status="stepStatusFor(a, idx)"
                              />
                            </a-steps>
                          </a-card>
                          <a-divider />
                          <a-card size="small" :bordered="false" :title="t('Overall completion')">
                            <a-progress :percent="progressPercent" status="active" data-test-id="progress-percent" />
                            <p class="muted text-xs mt-1">
                              {{ t('Based on assignments with at least one submission.') }}
                            </p>
                          </a-card>
                        </div>
                      </a-tab-pane>

                      <!-- F · Deadlines -->
                      <a-tab-pane :key="'deadlines'" :tab="t('Deadlines')">
                        <div class="tab-pane-inner">
                          <a-card size="small" :bordered="false" :title="t('Upcoming & past deadlines')">
                            <a-empty v-if="!rows.length" :description="t('No assignments scheduled')" />
                            <a-timeline v-else>
                              <a-timeline-item
                                v-for="a in sortedByDue"
                                :key="a.id"
                                :color="timelineColorFor(a)"
                              >
                                <div class="timeline-row">
                                  <div class="timeline-main">
                                    <b>{{ a.title }}</b>
                                    <p class="muted text-xs">
                                      {{ a.description?.slice(0, 120) || t('No description') }}
                                    </p>
                                  </div>
                                  <div class="timeline-meta">
                                    <span>
                                      <ClockCircleOutlined /> {{ t('Due') }}:
                                      {{ a.dueDate ? formatDate(a.dueDate) : t('N/A') }}
                                    </span>
                                    <span v-if="a.acceptUntil" class="muted text-xs">
                                      {{ t('Accept until') }}: {{ formatDate(a.acceptUntil) }}
                                    </span>
                                    <span class="muted text-xs">{{ getStatusLabel(a) }}</span>
                                  </div>
                                </div>
                              </a-timeline-item>
                            </a-timeline>
                          </a-card>
                        </div>
                      </a-tab-pane>

                      <!-- G · Submissions summary -->
                      <a-tab-pane :key="'subs'" :tab="t('Submissions')">
                        <div class="tab-pane-inner">
                          <a-card size="small" :bordered="false" :title="t('Recent submissions')">
                            <a-empty v-if="!mySubs.length" :description="t('No submissions yet')" />
                            <a-list v-else :data-source="mySubs.slice(0, 10)" size="small">
                              <template #renderItem="{ item }">
                                <a-list-item :key="item.id">
                                  <a-list-item-meta
                                    :title="rows.find((r) => r.id === item.assignmentId)?.title || item.assignmentId"
                                    :description="formatDate(item.submittedAt)"
                                  >
                                    <template #avatar>
                                      <a-avatar size="small"><FileTextOutlined /></a-avatar>
                                    </template>
                                  </a-list-item-meta>
                                  <template #actions>
                                    <a-tag :color="item.grade != null ? 'green' : 'blue'">
                                      {{ item.grade != null ? `${item.grade}%` : t('Pending') }}
                                    </a-tag>
                                    <a href="javascript:void(0)" @click="openDetailsDrawer(item)">{{ t('Open') }}</a>
                                  </template>
                                </a-list-item>
                              </template>
                            </a-list>
                          </a-card>
                        </div>
                      </a-tab-pane>

                      <!-- B · Resources -->
                      <a-tab-pane :key="'resources'" :tab="t('Resources')">
                        <div class="tab-pane-inner">
                          <a-card size="small" :bordered="false" :title="t('Classroom resources')">
                            <a-empty v-if="!resources.length" :description="t('No shared resources yet')" />
                            <a-list v-else :data-source="resources" size="small">
                              <template #renderItem="{ item }">
                                <a-list-item>
                                  <a-list-item-meta :title="item.title" :description="item.description">
                                    <template #avatar>
                                      <a-avatar size="small"><BookOutlined /></a-avatar>
                                    </template>
                                  </a-list-item-meta>
                                  <template #actions>
                                    <a :href="item.url" target="_blank" rel="noopener">{{ t('Open') }}</a>
                                  </template>
                                </a-list-item>
                              </template>
                            </a-list>
                          </a-card>
                        </div>
                      </a-tab-pane>

                      <!-- C · Notes -->
                      <a-tab-pane :key="'notes'" :tab="t('Notes')">
                        <div class="tab-pane-inner">
                          <a-card size="small" :title="t('My notes for this classroom')" :bordered="false">
                            <a-form layout="vertical" @finish.prevent>
                              <a-form-item :label="t('Notes')">
                                <a-textarea
                                  v-model:value="classroomNotes"
                                  :rows="6"
                                  @change="persistNotes"
                                  data-test-id="classroom-notes"
                                />
                              </a-form-item>
                            </a-form>
                            <p class="muted text-xs">
                              {{ t('Notes are saved locally in this browser for now. Later they can sync to UserKV.') }}
                            </p>
                          </a-card>
                        </div>
                      </a-tab-pane>
                    </a-tabs>
                  </div>
                </a-card>
              </a-col>
            </a-row>
          </div>
        </a-layout-content>
      </a-layout>

      <!-- Submit modal -->
      <a-modal
        v-model:open="submitModalOpen"
        :title="t('Submit assignment')"
        @ok="submitAssignment"
        :ok-text="t('Submit')"
        :cancel-text="t('Cancel')"
        data-test-id="submit-modal"
      >
        <a-form layout="vertical">
          <a-form-item :label="t('Assignment')">
            <a-input :value="selectedAssignment?.title" disabled />
          </a-form-item>
          <a-form-item :label="t('File URL')" required>
            <a-input
              v-model:value="fileUrl"
              :placeholder="t('Enter file URL or link to your submission')"
            />
          </a-form-item>
        </a-form>
      </a-modal>

      <!-- Details drawer -->
      <a-drawer
        v-model:open="detailsDrawerOpen"
        :title="t('Submission details')"
        width="480"
        data-test-id="submission-drawer"
      >
        <a-descriptions v-if="selectedSubmission" :column="1" bordered size="small">
          <a-descriptions-item :label="t('Assignment')">
            {{ rows.find((r) => r.id === selectedSubmission.assignmentId)?.title || selectedSubmission.assignmentId }}
          </a-descriptions-item>
          <a-descriptions-item :label="t('Submitted')">
            {{ formatDate(selectedSubmission.submittedAt) }}
          </a-descriptions-item>
          <a-descriptions-item :label="t('File')">
            <a-button
              type="link"
              :href="selectedSubmission.fileUrl"
              target="_blank"
              rel="noopener"
              :disabled="!selectedSubmission.fileUrl"
            >
              {{ selectedSubmission.fileUrl ? t('Open file') : t('No file') }}
            </a-button>
          </a-descriptions-item>
          <a-descriptions-item :label="t('Status')">
            <a-tag :color="selectedSubmission.grade != null ? 'green' : 'blue'">
              {{ selectedSubmission.grade != null ? t('Graded') : t('Pending') }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item v-if="selectedSubmission.grade != null" :label="t('Grade')">
            <span class="text-lg font-bold">{{ selectedSubmission.grade }}%</span>
          </a-descriptions-item>
          <a-descriptions-item v-if="selectedSubmission.feedback" :label="t('Feedback')">
            <p class="muted">{{ selectedSubmission.feedback }}</p>
          </a-descriptions-item>
        </a-descriptions>
        <a-empty v-else :description="t('No submission selected')" />
      </a-drawer>
    </a-layout>
  </a-config-provider>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { theme } from 'ant-design-vue'
import dayjs from 'dayjs/esm/index.js'
import {
  ArrowLeftOutlined,
  BgColorsOutlined,
  FieldTimeOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  BookOutlined,
} from '@ant-design/icons-vue'
import { definePageMeta } from '#imports'
import { useRuntimeConfig } from '#app'
import { $fetch } from 'ohmyfetch'
import { useQuery } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'

// =====================================================================================
// PAGE META — STUDENT LAYOUT + CLIENT ONLY
// =====================================================================================
definePageMeta({
  layout: 'student',
  ssr: false,
})

const config = useRuntimeConfig()
const baseUrl = config.public?.apiBase || 'http://localhost:4000'
const route = useRoute()
const router = useRouter()

// =====================================================================================
// I18N (MINIMAL)
// =====================================================================================
const dict = {
  en: {
    Online: 'Online',
    Offline: 'Offline',
    'Toggle dark mode': 'Toggle dark mode',
    Classrooms: 'Classrooms',
    'Total assignments': 'Total assignments',
    'My submissions': 'My submissions',
    Graded: 'Graded',
    'Average grade': 'Average grade',
    'My assignments': 'My assignments',
    'Search assignments...': 'Search assignments...',
    'Filter by status': 'Filter by status',
    'All statuses': 'All statuses',
    Open: 'Open',
    'Late window': 'Late window',
    Closed: 'Closed',
    'No assignments found': 'No assignments found',
    Submitted: 'Submitted',
    Due: 'Due',
    'Attempts left': 'Attempts left',
    Grade: 'Grade',
    Submit: 'Submit',
    'View details': 'View details',
    'No submissions yet': 'No submissions yet',
    Pending: 'Pending',
    View: 'View',
    'Delete this submission?': 'Delete this submission?',
    Delete: 'Delete',
    Progress: 'Progress',
    'Per-assignment progress': 'Per-assignment progress',
    'Overall completion': 'Overall completion',
    'Based on assignments with at least one submission.':
      'Based on assignments with at least one submission.',
    Deadlines: 'Deadlines',
    'Upcoming & past deadlines': 'Upcoming & past deadlines',
    'No assignments scheduled': 'No assignments scheduled',
    'Accept until': 'Accept until',
    Submissions: 'Submissions',
    'Recent submissions': 'Recent submissions',
    Resources: 'Resources',
    'Classroom resources': 'Classroom resources',
    'No shared resources yet': 'No shared resources yet',
    Notes: 'Notes',
    'My notes for this classroom': 'My notes for this classroom',
    'Notes are saved locally in this browser for now. Later they can sync to UserKV.':
      'Notes saved locally (sync later).',
    'Submit assignment': 'Submit assignment',
    'Enter file URL or link to your submission':
      'Enter file URL or submission link',
    Cancel: 'Cancel',
    'Submission details': 'Submission details',
    Assignment: 'Assignment',
    Submitted: 'Submitted',
    File: 'File',
    Status: 'Status',
    Feedback: 'Feedback',
    'No submission selected': 'No submission selected',
    'Failed to load assignments': 'Failed to load assignments',
    'Failed to load submissions': 'Failed to load submissions',
    'Data loaded successfully': 'Data loaded successfully',
    'Submission successful!': 'Submission successful!',
    'Failed to submit assignment': 'Failed to submit assignment',
    'Submission deleted': 'Submission deleted',
    'Failed to delete submission': 'Failed to delete submission',
  },
}
const lang = ref<'en'>('en')
const t = (k: keyof typeof dict['en']) => dict[lang.value][k] || k

// =====================================================================================
// AUTO-DETECTED LOGGED-IN STUDENT (Q_ME)
// =====================================================================================
// ---------- MOCKED Me ----------
const meRes = ref<{ me: any } | null>(null)

// Stable mock user (simulate a logged-in student)
onMounted(() => {
  meRes.value = {
    me: {
      id: 'student-123',
      displayName: 'Alice Example',
      email: 'alice@example.com',
    },
  }
})

const me = computed(() => meRes.value?.me || null)
const studentId = computed(() => me.value?.id || '')

// =====================================================================================
// STATE
// =====================================================================================
const isDark = ref(false)
const isOnline = ref(true)
const classroomId = computed(() => String(route.params.id || ''))
const classroom = ref<any | null>(null)
const courseMeta = ref({ title: '', category: '', difficulty: '' })

// data
const rows = ref([]) // assignments
const mySubs = ref([])

// ui
const searchText = ref('')
const filterStatus = ref('')

const statusMessage = ref('')
const statusType = ref<'success' | 'error' | 'info'>('info')
const rightTab = ref<'progress' | 'deadlines' | 'subs' | 'resources' | 'notes'>(
  'progress'
)

const submitModalOpen = ref(false)
const detailsDrawerOpen = ref(false)
const selectedAssignment = ref<any | null>(null)
const selectedSubmission = ref<any | null>(null)
const fileUrl = ref('')
const classroomNotes = ref('')

// mocked resources
const resources = ref([
  { id: 'res1', title: 'Syllabus (PDF)', description: 'Course syllabus.', url: '#' },
  { id: 'res2', title: 'Starter Repo', description: 'GitHub starter project.', url: '#' },
])

// =====================================================================================
// COMPUTED
// =====================================================================================
const classroomTitle = computed(
  () => classroom.value?.name || `Classroom ${classroomId.value}`
)

const dateRangeLabel = computed(() => {
  if (!classroom.value?.startDate || !classroom.value?.endDate) return ''
  const s = dayjs(classroom.value.startDate)
  const e = dayjs(classroom.value.endDate)
  return `${s.format('MMM D, YYYY')} – ${e.format('MMM D, YYYY')}`
})

const filteredAssignments = computed(() =>
  rows.value.filter((a: any) => {
    const text = `${a.title} ${a.description}`.toLowerCase()
    const matchesText = !searchText.value || text.includes(searchText.value.toLowerCase())
    const matchesStatus =
      !filterStatus.value || filterStatus.value === getStatusValue(a)
    return matchesText && matchesStatus
  })
)

const gradedCount = computed(() => mySubs.value.filter((s: any) => s.grade != null).length)
const avgGrade = computed(() => {
  const graded = mySubs.value.filter((s: any) => s.grade != null)
  if (!graded.length) return 0
  return Math.round(graded.reduce((n, s) => n + s.grade, 0) / graded.length)
})

const progressPercent = computed(() => {
  if (!rows.value.length) return 0
  const submitted = rows.value.filter((a: any) =>
    mySubs.value.some((s: any) => s.assignmentId === a.id)
  )
  return Math.round((submitted.length / rows.value.length) * 100)
})

// =====================================================================================
// HELPERS
// =====================================================================================
const formatDate = (d: string | Date) => dayjs(d).format('MMM DD, YYYY HH:mm')

const getStatusLabel = (a: any) => {
  const now = dayjs()
  const due = a.dueDate ? dayjs(a.dueDate) : null
  const accept = a.acceptUntil ? dayjs(a.acceptUntil) : due

  if (accept && now.isAfter(accept)) return 'Closed'
  if (due && now.isAfter(due)) return 'Late Window'
  return 'Open'
}

const getStatusValue = (a: any) =>
  getStatusLabel(a).toLowerCase().replace(' window', '')

const isAssignmentClosed = (a: any) => {
  const now = dayjs()
  const accept = a.acceptUntil ? dayjs(a.acceptUntil) : a.dueDate ? dayjs(a.dueDate) : null
  return !!(accept && now.isAfter(accept))
}

const attemptsLeft = (a: any) => {
  const max = Number(a.maxAttempts ?? 1)
  const used = mySubs.value.filter((s: any) => s.assignmentId === a.id).length
  return Math.max(0, max - used)
}

const getSubmissionForAssignment = (id: string) =>
  mySubs.value.find((s: any) => s.assignmentId === id)

const notesKey = () => `byway:classroom-notes:${classroomId.value}`

// =====================================================================================
// API (AUTO MOCKED IF FAILS)
// =====================================================================================
async function loadClassroom() {
  try {
    const q = `
      query($id:String!){
        classroomById(id:$id){
          id name startDate endDate
          course { id title category difficulty }
        }
      }
    `
    const r = await $fetch(`${baseUrl}/api/teach-internal/graphql`, {
      method: 'POST',
      body: { query: q, variables: { id: classroomId.value } },
    })

    const c = r.data?.classroomById
    if (!c) throw new Error()

    classroom.value = c
    if (c.course) courseMeta.value = c.course
  } catch {
    classroom.value = {
      id: classroomId.value,
      name: `Demo classroom ${classroomId.value}`,
      startDate: dayjs().subtract(5, 'day').toISOString(),
      endDate: dayjs().add(20, 'day').toISOString(),
    }
    courseMeta.value = {
      title: 'Mock Course',
      category: 'Software',
      difficulty: 'Intermediate',
    }
  }
}

async function loadAssignments() {
  try {
    const q = `
      query($classroomId:String!){
        assignmentsByClassroom(classroomId:$classroomId){
          id title description dueDate acceptUntil maxAttempts
        }
      }
    `
    const r = await $fetch(`${baseUrl}/api/teach-internal/graphql`, {
      method: 'POST',
      body: { query: q, variables: { classroomId: classroomId.value } },
    })
    rows.value = r.data?.assignmentsByClassroom ?? []
  } catch {
    rows.value = [
      {
        id: 'a1',
        title: 'Mini Website Project',
        description: 'Build a landing page.',
        dueDate: dayjs().add(3, 'day').toISOString(),
        acceptUntil: dayjs().add(5, 'day').toISOString(),
        maxAttempts: 2,
      },
      {
        id: 'a2',
        title: 'API Assignment',
        description: 'Make a small API.',
        dueDate: dayjs().add(10, 'day').toISOString(),
        acceptUntil: dayjs().add(13, 'day').toISOString(),
        maxAttempts: 3,
      },
    ]
  }
}

async function loadMySubs() {
  if (!studentId.value) return
  try {
    const q = `
      query($studentId:String!){
        mySubmissions(studentId:$studentId){
          id assignmentId fileUrl grade feedback submittedAt
        }
      }
    `
    const r = await $fetch(`${baseUrl}/api/teach-internal/graphql`, {
      method: 'POST',
      body: { query: q, variables: { studentId: studentId.value } },
    })
    mySubs.value = r.data?.mySubmissions ?? []
  } catch {
    mySubs.value = [
      {
        id: 'sub1',
        assignmentId: 'a1',
        fileUrl: 'https://example.com/demo',
        grade: 90,
        feedback: 'Good job!',
        submittedAt: dayjs().subtract(1, 'day').toISOString(),
      },
    ]
  }
}

async function submitAssignment() {
  if (!selectedAssignment.value || !studentId.value || !fileUrl.value) return
  try {
    // pretend success
    mySubs.value.push({
      id: 'mock-sub-' + Date.now(),
      assignmentId: selectedAssignment.value.id,
      fileUrl: fileUrl.value,
      grade: null,
      submittedAt: new Date().toISOString(),
    })
  } catch {
    /* always mock ok */
  }
  submitModalOpen.value = false
}

function deleteSubmission(id: string) {
  mySubs.value = mySubs.value.filter((s: any) => s.id !== id)
}

// =====================================================================================
// UI ACTIONS
// =====================================================================================
async function refresh() {
  await Promise.all([loadAssignments(), loadMySubs()])
}

function openSubmitModal(a: any) {
  selectedAssignment.value = a
  fileUrl.value = ''
  submitModalOpen.value = true
}

function openDetailsDrawer(s: any) {
  selectedSubmission.value = s
  detailsDrawerOpen.value = true
}

function openDetailsDrawerByAssignment(a: any) {
  const sub = getSubmissionForAssignment(a.id)
  if (sub) openDetailsDrawer(sub)
}

function goBack() {
  window.location.pathname  = '/classrooms'
}

// =====================================================================================
// NOTES
// =====================================================================================
function loadNotes() {
  if (typeof window === 'undefined') return
  classroomNotes.value = localStorage.getItem(notesKey()) || ''
}

function persistNotes() {
  if (typeof window === 'undefined') return
  localStorage.setItem(notesKey(), classroomNotes.value)
}

// =====================================================================================
// LIFECYCLE
// =====================================================================================
onMounted(async () => {
  if (typeof window !== 'undefined') {
    isOnline.value = navigator.onLine
    const onOnline = () => (isOnline.value = true)
    const onOffline = () => (isOnline.value = false)
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    ;(onMounted as any)._online = onOnline
    ;(onMounted as any)._offline = onOffline
  }

  await loadClassroom()
  await loadAssignments()
  if (studentId.value) await loadMySubs()
  loadNotes()
})

onBeforeUnmount(() => {
  if (typeof window === 'undefined') return
  window.removeEventListener('online', (onMounted as any)._online)
  window.removeEventListener('offline', (onMounted as any)._offline)
})

// refresh when studentId appears
watch(studentId, async (id, prev) => {
  if (id && id !== prev) await loadMySubs()
})

// dark mode toggle
watch(
  isDark,
  (val) => {
    if (typeof document === 'undefined') return
    document.documentElement.classList.toggle('dark', val)
  },
  { immediate: true }
)

// table columns
const submissionColumns = [
  { title: t('Assignment'), key: 'assignment' },
  { title: t('Submitted'), key: 'submittedAt' },
  { title: t('Status'), key: 'status' },
  { title: t('Grade'), key: 'grade' },
  { title: '', key: 'actions' },
]

const stepsCurrentIndex = computed(() => {
  if (!rows.value.length) return 0

  // First assignment that is "Open"
  const firstOpen = rows.value.findIndex(a => getStatusLabel(a) === 'Open')

  if (firstOpen >= 0) return firstOpen

  // Otherwise last
  return rows.value.length - 1
})

function stepDescriptionFor(a: any) {
  const submitted = getSubmissionForAssignment(a.id)
  if (!submitted) return getStatusLabel(a)
  if (submitted.grade != null) return `${submitted.grade}% · ${getStatusLabel(a)}`
  return `Submitted · ${getStatusLabel(a)}`
}

function stepStatusFor(a: any, idx: number) {
  const hasSub = !!getSubmissionForAssignment(a.id)

  if (hasSub && getSubmissionForAssignment(a.id)?.grade != null)
    return 'finish'

  if (idx === stepsCurrentIndex.value)
    return 'process'

  return 'wait'
}

function timelineColorFor(a: any) {
  const label = getStatusLabel(a)
  if (label === 'Closed') return 'red'
  if (label === 'Late Window') return 'orange'
  return 'green'
}

</script>

<style scoped>
.classroom-wrap { min-height: 100vh; background: var(--ant-color-bg-layout, #f5f5f5); }
.classroom-wrap.is-dark { background: #0f172a; color: #e5e7eb; }
.global-banners { margin: 8px 8px 0; }
.page-header { margin: 8px; border-radius: 12px; background: var(--ant-color-bg-container, #fff); box-shadow: 0 2px 4px rgba(15, 23, 42, 0.06); }
.content { padding: 8px; }
.content-inner { padding: 8px; }
.assignment-list { max-height: 420px; overflow: auto; }
.assignment-row + .assignment-row { margin-top: 8px; }
.ass-row { display: flex; gap: 12px; align-items: flex-start; }
.ass-main { flex: 1; }
.ass-title-line { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-bottom: 4px; }
.ass-title { margin: 0; font-size: 15px; font-weight: 600; }
.ass-desc { margin: 0 0 6px; font-size: 13px; color: #64748b; }
.ass-meta { font-size: 12px; color: #64748b; }
.ass-actions { display: flex; flex-direction: column; gap: 6px; }
.right-card { height: 100%; }
.right-inner { padding: 8px; }
.tab-pane-inner { padding: 8px; }
.timeline-row { display: flex; justify-content: space-between; gap: 12px; }
.timeline-main { flex: 1; }
.timeline-main b { font-size: 13px; }
.timeline-main p { margin: 0; }
.timeline-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; font-size: 12px; }
.muted { color: #64748b; }
.text-xs { font-size: 12px; }
.mb-4 { margin-bottom: 16px; }
</style>
