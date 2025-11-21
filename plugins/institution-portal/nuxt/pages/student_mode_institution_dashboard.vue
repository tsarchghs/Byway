<template>
  <div class="institution-student-portal">
    <a-skeleton :loading="loading" active :paragraph="{ rows: 10 }">
      <template v-if="!error && viewModel">
        <a-page-header
          class="portal-page-header"
          :title="viewModel.institution.name"
          :sub-title="viewModel.institution.type || 'Institution'"
        >
          <template #tags>
            <a-tag v-if="viewModel.institution.active" color="green">
              <CheckCircleOutlined class="tag-icon" />
              <span>Active</span>
            </a-tag>
            <a-tag v-else color="red">
              <ExclamationCircleOutlined class="tag-icon" />
              <span>Inactive</span>
            </a-tag>
            <a-tag>{{ viewModel.institution.slug }}</a-tag>
            <a-tag v-if="viewModel.authInstitution?.domain">
              {{ viewModel.authInstitution.domain }}
            </a-tag>
          </template>

          <template #extra>
            <a-space>
              <a-button size="small" @click="load">
                <ReloadOutlined />
                Refresh mock
              </a-button>
            </a-space>
          </template>

          <template #footer>
            <a-row :gutter="16" class="portal-header-row">
              <!-- Left: Institution meta -->
              <a-col :span="16">
                <a-card size="small" bordered class="portal-header-card">
                  <a-row :gutter="16">
                    <a-col :span="8">
                      <a-statistic :value="enrolledClassrooms.length">
                        <template #title>
                          <span>
                            <TeamOutlined class="stat-icon" />
                            Enrolled classrooms
                          </span>
                        </template>
                      </a-statistic>
                    </a-col>
                    <a-col :span="8">
                      <a-statistic :value="activeDepartments.length">
                        <template #title>
                          <span>
                            <ClusterOutlined class="stat-icon" />
                            Active departments
                          </span>
                        </template>
                      </a-statistic>
                    </a-col>
                    <a-col :span="8">
                      <a-statistic :value="averageCourseProgress" suffix="%">
                        <template #title>
                          <span>
                            <DashboardOutlined class="stat-icon" />
                            Avg. course progress
                          </span>
                        </template>
                      </a-statistic>
                    </a-col>
                  </a-row>

                  <a-row :gutter="16" style="margin-top: 12px">
                    <a-col :span="8">
                      <a-statistic :value="gradeAveragePct" suffix="%">
                        <template #title>
                          <span>
                            <CheckCircleOutlined class="stat-icon" />
                            Avg. grade
                          </span>
                        </template>
                      </a-statistic>
                    </a-col>
                    <a-col :span="8">
                      <a-statistic :value="totalOrders">
                        <template #title>
                          <span>
                            <ShoppingCartOutlined class="stat-icon" />
                            Orders for this institution
                          </span>
                        </template>
                      </a-statistic>
                    </a-col>
                    <a-col :span="8">
                      <a-statistic :value="runningLabsCount">
                        <template #title>
                          <span>
                            <ExperimentOutlined class="stat-icon" />
                            Active lab sessions
                          </span>
                        </template>
                      </a-statistic>
                    </a-col>
                  </a-row>
                </a-card>
              </a-col>

              <!-- Right: Student summary -->
              <a-col :span="8">
                <a-card size="small" class="student-card">
                  <div class="student-header">
                    <div class="avatar-circle">
                      <span>{{ studentInitials }}</span>
                    </div>
                    <div class="student-meta">
                      <div class="student-name">{{ studentDisplayName }}</div>
                      <div class="student-email">{{ viewModel.user.email }}</div>
                      <div class="student-role">
                        <a-tag color="blue">
                          <UserOutlined class="tag-icon" />
                          {{ memberRoleLabel }}
                        </a-tag>
                        <a-tag v-if="viewModel.member?.status === 'ACTIVE'" color="green">
                          Active member
                        </a-tag>
                      </div>
                    </div>
                  </div>
                  <a-divider />
                  <a-descriptions :column="1" size="small">
                    <a-descriptions-item label="Institution ID">
                      {{ viewModel.institution.id }}
                    </a-descriptions-item>
                    <a-descriptions-item label="Member since">
                      {{ formatDate(viewModel.member?.createdAt) }}
                    </a-descriptions-item>
                    <a-descriptions-item label="Last activity">
                      {{ lastActivityDisplay }}
                    </a-descriptions-item>
                  </a-descriptions>
                </a-card>
              </a-col>
            </a-row>
          </template>
        </a-page-header>

        <a-row :gutter="16" class="portal-layout">
          <!-- MAIN CONTENT -->
          <a-col :span="16">
            <a-card :bordered="false" class="portal-main-card">
              <a-tabs v-model:activeKey="activeTab">
                <!-- OVERVIEW TAB -->
                <a-tab-pane key="overview" tab="Overview">
                  <a-row :gutter="16">
                    <a-col :span="16">
                      <a-card size="small" title="About this institution">
                        <p class="institution-description">
                          {{ viewModel.institution.description || 'No description provided.' }}
                        </p>
                        <a-descriptions :column="2" size="small">
                          <a-descriptions-item label="Location">
                            {{ viewModel.institution.location || '—' }}
                          </a-descriptions-item>
                          <a-descriptions-item label="Email">
                            {{ viewModel.institution.email || '—' }}
                          </a-descriptions-item>
                          <a-descriptions-item label="Phone">
                            {{ viewModel.institution.phone || '—' }}
                          </a-descriptions-item>
                          <a-descriptions-item label="Created">
                            {{ formatDate(viewModel.institution.createdAt) }}
                          </a-descriptions-item>
                        </a-descriptions>
                      </a-card>

                      <a-card
                        size="small"
                        style="margin-top: 16px"
                        title="Upcoming work (assignments & labs)"
                      >
                        <a-row :gutter="16">
                          <a-col :span="14">
                            <div class="section-header">
                              <span class="section-title">
                                <CalendarOutlined class="section-icon" />
                                Assignments
                              </span>
                              <a-switch
                                v-model:checked="showOnlyOpenAssignments"
                                size="small"
                                style="margin-left: auto"
                              />
                              <span class="filter-label">Show only open</span>
                            </div>
                            <a-table
                              size="small"
                              :dataSource="upcomingAssignments"
                              :columns="assignmentColumns"
                              :pagination="false"
                              row-key="id"
                            >
                              <template #bodyCell="{ column, record }">
                                <template v-if="column.key === 'dueDate'">
                                  {{ formatDate(record.dueDate) }}
                                </template>
                                <template v-else-if="column.key === 'submissionStatus'">
                                  <a-tag
                                    v-if="record.submissionStatus === 'graded'"
                                    color="green"
                                  >
                                    Graded
                                  </a-tag>
                                  <a-tag
                                    v-else-if="record.submissionStatus === 'submitted'"
                                    color="blue"
                                  >
                                    Submitted
                                  </a-tag>
                                  <a-tag v-else>
                                    Not submitted
                                  </a-tag>
                                </template>
                                <template v-else>
                                  {{ record[column.dataIndex] }}
                                </template>
                              </template>
                            </a-table>
                          </a-col>
                          <a-col :span="10">
                            <div class="section-header">
                              <span class="section-title">
                                <ExperimentOutlined class="section-icon" />
                                Lab sessions
                              </span>
                            </div>
                            <a-timeline v-if="recentLabs.length">
                              <a-timeline-item
                                v-for="lab in recentLabs"
                                :key="lab.sessionId"
                                :color="lab.status === 'running' ? 'green' : 'blue'"
                              >
                                <div class="lab-item">
                                  <div class="lab-title">
                                    {{ lab.challengeTitle }}
                                  </div>
                                  <div class="lab-meta">
                                    <span>{{ lab.courseTitle || 'No course' }}</span>
                                    <span>•</span>
                                    <span>Status: {{ lab.status }}</span>
                                  </div>
                                  <div class="lab-meta">
                                    <span>Runtime: {{ lab.runtime || '—' }}</span>
                                    <span>•</span>
                                    <span>Last heartbeat: {{ formatDate(lab.lastHeartbeat) }}</span>
                                  </div>
                                </div>
                              </a-timeline-item>
                            </a-timeline>
                            <a-empty v-else description="No lab activity yet" />
                          </a-col>
                        </a-row>
                      </a-card>
                    </a-col>

                    <a-col :span="8">
                      <a-card size="small" title="My course snapshot">
                        <a-statistic
                          title="Enrolled courses"
                          :value="courses.length"
                        />
                        <a-statistic
                          title="Completed courses"
                          :value="completedCoursesCount"
                          style="margin-top: 8px"
                        />
                        <a-statistic
                          title="Average progress"
                          :value="averageCourseProgress"
                          suffix="%"
                          style="margin-top: 8px"
                        />
                      </a-card>

                      <a-card
                        size="small"
                        style="margin-top: 16px"
                        title="Recent notes"
                      >
                        <a-empty
                          v-if="!viewModel.notes.length"
                          description="No notes yet for this institution"
                        />
<a-list
  v-else
  size="small"
  :data-source="viewModel.notes.slice(0, 3)"
>
  <template #renderItem="{ item: note }">
    <a-list-item>
      <div class="note-item">
        <div class="note-course">
          <BookOutlined class="section-icon" />
          <span>{{ note.courseTitle || 'Course' }}</span>
        </div>

        <div class="note-body">
          {{ note.body }}
        </div>

        <div class="note-date">
          {{ formatDate(note.createdAt) }}
        </div>
      </div>
    </a-list-item>
  </template>
</a-list>
                      </a-card>
                    </a-col>
                  </a-row>
                </a-tab-pane>

                <!-- DEPARTMENTS & CLASSROOMS -->
                <a-tab-pane key="departments" tab="Departments & Classrooms">
                  <div class="section-header">
                    <span class="section-title">
                      <ClusterOutlined class="section-icon" />
                      Departments
                    </span>
                    <a-switch
                      v-model:checked="showOnlyMyClassrooms"
                      size="small"
                      style="margin-left: auto"
                    />
                    <span class="filter-label">Show only my classrooms</span>
                  </div>

                  <a-row :gutter="16" style="margin-top: 8px">
                    <a-col :span="16">
                      <a-collapse accordion>
                        <a-collapse-panel
                          v-for="dept in activeDepartments"
                          :key="dept.id"
                          :header="dept.name"
                        >
                          <p class="dept-meta">
                            {{ dept.contact || 'No contact details' }}
                          </p>
                          <a-list
                            size="small"
                            :data-source="classroomsByDepartment(dept.id)"
                            :locale="{ emptyText: 'No classrooms in this department' }"
                          >
                            <template #renderItem="{ item }">
                              <a-list-item>
                                <div class="classroom-item">
                                  <div class="classroom-title">
                                    <BookOutlined class="section-icon" />
                                    <span>{{ item.title }}</span>
                                    <a-tag
                                      v-if="item.isEnrolled"
                                      color="green"
                                      style="margin-left: 8px"
                                    >
                                      Enrolled
                                    </a-tag>
                                    <a-tag v-else style="margin-left: 8px">
                                      Not enrolled
                                    </a-tag>
                                  </div>
                                  <div class="classroom-meta">
                                    <span>Code: {{ item.code }}</span>
                                    <span v-if="item.courseTitle">• Course: {{ item.courseTitle }}</span>
                                  </div>
                                  <div class="classroom-meta">
                                    <span>Status: {{ item.status || '—' }}</span>
                                    <span v-if="item.capacity !== null">
                                      • Capacity: {{ item.capacity }}
                                    </span>
                                  </div>
                                  <div class="classroom-meta">
                                    <span>Starts: {{ formatDate(item.startsAt) }}</span>
                                    <span>• Ends: {{ formatDate(item.endsAt) }}</span>
                                  </div>
                                </div>
                              </a-list-item>
                            </template>
                          </a-list>
                        </a-collapse-panel>

                        <a-collapse-panel key="other" header="Other classrooms">
                          <a-list
                            size="small"
                            :data-source="classroomsWithoutDepartment"
                            :locale="{ emptyText: 'No other classrooms' }"
                          >
                            <template #renderItem="{ item }">
                              <a-list-item>
                                <div class="classroom-item">
                                  <div class="classroom-title">
                                    <BookOutlined class="section-icon" />
                                    <span>{{ item.title }}</span>
                                  </div>
                                  <div class="classroom-meta">
                                    <span>Code: {{ item.code }}</span>
                                    <span>• Status: {{ item.status || '—' }}</span>
                                  </div>
                                </div>
                              </a-list-item>
                            </template>
                          </a-list>
                        </a-collapse-panel>
                      </a-collapse>
                    </a-col>
                    <a-col :span="8">
                      <a-card size="small" title="Classroom summary">
                        <a-descriptions :column="1" size="small">
                          <a-descriptions-item label="Total classrooms">
                            {{ viewModel.classrooms.length }}
                          </a-descriptions-item>
                          <a-descriptions-item label="Active classrooms">
                            {{ activeClassrooms.length }}
                          </a-descriptions-item>
                          <a-descriptions-item label="My classrooms">
                            {{ enrolledClassrooms.length }}
                          </a-descriptions-item>
                          <a-descriptions-item label="Enrollment records">
                            {{ viewModel.classroomEnrollments.length }}
                          </a-descriptions-item>
                        </a-descriptions>
                      </a-card>
                    </a-col>
                  </a-row>
                </a-tab-pane>

                <!-- COURSES & PROGRESS -->
                <a-tab-pane key="courses" tab="Courses & Progress">
                  <div class="section-header">
                    <span class="section-title">
                      <BookOutlined class="section-icon" />
                      Courses at this institution
                    </span>
                  </div>
                  <a-table
                    size="small"
                    :columns="courseColumns"
                    :dataSource="courses"
                    row-key="courseId"
                    :pagination="{ pageSize: 5 }"
                    style="margin-top: 8px"
                  >
                    <template #bodyCell="{ column, record }">
                      <template v-if="column.key === 'progress'">
                        <a-progress :percent="record.progressPct" size="small" />
                      </template>
                      <template v-else-if="column.key === 'grade'">
                        <span v-if="record.gradePct !== null && record.gradePct !== undefined">
                          {{ record.gradePct.toFixed(0) }}%
                        </span>
                        <span v-else>—</span>
                      </template>
                      <template v-else>
                        {{ record[column.dataIndex] || '—' }}
                      </template>
                    </template>
                  </a-table>
                </a-tab-pane>

                <!-- LABS & ASSIGNMENTS (detailed) -->
                <a-tab-pane key="labs" tab="Labs & Assignments">
                  <a-row :gutter="16">
                    <a-col :span="14">
                      <a-card
                        size="small"
                        title="Assignments"
                      >
                        <a-table
                          size="small"
                          :columns="assignmentColumnsDetailed"
                          :dataSource="viewModel.assignments"
                          row-key="id"
                          :pagination="{ pageSize: 8 }"
                        >
                          <template #bodyCell="{ column, record }">
                            <template v-if="column.key === 'dueDate'">
                              {{ formatDate(record.dueDate) }}
                            </template>
                            <template v-else-if="column.key === 'status'">
                              <a-tag
                                v-if="record.submissionStatus === 'graded'"
                                color="green"
                              >
                                Graded
                              </a-tag>
                              <a-tag
                                v-else-if="record.submissionStatus === 'submitted'"
                                color="blue"
                              >
                                Submitted
                              </a-tag>
                              <a-tag v-else>
                                Not submitted
                              </a-tag>
                            </template>
                            <template v-else-if="column.key === 'grade'">
                              <span v-if="record.grade !== null && record.grade !== undefined">
                                {{ record.grade.toFixed(1) }}
                              </span>
                              <span v-else>—</span>
                            </template>
                            <template v-else>
                              {{ record[column.dataIndex] || '—' }}
                            </template>
                          </template>
                        </a-table>
                      </a-card>
                    </a-col>
                    <a-col :span="10">
                      <a-card
                        size="small"
                        title="Lab sessions"
                      >
<a-list
  size="small"
  :data-source="viewModel.labs"
>
  <template #renderItem="{ item: lab }">
    <a-list-item>
      <div class="lab-item">

        <div class="lab-title">
          {{ lab.challengeTitle }}
        </div>

        <div class="lab-meta">
          <span>{{ lab.courseTitle || 'No course' }}</span>
          <span>•</span>
          <span>Status: {{ lab.status }}</span>
        </div>

        <div class="lab-meta">
          <span>Runtime: {{ lab.runtime || '—' }}</span>
          <span>•</span>
          <span>Code server: {{ lab.codeServerUrl || '—' }}</span>
        </div>

      </div>
    </a-list-item>
  </template>
</a-list>

                      </a-card>
                    </a-col>
                  </a-row>
                </a-tab-pane>

                <!-- ORDERS & BILLING -->
                <a-tab-pane key="orders" tab="Orders & Billing">
                  <div class="section-header">
                    <span class="section-title">
                      <ShoppingCartOutlined class="section-icon" />
                      Orders related to this institution
                    </span>
                  </div>
                  <a-table
                    size="small"
                    :columns="orderColumns"
                    :dataSource="viewModel.orders"
                    row-key="orderId"
                    :pagination="{ pageSize: 5 }"
                    style="margin-top: 8px"
                  >
                    <template #bodyCell="{ column, record }">
                      <template v-if="column.key === 'createdAt'">
                        {{ formatDate(record.createdAt) }}
                      </template>
                      <template v-else-if="column.key === 'items'">
                        <span>
                          {{ record.items.map(i => i.courseTitle || i.titleSnapshot).join(', ') }}
                        </span>
                      </template>
                      <template v-else-if="column.key === 'total'">
                        {{ record.total.toFixed(2) }} {{ record.currency }}
                      </template>
                      <template v-else>
                        {{ record[column.dataIndex] }}
                      </template>
                    </template>
                  </a-table>
                </a-tab-pane>
              </a-tabs>
            </a-card>
          </a-col>

          <!-- SIDEBAR -->
          <a-col :span="8">
            <a-space
              direction="vertical"
              :size="16"
              class="portal-sidebar"
              style="width: 100%"
            >
              <a-card size="small" title="Quick stats">
                <a-descriptions :column="1" size="small">
                  <a-descriptions-item label="Departments">
                    {{ activeDepartments.length }} active
                  </a-descriptions-item>
                  <a-descriptions-item label="Classrooms">
                    {{ viewModel.classrooms.length }} total, {{ enrolledClassrooms.length }} mine
                  </a-descriptions-item>
                  <a-descriptions-item label="Courses">
                    {{ courses.length }} at this institution
                  </a-descriptions-item>
                  <a-descriptions-item label="Orders total">
                    {{ totalSpent.toFixed(2) }} {{ primaryCurrency }}
                  </a-descriptions-item>
                </a-descriptions>
              </a-card>

              <a-card size="small" title="Institution contact">
                <p class="institution-description">
                  {{ viewModel.institution.description || 'No description provided.' }}
                </p>
                <a-descriptions :column="1" size="small">
                  <a-descriptions-item label="Email">
                    {{ viewModel.institution.email || '—' }}
                  </a-descriptions-item>
                  <a-descriptions-item label="Phone">
                    {{ viewModel.institution.phone || '—' }}
                  </a-descriptions-item>
                  <a-descriptions-item label="Location">
                    {{ viewModel.institution.location || '—' }}
                  </a-descriptions-item>
                </a-descriptions>
              </a-card>

              <a-card size="small" title="System & metadata">
                <a-descriptions :column="1" size="small">
                  <a-descriptions-item label="Auth institution ID">
                    {{ viewModel.authInstitution?.id || '—' }}
                  </a-descriptions-item>
                  <a-descriptions-item label="Student ID">
                    {{ viewModel.student.id }}
                  </a-descriptions-item>
                  <a-descriptions-item label="User ID">
                    {{ viewModel.user.id }}
                  </a-descriptions-item>
                  <a-descriptions-item label="Student mirror ID">
                    {{ viewModel.studentMirror?.id || '—' }}
                  </a-descriptions-item>
                </a-descriptions>
              </a-card>
            </a-space>
          </a-col>
        </a-row>
      </template>

      <template v-else-if="error">
        <a-result status="error" title="Failed to load institution view">
          <template #subTitle>{{ error }}</template>
          <template #extra>
            <a-button type="primary" @click="load">Retry</a-button>
          </template>
        </a-result>
      </template>
    </a-skeleton>
  </div>
</template>

<script setup lang="ts">
/**
 * Institution Student Dashboard (mocked, schema-based)
 *
 * Drop into: plugins/institution-portal/nuxt/components/InstitutionStudentDashboard.vue
 * Use from a page like: <InstitutionStudentDashboard :institution-id="route.params.institution_id" />
 *
 * Only uses data derivable from the provided Prisma models:
 * - plugins/institutions (Institution, Department, Classroom, InstitutionMember, ClassroomEnrollment, InstitutionInvite)
 * - plugins/authentication (User, Institution, InstitutionUser)
 * - plugins/students-internal (Student, StudentCourse, StudentProgress, StudentNote, Course, KV, UserKV)
 * - plugins/teach-internal (Course, Module, Lesson, Classroom, Assignment, Submission)
 * - plugins/gradebook (GradebookEntry)
 * - plugins/ecommerce (Order, OrderItem, Payment, StudentMirror)
 * - plugins/teacher-course-lab (LabChallenge, LabSession, LabWorkspace, Submission)
 *
 * Data is fetched from /api/institution-portal/student-dashboard which aggregates cross-plugin APIs.
 */

import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRuntimeConfig } from '#imports'
import { message } from 'ant-design-vue'
import {
  ReloadOutlined,
  TeamOutlined,
  UserOutlined,
  BookOutlined,
  ClusterOutlined,
  ExperimentOutlined,
  ShoppingCartOutlined,
  DashboardOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons-vue'

/* ======== Types aligned with Prisma models (simplified for UI) ======== */

interface InstitutionModel {
  id: string
  name: string
  slug: string
  description?: string | null
  type?: string | null
  location?: string | null
  email?: string | null
  phone?: string | null
  active: boolean
  createdAt: string
  updatedAt: string
}

interface DepartmentModel {
  id: string
  institutionId: string
  name: string
  slug: string
  contact?: string | null
  head?: string | null
  active: boolean
  createdAt: string
  updatedAt: string
}

interface InstitutionClassroomModel {
  id: string
  institutionId: string
  departmentId?: string | null
  teacherId?: string | null
  title: string
  code: string
  capacity?: number | null
  status?: string | null
  startsAt?: string | null
  endsAt?: string | null
  createdAt: string
  updatedAt: string
}

interface ClassroomEnrollmentModel {
  id: string
  classroomId: string
  studentId: string
  status: string
  createdAt: string
  updatedAt: string
}

interface InstitutionMemberModel {
  id: string
  institutionId: string
  userId: string
  role: string
  status: string
  createdAt: string
  updatedAt: string
}

interface AuthInstitutionModel {
  id: string
  name: string
  domain?: string | null
  logoUrl?: string | null
  primaryColor?: string | null
  bannerUrl?: string | null
  createdAt: string
  updatedAt: string
}

interface UserModel {
  id: string
  email: string
  password: string
  firstName?: string | null
  lastName?: string | null
  role: string
  uiPrefsJson?: string | null
  teacherProfileId?: string | null
  uiPrefs?: unknown
  bannerUrl?: string | null
  primaryColor?: string | null
  createdAt: string
  updatedAt: string
}

interface StudentModel {
  id: string
  userId: string
  displayName?: string | null
  createdAt: string
  updatedAt: string
}

/* students-internal Course mirror */
interface StudentInternalCourseModel {
  id: string
  title: string
  description?: string | null
  progressPct: number
  createdAt: string
  updatedAt: string
}

interface StudentCourseModel {
  id: string
  studentId: string
  courseId: string
  completed: boolean
  progress: number
  enrolledAt: string
  updatedAt: string
}

interface StudentProgressModel {
  id: string
  studentId: string
  courseId: string
  moduleId?: string | null
  lessonId?: string | null
  completed: boolean
  score?: number | null
  progressPct: number
  updatedAt: string
  createdAt: string
}

interface StudentNoteModel {
  id: string
  studentId: string
  courseId: string
  body: string
  createdAt: string
  updatedAt: string
}

/* teach-internal */

interface TeachCourseModel {
  id: string
  teacherId: string
  title: string
  category?: string | null
  difficulty?: string | null
  description?: string | null
  price: number
  discount: number
  coverUrl?: string | null
  createdAt: string
  updatedAt: string
  institutionId?: string | null
}

interface TeachClassroomModel {
  id: string
  courseId: string
  institutionId?: string | null
  name: string
  startDate: string
  endDate: string
  createdAt: string
  updatedAt: string
}

interface AssignmentModel {
  id: string
  classroomId: string
  title: string
  description: string
  dueDate: string
  createdAt: string
  updatedAt: string
  acceptUntil?: string | null
  maxAttempts?: number | null
  latePenalty?: number | null
  rubric?: unknown
  gradingWeight?: number | null
}

interface TeachSubmissionModel {
  id: string
  assignmentId: string
  studentId: string
  fileUrl?: string | null
  grade?: number | null
  feedback?: string | null
  createdAt: string
  updatedAt: string
  gradedAt?: string | null
  graderId?: string | null
  rubric?: unknown
  comment?: string | null
  attempt?: number | null
  isLate?: boolean | null
  comments?: unknown
}

/* gradebook plugin */

interface GradebookEntryExternalModel {
  id: string
  courseId: string
  courseTitle?: string | null
  studentId: string
  studentDisplayName?: string | null
  assignmentId?: string | null
  assignmentTitle?: string | null
  score?: number | null
  maxScore?: number | null
  letter?: string | null
  feedback?: string | null
  metadata?: unknown
  createdAt: string
  updatedAt: string
}

/* ecommerce plugin */

interface StudentMirrorModel {
  id: string
  userId?: string | null
  displayName?: string | null
  createdAt: string
  updatedAt: string
}

interface OrderModel {
  id: string
  studentId: string
  email?: string | null
  currency: string
  subtotal: number
  discount: number
  total: number
  status: string
  createdAt: string
  updatedAt: string
}

interface OrderItemModel {
  id: string
  orderId: string
  courseId: string
  titleSnapshot: string
  priceSnapshot: number
  quantity: number
}

interface PaymentModel {
  id: string
  orderId: string
  provider?: string | null
  status: string
  amount: number
  payload?: unknown
  createdAt: string
}

/* teacher-course-lab */

interface LabChallengeModel {
  id: string
  title: string
  slug: string
  description: string
  difficulty: string
  starterRepoUrl?: string | null
  testsRepoUrl?: string | null
  runtime?: string | null
  createdByUserId: string
  visibility: string
  createdAt: string
  updatedAt: string
  courseId?: string | null
  moduleId?: string | null
  lessonId?: string | null
}

interface LabSessionModel {
  id: string
  userId: string
  challengeId: string
  status: string
  codeServerUrl?: string | null
  codeServerToken?: string | null
  appUrl?: string | null
  containerId?: string | null
  lastHeartbeat?: string | null
  createdAt: string
  updatedAt: string
}

/* ======== View model types ======== */

interface UnifiedClassroom {
  id: string
  title: string
  code: string
  departmentId?: string | null
  departmentName?: string | null
  institutionId: string
  capacity?: number | null
  status?: string | null
  startsAt?: string | null
  endsAt?: string | null
  courseId?: string | null
  courseTitle?: string | null
  isEnrolled: boolean
  enrollmentStatus?: string | null
  teacherId?: string | null
}

interface CourseSnapshot {
  courseId: string
  title: string
  category?: string | null
  difficulty?: string | null
  description?: string | null
  price: number
  discount: number
  coverUrl?: string | null
  progressPct: number
  completed: boolean
  gradePct?: number | null
  classroomCount: number
}

type AssignmentStatus = 'not-submitted' | 'submitted' | 'graded'

interface AssignmentSnapshot {
  id: string
  title: string
  description: string
  classroomId: string
  classroomName: string
  courseId?: string | null
  courseTitle?: string | null
  dueDate: string
  acceptUntil?: string | null
  maxAttempts?: number | null
  latePenalty?: number | null
  submissionStatus: AssignmentStatus
  grade?: number | null
  isLate?: boolean | null
}

interface LabSnapshot {
  sessionId: string
  status: string
  challengeId: string
  challengeTitle: string
  difficulty?: string | null
  runtime?: string | null
  courseId?: string | null
  courseTitle?: string | null
  codeServerUrl?: string | null
  appUrl?: string | null
  lastHeartbeat?: string | null
}

interface OrderSnapshotItem {
  id: string
  courseId: string
  titleSnapshot: string
  priceSnapshot: number
  quantity: number
  courseTitle?: string | null
}

interface OrderSnapshot {
  orderId: string
  createdAt: string
  total: number
  currency: string
  status: string
  items: OrderSnapshotItem[]
}

interface NoteSnapshot {
  id: string
  courseId: string
  courseTitle?: string | null
  body: string
  createdAt: string
}

interface StudentInstitutionViewModel {
  institution: InstitutionModel
  authInstitution: AuthInstitutionModel | null
  user: UserModel
  student: StudentModel
  member: InstitutionMemberModel | null
  departments: DepartmentModel[]
  classrooms: UnifiedClassroom[]
  classroomEnrollments: ClassroomEnrollmentModel[]
  courses: CourseSnapshot[]
  assignments: AssignmentSnapshot[]
  labs: LabSnapshot[]
  orders: OrderSnapshot[]
  gradebookEntries: GradebookEntryExternalModel[]
  notes: NoteSnapshot[]
  studentMirror: StudentMirrorModel | null
}

/* ======== Props / state ======== */

const props = defineProps<{
  institutionId?: string
  institutionSlug?: string
  mode?: 'student' | 'teacher' | 'admin'
}>()

const route = useRoute()
const runtime = useRuntimeConfig()
const apiBase = runtime.public?.apiBase || runtime.public?.appBaseUrl || ''

const resolvedInstitutionId = computed(() => {
  return (
    props.institutionId ||
    (route.params.institution_id as string | undefined) ||
    'inst_byway'
  )
})

const loading = ref(true)
const error = ref<string | null>(null)
const viewModel = ref<StudentInstitutionViewModel | null>(null)

const activeTab = ref<'overview' | 'departments' | 'courses' | 'labs' | 'orders'>(
  'overview',
)
const showOnlyMyClassrooms = ref(true)
const showOnlyOpenAssignments = ref(true)

/* ======== Formatting helpers ======== */

function formatDate(input?: string | Date | null): string {
  if (!input) return '—'
  const d = typeof input === 'string' ? new Date(input) : input
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  })
}

/* ======== Auth helpers ======== */

function resolveAuthHeader(): string | null {
  if (typeof window === 'undefined') return null
  const rawToken =
    localStorage.getItem('token') ||
    localStorage.getItem('access_token') ||
    ''
  if (!rawToken) return null
  return rawToken.startsWith('Bearer') ? rawToken : `Bearer ${rawToken}`
}

/* ======== Loading & reactive derived data ======== */

async function load() {
  loading.value = true
  error.value = null
  try {
    const authToken = resolveAuthHeader()
    if (!authToken) {
      throw new Error('Missing auth token')
    }

    const params = new URLSearchParams()
    if (resolvedInstitutionId.value) {
      params.set('institutionId', resolvedInstitutionId.value)
    }
    const baseUrl = apiBase ? apiBase.replace(/\/$/, '') : ''
    const endpoint = `${baseUrl}/api/institution-portal/student-dashboard`
    const targetUrl = params.toString() ? `${endpoint}?${params.toString()}` : endpoint
    const resp = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: authToken,
      },
    })
    if (!resp.ok) {
      const text = await resp.text().catch(() => '')
      throw new Error(text || `HTTP ${resp.status}`)
    }
    const json = await resp.json()
    viewModel.value = json
  } catch (err: any) {
    console.error(err)
    error.value = err?.message ?? 'Failed to load institution portal view'
    message.error(error.value)
  } finally {
    loading.value = false
  }
}

onMounted(load)
watch(resolvedInstitutionId, () => load())

const activeDepartments = computed(
  () => viewModel.value?.departments.filter((d) => d.active) ?? [],
)

const activeClassrooms = computed(
  () => viewModel.value?.classrooms.filter((c) => c.status === 'ACTIVE') ?? [],
)

const enrolledClassrooms = computed(
  () => viewModel.value?.classrooms.filter((c) => c.isEnrolled) ?? [],
)

const filteredClassrooms = computed(() => {
  const base = showOnlyMyClassrooms.value
    ? enrolledClassrooms.value
    : viewModel.value?.classrooms ?? []
  return base.slice().sort((a, b) => a.title.localeCompare(b.title))
})

function classroomsByDepartment(deptId: string): UnifiedClassroom[] {
  return filteredClassrooms.value.filter((c) => c.departmentId === deptId)
}

const classroomsWithoutDepartment = computed(() =>
  filteredClassrooms.value.filter((c) => !c.departmentId),
)

const courses = computed(() => viewModel.value?.courses ?? [])

const completedCoursesCount = computed(
  () => courses.value.filter((c) => c.completed).length,
)

const averageCourseProgress = computed(() => {
  if (!courses.value.length) return 0
  const sum = courses.value.reduce((acc, c) => acc + c.progressPct, 0)
  return Math.round(sum / courses.value.length)
})

const gradeAveragePct = computed(() => {
  const entries = viewModel.value?.gradebookEntries ?? []
  const valid = entries.filter(
    (e) =>
      typeof e.score === 'number' &&
      typeof e.maxScore === 'number' &&
      (e.maxScore as number) > 0,
  )
  if (!valid.length) return 0
  const sumPct = valid.reduce(
    (acc, e) => acc + ((e.score as number) / (e.maxScore as number)) * 100,
    0,
  )
  return Math.round(sumPct / valid.length)
})

const upcomingAssignments = computed(() => {
  const nowTs = Date.now()
  const all = viewModel.value?.assignments ?? []
  return all
    .filter((a) => {
      const dueTs = new Date(a.dueDate).getTime()
      if (showOnlyOpenAssignments.value) {
        return dueTs >= nowTs && a.submissionStatus !== 'graded'
      }
      return true
    })
    .sort(
      (a, b) =>
        new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
    )
    .slice(0, 5)
})

const recentLabs = computed(() => {
  const all = viewModel.value?.labs ?? []
  return all
    .slice()
    .sort((a, b) => {
      const ta = a.lastHeartbeat ? new Date(a.lastHeartbeat).getTime() : 0
      const tb = b.lastHeartbeat ? new Date(b.lastHeartbeat).getTime() : 0
      return tb - ta
    })
    .slice(0, 5)
})

const runningLabsCount = computed(
  () => (viewModel.value?.labs ?? []).filter((l) => l.status === 'running').length,
)

const totalOrders = computed(() => viewModel.value?.orders.length ?? 0)

const totalSpent = computed(() =>
  (viewModel.value?.orders ?? []).reduce((sum, o) => sum + o.total, 0),
)

const primaryCurrency = computed(
  () => viewModel.value?.orders[0]?.currency ?? 'EUR',
)

const studentDisplayName = computed(() => {
  if (!viewModel.value) return 'Student'
  return (
    viewModel.value.student.displayName ||
    `${viewModel.value.user.firstName ?? ''} ${
      viewModel.value.user.lastName ?? ''
    }`.trim() ||
    viewModel.value.user.email
  )
})

const studentInitials = computed(() => {
  const name = studentDisplayName.value
  const parts = name.split(' ').filter(Boolean)
  if (!parts.length) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
})

const memberRoleLabel = computed(() => {
  const role = viewModel.value?.member?.role || 'student'
  return role.charAt(0).toUpperCase() + role.slice(1)
})

const lastActivityDisplay = computed(() => {
  const entries = viewModel.value?.gradebookEntries ?? []
  if (!entries.length) return '—'
  const tsList = entries.map((e) =>
    new Date(e.updatedAt || e.createdAt).getTime(),
  )
  const maxTs = Math.max(...tsList)
  if (!Number.isFinite(maxTs)) return '—'
  return formatDate(new Date(maxTs))
})

/* Tables */

const courseColumns = [
  { title: 'Course', dataIndex: 'title', key: 'title' },
  { title: 'Category', dataIndex: 'category', key: 'category' },
  { title: 'Difficulty', dataIndex: 'difficulty', key: 'difficulty' },
  { title: 'Progress', dataIndex: 'progressPct', key: 'progress' },
  { title: 'Grade', dataIndex: 'gradePct', key: 'grade' },
  { title: 'Classrooms', dataIndex: 'classroomCount', key: 'classrooms' },
]

const assignmentColumns = [
  { title: 'Title', dataIndex: 'title', key: 'title' },
  { title: 'Course', dataIndex: 'courseTitle', key: 'courseTitle' },
  { title: 'Classroom', dataIndex: 'classroomName', key: 'classroomName' },
  { title: 'Due', dataIndex: 'dueDate', key: 'dueDate' },
  { title: 'Status', dataIndex: 'submissionStatus', key: 'submissionStatus' },
]

const assignmentColumnsDetailed = [
  { title: 'Title', dataIndex: 'title', key: 'title' },
  { title: 'Course', dataIndex: 'courseTitle', key: 'courseTitle' },
  { title: 'Classroom', dataIndex: 'classroomName', key: 'classroomName' },
  { title: 'Due', dataIndex: 'dueDate', key: 'dueDate' },
  { title: 'Status', dataIndex: 'submissionStatus', key: 'status' },
  { title: 'Grade', dataIndex: 'grade', key: 'grade' },
]

const orderColumns = [
  { title: 'Order ID', dataIndex: 'orderId', key: 'orderId' },
  { title: 'Date', dataIndex: 'createdAt', key: 'createdAt' },
  { title: 'Items', dataIndex: 'items', key: 'items' },
  { title: 'Total', dataIndex: 'total', key: 'total' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
]
</script>

<style scoped>
.institution-student-portal {
  padding: 16px;
}

.portal-page-header {
  background: transparent;
  padding: 0 0 16px 0;
}

.portal-header-row {
  margin-top: 16px;
}

.portal-header-card {
  min-height: 120px;
}

.student-card {
  min-height: 120px;
}

.student-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar-circle {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  background: #e6f4ff;
  color: #1677ff;
}

.student-meta {
  flex: 1;
}

.student-name {
  font-weight: 600;
}

.student-email {
  font-size: 12px;
  color: #999;
}

.student-role {
  margin-top: 4px;
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.tag-icon {
  margin-right: 4px;
}

.stat-icon,
.section-icon {
  margin-right: 6px;
}

.portal-layout {
  margin-top: 8px;
}

.portal-main-card {
  min-height: 360px;
}

.portal-sidebar {
  margin-top: 0;
}

.institution-description {
  margin-bottom: 8px;
  color: #555;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.section-title {
  font-weight: 600;
}

.filter-label {
  font-size: 12px;
  color: #999;
}

.dept-meta {
  margin-bottom: 8px;
  color: #777;
}

.classroom-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.classroom-title {
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
}

.classroom-meta {
  font-size: 12px;
  color: #777;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.lab-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.lab-title {
  font-weight: 500;
}

.lab-meta {
  font-size: 12px;
  color: #777;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.note-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.note-course {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
}

.note-body {
  font-size: 12px;
  color: #555;
}

.note-date {
  font-size: 11px;
  color: #999;
}
</style>
