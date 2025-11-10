<template>
  <a-card title="Create a new course">
    <a-form layout="vertical" @finish="create">
      <a-form-item label="Title" name="title" :rules="[{ required:true }]"><a-input v-model:value="form.title" /></a-form-item>
      <a-form-item label="Subtitle" name="subtitle"><a-input v-model:value="form.subtitle" /></a-form-item>
      <a-form-item label="Category" name="category"><a-input v-model:value="form.category" /></a-form-item>
      <a-form-item label="Price (€)" name="price"><a-input-number v-model:value="form.price" :min="0" style="width:100%" /></a-form-item>
      <a-button type="primary" html-type="submit">Create</a-button>
    </a-form>
  </a-card>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const form = ref<any>({ title:'', subtitle:'', category:'', price:0 })
async function create(){
  const res:any = await $fetch('/plugins/teach-internal/api/courses', { method:'POST', body: form.value })
  if (res?.id) navigateTo(`/teach/course/${res.id}/builder`)
}
</script>
