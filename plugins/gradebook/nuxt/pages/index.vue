<template>
  <a-layout class="p-6">
    <a-page-header
      title="My Gradebook"
      sub-title="Overview of your courses, assignments, and grades"
    />
    <a-space direction="vertical" style="width: 100%">
      <a-row :gutter="16">
        <a-col :xs="24" :md="8">
          <a-card size="small" title="Summary">
            <p><strong>Total entries:</strong> {{ rows.length }}</p>
            <p><strong>Average %:</strong> {{ summary.avgPct?.toFixed(1) ?? '–' }}%</p>
            <p><strong>Best course:</strong> {{ summary.bestCourse || '–' }}</p>
            <p><strong>Last updated:</strong> {{ summary.lastUpdated || '–' }}</p>
          </a-card>
        </a-col>
        <a-col :xs="24" :md="16">
          <a-card size="small" title="Gradebook entries">
            <a-table
              :data-source="rows"
              :columns="cols"
              row-key="id"
              size="small"
              :loading="loading"
            />
          </a-card>
        </a-col>
      </a-row>
    </a-space>
  </a-layout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { definePageMeta } from '#imports'
import { useGql } from '../../../../../packages/shared-ui/src/composables/useGql'

definePageMeta({
  layout: 'student',
})

const loading = ref(false)
const rows = ref<any[]>([])

const cols = [
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

const summary = computed(() => {
  if (!rows.value.length) {
    return {
      avgPct: null,
      bestCourse: null,
      lastUpdated: null,
    }
  }
  const byCourse: Record<string, { pctSum: number; count: number }> = {}
  let lastUpdated: string | null = null

  for (const r of rows.value) {
    const pct = typeof r.percentage === 'number' ? r.percentage : null
    if (pct != null) {
      const key = r.courseTitle || r.courseId
      if (!byCourse[key]) byCourse[key] = { pctSum: 0, count: 0 }
      byCourse[key].pctSum += pct
      byCourse[key].count++
    }
    if (r.updatedAt && (!lastUpdated || r.updatedAt > lastUpdated)) {
      lastUpdated = r.updatedAt
    }
  }

  const courseEntries = Object.entries(byCourse)
  const bestCourse =
    courseEntries.length > 0
      ? courseEntries.sort(
          (a, b) =>
            b[1].pctSum / b[1].count - a[1].pctSum / a[1].count
        )[0][0]
      : null

  const allPcts: number[] = []
  for (const r of rows.value) {
    if (typeof r.percentage === 'number') allPcts.push(r.percentage)
  }

  const avgPct =
    allPcts.length > 0
      ? allPcts.reduce((a, b) => a + b, 0) / allPcts.length
      : null

  return {
    avgPct,
    bestCourse,
    lastUpdated,
  }
})

async function load() {
  loading.value = true
  try {
    // NOTE: In a real app, studentId should come from the authenticated user.
    const studentId = 'demo-student'
    const { call } = useGql('/api/gradebook/graphql')
    const data = await call(
      `query GradebookByStudent($studentId: String!) {
        gradebookByStudent(studentId: $studentId) {
          id
          courseId
          courseTitle
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
      { studentId }
    )
    rows.value = data?.gradebookByStudent || []
  } catch (err) {
    // Keep failures non-fatal; user can still see the page shell
    console.error('[gradebook] Failed to load gradebookByStudent', err)
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>
