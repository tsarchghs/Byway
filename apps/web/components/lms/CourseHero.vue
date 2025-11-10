<template>
  <div class="hero">
    <div class="left">
      <a-typography-title :level="1" style="margin:0">{{ course.title }}</a-typography-title>
      <a-typography-paragraph class="subtitle">{{ course.subtitle }}</a-typography-paragraph>
      <a-space size="small" align="center" wrap>
        <a-rate :value="rating" disabled allow-half />
        <span>{{ rating.toFixed(1) }} ({{ reviews }} reviews)</span>
        <a-tag v-if="course.level">{{ course.level }}</a-tag>
        <a-tag v-if="course.category">{{ course.category }}</a-tag>
      </a-space>
    </div>
    <div class="right">
      <img :src="course.thumbnail || 'https://dummyimage.com/1280x720/eee/aaa.jpg&text=Course'" alt="" />
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{ course:any, rating:number, reviews:number }>()
</script>
<style scoped>
.hero{ display:grid; grid-template-columns: 1fr 360px; gap:16px; align-items:center }
.subtitle{ color:#666 }
.right img{ width:100%; height:220px; object-fit:cover; border-radius:8px }
@media (max-width: 1024px){ .hero{ grid-template-columns: 1fr } .right{ order:-1 } .right img{ height:180px } }
</style>
