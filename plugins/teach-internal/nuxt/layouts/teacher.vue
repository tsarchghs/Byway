
<template>
  <a-layout class="teacher-layout">
    <a-layout-sider class="sider" breakpoint="lg" collapsible>
      <div class="brand">Teacher</div>
      <a-menu mode="inline" :selectedKeys="[activeKey]">
        <a-menu-item key="/teach"><NuxtLink to="/teach">Dashboard</NuxtLink></a-menu-item>
        <a-menu-item key="/teach/courses"><NuxtLink to="/teach/courses">Courses</NuxtLink></a-menu-item>
        <a-menu-item key="/teach/modules"><NuxtLink to="/teach/modules">Modules</NuxtLink></a-menu-item>
        <a-menu-item key="/teach/assignments"><NuxtLink to="/teach/assignments">Assignments</NuxtLink></a-menu-item>
        <a-menu-item key="/institutions"><NuxtLink to="/institutions">Institutions</NuxtLink></a-menu-item>
        <a-menu-item key="/teach/analytics"><NuxtLink to="/teach/analytics">Analytics</NuxtLink></a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <TeacherBreadcrumbs />
      <TeacherTopTabs />
      <div class="toolbar"><a-space>
        <a-button href="/teach/courses">Courses</a-button>
        <a-button href="/teach/assignments">Assignments</a-button>
        <a-button href="/institutions">Institutions</a-button>
        <a-button href="/explore">Explore</a-button>
      </a-space></div>
      <a-layout-content class="content">
        <slot />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from '#imports'
import TeacherTopTabs from '../components/TeacherTopTabs.vue'
import TeacherBreadcrumbs from '../components/TeacherBreadcrumbs.vue'
const route = useRoute()
const activeKey = computed(() => {
  const p = route.path
  if (p.startsWith('/institutions')) return '/institutions'
  if (p.includes('/assign')) return '/teach/assignments'
  if (p.includes('/module')) return '/teach/modules'
  if (p.includes('/course')) return '/teach/courses'
  if (p.includes('/analytics')) return '/teach/analytics'
  return '/teach'
})
</script>

<style scoped>
.teacher-layout { min-height: 100vh; }
.sider { background: var(--ant-color-bg-container); }
.brand { color:#999; font-weight:600; padding: 16px; letter-spacing: .5px; }
.toolbar{ padding: 8px 16px; border-bottom:1px solid var(--ant-color-border); }
.content { padding: 12px 16px 24px; }
</style>
