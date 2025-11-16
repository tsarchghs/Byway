<template>
  <a-layout class="p-6">
    <a-page-header title="Your Cart" sub-title="Review and checkout" class="mb-4">
      <template #extra>
        <a-space>
          <NuxtLink to="/"><a-button>Explore</a-button></NuxtLink>
          <NuxtLink to="/students/dashboard"><a-button>Dashboard</a-button></NuxtLink>
        </a-space>
      </template>
    </a-page-header>

    <a-card :bordered="false">
      <div class="grid md:grid-cols-3 gap-4">
        <div class="md:col-span-2">
          <a-table :data-source="rows" :columns="cols" row-key="id" :loading="loading"/>
          <div v-if="!rows.length && !loading" class="text-gray-500 mt-4">Cart is empty.</div>
        </div>
        <div>
          <a-card size="small" title="Summary">
            <div class="text-2xl font-semibold">{{ total }} €</div>
            <a-divider />
            <a-space>
              <a-button @click="handleClearCart" :loading="loading">Clear</a-button>
              <a-button type="primary" @click="goCheckout" :disabled="!rows.length">Checkout</a-button>
            </a-space>
          </a-card>
        </div>
      </div>
    </a-card>
  </a-layout>
</template>

<script setup lang="ts">
import { onMounted, computed, h } from 'vue'
import { useRouter, useRoute } from '#imports'
import { useCart } from '../../../../packages/shared-ui/src/composables/useCart'
import { useAuth } from '../../../../packages/shared-ui/src/composables/useAuth'
import { message, Modal } from 'ant-design-vue'
import { DeleteOutlined } from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()
const { user, isLoggedIn } = useAuth()
const { cart, loading, items, itemCount, fetchCart, removeFromCart, clearCart } = useCart()

onMounted(async () => {
  if (isLoggedIn.value && user.value?.id) {
    try {
      await fetchCart()
    } catch (e: any) {
      message.error(e?.message || 'Failed to load cart')
    }
  } else {
    message.warning('Please log in to view your cart')
    router.push('/login')
  }
})

const rows = computed(() => items.value || [])
const cols = [
  { title: 'Course ID', dataIndex: 'courseId', key: 'courseId' },
  { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
  {
    title: 'Action',
    key: 'action',
    customRender: ({ record }: any) => h('a', {
      onClick: () => handleRemoveItem(record),
      style: 'color: #f5222d; cursor: pointer;'
    }, [h(DeleteOutlined), ' Remove'])
  }
]

const total = computed(() => {
  // TODO: Calculate actual total with course prices
  return itemCount.value > 0 ? (itemCount.value * 10).toFixed(2) : '0.00'
})

async function handleRemoveItem(item: any) {
  try {
    await removeFromCart(item.id)
    message.success('Item removed from cart')
  } catch (e: any) {
    message.error(e?.message || 'Failed to remove item')
  }
}

async function handleClearCart() {
  Modal.confirm({
    title: 'Clear Cart?',
    content: 'Are you sure you want to remove all items from your cart?',
    okText: 'Clear',
    okType: 'danger',
    cancelText: 'Cancel',
    onOk: async () => {
      try {
        await clearCart()
        message.success('Cart cleared')
      } catch (e: any) {
        message.error(e?.message || 'Failed to clear cart')
      }
    }
  })
}

function goCheckout() {
  if (items.value.length === 0) {
    message.warning('Your cart is empty')
    return
  }
  router.push('/checkout')
}
</script>
