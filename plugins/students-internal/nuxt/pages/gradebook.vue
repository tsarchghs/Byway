<template>
  <a-layout class="p-6">
    <StudentsNav />
<a-page-header
  title="Gradebook"
  :sub-title="courseId ? `Course · ${courseId}` : 'Select course'"
  @back="$router.push('/')"
  class="mb-4"
>
  <template #tags>
    <a-tag color="blue">Students</a-tag>
    <a-tag color="purple">Assessments</a-tag>
  </template>

  <template #extra>
    <a-space wrap>
      <a-button @click="refresh"><sync-outlined /> Refresh</a-button>
      <a-button type="primary" @click="openRubric"><profile-outlined /> Rubric</a-button>
      <a-divider type="vertical" />
      <a-button @click="$router.push('/students/dashboard')">Dashboard</a-button>
      <a-button @click="$router.push('/courses')">My Courses</a-button>
    </a-space>
  </template>
</a-page-header>

    <a-breadcrumb class="mb-4">
      <a-breadcrumb-item @click="$router.push('/')" class="cursor-pointer">Home</a-breadcrumb-item>
      <a-breadcrumb-item>Students</a-breadcrumb-item>
      <a-breadcrumb-item>Gradebook</a-breadcrumb-item>
    </a-breadcrumb>

    <a-card :bordered="false">
      <a-tabs v-model:activeKey="tab">
        <a-tab-pane key="grades" tab="Grades">
          <a-table :data-source="rows" :columns="cols" row-key="id" :loading="loading" />
        </a-tab-pane>
        <a-tab-pane key="comments" tab="Comments">
          <a-empty description="Select a row and add feedback in Grades tab." />
        </a-tab-pane>
        <a-tab-pane key="rubric" tab="Rubric">
          <a-alert type="info" message="Store rubric JSON via server KV (no localStorage)" show-icon class="mb-2"/>
          <a-textarea v-model:value="rubricJson" :rows="10" />
          <div class="mt-2">
            <a-space>
              <a-button type="primary" @click="saveRubric">Save rubric</a-button>
              <a-button @click="loadRubric">Load rubric</a-button>
            </a-space>
          </div>
        </a-tab-pane>
      </a-tabs>
    </a-card>

    <a-drawer v-model:open="editOpen" title="Edit grade" placement="right" width="420">
      <a-form layout="vertical" @finish="submit">
        <a-form-item label="Grade">
          <a-input-number v-model:value="form.grade" :min="0" :max="100" style="width: 100%" />
        </a-form-item>
        <a-form-item label="Feedback">
          <a-textarea v-model:value="form.feedback" :rows="5" />
        </a-form-item>
        <a-space>
          <a-button @click="editOpen=false">Cancel</a-button>
          <a-button type="primary" html-type="submit">Save</a-button>
        </a-space>
      </a-form>
    </a-drawer>
  </a-layout>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'student' })

import { ref, onMounted, h, computed } from 'vue'
import { useRoute, useRouter } from '#imports'
import { useGradebook } from '../composables/useGradebook'
import { useKV } from '../composables/useKV'
import { SyncOutlined, ProfileOutlined, EditOutlined } from '@ant-design/icons-vue'

const route = useRoute()
const router = useRouter()
const courseId = computed(()=> String(route.query.courseId || route.params.courseId || 'course-1'))

const g = useGradebook()
const kv = useKV()

const loading = ref(false)
const rows = ref<any[]>([])
const tab = ref('grades')
const editOpen = ref(false)
const form = ref<any>({ id: '', assignmentId: '', studentId: '', courseId: '', grade: 0, feedback: '' })

const rubricJson = ref('')

const cols = [
  { title: 'Student', dataIndex: 'studentId', key: 'student' },
  { title: 'Assignment', dataIndex: 'assignmentId', key: 'assignment' },
  { title: 'Grade', dataIndex: 'grade', key: 'grade', customRender: ({ text, record }: any) => h('div', {}, text ?? '—') },
  { title: 'Feedback', dataIndex: 'feedback', key: 'feedback', ellipsis: true },
  {
    title: 'Actions',
    key: 'actions',
    customRender: ({ record }: any) => h('div', {}, [
      h('a-button', { type: 'link', onClick: () => openEdit(record) }, { default: () => [h(EditOutlined), ' Edit'] })
    ])
  }
]

function openEdit(rec: any) {
  form.value = { ...rec }
  editOpen.value = true
}

async function refresh() {
  loading.value = true
  try {
    rows.value = await g.list(courseId.value)
  } finally {
    loading.value = false
  }
}

async function submit() {
  const saved = await g.upsert({ ...form.value, courseId: courseId.value })
  const idx = rows.value.findIndex(r => r.id === saved.id)
  if (idx >= 0) rows.value[idx] = saved
  else rows.value.unshift(saved)
  editOpen.value = false
}

async function saveRubric() {
  await kv.set(`rubric:${courseId.value}`, rubricJson.value)
}

async function loadRubric() {
  rubricJson.value = (await kv.get(`rubric:${courseId.value}`)) || ''
}

onMounted(refresh)
</script>

<style scoped>
.cursor-pointer{ cursor: pointer; }
</style>
