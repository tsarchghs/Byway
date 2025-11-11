<template>
  <a-layout class="p-6">
    <a-page-header title="Teacher · Gradebook" sub-title="Lookup" class="mb-4" @back="$router.push('/')" />
    <a-card>
      <a-row :gutter="[8,8]" class="mb-3">
        <a-col :span="18">
          <a-input v-model:value="courseId" placeholder="Course ID..." />
        </a-col>
        <a-col :span="6">
          <a-button type="primary" @click="go">Open in Student GB</a-button>
        </a-col>
      </a-row>
      <a-alert type="info" message="This page helps you jump into the gradebook." show-icon />
    </a-card>
  </a-layout>
</template>
<script setup lang="ts">
const courseId = ref('')
function go(){
  if (!courseId.value) return
  navigateTo(`/students/gradebook?courseId=${encodeURIComponent(courseId.value)}`)
}
</script>
