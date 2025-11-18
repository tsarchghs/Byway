<template>
  <Header />
  <a-config-provider :theme="{ algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm }">
    <a-layout :class="['course-listing', isDark ? 'is-dark' : '']">
      <a-page-header
        class="header"
        title="Browse Courses"
        :sub-title="`${filtered.length} result${filtered.length===1?'':'s'}`"
      >
        <template #extra>
          <a-space>
            <a-tooltip :title="isDark ? 'Switch to light' : 'Switch to dark'">
              <a-button shape="circle" @click="toggleDark"><BulbOutlined /></a-button>
            </a-tooltip>
            <a-button v-if="itemCount>0" type="primary" ghost @click="goCart">
              Cart ({{ itemCount }})
            </a-button>
            <a-button shape="circle" @click="reload" :loading="loading" title="Refresh">
              <svg viewBox="0 0 24 24" width="1em" height="1em"><path fill="currentColor" d="M12 6V3L8 7l4 4V8a4 4 0 1 1-4 4H6a6 6 0 1 0 6-6z"/></svg>
            </a-button>
          </a-space>
        </template>
      </a-page-header>

      <!-- FILTER BAR -->
      <div class="filters">
        <a-row :gutter="[12,12]" align="middle">
          <a-col :xs="24" :md="10" :lg="12">
            <a-input-search v-model:value="q" placeholder="Search by title, category…" allow-clear @search="noop"/>
          </a-col>

          <a-col :xs="12" :md="6" :lg="4">
            <a-select v-model:value="category" allow-clear placeholder="Category" style="width:100%">
              <a-select-option v-for="c in categories" :key="c" :value="c">{{ c }}</a-select-option>
            </a-select>
          </a-col>

          <a-col :xs="12" :md="4" :lg="4">
            <a-select v-model:value="difficulty" allow-clear placeholder="Difficulty" style="width:100%">
              <a-select-option v-for="d in difficulties" :key="d" :value="d">{{ d }}</a-select-option>
            </a-select>
          </a-col>

          <a-col :xs="24" :md="4" :lg="4" class="right-controls">
            <a-segmented
              v-model:value="viewMode"
              :options="[{label:'Grid', value:'grid'},{label:'List', value:'list'}]"
              size="small"
            />
          </a-col>
        </a-row>

        <div class="chips">
          <a-checkbox v-model:checked="onlyFree">Free</a-checkbox>
          <a-checkbox v-model:checked="onlyDiscounted">Discounted</a-checkbox>
          <a-checkbox v-model:checked="onlyPurchased">Purchased</a-checkbox>

          <a-select v-model:value="sort" size="small" style="min-width:180px;margin-left:auto">
            <a-select-option value="popular">Most popular</a-select-option>
            <a-select-option value="newest">Newest</a-select-option>
            <a-select-option value="price-asc">Price ↑</a-select-option>
            <a-select-option value="price-desc">Price ↓</a-select-option>
            <a-select-option value="length-desc">Longest</a-select-option>
          </a-select>
        </div>
      </div>

      <!-- RESULTS -->
      <div class="results" v-if="!loading">
        <a-empty v-if="paged.length===0" description="No matching courses." />

        <!-- GRID -->
        <a-row v-else-if="viewMode==='grid'" :gutter="[16,16]">
          <a-col v-for="c in paged" :key="c.id" :xs="24" :sm="12" :md="12" :lg="8" :xl="6">
            <a-card class="course-card" :hoverable="true" :body-style="{padding:'12px'}">
              <div class="cover" :style="cover(c)">
                <div class="badge" v-if="c.discount || isFree(c)">
                  <a-tag v-if="isFree(c)" color="green">Free</a-tag>
                  <a-tag v-else color="red">{{ c.discount }}% off</a-tag>
                </div>
                <a-tag v-if="isPurchased(c)" color="green" class="purchased-tag">Purchased</a-tag>
              </div>

              <div class="meta">
                <div class="title" :title="c.title">{{ c.title }}</div>
                <div class="tags">
                  <a-tag v-if="c.category" color="blue">{{ c.category }}</a-tag>
                  <a-tag v-if="c.difficulty" color="gold">{{ c.difficulty }}</a-tag>
                </div>

                <div class="stats">
                  <span><FieldTimeOutlined /> {{ totalMinutes(c) }} min</span>
                  <span>• {{ totalLessons(c) }} lessons</span>
                </div>

                <div class="price-row">
                  <span class="price" v-if="!isFree(c)">
                    {{ fmt(payablePrice(c)) }}
                    <template v-if="c.discount">
                      <del class="muted small">{{ fmt(c.price) }}</del>
                    </template>
                  </span>
                  <span class="price" v-else>Free</span>
                </div>

                <div class="actions">
                  <a-space>
                    <a-button @click="openCourse(c)">View</a-button>
                    <a-button
                      @click="addCourseToCart(c)"
                      :disabled="isPurchased(c) || isInCart(c.id)"
                      :loading="cartLoading"
                    >
                      <template v-if="isPurchased(c)">Purchased</template>
                      <template v-else-if="isInCart(c.id)">In Cart</template>
                      <template v-else>Add to cart</template>
                    </a-button>
                    <a-button
                      type="primary"
                      @click="isPurchased(c) ? openCourse(c) : checkoutCourse(c)"
                      :loading="purchasingId===c.id"
                    >
                      <template v-if="isPurchased(c)">Continue</template>
                      <template v-else>Buy</template>
                    </a-button>
                  </a-space>
                </div>
              </div>
            </a-card>
          </a-col>
        </a-row>

        <!-- LIST -->
        <div v-else class="list-wrap">
          <a-list :data-source="paged" item-layout="horizontal" bordered>
            <template #renderItem="{ item:c }">
              <a-list-item :key="c.id">
                <a-list-item-meta>
                  <template #avatar>
                    <div class="list-cover" :style="cover(c)"></div>
                  </template>
                  <template #title>
                    <div class="list-title">
                      <span>{{ c.title }}</span>
                      <a-tag v-if="c.category" color="blue" style="margin-left:8px">{{ c.category }}</a-tag>
                      <a-tag v-if="c.difficulty" color="gold">{{ c.difficulty }}</a-tag>
                      <a-tag v-if="isPurchased(c)" color="green">Purchased</a-tag>
                      <a-tag v-else-if="isFree(c)" color="green">Free</a-tag>
                      <a-tag v-else-if="c.discount" color="red">{{ c.discount }}% off</a-tag>
                    </div>
                  </template>
                  <template #description>
                    <div class="list-desc">
                      <span><FieldTimeOutlined /> {{ totalMinutes(c) }} min</span>
                      <span>• {{ totalLessons(c) }} lessons</span>
                    </div>
                  </template>
                </a-list-item-meta>

                <template #actions>
                  <div class="list-actions">
                    <span class="list-price">
                      <template v-if="isFree(c)">Free</template>
                      <template v-else>
                        {{ fmt(payablePrice(c)) }}
                        <del v-if="c.discount" class="muted small" style="margin-left:6px">{{ fmt(c.price) }}</del>
                      </template>
                    </span>
                    <a-space>
                      <a-button @click="openCourse(c)">View</a-button>
                      <a-button
                        @click="addCourseToCart(c)"
                        :disabled="isPurchased(c) || isInCart(c.id)"
                        :loading="cartLoading"
                      >
                        <template v-if="isPurchased(c)">Purchased</template>
                        <template v-else-if="isInCart(c.id)">In Cart</template>
                        <template v-else>Add to cart</template>
                      </a-button>
                      <a-button
                        type="primary"
                        @click="isPurchased(c) ? openCourse(c) : checkoutCourse(c)"
                        :loading="purchasingId===c.id"
                      >
                        <template v-if="isPurchased(c)">Continue</template>
                        <template v-else>Buy</template>
                      </a-button>
                    </a-space>
                  </div>
                </template>
              </a-list-item>
            </template>
          </a-list>
        </div>

        <!-- PAGINATION -->
        <div class="pagi" v-if="filtered.length > pageSize">
          <a-pagination
            v-model:current="page"
            :total="filtered.length"
            :pageSize="pageSize"
            show-size-changer
            :pageSizeOptions="['8','12','16','24','32']"
            @change="onPaginate"
            @showSizeChange="onSizeChange"
          />
        </div>
      </div>

      <!-- SKELETON -->
      <div v-else class="results">
        <a-row :gutter="[16,16]">
          <a-col v-for="i in 8" :key="i" :xs="24" :sm="12" :md="12" :lg="8" :xl="6">
            <a-card :loading="true" :body-style="{padding:'12px'}">
              <div style="height:150px;background:#f0f2f5;border-radius:8px"></div>
            </a-card>
          </a-col>
        </a-row>
      </div>
    </a-layout>
  </a-config-provider>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watchEffect } from 'vue'
import { theme, message } from 'ant-design-vue'
import { BulbOutlined, FieldTimeOutlined } from '@ant-design/icons-vue'
import Header from '../../../../packages/shared-ui/src/components/Header.vue'
import { useRuntimeConfig } from '#imports'
import { useRouter } from '#imports'
import { useAuth } from '../../../../packages/shared-ui/src/composables/useAuth'
import { useCart } from '../../../../packages/shared-ui/src/composables/useCart'

type Lesson = { id: string; duration?: number; preview?: boolean }
type ModuleT = { lessons?: Lesson[] }
type Course = {
  id: string
  title: string
  category?: string
  difficulty?: string
  description?: string
  price: number
  discount?: number
  coverUrl?: string
  modules?: ModuleT[]
  isEnrolled?: boolean
}

const router = useRouter()
const config = useRuntimeConfig()
const apiBase = config.public?.apiBase || 'http://localhost:4000'
const { user, token, isLoggedIn } = useAuth()
const { addToCart, isInCart, fetchCart, loading: cartLoading, itemCount } = useCart()
const studentId = ref<string | null>(null)

/** ------------------------------------
 * Dark toggle (UI preference)
 -------------------------------------*/
const DARK_KEY = 'byway:theme:dark'
const isDark = ref(false)
function toggleDark(){ isDark.value = !isDark.value; /* TODO: replace with mutation via gqlFetch */ console.debug("setItem replaced"); (DARK_KEY, JSON.stringify(isDark.value)) }

/** ------------------------------------
 * Data fetching from GraphQL
 -------------------------------------*/
const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000/api/teach-internal/graphql'

const loading = ref(false)
const courses = ref<Course[]>([])
async function loadCourses() {
  loading.value = true
  try {
    const query = `
      query Courses {
        courses {
          id title category difficulty description price discount coverUrl isEnrolled
          modules { lessons { id duration preview } }
        }
      }`
    const headers: Record<string, string> = { 'content-type': 'application/json' }
    if (token.value) headers.Authorization = `Bearer ${token.value}`
    const res = await fetch(API_URL, {
      method: 'POST',
      credentials: 'include',
      headers,
      body: JSON.stringify({ query }),
    })
    const { data, errors } = await res.json()
    if (errors) throw new Error(errors[0]?.message || 'GraphQL error')
    courses.value = data?.courses || []
  } catch (e:any) {
    console.warn('Falling back to demo seed:', e?.message || e)
    // Fallback demo data if API missing (keeps page usable)
    courses.value = demoSeed
  } finally {
    loading.value = false
  }
}
function reload(){ loadCourses() }

/** Demo fallback (minimal) */
const demoSeed: Course[] = [
  {
    id: 'c1',
    title: 'Advanced Vue 3 Workshop',
    category: 'Programming',
    difficulty: 'Intermediate',
    description: 'Build a production-grade dashboard with Vue 3.',
    price: 69, discount: 20,
    coverUrl: '',
    modules: [{ lessons:[{id:'l1', duration:8},{id:'l2', duration:12}] }]
  },
  {
    id: 'c2',
    title: 'Shopware for Developers',
    category: 'E-commerce',
    difficulty: 'Advanced',
    description: 'Extend Shopware with plugins and headless storefronts.',
    price: 99, discount: 0,
    coverUrl: '',
    modules: [{ lessons:[{id:'l1', duration:20},{id:'l2', duration:15},{id:'l3', duration:30}] }]
  },
  {
    id: 'c3',
    title: 'GraphQL + Prisma Basics',
    category: 'Programming',
    difficulty: 'Beginner',
    description: 'CRUD, resolvers, paging, and auth with Prisma.',
    price: 0, discount: 0,
    coverUrl: '',
    modules: [{ lessons:[{id:'l1', duration:10},{id:'l2', duration:10}] }]
  }
]

/** ------------------------------------
 * Filters, sort, view mode, pagination
 -------------------------------------*/
const q = ref('')
const category = ref<string | undefined>()
const difficulty = ref<string | undefined>()
const onlyFree = ref(false)
const onlyDiscounted = ref(false)
const onlyPurchased = ref(false)
const sort = ref<'popular'|'newest'|'price-asc'|'price-desc'|'length-desc'>('popular')
const viewMode = ref<'grid'|'list'>(loadViewMode())

function loadViewMode(){
  try { return (/* TODO: replace with gqlFetch to proper query */ undefined && ('byway:viewmode') as any) || 'grid' } catch { return 'grid' }
}
function saveViewMode(){
  try { /* TODO: replace with mutation via gqlFetch */ console.debug("setItem replaced"); ('byway:viewmode', viewMode.value) } catch {}
}
watchEffect(saveViewMode)
function noop(){}

/** Derived sets */
const categories = computed(() => Array.from(new Set(courses.value.map(c => c.category).filter(Boolean))) as string[])
const difficulties = computed(() => Array.from(new Set(courses.value.map(c => c.difficulty).filter(Boolean))) as string[])

function isPurchased(c: Course){ return !!c.isEnrolled }

/** Price helpers */
function isFree(c: Course){ return (c.price || 0) <= 0 }
function baseDiscounted(c: Course){ return c.price * (1 - (c.discount || 0)/100) }
function payablePrice(c: Course){ return round2(baseDiscounted(c)) }

/** Metrics */
function totalLessons(c: Course){
  return (c.modules || []).reduce((acc, m) => acc + (m.lessons?.length || 0), 0)
}
function totalMinutes(c: Course){
  return (c.modules || []).flatMap(m => m.lessons || []).reduce((s, l) => s + (l.duration || 0), 0)
}

/** Filtering + sorting */
const filtered = computed(() => {
  const term = q.value.trim().toLowerCase()
  return courses.value.filter(c => {
    if (category.value && c.category !== category.value) return false
    if (difficulty.value && c.difficulty !== difficulty.value) return false
    if (onlyFree.value && !isFree(c)) return false
    if (onlyDiscounted.value && !(c.discount && c.discount > 0)) return false
    if (onlyPurchased.value && !isPurchased(c)) return false

    if (term) {
      const hay = `${c.title} ${c.category||''} ${c.difficulty||''} ${c.description||''}`.toLowerCase()
      if (!hay.includes(term)) return false
    }
    return true
  })
})

const sorted = computed(() => {
  const list = [...filtered.value]
  switch (sort.value) {
    case 'price-asc': list.sort((a,b)=> payablePrice(a)-payablePrice(b)); break
    case 'price-desc': list.sort((a,b)=> payablePrice(b)-payablePrice(a)); break
    case 'length-desc': list.sort((a,b)=> totalMinutes(b)-totalMinutes(a)); break
    case 'newest': list.sort((a,b)=> (b.id||'').localeCompare(a.id||'')); break // replace with createdAt if available
    default: /* popular */ list.sort((a,b)=> totalLessons(b)-totalLessons(a)); break
  }
  return list
})

/** Pagination */
const page = ref(1)
const pageSize = ref(12)
const paged = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return sorted.value.slice(start, start + pageSize.value)
})
function onPaginate(p:number){ page.value = p; scrollTop() }
function onSizeChange(p:number, size:number){ page.value = 1; pageSize.value = size; scrollTop() }
function scrollTop(){ try{ window.scrollTo({ top:0, behavior:'smooth' }) } catch {} }

/** Card helpers */
function cover(c: Course){
  if (c.coverUrl) return { backgroundImage: `url('${c.coverUrl}')` }
  // gradient fallback
  return { backgroundImage: 'linear-gradient(135deg,#1e293b,#0ea5e9)' }
}

/** Actions */
async function addCourseToCart(c: Course){
  if (!isLoggedIn.value || !user.value?.id) {
    message.warning('Please log in to add courses to your cart')
    router.push('/login')
    return
  }
  try {
    await addToCart(c.id, 1)
    message.success(`Added "${c.title}" to cart`)
    await fetchCart()
  } catch (e:any) {
    message.error(e?.message || 'Failed to add to cart')
  }
}

const purchasingId = ref<string | null>(null)
async function checkoutCourse(c: Course){
  if (isPurchased(c)) { openCourse(c); return }
  if (!isLoggedIn.value || !user.value?.id) {
    message.warning('Please log in to purchase courses')
    router.push('/login')
    return
  }
  const sid = await ensureStudentProfile()
  purchasingId.value = c.id
  try {
    const successUrl = `${window.location.origin}/checkout/success`
    const cancelUrl = `${window.location.origin}/categories`
    const res = await fetch(`${apiBase}/api/ecommerce/graphql`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
      },
      body: JSON.stringify({
        query: `
          mutation($items:[EcCartItemInput!]!, $successUrl:String!, $cancelUrl:String!) {
            createCheckout(items:$items, successUrl:$successUrl, cancelUrl:$cancelUrl, studentId:$studentId, email:$email) { url orderId }
          }`,
        variables: {
          items: [{ courseId: c.id, quantity: 1 }],
          successUrl,
          cancelUrl,
          studentId: sid,
          email: (user.value as any)?.email || null,
        },
      }),
    })
    const json = await res.json()
    if (json.errors?.length) throw new Error(json.errors[0].message)
    const url = json?.data?.createCheckout?.url
    if (url) {
      window.location.href = url
    } else {
      // Fallback: ensure item is in cart and take user there
      try {
        await addToCart(c.id, 1)
        await fetchCart()
      } catch (err:any) {
        console.warn('[checkout fallback] addToCart failed', err?.message || err)
      }
      message.warning('Checkout link not available, opening cart instead.')
      router.push('/cart')
    }
  } catch (e:any) {
    const msg = e?.message || 'Unable to start checkout'
    if (msg.includes('Already enrolled')) {
      message.info('You already own this course — opening it instead.')
      openCourse(c)
    } else {
      message.error(msg)
    }
  } finally {
    purchasingId.value = null
  }
}

async function ensureStudentProfile(){
  if (studentId.value) return studentId.value
  const authId = (user.value as any)?.userId || user.value?.id
  if (!authId) throw new Error('Not authenticated')

  const headers: Record<string,string> = { 'content-type':'application/json' }
  if (token.value) headers.Authorization = `Bearer ${token.value}`

  try {
    const res = await fetch(`${apiBase}/api/students-internal/graphql`, {
      method:'POST',
      headers,
      body: JSON.stringify({ query:`query($uid:String!){ studentByUserId(userId:$uid){ id } }`, variables:{ uid: authId } })
    })
    const json = await res.json()
    const sid = json?.data?.studentByUserId?.id
    if (sid) { studentId.value = sid; return sid }
  } catch {}

  const create = await fetch(`${apiBase}/api/students-internal/graphql`, {
    method:'POST',
    headers,
    body: JSON.stringify({ query:`mutation($uid:String!,$name:String){ createStudent(userId:$uid, displayName:$name){ id } }`, variables:{ uid: authId, name: (user.value as any)?.email || 'Student' } })
  })
  const created = await create.json()
  const sid = created?.data?.createStudent?.id
  if (!sid) throw new Error('Student profile not found')
  studentId.value = sid
  return sid
}

function openCourse(c: Course){
  router.push(`/course/${encodeURIComponent(c.id)}`)
}

function goCart(){
  router.push('/cart')
}

/** Utils */
function round2(n:number){ return Math.round(n*100)/100 }
function fmt(n:number){ return n.toLocaleString(undefined, { style:'currency', currency:'EUR' }) }

/** Mount */
onMounted(()=>{
  try{ isDark.value = JSON.parse(/* TODO: replace with gqlFetch to proper query */ undefined && (DARK_KEY) || 'false') } catch {}
  loadCourses()
})


definePageMeta({ layout: 'student' })
</script>

<style scoped>
.course-listing { min-height: 100vh; background:#f6f8fb; }
.is-dark { background:#0b1220; }
.header { background:#fff; padding: 12px 20px; border-bottom:1px solid #eef2f7; }
.is-dark .header { background:#0f172a; border-color:#17233a; color:#cbd5e1; }

.filters { padding: 16px 20px 8px; }
.right-controls { display:flex; justify-content:flex-end; }
.chips { display:flex; gap:12px; align-items:center; margin-top:10px; }

.results { padding: 16px 20px 28px; }

.course-card { border-radius: 12px; overflow:hidden; }
.course-card .cover {
  height: 150px; background-size: cover; background-position:center;
  border-radius: 8px; position: relative; margin-bottom: 10px;
}
.course-card .badge { position:absolute; left:10px; top:10px; display:flex; gap:6px; }
.purchased-tag { position:absolute; right:10px; top:10px; }

.course-card .title {
  font-weight: 700; font-size: 16px; line-height: 1.2; margin-bottom: 6px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
}
.course-card .tags { display:flex; gap:6px; flex-wrap:wrap; margin-bottom: 4px; }
.course-card .stats { color:#64748b; font-size: 12px; margin-bottom: 8px; display:flex; gap:6px; }
.course-card .price-row { display:flex; align-items:center; gap:10px; margin-bottom: 8px; }
.price { font-weight:800; font-size:18px; }
.muted { color:#94a3b8; }
.small { font-size:12px; }
.actions { display:flex; justify-content:space-between; }

.list-wrap :deep(.ant-list-item-meta-avatar) { margin-right: 16px; }
.list-cover { width: 120px; height: 72px; border-radius: 8px; background-size: cover; background-position:center; }
.list-title { display:flex; align-items:center; gap:6px; font-weight:700; }
.list-desc { color:#64748b; display:flex; gap:8px; }
.list-actions { display:flex; align-items:center; gap:12px; }
.list-price { font-weight:700; margin-right:8px; }

.pagi { margin-top: 16px; display:flex; justify-content:center; }

.is-dark .ant-card, .is-dark .results, .is-dark .filters { background:#0b1220; color:#cbd5e1; }
.is-dark .course-card .stats, .is-dark .list-desc { color:#94a3b8; }
</style>
