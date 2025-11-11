<template>
  <a-layout class="p-6">
    <a-page-header title="Student Dashboard" :sub-title="`Welcome`" />
    <a-row :gutter="16" class="mt-4">
      <a-col :span="12">
        <a-card title="My Courses" :bordered="false">
          <a-list :data-source="courses" :renderItem="renderCourse" />
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card title="Quick Settings" :bordered="false">
          <a-space direction="vertical" style="width:100%">
            <a-input v-model:value="prefTheme" placeholder="theme: light|dark" />
            <div>
              <a-space>
                <a-button type="primary" @click="savePref">Save</a-button>
                <a-button @click="loadPref">Load</a-button>
              </a-space>
            </div>
          </a-space>
        </a-card>
      </a-col>
    </a-row>
  </a-layout>
</template>

<script setup lang="ts">
import { h, ref, onMounted } from 'vue'
import { useKV } from '../composables/useKV'

const kv = useKV()
const courses = ref<any[]>([
  { id: 'course-1', title: 'Intro to Systems', progressPct: 32 },
  { id: 'course-2', title: 'Databases', progressPct: 75 }
])

function renderCourse(item:any) {
  return h('a-list-item', {}, [
    h('a-list-item-meta', {
      title: h('a', { href: `/plugins/students-internal/nuxt/pages/gradebook?courseId=${item.id}` }, item.title),
      description: `Progress: ${item.progressPct}%`
    })
  ])
}

const prefTheme = ref('light')

async function savePref() {
  await kv.set('pref:theme', prefTheme.value)
}

async function loadPref() {
  prefTheme.value = (await kv.get('pref:theme')) || 'light'
}

onMounted(loadPref)
</script>
