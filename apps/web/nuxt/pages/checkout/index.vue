<template>
  <div class="checkout-redirect">
    <h2>Redirecting to checkout…</h2>
    <p>If nothing happens, <a @click.prevent="goCart" href="/cart">open your cart</a> to finish payment.</p>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from '#imports'
import { onMounted } from 'vue'

const router = useRouter()
function goCart() {
  router.replace('/cart')
}

onMounted(goCart)
</script>

<style scoped>
.checkout-redirect {
  max-width: 640px;
  margin: 48px auto;
  text-align: center;
}
a { color: #1677ff; }
</style>
