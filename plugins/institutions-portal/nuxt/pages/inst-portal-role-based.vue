<template>
  <div
    class="inst-portal-page"
    :class="[
      `role-${effectiveRole}`,
      isDarkMode ? 'theme-dark' : 'theme-light',
      devMode ? 'dev-mode' : '',
    ]"
  >
    <!-- ===========================
         TOP: LOADING / ERROR / GUEST
    ============================ -->
    <div v-if="initialLoading" class="full-center">
      <a-spin tip="Loading institution portal..." />
    </div>

    <div v-else-if="loadError" class="full-center">
      <a-result
        status="warning"
        title="Could not load institution overview"
        :sub-title="loadError"
      >
        <template #extra>
          <a-button type="primary" @click="refreshAll">
            <ReloadOutlined /> Retry
          </a-button>
        </template>
      </a-result>
    </div>

    <div v-else-if="!me">
      <a-result
        status="403"
        title="You’re not signed in"
        sub-title="Sign in to access institutions, classrooms and your learning journey."
      >
        <template #extra>
          <a-button type="primary" @click="emitLogin">
            <UserOutlined /> Go to sign in
          </a-button>
        </template>
      </a-result>
    </div>

    <!-- ===========================
         MAIN PORTAL (AUTH ONLY)
    ============================ -->
    <div v-else class="portal-shell">
      <!-- Header / Hero -->
      <header class="portal-header">
        <div class="left">
          <div class="pill-row">
            <span class="role-pill" :data-role="effectiveRole">
              <span class="dot" :class="`dot-${effectiveRole}`"></span>
              <span class="role-label">{{ roleLabel }}</span>
            </span>
            <span v-if="primaryInstitution" class="inst-pill">
              <TeamOutlined />
              <span class="inst-name">{{ primaryInstitution.name }}</span>
            </span>
          </div>

          <h1 class="title">
            {{ meDisplayName }}
          </h1>
          <p class="subtitle">
            {{ roleTagline }}
          </p>

          <div class="quick-meta">
            <div class="meta-item">
              <span class="meta-label">Institutions</span>
              <span class="meta-value">{{ institutions.length }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Classrooms</span>
              <span class="meta-value">{{ classrooms.length }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Departments</span>
              <span class="meta-value">{{ departments.length }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Memberships</span>
              <span class="meta-value">{{ myMemberships.length }}</span>
            </div>
          </div>
        </div>

        <div class="right">
          <div class="top-actions">
            <a-switch
              v-model:checked="isDarkMode"
              checked-children="Dark"
              un-checked-children="Light"
              @change="persistTheme"
            />
            <a-tooltip title="Developer view (mock role override, raw JSON)">
              <a-switch
                v-model:checked="devMode"
                style="margin-left: 8px"
                checked-children="Dev"
                un-checked-children="Dev"
              />
            </a-tooltip>
          </div>

          <div class="primary-actions">
            <a-button v-if="isAdminLike" type="primary" @click="openCreateInstitution">
              <PlusOutlined /> New Institution
            </a-button>
            <a-button v-if="isTeacherLike" @click="openTeacherFocus">
              <BulbOutlined /> Teaching focus
            </a-button>
            <a-button v-if="isStudent" @click="openStudentFocus">
              <FieldTimeOutlined /> My learning
            </a-button>
          </div>

          <div class="badge-grid">
            <div class="badge">
              <CheckCircleOutlined />
              <div class="b-title">Linked to Teach</div>
              <div class="b-sub">Classrooms &amp; courses related by IDs</div>
            </div>
            <div class="badge">
              <ClusterOutlined />
              <div class="b-title">API-level ORM</div>
              <div class="b-sub">No shared Prisma, all through HTTP</div>
            </div>
            <div class="badge">
              <SafetyCertificateOutlined />
              <div class="b-title">Role-aware</div>
              <div class="b-sub">Admin, teacher, student flows mocked</div>
            </div>
          </div>
        </div>
      </header>

      <!-- Stats row -->
      <section class="stats-section">
        <a-row :gutter="16">
          <a-col :xs="12" :md="6">
            <a-card class="stat-card">
              <div class="stat-label">Total Institutions</div>
              <div class="stat-value">{{ institutions.length }}</div>
              <div class="stat-hint">
                <TeamOutlined /> {{ activeInstitutions.length }} active
              </div>
            </a-card>
          </a-col>
          <a-col :xs="12" :md="6">
            <a-card class="stat-card">
              <div class="stat-label">Total Classrooms</div>
              <div class="stat-value">{{ classrooms.length }}</div>
              <div class="stat-hint">
                <ApartmentOutlined /> {{ activeClassrooms.length }} active
              </div>
            </a-card>
          </a-col>
          <a-col :xs="12" :md="6">
            <a-card class="stat-card">
              <div class="stat-label">My Classrooms</div>
              <div class="stat-value">
                <template v-if="isTeacherLike">
                  {{ myTeacherClassrooms.length }}
                </template>
                <template v-else-if="isStudent">
                  {{ myStudentClassrooms.length }}
                </template>
                <template v-else>
                  {{ myMembershipClassrooms.length }}
                </template>
              </div>
              <div class="stat-hint">
                <CalendarOutlined /> role-aware
              </div>
            </a-card>
          </a-col>
          <a-col :xs="12" :md="6">
            <a-card class="stat-card">
              <div class="stat-label">Linked Courses (mock)</div>
              <div class="stat-value">{{ teacherCourses.length }}</div>
              <div class="stat-hint">
                <BookOutlined /> via teach-internal
              </div>
            </a-card>
          </a-col>
        </a-row>
      </section>

      <!-- Tabs -->
      <section class="tabs-section">
        <a-tabs v-model:activeKey="activeTabKey">
          <a-tab-pane key="overview" tab="Overview">
            <OverviewSection
              :institutions="institutions"
              :members="members"
              :classrooms="classrooms"
              :departments="departments"
              :effective-role="effectiveRole"
              :primary-institution-id="primaryInstitutionId"
              @open-inst="handleOpenInstitution"
            />
          </a-tab-pane>

          <a-tab-pane v-if="isAdminLike" key="admin" tab="Admin">
            <AdminSection
              :institutions="institutions"
              :members="members"
              :departments="departments"
              :classrooms="classrooms"
              :loading="savingAdmin"
              @request-create="openCreateInstitution"
              @open-inst="handleOpenInstitution"
            />
          </a-tab-pane>

          <a-tab-pane v-if="isTeacherLike" key="teaching" tab="Teaching">
            <TeacherSection
              :me="me"
              :institutions="institutions"
              :departments="departments"
              :classrooms="classrooms"
              :teacher-classrooms="myTeacherClassrooms"
              :teacher-courses="teacherCourses"
            />
          </a-tab-pane>

          <a-tab-pane v-if="isStudent" key="learning" tab="Learning">
            <StudentSection
              :me="me"
              :institutions="institutions"
              :departments="departments"
              :classrooms="classrooms"
              :student-classrooms="myStudentClassrooms"
            />
          </a-tab-pane>

          <a-tab-pane v-if="devMode" key="dev" tab="Dev / JSON">
            <DevSection
              :me="me"
              :institutions="institutions"
              :departments="departments"
              :classrooms="classrooms"
              :members="members"
              :teacher-courses="teacherCourses"
              v-model:roleOverride="devRoleOverride"
            />
          </a-tab-pane>
        </a-tabs>
      </section>

      <!-- Institution drawer -->
      <a-drawer
        v-model:open="instDrawerOpen"
        :title="selectedInstitution && selectedInstitution.name || 'Institution'"

        placement="right"
        width="480"
      >
        <template v-if="selectedInstitution">
          <p class="drawer-sub">
            {{ selectedInstitution.location || 'No location' }} ·
            <span :class="selectedInstitution.active ? 'tag-active' : 'tag-inactive'">
              {{ selectedInstitution.active ? 'Active' : 'Inactive' }}
            </span>
          </p>

          <a-descriptions bordered size="small" :column="1">
            <a-descriptions-item label="Type">
              {{ selectedInstitution.type || '—' }}
            </a-descriptions-item>
            <a-descriptions-item label="Email">
              {{ selectedInstitution.email || '—' }}
            </a-descriptions-item>
            <a-descriptions-item label="Phone">
              {{ selectedInstitution.phone || '—' }}
            </a-descriptions-item>
          </a-descriptions>

          <div class="drawer-section">
            <h4>Departments</h4>
            <a-empty
              v-if="selectedInstDepartments.length === 0"
              description="No departments yet"
              :image="simpleEmptyImage"
            />
            <a-list v-else :data-source="selectedInstDepartments" size="small">
              <template #renderItem="{ item }">
                <a-list-item>
                  <a-list-item-meta :title="item.name" :description="item.slug" />
                  <template #actions>
                    <span v-if="item.active" class="badge-green">Active</span>
                    <span v-else class="badge-grey">Inactive</span>
                  </template>
                </a-list-item>
              </template>
            </a-list>
          </div>

          <div class="drawer-section">
            <h4>Classrooms</h4>
            <a-empty
              v-if="selectedInstClassrooms.length === 0"
              description="No classrooms yet"
            />
            <a-list
              v-else
              :data-source="selectedInstClassrooms"
              size="small"
              item-layout="horizontal"
            >
              <template #renderItem="{ item }">
                <a-list-item>
                  <a-list-item-meta
                    :title="item.title || item.code"
                    :description="`Code: ${item.code} · Capacity: ${item.capacity ?? 30}`"
                  />
                  <template #actions>
                    <a-tag :color="item.status === 'active' ? 'green' : 'default'">
                      {{ item.status || 'pending' }}
                    </a-tag>
                  </template>
                </a-list-item>
              </template>
            </a-list>
          </div>

          <div class="drawer-section">
            <h4>Members (mock)</h4>
            <a-empty
              v-if="selectedInstMembers.length === 0"
              description="No members yet"
            />
            <a-list v-else :data-source="selectedInstMembers" size="small">
              <template #renderItem="{ item }">
                <a-list-item>
                  <a-list-item-meta
                    :title="item.userId"
                    :description="item.role || 'member'"
                  />
                  <template #actions>
                    <a-tag color="blue">{{ item.status || 'ACTIVE' }}</a-tag>
                  </template>
                </a-list-item>
              </template>
            </a-list>
          </div>

          <div class="drawer-footer">
            <a-button v-if="isStudent" type="primary" @click="mockJoinInstitution">
              <UserAddOutlined /> Join institution (mock)
            </a-button>
            <a-button v-if="isAdminLike" @click="mockArchiveInstitution" danger>
              <DeleteOutlined /> Archive (mock)
            </a-button>
          </div>
        </template>
        <template v-else>
          <a-empty description="Select an institution" />
        </template>
      </a-drawer>

      <!-- Create/edit institution (mock submit) -->
      <a-modal
        v-model:open="instModalOpen"
        :title="instForm.id ? 'Edit Institution (mock)' : 'Create Institution (mock)'"
        ok-text="Save"
        cancel-text="Cancel"
        @ok="mockSaveInstitution"
      >
        <a-form layout="vertical">
          <a-form-item label="Name" required>
            <a-input v-model:value="instForm.name" />
          </a-form-item>
          <a-form-item label="Slug">
            <a-input v-model:value="instForm.slug" />
          </a-form-item>
          <a-form-item label="Type">
            <a-input v-model:value="instForm.type" />
          </a-form-item>
          <a-form-item label="Location">
            <a-input v-model:value="instForm.location" />
          </a-form-item>
          <a-form-item label="Email">
            <a-input v-model:value="instForm.email" />
          </a-form-item>
          <a-form-item label="Phone">
            <a-input v-model:value="instForm.phone" />
          </a-form-item>
          <a-form-item>
            <a-switch v-model:checked="instForm.active" />
            <span class="ml-2">Active</span>
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Institution Portal – single-file, role-aware, mocked integration between:
 * - institutions plugin (institutions, departments, classrooms, members)
 * - teach-internal plugin (courses/classrooms via ID-based relation)
 *
 * Drop-in idea:
 *   plugins/institution-portal/nuxt/pages/index.vue
 *
 * Expects:
 *   - Ant Design Vue registered globally
 *   - useAuth composable providing token + me (with roles)
 */

import {
  ref,
  computed,
  onMounted,
  watch,
  defineComponent,
} from 'vue'
import { useRuntimeConfig, useRoute } from 'nuxt/app'
import { useAuth } from '../../../../packages/shared-ui/src/composables/useAuth'
import { message } from 'ant-design-vue'
import {
  ReloadOutlined,
  PlusOutlined,
  TeamOutlined,
  UserOutlined,
  CheckCircleOutlined,
  FieldTimeOutlined,
  BulbOutlined,
  ClusterOutlined,
  SafetyCertificateOutlined,
  CalendarOutlined,
  BookOutlined,
  DeleteOutlined,
  UserAddOutlined,
  ApartmentOutlined,
} from '@ant-design/icons-vue'

/* ----------------- Types ----------------- */

type RoleKey = 'admin' | 'teacher' | 'student'

interface PortalUser {
  id: string
  email?: string | null
  firstName?: string | null
  lastName?: string | null
  role?: string | null
  roles?: string[] | null
}

interface Institution {
  id: string
  name: string
  slug?: string
  description?: string | null
  type?: string | null
  location?: string | null
  email?: string | null
  phone?: string | null
  active?: boolean
}

interface Department {
  id: string
  institutionId: string
  name: string
  slug?: string
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
  // derived fields for teacher/student
  teacherId?: string | null
  enrollmentCount?: number
}

interface Member {
  id: string
  institutionId: string
  userId: string
  role: string
  status: string
}

interface TeacherCourse {
  id: string
  title: string
  institutionId?: string | null
  difficulty?: string | null
  category?: string | null
}

/* ----------------- Child Sections (inline) ----------------- */
/**
 * OverviewSection – common high-level list of institutions, with quick filters,
 * used for all roles.
 */
import { h } from 'vue'

const OverviewSection = defineComponent({
  name: 'OverviewSection',
  props: {
    institutions: { type: Array as PropType<Institution[]>, required: true },
    members: { type: Array as () => Member[], required: true },
    classrooms: { type: Array as () => PortalClassroom[], required: true },
    departments: { type: Array as () => Department[], required: true },
    effectiveRole: { type: String as () => RoleKey, required: true },
    primaryInstitutionId: { type: String, default: '' },
  },
  emits: ['open-inst'],
  setup(props, { emit }) {
    const search = ref('')
    const statusFilter = ref<'all' | 'active' | 'inactive'>('all')

    const instStatsMap = computed(() => {
      const out: Record<string, {
        departments: number
        classrooms: number
        members: number
      }> = {}

      props.institutions.forEach(i => {
        out[i.id] = { departments: 0, classrooms: 0, members: 0 }
      })

      props.departments.forEach(d => {
        if (!out[d.institutionId])
          out[d.institutionId] = { departments: 0, classrooms: 0, members: 0 }
        out[d.institutionId].departments++
      })

      props.classrooms.forEach(c => {
        if (!out[c.institutionId])
          out[c.institutionId] = { departments: 0, classrooms: 0, members: 0 }
        out[c.institutionId].classrooms++
      })

      props.members.forEach(m => {
        if (!out[m.institutionId])
          out[m.institutionId] = { departments: 0, classrooms: 0, members: 0 }
        out[m.institutionId].members++
      })

      return out
    })

    const filteredInstitutions = computed(() => {
      const q = search.value.toLowerCase().trim()
      return props.institutions.filter(i => {
        if (statusFilter.value === 'active' && !i.active) return false
        if (statusFilter.value === 'inactive' && i.active) return false
        if (!q) return true
        return (
          (i.name || '').toLowerCase().includes(q) ||
          (i.location || '').toLowerCase().includes(q)
        )
      })
    })

    const sortedInstitutions = computed(() => {
      const list = [...filteredInstitutions.value]
      if (props.primaryInstitutionId) {
        list.sort((a, b) => {
          if (a.id === props.primaryInstitutionId) return -1
          if (b.id === props.primaryInstitutionId) return 1
          return a.name.localeCompare(b.name)
        })
      } else {
        list.sort((a, b) => a.name.localeCompare(b.name))
      }
      return list
    })

    const openInst = (inst: Institution) => emit('open-inst', inst)

    /* ============================================================
       RETURN (h function)
    ============================================================ */
    return () =>
      h(
        'div',
        { class: 'section overview-section' },
        [
          h(
            'a-card',
            { class: 'section-card', bordered: true },
            {
              default: () => [
                // --- HEADER ---
                h('div', { class: 'section-header' }, [
                  h('div', null, [
                    h('h3', null, 'Institutions overview'),
                    h('p', { class: 'section-sub' },
                      'High-level list of all institutions you have access to. Content below adapts to your role.'
                    ),
                  ]),

                  h('div', { class: 'controls' }, [
                    h('a-input-search', {
                      'allow-clear': true,
                      placeholder: 'Search by name or location',
                      style: 'width: 220px',
                      'v-model:value': search.value,
                      onInput: (e: any) => (search.value = e.target.value),
                    }),

                    h(
                      'a-select',
                      {
                        style: 'width: 150px; margin-left: 8px',
                        'v-model:value': statusFilter.value,
                        onChange: (v: any) => (statusFilter.value = v),
                      },
                      {
                        default: () => [
                          h('a-select-option', { value: 'all' }, { default: () => 'All' }),
                          h('a-select-option', { value: 'active' }, { default: () => 'Active' }),
                          h('a-select-option', { value: 'inactive' }, { default: () => 'Inactive' }),
                        ],
                      }
                    ),
                  ]),
                ]),

                // --- EMPTY ---
                sortedInstitutions.value.length === 0
                  ? h('a-empty', { description: 'No institutions found' })

                  // --- INSTITUTIONS GRID ---
                  : h(
                      'a-row',
                      { gutter: [16, 16] },
                      {
                        default: () =>
                          sortedInstitutions.value.map(inst => {
                            const stats = instStatsMap.value[inst.id] || {
                              departments: 0,
                              classrooms: 0,
                              members: 0,
                            }

                            const isPrimary = inst.id === props.primaryInstitutionId

                            return h(
                              'a-col',
                              {
                                xs: 24,
                                sm: 12,
                                lg: 8,
                                key: inst.id,
                              },
                              {
                                default: () =>
                                  h(
                                    'a-card',
                                    {
                                      class: {
                                        'inst-card': true,
                                        'inst-card-primary': isPrimary,
                                        inactive: inst.active === false,
                                      },
                                      bordered: true,
                                      hoverable: true,
                                      onClick: () => openInst(inst),
                                    },
                                    {
                                      default: () => [
                                        // HEAD
                                        h('div', { class: 'inst-card-head' }, [
                                          h('div', null, [
                                            h('div', { class: 'inst-name' }, inst.name),
                                            h(
                                              'div',
                                              { class: 'inst-location' },
                                              inst.location || 'No location'
                                            ),
                                          ]),

                                          h('div', { class: 'inst-tag-wrap' }, [
                                            h(
                                              'a-tag',
                                              { color: inst.active === false ? 'red' : 'green' },
                                              { default: () => (inst.active === false ? 'Inactive' : 'Active') }
                                            ),
                                            isPrimary
                                              ? h(
                                                  'a-tag',
                                                  { color: 'blue' },
                                                  { default: () => 'Primary' }
                                                )
                                              : null,
                                          ]),
                                        ]),

                                        // GRID
                                        h('div', { class: 'inst-grid' }, [
                                          h('div', { class: 'inst-row' }, [
                                            h('span', null, 'Departments'),
                                            h('strong', null, stats.departments),
                                          ]),
                                          h('div', { class: 'inst-row' }, [
                                            h('span', null, 'Classrooms'),
                                            h('strong', null, stats.classrooms),
                                          ]),
                                          h('div', { class: 'inst-row' }, [
                                            h('span', null, 'Members'),
                                            h('strong', null, stats.members),
                                          ]),
                                        ]),

                                        // FOOTER
                                        h('div', { class: 'inst-footer' }, [
                                          inst.type
                                            ? h(
                                                'a-tag',
                                                { color: 'geekblue' },
                                                { default: () => inst.type }
                                              )
                                            : null,

                                          h(
                                            'span',
                                            { class: 'inst-role-hint' },
                                            props.effectiveRole === 'admin'
                                              ? 'Click to administer'
                                              : props.effectiveRole === 'teacher'
                                              ? 'Click to see teaching context'
                                              : 'Click to see classrooms'
                                          ),
                                        ]),
                                      ],
                                    }
                                  ),
                              }
                            )
                          }),
                      }
                    ),
              ],
            }
          ),
        ]
      )
  },
})


/**
 * AdminSection – heavy management oriented; still mocked for write actions.
 */
import {PropType } from 'vue'
const AdminSection = defineComponent({
  name: 'AdminSection',
  props: {
    institutions: { type: Array as PropType<Institution[]>, required: true },
    members: { type: Array as () => Member[], required: true },
    departments: { type: Array as () => Department[], required: true },
    classrooms: { type: Array as () => PortalClassroom[], required: true },
    loading: { type: Boolean, default: false },
  },
  emits: ['request-create', 'open-inst'],
  setup(props, { emit }) {
    const instSearch = ref('')
    const selectedInstId = ref<string | null>(null)

    const membersByInstitution = computed(() => {
      const map: Record<string, Member[]> = {}
      props.members.forEach(m => {
        if (!map[m.institutionId]) map[m.institutionId] = []
        map[m.institutionId].push(m)
      })
      return map
    })

    const filteredInst = computed(() => {
      const q = instSearch.value.toLowerCase().trim()
      let list = [...props.institutions]
      if (q) {
        list = list.filter(
          i =>
            i.name.toLowerCase().includes(q) ||
            (i.slug || '').toLowerCase().includes(q),
        )
      }
      list.sort((a, b) => a.name.localeCompare(b.name))
      return list
    })

    const currentInst = computed(() =>
      props.institutions.find(i => i.id === selectedInstId.value),
    )

    const currentDepartments = computed(() =>
      props.departments.filter(d => d.institutionId === selectedInstId.value),
    )

    const currentClassrooms = computed(() =>
      props.classrooms.filter(c => c.institutionId === selectedInstId.value),
    )

    const currentMembers = computed(
      () => membersByInstitution.value[selectedInstId.value || ''] || [],
    )

    const openInst = (inst: Institution) => {
      selectedInstId.value = inst.id
      emit('open-inst', inst)
    }

    const triggerCreate = () => emit('request-create')

    /* =================================================
       RETURN (h FUNCTION ONLY)
    ================================================= */
    return () =>
      h('div', { class: 'section admin-section' }, [
        h(
          'a-row',
          { gutter: 16 },
          {
            default: () => [
              /* ---------------- LEFT COLUMN ---------------- */
              h(
                'a-col',
                { xs: 24, md: 8 },
                {
                  default: () =>
                    h(
                      'a-card',
                      {
                        class: 'section-card',
                        title: 'Institutions',
                        loading: props.loading,
                        extra: () =>
                          h(
                            'a-button',
                            {
                              size: 'small',
                              type: 'primary',
                              onClick: triggerCreate,
                            },
                            { default: () => ['New'] }
                          ),
                      },
                      {
                        default: () => [
                          /* Search */
                          h('a-input-search', {
                            'allow-clear': true,
                            placeholder: 'Search institutions...',
                            'v-model:value': instSearch.value,
                            onInput: (e: any) =>
                              (instSearch.value = e.target.value),
                          }),

                          /* List */
                          h(
                            'a-list',
                            {
                              class: 'mt-2',
                              size: 'small',
                              bordered: true,
                              dataSource: filteredInst.value,
                            },
                            {
                              renderItem: ({ item }: any) =>
                                h(
                                  'a-list-item',
                                  {
                                    class: {
                                      'inst-item': true,
                                      active: item.id === selectedInstId.value,
                                    },
                                    onClick: () => openInst(item),
                                  },
                                  {
                                    default: () =>
                                      h('a-list-item-meta', {
                                        title: item.name,
                                        description: item.slug || 'no slug',
                                      }),

                                    actions: () => [
                                      h(
                                        'a-tag',
                                        {
                                          size: 'small',
                                          color:
                                            item.active === false
                                              ? 'red'
                                              : 'green',
                                        },
                                        {
                                          default: () =>
                                            item.active === false
                                              ? 'Inactive'
                                              : 'Active',
                                        },
                                      ),
                                    ],
                                  }
                                ),
                            }
                          ),
                        ],
                      }
                    ),
                }
              ),

              /* ---------------- RIGHT COLUMN ---------------- */
              h(
                'a-col',
                { xs: 24, md: 16 },
                {
                  default: () =>
                    h(
                      'a-card',
                      {
                        class: 'section-card',
                        title:
                          currentInst.value?.name ||
                          'Select an institution',
                        loading: props.loading,
                      },
                      {
                        default: () =>
                          currentInst.value
                            ? [
                                h(
                                  'p',
                                  { class: 'section-sub' },
                                  'Manage departments, classrooms and members. Actions are mocked – you can wire them to your institution API later.'
                                ),

                                /* Tabs */
                                h(
                                  'a-tabs',
                                  { 'default-active-key': 'departments' },
                                  {
                                    default: () => [
                                      /* ---------------- Departments tab ---------------- */
                                      h(
                                        'a-tab-pane',
                                        {
                                          key: 'departments',
                                          tab: 'Departments',
                                        },
                                        {
                                          default: () =>
                                            currentDepartments.value.length ===
                                            0
                                              ? h('a-empty', {
                                                  description:
                                                    'No departments yet',
                                                })
                                              : h(
                                                  'a-list',
                                                  {
                                                    size: 'small',
                                                    bordered: true,
                                                    dataSource:
                                                      currentDepartments.value,
                                                  },
                                                  {
                                                    renderItem: ({
                                                      item,
                                                    }: any) =>
                                                      h(
                                                        'a-list-item',
                                                        null,
                                                        {
                                                          default: () =>
                                                            h(
                                                              'a-list-item-meta',
                                                              {
                                                                title:
                                                                  item.name,
                                                                description:
                                                                  item.slug,
                                                              }
                                                            ),
                                                          actions: () => [
                                                            h(
                                                              'a-tag',
                                                              {
                                                                color:
                                                                  item.active ===
                                                                  false
                                                                    ? 'default'
                                                                    : 'green',
                                                              },
                                                              {
                                                                default: () =>
                                                                  item.active ===
                                                                  false
                                                                    ? 'Inactive'
                                                                    : 'Active',
                                                              }
                                                            ),
                                                          ],
                                                        }
                                                      ),
                                                  }
                                                ),
                                        }
                                      ),

                                      /* ---------------- Classrooms tab ---------------- */
                                      h(
                                        'a-tab-pane',
                                        {
                                          key: 'classrooms',
                                          tab: 'Classrooms',
                                        },
                                        {
                                          default: () =>
                                            currentClassrooms.value.length ===
                                            0
                                              ? h('a-empty', {
                                                  description:
                                                    'No classrooms yet',
                                                })
                                              : h(
                                                  'a-table',
                                                  {
                                                    size: 'small',
                                                    dataSource:
                                                      currentClassrooms.value,
                                                    pagination: false,
                                                    rowKey: 'id',
                                                  },
                                                  {
                                                    default: () => [
                                                      h(
                                                        'a-table-column',
                                                        {
                                                          title: 'Title',
                                                          dataIndex: 'title',
                                                          key: 'title',
                                                          customRender: ({
                                                            text,
                                                            record,
                                                          }: any) =>
                                                            text ||
                                                            record.code,
                                                        }
                                                      ),

                                                      h(
                                                        'a-table-column',
                                                        {
                                                          title: 'Code',
                                                          dataIndex: 'code',
                                                          key: 'code',
                                                        }
                                                      ),

                                                      h(
                                                        'a-table-column',
                                                        {
                                                          title: 'Capacity',
                                                          dataIndex:
                                                            'capacity',
                                                          key: 'capacity',
                                                        }
                                                      ),

                                                      h(
                                                        'a-table-column',
                                                        {
                                                          title: 'Status',
                                                          key: 'status',
                                                          customRender: ({
                                                            record,
                                                          }: any) =>
                                                            h(
                                                              'a-tag',
                                                              {
                                                                color:
                                                                  record.status ===
                                                                  'active'
                                                                    ? 'green'
                                                                    : 'default',
                                                              },
                                                              {
                                                                default: () =>
                                                                  record.status ||
                                                                  'pending',
                                                              }
                                                            ),
                                                        }
                                                      ),
                                                    ],
                                                  }
                                                ),
                                        }
                                      ),

                                      /* ---------------- Members tab ---------------- */
                                      h(
                                        'a-tab-pane',
                                        {
                                          key: 'members',
                                          tab: 'Members',
                                        },
                                        {
                                          default: () =>
                                            currentMembers.value.length === 0
                                              ? h('a-empty', {
                                                  description:
                                                    'No members yet',
                                                })
                                              : h(
                                                  'a-table',
                                                  {
                                                    size: 'small',
                                                    dataSource:
                                                      currentMembers.value,
                                                    pagination: false,
                                                    rowKey: 'id',
                                                  },
                                                  {
                                                    default: () => [
                                                      h(
                                                        'a-table-column',
                                                        {
                                                          title: 'User ID',
                                                          dataIndex: 'userId',
                                                          key: 'userId',
                                                        }
                                                      ),

                                                      h(
                                                        'a-table-column',
                                                        {
                                                          title: 'Role',
                                                          dataIndex: 'role',
                                                          key: 'role',
                                                        }
                                                      ),

                                                      h(
                                                        'a-table-column',
                                                        {
                                                          title: 'Status',
                                                          dataIndex: 'status',
                                                          key: 'status',
                                                        }
                                                      ),
                                                    ],
                                                  }
                                                ),
                                        }
                                      ),
                                    ],
                                  }
                                ),
                              ]
                            : h('a-empty', {
                                description: 'Pick an institution on the left',
                              }),
                      }
                    ),
                }
              ),
            ],
          }
        ),
      ])
  },
})


/**
 * TeacherSection – teacher-focused mapping of classrooms to courses.
 */

 const TeacherSection = defineComponent({
  name: 'TeacherSection',
  props: {
    me: { type: Object as PropType<PortalUser>, required: true },
    institutions: { type: Array as PropType<Institution[]>, required: true },
    departments: { type: Array as PropType<Department[]>, required: true },
    classrooms: { type: Array as PropType<PortalClassroom[]>, required: true },
    teacherClassrooms: { type: Array as PropType<PortalClassroom[]>, required: true },
    teacherCourses: { type: Array as PropType<TeacherCourse[]>, required: true },
  },

  setup(props) {
    const activeView = ref<'grid' | 'table'>('table')

    const instById = computed(() => {
      const map: Record<string, Institution> = {}
      props.institutions.forEach(i => map[i.id] = i)
      return map
    })

    const deptById = computed(() => {
      const map: Record<string, Department> = {}
      props.departments.forEach(d => map[d.id] = d)
      return map
    })

    const courseByInstitution = computed(() => {
      const m: Record<string, TeacherCourse[]> = {}
      props.teacherCourses.forEach(c => {
        const instId = c.institutionId || 'unassigned'
        if (!m[instId]) m[instId] = []
        m[instId].push(c)
      })
      return m
    })

    const teacherInstIds = computed(() => {
      const set = new Set<string>()
      props.teacherClassrooms.forEach(c => set.add(c.institutionId))
      return [...set]
    })

    const teacherInstitutions = computed(() =>
      props.institutions.filter(i => teacherInstIds.value.includes(i.id))
    )

    // ---------------------------------------------------------
    // RETURN (PURE H FUNCTION)
    // ---------------------------------------------------------
    return () =>
      h('div', { class: 'section teacher-section' }, [

        /* -----------------------------------------------------
           ROW
        ----------------------------------------------------- */
        h('a-row', { gutter: 16 }, {

          default: () => [

            /* ============================================================
               LEFT COLUMN — My Institutions
            ============================================================ */
            h('a-col', { xs: 24, md: 9 }, {
              default: () =>
                h('a-card', {
                  class: 'section-card',
                  title: 'My Institutions',
                  extra: () =>
                    h('a-tag',
                      { color: 'purple' },
                      () => `Teacher · ${props.me.email || props.me.id}`
                    )
                }, {

                  default: () =>
                    teacherInstitutions.value.length === 0
                      ? h('a-empty', { description: 'You’re not assigned to any institution yet' })
                      : h('a-timeline', null, {
                        default: () =>
                          teacherInstitutions.value.map(inst =>
                            h('a-timeline-item', { key: inst.id }, {
                              default: () =>
                                h('div', { class: 'inst-timeline-item' }, [
                                  h('div', { class: 'name' }, inst.name),
                                  h('div', { class: 'meta' },
                                    `${inst.location || 'No location'} · ${
                                      courseByInstitution.value[inst.id]?.length || 0
                                    } courses`
                                  )
                                ])
                            })
                          )
                      })
                })
            }),

            /* ============================================================
               RIGHT COLUMN — Classrooms + Courses
            ============================================================ */
            h('a-col', { xs: 24, md: 15 }, {

              default: () => [

                // ---------------------------------------------------------
                // My Classrooms CARD
                // ---------------------------------------------------------
                h('a-card', {
                  class: 'section-card',
                  title: 'My Classrooms',
                  extra: () =>
                    h('a-radio-group', {
                      size: 'small',
                      'modelValue': activeView.value,
                      'onUpdate:modelValue': (v: any) => activeView.value = v
                    }, {
                      default: () => [
                        h('a-radio-button', { value: 'table' }, () => 'Table'),
                        h('a-radio-button', { value: 'grid' }, () => 'Cards')
                      ]
                    })
                }, {

                  default: () => {

                    // no classrooms
                    if (props.teacherClassrooms.length === 0) {
                      return h('a-empty', { description: 'No classrooms yet' })
                    }

                    // TABLE VIEW
                    if (activeView.value === 'table') {
                      return h('a-table', {
                        size: 'small',
                        dataSource: props.teacherClassrooms,
                        rowKey: 'id',
                        pagination: { pageSize: 7 }
                      }, {
                        default: () => [

                          h('a-table-column', {
                            title: 'Classroom',
                            key: 'title',
                            customRender: ({ record }: any) =>
                              record.title || record.code
                          }),

                          h('a-table-column', {
                            title: 'Code',
                            dataIndex: 'code',
                            key: 'code'
                          }),

                          h('a-table-column', {
                            title: 'Institution',
                            key: 'inst',
                            customRender: ({ record }: any) =>
                              instById.value[record.institutionId]?.name || '—'
                          }),

                          h('a-table-column', {
                            title: 'Department',
                            key: 'dept',
                            customRender: ({ record }: any) =>
                              deptById.value[record.departmentId || '']?.name || '—'
                          }),

                          h('a-table-column', {
                            title: 'Capacity',
                            dataIndex: 'capacity',
                            key: 'capacity'
                          }),

                          h('a-table-column', {
                            title: 'Enrollment',
                            key: 'enrollment',
                            customRender: ({ record }: any) =>
                              record.enrollmentCount ?? '—'
                          }),

                          h('a-table-column', {
                            title: 'Status',
                            key: 'status',
                            customRender: ({ record }: any) =>
                              h('a-tag', {
                                color:
                                  record.status === 'active'
                                    ? 'green'
                                    : record.status === 'archived'
                                    ? 'red'
                                    : 'default'
                              }, () => record.status || 'pending')
                          })
                        ]
                      })
                    }

                    // GRID VIEW
                    return h('a-row', { gutter: [12, 12] }, {
                      default: () =>
                        props.teacherClassrooms.map(c =>
                          h('a-col', { xs: 24, sm: 12, key: c.id }, {
                            default: () =>
                              h('a-card', { hoverable: true }, {
                                default: () => [
                                  h('div', { class: 'card-head' }, [
                                    h('div', null, [
                                      h('div', { class: 'card-title' }, c.title || c.code),
                                      h('div', { class: 'card-sub' }, c.code)
                                    ]),
                                    h('a-tag', {
                                      color:
                                        c.status === 'active'
                                          ? 'green'
                                          : c.status === 'archived'
                                          ? 'red'
                                          : 'default'
                                    }, () => c.status || 'pending')
                                  ]),

                                  h('div', { class: 'row' }, [
                                    h('span', null, 'Institution'),
                                    h('strong', null,
                                      instById.value[c.institutionId]?.name || '—'
                                    )
                                  ]),

                                  h('div', { class: 'row' }, [
                                    h('span', null, 'Department'),
                                    h('strong', null,
                                      deptById.value[c.departmentId || '']?.name || '—'
                                    )
                                  ]),

                                  h('div', { class: 'row' }, [
                                    h('span', null, 'Capacity'),
                                    h('strong', null, c.capacity || 30)
                                  ]),

                                  h('div', { class: 'row' }, [
                                    h('span', null, 'Enrollment'),
                                    h('strong', null,
                                      c.enrollmentCount != null
                                        ? c.enrollmentCount
                                        : '—'
                                    )
                                  ])
                                ]
                              })
                          })
                        )
                    })
                  }
                }),

                // ---------------------------------------------------------
                // Courses Card
                // ---------------------------------------------------------
                h('a-card', {
                  class: 'section-card mt-2',
                  title: 'Courses (mocked mapping)'
                }, {
                  default: () =>
                    props.teacherCourses.length === 0
                      ? h('a-empty', { description: 'No courses returned from teach-internal yet' })
                      : h('a-row', { gutter: [12, 12] }, {
                        default: () =>
                          props.teacherCourses.map(course =>
                            h('a-col', { xs: 24, sm: 12, md: 8, key: course.id }, {
                              default: () =>
                                h('a-card', { hoverable: true, size: 'small' }, {
                                  default: () => [
                                    h('div', { class: 'card-title-sm' }, course.title),
                                    h('div', { class: 'card-meta-sm' },
                                      `${course.category || 'General'} · ${
                                        course.difficulty || 'Mixed'
                                      }`
                                    ),
                                    h('div', { class: 'card-meta-sm' }, [
                                      'Institution: ',
                                      course.institutionId
                                        ? instById.value[course.institutionId]?.name ||
                                          course.institutionId
                                        : 'Unassigned'
                                    ])
                                  ]
                                })
                            })
                          )
                      })
                })
              ]
            })
          ]
        })
      ])
  }
})

/* ----------------- Root logic ----------------- */

const config = useRuntimeConfig()
const apiBase = config.public?.apiBase || 'http://localhost:4000'
const route = useRoute()
const auth: any = useAuth()

const tokenRef = computed<string | null>(() => {
  const t =
    auth?.token?.value ||
    auth?.accessToken?.value ||
    (typeof window !== 'undefined'
      ? window.localStorage.getItem('token')
      : null)
  return t || null
})

const me = computed<PortalUser | null>(() => {
  const src =
    auth?.me?.value ||
    auth?.user?.value ||
    auth?.currentUser?.value ||
    null
  return src
    ? {
        id: src.id,
        email: src.email,
        firstName: src.firstName,
        lastName: src.lastName,
        role: src.role,
        roles: src.roles,
      }
    : null
})

function tokenHeader() {
  const t = tokenRef.value
  return t ? { Authorization: `Bearer ${t}` } : {}
}

// main data
const institutions = ref<Institution[]>([])
const departments = ref<Department[]>([])
const classrooms = ref<PortalClassroom[]>([])
const members = ref<Member[]>([])
const teacherCourses = ref<TeacherCourse[]>([])

// UI state
const initialLoading = ref(true)
const loadError = ref<string | null>(null)
const savingAdmin = ref(false)
const activeTabKey = ref('overview')
const isDarkMode = ref<boolean>(
  typeof window !== 'undefined' &&
  window.localStorage.getItem('inst-portal-theme') === 'dark'
)

const devMode = ref(false)
const devRoleOverride = ref('')
const instDrawerOpen = ref(false)
const selectedInstitution = ref<Institution | null>(null)
const instModalOpen = ref(false)
const instForm = ref<any>({
  id: '',
  name: '',
  slug: '',
  type: '',
  location: '',
  email: '',
  phone: '',
  active: true,
})

const simpleEmptyImage = 'https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg'

/* -------- effective role -------- */

const detectedRole = computed<RoleKey>(() => {
  const user = me.value
  if (!user) return 'student'
  const roles = (user.roles || []).map((r) => r.toLowerCase())
  const primary = (user.role || '').toLowerCase()

  const all = [...roles, primary].join(',')
  if (all.includes('admin')) return 'admin'
  if (all.includes('teacher')) return 'teacher'
  return 'student'
})

const effectiveRole = computed<RoleKey>(() => {
  if (!devMode.value || !devRoleOverride.value) return detectedRole.value
  if (devRoleOverride.value === 'admin') return 'admin'
  if (devRoleOverride.value === 'teacher') return 'teacher'
  if (devRoleOverride.value === 'student') return 'student'
  return detectedRole.value
})

const isAdminLike = computed(() => effectiveRole.value === 'admin')
const isTeacherLike = computed(
  () => effectiveRole.value === 'teacher' || effectiveRole.value === 'admin',
)
const isStudent = computed(() => effectiveRole.value === 'student')

/* -------- derived data -------- */

const institutionsById = computed<Record<string, Institution>>(() => {
  const m: Record<string, Institution> = {}
  institutions.value.forEach((i) => (m[i.id] = i))
  return m
})

const primaryInstitutionId = computed(() => {
  // naive: first membership institution
  const myId = me.value?.id
  if (!myId) return ''
  const mem = members.value.find((m) => m.userId === myId)
  return mem?.institutionId || ''
})

const primaryInstitution = computed(
  () => institutionsById.value[primaryInstitutionId.value],
)

const activeInstitutions = computed(() =>
  institutions.value.filter((i) => i.active !== false),
)

const activeClassrooms = computed(() =>
  classrooms.value.filter((c) => c.status === 'active'),
)

const myMemberships = computed(() => {
  const id = me.value?.id
  if (!id) return []
  return members.value.filter((m) => m.userId === id)
})

const myTeacherClassrooms = computed(() => {
  if (!me.value) return []
  const id = me.value.id
  // from membership OR teacherId field
  return classrooms.value.filter(
    (c) =>
      c.teacherId === id ||
      myMemberships.value.some(
        (m) => m.institutionId === c.institutionId && m.role === 'teacher',
      ),
  )
})

const myStudentClassrooms = computed(() => {
  if (!me.value) return []
  const id = me.value.id
  // we don't have ClassroomEnrollment in overview, so approximate with membership
  return classrooms.value.filter((c) =>
    myMemberships.value.some(
      (m) => m.institutionId === c.institutionId && m.role === 'student',
    ),
  )
})

const myMembershipClassrooms = computed(() => {
  if (!me.value) return []
  const instIds = new Set(myMemberships.value.map((m) => m.institutionId))
  return classrooms.value.filter((c) => instIds.has(c.institutionId))
})

/* -------- header meta -------- */

const meDisplayName = computed(() => {
  if (!me.value) return 'Welcome'
  if (me.value.firstName || me.value.lastName) {
    return `${me.value.firstName || ''} ${me.value.lastName || ''}`.trim()
  }
  return me.value.email || me.value.id
})

const roleLabel = computed(() => {
  if (effectiveRole.value === 'admin') return 'Institution Admin'
  if (effectiveRole.value === 'teacher') return 'Teacher'
  return 'Student'
})

const roleTagline = computed(() => {
  switch (effectiveRole.value) {
    case 'admin':
      return 'Configure institutions, departments and classrooms across teach-internal.'
    case 'teacher':
      return 'See how your courses and classrooms connect to institutions and students.'
    case 'student':
      return 'View your institutions, classrooms and learning context in one place.'
    default:
      return ''
  }
})

/* -------- loading / API -------- */

async function loadOverview() {
  if (!tokenRef.value) {
    loadError.value = 'Missing auth token'
    initialLoading.value = false
    return
  }
  initialLoading.value = true
  loadError.value = null
  try {
    const resp = await fetch(`${apiBase}/api/institution-portal/overview`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        ...tokenHeader(),
      } as any,
    })
    if (!resp.ok) {
      throw new Error(`HTTP ${resp.status}`)
    }
    const json = await resp.json()
    const data = json || {}

    institutions.value = data.institutions || []
    departments.value = data.departments || []
    classrooms.value = (data.classrooms || []).map((c: any) => ({
      ...c,
      teacherId: c.teacherId || null,
      enrollmentCount: c.enrollments?.length ?? c.enrollment ?? null,
    }))
    members.value = data.members || []

    // Optionally try to pull teacher courses from teach-internal; fallback to mock
    await loadTeacherCoursesViaTeach()
  } catch (e: any) {
    console.warn('[institution-portal] overview load failed', e)
    loadError.value = e?.message || 'Failed to load overview'
  } finally {
    initialLoading.value = false
  }
}

async function loadTeacherCoursesViaTeach() {
  teacherCourses.value = []
  if (!isTeacherLike.value || !tokenRef.value) return
  try {
    const resp = await fetch(`${apiBase}/api/teach-internal/graphql`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...tokenHeader(),
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
    const courses = json?.data?.myCourses || []
    if (!Array.isArray(courses) || courses.length === 0) {
      // fallback to mock
      buildMockCoursesFromClassrooms()
    } else {
      teacherCourses.value = courses
    }
  } catch (e: any) {
    console.warn('[institution-portal] teacher courses load failed, mocking', e)
    buildMockCoursesFromClassrooms()
  }
}

function buildMockCoursesFromClassrooms() {
  if (!me.value) return
  const seen = new Set<string>()
  const mock: TeacherCourse[] = []
  myTeacherClassrooms.value.slice(0, 6).forEach((c, idx) => {
    const id = c.id
    if (seen.has(id)) return
    seen.add(id)
    mock.push({
      id,
      title: c.title || `Lab ${idx + 1} (mock)`,
      category: 'Institution-linked',
      difficulty: idx % 2 === 0 ? 'Intermediate' : 'Beginner',
      institutionId: c.institutionId,
    })
  })
  teacherCourses.value = mock
}

/* -------- actions / helpers -------- */

function emitLogin() {
  // you can wire this to your global auth modal or router
  message.info('Trigger login flow from institution-portal page.')
}

function refreshAll() {
  loadOverview()
}

function persistTheme() {
  if (typeof window === 'undefined') return
  window.localStorage.setItem('inst-portal-theme', isDarkMode.value ? 'dark' : 'light')
}

watch(
  () => isDarkMode.value,
  () => persistTheme(),
)

function handleOpenInstitution(inst: Institution) {
  selectedInstitution.value = inst
  instDrawerOpen.value = true
}

const selectedInstDepartments = computed(() =>
  selectedInstitution.value
    ? departments.value.filter(
        (d) => d.institutionId === selectedInstitution.value!.id,
      )
    : [],
)

const selectedInstClassrooms = computed(() =>
  selectedInstitution.value
    ? classrooms.value.filter(
        (c) => c.institutionId === selectedInstitution.value!.id,
      )
    : [],
)

const selectedInstMembers = computed(() =>
  selectedInstitution.value
    ? members.value.filter(
        (m) => m.institutionId === selectedInstitution.value!.id,
      )
    : [],
)

function openCreateInstitution() {
  instForm.value = {
    id: '',
    name: '',
    slug: '',
    type: '',
    location: '',
    email: '',
    phone: '',
    active: true,
  }
  instModalOpen.value = true
}

function openTeacherFocus() {
  activeTabKey.value = 'teaching'
}

function openStudentFocus() {
  activeTabKey.value = 'learning'
}

function mockSaveInstitution() {
  if (!instForm.value.name?.trim()) {
    message.error('Name is required')
    return
  }
  const existing = institutions.value.find((i) => i.id === instForm.value.id)
  if (existing) {
    Object.assign(existing, instForm.value)
    message.success('Updated institution (mock only)')
  } else {
    institutions.value.push({
      id: `mock_${Date.now()}`,
      name: instForm.value.name,
      slug:
        instForm.value.slug ||
        instForm.value.name.toLowerCase().replace(/\s+/g, '-'),
      type: instForm.value.type,
      location: instForm.value.location,
      email: instForm.value.email,
      phone: instForm.value.phone,
      active: instForm.value.active,
    })
    message.success('Created institution (mock only)')
  }
  instModalOpen.value = false
}

function mockJoinInstitution() {
  if (!selectedInstitution.value || !me.value) return
  message.success(
    `Mock: joining institution ${selectedInstitution.value.name} as student via institutions + teach APIs`,
  )
}

function mockArchiveInstitution() {
  if (!selectedInstitution.value) return
  selectedInstitution.value.active = false
  message.success('Mock: archived institution (local state only)')
}

/* -------- dev mode defaults from query -------- */

onMounted(() => {
  if (route.query.dev === '1' || route.query.dev === 'true') {
    devMode.value = true
  }
  if (route.query.role === 'admin') devRoleOverride.value = 'admin'
  if (route.query.role === 'teacher') devRoleOverride.value = 'teacher'
  if (route.query.role === 'student') devRoleOverride.value = 'student'

  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', isDarkMode.value)
  }

  loadOverview()
})

watch(
  () => isDarkMode.value,
  (val) => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', val)
    }
  },
)
</script>

<style scoped>
.inst-portal-page {
  padding: 16px 24px 32px;
  max-width: 1480px;
  margin: 0 auto;
  transition: background 0.2s ease, color 0.2s ease;
}

.inst-portal-page.theme-light {
  background: #f5f7fb;
  color: #111827;
}

.inst-portal-page.theme-dark {
  background: #020617;
  color: #e5e7eb;
}

.full-center {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.portal-shell {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Header */

.portal-header {
  display: grid;
  grid-template-columns: minmax(0, 2.1fr) minmax(0, 1.7fr);
  gap: 16px;
  margin-bottom: 4px;
}

@media (max-width: 960px) {
  .portal-header {
    grid-template-columns: minmax(0, 1fr);
  }
}

.portal-header .left {
  padding-right: 8px;
}

.portal-header .right {
  padding-left: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.pill-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.role-pill {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 600;
  background: rgba(59, 130, 246, 0.1);
  color: #1d4ed8;
}

.role-pill .dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  margin-right: 6px;
}

.dot-admin {
  background: #f97316;
}

.dot-teacher {
  background: #22c55e;
}

.dot-student {
  background: #6366f1;
}

.inst-pill {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 12px;
  background: rgba(15, 23, 42, 0.06);
  gap: 6px;
}

.inst-name {
  font-weight: 500;
}

.title {
  margin: 0;
  font-size: 26px;
  font-weight: 700;
}

.subtitle {
  margin: 4px 0 12px;
  color: #6b7280;
}

.inst-portal-page.theme-dark .subtitle {
  color: #9ca3af;
}

/* Quick meta */

.quick-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.meta-item {
  padding: 6px 10px;
  border-radius: 10px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  min-width: 110px;
}

.inst-portal-page.theme-dark .meta-item {
  background: #020617;
  border-color: #111827;
}

.meta-label {
  font-size: 11px;
  color: #6b7280;
}

.inst-portal-page.theme-dark .meta-label {
  color: #9ca3af;
}

.meta-value {
  font-size: 18px;
  font-weight: 700;
}

/* Header right */

.top-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12px;
  gap: 8px;
}

.primary-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
  justify-content: flex-end;
}

.badge-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

@media (max-width: 640px) {
  .badge-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

.badge {
  background: #ffffff;
  border-radius: 12px;
  padding: 8px 10px;
  border: 1px solid #e5e7eb;
  font-size: 12px;
}

.inst-portal-page.theme-dark .badge {
  background: #020617;
  border-color: #111827;
}

.badge :deep(.anticon) {
  margin-right: 6px;
}

.b-title {
  font-weight: 600;
  margin-top: 2px;
}

.b-sub {
  font-size: 11px;
  color: #6b7280;
}

/* Sections */

.section {
  margin-top: 4px;
}

.section-card {
  border-radius: 12px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.section-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.section-sub {
  margin: 0;
  font-size: 12px;
  color: #6b7280;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* Stats */

.stats-section {
  margin-top: 2px;
}

.stat-card {
  border-radius: 10px;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
}

.stat-value {
  font-size: 22px;
  font-weight: 700;
}

.stat-hint {
  font-size: 11px;
  color: #9ca3af;
  margin-top: 2px;
}

/* Tabs */

.tabs-section {
  margin-top: 8px;
}

/* Overview cards */

.inst-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s ease, transform 0.1s ease;
}

.inst-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 16px rgba(15, 23, 42, 0.12);
}

.inst-card.inactive {
  opacity: 0.65;
}

.inst-card-primary {
  border-color: #3b82f6 !important;
}

.inst-card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.inst-name {
  font-size: 15px;
  font-weight: 600;
}

.inst-location {
  font-size: 12px;
  color: #9ca3af;
}

.inst-tag-wrap {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.inst-grid {
  display: grid;
  gap: 4px;
  font-size: 12px;
  margin-top: 8px;
}

.inst-row {
  display: flex;
  justify-content: space-between;
}

.inst-row span {
  color: #9ca3af;
}

.inst-footer {
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
}

.inst-role-hint {
  color: #9ca3af;
}

/* Admin section */

.inst-item {
  cursor: pointer;
}

.inst-item.active {
  background: #eff6ff;
}

.inst-portal-page.theme-dark .inst-item.active {
  background: #0b1120;
}

/* Timeline */

.inst-timeline-item .name {
  font-weight: 600;
}

.inst-timeline-item .meta {
  font-size: 12px;
  color: #9ca3af;
}

/* Generic rows */

.card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-weight: 700;
}

.card-sub {
  font-size: 12px;
  color: #9ca3af;
}

.row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  margin-top: 4px;
}

/* Small cards */

.card-title-sm {
  font-size: 13px;
  font-weight: 600;
}

.card-meta-sm {
  font-size: 11px;
  color: #9ca3af;
}

/* Drawer */

.drawer-sub {
  font-size: 12px;
  color: #9ca3af;
}

.drawer-section {
  margin-top: 12px;
}

.drawer-section h4 {
  margin: 0 0 6px;
  font-size: 14px;
  font-weight: 600;
}

.badge-green {
  font-size: 11px;
  color: #16a34a;
}

.badge-grey {
  font-size: 11px;
  color: #6b7280;
}

.drawer-footer {
  margin-top: 16px;
  display: flex;
  gap: 8px;
}

/* JSON viewer */

.json-viewer {
  max-height: 320px;
  overflow: auto;
  font-size: 11px;
  background: #020617;
  color: #e5e7eb;
  padding: 8px;
  border-radius: 6px;
}

/* Utilities */

.mt-1 {
  margin-top: 4px;
}

.mt-2 {
  margin-top: 8px;
}

.ml-2 {
  margin-left: 8px;
}

/* Tag colors in drawer */

.tag-active {
  color: #16a34a;
}

.tag-inactive {
  color: #ef4444;
}
</style>
