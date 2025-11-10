<template>
  <a-row :gutter="[16,16]">
    <a-col :xs="24" :md="8">
      <a-card title="Account">
        <a-menu mode="inline" :selectedKeys="[active]">
          <a-menu-item key="profile"><NuxtLink to="/account/profile">Profile</NuxtLink></a-menu-item>
          <a-menu-item key="certificates"><NuxtLink to="/account/certificates">Certificates</NuxtLink></a-menu-item>
          <a-menu-item key="orders"><NuxtLink to="/account/orders">Orders</NuxtLink></a-menu-item>
        </a-menu>
      </a-card>
    </a-col>
    <a-col :xs="24" :md="16">
      <NuxtPage />
    </a-col>
  </a-row>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const active = computed(()=> (route.path.split('/')[2] || 'profile'))
</script>
