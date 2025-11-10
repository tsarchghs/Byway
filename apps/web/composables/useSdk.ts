// composables/useSdk.ts
import { useUser } from '~/composables/useUser'
const DEFAULTS = {
  catalog: '/plugins/students-internal/api/catalog',
  course: (id:string)=> `/plugins/students-internal/api/course/${id}`,
  enroll: '/plugins/ecommerce/api/enroll',
  cart: '/plugins/ecommerce/api/cart',
  order: '/plugins/ecommerce/api/order',
  auth: { login: '/plugins/authentication/api/login', register: '/plugins/authentication/api/register', me: '/plugins/authentication/api/me' }
}
function authHeaders(){
  const { token } = useUser()
  const t = token.value
  return t ? { Authorization: `Bearer ${t}` } : {}
}
export function useSdk(){
  async function listCourses(params: any = {}){ return await $fetch(DEFAULTS.catalog, { params, headers: authHeaders(), credentials: 'include' }) }
  async function getCourse(id: string){ return await $fetch(DEFAULTS.course(id), { headers: authHeaders(), credentials: 'include' }) }
  async function addToCart(payload: any){ return await $fetch(DEFAULTS.cart, { method:'POST', body: payload, headers: authHeaders(), credentials: 'include' }) }
  async function placeOrder(payload: any){ return await $fetch(DEFAULTS.order, { method:'POST', body: payload, headers: authHeaders(), credentials: 'include' }) }
  async function enroll(payload: any){ return await $fetch(DEFAULTS.enroll, { method:'POST', body: payload, headers: authHeaders(), credentials: 'include' }) }
  async function login(email:string, password:string){ return await $fetch(DEFAULTS.auth.login, { method:'POST', body:{ email, password }, credentials:'include' }) }
  async function register(input:any){ return await $fetch(DEFAULTS.auth.register, { method:'POST', body: input, credentials:'include' }) }
  async function me(){ return await $fetch(DEFAULTS.auth.me, { headers: authHeaders(), credentials: 'include' }) }
  return { listCourses, getCourse, addToCart, placeOrder, enroll, login, register, me }
}
