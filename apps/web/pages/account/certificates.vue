<template>
  <a-card title="Certificates">
    <a-list :data-source="list">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-space style="justify-content:space-between; width:100%">
            <div><strong>{{ item.courseTitle }}</strong><div class="sub">Issued: {{ new Date(item.issuedAt).toLocaleDateString() }}</div></div>
            <a-space>
              <NuxtLink :to="`/certificate/${item.courseId}`"><a-button type="primary">View</a-button></NuxtLink>
              <NuxtLink :to="`/verify/${item.code}`"><a-button>Verify</a-button></NuxtLink>
            </a-space>
          </a-space>
        </a-list-item>
      </template>
    </a-list>
  </a-card>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
const list = ref<any[]>([])
onMounted(async()=>{
  const res:any = await $fetch('/plugins/students-internal/api/certificates')
  list.value = res.items || []
})
</script>
<style scoped>.sub{ color:#666 }</style>
