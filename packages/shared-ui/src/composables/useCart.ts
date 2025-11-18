
import { ref, computed, watch } from 'vue'
import { useAuth } from './useAuth'

type CartItem = { id: string; orderId: string; courseId: string; quantity: number; titleSnapshot?: string; priceSnapshot?: number }
type Order = { id: string; status: string; studentId: string; items: CartItem[] }

const cart = ref<Order | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const studentIdCache = ref<string | null>(null)

function apiBase(): string {
  // Prefer Nuxt runtime config if available
  if (typeof window !== 'undefined') {
    const cfg = (window as any)?.__NUXT__?.config?.public
    if (cfg?.apiBase) return cfg.apiBase as string
  }
  return process.env.API_BASE || 'http://localhost:4000'
}

/**
 * Get auth headers for API calls
 */
function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== 'undefined' ? window.localStorage?.getItem('token') : null
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  return headers
}

async function resolveStudentId(user: any): Promise<string | null> {
  if (!user?.id) return null
  if (studentIdCache.value) return studentIdCache.value
  const headers = getAuthHeaders()
  const authId = user.userId || user.id
  // Try lookup
  try {
    const res = await fetch(`${apiBase()}/api/students-internal/graphql`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query: `query($uid:String!){ studentByUserId(userId:$uid){ id } }`, variables: { uid: authId } })
    })
    const json = await res.json()
    const sid = json?.data?.studentByUserId?.id || null
    if (sid) { studentIdCache.value = sid; return sid }
  } catch {}
  // Try create
  try {
    const res = await fetch(`${apiBase()}/api/students-internal/api/ensure-student`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ userId: authId, displayName: user.email || user.displayName || 'Student' })
    })
    const json = await res.json()
    const sid = json?.data?.id || null
    if (sid) { studentIdCache.value = sid; return sid }
  } catch {}
  return null
}

function ecommerceEndpoint() {
  return `${apiBase()}/api/ecommerce/graphql`
}

/**
 * GraphQL helper
 */
async function gql(endpoint: string, query: string, variables?: any) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify({ query, variables })
  })
  const json = await res.json()
  if (json.errors?.length) throw new Error(json.errors[0].message || 'GraphQL error')
  return json.data
}

/**
 * Fetch cart for current user
 */
async function fetchCart() {
  const { user } = useAuth()
  if (!user.value?.id) {
    cart.value = null
    return
  }
  const sid = await resolveStudentId(user.value)
  if (!sid) { cart.value = null; return }
  loading.value = true
  error.value = null
  try {
    const data = await gql(ecommerceEndpoint(), `
      query ($studentId: String!) {
        cartByStudent(studentId: $studentId) {
          id
          status
          studentId
          items {
            id
            orderId
            courseId
            quantity
            titleSnapshot
            priceSnapshot
          }
          updatedAt
          createdAt
        }
      }
    `, { studentId: sid })
    cart.value = data?.cartByStudent || null
  } catch (e: any) {
    error.value = e?.message || String(e)
    console.warn('[useCart] Failed to fetch cart:', e)
  } finally {
    loading.value = false
  }
}

/**
 * Add item to cart
 */
async function addToCart(courseId: string, quantity: number = 1) {
  const { user } = useAuth()
  if (!user.value?.id) throw new Error('Not authenticated. Please log in to add items to cart.')
  const sid = await resolveStudentId(user.value)
  if (!sid) throw new Error('Student profile missing')

  loading.value = true
  error.value = null
  try {
    const data = await gql(ecommerceEndpoint(), `
      mutation ($studentId: String!, $courseId: String!, $quantity: Int) {
        addCartItem(studentId: $studentId, courseId: $courseId, quantity: $quantity) {
          id
          orderId
          courseId
          quantity
        }
      }
    `, { studentId: sid, courseId, quantity })
    
    // Refresh cart to get updated state
    await fetchCart()
    return data?.addCartItem?.id
  } catch (e: any) {
    error.value = e?.message || String(e)
    throw e
  } finally {
    loading.value = false
  }
}

/**
 * Remove item from cart
 */
async function removeFromCart(orderItemId: string) {
  const { user } = useAuth()
  if (!user.value?.id) throw new Error('Not authenticated')
  const sid = await resolveStudentId(user.value)
  if (!sid) throw new Error('Student profile missing')

  loading.value = true
  error.value = null
  try {
    await gql(ecommerceEndpoint(), `
      mutation ($studentId: String!, $orderItemId: String!) {
        removeCartItem(studentId: $studentId, orderItemId: $orderItemId) {
          ok
        }
      }
    `, { studentId: sid, orderItemId })
    
    // Refresh cart
    await fetchCart()
  } catch (e: any) {
    error.value = e?.message || String(e)
    throw e
  } finally {
    loading.value = false
  }
}

/**
 * Clear entire cart
 */
async function clearCart() {
  const { user } = useAuth()
  if (!user.value?.id) throw new Error('Not authenticated')
  const sid = await resolveStudentId(user.value)
  if (!sid) throw new Error('Student profile missing')

  loading.value = true
  error.value = null
  try {
    await gql(ecommerceEndpoint(), `
      mutation ($studentId: String!) {
        clearCart(studentId: $studentId) {
          ok
        }
      }
    `, { studentId: sid })
    
    // Refresh cart
    await fetchCart()
  } catch (e: any) {
    error.value = e?.message || String(e)
    throw e
  } finally {
    loading.value = false
  }
}

/**
 * Check if course is in cart
 */
function isInCart(courseId: string): boolean {
  if (!cart.value?.items) return false
  return cart.value.items.some(item => item.courseId === courseId)
}

/**
 * Get cart item count
 */
const itemCount = computed(() => {
  if (!cart.value?.items) return 0
  return cart.value.items.reduce((sum, item) => sum + (item.quantity || 1), 0)
})

/**
 * Get total price (requires course prices - placeholder)
 */
const totalPrice = computed(() => {
  if (!cart.value?.items) return 0
  return cart.value.items.reduce((sum, item) => {
    const price = Number((item as any).priceSnapshot || 0)
    const qty = Number(item.quantity || 1)
    return sum + price * qty
  }, 0)
})

/**
 * Cart composable
 */
export function useCart() {
  const { user, isLoggedIn } = useAuth()

  // Auto-fetch cart when user logs in
  watch(isLoggedIn, (loggedIn) => {
    if (loggedIn && user.value?.id) {
      fetchCart()
    } else {
      cart.value = null
    }
  }, { immediate: true })

  return {
    cart,
    loading,
    error,
    items: computed(() => cart.value?.items || []),
    itemCount,
    totalPrice,
    isEmpty: computed(() => !cart.value?.items || cart.value.items.length === 0),
    fetchCart,
    addToCart,
    removeFromCart,
    clearCart,
    isInCart,
  }
}
