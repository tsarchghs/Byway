
import { ref, computed, watch } from 'vue'
import { useAuth } from './useAuth'

type CartItem = { id: string; orderId: string; courseId: string; quantity: number }
type Order = { id: string; status: string; studentId: string; items: CartItem[] }

const cart = ref<Order | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

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
  loading.value = true
  error.value = null
  try {
    const data = await gql('/api/ecommerce/graphql', `
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
          }
          updatedAt
          createdAt
        }
      }
    `, { studentId: user.value.id })
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

  loading.value = true
  error.value = null
  try {
    const data = await gql('/api/ecommerce/graphql', `
      mutation ($studentId: String!, $courseId: String!, $quantity: Int) {
        addCartItem(studentId: $studentId, courseId: $courseId, quantity: $quantity) {
          id
          orderId
          courseId
          quantity
        }
      }
    `, { studentId: user.value.id, courseId, quantity })
    
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

  loading.value = true
  error.value = null
  try {
    await gql('/api/ecommerce/graphql', `
      mutation ($studentId: String!, $orderItemId: String!) {
        removeCartItem(studentId: $studentId, orderItemId: $orderItemId) {
          ok
        }
      }
    `, { studentId: user.value.id, orderItemId })
    
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

  loading.value = true
  error.value = null
  try {
    await gql('/api/ecommerce/graphql', `
      mutation ($studentId: String!) {
        clearCart(studentId: $studentId) {
          ok
        }
      }
    `, { studentId: user.value.id })
    
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
  // TODO: Fetch course prices and calculate total
  // For now, return 0 or placeholder
  return 0
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
