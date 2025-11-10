<template>
  <a-card title="Reviews">
    <a-space style="margin-bottom:12px">
      <a-rate :value="avg" disabled allow-half />
      <strong>{{ avg.toFixed(1) }}</strong>
      <span>({{ items.length }} reviews)</span>
      <a-select v-model:value="sort" style="width:160px" :options="[
        {label:'Most recent', value:'recent'},
        {label:'Highest rated', value:'high'},
        {label:'Lowest rated', value:'low'}
      ]" />
    </a-space>
    <a-list :data-source="sorted">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-space align="start">
            <a-avatar :src="item.avatar" />
            <div>
              <a-rate :value="item.rating" disabled />
              <div class="meta">{{ item.name }} • {{ new Date(item.date).toLocaleDateString() }}</div>
              <div>{{ item.comment }}</div>
            </div>
          </a-space>
        </a-list-item>
      </template>
    </a-list>
  </a-card>
</template>
<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
const props = defineProps<{ items:any[] }>()
const sort = ref('recent')
const avg = computed(()=> props.items.length ? props.items.reduce((s,i)=> s+i.rating, 0)/props.items.length : 0)
const sorted = computed(()=>{
  const a = props.items.slice()
  switch (sort.value){
    case 'high': return a.sort((x,y)=> y.rating - x.rating)
    case 'low': return a.sort((x,y)=> x.rating - y.rating)
    default: return a.sort((x,y)=> y.date - x.date)
  }
})
</script>
<style scoped>
.meta{ color:#666; margin: 2px 0 6px }
</style>
