<template>
  <a-layout class="p-6">
    <a-page-header
      :title="`Gradebook · ${courseId}`"
      sub-title="Teacher view of all students in this course"
      @back="goBack"
    />
    <a-card class="mt-4" :bordered="false">
      <template #title>
        Course gradebook
      </template>
      <a-table
        :data-source="rows"
        :columns="cols"
        row-key="id"
        size="small"
        :loading="loading"
      />
    </a-card>
  </a-layout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { definePageMeta, useRoute, useRouter } from '#imports'
import { useGql } from '#shared/composables/useGql.ts'



definePageMeta({
  layout: 'teach-internal',
})

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const rows = ref<any[]>([])

const teacherId = computed(() => route.params.teacher_id as string)
const courseId = computed(() => route.params.course_id as string)

const cols = [
  { title: 'Student', dataIndex: 'studentDisplayName', key: 'studentDisplayName' },
  { title: 'Course', dataIndex: 'courseTitle', key: 'courseTitle' },
  { title: 'Assignment', dataIndex: 'assignmentTitle', key: 'assignmentTitle' },
  {
    title: 'Score',
    key: 'score',
    customRender: ({ record }: any) => {
      if (record.score == null || record.maxScore == null) return '–'
      return `${record.score} / ${record.maxScore}`
    },
  },
  {
    title: 'Percentage',
    key: 'percentage',
    customRender: ({ record }: any) => {
      if (record.percentage == null) return '–'
      return record.percentage.toFixed(1) + '%'
    },
  },
  { title: 'Letter', dataIndex: 'letter', key: 'letter' },
  { title: 'Updated at', dataIndex: 'updatedAt', key: 'updatedAt' },
]

function goBack() {
  // Fallback: go to teach-internal course view if we can, otherwise simple back
  const fallback = `/teach-internal/${teacherId.value}/course/${courseId.value}`
  if (router) {
    router.push(fallback)
  } else if (history.length > 1) {
    history.back()
  }
}

async function load() {
  loading.value = true
  try {
    const { call } = useGql('/api/gradebook/graphql')
    const data = await call(
      `query GradebookByCourse($courseId: String!) {
        gradebookByCourse(courseId: $courseId) {
          id
          courseId
          courseTitle
          studentId
          studentDisplayName
          assignmentId
          assignmentTitle
          score
          maxScore
          percentage
          letter
          feedback
          createdAt
          updatedAt
        }
      }`,
      { courseId: courseId.value }
    )
    rows.value = data?.gradebookByCourse || []
  } catch (err) {
    console.error('[gradebook] Failed to load gradebookByCourse', err)
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>
