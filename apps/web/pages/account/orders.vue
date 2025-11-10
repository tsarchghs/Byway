<template>
  <a-card title="Orders">
    <a-table :columns="cols" :data-source="rows" row-key="id" />
  </a-card>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
const cols = [
  { title:'Order #', dataIndex:'id' },
  { title:'Date', dataIndex:'date', customRender:({text}:any)=> new Date(text).toLocaleDateString() },
  { title:'Items', dataIndex:'itemsCount' },
  { title:'Total (€)', dataIndex:'total' },
  { title:'Status', dataIndex:'status' }
]
const rows = ref<any[]>([])
onMounted(async()=>{
  const res:any = await $fetch('/plugins/ecommerce/api/orders')
  rows.value = res.items || []
})
</script>
