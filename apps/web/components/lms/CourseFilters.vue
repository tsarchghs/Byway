<template>
  <a-card size="small">
    <a-row :gutter="[12,12]">
      <a-col :xs="24" :sm="12" :md="6">
        <a-select v-model:value="filters.category" allow-clear style="width:100%" placeholder="Category"
          :options="categories.map(c=>({label:c, value:c}))" />
      </a-col>
      <a-col :xs="24" :sm="12" :md="6">
        <a-select v-model:value="filters.level" allow-clear style="width:100%" placeholder="Level"
          :options="levels.map(c=>({label:c, value:c}))" />
      </a-col>
      <a-col :xs="12" :md="4">
        <a-input-number v-model:value="filters.minPrice" :min="0" :step="1" style="width:100%" placeholder="Min €" />
      </a-col>
      <a-col :xs="12" :md="4">
        <a-input-number v-model:value="filters.maxPrice" :min="0" :step="1" style="width:100%" placeholder="Max €" />
      </a-col>
      <a-col :xs="24" :md="4">
        <a-select v-model:value="filters.sort" style="width:100%" :options="sorts" />
      </a-col>
    </a-row>
  </a-card>
</template>
<script setup lang="ts">
const filters = defineModel<any>('filters', { default: { sort:'relevance' } })
const categories = ['Programming','Design','Marketing','Data','Business','AI','Mobile','Game Dev']
const levels = ['Beginner','Intermediate','Advanced','All levels']
const sorts = [
  { label:'Relevance', value:'relevance' },
  { label:'Price: Low to High', value:'price_asc' },
  { label:'Price: High to Low', value:'price_desc' },
  { label:'Newest', value:'newest' }
]
</script>
