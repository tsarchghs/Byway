<template>
  <a-space direction="vertical" style="width:100%" size="large">
    <a-typography-title :level="2">Categories</a-typography-title>
    <a-row :gutter="[16,16]">
      <a-col v-for="c in cats" :key="c.slug" :xs="24" :sm="12" :md="8" :lg="6">
        <a-card hoverable @click="$router.push(`/search?category=${encodeURIComponent(c.name)}`)" :title="c.name">
          <p>{{ c.description }}</p>
        </a-card>
      </a-col>
    </a-row>
  </a-space>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
const cats = ref<any[]>([])
onMounted(async()=>{
  const res:any = await $fetch('/plugins/students-internal/api/categories')
  cats.value = res.items || []
})
</script>
