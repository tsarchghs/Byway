
<template>
  <a-layout class="student-layout">
    <a-layout-sider class="sider" breakpoint="lg" collapsible>
      <div class="brand">Student</div>
      <a-menu mode="inline" :selectedKeys="[activeKey]">
        <a-menu-item key="/dashboard"><NuxtLink to="/dashboard">Dashboard</NuxtLink></a-menu-item>
        <a-menu-item key="/courses"><NuxtLink to="/courses">My Courses</NuxtLink></a-menu-item>
        <a-menu-item key="/classrooms"><NuxtLink to="/dashboard#classrooms">Classrooms</NuxtLink></a-menu-item>
        <a-menu-item key="/assignments"><NuxtLink to="/dashboard#assignments">Assignments</NuxtLink></a-menu-item>
        <a-menu-item key="/gradebook"><NuxtLink to="/gradebook">Gradebook</NuxtLink></a-menu-item>
        <a-menu-item key="/progress"><NuxtLink to="/module-listing">Progress</NuxtLink></a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <StudentBreadcrumbs />
      <GuestBanner />
      <StudentTopTabs />
      <div class="student-toolbar">
        <a-space>
          <a-button href="/courses">Browse Courses</a-button>
          <a-button href="/gradebook">Gradebook</a-button>
          <a-button href="/assignments">Assignments</a-button>
          <a-button href="/explore">Explore</a-button>
        </a-space>
      </div>
      <a-layout-content class="content">
        <slot />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from '#imports'
const route = useRoute()
const activeKey = computed(() => {
  const p = route.path
  if (p.startsWith('/modules') || p.startsWith('/module')) return '/progress'
  if (p.startsWith('/gradebook')) return '/gradebook'
  if (p.startsWith('/courses')) return '/courses'
  if (p.startsWith('/dashboard')) return '/dashboard'
  return '/dashboard'
})
const crumb = computed(() => (route.meta?.title as string) || route.name || 'View')
import StudentTopTabs from '../components/StudentTopTabs.vue'
import GuestBanner from '../../../packages/shared-ui/src/components/GuestBanner.vue'
import StudentBreadcrumbs from '../components/StudentBreadcrumbs.vue'
</script>

<style scoped>
.student-layout { min-height: 100vh; }
.sider { background: var(--ant-color-bg-container); }
.brand { color:#999; font-weight:600; padding: 16px; letter-spacing: .5px; }
.crumbs { padding: 8px 16px; }
.content { padding: 12px 16px 24px; }
.student-toolbar{ padding: 8px 16px; border-bottom:1px solid var(--ant-color-border); }
</style>
