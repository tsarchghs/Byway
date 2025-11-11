<template>
  <div class="profile-page">
    <!-- ===== PAGE HEADER ===== -->
    <a-page-header
      class="profile-header"
      title="Your Profile"
      :sub-title="userEmail || 'Welcome to Byway'"
    >
      <template #tags>
        <a-tag color="blue" v-if="isLoggedIn">Logged In</a-tag>
        <a-tag color="red" v-else>Guest</a-tag>
      </template>

      <template #extra>
        <a-space>
          <a-button v-if="!isLoggedIn" type="primary" href="/auth/login">Log in</a-button>
          <a-button v-if="isLoggedIn" @click="logout" danger>Logout</a-button>
        </a-space>
      </template>

      <template #avatar>
        <a-avatar :size="64" :src="profile.avatar || '/user.png'"/>
      </template>

      <a-descriptions :column="2" size="small" class="profile-desc">
        <a-descriptions-item label="Name">
          {{ profile.name || '—' }}
        </a-descriptions-item>
        <a-descriptions-item label="Email">
          {{ userEmail || '—' }}
        </a-descriptions-item>
        <a-descriptions-item label="Member Since">
          {{ memberSince || '—' }}
        </a-descriptions-item>
        <a-descriptions-item label="Role">
          {{ profile.role || 'Student' }}
        </a-descriptions-item>
      </a-descriptions>
    </a-page-header>

    <!-- ===== STATS BAR ===== -->
    <a-card class="stats-card" :bordered="true">
      <a-row :gutter="[16,16]">
        <a-col :xs="12" :md="6">
          <a-statistic title="Enrolled Courses" :value="stats.enrolled" />
        </a-col>
        <a-col :xs="12" :md="6">
          <a-statistic title="Orders" :value="stats.orders" />
        </a-col>
        <a-col :xs="12" :md="6">
          <a-statistic title="Wishlist" :value="stats.wishlist" />
        </a-col>
        <a-col :xs="12" :md="6">
          <a-statistic title="Completed Lessons" :value="stats.completedLessons" />
        </a-col>
      </a-row>
    </a-card>

    <!-- ===== BODY TABS ===== -->
    <a-card class="body-card" :bordered="true">
      <a-tabs v-model:activeKey="tabKey">
        <!-- 1) OVERVIEW -->
        <a-tab-pane key="overview" tab="Overview">
          <a-row :gutter="[16,16]">
            <a-col :xs="24" :lg="12">
              <a-card title="Recent Courses" :loading="loading.courses">
                <a-empty v-if="!recentCourses.length" description="No recent courses yet" />
                <a-list
                  v-else
                  item-layout="horizontal"
                  :data-source="recentCourses"
                  :renderItem="renderCourseRow"
                />
              </a-card>
            </a-col>

            <a-col :xs="24" :lg="12">
              <a-card title="Recent Orders" :loading="loading.orders">
                <a-empty v-if="!recentOrders.length" description="No orders yet" />
                <a-list
                  v-else
                  item-layout="horizontal"
                  :data-source="recentOrders"
                  :renderItem="renderOrderRow"
                />
              </a-card>
            </a-col>
          </a-row>
        </a-tab-pane>

        <!-- 2) MY COURSES -->
        <a-tab-pane key="courses" tab="My Courses">
          <a-alert
            v-if="!isLoggedIn"
            type="info"
            show-icon
            message="Log in to see your enrolled courses."
            style="margin-bottom: 12px"
          />
          <a-skeleton v-if="loading.courses" active :paragraph="{ rows: 5 }" />
          <template v-else>
            <a-empty v-if="!myCourses.length" description="You have no enrollments yet" />
            <a-row :gutter="[16,16]">
              <a-col v-for="c in myCourses" :key="c.id" :xs="24" :md="12" :lg="8">
                <a-card class="course-card" :hoverable="true" @click="goCourse(c.id)">
                  <a-image :src="c.thumb || '/course-thumb.jpg'" class="course-thumb" :preview="false" />
                  <div class="course-meta">
                    <div class="title">{{ c.title }}</div>
                    <div class="muted">{{ c.category || '—' }} · {{ c.level || 'All levels' }}</div>
                    <a-progress :percent="c.progress?.percent || 0" size="small" status="active" />
                    <div class="muted small">
                      {{ c.progress?.completedLessons || 0 }}/{{ c.progress?.totalLessons || 0 }} lessons
                    </div>
                  </div>
                </a-card>
              </a-col>
            </a-row>
          </template>
        </a-tab-pane>

        <!-- 3) ORDERS -->
        <a-tab-pane key="orders" tab="Orders & Invoices">
          <a-alert
            v-if="!isLoggedIn"
            type="info"
            show-icon
            message="Log in to see your orders."
            style="margin-bottom: 12px"
          />
          <a-skeleton v-if="loading.orders" active :paragraph="{ rows: 5 }" />
          <template v-else>
            <a-empty v-if="!orders.length" description="You don't have any orders yet" />
            <a-table
              v-else
              :data-source="orders"
              :columns="orderColumns"
              row-key="id"
              size="middle"
              :pagination="{ pageSize: 5 }"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'items'">
                  <a-space direction="vertical" size="small">
                    <div v-for="(it, idx) in (record.items || [])" :key="idx" class="muted">
                      {{ it.title || it.courseId }} × {{ it.quantity || 1 }}
                    </div>
                  </a-space>
                </template>
                <template v-else-if="column.key === 'total'">
                  <span>{{ money(record.total || 0, record.currency || 'EUR') }}</span>
                </template>
                <template v-else-if="column.key === 'createdAt'">
                  <span>{{ fmtDate(record.createdAt) }}</span>
                </template>
                <template v-else-if="column.key === 'status'">
                  <a-tag :color="orderStatusColor(record.status)">{{ record.status }}</a-tag>
                </template>
              </template>
            </a-table>
          </template>
        </a-tab-pane>

        <!-- 4) BILLING -->
        <a-tab-pane key="billing" tab="Billing">
          <a-card title="Payment Methods & Invoices">
            <a-space direction="vertical" style="width: 100%">
              <a-typography-paragraph>
                Manage your payment methods, invoices and subscriptions through the Stripe customer portal.
              </a-typography-paragraph>

              <a-space>
                <a-button type="primary" :loading="loading.portal" @click="openBillingPortal">
                  Open Stripe Portal
                </a-button>
                <a-button :loading="loading.portal" @click="createTestInvoice">
                  Create Test Invoice (dev)
                </a-button>
              </a-space>

              <a-alert
                v-if="portalError"
                type="error"
                :message="portalError"
                show-icon
                style="margin-top: 8px"
              />
            </a-space>
          </a-card>
        </a-tab-pane>

        <!-- 5) SETTINGS -->
        <a-tab-pane key="settings" tab="Settings">
          <a-form layout="vertical" class="settings-form" @submit.prevent="saveSettings">
            <a-row :gutter="[16,16]">
              <a-col :xs="24" :md="12">
                <a-form-item label="Full Name">
                  <a-input v-model:value="edit.name" placeholder="Your full name" />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :md="12">
                <a-form-item label="Public Title">
                  <a-input v-model:value="edit.title" placeholder="e.g. Frontend Developer" />
                </a-form-item>
              </a-col>
              <a-col :xs="24">
                <a-form-item label="Bio">
                  <a-textarea v-model:value="edit.bio" :rows="4" placeholder="Tell others about you…" />
                </a-form-item>
              </a-col>
            </a-row>

            <a-space>
              <a-button type="primary" :loading="loading.save" @click="saveSettings">Save</a-button>
              <a-button @click="resetSettings">Reset</a-button>
            </a-space>

            <a-alert
              v-if="saveError"
              :message="saveError"
              type="error"
              show-icon
              style="margin-top: 8px"
            />
          </a-form>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script setup lang="ts">
/**
 * Profile Page (Nuxt SFC)
 * Talks to multiple plugins:
 * - /api/authentication/graphql     (optional: me, updateProfile)
 * - /api/students-internal/graphql  (myEnrollments, progress)
 * - /api/courses-details/graphql    (course(id))
 * - /api/ecommerce/graphql          (myOrders, createBillingPortal)
 * - /api/teach-internal/graphql     (optional instructor info if needed)
 *
 * Works when some fields are missing by degrading gracefully.
 * All network calls are done onMounted (client) to avoid SSR 'File' issues.
 */
import { ref, reactive, computed, h, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  UserOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
  CreditCardOutlined
} from '@ant-design/icons-vue'
import { useAuth } from '../../../../packages/shared-ui/src/composables/useAuth'

// ===== Endpoints =====
const AUTH_API     = 'http://localhost:4000/api/authentication/graphql'
const STUDENTS_API = 'http://localhost:4000/api/students-internal/graphql'
const COURSES_API  = 'http://localhost:4000/api/courses-details/graphql'
const EC_API       = 'http://localhost:4000/api/ecommerce/graphql'
const TEACH_API    = 'http://localhost:4000/api/teach-internal/graphql'  // optional

// ===== Auth / Router =====
const auth = useAuth()
const router = useRouter()
const isLoggedIn = computed(() => auth.isLoggedIn.value)
const token = computed(() => auth.token.value || '')
const userEmail = computed(() => auth.user.value?.email || '')

// ===== UI State =====
const tabKey = ref<'overview'|'courses'|'orders'|'billing'|'settings'>('overview')
const loading = reactive({
  profile: false,
  courses: false,
  orders:  false,
  portal:  false,
  save:    false
})
const portalError = ref<string | null>(null)
const saveError = ref<string | null>(null)

// ===== Profile Model =====
interface Progress {
  percent: number
  completedLessons: number
  totalLessons: number
}
interface CourseCard {
  id: string
  title: string
  category?: string
  level?: string
  thumb?: string
  progress?: Progress | null
}
interface OrderItem { courseId: string; title?: string; price?: number; quantity?: number }
interface Order { id: string; status: string; total: number; currency?: string; createdAt: string; items?: OrderItem[] }

const profile = reactive<{ name?: string; avatar?: string; role?: string }>({})
const memberSince = ref<string | null>(null)

const myCourses = ref<CourseCard[]>([])
const orders = ref<Order[]>([])

// Derived (for Overview)
const recentCourses = computed(() => myCourses.value.slice(0, 5))
const recentOrders  = computed(() => orders.value.slice(0, 5))

// Stats
const stats = reactive({
  enrolled: 0,
  orders: 0,
  wishlist: 0,
  completedLessons: 0
})

// Settings edit buffer
const edit = reactive({
  name: '',
  title: '',
  bio: ''
})

// ===== Utilities =====
function money(v: number, ccy = 'EUR') {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: ccy }).format(v || 0)
}
function fmtDate(s: string) {
  try { return new Date(s).toLocaleString() } catch { return s }
}
function orderStatusColor(status?: string) {
  const s = (status || '').toLowerCase()
  if (s.includes('paid') || s.includes('succeeded')) return 'green'
  if (s.includes('pending') || s.includes('requires')) return 'gold'
  if (s.includes('failed') || s.includes('canceled')) return 'red'
  return 'blue'
}
function logout() { auth.logout() }
function goCourse(id: string) { router.push(`/course/${encodeURIComponent(id)}`) }

// ===== GraphQL Fetch Helper =====
async function gfetch<T>(endpoint: string, query: string, variables?: Record<string, any>): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token.value) headers.Authorization = `Bearer ${token.value}`
  const res = await fetch(endpoint, { method: 'POST', headers, body: JSON.stringify({ query, variables }) })
  const json = await res.json()
  if (json.errors?.length) throw new Error(json.errors[0].message || 'GraphQL error')
  return json.data as T
}

// ===== Queries (with conservative assumptions) =====
const GQL_ME = `
  query Me {
    me { id email name createdAt avatar role }
  }
`

const GQL_MY_ENROLLMENTS = `
  query MyEnrollments {
    myEnrollments {
      id
      courseId
      createdAt
    }
  }
`

const GQL_PROGRESS_BY_COURSE = `
  query Progress($courseId: String!) {
    progress(courseId: $courseId) {
      percent
      completedLessons
      totalLessons
    }
  }
`

const GQL_COURSE = `
  query One($id: String!) {
    course(id: $id) {
      id title category difficulty level thumb
    }
  }
`

const GQL_MY_ORDERS = `
  query MyOrders {
    myOrders {
      id
      status
      total
      currency
      createdAt
      items { courseId title price quantity }
    }
  }
`

const GQL_BILLING_PORTAL = `
  mutation Portal($returnUrl:String!) {
    createBillingPortal(returnUrl:$returnUrl){
      url
    }
  }
`

const GQL_UPDATE_PROFILE = `
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
      email
      name
      avatar
      role
    }
  }
`

// ===== Renderers for Lists =====
function renderCourseRow(item: CourseCard) {
  return h('div',
    { class: 'row-wrap', onClick: () => goCourse(item.id) },
    [
      h('img', { class: 'row-thumb', src: item.thumb || '/course-thumb.jpg', alt: item.title }),
      h('div', { class: 'row-main' }, [
        h('div', { class: 'row-title' }, item.title),
        h('div', { class: 'muted' }, `${item.category || '—'} · ${item.level || 'All levels'}`),
        h('div', { class: 'row-inline' }, [
          h('span', { class: 'muted small' }, `Progress: ${item.progress?.percent ?? 0}%`)
        ])
      ])
    ]
  )
}

function renderOrderRow(item: Order) {
  return h('div', { class: 'row-wrap' }, [
    h('div', { class: 'row-icon' }, [ h(FileTextOutlined) ]),
    h('div', { class: 'row-main' }, [
      h('div', { class: 'row-title' }, `Order ${item.id.slice(0, 8)}…`),
      h('div', { class: 'muted small' }, fmtDate(item.createdAt)),
      h('div', { class: 'row-inline' }, [
        h('span', { class: 'muted small' }, (item.items || []).map(i => (i.title || i.courseId)).join(', ') || '—')
      ])
    ]),
    h('div', { class: 'row-right' }, [
      h('div', { class: 'row-amount' }, money(item.total || 0, item.currency || 'EUR')),
      h('div', null, [ h('span', null, [ h('span', {
        class: `status-dot ${orderStatusColor(item.status)}`
      })]) ])
    ])
  ])
}

// ===== Columns for Orders Table =====
const orderColumns = [
  { title: 'Order ID', dataIndex: 'id', key: 'id' },
  { title: 'Created', dataIndex: 'createdAt', key: 'createdAt' },
  { title: 'Items', dataIndex: 'items', key: 'items' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
  { title: 'Total', dataIndex: 'total', key: 'total', align: 'right' }
]

// ===== Loaders =====
async function loadProfile() {
  loading.profile = true
  try {
    // Try to get profile from authentication plugin
    const data = await gfetch<{ me?: any }>(AUTH_API, GQL_ME)
    const me = data?.me
    if (me) {
      profile.name = me.name || ''
      profile.avatar = me.avatar || ''
      profile.role = me.role || 'Student'
      memberSince.value = me.createdAt ? fmtDate(me.createdAt) : null
      // Pre-fill settings form
      edit.name = profile.name || ''
    } else {
      // Fall back to useAuth info
      profile.name = auth.user.value?.name || ''
      profile.avatar = ''
      profile.role = 'Student'
      memberSince.value = null
    }
  } catch {
    // Silent degrade — rely on useAuth
    profile.name = auth.user.value?.name || ''
    profile.avatar = ''
    profile.role = 'Student'
    memberSince.value = null
  } finally {
    loading.profile = false
  }
}

async function loadEnrollmentsAndCourses() {
  loading.courses = true
  const out: CourseCard[] = []
  let enrollments: Array<{ courseId: string }> = []
  try {
    const data = await gfetch<{ myEnrollments?: any[] }>(STUDENTS_API, GQL_MY_ENROLLMENTS)
    enrollments = (data?.myEnrollments || []).map(e => ({ courseId: e.courseId }))
  } catch {
    // If myEnrollments isn't available, we'll infer from orders (paid items)
    try {
      const data = await gfetch<{ myOrders?: Order[] }>(EC_API, GQL_MY_ORDERS)
      const ids = new Set<string>()
      ;(data?.myOrders || []).forEach(o => (o.items || []).forEach(i => i.courseId && ids.add(i.courseId)))
      enrollments = Array.from(ids).map(id => ({ courseId: id }))
    } catch {
      enrollments = []
    }
  }

  // Hydrate course cards
  for (const en of enrollments) {
    try {
      const cd = await gfetch<{ course?: any }>(COURSES_API, GQL_COURSE, { id: en.courseId })
      const c = cd?.course
      if (!c) continue

      // Load progress if available
      let prog: Progress | null = null
      try {
        const pd = await gfetch<{ progress?: Progress }>(STUDENTS_API, GQL_PROGRESS_BY_COURSE, { courseId: en.courseId })
        prog = pd?.progress || null
      } catch { prog = null }

      out.push({
        id: c.id,
        title: c.title,
        category: c.category,
        level: c.level || c.difficulty,
        thumb: c.thumb,
        progress: prog
      })
    } catch {
      // skip silently
    }
  }

  myCourses.value = out
  stats.enrolled = out.length
  stats.completedLessons = out.reduce((n, c) => n + (c.progress?.completedLessons || 0), 0)
  loading.courses = false
}

async function loadOrders() {
  loading.orders = true
  try {
    const data = await gfetch<{ myOrders?: Order[] }>(EC_API, GQL_MY_ORDERS)
    orders.value = (data?.myOrders || []).sort((a, b) => (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    stats.orders = orders.value.length
  } catch {
    orders.value = []
    stats.orders = 0
  } finally {
    loading.orders = false
  }
}

function loadWishlistCount() {
  try {
    const raw = /* TODO: replace with gqlFetch to proper query */ undefined && ('byway:wishlist')
    const arr = raw ? JSON.parse(raw) : []
    stats.wishlist = Array.isArray(arr) ? arr.length : 0
  } catch {
    stats.wishlist = 0
  }
}

// ===== Billing =====
async function openBillingPortal() {
  portalError.value = null
  loading.portal = true
  try {
    const data = await gfetch<{ createBillingPortal?: { url: string } }>(
      EC_API,
      GQL_BILLING_PORTAL,
      { returnUrl: window.location.origin + '/profile-page' }
    )
    const url = data?.createBillingPortal?.url
    if (!url) throw new Error('No portal URL returned')
    window.location.href = url
  } catch (e: any) {
    portalError.value = e?.message || 'Failed to open billing portal'
    message.error(portalError.value)
  } finally {
    loading.portal = false
  }
}

function createTestInvoice() {
  message.info('This button is a placeholder for a dev/test invoice action.')
}

// ===== Settings =====
async function saveSettings() {
  saveError.value = null
  loading.save = true
  try {
    // Optional — only if your auth plugin supports it
    const input = {
      name: edit.name || profile.name || '',
      title: edit.title || '',
      bio: edit.bio || ''
    }
    const res = await gfetch<{ updateProfile?: any }>(AUTH_API, GQL_UPDATE_PROFILE, { input })
    if (res?.updateProfile) {
      profile.name = res.updateProfile.name || profile.name
      message.success('Profile updated')
    } else {
      message.success('Settings saved (local only)')
    }
  } catch (e: any) {
    saveError.value = e?.message || 'Failed to save settings'
    message.error(saveError.value)
  } finally {
    loading.save = false
  }
}
function resetSettings() {
  edit.name = profile.name || ''
  edit.title = ''
  edit.bio = ''
}

// ===== Lifecycle =====
onMounted(async () => {
  loadWishlistCount()
  await loadProfile()
  await Promise.all([loadEnrollmentsAndCourses(), loadOrders()])
})
</script>

<style scoped>
.profile-page {
  padding: 16px;
  background: #fff;
}
.profile-header {
  background: #fff;
  border: 1px solid #f0f0f0;
  margin-bottom: 16px;
}
.profile-desc :deep(.ant-descriptions-item-label) {
  width: 120px;
}

.stats-card, .body-card {
  max-width: 1200px;
  margin: 0 auto 16px;
}

.course-card {
  cursor: pointer;
  transition: transform .12s ease, box-shadow .12s ease;
}
.course-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0,0,0,0.08);
}
.course-thumb {
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-radius: 8px;
}
.course-meta {
  margin-top: 10px;
}
.title {
  font-weight: 600;
  font-size: 15px;
}
.muted {
  color: rgba(0,0,0,.45);
}
.small {
  font-size: 12px;
}

.row-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}
.row-wrap:hover .row-title {
  color: #1677ff;
}
.row-thumb {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  object-fit: cover;
}
.row-main {
  flex: 1;
  min-width: 0;
}
.row-title {
  font-weight: 600;
  transition: color .12s ease;
}
.row-inline {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}
.row-right {
  text-align: right;
}
.row-amount {
  font-weight: 600;
}
.row-icon :deep(svg) {
  font-size: 24px;
  color: #1677ff;
}

.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  margin-left: 6px;
  border-radius: 50%;
}
.status-dot.green { background: #52c41a; }
.status-dot.gold  { background: #faad14; }
.status-dot.red   { background: #ff4d4f; }
.status-dot.blue  { background: #1677ff; }

.settings-form {
  max-width: 920px;
}
</style>
