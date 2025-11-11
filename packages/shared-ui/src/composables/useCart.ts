// Replaced localStorage with GraphQL calls (ECOM GQL v10)
import { ref, computed } from 'vue'
import { useGql } from './useGql'

type OrderItem = { id: string; orderId: string; courseId: string; quantity: number }
type Payment = { id: string; status: string; amount: number }
type Cart = { id: string; studentId: string; status: string; items: OrderItem[]; payments: Payment[] }

const state = {
  studentId: ref<string>(''),
  cart: ref<Cart | null>(null),
  loading: ref(false),
  error: ref<string | null>(null),
}

const CART_QUERY = `query ($studentId:String!){
  cartByStudent(studentId:$studentId){
    id studentId status
    items{ id orderId courseId quantity }
    payments{ id status amount }
  }
}`

const ADD_ITEM = `mutation($studentId:String!, $courseId:String!, $quantity:Int){
  addCartItem(studentId:$studentId, courseId:$courseId, quantity:$quantity){
    id orderId courseId quantity
  }
}`

const REMOVE_ITEM = `mutation($studentId:String!, $orderItemId:String!){
  removeCartItem(studentId:$studentId, orderItemId:$orderItemId){ ok }
}`

const CLEAR = `mutation($studentId:String!){
  clearCart(studentId:$studentId){ ok }
}`

export function useCart() {
  const gql = useGql('/api/ecommerce/graphql')

  async function ensure(studentId: string) {
    if (!studentId) throw new Error('studentId required')
    state.studentId.value = studentId
    return await fetchCart(studentId)
  }

  async function fetchCart(studentId?: string) {
    try {
      state.loading.value = true
      const sid = studentId || state.studentId.value
      if (!sid) throw new Error('studentId required')
      const data = await gql(CART_QUERY, { studentId: sid })
      state.cart.value = (data && data.cartByStudent) || { id: '', studentId: sid, status: 'PENDING', items: [], payments: [] }
      state.error.value = null
      return state.cart.value
    } catch (e:any) {
      state.error.value = e?.message || String(e)
      throw e
    } finally {
      state.loading.value = false
    }
  }

  async function add(courseId: string, quantity = 1) {
    const sid = state.studentId.value
    if (!sid) throw new Error('studentId not set — call ensure(studentId) first')
    await gql(ADD_ITEM, { studentId: sid, courseId, quantity })
    return await fetchCart(sid)
  }

  async function remove(orderItemId: string) {
    const sid = state.studentId.value
    if (!sid) throw new Error('studentId not set — call ensure(studentId) first')
    await gql(REMOVE_ITEM, { studentId: sid, orderItemId })
    return await fetchCart(sid)
  }

  async function clear() {
    const sid = state.studentId.value
    if (!sid) throw new Error('studentId not set — call ensure(studentId) first')
    await gql(CLEAR, { studentId: sid })
    return await fetchCart(sid)
  }

  const count = computed(() => (state.cart.value?.items?.reduce((s,i)=>s + (i.quantity||0), 0) || 0))

  return {
    loading: state.loading,
    error: state.error,
    cart: state.cart,
    count,
    ensure,
    fetchCart,
    add,
    remove,
    clear,
  }
}
