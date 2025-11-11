
<template>
  <a-alert
    v-if="!isLoggedIn"
    type="info"
    banner
    show-icon
    class="guest-banner"
  >
    <template #message>
      <div class="row">
        <div class="msg">
          <strong>You're browsing as a guest.</strong> Log in to save progress, join classrooms, and see your gradebook.
        </div>
        <a-space>
          <a-button href="/auth/login">Log in</a-button>
          <a-button type="primary" href="/auth/signup">Sign up</a-button>
          <a-button href="/courses" type="default">Browse courses</a-button>
        </a-space>
      </div>
    </template>
  </a-alert>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuth } from '../composables/useAuth'
const auth = useAuth()
const isLoggedIn = computed(() => auth.isLoggedIn.value)
</script>

<style scoped>
.guest-banner { margin: 8px 16px; }
.row { display:flex; align-items:center; justify-content:space-between; gap: 12px; }
.msg { color:#333; }
</style>
