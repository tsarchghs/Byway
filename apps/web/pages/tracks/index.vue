<template>
  <a-space direction="vertical" size="large" style="width:100%">
    <a-typography-title :level="2">Tracks</a-typography-title>
    <a-row :gutter="[16,16]">
      <a-col v-for="t in list" :key="t.slug" :xs="24" :sm="12" :md="8">
        <a-card :title="t.name" hoverable @click="$router.push(`/tracks/${t.slug}`)">
          <p>{{ t.description }}</p>
          <a-tag color="blue">{{ t.courses.length }} courses</a-tag>
        </a-card>
      </a-col>
    </a-row>
  </a-space>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
const list = ref<any[]>([])
onMounted(async()=>{
  const res:any = await $fetch('/plugins/students-internal/api/tracks')
  list.value = res.items || []
})
</script>
