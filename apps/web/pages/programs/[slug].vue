<template>
  <a-space direction="vertical" size="large" style="width:100%">
    <a-breadcrumb>
      <a-breadcrumb-item><NuxtLink to="/">Home</NuxtLink></a-breadcrumb-item>
      <a-breadcrumb-item><NuxtLink to="/programs">Programs</NuxtLink></a-breadcrumb-item>
      <a-breadcrumb-item>{{ data?.name }}</a-breadcrumb-item>
    </a-breadcrumb>
    <a-typography-title :level="2">{{ data?.name }}</a-typography-title>
    <a-typography-paragraph>{{ data?.description }}</a-typography-paragraph>
    <CourseGrid :courses="data?.courses || []" />
  </a-space>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import CourseGrid from '~/components/lms/CourseGrid.vue'
const route = useRoute()
const data = ref<any>(null)
onMounted(async()=>{
  data.value = await $fetch(`/plugins/students-internal/api/programs/${route.params.slug}`)
})
</script>
