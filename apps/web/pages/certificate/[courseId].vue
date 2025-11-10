<template>
  <a-card class="cert" :title="`Certificate of Completion`">
    <div class="center">
      <h2>{{ userName }}</h2>
      <p>has successfully completed</p>
      <h3>{{ courseTitle }}</h3>
      <p>on {{ dateStr }}</p>
      <a-divider />
      <a-space>
        <a-button @click="window.print()">Print</a-button>
        <NuxtLink to="/dashboard"><a-button type="primary">Back to Dashboard</a-button></NuxtLink>
      </a-space>
    </div>
  </a-card>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUser } from '~/composables/useUser'
const route = useRoute()
const courseId = String(route.params.courseId)
const courseTitle = `Course ${courseId}`
const { me } = useUser()
const userName = computed(()=> `${me.value?.firstName || 'Student'} ${me.value?.lastName || ''}`.trim())
const dateStr = new Date().toLocaleDateString()
</script>
<style scoped>
.cert{ max-width: 800px; margin: 24px auto; }
.center{ text-align:center; padding: 24px; }
@media print {.ant-card-head, .ant-btn { display: none !important; }}
</style>
