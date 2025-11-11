<template>
  <a-layout class="p-6">
    <a-page-header :title="inst?.name || 'Institution'" @back="() => navigateTo('/institutions')" />
    <a-card class="mt-4" :bordered="false">
      <a-typography-title :level="5">Classrooms</a-typography-title>
      <a-table :data-source="classrooms" :columns="cols" row-key="id" size="small"/>
    </a-card>
  </a-layout>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, navigateTo } from '#app'
import { useGql } from '../composables/useGql'

const route = useRoute()
const slug = route.params.slug as string
const inst = ref<any>(null)
const classrooms = ref<any[]>([])
const cols = [
  { title: 'Name', dataIndex: 'name' },
  { title: 'Code', dataIndex: 'code' },
]

onMounted(async () => {
  const { call } = useGql('/api/institutions/graphql')
  const d1 = await call(\`query ($slug:String!){ institutionBySlug(slug:$slug){ id name slug } }\`, { slug })
  inst.value = d1?.institutionBySlug
  if (inst.value) {
    const d2 = await call(\`query ($id:String!){ classrooms(institutionId:$id){ id name code } }\`, { id: inst.value.id })
    classrooms.value = d2?.classrooms || []
  }
})
</script>
