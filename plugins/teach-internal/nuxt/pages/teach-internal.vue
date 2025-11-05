<template>
  <a-layout class="teach-dashboard">
    <!-- SIDEBAR -->
    <a-layout-sider
      width="240"
      collapsible
      v-model:collapsed="collapsed"
      class="dashboard-sider"
    >
      <div class="logo">Byway Teach</div>
<a-menu
  theme="dark"
  mode="inline"
  v-model:selectedKeys="selectedKeys"
  @click="onMenuClick"
>
  <a-menu-item key="overview" :icon="h(DashboardOutlined)">Overview</a-menu-item>
  <a-menu-item key="courses" :icon="h(BookOutlined)">My Courses</a-menu-item>
  <a-menu-item key="students" :icon="h(TeamOutlined)">Students</a-menu-item>
  <a-menu-item key="revenue" :icon="h(DollarOutlined)">Revenue</a-menu-item>
  <a-menu-item key="reviews" :icon="h(StarOutlined)">Reviews</a-menu-item>
  <a-menu-item key="settings" :icon="h(SettingOutlined)">Settings</a-menu-item>
</a-menu>
    </a-layout-sider>

    <!-- MAIN CONTENT -->
    <a-layout class="content-layout">
      <a-page-header
        :title="teacher.name"
        :sub-title="teacher.specialization"
        class="dashboard-header"
      >
        <template #avatar>
          <a-avatar :src="teacher.avatar" size="large" />
        </template>
        <template #extra>
          <a-button type="primary" @click="createCourse">+ New Course</a-button>
        </template>
      </a-page-header>

      <a-layout-content class="dashboard-content">
        <!-- OVERVIEW -->
        <div v-if="activeKey === 'overview'" class="overview-section">
          <a-row gutter="24">
            <a-col :xs="24" :sm="12" :md="8">
              <a-card>
                <a-statistic title="Active Courses" :value="teacher.stats.courses" />
              </a-card>
            </a-col>
            <a-col :xs="24" :sm="12" :md="8">
              <a-card>
                <a-statistic title="Total Students" :value="teacher.stats.students" />
              </a-card>
            </a-col>
            <a-col :xs="24" :sm="12" :md="8">
              <a-card>
                <a-statistic title="Monthly Revenue" prefix="$" :value="teacher.stats.revenue" />
              </a-card>
            </a-col>
          </a-row>

          <a-card title="Performance Progress" class="mt-4">
            <a-progress :percent="78" status="active" stroke-color="#1677ff" />
          </a-card>
        </div>

        <!-- COURSES TAB -->
        <div v-if="activeKey === 'courses'" class="courses-section">
          <a-card title="Your Courses">
            <a-table :columns="columns" :data-source="teacher.courses" row-key="id" />
          </a-card>
        </div>

        <!-- STUDENTS TAB -->
        <div v-if="activeKey === 'students'" class="students-section">
          <a-card title="Recent Enrollments">
            <a-list
              item-layout="horizontal"
              :data-source="teacher.students"
              :renderItem="renderStudent"
            />
          </a-card>
        </div>

        <!-- REVENUE TAB -->
        <div v-if="activeKey === 'revenue'" class="revenue-section">
          <a-card title="Earnings Overview">
            <a-statistic title="This Month" prefix="$" :value="3200" />
            <a-progress :percent="65" class="mt-2" />
          </a-card>
        </div>

        <!-- SETTINGS TAB -->
        <div v-if="activeKey === 'settings'" class="settings-section">
          <a-card title="Profile Settings">
            <a-form layout="vertical" @finish="saveSettings" :model="teacher">
              <a-form-item label="Name">
                <a-input v-model:value="teacher.name" />
              </a-form-item>
              <a-form-item label="Specialization">
                <a-input v-model:value="teacher.specialization" />
              </a-form-item>
              <a-button type="primary" html-type="submit">Save Changes</a-button>
            </a-form>
          </a-card>
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import {
  DashboardOutlined,
  BookOutlined,
  TeamOutlined,
  DollarOutlined,
  StarOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { ref, reactive, h } from 'vue'
import { useRoute } from 'vue-router'

const collapsed = ref(false)
const activeKey = ref('overview')
const selectedKeys = ref<string[]>(['overview'])

const onMenuClick = (e: any) => {
  selectedKeys.value = [e.key]
  activeKey.value = e.key
}
const route = useRoute()

const teacher = reactive({
  id: route.params.teacher_id,
  name: 'Theresa Webb',
  specialization: 'Frontend Developer & Mentor',
  avatar: '/instructors/theresa.jpg',
  stats: { courses: 5, students: 2400, revenue: 4300 },
  courses: [
    { id: 1, title: 'Advanced Vue 3 Workshop', students: 800, rating: 4.9, price: 49 },
    { id: 2, title: 'Design Systems with Ant Design Vue', students: 400, rating: 4.8, price: 69 },
  ],
  students: [
    { name: 'Ronald Richards', email: 'ronald@byway.com', progress: 70 },
    { name: 'Cody Fisher', email: 'cody@byway.com', progress: 35 },
  ],
})

const columns = [
  { title: 'Course Title', dataIndex: 'title', key: 'title' },
  { title: 'Students', dataIndex: 'students', key: 'students' },
  { title: 'Rating', dataIndex: 'rating', key: 'rating' },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
    customRender: ({ text }: any) => `$${text}`,
  },
]

const createCourse = () => message.success('Redirecting to course creation...')
const saveSettings = () => message.success('Profile updated successfully!')
const renderStudent = (student: any) =>
  h('a-list-item', {}, [
    h('a-list-item-meta', {
      title: student.name,
      description: student.email,
      avatar: h('a-avatar', { icon: h(UserOutlined) }),
    }),
    h('a-progress', { percent: student.progress, size: 'small', status: 'active' }),
  ])
</script>

<style scoped>
.teach-dashboard {
  min-height: 100vh;
}

.dashboard-sider {
  background: #001529;
}

.logo {
  color: #fff;
  text-align: center;
  font-weight: 600;
  padding: 16px;
  font-size: 18px;
}

.dashboard-header {
  background: #fff;
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.dashboard-content {
  padding: 24px;
  background: #fafafa;
  flex: 1;
}

.mt-2 {
  margin-top: 12px;
}

.mt-4 {
  margin-top: 24px;
}
</style>
