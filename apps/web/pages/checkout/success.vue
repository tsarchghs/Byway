<template>
  <a-result status="success" title="Order complete">
    <template #subTitle>Your courses have been added to your learning dashboard.</template>
    <template #extra>
      <a-space>
        <NuxtLink to="/dashboard"><a-button type="primary">Go to My learning</a-button></NuxtLink>
        <NuxtLink to="/"><a-button>Back to catalog</a-button></NuxtLink>
      </a-space>
    </template>
  </a-result>
</template>
<script setup lang="ts"></script>
