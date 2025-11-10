<template>
  <a-card title="Resources">
    <a-list :data-source="items">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-space>
            <a-tag v-if="item.kind">{{ item.kind }}</a-tag>
            <a :href="item.url" target="_blank">{{ item.title }}</a>
          </a-space>
        </a-list-item>
      </template>
    </a-list>
  </a-card>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const items = ref<any[]>([])
onMounted(async()=>{
  const res:any = await $fetch(`/plugins/students-internal/api/course/${route.params.courseId}/resources`)
  items.value = res.items || []
})
</script>
