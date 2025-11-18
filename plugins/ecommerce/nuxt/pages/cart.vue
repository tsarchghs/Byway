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
          <div v-if="!rows.length && !loading" class="empty-cart">
            <div>Your cart is empty.</div>
            <NuxtLink to="/categories"><a-button type="primary" style="margin-top: 12px">Browse courses</a-button></NuxtLink>
          </div>
        </div>
        <div>
          <a-card size="small" title="Summary">
            <div class="text-2xl font-semibold">€{{ total.toFixed(2) }}</div>
            <a-divider />
            <a-space>
              <a-button @click="handleClearCart" :loading="loading">Clear</a-button>
              <a-button type="primary" @click="goCheckout" :disabled="!rows.length || checkingOut" :loading="checkingOut">Checkout</a-button>
            </a-space>
          </a-card>
        </div>
      </div>
    </a-card>
  </a-layout>
</template>

<script setup lang="ts">
import { onMounted, computed, h, ref } from 'vue'
import { useRouter, useRoute, useRuntimeConfig } from '#imports'
import { useCart } from '../../../../packages/shared-ui/src/composables/useCart'
import { useAuth } from '../../../../packages/shared-ui/src/composables/useAuth'
import { message, Modal } from 'ant-design-vue'
import { DeleteOutlined } from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()
const config = useRuntimeConfig()
const apiBase = config.public?.apiBase || 'http://localhost:4000'
const { user, isLoggedIn, token } = useAuth()
const { cart, loading, items, itemCount, totalPrice, fetchCart, removeFromCart, clearCart } = useCart()
const checkingOut = ref(false)

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
  { title: 'Course', dataIndex: 'titleSnapshot', key: 'title' },
  { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
  { title: 'Price', key: 'price', customRender: ({ record }: any) => `€${(record.priceSnapshot || 0).toFixed(2)}` },
  {
    title: 'Action',
    key: 'action',
    customRender: ({ record }: any) => h('a', {
      onClick: () => handleRemoveItem(record),
      style: 'color: #f5222d; cursor: pointer;'
    }, [h(DeleteOutlined), ' Remove'])
  }
]

const total = computed(() => totalPrice.value || 0)

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

async function goCheckout() {
  if (items.value.length === 0) {
    message.warning('Your cart is empty')
    return
  }
  if (!isLoggedIn.value || !user.value?.id) {
    message.warning('Please log in to checkout')
    router.push('/login')
    return
  }

  checkingOut.value = true
  try {
    const successUrl = `${window.location.origin}/checkout/success`
    const cancelUrl = `${window.location.origin}/cart`
    const payload = {
      query: `mutation($items:[EcCartItemInput!]!,$successUrl:String!,$cancelUrl:String!){
        createCheckout(items:$items, successUrl:$successUrl, cancelUrl:$cancelUrl){ url orderId }
      }`,
      variables: {
        items: items.value.map(it => ({ courseId: it.courseId, quantity: it.quantity || 1 })),
        successUrl,
        cancelUrl,
      }
    }
    const res = await fetch(`${apiBase}/api/ecommerce/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token.value ? { Authorization: `Bearer ${token.value}` } : {})
      },
      body: JSON.stringify(payload)
    })
    const json = await res.json()
    if (json.errors?.length) throw new Error(json.errors[0].message)
    const url = json?.data?.createCheckout?.url
    if (url) {
      window.location.href = url
    } else {
      message.error('Checkout link unavailable. Try again.')
    }
  } catch (e:any) {
    const msg = e?.message || 'Failed to start checkout'
    if (msg.includes('Already enrolled')) {
      message.info('You already own one of these courses.')
    } else {
      message.error(msg)
    }
  } finally {
    checkingOut.value = false
  }
}
</script>

<style scoped>
.empty-cart {
  text-align: center;
  color: #94a3b8;
  padding: 24px 0;
}
</style>
