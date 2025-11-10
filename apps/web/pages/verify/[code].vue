<template>
  <a-result :status="ok ? 'success' : 'error'" :title="ok ? 'Valid certificate' : 'Invalid code'">
    <template #subTitle>
      <div v-if="ok">
        <div><strong>Code:</strong> {{ data.code }}</div>
        <div><strong>Student:</strong> {{ data.student }}</div>
        <div><strong>Course:</strong> {{ data.courseTitle }}</div>
        <div><strong>Issued:</strong> {{ new Date(data.issuedAt).toLocaleDateString() }}</div>
      </div>
      <div v-else>We couldn't verify this certificate. Please check the code.</div>
    </template>
  </a-result>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const ok = ref(false)
const data = ref<any>(null)
onMounted(async()=>{
  try{
    const res:any = await $fetch(`/plugins/students-internal/api/verify/${route.params.code}`)
    ok.value = !!res?.ok; data.value = res
  }catch{ ok.value = false }
})
</script>
