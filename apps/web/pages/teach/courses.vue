<template>
  <a-space direction="vertical" size="large" style="width:100%">
    <a-page-header title="Your courses">
      <template #extra>
        <NuxtLink to="/teach/courses/new"><a-button type="primary">New course</a-button></NuxtLink>
      </template>
    </a-page-header>
    <a-row :gutter="[16,16]">
      <a-col v-for="c in list" :key="c.id" :xs="24" :sm="12" :md="8">
        <a-card :title="c.title" :extra="c.published ? 'Published' : 'Draft'">
          <a-space>
            <NuxtLink :to="`/teach/course/${c.id}/builder`"><a-button type="primary">Edit</a-button></NuxtLink>
            <a-button @click="toggle(c)">{{ c.published ? 'Unpublish' : 'Publish' }}</a-button>
          </a-space>
        </a-card>
      </a-col>
    </a-row>
  </a-space>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
const list = ref<any[]>([])
onMounted(async()=>{
  const res:any = await $fetch('/plugins/teach-internal/api/courses')
  list.value = res.items || []
})
async function toggle(c:any){
  const url = `/plugins/teach-internal/api/course/${c.id}/${c.published ? 'unpublish' : 'publish'}`
  const res:any = await $fetch(url, { method:'POST' })
  c.published = !!res?.published
}
</script>
