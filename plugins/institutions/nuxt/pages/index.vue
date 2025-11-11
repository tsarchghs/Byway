<template>
  <a-layout class="p-6">
    <a-page-header title="Institutions" sub-title="Preview" class="mb-4" @back="$router.push('/students')"/>
    <a-list :data-source="items" bordered :renderItem="renderItem" />
  </a-layout>
</template>
<script setup lang="ts">
const items = ref([
  { id: 'inst-1', name: 'Demo University' },
  { id: 'inst-2', name: 'Tech Faculty' },
])
function renderItem(item:any){
  return h('a-list-item', {}, [
    h('a-space', {}, [
      h('span', {}, item.name),
      h('a-button', { onClick: ()=> navigateTo(`/institutions/${item.id}`) }, 'Open')
    ])
  ])
}
</script>
