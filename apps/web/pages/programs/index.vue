<template>
  <a-space direction="vertical" size="large" style="width:100%">
    <a-typography-title :level="2">Programs</a-typography-title>
    <a-row :gutter="[16,16]">
      <a-col v-for="p in list" :key="p.slug" :xs="24" :sm="12" :md="8">
        <a-card :title="p.name" hoverable @click="$router.push(`/programs/${p.slug}`)">
          <p>{{ p.description }}</p>
          <a-tag color="green">{{ p.courses.length }} courses</a-tag>
        </a-card>
      </a-col>
    </a-row>
  </a-space>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
const list = ref<any[]>([])
onMounted(async()=>{
  const res:any = await $fetch('/plugins/students-internal/api/programs')
  list.value = res.items || []
})
</script>
