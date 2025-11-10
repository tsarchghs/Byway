<template>
  <a-space direction="vertical" size="large" style="width:100%">
    <a-typography-title :level="2">Wishlist</a-typography-title>
    <a-list :data-source="items">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-space style="width:100%;justify-content:space-between">
            <div>{{ item.title }}</div>
            <a-space>
              <NuxtLink :to="`/course/${item.id}`"><a-button>View</a-button></NuxtLink>
              <a-button danger @click="remove(item.id)">Remove</a-button>
            </a-space>
          </a-space>
        </a-list-item>
      </template>
    </a-list>
  </a-space>
</template>
<script setup lang="ts">
import { useWishlist } from '~/composables/useWishlist'
const { items, remove } = useWishlist()
</script>
