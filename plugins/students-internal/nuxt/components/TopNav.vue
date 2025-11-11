<template>
  <a-layout-header class="byway-topnav">
    <div class="left">
      <a-button type="text" @click="$router.push('/')">Byway</a-button>
    </div>
    <a-menu mode="horizontal" :selectedKeys="[active]" class="center">
      <a-menu-item key="student" @click="go('/students-internal/dashboard')">Student</a-menu-item>
      <a-menu-item key="teacher" v-if="isTeacher" @click="go('/teach/gradebook')">Teacher</a-menu-item>
      <a-menu-item key="inst" v-if="isInstitutionAdmin" @click="go('/institutions')">Institutions</a-menu-item>
      <a-menu-item key="explore" @click="go('/explore')">Explore</a-menu-item>
    </a-menu>
    <div class="right">
      <template v-if="isLoggedIn">
        <a-tag color="blue" v-for="r in roles" :key="r">{{ r }}</a-tag>
      </template>
      <template v-else>
        <a-button type="primary" @click="go('/login')">Login</a-button>
      </template>
    </div>
  </a-layout-header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '~/plugins/authentication/nuxt/composables/useAuth'

const { isLoggedIn, isTeacher, isInstitutionAdmin, roles } = useAuth()
const route = useRoute()
const router = useRouter()
const active = computed(() => {
  const p = route.path
  if (p.startsWith('/teach')) return 'teacher'
  if (p.startsWith('/institutions')) return 'inst'
  if (p.startsWith('/students-internal')) return 'student'
  return 'explore'
})
function go(p:string){ router.push(p) }
</script>

<style scoped>
.byway-topnav{ display:flex; align-items:center; gap:12px; }
.left{ margin-right:8px }
.center{ flex:1; }
.right{ display:flex; align-items:center; gap:6px; }
</style>
