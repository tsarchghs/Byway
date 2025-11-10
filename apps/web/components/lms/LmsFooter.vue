<template>
  <a-layout-footer class="lms-footer">
    <div class="inner">
      <div>© {{ year }} Byway LMS</div>
      <div class="links">
        <NuxtLink to="/about">About</NuxtLink>
        <NuxtLink to="/contact">Contact</NuxtLink>
        <NuxtLink to="/terms">Terms</NuxtLink>
        <NuxtLink to="/privacy">Privacy</NuxtLink>
      </div>
    </div>
  </a-layout-footer>
</template>
<script setup lang="ts">
const year = new Date().getFullYear()
</script>
<style scoped>
.lms-footer{ background:#fafafa; border-top:1px solid #eee; }
.inner{ max-width:1280px; margin:0 auto; padding:24px 16px; display:flex; align-items:center; justify-content:space-between; }
.links{ display:flex; gap:12px; }
</style>
