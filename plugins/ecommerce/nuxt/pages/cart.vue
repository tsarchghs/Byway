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
              <a-button @click="clearCart" :loading="loading">Clear</a-button>
              <a-button type="primary" @click="goCheckout" :disabled="!rows.length">Checkout</a-button>
            </a-space>
          </a-card>
        </div>
      </div>
    </a-card>
  </a-layout>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter, useRoute } from '#imports'
import { useCart } from 'shared-ui/src/composables/useCart'
import { message } from 'ant-design-vue'

const router = useRouter()
const route = useRoute()
const studentId = (route.query.studentId as string) || 'demo-student'
const { ensure, cart, loading, add, remove, clear } = useCart()

onMounted(async () => {
  try {
    await ensure(studentId)
  } catch (e:any) {
    message.error(e?.message || 'Failed to load cart')
  }
})

const rows = computed(() => cart.value?.items || [])
const cols = [
  { title: 'Course', dataIndex: 'courseId' },
  { title: 'Qty', dataIndex: 'quantity' },
  {
    title: 'Action',
    key: 'action',
    customRender: ({ record }: any) => h('a', { onClick: () => removeItem(record.id) }, 'Remove')
  }
]

const total = computed(() => (cart.value?.items || []).reduce((s,i)=> s + 10 * (i.quantity||0), 0).toFixed(2))

async function removeItem(id: string) {
  try {
    await remove(id)
    message.success('Removed')
  } catch (e:any) {
    message.error(e?.message || 'Remove failed')
  }
}

async function clearCart() {
  try {
    await clear()
    message.success('Cleared')
  } catch (e:any) {
    message.error(e?.message || 'Clear failed')
  }
}

function goCheckout() {
  router.push('/checkout')
}
</script>
