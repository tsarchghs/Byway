<template>
  <a-space direction="vertical" size="large" style="width:100%">
    <a-typography-title :level="2">My learning</a-typography-title>
    <a-row :gutter="[16,16]">
      <a-col v-for="e in enrollments" :key="e.id" :xs="24" :sm="12" :md="8">
        <a-card :title="e.title">
          <a-progress :percent="e.progress || 0" />
          <NuxtLink :to="`/learn/${e.id}`"><a-button type="primary">Continue</a-button></NuxtLink>
        </a-card>
      </a-col>
    </a-row>
  </a-space>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useEnrollments } from '~/composables/useEnrollments'
const { items } = useEnrollments()
const enrollments = computed(()=> items.value)
</script>
