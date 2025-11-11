
<template>
  <a-breadcrumb class="crumbs">
    <a-breadcrumb-item><NuxtLink to="/dashboard">Student</NuxtLink></a-breadcrumb-item>
    <a-breadcrumb-item v-if="courseTitle">{{ courseTitle }}</a-breadcrumb-item>
    <a-breadcrumb-item v-if="moduleTitle">{{ moduleTitle }}</a-breadcrumb-item>
    <a-breadcrumb-item v-if="pageLabel">{{ pageLabel }}</a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useGql } from '../../../packages/shared-ui/src/composables/useGql'
import { useRoute } from '#imports'
const route = useRoute()
const courseTitle = ref('')
const moduleTitle = ref('')
const pageLabel = computed(()=> (route.meta?.title as string) || route.name || 'View')

async function jget<T=any>(url:string){ try{ const r=await fetch(url); if(!r.ok) throw 0; return await r.json() as T }catch{return null} }

onMounted(async () => {
  const { call, endpoints } = useGql();
  const modId = route.params?.id as string
  if (route.path.startsWith('/modules/') && modId) {
    let m = null as any; try { const q = `query($id:String!){ module(id:$id){ id title courseId } }`; const d:any = await call(endpoints.teachInternal, q, { id: modId }); m = d?.module || null } catch { m = null }
    if (m?.title) moduleTitle.value = m.title
    if (m?.courseId) {
      let c = null as any; try { const q = `query($id:String!){ course(id:$id){ id title } }`; const d:any = await call(endpoints.teachInternal, q, { id: m.courseId }); c = d?.course || null } catch { c = null }
      if (c?.title) courseTitle.value = c.title
    }
  }
})
</script>

<style scoped>
.crumbs { padding: 8px 16px; }
</style>
