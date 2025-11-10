<template>
  <a-space direction="vertical" size="large" style="width:100%">
    <a-breadcrumb>
      <a-breadcrumb-item><NuxtLink to="/">Home</NuxtLink></a-breadcrumb-item>
      <a-breadcrumb-item><NuxtLink to="/faculties">Faculties</NuxtLink></a-breadcrumb-item>
      <a-breadcrumb-item>{{ data?.name }}</a-breadcrumb-item>
    </a-breadcrumb>
    <a-typography-title :level="2">{{ data?.name }}</a-typography-title>
    <a-typography-paragraph>{{ data?.description }}</a-typography-paragraph>
    <a-typography-title :level="3">Courses</a-typography-title>
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
  try{
    data.value = await $fetch(`/plugins/students-internal/api/faculties/${route.params.slug}`)
  }catch(e){ data.value = { name:'Unknown', description:'', courses:[] } }
})
</script>
