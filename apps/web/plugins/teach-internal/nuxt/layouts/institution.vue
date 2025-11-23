
<template>
  <a-layout class="inst-layout">
    <a-layout-sider class="sider" breakpoint="lg" collapsible>
      <div class="brand">Institution</div>
      <a-menu mode="inline" :selectedKeys="[activeKey]">
        <a-menu-item :key="base"><NuxtLink :to="base">Overview</NuxtLink></a-menu-item>
        <a-menu-item :key="base + '/courses'"><NuxtLink :to="base + '/courses'">Courses</NuxtLink></a-menu-item>
        <a-menu-item :key="base + '/classrooms'"><NuxtLink :to="base + '/classrooms'">Classrooms</NuxtLink></a-menu-item>
        <a-menu-item :key="base + '/assignments'"><NuxtLink :to="base + '/assignments'">Assignments</NuxtLink></a-menu-item>
        <a-menu-item :key="base + '/analytics'"><NuxtLink :to="base + '/analytics'">Analytics</NuxtLink></a-menu-item>
        <a-menu-item :key="base + '/settings'"><NuxtLink :to="base + '/settings'">Settings</NuxtLink></a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <InstitutionBreadcrumbs />
      <InstitutionTopTabs />
      <div class="toolbar"><a-space>
        <a-button href="/teach">Teacher Dashboard</a-button>
        <a-button href="/courses">Courses</a-button>
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
import InstitutionTopTabs from '../components/InstitutionTopTabs.vue'
import InstitutionBreadcrumbs from '../components/InstitutionBreadcrumbs.vue'
const route = useRoute()
const base = computed(() => `/institutions/${route.params?.slug || 'unknown'}`)
const activeKey = computed(() => {
  const p = route.path
  if (p.includes('/courses')) return `${base.value}/courses`
  if (p.includes('/classrooms')) return `${base.value}/classrooms`
  if (p.includes('/assignments')) return `${base.value}/assignments`
  if (p.includes('/analytics')) return `${base.value}/analytics`
  if (p.includes('/settings')) return `${base.value}/settings`
  return base.value
})
</script>

<style scoped>
.inst-layout { min-height: 100vh; }
.sider { background: var(--ant-color-bg-container); }
.brand { color:#999; font-weight:600; padding: 16px; letter-spacing: .5px; }
.toolbar{ padding: 8px 16px; border-bottom:1px solid var(--ant-color-border); }
.content { padding: 12px 16px 24px; }
</style>
