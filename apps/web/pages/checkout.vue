<template>
  <a-row :gutter="[16,16]">
    <a-col :xs="24" :lg="16">
      <a-card title="Checkout">
        <a-alert type="info" message="Have a coupon?" style="margin-bottom:12px" />
        <a-form layout="vertical" @finish="submit">
          <a-form-item label="Name" name="name" :rules="[{ required:true }]"><a-input v-model:value="form.name" /></a-form-item>
          <a-form-item label="Email" name="email" :rules="[{ required:true, type:'email' }]"><a-input v-model:value="form.email" type="email" /></a-form-item>
          <a-form-item label="Payment method" name="method"><a-select v-model:value="form.method" :options="[{label:'Card',value:'card'},{label:'PayPal',value:'paypal'}]" /></a-form-item>
          <a-button type="primary" html-type="submit" :loading="loading">Place order</a-button>
        </a-form>
      </a-card>
    </a-col>
    <a-col :xs="24" :lg="8">
      <a-card title="Order summary">
        <a-space style="margin-bottom:8px">
          <a-input v-model:value="coupon" placeholder="Coupon code" style="width:200px" />
          <a-button @click="applyCoupon">Apply</a-button>
        </a-space>
        <div v-for="it in items" :key="it.id" style="display:flex;justify-content:space-between;margin-bottom:6px">
          <span>{{ it.title }} × {{ it.qty }}</span><span>€{{ (it.price*it.qty).toFixed(2) }}</span>
        </div>
        <a-divider />
        <div style="display:flex;justify-content:space-between"><span>Subtotal</span><span>{{ formattedTotal }}</span></div>
        <div v-if="discount>0" style="display:flex;justify-content:space-between"><span>Discount</span><span>-€{{ discount.toFixed(2) }}</span></div>
        <a-divider />
        <a-typography-title :level="3" style="margin:0">{{ grandFmt }}</a-typography-title>
      </a-card>
    </a-col>
  </a-row>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useCart } from '~/composables/useCart'
import { useSdk } from '~/composables/useSdk'
const { items, total, formattedTotal, clear } = useCart()
const coupon = ref('')
const discount = ref(0)
const grand = computed(()=> Math.max(0, total.value - discount.value))
const grandFmt = computed(()=> new Intl.NumberFormat(undefined,{style:'currency',currency:'EUR'}).format(grand.value))
const sdk = useSdk()
const loading = ref(false)
const form = ref<any>({ name:'', email:'', method:'card' })
async function applyCoupon(){
  if (!coupon.value) return
  const res:any = await $fetch('/plugins/ecommerce/api/coupon', { method:'POST', body:{ code: coupon.value, total: total.value } })
  discount.value = res?.discount || 0
}
async function submit(){
  // Validate not already enrolled
  const v:any = await $fetch('/plugins/ecommerce/api/cart/validate', { method:'POST', body:{ items: items.value } })
  if (!v?.ok){
    const msg = 'Remove already-enrolled courses: ' + (v.conflicts||[]).join(', ')
    if (window?.$message){ window.$message.error(msg) }
    alert(msg)
    return
  }
  loading.value = true
  try{
    const payload = { items: items.value, total: grand.value, customer:{ name: form.value.name, email: form.value.email }, method: form.value.method, coupon: coupon.value, discount: discount.value }
    const res:any = await sdk.placeOrder(payload)
    if (res?.ok){
      await sdk.enroll({ items: items.value })
      clear()
      window.location.href = '/checkout/success'
    }
  }finally{ loading.value = false }
}
</script>
