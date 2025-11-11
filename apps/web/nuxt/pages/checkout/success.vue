<template>
  <div style="max-width:600px;margin:40px auto;text-align:center">
    <h2>Payment successful 🎉</h2>
    <p>Your enrollment is being finalized. You can find your course in “My Learning”.</p>
    <a-button type="primary" @click="$router.push('/profile')">Go to Profile</a-button>
  </div>
</template>
<script setup lang="ts">
<script setup lang="ts">
import { useQuery, useMutation, gql } from '@apollo/client/core'
import { computed } from 'vue'

const ME_QUERY = gql`
  query Me {
    me { id email roles displayName }
  }
`

const { loading: meLoading, error: meError, data: meData, refetch: refetchMe } = useQuery(ME_QUERY)
const me = computed(() => meData?.me || null)
</script>

import { onMounted } from 'vue'
onMounted(()=> {
  try { (void 0 /* was localStorage.setItem('byway:cart', '[]') */) } catch {}
})
</script>
