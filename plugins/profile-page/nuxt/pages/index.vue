
<template>
  <a-layout class="p-6">
    <a-card title="Profile" :bordered="false">
      <a-result status="info" title="Profile placeholder">
        <template #extra>
          <a-space>
            <a-button href="/dashboard">Dashboard</a-button>
            <a-button href="/courses">Courses</a-button>
          </a-space>
        </template>
      </a-result>
    </a-card>
  </a-layout>
</template>

<script setup lang="ts">
definePageMeta({ alias: ['/profile'] })
</script>
