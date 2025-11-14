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
          <a-tag>
            <TeamOutlined /> {{ roster.length || 0 }} {{ t('students') }}
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

            <a-popover placement="bottomRight">
              <template #content>
                <div class="settings-popover">
                  <div class="settings-row">
                    <span class="settings-label">{{ t('Student ID') }}</span>
                    <a-input
                      v-model:value="studentId"
                      placeholder="student-123"
                      data-test-id="student-id-input"
                    />
                  </div>
                  <a-button type="primary" block @click="refresh" :disabled="!studentId">
                    {{ t('Load my data') }}
                  </a-button>
                </div>
              </template>
              <a-button>
                {{ studentId ? `📚 ${studentId}` : t('Student settings') }}
              </a-button>
            </a-popover>

            <a-tooltip :title="t('Back to classrooms')">
              <a-button type="default" @click="goBack">
                <template #icon><ArrowLeftOutlined /></template>
                {{ t('Classrooms') }}
              </a-button>
            </a-tooltip>
          </a-space>
        </template>
      </a-page-header>

      <a-layout>
        <!-- LEFT SIDER · ROSTER -->
        <a-layout-sider
          width="280"
          class="left-sider"
          collapsible
          v-model:collapsed="leftCollapsed"
          :collapsed-width="60"
          data-test-id="left-sider"
        >
          <div class="sider-inner">
            <div class="sider-section sider-header" v-if="!leftCollapsed">
              <div class="sider-title-row">
                <h3 class="sider-title">{{ t('Roster') }}</h3>
                <a-tag size="small">
                  <TeamOutlined /> {{ roster.length || 0 }}
                </a-tag>
              </div>
              <p class="muted text-xs">
                {{ t('Pick a student to see their submissions and progress.') }}
              </p>
            </div>

            <a-input-search
              v-if="!leftCollapsed"
              v-model:value="rosterSearch"
              :placeholder="t('Search students')"
              allow-clear
              class="mt-2"
              data-test-id="roster-search"
            />

            <div class="mt-2" v-if="!leftCollapsed">
              <a-segmented
                v-model:value="rosterFilterRole"
                :options="[
                  { label: t('All'), value: 'all' },
                  { label: t('Students'), value: 'student' },
                  { label: t('Teachers'), value: 'teacher' }
                ]"
                size="small"
                data-test-id="roster-role-filter"
              />
            </div>

            <a-empty
              v-if="!filteredRoster.length"
              :description="t('No people in roster yet')"
              class="mt-4"
            />

            <a-list
              v-else
              class="mt-2 roster-list"
              size="small"
              :data-source="filteredRoster"
              :row-key="(p) => p.id"
            >
              <template #renderItem="{ item }">
                <a-list-item
                  :class="['roster-row', item.id === studentId && 'active']"
                  @click="selectStudent(item)"
                  :data-test-id="`roster-row-${item.id}`"
                >
                  <a-list-item-meta
                    :title="item.displayName || t('Unnamed')"
                    :description="rosterDescription(item)"
                  >
                    <template #avatar>
                      <a-avatar :size="32">
                        <template v-if="item.avatar">
                          <img :src="item.avatar" alt="" />
                        </template>
                        <template v-else>
                          <UserOutlined />
                        </template>
                      </a-avatar>
                    </template>
                  </a-list-item-meta>
                  <template #actions>
                    <a-tag v-if="item.role === 'Teacher'" color="gold">Teacher</a-tag>
                    <a-tag v-else color="blue">Student</a-tag>
                  </template>
                </a-list-item>
              </template>
            </a-list>
          </div>
        </a-layout-sider>

        <!-- CENTER CONTENT -->
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

            <!-- Assignments + My Submissions -->
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
                <a-card
                  class="right-card"
                  :bordered="false"
                  body-style="padding:0;"
                >
                  <div class="right-inner">
                    <a-tabs
                      v-model:activeKey="rightTab"
                      size="small"
                      :animated="false"
                      data-test-id="right-tabs"
                    >
                      <!-- A · Progress -->
                      <a-tab-pane :key="'progress'" :tab="t('Progress')">
                        <div class="tab-pane-inner">
                          <a-card
                            size="small"
                            :title="t('Per-assignment progress')"
                            :bordered="false"
                          >
                            <a-steps
                              direction="vertical"
                              size="small"
                              :current="stepsCurrentIndex"
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
                          <a-card
                            size="small"
                            :bordered="false"
                            :title="t('Overall completion')"
                          >
                            <a-progress
                              :percent="progressPercent"
                              status="active"
                              data-test-id="progress-percent"
                            />
                            <p class="muted text-xs mt-1">
                              {{
                                t(
                                  'Based on assignments with at least one submission.'
                                )
                              }}
                            </p>
                          </a-card>
                        </div>
                      </a-tab-pane>

                      <!-- F · Upcoming deadlines -->
                      <a-tab-pane :key="'deadlines'" :tab="t('Deadlines')">
                        <div class="tab-pane-inner">
                          <a-card
                            size="small"
                            :bordered="false"
                            :title="t('Upcoming & past deadlines')"
                          >
                            <a-empty
                              v-if="!rows.length"
                              :description="t('No assignments scheduled')"
                            />
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
                                      {{
                                        a.description?.slice(0, 120) ||
                                        t('No description')
                                      }}
                                    </p>
                                  </div>
                                  <div class="timeline-meta">
                                    <span>
                                      <ClockCircleOutlined /> {{ t('Due') }}:
                                      {{
                                        a.dueDate
                                          ? formatDate(a.dueDate)
                                          : t('N/A')
                                      }}
                                    </span>
                                    <span v-if="a.acceptUntil" class="muted text-xs">
                                      {{ t('Accept until') }}:
                                      {{ formatDate(a.acceptUntil) }}
                                    </span>
                                    <span class="muted text-xs">
                                      {{ getStatusLabel(a) }}
                                    </span>
                                  </div>
                                </div>
                              </a-timeline-item>
                            </a-timeline>
                          </a-card>
                        </div>
                      </a-tab-pane>

                      <!-- G · My submissions (summary) -->
                      <a-tab-pane :key="'subs'" :tab="t('Submissions')">
                        <div class="tab-pane-inner">
                          <a-card
                            size="small"
                            :bordered="false"
                            :title="t('Recent submissions')"
                          >
                            <a-empty
                              v-if="!mySubs.length"
                              :description="t('No submissions yet')"
                            />
                            <a-list
                              v-else
                              :data-source="mySubs.slice(0, 10)"
                              size="small"
                            >
                              <template #renderItem="{ item }">
                                <a-list-item :key="item.id">
                                  <a-list-item-meta
                                    :title="
                                      rows.find((r) => r.id === item.assignmentId)
                                        ?.title || item.assignmentId
                                    "
                                    :description="formatDate(item.submittedAt)"
                                  >
                                    <template #avatar>
                                      <a-avatar size="small">
                                        <FileTextOutlined />
                                      </a-avatar>
                                    </template>
                                  </a-list-item-meta>
                                  <template #actions>
                                    <a-tag
                                      :color="item.grade != null ? 'green' : 'blue'"
                                    >
                                      {{
                                        item.grade != null
                                          ? `${item.grade}%`
                                          : t('Pending')
                                      }}
                                    </a-tag>
                                    <a
                                      href="javascript:void(0)"
                                      @click="openDetailsDrawer(item)"
                                    >
                                      {{ t('Open') }}
                                    </a>
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
                          <a-card
                            size="small"
                            :bordered="false"
                            :title="t('Classroom resources')"
                          >
                            <a-empty
                              v-if="!resources.length"
                              :description="t('No shared resources yet')"
                            />
                            <a-list
                              v-else
                              :data-source="resources"
                              size="small"
                            >
                              <template #renderItem="{ item }">
                                <a-list-item>
                                  <a-list-item-meta
                                    :title="item.title"
                                    :description="item.description"
                                  >
                                    <template #avatar>
                                      <a-avatar size="small">
                                        <BookOutlined />
                                      </a-avatar>
                                    </template>
                                  </a-list-item-meta>
                                  <template #actions>
                                    <a
                                      :href="item.url"
                                      target="_blank"
                                      rel="noopener"
                                    >
                                      {{ t('Open') }}
                                    </a>
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
                          <a-card
                            size="small"
                            :title="t('My notes for this classroom')"
                            :bordered="false"
                          >
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
                              {{
                                t(
                                  'Notes are saved locally in this browser for now. Later they can sync to UserKV.'
                                )
                              }}
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
        <a-descriptions
          v-if="selectedSubmission"
          :column="1"
          bordered
          size="small"
        >
          <a-descriptions-item :label="t('Assignment')">
            {{
              rows.find((r) => r.id === selectedSubmission.assignmentId)?.title ||
              selectedSubmission.assignmentId
            }}
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
            <span class="text-lg font-bold">
              {{ selectedSubmission.grade }}%
            </span>
          </a-descriptions-item>
          <a-descriptions-item v-if="selectedSubmission.feedback" :label="t('Feedback')">
            <p class="muted">
              {{ selectedSubmission.feedback }}
            </p>
          </a-descriptions-item>
        </a-descriptions>
        <a-empty
          v-else
          :description="t('No submission selected')"
        />
      </a-drawer>
    </a-layout>
  </a-config-provider>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  watch,
} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { theme } from 'ant-design-vue'
import dayjs from 'dayjs/esm/index.js'
import {
  ArrowLeftOutlined,
  BgColorsOutlined,
  FieldTimeOutlined,
  TeamOutlined,
  UserOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  BookOutlined,
} from '@ant-design/icons-vue'
import { definePageMeta } from '#imports'
import { useRuntimeConfig } from '#app'
import { $fetch } from 'ohmyfetch'

// Page meta (student layout, client-only to safely use window/localStorage)
definePageMeta({ layout: 'student', ssr: false })

const config = useRuntimeConfig()
const route = useRoute()
const router = useRouter()
const baseUrl = config.public?.apiBase || 'http://localhost:4000'

// ---------- I18n stub ----------
const dict = {
  en: {
    students: 'students',
    Online: 'Online',
    Offline: 'Offline',
    'Toggle dark mode': 'Toggle dark mode',
    'Student settings': 'Student settings',
    Classrooms: 'Classrooms',
    Roster: 'Roster',
    'Pick a student to see their submissions and progress.':
      'Pick a student to see their submissions and progress.',
    'Search students': 'Search students',
    All: 'All',
    Students: 'Students',
    Teachers: 'Teachers',
    'No people in roster yet': 'No people in roster yet',
    Unnamed: 'Unnamed',
    Teacher: 'Teacher',
    Student: 'Student',
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
    ClosedLbl: 'Closed',
    'View details': 'View details',
    'My submissions': 'My submissions',
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
    OpenFile: 'Open file',
    Resources: 'Resources',
    'Classroom resources': 'Classroom resources',
    'No shared resources yet': 'No shared resources yet',
    Notes: 'Notes',
    'My notes for this classroom': 'My notes for this classroom',
    'Notes are saved locally in this browser for now. Later they can sync to UserKV.':
      'Notes are saved locally in this browser for now. Later they can sync to UserKV.',
    'Submit assignment': 'Submit assignment',
    'Enter file URL or link to your submission':
      'Enter file URL or link to your submission',
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
    'Please fill in all fields': 'Please fill in all fields',
    'Back to classrooms': 'Back to classrooms',
    'Load my data': 'Load my data',
    'Student ID': 'Student ID',
    'Open file': 'Open file',
    'No file': 'No file',
  },
} as const

const lang = ref<'en'>('en')
const t = (key: keyof typeof dict['en']) => dict[lang.value][key] || key

// ---------- State ----------
const isDark = ref(false)
const isOnline = ref(true)
const usingMocks = ref(false)
const mockReason = ref('')

const classroomId = computed(() => String(route.params.id || ''))
const classroom = ref<any | null>(null)
const courseMeta = ref<{ title?: string; category?: string; difficulty?: string }>(
  {},
)

// roster
const roster = ref<any[]>([])
const rosterSearch = ref('')
const rosterFilterRole = ref<'all' | 'student' | 'teacher'>('all')

// student + data
const studentId = ref<string>('')
const rows = ref<any[]>([]) // assignments
const mySubs = ref<any[]>([])

const searchText = ref('')
const filterStatus = ref('')
const statusMessage = ref('')
const statusType = ref<'success' | 'error' | 'info'>('info')
const rightTab = ref<'progress' | 'deadlines' | 'subs' | 'resources' | 'notes'>(
  'progress',
)

// modal/drawer
const submitModalOpen = ref(false)
const detailsDrawerOpen = ref(false)
const selectedAssignment = ref<any | null>(null)
const selectedSubmission = ref<any | null>(null)
const fileUrl = ref('')

// UI
const leftCollapsed = ref(false)
const classroomNotes = ref('')

// resources (mock for now)
const resources = ref([
  {
    id: 'res1',
    title: 'Syllabus (PDF)',
    description: 'Full course syllabus and evaluation criteria.',
    url: '#',
  },
  {
    id: 'res2',
    title: 'Code repository',
    description: 'Starter repo for labs and projects.',
    url: '#',
  },
])

// ---------- Computed ----------
const classroomTitle = computed(() => {
  if (classroom.value?.name) return classroom.value.name
  return `Classroom ${classroomId.value}`
})

const classroomSubtitle = computed(() => {
  const parts: string[] = []
  if (courseMeta.value.title) parts.push(courseMeta.value.title)
  return parts.join(' · ') || 'Cohort / group'
})

const dateRangeLabel = computed(() => {
  if (!classroom.value?.startDate || !classroom.value?.endDate) return ''
  const start = dayjs(classroom.value.startDate)
  const end = dayjs(classroom.value.endDate)
  return `${start.format('MMM D, YYYY')} – ${end.format('MMM D, YYYY')}`
})

const filteredAssignments = computed(() => {
  return rows.value.filter((a) => {
    const text = `${a.title || ''} ${a.description || ''}`.toLowerCase()
    const matchesSearch =
      !searchText.value ||
      text.includes(searchText.value.toLowerCase())

    const statusVal = getStatusValue(a)
    const matchesStatus =
      !filterStatus.value || statusVal === filterStatus.value

    return matchesSearch && matchesStatus
  })
})

const gradedCount = computed(() =>
  mySubs.value.filter((s) => s.grade != null).length,
)

const avgGrade = computed(() => {
  const graded = mySubs.value.filter((s) => s.grade != null)
  if (!graded.length) return 0
  const total = graded.reduce((sum, s) => sum + (s.grade || 0), 0)
  return Math.round(total / graded.length)
})

const progressPercent = computed(() => {
  if (!rows.value.length) return 0
  const withSub = rows.value.filter((a) =>
    mySubs.value.some((s) => s.assignmentId === a.id),
  ).length
  return Math.round((withSub / rows.value.length) * 100)
})

const sortedByDue = computed(() =>
  [...rows.value].sort((a, b) => {
    const da = a.dueDate ? dayjs(a.dueDate).valueOf() : Infinity
    const db = b.dueDate ? dayjs(b.dueDate).valueOf() : Infinity
    return da - db
  }),
)

const stepsCurrentIndex = computed(() => {
  if (!rows.value.length) return 0
  const firstOpenIdx = rows.value.findIndex(
    (a) => getStatusLabel(a) === 'Open',
  )
  return firstOpenIdx >= 0 ? firstOpenIdx : rows.value.length - 1
})

const filteredRoster = computed(() => {
  const term = rosterSearch.value.toLowerCase()
  return roster.value.filter((p) => {
    const role = (p.role || 'student').toLowerCase()
    if (rosterFilterRole.value !== 'all') {
      if (rosterFilterRole.value === 'student' && role !== 'student') {
        return false
      }
      if (rosterFilterRole.value === 'teacher' && role !== 'teacher') {
        return false
      }
    }
    if (!term) return true
    const label = `${p.displayName || ''}`.toLowerCase()
    return label.includes(term)
  })
})

// ---------- Helpers ----------
function formatDate(date: string | Date) {
  return dayjs(date).format('MMM DD, YYYY HH:mm')
}

function getStatusLabel(a: any) {
  const now = dayjs()
  const due = a.dueDate ? dayjs(a.dueDate) : null
  const accept = a.acceptUntil ? dayjs(a.acceptUntil) : due

  if (accept && now.isAfter(accept)) return 'Closed'
  if (due && now.isAfter(due)) return 'Late Window'
  return 'Open'
}

function getStatusValue(a: any) {
  const label = getStatusLabel(a)
  return label.toLowerCase().replace(' window', '')
}

function getStatusColor(a: any) {
  const label = getStatusLabel(a)
  if (label === 'Closed') return 'red'
  if (label === 'Late Window') return 'orange'
  return 'green'
}

function isAssignmentClosed(a: any) {
  const now = dayjs()
  const accept = a.acceptUntil
    ? dayjs(a.acceptUntil)
    : a.dueDate
    ? dayjs(a.dueDate)
    : null
  return !!(accept && now.isAfter(accept))
}

function attemptsLeft(a: any) {
  const maxA = Number(a.maxAttempts ?? 1)
  const used = mySubs.value.filter(
    (s: any) => s.assignmentId === a.id,
  ).length
  return Math.max(0, maxA - used)
}

function getSubmissionForAssignment(assignmentId: string) {
  return mySubs.value.find((s) => s.assignmentId === assignmentId)
}

function timelineColorFor(a: any) {
  const label = getStatusLabel(a)
  if (label === 'Closed') return 'red'
  if (label === 'Late Window') return 'orange'
  return 'green'
}

function stepStatusFor(a: any, idx: number) {
  const hasSub = !!getSubmissionForAssignment(a.id)
  if (hasSub && getSubmissionForAssignment(a.id)?.grade != null) {
    return 'finish'
  }
  if (idx === stepsCurrentIndex.value) return 'process'
  return 'wait'
}

function stepDescriptionFor(a: any) {
  const submitted = getSubmissionForAssignment(a.id)
  if (!submitted) return getStatusLabel(a)
  if (submitted.grade != null) {
    return `${submitted.grade}% · ${getStatusLabel(a)}`
  }
  return `Submitted · ${getStatusLabel(a)}`
}

function rosterDescription(p: any) {
  const parts: string[] = []
  if (p.role) parts.push(p.role)
  if (p.progressPct != null) parts.push(`${p.progressPct}%`)
  return parts.join(' · ')
}

function notesKey() {
  return `byway:classroom-notes:${classroomId.value}`
}

// ---------- API calls (GraphQL + mocks) ----------
async function loadClassroom() {
  try {
    const q = `
      query($id:String!){
        classroomById(id:$id){
          id
          name
          startDate
          endDate
          course {
            id
            title
            category
            difficulty
          }
        }
      }
    `
    const r = (await $fetch(`${baseUrl}/api/teach-internal/graphql`, {
      method: 'POST',
      body: { query: q, variables: { id: classroomId.value } },
    })) as any
    const c = r.data?.classroomById
    if (c) {
      classroom.value = c
      if (c.course) {
        courseMeta.value = {
          title: c.course.title,
          category: c.course.category,
          difficulty: c.course.difficulty,
        }
      }
      return
    }
    throw new Error('No classroom')
  } catch (err) {
    usingMocks.value = true
    if (!mockReason.value) mockReason.value = 'classroomById fallback'
    classroom.value = {
      id: classroomId.value,
      name: `Demo classroom ${classroomId.value}`,
      startDate: dayjs().subtract(7, 'day').toISOString(),
      endDate: dayjs().add(30, 'day').toISOString(),
    }
    courseMeta.value = {
      title: 'Full Stack Foundations',
      category: 'Software',
      difficulty: 'Intermediate',
    }
  }
}

async function loadRoster() {
  try {
    const q = `
      query($classroomId:String!){
        classroomRoster(classroomId:$classroomId){
          id
          displayName
          avatar
          role
          progressPct
        }
      }
    `
    const r = (await $fetch(`${baseUrl}/api/teach-internal/graphql`, {
      method: 'POST',
      body: { query: q, variables: { classroomId: classroomId.value } },
    })) as any
    const list = r.data?.classroomRoster
    if (Array.isArray(list)) {
      roster.value = list
      return
    }
    throw new Error('No roster')
  } catch (err) {
    usingMocks.value = true
    if (!mockReason.value) mockReason.value = 'roster fallback'
    roster.value = [
      {
        id: 'student-1',
        displayName: 'Alice Example',
        avatar: null,
        role: 'Student',
        progressPct: 70,
      },
      {
        id: 'student-2',
        displayName: 'Bob Demo',
        avatar: null,
        role: 'Student',
        progressPct: 40,
      },
      {
        id: 'teacher-1',
        displayName: 'Dr. Smith (Teacher)',
        avatar: null,
        role: 'Teacher',
        progressPct: null,
      },
    ]
  }
}

async function loadAssignments() {
  try {
    const q = `
      query($classroomId:String!){
        assignmentsByClassroom(classroomId:$classroomId){
          id
          title
          description
          dueDate
          acceptUntil
          maxAttempts
          latePenalty
        }
      }
    `
    const r = (await $fetch(`${baseUrl}/api/teach-internal/graphql`, {
      method: 'POST',
      body: { query: q, variables: { classroomId: classroomId.value } },
    })) as any
    rows.value = r.data?.assignmentsByClassroom ?? []
  } catch (err) {
    usingMocks.value = true
    statusMessage.value = t('Failed to load assignments')
    statusType.value = 'error'
    if (!mockReason.value) mockReason.value = 'assignmentsByClassroom fallback'
    rows.value = [
      {
        id: 'a1',
        title: 'Mini website project',
        description: 'Build a small landing page with HTML/CSS.',
        dueDate: dayjs().add(3, 'day').toISOString(),
        acceptUntil: dayjs().add(5, 'day').toISOString(),
        maxAttempts: 2,
      },
      {
        id: 'a2',
        title: 'API assignment',
        description: 'Create a REST API with Node.js and Express.',
        dueDate: dayjs().add(10, 'day').toISOString(),
        acceptUntil: dayjs().add(12, 'day').toISOString(),
        maxAttempts: 3,
      },
    ]
  }
}

async function loadMySubs() {
  if (!studentId.value) {
    mySubs.value = []
    return
  }
  try {
    const q = `
      query($studentId:String!){
        mySubmissions(studentId:$studentId){
          id
          assignmentId
          fileUrl
          grade
          feedback
          submittedAt
        }
      }
    `
    const r = (await $fetch(`${baseUrl}/api/teach-internal/graphql`, {
      method: 'POST',
      body: { query: q, variables: { studentId: studentId.value } },
    })) as any
    mySubs.value = r.data?.mySubmissions ?? []
    statusMessage.value = t('Data loaded successfully')
    statusType.value = 'success'
  } catch (err) {
    usingMocks.value = true
    statusMessage.value = t('Failed to load submissions')
    statusType.value = 'error'
    if (!mockReason.value) mockReason.value = 'mySubmissions fallback'
    mySubs.value = [
      {
        id: 's1',
        assignmentId: rows.value[0]?.id || 'a1',
        fileUrl: 'https://example.com/my-project',
        grade: 88,
        feedback: 'Good structure, minor CSS issues.',
        submittedAt: dayjs().subtract(1, 'day').toISOString(),
      },
    ]
  }
}

async function submitAssignment() {
  if (!selectedAssignment.value || !studentId.value || !fileUrl.value) {
    statusMessage.value = t('Please fill in all fields')
    statusType.value = 'error'
    return
  }
  try {
    const q = `
      mutation($assignmentId:String!,$studentId:String!,$fileUrl:String){
        createSubmission(assignmentId:$assignmentId,studentId:$studentId,fileUrl:$fileUrl){
          id
        }
      }
    `
    await $fetch(`${baseUrl}/api/teach-internal/graphql`, {
      method: 'POST',
      body: {
        query: q,
        variables: {
          assignmentId: selectedAssignment.value.id,
          studentId: studentId.value,
          fileUrl: fileUrl.value,
        },
      },
    })
    fileUrl.value = ''
    submitModalOpen.value = false
    await loadMySubs()
    statusMessage.value = t('Submission successful!')
    statusType.value = 'success'
  } catch (err) {
    usingMocks.value = true
    statusMessage.value = t('Failed to submit assignment')
    statusType.value = 'error'
    if (!mockReason.value) mockReason.value = 'createSubmission fallback'
  }
}

async function deleteSubmission(id: string) {
  try {
    // TODO: wire deleteSubmission mutation when backend is ready
    mySubs.value = mySubs.value.filter((s) => s.id !== id)
    statusMessage.value = t('Submission deleted')
    statusType.value = 'success'
  } catch (err) {
    statusMessage.value = t('Failed to delete submission')
    statusType.value = 'error'
  }
}

// ---------- UI actions ----------
async function refresh() {
  await Promise.all([loadAssignments(), loadMySubs()])
}

function openSubmitModal(assignment: any) {
  selectedAssignment.value = assignment
  fileUrl.value = ''
  submitModalOpen.value = true
}

function openDetailsDrawer(item: any) {
  selectedSubmission.value = item
  detailsDrawerOpen.value = true
}

function openDetailsDrawerByAssignment(a: any) {
  const sub = getSubmissionForAssignment(a.id)
  if (sub) {
    selectedSubmission.value = sub
    detailsDrawerOpen.value = true
  }
}

function selectStudent(p: any) {
  studentId.value = p.id
  rightTab.value = 'subs'
  statusMessage.value = `Switched to ${p.displayName || p.id}`
  statusType.value = 'info'
}

function goBack() {
  router.push('/classrooms')
}

// notes
function loadNotes() {
  if (typeof window === 'undefined') return
  const raw = localStorage.getItem(notesKey())
  if (raw) classroomNotes.value = raw
}

function persistNotes() {
  if (typeof window === 'undefined') return
  localStorage.setItem(notesKey(), classroomNotes.value || '')
}

// ---------- Lifecycle ----------
onMounted(async () => {
  // online tracking
  if (typeof window !== 'undefined') {
    isOnline.value = navigator.onLine
    const onOnline = () => (isOnline.value = true)
    const onOffline = () => (isOnline.value = false)
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    // store listeners for removal
    ;(onMounted as any)._bywayOnline = onOnline
    ;(onMounted as any)._bywayOffline = onOffline
  }

  await Promise.all([loadClassroom(), loadRoster(), loadAssignments()])
  if (studentId.value) {
    await loadMySubs()
  }
  loadNotes()
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    const onOnline = (onMounted as any)._bywayOnline
    const onOffline = (onMounted as any)._bywayOffline
    if (onOnline) window.removeEventListener('online', onOnline)
    if (onOffline) window.removeEventListener('offline', onOffline)
  }
})

// watch studentId to auto-refresh
watch(
  () => studentId.value,
  async (val) => {
    if (val) {
      await loadMySubs()
    } else {
      mySubs.value = []
    }
  },
)

// dark mode class on <html>
watch(
  () => isDark.value,
  (val) => {
    if (typeof document === 'undefined') return
    if (val) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  },
  { immediate: true },
)
</script>

<style scoped>
.classroom-wrap {
  min-height: 100vh;
  background: var(--ant-color-bg-layout, #f5f5f5);
}

.classroom-wrap.is-dark {
  background: #0f172a;
  color: #e5e7eb;
}

.global-banners {
  margin: 8px 8px 0;
}

.page-header {
  margin: 8px;
  border-radius: 12px;
  background: var(--ant-color-bg-container, #fff);
  box-shadow: 0 2px 4px rgba(15, 23, 42, 0.06);
}

.left-sider,
.right-sider {
  background: transparent;
}

.sider-inner {
  height: 100%;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sider-section.sider-header {
  margin-bottom: 4px;
}

.sider-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sider-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}

.roster-list {
  flex: 1;
  overflow: auto;
}

.roster-row {
  cursor: pointer;
  border-radius: 8px;
  padding-inline: 8px !important;
}

.roster-row:hover {
  background: rgba(15, 23, 42, 0.04);
}

.roster-row.active {
  background: rgba(37, 99, 235, 0.08);
}

.content {
  padding: 8px;
}

.content-inner {
  padding: 8px;
}

.assignment-list {
  max-height: 420px;
  overflow: auto;
}

.assignment-row + .assignment-row {
  margin-top: 8px;
}

.ass-row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.ass-main {
  flex: 1;
}

.ass-title-line {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.ass-title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
}

.ass-desc {
  margin: 0 0 6px;
  font-size: 13px;
  color: #64748b;
}

.ass-meta {
  font-size: 12px;
  color: #64748b;
}

.ass-actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.right-card {
  height: 100%;
}

.right-inner {
  padding: 8px;
}

.tab-pane-inner {
  padding: 8px;
}

.timeline-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.timeline-main {
  flex: 1;
}

.timeline-main b {
  font-size: 13px;
}

.timeline-main p {
  margin: 0;
}

.timeline-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  font-size: 12px;
}

.settings-popover {
  min-width: 260px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.settings-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.settings-label {
  font-size: 12px;
  color: #64748b;
}

.muted {
  color: #64748b;
}

.text-xs {
  font-size: 12px;
}

.mb-4 {
  margin-bottom: 16px;
}
</style>
