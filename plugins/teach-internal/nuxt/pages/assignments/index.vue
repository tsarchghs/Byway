
<template>
  <a-layout class="p-4">
    <a-page-header title="Assignments" sub-title="Create, collect, grade">
      <template #extra><a-button href="/teach">Dashboard</a-button></template>
    </a-page-header>
    <a-list :data-source="rows" :renderItem="(a:any)=> h('div', {class:'row'}, [ h('div', {class:'title'}, a.title), h(resolveComponent('a-button'), {type:'link', href:`/institutions/mock/assignments/${a.id}/grading`}, {default:()=> 'Open'}) ])" />
    <a-skeleton active :paragraph="{rows:6}" />
  </a-layout>
</template>
<script setup lang="ts">
import { useGql } from '../../../../packages/shared-ui/src/composables/useGql'
definePageMeta({ layout:'teacher', title:'Assignments' })
</script>
