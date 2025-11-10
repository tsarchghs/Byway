<template>
  <a-space direction="vertical" size="large" style="width:100%">
    <a-typography-title :level="2">Explore</a-typography-title>
    <a-row :gutter="[16,16]">
      <a-col :xs="24" :md="12">
        <a-card title="Trending this week">
          <CourseGrid :courses="trending" />
        </a-card>
      </a-col>
      <a-col :xs="24" :md="12">
        <a-card title="New & noteworthy">
          <CourseGrid :courses="newest" />
        </a-card>
      </a-col>
    </a-row>
  </a-space>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import CourseGrid from '~/components/lms/CourseGrid.vue'
const trending = ref<any[]>([])
const newest = ref<any[]>([])
onMounted(async()=>{
  const data:any = await $fetch('/plugins/students-internal/api/catalog', { params: { sort:'relevance' }})
  const items = data?.items || []
  trending.value = items.slice(0,8); newest.value = items.slice(8,16)
})
</script>
