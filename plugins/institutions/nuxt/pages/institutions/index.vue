<template>
  <a-layout class="p-6">
    <a-page-header title="Institutions" sub-title="Browse faculties & departments" />
    <a-card class="mt-4" :bordered="false">
      <a-list :data-source="rows" :renderItem="renderItem" />
    </a-card>
  </a-layout>
</template>
<script setup lang="ts">
import { h, ref, onMounted } from 'vue'
import { useGql } from '#shared/composables/useGql.ts'

const rows = ref<any[]>([])
function renderItem(it:any){
  return h('div', { class: 'py-2' }, [
    h('a', { href: '/institutions/'+it.slug }, it.name),
    h('div', { class: 'text-xs text-gray-500' }, it.id)
  ])
}

onMounted(async () => {
  const { call } = useGql('/api/institutions/graphql')
  const data = await call(`query { institutions { id name slug } }`)
  rows.value = data?.institutions || []
})
</script>
