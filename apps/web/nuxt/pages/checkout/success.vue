<template>
  <div class="checkout-success">
    <h2>{{ title }}</h2>
    <p class="subtitle">{{ subtitle }}</p>

    <a-space>
      <a-button type="primary" :loading="starting" :disabled="!startLink" @click="startCourse">
        Start learning
      </a-button>
      <a-button @click="router.push('/students/my-courses')">Go to My Courses</a-button>
      <a-button @click="router.push('/categories')">Browse courses</a-button>
    </a-space>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter, useRuntimeConfig } from '#imports'
import { message } from 'ant-design-vue'
import { useCart } from '../../../../../packages/shared-ui/src/composables/useCart'
import { useAuth } from '../../../../../packages/shared-ui/src/composables/useAuth'

type VerifyState = 'checking' | 'ok' | 'failed'
const state = ref<VerifyState>('checking')
const route = useRoute()
const router = useRouter()
const { clearCart } = useCart()
const { token, user } = useAuth()
const startLink = ref<string | null>(null)
const starting = ref(false)
const verifiedOrderId = ref<string | null>(null)
const config = useRuntimeConfig()
const apiBase = config.public?.apiBase || 'http://localhost:4000'

const title = computed(() => {
  if (state.value === 'ok') return 'Payment successful 🎉'
  if (state.value === 'failed') return 'We could not confirm your payment'
  return 'Finalizing your enrollment…'
})
const subtitle = computed(() => {
  if (state.value === 'ok') return 'You have access to your course. Keep learning!'
  if (state.value === 'failed') return 'If you were charged, refresh in a moment or contact support.'
  return 'We are verifying your payment and enrolling you now.'
})

async function verifyAndClear(sessionId?: string) {
  if (!sessionId) {
    state.value = 'failed'
    return
  }
  try {
    const query = `query ($s: String!) { verifyCheckout(sessionId: $s) { ok orderId status } }`
    const res = await fetch(`${apiBase}/api/ecommerce/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { s: sessionId } }),
    })
    const json = await res.json()
    const ok = json?.data?.verifyCheckout?.ok
    verifiedOrderId.value = json?.data?.verifyCheckout?.orderId || null
    state.value = ok ? 'ok' : 'failed'
    if (ok) {
      try { await clearCart() } catch {}
      await computeStartLink()
    }
  } catch (e:any) {
    state.value = 'failed'
    message.warning(e?.message || 'Unable to verify checkout. We will keep trying.')
  }
}

async function computeStartLink() {
  if (!token.value || !user.value?.id || !verifiedOrderId.value) return
  try {
    const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token.value}` }
    let sid: string | null = null
    const authId = (user.value as any)?.userId || user.value.id
    try {
      const studentRes = await fetch(`${apiBase}/api/students-internal/graphql`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query: `query($uid:String!){ studentByUserId(userId:$uid){ id } }`, variables: { uid: authId } })
      })
      const studentJson = await studentRes.json()
      sid = studentJson?.data?.studentByUserId?.id || null
    } catch {}
    if (!sid) {
      const createRes = await fetch(`${apiBase}/api/students-internal/graphql`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          query: `mutation($uid:String!,$name:String){ createStudent(userId:$uid, displayName:$name){ id } }`,
          variables: { uid: authId, name: user.value.email || user.value.displayName || 'Student' }
        })
      })
      const createJson = await createRes.json()
      sid = createJson?.data?.createStudent?.id || null
    }
    if (!sid) return

    const ordersRes = await fetch(`${apiBase}/api/ecommerce/graphql`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query: `query { myOrders { id items { courseId } } }` })
    })
    const ordersJson = await ordersRes.json()
    const orders = ordersJson?.data?.myOrders || []
    const order = orders.find((o:any)=> o.id === verifiedOrderId.value) || orders[0]
    const courseId = order?.items?.[0]?.courseId
    if (!courseId) return

    const mcRes = await fetch(`${apiBase}/api/students-internal/graphql`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query: `query($sid:String!){ myCourses(studentId:$sid){ courseId course { id modules { id title } } } }`,
        variables: { sid }
      })
    })
    const mcJson = await mcRes.json()
    const entry = (mcJson?.data?.myCourses || []).find((c:any)=> c.courseId === courseId)
    const moduleId = entry?.course?.modules?.[0]?.id
    startLink.value = moduleId
      ? `/student/${encodeURIComponent(sid)}/course/${encodeURIComponent(courseId)}/module/${encodeURIComponent(moduleId)}`
      : `/course/${encodeURIComponent(courseId)}`
  } catch (e) {
    // leave button disabled
  }
}

function startCourse() {
  if (!startLink.value) return
  starting.value = true
  router.push(startLink.value)
}

onMounted(()=> {
  const sid = route.query.session_id as string | undefined
  verifyAndClear(sid)
})
</script>

<style scoped>
.checkout-success {
  max-width: 640px;
  margin: 48px auto;
  text-align: center;
}
.subtitle { margin: 12px 0 24px; color: #667085; }
</style>
