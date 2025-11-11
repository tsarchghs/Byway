<template>
  <a-layout class="p-6">
    <StudentsNav subtitle="My Enrollments" />
    <a-card :loading="loading" :bordered="false">
      <a-table :data-source="rows" :columns="cols" row-key="id" />
    </a-card>
  </a-layout>
</template>

<script setup lang="ts">
import StudentsNav from "../components/StudentsNav.vue"
import { useGql } from "../composables/useGql"
const { gql } = useGql()
const route = useRoute()

const loading = ref(true)
const rows = ref<any[]>([])
const cols = [
  { title: 'Course', dataIndex: 'courseId' },
  { title: 'Progress', key: 'progress', customRender: ({record}: any)=> record.progressPct + '%' },
  { title: 'Updated', dataIndex: 'updatedAt' },
]

onMounted(async ()=>{
  try {
    const q = `query { myEnrollments { id courseId progressPct updatedAt } }`
    const d = await gql<{myEnrollments:any[]}>(q)
    rows.value = d.myEnrollments
  } finally {
    loading.value = false
  }
})
</script>
