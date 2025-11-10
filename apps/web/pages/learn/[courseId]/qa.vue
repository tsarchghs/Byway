<template>
  <a-space direction="vertical" size="large" style="width:100%">
    <a-page-header :title="`Q&A — ${courseId}`" />
    <a-list :data-source="items">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-comment :author="item.author" :content="item.text" :datetime="new Date(item.date).toLocaleString()" />
        </a-list-item>
      </template>
    </a-list>
    <a-card>
      <a-form layout="vertical" @finish="post">
        <a-form-item label="Question" name="text" :rules="[{ required:true, min:4 }]">
          <a-textarea v-model:value="text" :rows="4" />
        </a-form-item>
        <a-button type="primary" html-type="submit" :loading="loading">Ask</a-button>
      </a-form>
    </a-card>
  </a-space>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const courseId = String(route.params.courseId)
const items = ref<any[]>([])
const text = ref('')
const loading = ref(false)
async function load(){
  try{ const res:any = await $fetch(`/plugins/students-internal/api/course/${courseId}/qa`); items.value = res.items || [] }catch{ items.value = [] }
}
async function post(){
  loading.value = true
  try{
    await $fetch(`/plugins/students-internal/api/course/${courseId}/qa`, { method:'POST', body: { text: text.value } })
    text.value = ''
    await load()
  }finally{ loading.value = false }
}
onMounted(load)
</script>
