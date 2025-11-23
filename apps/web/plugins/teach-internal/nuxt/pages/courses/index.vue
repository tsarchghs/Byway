
<template>
  <a-layout class="p-4">
    <a-page-header title="Courses" sub-title="Manage your courses">
      <template #extra><a-button href="/teach">Dashboard</a-button></template>
    </a-page-header>
    <a-list :data-source="rows" :renderItem="(c:any)=> h('div', {class:'row'}, [ h('div', {class:'title'}, c.title), h(resolveComponent('a-button'), {type:'link', href:`/teach/modules?course=${c.id}`}, {default:()=> 'Open'}) ])" />
    <a-skeleton active :paragraph="{rows:6}" />
  </a-layout>
</template>
<script setup lang="ts">
import { useGql } from '#shared/composables/useGql.ts'
definePageMeta({ layout:'teacher', title:'Courses' })
</script>
