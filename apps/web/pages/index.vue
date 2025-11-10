<template>
  <a-space direction="vertical" style="width:100%" size="large">
    <a-typography-title :level="2" style="margin:0">Explore courses</a-typography-title>
    <CourseFilters v-model:filters="filters" />
    <CourseGrid :courses="courses" />
    <div style="display:flex; justify-content:center">
      <a-pagination :current="page" :total="total" :pageSize="pageSize" @change="onPage" :showSizeChanger="false" />
    </div>
  </a-space>
</template>
<script setup lang="ts">
useHead({ title: 'Byway — Explore courses' })
import { ref, watch, onMounted } from 'vue'
import CourseGrid from '~/components/lms/CourseGrid.vue'
import CourseFilters from '~/components/lms/CourseFilters.vue'
import { useSdk } from '~/composables/useSdk'
const sdk = useSdk()
const courses = ref<any[]>([])
const page = ref(1)
const pageSize = 12
const total = ref(0)
const filters = ref<any>({})
function onPage(p:number){ page.value = p; run() }
async function run(){
  try{
    const res:any = await sdk.listCourses({ ...filters.value, page: page.value, pageSize })
    if (Array.isArray(res?.items)) { courses.value = res.items; total.value = res.total || res.items.length }
    else { courses.value = res || []; total.value = courses.value.length }
  }catch(e){ courses.value = []; total.value = 0 }
}
watch(filters, run, { deep:true })
onMounted(run)
</script>
