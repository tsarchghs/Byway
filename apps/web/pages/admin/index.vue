<template>
  <a-space direction="vertical" size="large" style="width:100%">
    <a-page-header title="Admin">
      <template #subTitle>Platform overview</template>
    </a-page-header>
    <a-row :gutter="[16,16]">
      <a-col :xs="24" :md="8"><a-card title="System health"><pre style="white-space:pre-wrap">{{ health }}</pre></a-card></a-col>
      <a-col :xs="24" :md="8"><a-card title="Usage"><pre style="white-space:pre-wrap">{{ usage }}</pre></a-card></a-col>
      <a-col :xs="24" :md="8"><a-card title="Queues"><pre style="white-space:pre-wrap">{{ queues }}</pre></a-card></a-col>
    </a-row>
  </a-space>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
const health = ref<any>({})
const usage = ref<any>({})
const queues = ref<any>({})
onMounted(async()=>{
  try{ health.value = await $fetch('/plugins/authentication/api/health') }catch{}
  try{ usage.value = await $fetch('/plugins/students-internal/api/usage') }catch{}
  try{ queues.value = await $fetch('/plugins/ecommerce/api/queues') }catch{}
})
</script>
