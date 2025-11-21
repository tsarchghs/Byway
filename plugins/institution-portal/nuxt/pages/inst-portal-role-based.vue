<template>
  <div class="institution-role-portal" :class="themeClass">
    <div v-if="initialLoading" class="portal-state portal-state--loading">
      <a-spin tip="Synchronizing institution insights..." />
    </div>

    <div v-else-if="loadError" class="portal-state">
      <a-result
        status="warning"
        title="Unable to load institution portal"
        :sub-title="loadError"
      >
        <template #extra>
          <a-button type="primary" @click="handleRefresh">
            <ReloadOutlined /> Try again
          </a-button>
        </template>
      </a-result>
    </div>

    <div v-else-if="!activeInstitution" class="portal-state">
      <a-result
        status="404"
        title="Institution not found"
        sub-title="The ID in the URL does not match any institution you have access to."
      >
        <template #extra>
          <a-button type="primary" @click="goFallbackInstitution">
            Jump to default institution
          </a-button>
        </template>
      </a-result>
    </div>

    <div v-else class="portal-shell">
      <header class="portal-hero">
        <div class="portal-hero__left">
          <p class="eyebrow">Institution control room</p>
          <h1>{{ activeInstitution.name }}</h1>
          <p class="hero-subtitle">{{ heroSubtitle }}</p>

          <ul class="hero-meta">
            <li>
              <TeamOutlined />
              {{ activeInstitution.type || 'Comprehensive campus' }} ·
              {{ activeInstitution.location || 'Location TBC' }}
            </li>
            <li>
              <ApartmentOutlined />
              {{ institutionDepartments.length }} departments ·
              {{ institutionClassrooms.length }} classrooms
            </li>
            <li>
              <SafetyCertificateOutlined />
              {{ roleViewDescription }}
            </li>
          </ul>
        </div>

        <div class="portal-hero__right">
          <div class="hero-controls">
            <a-switch
              v-model:checked="isDarkMode"
              checked-children="Dark"
              un-checked-children="Light"
            />
            <a-select
              class="role-select"
              :value="roleControlValue"
              style="width: 200px"
              :options="roleSelectOptions"
              @change="handleRoleSelect"
            />
          </div>

          <div class="hero-actions">
            <a-button
              type="primary"
              @click="openAdminModal('department')"
              v-if="isAdminView"
            >
              <ClusterOutlined /> New department plan
            </a-button>
            <a-button v-if="isAdminView" @click="openAdminModal('classroom')">
              <ApartmentOutlined /> Add classroom shell
            </a-button>
            <a-button v-if="isTeacherView" @click="openTeachingDrawerFromHero">
              <BookOutlined /> Teaching playbook
            </a-button>
            <a-button v-if="isStudentView" @click="focusTab = 'students'">
              <FieldTimeOutlined /> Learner spotlight
            </a-button>
          </div>

          <p class="hero-updated">Last synced: {{ lastSyncedLabel }}</p>
        </div>
      </header>

      <section class="role-narrative">
        <div class="role-narrative__copy">
          <p class="role-narrative__badge">{{ roleNarrative.badge }}</p>
          <h2>{{ roleNarrative.title }}</h2>
          <p>{{ roleNarrative.description }}</p>
          <p class="role-narrative__helper">{{ roleNarrative.helper }}</p>
        </div>
        <div class="role-narrative__spotlights">
          <a-card
            v-for="spotlight in roleSpotlights"
            :key="spotlight.id"
            class="spotlight-card"
            :bordered="false"
          >
            <div class="spotlight-card__icon">
              <component :is="spotlight.icon" />
            </div>
            <div class="spotlight-card__content">
              <p class="spotlight-card__title">{{ spotlight.title }}</p>
              <p class="spotlight-card__detail">{{ spotlight.detail }}</p>
            </div>
            <p class="spotlight-card__metric">{{ spotlight.metric }}</p>
          </a-card>
        </div>
      </section>

      <section class="stat-grid" aria-label="Key indicators">
        <a-card
          v-for="stat in heroStats"
          :key="stat.id"
          class="stat-card"
          :bordered="false"
        >
          <div class="stat-icon">
            <component :is="stat.icon" />
          </div>
          <div>
            <p class="stat-label">{{ stat?.label }}</p>
            <p class="stat-value">{{ stat?.value }}</p>
            <p class="stat-hint">{{ stat?.hint }}</p>
          </div>
        </a-card>
      </section>

      <section class="role-tabs" aria-label="Role specific focus">
        <a-tabs v-model:activeKey="focusTab">
          <a-tab-pane key="overview" tab="Unified overview">
            <div class="lanes-grid">
              <article
                class="role-lane"
                :class="{ 'role-lane--highlight': isAdminView }"
              >
                <header>
                  <div>
                    <p class="role-lane__eyebrow">Administrators</p>
                    <h3>Operational guardrails</h3>
                  </div>
                  <span class="role-lane__badge">{{ adminMembers.length }} leads</span>
                </header>
                <a-list :data-source="adminSnapshots" :split="false">
                  <template #renderItem="{ item }">
                    <a-list-item>
                      <a-list-item-meta
                        :title="item.label"
                        :description="item.detail"
                      />
                      <template #actions>
                        <span class="metric-pill" :data-status="item.status">
                          {{ item.metric }}
                        </span>
                      </template>
                    </a-list-item>
                  </template>
                </a-list>
                <footer>
                  <a-button type="link" @click="focusTab = 'administrators'">
                    Open administrator workspace
                  </a-button>
                </footer>
              </article>

              <article
                class="role-lane"
                :class="{ 'role-lane--highlight': isTeacherView }"
              >
                <header>
                  <div>
                    <p class="role-lane__eyebrow">Teachers</p>
                    <h3>Instruction playbooks</h3>
                  </div>
                  <span class="role-lane__badge">{{ teacherMembers.length }} faculty</span>
                </header>
                <a-list :data-source="teacherMissions" :split="false">
                  <template #renderItem="{ item }">
                    <a-list-item @click="item.classroom && openClassroomDrawer(item.classroom)">
                      <a-list-item-meta
                        :title="item.title"
                        :description="item.description"
                      />
                      <template #actions>
                        <span class="metric-pill metric-pill--accent">
                          {{ item.timeline }}
                        </span>
                      </template>
                    </a-list-item>
                  </template>
                </a-list>
                <footer>
                  <a-button type="link" @click="focusTab = 'teachers'">
                    Open teaching workspace
                  </a-button>
                </footer>
              </article>

              <article
                class="role-lane"
                :class="{ 'role-lane--highlight': isStudentView }"
              >
                <header>
                  <div>
                    <p class="role-lane__eyebrow">Students</p>
                    <h3>Learning guidance</h3>
                  </div>
                  <span class="role-lane__badge">{{ studentMembers.length }} learners</span>
                </header>
                <a-list :data-source="studentMoments" :split="false">
                  <template #renderItem="{ item }">
                    <a-list-item>
                      <a-list-item-meta
                        :title="item.title"
                        :description="item.description"
                      />
                      <template #actions>
                        <span class="metric-pill" :data-status="item.status">
                          {{ item.helper }}
                        </span>
                      </template>
                    </a-list-item>
                  </template>
                </a-list>
                <footer>
                  <a-button type="link" @click="focusTab = 'students'">
                    Open learner workspace
                  </a-button>
                </footer>
              </article>
            </div>
          </a-tab-pane>

          <a-tab-pane key="administrators" tab="Administrator cockpit">
            <a-row :gutter="16">
              <a-col :xs="24" :md="10">
                <a-card title="Governance metrics" class="admin-card">
                  <a-timeline>
                    <a-timeline-item
                      v-for="item in adminSnapshots"
                      :key="item.id"
                      :color="item.status === 'good' ? 'green' : 'orange'"
                    >
                      <p class="timeline-title">{{ item.label }}</p>
                      <p class="timeline-description">{{ item.detail }}</p>
                      <p class="timeline-metric">{{ item.metric }}</p>
                    </a-timeline-item>
                  </a-timeline>
                  <a-button block type="dashed" @click="handleMockAction('compliance')">
                    <SafetyCertificateOutlined /> Run compliance pulse (mock)
                  </a-button>
                </a-card>
                <a-card title="Strategic queue" class="admin-card">
                  <a-list :data-source="adminWorkflowQueue" size="small" bordered>
                    <template #renderItem="{ item }">
                      <a-list-item>
                        <a-list-item-meta
                          :title="item.label"
                          :description="item.description"
                        />
                        <template #actions>
                          <span class="metric-pill metric-pill--accent">
                            {{ item.owner }}
                          </span>
                        </template>
                      </a-list-item>
                    </template>
                  </a-list>
                </a-card>
              </a-col>
              <a-col :xs="24" :md="14">
                <a-card title="Department operating picture" class="admin-card">
                  <a-table
                    size="small"
                    :dataSource="institutionDepartments"
                    :pagination="{ pageSize: 6 }"
                    rowKey="id"
                  >
                    <a-table-column key="name" title="Department" dataIndex="name" />
                    <a-table-column key="slug" title="Slug" dataIndex="slug" />
                    <a-table-column key="classrooms" title="Classrooms">
                      <template #default="{ record }">
                        {{ departmentClassroomCount[record.id] || 0 }}
                      </template>
                    </a-table-column>
                    <a-table-column key="status" title="Status">
                      <template #default="{ record }">
                        <a-tag :color="record.active !== false ? 'green' : 'default'">
                          {{ record.active !== false ? 'Active' : 'Inactive' }}
                        </a-tag>
                      </template>
                    </a-table-column>
                  </a-table>
                  <template #extra>
                    <a-space>
                      <a-button type="primary" @click="openAdminModal('department')">
                        Create department
                      </a-button>
                      <a-button @click="openAdminModal('classroom')">
                        Create classroom
                      </a-button>
                    </a-space>
                  </template>
                </a-card>
              </a-col>
            </a-row>
          </a-tab-pane>

          <a-tab-pane key="teachers" tab="Teacher workspace">
            <a-row :gutter="16">
              <a-col :xs="24" :md="14">
                <a-card title="Classrooms connected to Teach">
                  <a-table
                    size="small"
                    :dataSource="teacherTableData"
                    :pagination="{ pageSize: 6 }"
                    :rowKey="record => record.id"
                    :customRow="teacherTableCustomRow"
                  >
                    <a-table-column key="title" title="Classroom">
                      <template #default="{ record }">
                        <div>
                          <strong>{{ record.title || record.code }}</strong>
                          <p class="table-sub">Code: {{ record.code }}</p>
                        </div>
                      </template>
                    </a-table-column>
                    <a-table-column key="dept" title="Department">
                      <template #default="{ record }">
                        {{ record.departmentName }}
                      </template>
                    </a-table-column>
                    <a-table-column key="capacity" title="Capacity" dataIndex="capacity" />
                    <a-table-column key="enrollment" title="Enrollment">
                      <template #default="{ record }">
                        {{ record.enrollmentCount ?? '—' }}
                      </template>
                    </a-table-column>
                    <a-table-column key="status" title="Status">
                      <template #default="{ record }">
                        <a-tag :color="record.status === 'active' ? 'green' : 'default'">
                          {{ record.status || 'pending' }}
                        </a-tag>
                      </template>
                    </a-table-column>
                  </a-table>
                </a-card>
              </a-col>
              <a-col :xs="24" :md="10">
                <a-card title="Mission queue">
                  <a-list :data-source="teacherMissions" size="small">
                    <template #renderItem="{ item }">
                      <a-list-item @click="item.classroom && openClassroomDrawer(item.classroom)">
                        <a-list-item-meta
                          :title="item.title"
                          :description="item.description"
                        />
                        <template #actions>
                          <span class="metric-pill metric-pill--accent">
                            {{ item.timeline }}
                          </span>
                        </template>
                      </a-list-item>
                    </template>
                  </a-list>
                  <a-divider />
                  <p class="card-subtitle">Linked courses</p>
                  <ul class="course-list">
                    <li v-for="course in highlightCourses" :key="course.id">
                      <p class="course-name">{{ course.title }}</p>
                      <p class="course-meta">
                        {{ course.category || 'Institution-linked' }} ·
                        {{ course.difficulty || 'Mixed level' }}
                      </p>
                    </li>
                  </ul>
                </a-card>
                <a-card title="Teaching day timeline">
                  <a-timeline>
                    <a-timeline-item
                      v-for="entry in teacherDayTimeline"
                      :key="entry.id"
                      color="blue"
                    >
                      <p class="timeline-title">{{ entry.title }}</p>
                      <p class="timeline-description">{{ entry.description }}</p>
                      <p class="timeline-metric">{{ entry.slot }}</p>
                    </a-timeline-item>
                  </a-timeline>
                </a-card>
              </a-col>
            </a-row>
          </a-tab-pane>

          <a-tab-pane key="students" tab="Student workspace">
            <a-row :gutter="16">
              <a-col :xs="24" :md="10">
                <a-card title="Engagement snapshot" class="student-card">
                  <div class="progress-grid">
                    <div
                      v-for="progress in studentEngagement"
                      :key="progress.id"
                      class="progress-item"
                    >
                      <a-progress type="circle" :percent="progress.percent" :width="90" />
                      <p class="progress-label">{{ progress.label }}</p>
                      <p class="progress-helper">{{ progress.helper }}</p>
                    </div>
                  </div>
                </a-card>
              </a-col>
              <a-col :xs="24" :md="14">
                <a-card title="Advisory feed">
                  <a-list :data-source="studentMoments" size="small">
                    <template #renderItem="{ item }">
                      <a-list-item>
                        <a-list-item-meta
                          :title="item.title"
                          :description="item.description"
                        />
                        <template #actions>
                          <span class="metric-pill" :data-status="item.status">
                            {{ item.helper }}
                          </span>
                        </template>
                      </a-list-item>
                    </template>
                  </a-list>
                  <a-divider />
                  <p class="card-subtitle">Next important dates</p>
                  <ul class="important-dates">
                    <li v-for="event in nextImportantDates" :key="event.id">
                      <CalendarOutlined />
                      <div>
                        <p class="date-label">{{ event.title }}</p>
                        <p class="date-helper">
                          {{ event.date }} · {{ event.description }}
                        </p>
                      </div>
                    </li>
                  </ul>
                </a-card>
                <a-card title="Action center">
                  <a-list :data-source="studentActionItems" size="small" bordered>
                    <template #renderItem="{ item }">
                      <a-list-item>
                        <a-list-item-meta
                          :title="item.label"
                          :description="item.description"
                        />
                        <template #actions>
                          <span class="metric-pill" :data-status="item.status">
                            {{ item.helper }}
                          </span>
                        </template>
                      </a-list-item>
                    </template>
                  </a-list>
                  <a-button block type="dashed" @click="handleMockAction('student-workflow')">
                    Record study reflection (mock)
                  </a-button>
                </a-card>
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </section>

      <section class="ops-grid" aria-label="Operations">
        <a-card title="Operational timeline">
          <a-timeline>
            <a-timeline-item v-for="event in opsTimeline" :key="event.id" :color="event.color">
              <p class="timeline-title">{{ event.title }}</p>
              <p class="timeline-description">{{ event.description }}</p>
              <p class="timeline-meta">{{ event.date }}</p>
            </a-timeline-item>
          </a-timeline>
        </a-card>

        <a-card title="Membership mix">
          <div class="membership-grid">
            <div>
              <p class="membership-label">Administrators</p>
              <p class="membership-value">{{ adminMembers.length }}</p>
              <p class="membership-helper">Core governance</p>
            </div>
            <div>
              <p class="membership-label">Teachers</p>
              <p class="membership-value">{{ teacherMembers.length }}</p>
              <p class="membership-helper">Linked to classrooms</p>
            </div>
            <div>
              <p class="membership-label">Students</p>
              <p class="membership-value">{{ studentMembers.length }}</p>
              <p class="membership-helper">Active enrollments</p>
            </div>
          </div>
          <a-progress :percent="capacityUsage" status="active" />
          <p class="membership-footnote">Capacity utilization across classrooms</p>
        </a-card>

        <a-card title="Course initiatives">
          <a-empty
            v-if="highlightCourses.length === 0"
            description="No linked courses yet"
          />
          <a-list v-else :data-source="highlightCourses" size="small">
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta :title="item.title" :description="item.category" />
                <template #actions>
                  <span>{{ item.difficulty || 'Balanced' }}</span>
                </template>
              </a-list-item>
            </template>
          </a-list>
          <a-button block type="dashed" @click="handleMockAction('courses')">
            Sync with Teach-internal (mock)
          </a-button>
        </a-card>
      </section>

      <a-drawer
        v-model:open="classroomDrawerOpen"
        :title="selectedClassroom?.title || selectedClassroom?.code || 'Classroom'"
        placement="right"
        width="420"
      >
        <template v-if="selectedClassroom">
          <p class="drawer-meta">
            {{ selectedClassroom.code }} · {{ selectedClassroom.status || 'pending' }}
          </p>
          <a-descriptions bordered column="1" size="small">
            <a-descriptions-item label="Department">
              {{ deptById[selectedClassroom.departmentId || '']?.name || 'Unassigned' }}
            </a-descriptions-item>
            <a-descriptions-item label="Capacity">
              {{ selectedClassroom.capacity ?? '—' }}
            </a-descriptions-item>
            <a-descriptions-item label="Enrollment">
              {{ selectedClassroom.enrollmentCount ?? '—' }}
            </a-descriptions-item>
          </a-descriptions>

          <div class="drawer-section">
            <p class="drawer-section__title">Recommended next steps</p>
            <ul>
              <li v-for="action in classroomRecommendations" :key="action.id">
                <p class="action-label">{{ action.label }}</p>
                <p class="action-helper">{{ action.detail }}</p>
              </li>
            </ul>
          </div>
        </template>
        <template v-else>
          <a-empty description="Select a classroom from the teaching table" />
        </template>
      </a-drawer>

      <a-modal
        v-model:open="adminModalOpen"
        :title="adminModalTitle"
        ok-text="Save"
        cancel-text="Cancel"
        @ok="handleAdminModalOk"
      >
        <a-form layout="vertical">
          <a-form-item label="Name" required>
            <a-input v-model:value="adminForm.name" />
          </a-form-item>
          <a-form-item label="Owner">
            <a-input v-model:value="adminForm.owner" />
          </a-form-item>
          <a-form-item label="Notes">
            <a-textarea v-model:value="adminForm.note" :rows="3" />
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch, type Component } from 'vue'
import { useRoute, useRouter, useRuntimeConfig } from 'nuxt/app'
import { message } from 'ant-design-vue'

import {
  ReloadOutlined,
  TeamOutlined,
  DashboardOutlined,
  ApartmentOutlined,
  BookOutlined,
  FieldTimeOutlined,
  SafetyCertificateOutlined,
  CalendarOutlined,
  ProfileOutlined,
  ClusterOutlined,
} from '@ant-design/icons-vue'
import { useAuth  as useGraphqlAuth } from '../../../../packages/shared-ui/src/composables/useAuth'

type RoleKey = 'admin' | 'teacher' | 'student'
type RoleToggleValue = 'auto' | RoleKey
type TabKey = 'overview' | 'administrators' | 'teachers' | 'students'

interface Institution {
  id: string
  name: string
  slug?: string
  location?: string
  type?: string
  active?: boolean
  email?: string
  phone?: string
}

interface Department {
  id: string
  name: string
  slug?: string
  institutionId: string
  active?: boolean
}

interface PortalClassroom {
  id: string
  institutionId: string
  departmentId?: string | null
  title?: string | null
  code: string
  capacity?: number | null
  status?: string | null
  teacherId?: string | null
  enrollmentCount?: number | null
}

interface Member {
  id: string
  userId: string
  institutionId: string
  role: string
  status?: string
}

interface TeacherCourse {
  id: string
  title: string
  difficulty?: string | null
  category?: string | null
  institutionId?: string | null
}

interface StatCard {
  id: string
  label: string
  value: string
  hint: string
  icon: Component
}

interface AdminSnapshot {
  id: string
  label: string
  metric: string
  detail: string
  status: 'good' | 'watch'
}

interface TeacherMission {
  id: string
  title: string
  description: string
  timeline: string
  classroom?: PortalClassroom
}

interface StudentMoment {
  id: string
  title: string
  description: string
  helper: string
  status: 'good' | 'warn'
}

interface TimelineEvent {
  id: string
  title: string
  description: string
  date: string
  color: 'green' | 'blue' | 'orange'
}

interface EngagementItem {
  id: string
  label: string
  helper: string
  percent: number
}

interface DrawerAction {
  id: string
  label: string
  detail: string
}

interface SpotlightCard {
  id: string
  title: string
  detail: string
  metric: string
  icon: Component
}

interface RoleNarrative {
  badge: string
  title: string
  description: string
  helper: string
}

interface ActionCenterItem {
  id: string
  label: string
  description: string
  helper: string
  status: 'good' | 'warn'
}

const route = useRoute()
const router = useRouter()
const runtime = useRuntimeConfig()
const apiBase = runtime.public?.apiBase || runtime.public?.appBaseUrl || ''

const { me, isStudent, isTeacher, isInstitutionAdmin } = useGraphqlAuth()

const clientReady = ref(false)
const apiAuthToken = ref<string | null>(null)

const institutions = ref<Institution[]>([])
const departments = ref<Department[]>([])
const classrooms = ref<PortalClassroom[]>([])
const members = ref<Member[]>([])
const teacherCourses = ref<TeacherCourse[]>([])

const initialLoading = ref(true)
const loadError = ref<string | null>(null)
const lastSyncedLabel = ref('never')

const roleControlValue = ref<RoleToggleValue>('auto')
const focusTab = ref<TabKey>('overview')
const isDarkMode = ref(false)

const selectedClassroom = ref<PortalClassroom | null>(null)
const classroomDrawerOpen = ref(false)
const adminModalOpen = ref(false)
const adminModalMode = ref<'department' | 'classroom'>('department')
const adminForm = ref({ name: '', owner: '', note: '' })

function resolveAuthHeader() {
  const rawToken =
    apiAuthToken.value ||
    (typeof window !== 'undefined'
      ? localStorage.getItem('token') || localStorage.getItem('access_token')
      : '')
  if (!rawToken) return null
  return rawToken.startsWith('Bearer') ? rawToken : `Bearer ${rawToken}`
}

const roleSelectOptions = [
  { label: 'Auto (based on role)', value: 'auto' },
  { label: 'Administrators', value: 'admin' },
  { label: 'Teachers', value: 'teacher' },
  { label: 'Students', value: 'student' },
]

const themeClass = computed(() => (isDarkMode.value ? 'theme-dark' : 'theme-light'))

const institutionKey = ref('')

const resolveInstitutionKey = () => {
  const param = route.params?.institution_id
  if (Array.isArray(param)) return param[0]
  if (typeof param === 'string') return param
  const queryKey = route.query?.institution_id
  if (Array.isArray(queryKey)) return queryKey[0]
  if (typeof queryKey === 'string') return queryKey
  return ''
}

watch(
  () => [route.params?.institution_id, route.query?.institution_id],
  () => {
    institutionKey.value = resolveInstitutionKey()
  },
  { immediate: true },
)

const activeInstitution = computed<Institution | null>(() => {
  if (institutions.value.length === 0) return null
  if (!institutionKey.value) return institutions.value[0] || null
  return (
    institutions.value.find(
      (i) => i.id === institutionKey.value || i.slug === institutionKey.value,
    ) || institutions.value[0] || null
  )
})

const institutionDepartments = computed(() =>
  activeInstitution.value
    ? departments.value.filter((d) => d.institutionId === activeInstitution.value!.id)
    : [],
)

const institutionClassrooms = computed(() =>
  activeInstitution.value
    ? classrooms.value.filter((c) => c.institutionId === activeInstitution.value!.id)
    : [],
)

const institutionMembers = computed(() =>
  activeInstitution.value
    ? members.value.filter((m) => m.institutionId === activeInstitution.value!.id)
    : [],
)

const adminMembers = computed(() =>
  institutionMembers.value.filter((m) => /admin/i.test(m.role)),
)
const teacherMembers = computed(() =>
  institutionMembers.value.filter((m) => /teach/i.test(m.role)),
)
const studentMembers = computed(() =>
  institutionMembers.value.filter((m) => /student/i.test(m.role)),
)

const membership = computed(() => {
  if (!me.value) return null
  return institutionMembers.value.find((m) => m.userId === me.value!.id) || null
})

const membershipRole = computed<RoleKey>(() => {
  if (roleControlValue.value !== 'auto') return roleControlValue.value
  if (isInstitutionAdmin.value) return 'admin'
  if (isTeacher.value) return 'teacher'
  if (isStudent.value) return 'student'
  const role = membership.value?.role?.toLowerCase()
  if (role?.includes('admin')) return 'admin'
  if (role?.includes('teach')) return 'teacher'
  return 'student'
})

const effectiveRole = computed<RoleKey>(() => membershipRole.value)

const isAdminView = computed(() => effectiveRole.value === 'admin')
const isTeacherView = computed(() => effectiveRole.value === 'teacher')
const isStudentView = computed(() => effectiveRole.value === 'student')

const heroSubtitle = computed(() => {
  if (!activeInstitution.value) return ''
  const deptCount = institutionDepartments.value.length
  const classCount = institutionClassrooms.value.length
  return `Live institution workspace with ${deptCount} departments and ${classCount} classrooms mapped to Teach.`
})

const roleViewDescription = computed(() => {
  const map: Record<RoleKey, string> = {
    admin: 'Viewing as Administrator',
    teacher: 'Viewing as Teacher',
    student: 'Viewing as Student',
  }
  return map[effectiveRole.value]
})

const heroStats = computed<StatCard[]>(() => {
  const deptCount = institutionDepartments.value.length
  const classCount = institutionClassrooms.value.length
  const activeClassrooms = institutionClassrooms.value.filter(
    (c) => c.status !== 'archived',
  ).length
  const memberCount = institutionMembers.value.length
  const facultyCoverage = teacherMembers.value.length
  const avgCapacity = institutionClassrooms.value.length
    ? Math.round(
        institutionClassrooms.value.reduce((sum, c) => sum + (c.capacity || 0), 0) /
          institutionClassrooms.value.length,
      )
    : 0
  return [
    {
      id: 'departments',
      label: 'Departments',
      value: `${deptCount}`,
      hint: `${deptCount ? 'Mapped' : 'Pending mapping'} for ${
        activeInstitution.value?.name || ''
      }`,
      icon: ApartmentOutlined,
    },
    {
      id: 'classrooms',
      label: 'Classrooms',
      value: `${classCount}`,
      hint: `${activeClassrooms} active, ${classCount - activeClassrooms} in draft`,
      icon: DashboardOutlined,
    },
    {
      id: 'members',
      label: 'Memberships',
      value: `${memberCount}`,
      hint: `${facultyCoverage} teachers, ${studentMembers.value.length} learners`,
      icon: TeamOutlined,
    },
    {
      id: 'capacity',
      label: 'Avg Capacity',
      value: `${avgCapacity}`,
      hint: 'Seats per classroom',
      icon: ProfileOutlined,
    },
  ]
})

const deptById = computed<Record<string, Department>>(() => {
  const map: Record<string, Department> = {}
  departments.value.forEach((d) => {
    map[d.id] = d
  })
  return map
})

const departmentClassroomCount = computed<Record<string, number>>(() => {
  const map: Record<string, number> = {}
  institutionClassrooms.value.forEach((c) => {
    if (!c.departmentId) return
    map[c.departmentId] = (map[c.departmentId] || 0) + 1
  })
  return map
})

const adminSnapshots = computed<AdminSnapshot[]>(() => {
  const deptActive = institutionDepartments.value.filter((d) => d.active !== false).length
  const totalDepartments = Math.max(1, institutionDepartments.value.length)
  const compliance = `${Math.round((deptActive / totalDepartments) * 100)}%`
  const rooms = `${institutionClassrooms.value.filter((c) => c.status === 'active').length} active`
  const membershipDepth = `${adminMembers.value.length} admins`
  return [
    {
      id: 'governance',
      label: 'Governance coverage',
      metric: compliance,
      detail: 'Departments with active governance owners',
      status: deptActive === totalDepartments ? 'good' : 'watch',
    },
    {
      id: 'rooms',
      label: 'Classroom readiness',
      metric: rooms,
      detail: 'Rooms mapped to Teach-internal',
      status: institutionClassrooms.value.length > 0 ? 'good' : 'watch',
    },
    {
      id: 'membership',
      label: 'Administrator presence',
      metric: membershipDepth,
      detail: 'People with admin role at this institution',
      status: adminMembers.value.length > 0 ? 'good' : 'watch',
    },
  ]
})

const teacherMissions = computed<TeacherMission[]>(() => {
  return institutionClassrooms.value.slice(0, 6).map((c, index) => ({
    id: c.id,
    title: c.title || c.code,
    description: `${deptById.value[c.departmentId || '']?.name || 'General studies'} · ${
      c.capacity || 0
    } seats`,
    timeline: `Week ${index + 1}`,
    classroom: c,
  }))
})

const teacherTableData = computed(() =>
  institutionClassrooms.value.map((c) => ({
    ...c,
    departmentName: deptById.value[c.departmentId || '']?.name || 'General studies',
  })),
)

const studentMoments = computed<StudentMoment[]>(() => {
  if (institutionClassrooms.value.length === 0) {
    return [
      {
        id: 'no-classrooms',
        title: 'No classrooms linked yet',
        description: 'Connect Teach classrooms to surface student journeys.',
        helper: 'Setup required',
        status: 'warn',
      },
    ]
  }
  return institutionClassrooms.value.slice(0, 5).map((c, idx) => ({
    id: `student-${c.id}`,
    title: c.title || `Learning lane ${idx + 1}`,
    description: `Code ${c.code} · ${deptById.value[c.departmentId || '']?.name || 'General'}`,
    helper: `${c.enrollmentCount ?? 0} enrolled`,
    status: c.enrollmentCount && c.enrollmentCount > (c.capacity || 0) ? 'warn' : 'good',
  }))
})

const studentEngagement = computed<EngagementItem[]>(() => {
  const classroomsCount = institutionClassrooms.value.length
  return [
    {
      id: 'attendance',
      label: 'Attendance',
      helper: 'Based on classroom check-ins',
      percent: Math.min(100, 60 + classroomsCount * 5),
    },
    {
      id: 'assignments',
      label: 'Assignments on track',
      helper: 'Teach-internal mirrored tasks',
      percent: Math.min(100, 55 + classroomsCount * 4),
    },
    {
      id: 'labs',
      label: 'Lab readiness',
      helper: 'Hands-on modules',
      percent: Math.min(100, 40 + classroomsCount * 3),
    },
  ]
})

const nextImportantDates = computed(() => {
  return opsTimeline.value.slice(0, 4)
})

const opsTimeline = computed<TimelineEvent[]>(() => {
  return institutionClassrooms.value.slice(0, 6).map((c, idx) => ({
    id: c.id,
    title: c.title || c.code,
    description: `${deptById.value[c.departmentId || '']?.name || 'General'} · Capacity ${
      c.capacity || 0
    }`,
    date: clientReady.value
      ? new Date(Date.now() + idx * 86400000).toLocaleDateString()
      : `Day ${idx + 1}`,
    color: c.status === 'active' ? 'green' : 'blue',
  }))
})

const capacityUsage = computed(() => {
  const totalCapacity = institutionClassrooms.value.reduce(
    (sum, c) => sum + (c.capacity || 0),
    0,
  )
  const totalEnrollments = institutionClassrooms.value.reduce(
    (sum, c) => sum + (c.enrollmentCount || 0),
    0,
  )
  if (!totalCapacity) return 0
  return Math.round((totalEnrollments / totalCapacity) * 100)
})

const highlightCourses = computed(() => {
  if (teacherCourses.value.length > 0) {
    return teacherCourses.value.filter(
      (course) =>
        !activeInstitution.value ||
        !course.institutionId ||
        course.institutionId === activeInstitution.value.id,
    )
  }
  return teacherMissions.value.slice(0, 3).map((mission) => ({
    id: mission.id,
    title: mission.title,
    category: deptById.value[mission.classroom?.departmentId || '']?.name || 'Integrated program',
    difficulty: mission.timeline,
  }))
})

const classroomRecommendations = computed<DrawerAction[]>(() => {
  if (!selectedClassroom.value) return []
  return [
    {
      id: 'sync',
      label: 'Sync attendance from Teach-internal',
      detail: 'Ensure live roster is mirrored for gradebook accuracy.',
    },
    {
      id: 'assign',
      label: 'Assign secondary facilitator',
      detail: 'Add a co-teacher for resilience across lab sessions.',
    },
    {
      id: 'students',
      label: 'Audit student roster',
      detail: 'Verify enrollments vs Byway membership records.',
    },
  ]
})

const roleNarrative = computed<RoleNarrative>(() => {
  switch (effectiveRole.value) {
    case 'admin':
      return {
        badge: 'Administrator view',
        title: 'Keep governance resilient',
        description:
          'Track institution readiness, unlock department blueprints, and enforce compliance without leaving this workspace.',
        helper: 'Auto-linked membership data keeps leadership heatmaps accurate.',
      }
    case 'teacher':
      return {
        badge: 'Teacher view',
        title: 'Orchestrate the learning runway',
        description:
          'Line up classrooms, review mission queues, and keep Teach-internal courses in sync with institutional targets.',
        helper: 'Classrooms and courses mirror Teach IDs so transitions stay seamless.',
      }
    default:
      return {
        badge: 'Student view',
        title: 'Mentor every learner journey',
        description:
          'Surface advisory nudges, track engagement, and highlight upcoming milestones across the institution.',
        helper: 'Signals adapt based on classroom enrollment and real-time mock data.',
      }
  }
})

const roleSpotlights = computed<SpotlightCard[]>(() => {
  if (effectiveRole.value === 'admin') {
    return [
      {
        id: 'coverage',
        title: 'Role coverage',
        detail: `${adminMembers.value.length} admins vs ${teacherMembers.value.length} faculty`,
        metric: `${capacityUsage.value}% util`,
        icon: SafetyCertificateOutlined,
      },
      {
        id: 'departments',
        title: 'Departments mapped',
        detail: `${institutionDepartments.value.length} total units`,
        metric: `${Object.keys(departmentClassroomCount.value).length} active`,
        icon: ClusterOutlined,
      },
      {
        id: 'classrooms',
        title: 'Rooms ready',
        detail: `${institutionClassrooms.value.filter((c) => c.status === 'active').length} active`,
        metric: `${institutionClassrooms.value.length} total`,
        icon: ApartmentOutlined,
      },
    ]
  }

  if (effectiveRole.value === 'teacher') {
    return [
      {
        id: 'missions',
        title: 'Missions queued',
        detail: 'Classrooms needing focus this sprint',
        metric: `${teacherMissions.value.length}`,
        icon: BookOutlined,
      },
      {
        id: 'courses',
        title: 'Courses linked',
        detail: 'Teach-internal courses synced',
        metric: `${highlightCourses.value.length}`,
        icon: DashboardOutlined,
      },
      {
        id: 'timeline',
        title: 'Timeline readiness',
        detail: 'Upcoming classroom checkpoints',
        metric: `${opsTimeline.value.length}`,
        icon: CalendarOutlined,
      },
    ]
  }

  const engagementAverage = studentEngagement.value.length
    ? Math.round(
        studentEngagement.value.reduce((sum, item) => sum + item.percent, 0) /
          studentEngagement.value.length,
      )
    : 0

  return [
    {
      id: 'engagement',
      title: 'Engagement index',
      detail: 'Attendance and assignments on track',
      metric: `${engagementAverage}%`,
      icon: FieldTimeOutlined,
    },
    {
      id: 'advisory',
      title: 'Advisory signals',
      detail: `${studentMoments.value.length} active nudges`,
      metric: `${studentMembers.value.length} learners`,
      icon: ProfileOutlined,
    },
    {
      id: 'calendar',
      title: 'Upcoming checkpoints',
      detail: 'Next cohort events',
      metric: `${nextImportantDates.value.length}`,
      icon: CalendarOutlined,
    },
  ]
})

const adminWorkflowQueue = computed(() => {
  const inactiveDepartments = institutionDepartments.value.filter((d) => d.active === false).length
  const pendingClassrooms = institutionClassrooms.value.filter((c) => c.status !== 'active').length
  return [
    {
      id: 'dept-audit',
      label: 'Activate departments',
      description: `${inactiveDepartments} departments awaiting activation`,
      owner: 'Governance',
    },
    {
      id: 'classroom-readiness',
      label: 'Review classroom readiness',
      description: `${pendingClassrooms} rooms pending launch`,
      owner: 'Academic ops',
    },
    {
      id: 'membership-review',
      label: 'Audit memberships',
      description: `${institutionMembers.value.length} total memberships`,
      owner: 'HR coordination',
    },
  ]
})

const teacherDayTimeline = computed(() =>
  (opsTimeline.value.length ? opsTimeline.value : studentMoments.value).slice(0, 4).map(
    (entry, idx) =>
      ({
        ...entry,
        slot: `Block ${idx + 1}`,
      }),
  ),
)

const studentActionItems = computed<ActionCenterItem[]>(() => {
  return studentMoments.value.map((moment, index) => ({
    id: moment.id,
    label: `Action ${index + 1}`,
    description: moment.description,
    helper: moment.helper,
    status: moment.status,
  }))
})

const teacherTableCustomRow = (record: PortalClassroom) => ({
  onClick: () => openClassroomDrawer(record),
})

const defaultTabByRole: Record<RoleKey, TabKey> = {
  admin: 'administrators',
  teacher: 'teachers',
  student: 'students',
}

function handleRoleSelect(value: RoleToggleValue) {
  roleControlValue.value = value
  if (value === 'auto') {
    focusTab.value = defaultTabByRole[effectiveRole.value] || 'overview'
  } else {
    focusTab.value = defaultTabByRole[value] || 'overview'
  }
}

function openClassroomDrawer(classroom: PortalClassroom) {
  selectedClassroom.value = classroom
  classroomDrawerOpen.value = true
}

function handleRefresh() {
  loadOverview()
}

function openAdminModal(mode: 'department' | 'classroom') {
  adminModalMode.value = mode
  adminForm.value = { name: '', owner: '', note: '' }
  adminModalOpen.value = true
}

const adminModalTitle = computed(() =>
  adminModalMode.value === 'department'
    ? 'New department blueprint'
    : 'New classroom shell',
)

function handleAdminModalOk() {
  if (!adminForm.value.name?.trim()) {
    message.error('Name is required')
    return
  }
  const label = adminModalMode.value === 'department' ? 'Department' : 'Classroom'
  message.success(`${label} plan saved locally`)
  adminModalOpen.value = false
}

function openTeachingDrawerFromHero() {
  focusTab.value = 'teachers'
}

function handleMockAction(kind: string) {
  message.info(`Mock action triggered for ${kind}`)
}

function goFallbackInstitution() {
  if (institutions.value.length === 0) return
  const fallback = institutions.value[0]
  router.replace({ path: `/institution/${fallback.id}` })
}

async function loadOverview() {
  const authToken = resolveAuthHeader()
  if (!authToken) {
    loadError.value = 'Missing auth token'
    initialLoading.value = false
    return
  }
  const url = `${apiBase}/api/institution-portal/overview`
  initialLoading.value = true
  loadError.value = null
  try {
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: authToken,
      } as any,
    })
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
    const json = await resp.json()
    institutions.value = json.institutions || []
    departments.value = json.departments || []
    classrooms.value = (json.classrooms || []).map((c: any) => ({
      ...c,
      enrollmentCount: c.enrollments?.length ?? c.enrollment ?? c.enrollmentCount ?? null,
    }))
    members.value = json.members || []
    await loadTeacherCourses()
    lastSyncedLabel.value = new Date().toLocaleString()
  } catch (err: any) {
    console.warn('[institutions-portal] overview failed', err)
    loadError.value = err?.message || 'Failed to load overview'
  } finally {
    initialLoading.value = false
  }
}

async function loadTeacherCourses() {
  teacherCourses.value = []
  const authToken = resolveAuthHeader()
  if (!authToken) return
  try {
    const resp = await fetch(`${apiBase}/api/teach-internal/graphql`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: authToken,
      } as any,
      body: JSON.stringify({
        query: `
          query MyCourses {
            myCourses {
              id
              title
              difficulty
              category
              institutionId
            }
          }
        `,
      }),
    })
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
    const json = await resp.json()
    const courses = json?.data?.myCourses
    teacherCourses.value = Array.isArray(courses) ? courses : []
  } catch (err) {
    console.warn('[institutions-portal] teacher courses fallback', err)
    teacherCourses.value = []
  }
}

watch(
  () => effectiveRole.value,
  (role) => {
    if (roleControlValue.value === 'auto') {
      focusTab.value = defaultTabByRole[role] || 'overview'
    }
  },
  { immediate: true },
)

watch(
  () => route.query.role,
  (role) => {
    if (role === 'admin' || role === 'teacher' || role === 'student') {
      handleRoleSelect(role as RoleKey)
    }
  },
)

watch(
  () => isDarkMode.value,
  (val) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('inst-portal-theme', val ? 'dark' : 'light')
    }
  },
)

watch(activeInstitution, () => {
  selectedClassroom.value = null
  classroomDrawerOpen.value = false
})

onMounted(() => {
  if (typeof window !== 'undefined') {
    isDarkMode.value = window.localStorage.getItem('inst-portal-theme') === 'dark'
    apiAuthToken.value =
      localStorage.getItem('token') || localStorage.getItem('access_token')
    const routeRole = route.query.role
    if (routeRole === 'admin' || routeRole === 'teacher' || routeRole === 'student') {
      handleRoleSelect(routeRole as RoleKey)
    }
  }
  clientReady.value = true
  loadOverview()
})
</script>

<style scoped>
.institution-role-portal {
  padding: 2rem;
}

.portal-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.portal-shell {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.portal-hero {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 1.75rem;
  border-radius: 1.5rem;
  background: linear-gradient(135deg, #eef2ff, #dbeafe);
}

.portal-hero__left {
  flex: 1 1 320px;
}

.portal-hero__left h1 {
  margin: 0.2rem 0 0.6rem;
  font-size: 2.25rem;
}

.hero-subtitle {
  margin: 0;
  color: #475569;
}

.hero-meta {
  list-style: none;
  padding: 0;
  margin: 1rem 0 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  color: #334155;
}

.hero-meta li {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.portal-hero__right {
  flex: 1 1 300px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-end;
}

.hero-controls {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: flex-end;
}

.hero-updated {
  margin: 0;
  color: #475569;
  font-size: 0.9rem;
}

.eyebrow {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.4rem;
  color: #7c3aed;
  font-size: 0.8rem;
}

.role-narrative {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  border: 1px solid #e0e7ff;
  border-radius: 1.5rem;
  padding: 1.5rem;
  background: #fff;
}

.role-narrative__copy {
  flex: 1 1 320px;
}

.role-narrative__badge {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.35rem;
  font-size: 0.75rem;
  color: #7c3aed;
}

.role-narrative__helper {
  margin: 0.5rem 0 0;
  color: #475569;
}

.role-narrative__spotlights {
  flex: 1 1 320px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.spotlight-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  border-radius: 1rem;
  border: 1px solid #e0e7ff;
}

.spotlight-card__icon {
  width: 40px;
  height: 40px;
  border-radius: 1rem;
  background: #eef2ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4338ca;
}

.spotlight-card__title {
  margin: 0;
  font-weight: 600;
}

.spotlight-card__detail {
  margin: 0;
  color: #475569;
  font-size: 0.9rem;
}

.spotlight-card__metric {
  margin-left: auto;
  font-weight: 600;
  color: #312e81;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.stat-card {
  display: flex;
  gap: 1rem;
  align-items: center;
  border-radius: 1rem;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 1rem;
  background: #eef2ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4338ca;
  font-size: 1.5rem;
}

.stat-label {
  margin: 0;
  color: #475569;
}

.stat-value {
  margin: 0.2rem 0;
  font-size: 1.4rem;
  font-weight: 700;
}

.stat-hint {
  margin: 0;
  color: #94a3b8;
}

.role-tabs .lanes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.role-lane {
  background: #fff;
  border-radius: 1.2rem;
  padding: 1.25rem;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.role-lane header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.role-lane__eyebrow {
  margin: 0;
  font-size: 0.85rem;
  color: #6366f1;
  text-transform: uppercase;
  letter-spacing: 0.2rem;
}

.role-lane__badge {
  background: #eef2ff;
  color: #312e81;
  padding: 0.3rem 0.6rem;
  border-radius: 999px;
  font-size: 0.85rem;
}

.role-lane--highlight {
  border-color: #4338ca;
  box-shadow: 0 10px 30px rgba(67, 56, 202, 0.15);
}

.metric-pill {
  display: inline-flex;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.8rem;
  color: #111827;
  background: #f3f4f6;
}

.metric-pill[data-status='warn'] {
  background: #fef3c7;
  color: #92400e;
}

.metric-pill[data-status='good'] {
  background: #dcfce7;
  color: #166534;
}

.metric-pill--accent {
  background: #e0e7ff;
  color: #312e81;
}

.ops-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.membership-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.membership-label {
  margin: 0;
  color: #475569;
}

.membership-value {
  margin: 0.2rem 0 0;
  font-size: 1.6rem;
  font-weight: 700;
}

.membership-helper {
  margin: 0;
  color: #94a3b8;
}

.course-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.course-name {
  margin: 0;
  font-weight: 600;
}

.course-meta {
  margin: 0;
  color: #64748b;
  font-size: 0.9rem;
}

.progress-grid {
  display: flex;
  justify-content: space-around;
  gap: 1rem;
}

.progress-item {
  text-align: center;
}

.progress-label {
  margin: 0.35rem 0 0;
  font-weight: 600;
}

.progress-helper {
  margin: 0;
  color: #94a3b8;
  font-size: 0.85rem;
}

.important-dates {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.important-dates li {
  display: flex;
  gap: 0.6rem;
  color: #475569;
}

.date-label {
  margin: 0;
  font-weight: 600;
}

.date-helper {
  margin: 0;
  color: #94a3b8;
  font-size: 0.9rem;
}

.timeline-title {
  margin: 0;
  font-weight: 600;
}

.timeline-description,
.timeline-meta {
  margin: 0;
  color: #94a3b8;
}

.drawer-meta {
  margin: 0 0 1rem;
  color: #475569;
}

.drawer-section {
  margin-top: 1.5rem;
}

.drawer-section__title {
  margin: 0 0 0.5rem;
}
</style>