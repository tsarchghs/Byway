<template>
  <a-row :gutter="[16,16]">
    <a-col v-for="c in courses" :key="c.id" :xs="24" :sm="12" :md="8" :lg="6">
      <a-card :title="c.title" hoverable @click="$router.push(`/course/${c.id}`)">
        <template #cover>
          <img :src="c.thumbnail || 'https://dummyimage.com/600x338/eee/aaa.jpg&text=Course'" style="object-fit:cover;height:160px" />
        </template>
        <a-typography-paragraph type="secondary" ellipsis>{{ c.subtitle }}</a-typography-paragraph>
        <a-typography-text strong>{{ money(c.price || 0) }}</a-typography-text>
        <template #actions>
    <a-button size="small" @click.stop="wish(c)">Add to wishlist</a-button>
  </template>
</a-card>

    </a-col>
  </a-row>
</template>
<script setup lang="ts">
import { useWishlist } from '~/composables/useWishlist'
import { useCurrency } from '~/composables/useCurrency'
defineProps<{ courses:any[] }>()
const { money } = useCurrency()
const { add: addWish } = useWishlist()
function wish(c:any){ addWish({ id:c.id, title:c.title, price:c.price }) }
</script>
