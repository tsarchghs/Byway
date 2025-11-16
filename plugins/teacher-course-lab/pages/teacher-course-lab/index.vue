<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'

const loading = ref(false)
const items = ref<any[]>([])

async function load() {
  loading.value = true
  try {
    const res = await fetch('/api/teacher-course-lab/challenges')
    const data = await res.json()
    items.value = data.items ?? []
  } catch (e) {
    message.error('Failed to load challenges')
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <div class="p-4">
    <a-page-header
      title="Teacher • Course Labs"
      sub-title="Manage CS50-style challenges, course bindings, and lab sessions"
    />
    <a-card :loading="loading" title="Challenges">
      <a-list
        :data-source="items"
        :renderItem="item => (
          <a-list-item>
            <a-list-item-meta
              :title="item.title"
            >
              <template #description>
                <div class="text-sm text-gray-600">
                  <div>{{ item.description }}</div>
                  <div class="mt-1">
                    <span v-if="item.courseId">Course: {{ item.courseId }}</span>
                    <span v-if="item.moduleId"> · Module: {{ item.moduleId }}</span>
                    <span v-if="item.lessonId"> · Lesson: {{ item.lessonId }}</span>
                  </div>
                </div>
              </template>
            </a-list-item-meta>
            <template #actions>
              <a-tag>{{ item.difficulty }}</a-tag>
              <a-tag>{{ item.visibility }}</a-tag>
            </template>
          </a-list-item>
        )"
      />
    </a-card>
  </div>
</template>
