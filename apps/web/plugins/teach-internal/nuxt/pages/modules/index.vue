
<template>
  <a-layout class="p-4">
    <a-page-header title="Modules" sub-title="Structure your content">
      <template #extra><a-button href="/teach">Dashboard</a-button></template>
    </a-page-header>
    <a-list :data-source="rows" :renderItem="(m:any)=> h('div', {class:'row'}, [ h('div', {class:'title'}, m.title), h(resolveComponent('a-button'), {type:'link', href:`/teach/modules/${m.id}/admin`}, {default:()=> 'Open'}) ])" />
    <a-skeleton active :paragraph="{rows:6}" />
  </a-layout>
</template>
<script setup lang="ts">
import { useGql } from '#shared/composables/useGql.ts'
definePageMeta({ layout:'teacher', title:'Modules' })
</script>
