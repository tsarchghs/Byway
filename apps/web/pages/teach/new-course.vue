<template>
  <a-card title="Create a course">
    <a-form layout="vertical" @finish="save">
      <a-form-item label="Title" name="title" :rules="[{required:true,message:'Required'}]">
        <a-input v-model:value="form.title" />
      </a-form-item>
      <a-form-item label="Subtitle" name="subtitle">
        <a-input v-model:value="form.subtitle" />
      </a-form-item>
      <a-form-item label="Price (EUR)" name="price">
        <a-input-number v-model:value="form.price" :min="0" :step="1" style="width:100%" />
      </a-form-item>
      <a-button type="primary" html-type="submit">Save</a-button>
    </a-form>
  </a-card>
</template>
<script setup lang="ts">
import { reactive } from 'vue'
const form = reactive({ title:'', subtitle:'', price: 0 })
function save(){
  // best-effort: persist to localStorage for demo
  if (process.client){
    const raw = localStorage.getItem('byway_my_courses') || '[]'
    const list = JSON.parse(raw)
    list.push({ id:String(Date.now()), ...form })
    localStorage.setItem('byway_my_courses', JSON.stringify(list))
    window.location.href = '/teach/courses'
  }
}
</script>
