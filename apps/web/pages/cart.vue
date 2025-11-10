<template>
  <a-row :gutter="[16,16]">
    <a-col :xs="24" :lg="16">
      <a-card title="Your cart">
        <a-empty v-if="!items.length" description="Cart is empty" />
        <a-list v-else :data-source="items">
          <template #renderItem="{ item }">
            <a-list-item>
              <a-space style="width:100%;justify-content:space-between">
                <div>
                  <div>{{ item.title }}</div>
                  <small>€{{ item.price }} × {{ item.qty }}</small>
                </div>
                <a-space>
                  <a-button size="small" @click="remove(item.id)">Remove</a-button>
                </a-space>
              </a-space>
            </a-list-item>
          </template>
        </a-list>
      </a-card>
    </a-col>
    <a-col :xs="24" :lg="8">
      <a-card title="Summary">
        <a-typography-title :level="3" style="margin:0">{{ formattedTotal }}</a-typography-title>
        <a-divider />
        <NuxtLink to="/checkout"><a-button type="primary" block :disabled="!items.length">Checkout</a-button></NuxtLink>
        <a-button block style="margin-top:8px" @click="clear" :disabled="!items.length">Clear</a-button>
      </a-card>
    </a-col>
  </a-row>
</template>
<script setup lang="ts">
import { useCart } from '~/composables/useCart'
const { items, formattedTotal, remove, clear } = useCart()
</script>
