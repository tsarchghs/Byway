<template>
  <a-layout class="student-dashboard">
    <!-- SIDEBAR -->
    <a-layout-sider
      width="240"
      collapsible
      v-model:collapsed="collapsed"
      class="dashboard-sider"
    >
      <div class="logo">Byway Learn</div>

      <a-menu
        theme="dark"
        mode="inline"
        v-model:selectedKeys="selectedKeys"
        @click="onMenuClick"
      >
        <a-menu-item key="overview" :icon="h(DashboardOutlined)">Overview</a-menu-item>
        <a-menu-item key="learning" :icon="h(ReadOutlined)">My Learning</a-menu-item>
        <a-menu-item key="calendar" :icon="h(CalendarOutlined)">Calendar</a-menu-item>
        <a-menu-item key="assignments" :icon="h(OrderedListOutlined)">Assignments</a-menu-item>
        <a-menu-item key="certificates" :icon="h(TrophyOutlined)">Certificates</a-menu-item>
        <a-menu-item key="wishlist" :icon="h(HeartOutlined)">Wishlist</a-menu-item>
        <a-menu-item key="purchases" :icon="h(CreditCardOutlined)">Purchases</a-menu-item>
        <a-menu-item key="settings" :icon="h(SettingOutlined)">Settings</a-menu-item>
      </a-menu>
    </a-layout-sider>

    <!-- MAIN -->
    <a-layout class="content-layout">
      <a-page-header
        :title="user.name"
        :sub-title="user.plan + ' Plan'"
        class="dashboard-header"
      >
        <template #avatar>
          <a-avatar :src="user.avatar" size="large" />
        </template>
        <template #extra>
          <a-badge :count="unreadCount">
            <a-button shape="circle" @click="drawerOpen = true">
              <template #icon><BellOutlined /></template>
            </a-button>
          </a-badge>
          <a-button type="primary" @click="resumeLast">Resume learning</a-button>
        </template>
      </a-page-header>

      <a-layout-content class="dashboard-content">
        <!-- OVERVIEW -->
        <div v-if="activeKey === 'overview'" class="overview-section">
          <a-row :gutter="24">
            <a-col :xs="24" :md="8">
              <a-card>
                <a-statistic title="Active Courses" :value="stats.activeCourses" />
              </a-card>
            </a-col>
            <a-col :xs="24" :md="8">
              <a-card>
                <a-statistic title="Learning Streak" :value="stats.streak" suffix="days" />
              </a-card>
            </a-col>
            <a-col :xs="24" :md="8">
              <a-card>
                <a-statistic title="Completed" :value="stats.completed" />
              </a-card>
            </a-col>
          </a-row>

          <a-row :gutter="24" class="mt-4">
            <a-col :xs="24" :lg="14">
              <a-card title="Continue where you left off">
                <div class="resume-block">
                  <div class="resume-meta">
                    <div class="resume-title">{{ lastCourse.title }}</div>
                    <div class="resume-sub">Lesson {{ lastCourse.lastLesson }} • {{ lastCourse.progress }}% done</div>
                  </div>
                  <a-progress :percent="lastCourse.progress" status="active" />
                  <div class="resume-actions">
                    <a-button type="primary" @click="resumeLast">
                      <template #icon><PlayCircleOutlined /></template>
                      Resume
                    </a-button>
                    <a-button @click="openCourse(lastCourse.id)">Go to course</a-button>
                  </div>
                </div>
              </a-card>
            </a-col>

            <a-col :xs="24" :lg="10">
              <a-card title="Upcoming deadlines">
                <a-list
                  item-layout="horizontal"
                  :data-source="upcomingDeadlines"
                  :renderItem="renderDeadline"
                />
              </a-card>
            </a-col>
          </a-row>

          <a-card class="mt-4" title="Recent activity">
            <a-timeline>
              <a-timeline-item v-for="(a,i) in activity" :key="i">
                <strong>{{ a.title }}</strong> — {{ a.time }}
              </a-timeline-item>
            </a-timeline>
          </a-card>
        </div>

        <!-- MY LEARNING -->
        <div v-if="activeKey === 'learning'" class="learning-section">
          <a-card>
            <div class="learning-bar">
              <a-segmented
                v-model:value="learningFilter"
                :options="['All','In progress','Completed','Bookmarked']"
              />
              <a-input-search
                v-model:value="learningSearch"
                placeholder="Search your courses"
                style="max-width: 280px"
              />
            </div>

            <a-table
              :columns="courseColumns"
              :data-source="filteredCourses"
              row-key="id"
              :pagination="{ pageSize: 6 }"
            />
          </a-card>
        </div>

        <!-- CALENDAR -->
        <div v-if="activeKey === 'calendar'" class="calendar-section">
          <a-card title="Schedule & deadlines">
            <a-calendar :fullscreen="false">
              <template #dateCellRender="{ current }">
                <ul class="events">
                  <li v-for="d in getDateEvents(current.format('YYYY-MM-DD'))" :key="d.id">
                    <a-tag :color="d.type==='due'?'red':'blue'">{{ d.short }}</a-tag>
                  </li>
                </ul>
              </template>
            </a-calendar>
          </a-card>
        </div>

        <!-- ASSIGNMENTS -->
        <div v-if="activeKey === 'assignments'" class="assignments-section">
          <a-card title="Assignments & quizzes">
            <a-alert
              v-if="lateAssignments.length"
              type="warning"
              :message="`You have ${lateAssignments.length} overdue item(s)`"
              show-icon
              class="mb-3"
            />
            <a-table
              :columns="assignmentColumns"
              :data-source="assignments"
              row-key="id"
              :pagination="{ pageSize: 8 }"
            />
          </a-card>
        </div>

        <!-- CERTIFICATES -->
        <div v-if="activeKey === 'certificates'" class="certs-section">
          <a-card title="Your certificates">
            <a-row :gutter="16">
              <a-col v-for="c in certificates" :key="c.id" :xs="24" :sm="12" :md="8">
                <a-card :title="c.title" :extra="formatDate(c.date)">
                  <p>Score: {{ c.score }}%</p>
                  <div class="cert-actions">
                    <a-button type="primary" @click="downloadCert(c.id)">Download PDF</a-button>
                    <a-button @click="shareCert(c.id)">Share</a-button>
                  </div>
                </a-card>
              </a-col>
            </a-row>
            <a-empty v-if="!certificates.length" description="No certificates yet" />
          </a-card>
        </div>

        <!-- WISHLIST -->
        <div v-if="activeKey === 'wishlist'" class="wishlist-section">
          <a-card title="Wishlist">
            <a-list
              :grid="{ gutter: 16, xs: 1, sm: 2, md: 3 }"
              :data-source="wishlist"
              :renderItem="renderWishlistItem"
            />
            <a-empty v-if="!wishlist.length" description="No items in wishlist" />
          </a-card>
        </div>

        <!-- PURCHASES -->
        <div v-if="activeKey === 'purchases'" class="purchases-section">
          <a-card title="Purchase history">
            <a-table :columns="purchaseColumns" :data-source="purchases" row-key="id" />
          </a-card>
        </div>

        <!-- SETTINGS -->
        <div v-if="activeKey === 'settings'" class="settings-section">
          <a-card title="Profile Settings">
            <a-form layout="vertical" @finish="saveSettings" :model="user">
              <a-form-item label="Full name" name="name" required>
                <a-input v-model:value="user.name" />
              </a-form-item>
              <a-form-item label="Email" name="email" required>
                <a-input v-model:value="user.email" type="email" />
              </a-form-item>
              <a-form-item label="Communication">
                <a-checkbox-group v-model:value="user.comms" :options="commOptions" />
              </a-form-item>
              <a-button type="primary" html-type="submit">Save changes</a-button>
            </a-form>
          </a-card>
        </div>
      </a-layout-content>
    </a-layout>

    <!-- NOTIFICATIONS DRAWER -->
    <a-drawer
      v-model:open="drawerOpen"
      title="Notifications"
      placement="right"
      width="380"
    >
      <a-list
        item-layout="horizontal"
        :data-source="notifications"
        :renderItem="renderNotification"
      />
      <template #footer>
        <a-button block @click="markAllRead">Mark all as read</a-button>
      </template>
    </a-drawer>
  </a-layout>
</template>

<script setup lang="ts">
import {
  DashboardOutlined,
  ReadOutlined,
  CalendarOutlined,
  OrderedListOutlined,
  TrophyOutlined,
  HeartOutlined,
  CreditCardOutlined,
  SettingOutlined,
  BellOutlined,
  PlayCircleOutlined
} from '@ant-design/icons-vue'
import { message, TagProps } from 'ant-design-vue'
import { ref, reactive, computed, h } from 'vue'
import { useRoute } from 'vue-router'

// --- ROUTE / NAV ---
const route = useRoute()
const collapsed = ref(false)
const activeKey = ref('overview')
const selectedKeys = ref<string[]>(['overview'])
const onMenuClick = (e: any) => {
  selectedKeys.value = [e.key]
  activeKey.value = e.key
}

// --- USER MOCK ---
type Course = { id: number; title: string; lastLesson: number; progress: number; rating: number; status: 'In progress'|'Completed'|'Bookmarked'; updatedAt: string }
type Deadline = { id: number; title: string; course: string; date: string; short: string; type: 'due'|'live' }
type Assignment = { id: number; title: string; course: string; due: string; status: 'Pending'|'Submitted'|'Graded'; grade?: number }
type Certificate = { id: number; title: string; date: string; score: number }
type Purchase = { id: number; item: string; date: string; amount: number; status: 'Paid'|'Refunded' }
type NotificationT = { id: number; title: string; desc: string; time: string; read: boolean }

const user = reactive({
  id: route.params.student_id,
  name: 'Courtney Henry',
  email: 'courtney@byway.com',
  plan: 'Pro',
  avatar: '/users/courtney.jpg',
  comms: ['product', 'course']
})

const stats = reactive({ activeCourses: 4, streak: 6, completed: 12 })

const myCourses = ref<Course[]>([
  { id: 1, title: 'Vue 3 + Ant Design Vue', lastLesson: 6, progress: 72, rating: 4.8, status: 'In progress', updatedAt: '2025-11-02' },
  { id: 2, title: 'TypeScript Essentials', lastLesson: 3, progress: 28, rating: 4.7, status: 'In progress', updatedAt: '2025-10-31' },
  { id: 3, title: 'UX for Developers', lastLesson: 12, progress: 100, rating: 4.9, status: 'Completed', updatedAt: '2025-10-15' },
  { id: 4, title: 'GraphQL Fundamentals', lastLesson: 2, progress: 0, rating: 4.6, status: 'Bookmarked', updatedAt: '2025-10-28' }
])

const lastCourse = computed(() => myCourses.value[0])

const upcomingDeadlines = ref<Deadline[]>([
  { id: 11, title: 'Quiz 2', course: 'Vue 3 + Ant Design Vue', date: '2025-11-05', short: 'Quiz', type: 'due' },
  { id: 12, title: 'Live Q&A', course: 'TypeScript Essentials', date: '2025-11-06', short: 'Live', type: 'live' }
])

const activity = ref([
  { title: 'Completed Lesson 6 — Composition API', time: 'Today, 10:15' },
  { title: 'Joined course — TypeScript Essentials', time: 'Yesterday, 18:54' },
  { title: 'Earned badge — “Streak: 5 days”', time: 'Nov 2, 09:02' }
])

const assignments = ref<Assignment[]>([
  { id: 21, title: 'Composition API Exercise', course: 'Vue 3 + Ant Design Vue', due: '2025-11-05', status: 'Pending' },
  { id: 22, title: 'Types & Interfaces Task', course: 'TypeScript Essentials', due: '2025-11-07', status: 'Submitted' },
  { id: 23, title: 'Research critique', course: 'UX for Developers', due: '2025-10-25', status: 'Graded', grade: 92 }
])

const certificates = ref<Certificate[]>([
  { id: 31, title: 'UX for Developers', date: '2025-10-15', score: 92 }
])

const wishlist = ref([
  { id: 41, title: 'Advanced GraphQL', price: 59, author: 'Dev Team' },
  { id: 42, title: 'Design Systems Mastery', price: 79, author: 'UI Guild' }
])

const purchases = ref<Purchase[]>([
  { id: 51, item: 'Vue 3 + Ant Design Vue', date: '2025-10-12', amount: 49, status: 'Paid' },
  { id: 52, item: 'UX for Developers', date: '2025-09-08', amount: 39, status: 'Paid' }
])

const notifications = ref<NotificationT[]>([
  { id: 61, title: 'Quiz 2 opens tomorrow', desc: 'Vue 3 + AntD course', time: '1h ago', read: false },
  { id: 62, title: 'New lesson published', desc: 'TypeScript Essentials', time: '5h ago', read: false },
  { id: 63, title: 'Receipt available', desc: 'UX for Developers', time: '2d ago', read: true }
])
const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)
const drawerOpen = ref(false)

// --- HELPERS ---
const formatDate = (d: string) => new Date(d + 'T00:00:00').toLocaleDateString()
const lateAssignments = computed(() => {
  const now = new Date()
  return assignments.value.filter(a => a.status === 'Pending' && new Date(a.due + 'T00:00:00') < now)
})

// --- TABLES / RENDERERS ---
const courseColumns = [
  { title: 'Course', dataIndex: 'title', key: 'title' },
  {
    title: 'Progress',
    key: 'progress',
    customRender: ({ record }: any) => h('a-progress', { percent: record.progress, size: 'small', status: record.progress === 100 ? 'success' : 'active' })
  },
  { title: 'Updated', dataIndex: 'updatedAt', key: 'updatedAt', customRender: ({ text }: any) => formatDate(text) },
  {
    title: 'Status',
    key: 'status',
    customRender: ({ record }: any) => {
      const color: TagProps['color'] = record.status === 'Completed' ? 'green' : record.status === 'Bookmarked' ? 'blue' : 'gold'
      return h('a-tag', { color }, () => record.status)
    }
  },
  {
    title: 'Action',
    key: 'action',
    customRender: ({ record }: any) =>
      h('div', { class: 'table-actions' }, [
        h('a-button', { type: 'primary', size: 'small', onClick: () => resumeCourse(record.id) }, { default: () => 'Resume' }),
        h('a-button', { size: 'small', onClick: () => openCourse(record.id) }, { default: () => 'Open' })
      ])
  }
]

const assignmentColumns = [
  { title: 'Title', dataIndex: 'title', key: 'title' },
  { title: 'Course', dataIndex: 'course', key: 'course' },
  { title: 'Due', dataIndex: 'due', key: 'due', customRender: ({ text }: any) => formatDate(text) },
  {
    title: 'Status',
    key: 'status',
    customRender: ({ record }: any) => {
      const map: Record<string, TagProps['color']> = { Pending: 'orange', Submitted: 'blue', Graded: 'green' }
      return h('a-tag', { color: map[record.status] }, () => record.status + (record.grade ? ` (${record.grade}%)` : ''))
    }
  },
  {
    title: 'Action',
    key: 'action',
    customRender: ({ record }: any) => {
      const label = record.status === 'Pending' ? 'Open' : 'View'
      return h('a-button', { size: 'small', onClick: () => openAssignment(record.id) }, { default: () => label })
    }
  }
]

const purchaseColumns = [
  { title: 'Item', dataIndex: 'item', key: 'item' },
  { title: 'Date', dataIndex: 'date', key: 'date', customRender: ({ text }: any) => formatDate(text) },
  { title: 'Amount', dataIndex: 'amount', key: 'amount', customRender: ({ text }: any) => `$${text}` },
  {
    title: 'Status', dataIndex: 'status', key: 'status',
    customRender: ({ text }: any) => h('a-tag', { color: text === 'Paid' ? 'green' : 'red' }, () => text)
  }
]

const renderDeadline = (item: Deadline) =>
  h('a-list-item', {}, [
    h('a-list-item-meta', {
      title: item.title,
      description: `${item.course} • ${formatDate(item.date)}`,
      avatar: h('a-tag', { color: item.type === 'due' ? 'red' : 'blue' }, { default: () => (item.type === 'due' ? 'Due' : 'Live') })
    })
  ])

const renderNotification = (n: NotificationT) =>
  h('a-list-item', {}, [
    h('a-list-item-meta', {
      title: h('span', { class: n.read ? 'muted' : '' }, n.title),
      description: `${n.desc} • ${n.time}`,
      avatar: h('a-avatar', { icon: h(BellOutlined) })
    }),
    h('a-button', {
      size: 'small',
      type: n.read ? 'default' : 'primary',
      onClick: () => toggleRead(n.id)
    }, { default: () => (n.read ? 'Mark unread' : 'Mark read') })
  ])

const renderWishlistItem = (item: any) =>
  h('a-list-item', {}, [
    h('a-card', { title: item.title, style: 'width:100%' }, {
      default: () => h('div', { class: 'wish-row' }, [
        h('div', `by ${item.author} • $${item.price}`),
        h('div', { class: 'wish-actions' }, [
          h('a-button', { type: 'primary', size: 'small', onClick: () => addToCart(item.id) }, { default: () => 'Add to cart' }),
          h('a-button', { size: 'small', onClick: () => removeFromWishlist(item.id) }, { default: () => 'Remove' })
        ])
      ])
    })
  ])

// --- SEARCH/FILTER ---
const learningFilter = ref<'All'|'In progress'|'Completed'|'Bookmarked'>('All')
const learningSearch = ref('')

const filteredCourses = computed(() => {
  const term = learningSearch.value.trim().toLowerCase()
  return myCourses.value.filter(c => {
    const matchFilter = learningFilter.value === 'All' || c.status === learningFilter.value
    const matchText = !term || c.title.toLowerCase().includes(term)
    return matchFilter && matchText
  })
})

// --- CALENDAR EVENTS ---
const calendarEvents = computed(() => {
  return upcomingDeadlines.value.map(d => ({
    id: d.id, date: d.date, short: d.short, type: d.type
  }))
})
const getDateEvents = (dateStr: string) => calendarEvents.value.filter(e => e.date === dateStr)

// --- ACTIONS ---
const resumeLast = () => resumeCourse(lastCourse.value.id)
const resumeCourse = (courseId: number) => {
  const course = myCourses.value.find(c => c.id === courseId)
  if (!course) return
  message.success(`Resuming "${course.title}"`)
}
const openCourse = (courseId: number) => message.info(`Open course ${courseId}`)
const openAssignment = (id: number) => message.info(`Open assignment ${id}`)
const downloadCert = (id: number) => message.success(`Downloading certificate #${id}`)
const shareCert = (id: number) => message.info(`Share link for certificate #${id}`)
const addToCart = (id: number) => message.success(`Added wishlist item #${id} to cart`)
const removeFromWishlist = (id: number) => {
  const idx = wishlist.value.findIndex(w => w.id === id)
  if (idx > -1) wishlist.value.splice(idx, 1)
  message.success('Removed from wishlist')
}

const toggleRead = (id: number) => {
  const n = notifications.value.find(n => n.id === id)
  if (n) n.read = !n.read
}
const markAllRead = () => { notifications.value.forEach(n => (n.read = true)) }

// --- SETTINGS ---
const commOptions = [
  { label: 'Product updates', value: 'product' },
  { label: 'Course recommendations', value: 'course' },
  { label: 'Reminders & deadlines', value: 'reminders' }
]
const saveSettings = () => message.success('Profile saved!')
</script>

<style scoped>
.student-dashboard { min-height: 100vh; }
.dashboard-sider { background: #001529; }
.logo { color: #fff; text-align: center; font-weight: 600; padding: 16px; font-size: 18px; }

.dashboard-header {
  background: #fff; padding: 16px 24px; border-bottom: 1px solid #f0f0f0;
}
.dashboard-content { padding: 24px; background: #fafafa; flex: 1; }

.mt-4 { margin-top: 24px; }
.mb-3 { margin-bottom: 16px; }

.resume-block { display: grid; gap: 12px; }
.resume-meta { display: grid; gap: 4px; }
.resume-title { font-weight: 600; font-size: 16px; }
.resume-sub { color: #64748b; }

.resume-actions { display: flex; gap: 8px; flex-wrap: wrap; }

.learning-bar { display: flex; gap: 12px; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.table-actions { display: flex; gap: 6px; }

.events { list-style: none; padding: 0; margin: 0; display: grid; gap: 4px; }

.wish-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.wish-actions { display: flex; gap: 8px; }

.muted { color: #94a3b8; }
</style>
