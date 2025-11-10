<template>
  <a-layout-header class="byway-header">
    <div class="header-inner">
      <NuxtLink to="/" class="logo" aria-label="Byway LMS Home">
        <img :src="logoSrc" alt="Byway logo" class="logo-image" />
        <span class="logo-text">Byway</span>
      </NuxtLink>

      <nav class="nav" aria-label="Main">
        <NuxtLink v-if="isCoursera" to="/explore" class="nav-link">Explore</NuxtLink>
        <NuxtLink v-if="isCoursera" to="/categories" class="nav-link">Categories</NuxtLink>
        <NuxtLink v-if="isCoursera" to="/tracks" class="nav-link">Tracks</NuxtLink>

        <NuxtLink v-if="isLms" to="/faculties" class="nav-link">Faculties</NuxtLink>
        <NuxtLink v-if="isLms" to="/programs" class="nav-link">Programs</NuxtLink>

        <NuxtLink to="/dashboard" class="nav-link">My learning</NuxtLink>
        <NuxtLink to="/wishlist" class="nav-link">Wishlist</NuxtLink>
        <NuxtLink to="/teach" class="nav-link">Teach</NuxtLink>
        <NuxtLink to="/settings/mode" class="nav-link">Settings</NuxtLink>
      </nav>

      <a-auto-complete
        v-model:value="q"
        :options="suggestions"
        style="width:300px"
        @select="goSearch"
        @search="onSearch"
        placeholder="Search courses..."
        aria-label="Search courses"
      />

      <div class="actions">
        <a-segmented :options="['coursera','lms']" v-model:value="modeVal" style="margin-right:8px" />
        <NuxtLink to="/cart" aria-label="Cart">
          <a-badge :count="cartCount" show-zero>
            <a-button shape="round">Cart</a-button>
          </a-badge>
        </NuxtLink>

        <template v-if="isAuthed">
          <a-dropdown>
            <a-button shape="round">{{ me?.firstName || 'Account' }}</a-button>
            <template #overlay>
              <a-menu>
                <a-menu-item key="me"><NuxtLink to="/account">Profile</NuxtLink></a-menu-item>
                <a-menu-item key="logout"><a @click="logout">Logout</a></a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>
        <template v-else>
          <NuxtLink to="/auth/login"><a-button shape="round" type="default">Log in</a-button></NuxtLink>
          <NuxtLink to="/auth/register"><a-button shape="round" type="primary">Sign up</a-button></NuxtLink>
        </template>
      </div>
    </div>
  </a-layout-header>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useUser } from '~/composables/useUser'
import { useCart } from '~/composables/useCart'
import { useMode } from '~/composables/useMode'

const q = ref('')
const logoSrc = '/plugins/homepage/logo.png'
const { isAuthed, me, logout } = useUser()
const cart = useCart ? useCart() : { items: { value: [] } } // fallback if missing
const cartCount = computed(() => (cart.items?.value || []).reduce((sum, it)=> sum + (it.qty||1), 0))

const { mode, setMode, isCoursera, isLms } = useMode()
const modeVal = ref<string>(mode.value)
watch(modeVal, (nv)=> setMode(nv as any))

const suggestions = ref<any[]>([])
function goSearch(value:string){ navigateTo(`/search?q=${encodeURIComponent(value)}`) }
async function onSearch(value:string){
  q.value = value
  if (!value) { suggestions.value = []; return }
  try{
    const data:any = await $fetch('/plugins/students-internal/api/catalog', { params: { q: value, limit: 5 }})
    const items = Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : [])
    suggestions.value = items.slice(0,5).map((c:any)=> ({ value: c.title }))
  }catch{ suggestions.value = [] }
}
</script>

<style scoped>
.byway-header{ background:#fff; display:flex; align-items:center; height:auto; padding:10px 0; border-bottom:1px solid #eee;}
.header-inner{ display:flex; align-items:center; gap:16px; max-width:1280px; margin:0 auto; width:100%; padding:0 16px;}
.logo{ display:flex; align-items:center; gap:8px; text-decoration:none;}
.logo-image{ width:32px; height:32px; object-fit:contain;}
.logo-text{ font-weight:700; color:#111;}
.nav{ display:flex; gap:12px; margin-left:8px; }
.nav-link{ color:#333; }
.actions{ margin-left:auto; display:flex; align-items:center; gap:12px; }
</style>
