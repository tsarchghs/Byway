<template>
  <a-result status="error" title="Something went wrong">
    <template #subTitle>{{ error?.message || 'Unknown error' }}</template>
    <template #extra>
      <a-button type="primary" @click="$router.push('/')">Go Home</a-button>
    </template>
  </a-result>
</template>
<script setup lang="ts">
const props = defineProps<{ error: any }>()
</script>
