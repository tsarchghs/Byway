<template>
  <div style="max-width:600px;margin:40px auto;text-align:center">
    <h2>Payment successful 🎉</h2>
    <p>Your enrollment is being finalized. You can find your course in “My Learning”.</p>
    <a-button type="primary" @click="$router.push('/profile')">Go to Profile</a-button>
  </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

async function verifyAndClear(sessionId: string | string[] | undefined) {
  if (!sessionId || Array.isArray(sessionId)) return
  try {
    const query = `query ($s: String!) { verifyCheckout(sessionId: $s) { ok orderId status } }`
    const res = await fetch('/api/ecommerce/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { s: sessionId } }),
    })
    if (!res.ok) return
    const json = await res.json()
    const ok = json?.data?.verifyCheckout?.ok
    if (ok) {
      // backend verified payment & enrollment processing. clear local cart.
      try { /* TODO: replace with mutation via gqlFetch */ console.debug("setItem replaced"); ('byway:cart', '[]') } catch {}
    }
  } catch (e) {
    // ignore — we don't want to block the UX
    // console.warn('[ecommerce] verify error', e)
  }
}

const route = useRoute()
onMounted(()=> {
  const sid = route.query.session_id as unknown as string | undefined
  verifyAndClear(sid)
})
</script>
