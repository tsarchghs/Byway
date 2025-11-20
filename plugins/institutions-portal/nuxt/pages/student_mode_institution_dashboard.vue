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
 * Currently fully mocked; replace buildMockViewModel() with real cross-plugin API later.
 */

import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from '#imports'
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

/* ======== Mock builder (replace with real API later) ======== */

function buildMockViewModel(institutionId: string): StudentInstitutionViewModel {
  const now = new Date()
  const nowIso = now.toISOString()
  const daysAgo = (n: number) =>
    new Date(now.getTime() - n * 24 * 60 * 60 * 1000).toISOString()
  const daysFromNow = (n: number) =>
    new Date(now.getTime() + n * 24 * 60 * 60 * 1000).toISOString()

  const institution: InstitutionModel = {
    id: institutionId,
    name: 'Byway Institute of Technology',
    slug: 'byway-tech',
    description:
      'A demo institution representing how institution-scoped student data is aggregated across plugins.',
    type: 'University',
    location: 'Remote / Online',
    email: 'info@byway.tech',
    phone: '+49 000 000000',
    active: true,
    createdAt: daysAgo(180),
    updatedAt: nowIso,
  }

  const authInstitution: AuthInstitutionModel = {
    id: institutionId,
    name: institution.name,
    domain: 'byway.tech',
    logoUrl: null,
    primaryColor: '#1677ff',
    bannerUrl: null,
    createdAt: institution.createdAt,
    updatedAt: institution.updatedAt,
  }

  const user: UserModel = {
    id: 'user_student_1',
    email: 'student@example.com',
    password: 'hashed-password',
    firstName: 'Sam',
    lastName: 'Student',
    role: 'STUDENT',
    uiPrefsJson: null,
    teacherProfileId: null,
    uiPrefs: {},
    bannerUrl: null,
    primaryColor: authInstitution.primaryColor,
    createdAt: daysAgo(200),
    updatedAt: nowIso,
  }

  const student: StudentModel = {
    id: 'student_1',
    userId: user.id,
    displayName: 'Sam Student',
    createdAt: daysAgo(190),
    updatedAt: nowIso,
  }

  const member: InstitutionMemberModel = {
    id: 'member_1',
    institutionId,
    userId: user.id,
    role: 'student',
    status: 'ACTIVE',
    createdAt: daysAgo(180),
    updatedAt: nowIso,
  }

  const departments: DepartmentModel[] = [
    {
      id: 'dept_cs',
      institutionId,
      name: 'Computer Science',
      slug: 'cs',
      contact: 'cs-office@byway.tech',
      head: 'Dr. Ada Lovelace',
      active: true,
      createdAt: daysAgo(180),
      updatedAt: nowIso,
    },
    {
      id: 'dept_math',
      institutionId,
      name: 'Mathematics',
      slug: 'math',
      contact: 'math-office@byway.tech',
      head: 'Dr. Emmy Noether',
      active: true,
      createdAt: daysAgo(180),
      updatedAt: nowIso,
    },
    {
      id: 'dept_hum',
      institutionId,
      name: 'Humanities',
      slug: 'hum',
      contact: 'hum-office@byway.tech',
      head: 'Prof. Virginia Woolf',
      active: true,
      createdAt: daysAgo(180),
      updatedAt: nowIso,
    },
  ]

  const instClassrooms: InstitutionClassroomModel[] = [
    {
      id: 'class_cs101',
      institutionId,
      departmentId: 'dept_cs',
      teacherId: 'user_teacher_1',
      title: 'CS101 – Intro to Programming',
      code: 'CS101-A',
      capacity: 30,
      status: 'ACTIVE',
      startsAt: daysAgo(14),
      endsAt: daysFromNow(90),
      createdAt: daysAgo(60),
      updatedAt: nowIso,
    },
    {
      id: 'class_cs102',
      institutionId,
      departmentId: 'dept_cs',
      teacherId: 'user_teacher_1',
      title: 'CS102 – Web Development Lab',
      code: 'CS102-B',
      capacity: 24,
      status: 'ACTIVE',
      startsAt: daysAgo(7),
      endsAt: daysFromNow(60),
      createdAt: daysAgo(45),
      updatedAt: nowIso,
    },
    {
      id: 'class_math101',
      institutionId,
      departmentId: 'dept_math',
      teacherId: 'user_teacher_2',
      title: 'MATH101 – Calculus I',
      code: 'MATH101-A',
      capacity: 40,
      status: 'ACTIVE',
      startsAt: daysAgo(14),
      endsAt: daysFromNow(90),
      createdAt: daysAgo(60),
      updatedAt: nowIso,
    },
    {
      id: 'class_hum101',
      institutionId,
      departmentId: 'dept_hum',
      teacherId: 'user_teacher_3',
      title: 'HUM101 – Academic Writing',
      code: 'HUM101-A',
      capacity: 20,
      status: 'ARCHIVED',
      startsAt: daysAgo(365),
      endsAt: daysAgo(180),
      createdAt: daysAgo(400),
      updatedAt: daysAgo(180),
    },
  ]

  const classroomEnrollments: ClassroomEnrollmentModel[] = [
    {
      id: 'enroll_cs101',
      classroomId: 'class_cs101',
      studentId: student.id,
      status: 'ENROLLED',
      createdAt: daysAgo(60),
      updatedAt: nowIso,
    },
    {
      id: 'enroll_cs102',
      classroomId: 'class_cs102',
      studentId: student.id,
      status: 'ENROLLED',
      createdAt: daysAgo(45),
      updatedAt: nowIso,
    },
    {
      id: 'enroll_math101',
      classroomId: 'class_math101',
      studentId: student.id,
      status: 'INVITED',
      createdAt: daysAgo(30),
      updatedAt: daysAgo(10),
    },
  ]

  const teachCourses: TeachCourseModel[] = [
    {
      id: 'course_intro',
      teacherId: 'user_teacher_1',
      title: 'Intro to Programming with JavaScript',
      category: 'Computer Science',
      difficulty: 'Beginner',
      description: 'Learn basic programming concepts with JavaScript.',
      price: 0,
      discount: 0,
      coverUrl: null,
      createdAt: daysAgo(90),
      updatedAt: nowIso,
      institutionId,
    },
    {
      id: 'course_web',
      teacherId: 'user_teacher_1',
      title: 'Modern Web Development',
      category: 'Computer Science',
      difficulty: 'Intermediate',
      description: 'Build responsive SPAs and APIs.',
      price: 49,
      discount: 10,
      coverUrl: null,
      createdAt: daysAgo(80),
      updatedAt: nowIso,
      institutionId,
    },
    {
      id: 'course_calc',
      teacherId: 'user_teacher_2',
      title: 'Calculus I',
      category: 'Mathematics',
      difficulty: 'Intermediate',
      description: 'Limits, derivatives, and integrals.',
      price: 39,
      discount: 0,
      coverUrl: null,
      createdAt: daysAgo(90),
      updatedAt: nowIso,
      institutionId,
    },
  ]

  const teachClassrooms: TeachClassroomModel[] = [
    {
      id: 'class_cs101',
      courseId: 'course_intro',
      institutionId,
      name: 'CS101 – Group A',
      startDate: instClassrooms[0].startsAt!,
      endDate: instClassrooms[0].endsAt!,
      createdAt: instClassrooms[0].createdAt,
      updatedAt: instClassrooms[0].updatedAt,
    },
    {
      id: 'class_cs102',
      courseId: 'course_web',
      institutionId,
      name: 'CS102 – Lab Group',
      startDate: instClassrooms[1].startsAt!,
      endDate: instClassrooms[1].endsAt!,
      createdAt: instClassrooms[1].createdAt,
      updatedAt: instClassrooms[1].updatedAt,
    },
    {
      id: 'class_math101',
      courseId: 'course_calc',
      institutionId,
      name: 'MATH101 – Main Group',
      startDate: instClassrooms[2].startsAt!,
      endDate: instClassrooms[2].endsAt!,
      createdAt: instClassrooms[2].createdAt,
      updatedAt: instClassrooms[2].updatedAt,
    },
  ]

  const assignments: AssignmentModel[] = [
    {
      id: 'assign_cs101_hw1',
      classroomId: 'class_cs101',
      title: 'Homework 1 – Basic JS',
      description: 'Variables, conditionals, and loops.',
      dueDate: daysFromNow(3),
      createdAt: daysAgo(5),
      updatedAt: daysAgo(1),
      acceptUntil: daysFromNow(5),
      maxAttempts: 2,
      latePenalty: 0.1,
      rubric: null,
      gradingWeight: 0.2,
    },
    {
      id: 'assign_cs102_proj',
      classroomId: 'class_cs102',
      title: 'Project – Personal Landing Page',
      description: 'Build a responsive landing page.',
      dueDate: daysFromNow(10),
      createdAt: daysAgo(2),
      updatedAt: daysAgo(1),
      acceptUntil: daysFromNow(12),
      maxAttempts: 1,
      latePenalty: 0.2,
      rubric: null,
      gradingWeight: 0.4,
    },
    {
      id: 'assign_math101_quiz',
      classroomId: 'class_math101',
      title: 'Quiz – Limits',
      description: 'Short quiz on limits and continuity.',
      dueDate: daysAgo(1),
      createdAt: daysAgo(14),
      updatedAt: daysAgo(2),
      acceptUntil: daysFromNow(1),
      maxAttempts: 1,
      latePenalty: 0.3,
      rubric: null,
      gradingWeight: 0.1,
    },
  ]

  const assignmentSubmissions: TeachSubmissionModel[] = [
    {
      id: 'sub_cs101_hw1',
      assignmentId: 'assign_cs101_hw1',
      studentId: student.id,
      fileUrl: 'https://example.com/submissions/cs101-hw1.zip',
      grade: 92,
      feedback: 'Great job!',
      createdAt: daysAgo(1),
      updatedAt: nowIso,
      gradedAt: nowIso,
      graderId: 'user_teacher_1',
      rubric: null,
      comment: 'Nice style and variable naming.',
      attempt: 1,
      isLate: false,
      comments: null,
    },
    {
      id: 'sub_cs102_proj',
      assignmentId: 'assign_cs102_proj',
      studentId: student.id,
      fileUrl: 'https://example.com/submissions/cs102-proj.zip',
      grade: null,
      feedback: null,
      createdAt: daysAgo(1),
      updatedAt: daysAgo(1),
      gradedAt: null,
      graderId: null,
      rubric: null,
      comment: null,
      attempt: 1,
      isLate: false,
      comments: null,
    },
  ]

  const studentInternalCourses: StudentInternalCourseModel[] = [
    {
      id: 'course_intro',
      title: teachCourses[0].title,
      description: teachCourses[0].description,
      progressPct: 65,
      createdAt: teachCourses[0].createdAt,
      updatedAt: nowIso,
    },
    {
      id: 'course_web',
      title: teachCourses[1].title,
      description: teachCourses[1].description,
      progressPct: 35,
      createdAt: teachCourses[1].createdAt,
      updatedAt: nowIso,
    },
    {
      id: 'course_calc',
      title: teachCourses[2].title,
      description: teachCourses[2].description,
      progressPct: 10,
      createdAt: teachCourses[2].createdAt,
      updatedAt: nowIso,
    },
  ]

  const studentCourses: StudentCourseModel[] = [
    {
      id: 'sc_course_intro',
      studentId: student.id,
      courseId: 'course_intro',
      completed: false,
      progress: 65,
      enrolledAt: daysAgo(60),
      updatedAt: nowIso,
    },
    {
      id: 'sc_course_web',
      studentId: student.id,
      courseId: 'course_web',
      completed: false,
      progress: 35,
      enrolledAt: daysAgo(45),
      updatedAt: nowIso,
    },
    {
      id: 'sc_course_calc',
      studentId: student.id,
      courseId: 'course_calc',
      completed: false,
      progress: 10,
      enrolledAt: daysAgo(30),
      updatedAt: nowIso,
    },
  ]

  const studentProgress: StudentProgressModel[] = [
    {
      id: 'prog_intro_mod1',
      studentId: student.id,
      courseId: 'course_intro',
      moduleId: 'mod_intro_1',
      lessonId: 'lesson_intro_1',
      completed: true,
      score: 95,
      progressPct: 100,
      createdAt: daysAgo(40),
      updatedAt: daysAgo(39),
    },
    {
      id: 'prog_intro_mod2',
      studentId: student.id,
      courseId: 'course_intro',
      moduleId: 'mod_intro_2',
      lessonId: 'lesson_intro_2',
      completed: false,
      score: 70,
      progressPct: 50,
      createdAt: daysAgo(30),
      updatedAt: daysAgo(10),
    },
  ]

  const studentNotes: StudentNoteModel[] = [
    {
      id: 'note_intro_1',
      studentId: student.id,
      courseId: 'course_intro',
      body: 'Remember to review loops and conditionals before the quiz.',
      createdAt: daysAgo(5),
      updatedAt: daysAgo(5),
    },
    {
      id: 'note_web_1',
      studentId: student.id,
      courseId: 'course_web',
      body: 'Landing page layout: focus on mobile breakpoint first.',
      createdAt: daysAgo(2),
      updatedAt: daysAgo(2),
    },
  ]

  const gradebookEntries: GradebookEntryExternalModel[] = [
    {
      id: 'gb_intro_hw1',
      courseId: 'course_intro',
      courseTitle: teachCourses[0].title,
      studentId: student.id,
      studentDisplayName: student.displayName,
      assignmentId: 'assign_cs101_hw1',
      assignmentTitle: assignments[0].title,
      score: 92,
      maxScore: 100,
      letter: 'A-',
      feedback: 'Great job!',
      metadata: null,
      createdAt: assignmentSubmissions[0].createdAt,
      updatedAt: assignmentSubmissions[0].updatedAt,
    },
    {
      id: 'gb_intro_quiz1',
      courseId: 'course_intro',
      courseTitle: teachCourses[0].title,
      studentId: student.id,
      studentDisplayName: student.displayName,
      assignmentId: null,
      assignmentTitle: 'Quiz #1',
      score: 88,
      maxScore: 100,
      letter: 'B+',
      feedback: 'Good understanding overall.',
      metadata: null,
      createdAt: daysAgo(7),
      updatedAt: daysAgo(7),
    },
    {
      id: 'gb_calc_quiz',
      courseId: 'course_calc',
      courseTitle: teachCourses[2].title,
      studentId: student.id,
      studentDisplayName: student.displayName,
      assignmentId: 'assign_math101_quiz',
      assignmentTitle: assignments[2].title,
      score: 75,
      maxScore: 100,
      letter: 'C+',
      feedback: 'Review limits and continuity.',
      metadata: null,
      createdAt: daysAgo(1),
      updatedAt: daysAgo(1),
    },
  ]

  const studentMirror: StudentMirrorModel = {
    id: 'student_mirror_1',
    userId: user.id,
    displayName: student.displayName,
    createdAt: daysAgo(190),
    updatedAt: nowIso,
  }

  const orders: OrderModel[] = [
    {
      id: 'order_1',
      studentId: studentMirror.id,
      email: user.email,
      currency: 'EUR',
      subtotal: 49,
      discount: 10,
      total: 39,
      status: 'PAID',
      createdAt: daysAgo(20),
      updatedAt: daysAgo(20),
    },
    {
      id: 'order_2',
      studentId: studentMirror.id,
      email: user.email,
      currency: 'EUR',
      subtotal: 39,
      discount: 0,
      total: 39,
      status: 'PAID',
      createdAt: daysAgo(10),
      updatedAt: daysAgo(10),
    },
  ]

  const orderItems: OrderItemModel[] = [
    {
      id: 'order_1_item_1',
      orderId: 'order_1',
      courseId: 'course_web',
      titleSnapshot: teachCourses[1].title,
      priceSnapshot: 49,
      quantity: 1,
    },
    {
      id: 'order_2_item_1',
      orderId: 'order_2',
      courseId: 'course_calc',
      titleSnapshot: teachCourses[2].title,
      priceSnapshot: 39,
      quantity: 1,
    },
  ]

  const labChallenges: LabChallengeModel[] = [
    {
      id: 'lab_challenge_fizzbuzz',
      title: 'FizzBuzz Challenge',
      slug: 'fizzbuzz',
      description: 'Implement FizzBuzz with tests.',
      difficulty: 'Beginner',
      starterRepoUrl: 'https://github.com/example/fizzbuzz-starter',
      testsRepoUrl: 'https://github.com/example/fizzbuzz-tests',
      runtime: 'node18',
      createdByUserId: 'user_teacher_1',
      visibility: 'course',
      createdAt: daysAgo(30),
      updatedAt: nowIso,
      courseId: 'course_intro',
      moduleId: null,
      lessonId: null,
    },
    {
      id: 'lab_challenge_landing',
      title: 'Landing Page Lab',
      slug: 'landing-page',
      description: 'Build a responsive landing page with HTML/CSS.',
      difficulty: 'Intermediate',
      starterRepoUrl: 'https://github.com/example/landing-starter',
      testsRepoUrl: null,
      runtime: 'node18',
      createdByUserId: 'user_teacher_1',
      visibility: 'course',
      createdAt: daysAgo(20),
      updatedAt: nowIso,
      courseId: 'course_web',
      moduleId: null,
      lessonId: null,
    },
  ]

  const labSessions: LabSessionModel[] = [
    {
      id: 'lab_session_1',
      userId: user.id,
      challengeId: 'lab_challenge_fizzbuzz',
      status: 'running',
      codeServerUrl: 'http://codeserver.localhost/student/fizzbuzz',
      codeServerToken: 'mock-token',
      appUrl: 'http://codeserver.localhost/student/fizzbuzz/app',
      containerId: 'container_1',
      lastHeartbeat: daysAgo(0.1),
      createdAt: daysAgo(1),
      updatedAt: nowIso,
    },
    {
      id: 'lab_session_2',
      userId: user.id,
      challengeId: 'lab_challenge_landing',
      status: 'stopped',
      codeServerUrl: 'http://codeserver.localhost/student/landing',
      codeServerToken: 'mock-token',
      appUrl: null,
      containerId: 'container_2',
      lastHeartbeat: daysAgo(2),
      createdAt: daysAgo(3),
      updatedAt: daysAgo(2),
    },
  ]

  // Unify institution + teach classrooms
  const unifiedClassrooms: UnifiedClassroom[] = instClassrooms.map((ic) => {
    const tc = teachClassrooms.find((t) => t.id === ic.id)
    const course = tc ? teachCourses.find((c) => c.id === tc.courseId) : undefined
    const enrollment = classroomEnrollments.find(
      (e) => e.classroomId === ic.id && e.studentId === student.id,
    )

    const dept = ic.departmentId
      ? departments.find((d) => d.id === ic.departmentId)
      : undefined

    return {
      id: ic.id,
      title: ic.title,
      code: ic.code,
      departmentId: ic.departmentId ?? null,
      departmentName: dept?.name ?? null,
      institutionId: ic.institutionId,
      capacity: ic.capacity ?? null,
      status: ic.status ?? null,
      startsAt: ic.startsAt ?? null,
      endsAt: ic.endsAt ?? null,
      courseId: course?.id ?? null,
      courseTitle: course?.title ?? null,
      isEnrolled: !!enrollment && enrollment.status !== 'DROPPED',
      enrollmentStatus: enrollment?.status ?? null,
      teacherId: ic.teacherId ?? null,
    }
  })

  const courses: CourseSnapshot[] = teachCourses.map((course) => {
    const sc = studentCourses.find(
      (s) => s.courseId === course.id && s.studentId === student.id,
    )
    const relevantGrades = gradebookEntries.filter(
      (g) => g.courseId === course.id && g.studentId === student.id,
    )
    let gradePct: number | null = null
    const graded = relevantGrades.filter(
      (g) =>
        typeof g.score === 'number' &&
        typeof g.maxScore === 'number' &&
        (g.maxScore as number) > 0,
    )
    if (graded.length) {
      const sum = graded.reduce((acc, g) => acc + ((g.score as number) / (g.maxScore as number)) * 100, 0)
      gradePct = sum / graded.length
    }

    const classroomCount = teachClassrooms.filter(
      (c) => c.courseId === course.id,
    ).length

    const progressPct = sc ? sc.progress : 0
    const completed = !!sc?.completed

    return {
      courseId: course.id,
      title: course.title,
      category: course.category,
      difficulty: course.difficulty,
      description: course.description,
      price: course.price,
      discount: course.discount,
      coverUrl: course.coverUrl,
      progressPct,
      completed,
      gradePct,
      classroomCount,
    }
  })

  const assignmentsSnapshots: AssignmentSnapshot[] = assignments.map((a) => {
    const classroom = teachClassrooms.find((c) => c.id === a.classroomId)
    const course = classroom
      ? teachCourses.find((c) => c.id === classroom.courseId)
      : undefined
    const submission = assignmentSubmissions.find(
      (s) => s.assignmentId === a.id && s.studentId === student.id,
    )
    const gbEntry = gradebookEntries.find(
      (g) => g.assignmentId === a.id && g.studentId === student.id,
    )

    let submissionStatus: AssignmentStatus = 'not-submitted'
    if (submission) {
      submissionStatus = submission.grade != null ? 'graded' : 'submitted'
    }

    return {
      id: a.id,
      title: a.title,
      description: a.description,
      classroomId: a.classroomId,
      classroomName: classroom?.name || 'Classroom',
      courseId: course?.id ?? null,
      courseTitle: course?.title ?? null,
      dueDate: a.dueDate,
      acceptUntil: a.acceptUntil ?? null,
      maxAttempts: a.maxAttempts ?? null,
      latePenalty: a.latePenalty ?? null,
      submissionStatus,
      grade: submission?.grade ?? gbEntry?.score ?? null,
      isLate: submission?.isLate ?? null,
    }
  })

  const labsSnapshots: LabSnapshot[] = labSessions
    .filter((s) => s.userId === user.id)
    .map((s) => {
      const challenge = labChallenges.find((c) => c.id === s.challengeId)!
      const course = challenge.courseId
        ? teachCourses.find((c) => c.id === challenge.courseId)
        : undefined
      return {
        sessionId: s.id,
        status: s.status,
        challengeId: s.challengeId,
        challengeTitle: challenge.title,
        difficulty: challenge.difficulty,
        runtime: challenge.runtime ?? null,
        courseId: challenge.courseId ?? null,
        courseTitle: course?.title ?? null,
        codeServerUrl: s.codeServerUrl ?? null,
        appUrl: s.appUrl ?? null,
        lastHeartbeat: s.lastHeartbeat ?? null,
      }
    })

  const ordersSnapshots: OrderSnapshot[] = orders.map((o) => {
    const items = orderItems
      .filter((i) => i.orderId === o.id)
      .map<OrderSnapshotItem>((i) => {
        const course = teachCourses.find((c) => c.id === i.courseId)
        return {
          id: i.id,
          courseId: i.courseId,
          titleSnapshot: i.titleSnapshot,
          priceSnapshot: i.priceSnapshot,
          quantity: i.quantity,
          courseTitle: course?.title ?? null,
        }
      })
    return {
      orderId: o.id,
      createdAt: o.createdAt,
      total: o.total,
      currency: o.currency,
      status: o.status,
      items,
    }
  })

  const notesSnapshots: NoteSnapshot[] = studentNotes.map((n) => {
    const course = studentInternalCourses.find((c) => c.id === n.courseId)
    return {
      id: n.id,
      courseId: n.courseId,
      courseTitle: course?.title ?? null,
      body: n.body,
      createdAt: n.createdAt,
    }
  })

  return {
    institution,
    authInstitution,
    user,
    student,
    member,
    departments,
    classrooms: unifiedClassrooms,
    classroomEnrollments,
    courses,
    assignments: assignmentsSnapshots,
    labs: labsSnapshots,
    orders: ordersSnapshots,
    gradebookEntries,
    notes: notesSnapshots,
    studentMirror,
  }
}

/* ======== Loading & reactive derived data ======== */

async function load() {
  loading.value = true
  error.value = null
  try {
    viewModel.value = buildMockViewModel(resolvedInstitutionId.value)
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
