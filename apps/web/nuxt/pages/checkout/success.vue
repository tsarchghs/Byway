<template>
  <div style="max-width:600px;margin:40px auto;text-align:center">
    <h2>Payment successful 🎉</h2>
    <p>Your enrollment is being finalized. You can find your course in “My Learning”.</p>
    <a-button type="primary" @click="$router.push('/profile')">Go to Profile</a-button>
  </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
onMounted(()=> {
  try { localStorage.setItem('byway:cart', '[]') } catch {}
})
</script>
