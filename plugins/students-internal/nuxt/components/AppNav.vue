<template>
  <div class="mb-3 flex items-center justify-between">
    <div class="flex items-center gap-2">
      <a-button type="link" @click="$router.push('/explore')">Explore</a-button>
      <a-button type="link" @click="$router.push('/courses')">Courses</a-button>
      <a-button type="link" @click="$router.push('/assignments')">Assignments</a-button>
      <a-button type="link" @click="$router.push('/institutions')">Institutions</a-button>
      <a-button type="link" @click="$router.push('/analytics')">Analytics</a-button>
    </div>
    <div class="flex items-center gap-2">
      <a-tag v-for="r in me?.roles || []" :key="r" color="gold">{{ r }}</a-tag>
      <a-avatar>{{ me?.displayName?.[0] || '?' }}</a-avatar>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useQuery, gql } from '@vue/apollo-composable'
const Q_ME = gql`query Me { me { id email displayName roles } }`
const { result: meRes } = useQuery(Q_ME)
const me = computed(()=> meRes.value?.me || null)
</script>