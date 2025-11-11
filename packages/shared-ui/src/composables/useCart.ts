
import { ref, computed } from 'vue'
import { useAuth } from './useAuth'

type CartItem = { id:string; orderId:string; courseId:string; quantity:number }
type Order = { id:string; status:string; studentId:string; items:CartItem[] }

const cart = ref<Order|null>(null)
const loading = ref(false)
const error = ref<string|null>(null)

async function gql(endpoint: string, query: string, variables?: any) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ query, variables })
  })
  const json = await res.json()
  if (json.errors?.length) throw new Error(json.errors[0].message || 'GraphQL error')
  return json.data
}

async function fetchCart() {
  const { user } = useAuth()
  if (!user.value?.id) {
    cart.value = null
    return
  }
  loading.value = true
  error.value = null
  try {
    const data = await gql('/api/ecommerce/graphql', `
      query ($studentId:String!) {
        cartByStudent(studentId:$studentId) { id status studentId items { id orderId courseId quantity } }
      }
    `, { studentId: user.value.id })
    cart.value = data?.cartByStudent || null
  } catch (e:any) {
    error.value = e?.message || String(e)
  } finally {
    loading.value = false
  }
}

async function addToCart(courseId:string, quantity:number=1) {
  const { user } = useAuth()
  if (!user.value?.id) throw new Error('not authenticated')
  const data = await gql('/api/ecommerce/graphql', `
    mutation ($studentId:String!, $courseId:String!, $quantity:Int) {
      addToCart(studentId:$studentId, courseId:$courseId, quantity:$quantity) { id }
    }
  `, { studentId: user.value.id, courseId, quantity })
  await fetchCart()
  return data?.addToCart?.id
}

async function removeFromCart(orderItemId:string) {
  await gql('/api/ecommerce/graphql', `
    mutation ($orderItemId:String!) { removeFromCart(orderItemId:$orderItemId) { ok } }
  `, { orderItemId })
  await fetchCart()
}

export function useCart() {
  return {
    cart,
    loading,
    error,
    items: computed(() => cart.value?.items || []),
    fetchCart,
    addToCart,
    removeFromCart,
  }
}
