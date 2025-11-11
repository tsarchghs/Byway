<template>
  <a-layout class="p-6">
    <a-page-header :title="inst?.name || 'Institution'" sub-title="Overview" class="mb-4" @back="$router.push('/institutions')" />
    <a-card title="Departments" :bordered="false">
      <a-empty v-if="!departments.length" description="No departments yet" />
      <a-list v-else :data-source="departments" :renderItem="(d:any)=> h('a-list-item', {}, d.name)" />
    </a-card>
  </a-layout>
</template>
<script setup lang="ts">
const route = useRoute()
const inst = ref<any>({ id: route.params.id, name: 'Demo University' })
const departments = ref<any[]>([{ id:'dep-1', name:'Computer Science'}])
</script>
