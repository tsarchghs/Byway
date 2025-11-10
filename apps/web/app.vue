<template>
  <a-layout style="min-height:100vh">
    <LmsHeader />
    <a-layout-content style="padding: 24px 0">
      <div style="max-width:1280px;margin:0 auto;padding:0 16px">
        <NuxtPage />
      </div>
    </a-layout-content>
    <a-layout-footer style="text-align:center">Byway LMS © {{ new Date().getFullYear() }}</a-layout-footer>
  </a-layout>
</template>
<script setup lang="ts">
import LmsHeader from '~/components/lms/LmsHeader.vue'
</script>
