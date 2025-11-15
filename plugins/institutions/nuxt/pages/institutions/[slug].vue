<template>
  <a-layout class="p-6">
    <!-- Header -->
    <a-page-header
      :title="inst?.name || 'Institution'"
      @back="goBack"
    />

    <!-- Classrooms -->
    <a-card class="mt-4" :bordered="false">
      <a-typography-title :level="5">Classrooms</a-typography-title>

      <a-table
        :data-source="classrooms"
        :columns="cols"
        row-key="id"
        size="small"
        :loading="loading"
      />
    </a-card>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from '#app'
import { useGql } from '../../../../../packages/shared-ui/src/composables/useGql'

const route = useRoute()
const router = useRouter()

const slug = route.params.slug as string

// state
const inst = ref<any>(null)
const classrooms = ref<any[]>([])
const loading = ref(true)

// safely defined table columns
const cols = [
  { title: 'Name', dataIndex: 'name' },
  { title: 'Code', dataIndex: 'code' },
]

// page-header back button
const goBack = () => router.push('/institutions')

onMounted(async () => {
  const { call } = useGql('/api/institutions/graphql')

  try {
    // 1) Fetch institution
    const d1 = await call(
      `query ($slug:String!) {
        institutionBySlug(slug:$slug) { id name slug }
      }`,
      { slug }
    )

    inst.value = d1?.institutionBySlug || null

    // 2) Fetch classrooms only if institution exists
    if (inst.value?.id) {
      const d2 = await call(
        `query ($id:String!) {
          classrooms(institutionId:$id) { id name code }
        }`,
        { id: inst.value.id }
      )
      classrooms.value = d2?.classrooms || []
    }
  } catch (err) {
    console.error('Institution/Classrooms load failed:', err)
  } finally {
    loading.value = false
  }
})
</script>
