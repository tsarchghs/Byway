<template>
  <a-space direction="vertical" style="width:100%" size="large">
    <a-typography-title :level="2">Search</a-typography-title>
    <CourseFilters v-model:filters="filters" />
    <CourseGrid :courses="courses" />
  </a-space>
</template>
<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import CourseGrid from '~/components/lms/CourseGrid.vue'
import CourseFilters from '~/components/lms/CourseFilters.vue'
import { useSdk } from '~/composables/useSdk'
const route = useRoute()
const sdk = useSdk()
const courses = ref<any[]>([])
const filters = ref<any>({ q: String(route.query.q || ''), category: String(route.query.category || '') })
async function run(){
  try{
    const res:any = await sdk.listCourses(filters.value)
    courses.value = res?.items || res || []
  }catch(e){ courses.value = [] }
}
watch(()=> route.query, ()=>{ filters.value.q = String(route.query.q || ''); filters.value.category = String(route.query.category || ''); run() })
watch(filters, run, { deep:true })
onMounted(run)
</script>
