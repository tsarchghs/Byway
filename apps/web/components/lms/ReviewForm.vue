<template>
  <a-card title="Write a review" :bordered="true">
    <a-form layout="vertical" @finish="submit">
      <a-form-item label="Rating" name="rating" :rules="[{ required:true }]">
        <a-rate v-model:value="form.rating" allow-half />
      </a-form-item>
      <a-form-item label="Title" name="title" :rules="[{ required:true }]">
        <a-input v-model:value="form.title" />
      </a-form-item>
      <a-form-item label="Comment" name="comment" :rules="[{ required:true, min:10 }]">
        <a-textarea v-model:value="form.comment" :rows="4" />
      </a-form-item>
      <a-space>
        <a-button type="primary" html-type="submit" :loading="loading">Submit</a-button>
        <a-button @click="$emit('cancel')">Cancel</a-button>
      </a-space>
    </a-form>
  </a-card>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps<{ courseId: string }>()
const emit = defineEmits(['submitted','cancel'])
const form = ref<any>({ rating: 5, title:'', comment:'' })
const loading = ref(false)
async function submit(){
  loading.value = true
  try{
    await $fetch(`/plugins/students-internal/api/course/${props.courseId}/reviews`, { method:'POST', body: form.value })
    emit('submitted')
  }finally{
    loading.value = false
  }
}
</script>
