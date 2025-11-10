<template>
  <a-card title="Platform mode">
    <a-radio-group v-model:value="val" :options="opts" />
    <a-divider />
    <a-alert type="info" message="Coursera mode focuses on Explore, Categories, and Tracks. LMS mode focuses on Faculties and Programs." />
  </a-card>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { useMode } from '~/composables/useMode'
const { mode, setMode } = useMode()
const opts = [{ label:'Coursera style', value:'coursera' }, { label:'LMS for faculties', value:'lms' }]
const val = ref<string>(mode.value)
watch(val, (nv)=> setMode(nv as any))
</script>
