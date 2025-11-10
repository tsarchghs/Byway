<template>
  <a-space direction="vertical" size="large" style="width:100%">
    <a-typography-title :level="2">Faculties</a-typography-title>
    <a-row :gutter="[16,16]">
      <a-col v-for="f in list" :key="f.slug" :xs="24" :sm="12" :md="8">
        <a-card :title="f.name" hoverable @click="$router.push(`/faculties/${f.slug}`)">
          <p>{{ f.description }}</p>
        </a-card>
      </a-col>
    </a-row>
  </a-space>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
const list = ref<any[]>([])
onMounted(async()=>{
  try{
    const res:any = await $fetch('/plugins/students-internal/api/faculties')
    list.value = res.items || []
  }catch(e){ list.value = [] }
})
</script>
