<template>
  <a-result status="404" title="Page not found">
    <template #subTitle>The page you visited does not exist.</template>
    <template #extra><NuxtLink to="/"><a-button type="primary">Back Home</a-button></NuxtLink></template>
  </a-result>
</template>
<script setup lang="ts"></script>
