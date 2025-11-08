<template>
  <Header />

  <div class="course-page">
    <!-- ===== HERO ===== -->
    <a-card class="course-hero" :bordered="true">
      <a-breadcrumb style="margin-bottom: 16px">
        <a-breadcrumb-item>
          <NuxtLink to="/">Home</NuxtLink>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          <NuxtLink to="/categories">Categories</NuxtLink>
        </a-breadcrumb-item>
        <a-breadcrumb-item>{{ course?.title || 'Course' }}</a-breadcrumb-item>
      </a-breadcrumb>

      <a-row :gutter="[24,24]" align="top">
        <!-- LEFT -->
        <a-col :xs="24" :lg="16">
          <a-space direction="vertical" size="small" style="width:100%">
            <a-typography-title :level="1" style="margin:0">
              <a-skeleton :loading="pending" active :title="true" :paragraph="false">
                {{ course?.title || '—' }}
              </a-skeleton>
            </a-typography-title>

            <a-skeleton :loading="pending" active :paragraph="{ rows: 2 }">
              <a-typography-paragraph class="subtitle">
                {{ course?.description || '—' }}
              </a-typography-paragraph>
            </a-skeleton>

            <a-space align="center" wrap class="meta">
              <!-- Simple meta from course + computed lessons -->
              <a-typography-text>
                {{ totalDurationLabel }} ·
                {{ totalLectures }} Lectures ·
                {{ course?.difficulty || 'All levels' }}
              </a-typography-text>
              <a-divider type="vertical" />
              <a-typography-text v-if="course?.category">
                Category: {{ course.category }}
              </a-typography-text>
            </a-space>

            <a-space align="center">
              <a-avatar :size="40" :src="instructor.avatar || '/instructor.png'" />
              <a-typography-text>
                Created by
                <a-typography-text strong>
                  {{ instructor.name }}
                </a-typography-text>
              </a-typography-text>
            </a-space>

            <!-- plugin mount -->
            <slot name="hero-extra" />
          </a-space>
        </a-col>

        <!-- RIGHT: purchase -->
        <a-col :xs="24" :lg="8">
          <a-affix :offset-top="84">
            <a-card hoverable class="sidebar-card" :bodyStyle="{ padding: '16px' }">
              <a-skeleton :loading="pending" active :paragraph="{ rows: 6 }">
                <a-image
                  :src="course?.coverUrl || thumb"
                  alt="Course thumbnail"
                  :preview="true"
                  class="thumb"
                />
                <a-divider style="margin:12px 0" />

                <a-space align="baseline" wrap>
                  <a-typography-title :level="3" style="margin:0">
                    {{ money(currentPrice) }}
                  </a-typography-title>
                  <a-typography-text v-if="showOldPrice" type="secondary" delete>
                    {{ money(oldPrice) }}
                  </a-typography-text>
                  <a-tag v-if="discountPct > 0" color="green">
                    {{ discountLabel }}
                  </a-tag>
                </a-space>

                <a-alert
                  type="success"
                  show-icon
                  message="30-day money-back guarantee"
                  style="margin:12px 0"
                />

                <a-space direction="vertical" style="width:100%">
                  <a-button
                    type="primary"
                    block
                    :icon="h(ShoppingCartOutlined)"
                    @click="addToCart"
                    :loading="adding"
                  >
                    {{ isInCart ? 'In Cart' : 'Add To Cart' }}
                  </a-button>

                  <a-button
                    block
                    :icon="h(ThunderboltOutlined)"
                    @click="buyNow"
                    :loading="checkingOut"
                  >
                    Buy Now
                  </a-button>

                  <a-button
                    block
                    :icon="h(HeartOutlined)"
                    :type="inWishlist ? 'primary' : 'default'"
                    :ghost="!inWishlist"
                    @click="toggleWishlist"
                  >
                    {{ inWishlist ? 'Wishlisted' : 'Add to Wishlist' }}
                  </a-button>
                </a-space>

                <a-divider style="margin:12px 0" />

                <a-input-group compact style="margin-bottom: 8px">
                  <a-input v-model:value="coupon" style="width:65%" placeholder="Coupon code" />
                  <a-button style="width:35%" @click="applyCoupon" :loading="validatingCoupon">
                    Apply
                  </a-button>
                </a-input-group>
                <a-typography-text v-if="couponApplied" type="success">
                  Coupon applied!
                </a-typography-text>

                <a-space style="margin-top: 10px">
                  <a-popover trigger="click">
                    <template #content>
                      <a-space>
                        <a-button type="text" @click="share('link')">Copy link</a-button>
                        <a-button type="text" @click="share('x')">Share on X</a-button>
                        <a-button type="text" @click="share('linkedin')">LinkedIn</a-button>
                      </a-space>
                    </template>
                    <a-button type="link" :icon="h(ShareAltOutlined)">Share</a-button>
                  </a-popover>

                  <!-- plugin mount -->
                  <slot name="cta-extra" />
                </a-space>
              </a-skeleton>
            </a-card>
          </a-affix>
        </a-col>
      </a-row>
    </a-card>

    <!-- ===== DETAILS / SYLLABUS ===== -->
    <a-card class="course-details" :bordered="true">
      <a-tabs v-model:activeKey="tabKey">
        <a-tab-pane key="details" tab="Details">
          <a-typography-title :level="4">Course Description</a-typography-title>
          <a-skeleton :loading="pending" active :paragraph="{ rows: 4 }">
            <a-typography-paragraph>
              {{ course?.description || '—' }}
            </a-typography-paragraph>
          </a-skeleton>

          <a-typography-title :level="4" style="margin-top:16px">
            Course Info
          </a-typography-title>
          <a-descriptions bordered size="small">
            <a-descriptions-item label="Category">
              {{ course?.category || '—' }}
            </a-descriptions-item>
            <a-descriptions-item label="Difficulty">
              {{ course?.difficulty || '—' }}
            </a-descriptions-item>
            <a-descriptions-item label="Lectures">
              {{ totalLectures }}
            </a-descriptions-item>
            <a-descriptions-item label="Total duration">
              {{ totalDurationLabel }}
            </a-descriptions-item>
          </a-descriptions>
        </a-tab-pane>

        <a-tab-pane key="instructor" tab="Instructor">
          <a-card bordered class="instructor-card">
            <a-space align="start">
              <a-avatar :size="90" :src="instructor.avatar || '/instructor.png'" />
              <div>
                <a-typography-title :level="5" style="margin:0;color:#1677ff">
                  {{ instructor.name }}
                </a-typography-title>
                <div class="muted">
                  {{ instructor.title }}
                </div>
              </div>
            </a-space>
            <a-typography-paragraph style="margin-top:12px" v-if="instructor.bio">
              {{ instructor.bio }}
            </a-typography-paragraph>
            <a-typography-paragraph v-else class="muted" style="margin-top:12px">
              Instructor profile will be available soon.
            </a-typography-paragraph>
          </a-card>
        </a-tab-pane>

        <a-tab-pane key="syllabus" tab="Syllabus">
          <a-collapse accordion v-if="syllabus.length">
            <a-collapse-panel
              v-for="sec in syllabus"
              :key="sec.id"
              :header="sec.title"
              :extra="h('span', { class: 'muted' }, `${sec.lessons} Lessons · ${sec.durationLabel}`)"
            >
              <a-list
                size="small"
                :data-source="sec.items"
                :renderItem="(lesson) =>
                  h(
                    'div',
                    { class: 'lesson-row' },
                    `${lesson.title || 'Lesson'} · ${lesson.duration || '0'} min`
                  )"
              />
            </a-collapse-panel>
          </a-collapse>
          <a-empty v-else />
        </a-tab-pane>

        <!-- plugin mount -->
        <slot name="tabs-extra" />
      </a-tabs>
    </a-card>

    <!-- Float CTAs (mobile helpful) -->
    <a-float-button-group shape="square" :style="{ right: '24px' }">
      <a-float-button
        :icon="h(ShoppingCartOutlined)"
        tooltip="Add to cart"
        @click="addToCart"
      />
      <a-float-button
        :icon="h(ThunderboltOutlined)"
        tooltip="Buy now"
        @click="buyNow"
      />
    </a-float-button-group>
  </div>
</template>

<script setup lang="ts">

import { h, ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Header from '../../../../packages/shared-ui/src/components/Header.vue'
import { message, Modal } from 'ant-design-vue'
import {
  ShoppingCartOutlined,
  ThunderboltOutlined,
  HeartOutlined,
  ShareAltOutlined
} from '@ant-design/icons-vue'
import { useCart } from '@shared/composables/useCart' // ✅ NEW

// ===== ROUTE =====
const route = useRoute()
const router = useRouter()
const courseId = computed(() => String(route.params.course_id || ''))

// ===== REAL ENDPOINTS =====
const COURSES_API = 'http://localhost:4000/api/courses-details/graphql'
const STUDENTS_API = 'http://localhost:4000/api/students-internal/graphql'

// ===== UI STATE =====
const pending = ref(true)
const adding = ref(false)
const checkingOut = ref(false)
const validatingCoupon = ref(false)
const inWishlist = ref(false)
const thumb = '/course-thumb.jpg'
const tabKey = ref<'details' | 'instructor' | 'syllabus'>('details')

// ===== DATA MODELS =====
interface Lesson {
  id: string
  title?: string
  duration?: string
}
interface Module {
  id: string
  title?: string
  lessons?: Lesson[]
}
interface Course {
  id: string
  title: string
  description?: string
  category?: string
  difficulty?: string
  price: number
  discount?: number
  coverUrl?: string
  teacherId?: string
  modules?: Module[]
}
interface InstructorInfo {
  name: string
  avatar?: string
  title: string
  bio?: string
}

const course = ref<Course | null>(null)

// simple placeholder instructor until we have teacher API
const instructor = reactive<InstructorInfo>({
  name: 'Instructor',
  title: 'Course Instructor'
})

// ===== SHARED CART =====
const cart = useCart() // ✅ uses same cart as Header

const isInCart = computed(() =>
  !!cart.items.value.find(i => i.id === (course.value?.id || courseId.value))
)

// ===== PRICING =====
const currentPrice = computed(() => course.value?.price ?? 0)
const discountPct = computed(() => course.value?.discount ?? 0)
const oldPrice = computed(() => {
  if (!course.value) return 0
  if (!discountPct.value) return course.value.price
  const factor = 1 - discountPct.value / 100
  if (!factor) return course.value.price
  return Math.round((course.value.price / factor) * 100) / 100
})
const showOldPrice = computed(
  () => !!discountPct.value && oldPrice.value > currentPrice.value
)
const discountLabel = computed(() => `${discountPct.value}% Off`)

function money(v: number) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
  }).format(v)
}

// ===== SYLLABUS / DURATION =====
const flatLessons = computed<Lesson[]>(() =>
  course.value?.modules?.flatMap(m => m.lessons || []) ?? []
)

const totalLectures = computed(() => flatLessons.value.length)

const totalMinutes = computed(() =>
  flatLessons.value.reduce((sum, l) => {
    const n = parseInt(l.duration || '0', 10)
    return sum + (isNaN(n) ? 0 : n)
  }, 0)
)

const totalDurationLabel = computed(() => {
  if (!totalMinutes.value) return '0 min'
  if (totalMinutes.value < 60) return `${totalMinutes.value} min`
  const hrs = totalMinutes.value / 60
  return `${hrs.toFixed(1)} total hours`
})

interface SyllabusSection {
  id: string
  title: string
  lessons: number
  durationLabel: string
  items: Lesson[]
}

const syllabus = computed<SyllabusSection[]>(() => {
  const mods = course.value?.modules || []
  return mods.map(m => {
    const items = m.lessons || []
    const minutes = items.reduce((sum, l) => {
      const n = parseInt(l.duration || '0', 10)
      return sum + (isNaN(n) ? 0 : n)
    }, 0)
    const durationLabel = minutes
      ? minutes < 60
        ? `${minutes} min`
        : `${(minutes / 60).toFixed(1)} hours`
      : '0 min'

    return {
      id: m.id,
      title: m.title || 'Untitled module',
      lessons: items.length,
      durationLabel,
      items
    }
  })
})

// ===== LOCAL CART (we'll replace with shared cart later) =====
const CART_KEY = 'byway:cart'
const cartItems = ref<{ id: string; title: string; price: number; image?: string }[]>(
  []
)

function loadCart() {
  try {
    cartItems.value = JSON.parse(localStorage.getItem(CART_KEY) || '[]')
  } catch {
    cartItems.value = []
  }
}
function saveCart() {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems.value))
  } catch {
    // ignore
  }
}


// ✅ UPDATED: addToCart uses shared cart instead of localStorage
function addToCart() {
  if (!course.value) return
  if (isInCart.value) return message.info('Already in cart')
  adding.value = true
  try {
    cart.addItem({
      id: course.value.id,
      title: course.value.title,
      price: currentPrice.value,
      image: course.value.coverUrl
    })
    message.success(`Added to cart at ${money(currentPrice.value)}`)
  } finally {
    adding.value = false
  }
}
// ===== SHARE =====
function share(kind: 'link' | 'x' | 'linkedin') {
  const url = typeof window !== 'undefined' ? window.location.href : ''
  if (kind === 'link') {
    navigator.clipboard?.writeText(url)
    message.success('Link copied')
  } else {
    message.info(`Open share dialog: ${kind.toUpperCase()}`)
  }
}

// ===== GRAPHQL HELPER =====
async function gfetch<T>(
  endpoint: string,
  query: string,
  variables?: Record<string, any>
): Promise<T> {
  const res = await $fetch<{ data?: T; errors?: any[] }>(endpoint, {
    method: 'POST',
    body: { query, variables }
  })
  if ((res as any)?.errors?.length) {
    throw new Error((res as any).errors[0]?.message || 'GraphQL error')
  }
  return (res as any).data as T
}

// ===== REAL BACKEND QUERIES =====
const GQL_COURSE = `
  query getCourse($id: String!) {
    course(id: $id) {
      id
      title
      description
      category
      difficulty
      price
      discount
      coverUrl
      teacherId
      modules {
        id
        title
        lessons {
          id
          title
          duration
        }
      }
    }
  }
`

const GQL_VALIDATE = `
  query v($courseId: String!, $code: String!) {
    validateCoupon(courseId: $courseId, code: $code) { percent }
  }
`

const GQL_ENROLL = `
  mutation enroll($courseId: String!) {
    enrollMe(courseId: $courseId) { id }
  }
`

// ===== COUPON LOGIC =====
const coupon = ref('')
const couponApplied = ref(false)
const couponPercent = ref<number | null>(null)

async function applyCoupon() {
  const code = coupon.value.trim().toUpperCase()
  if (!code || !course.value) return
  validatingCoupon.value = true
  try {
    const data = await gfetch<{ validateCoupon: { percent: number } }>(
      COURSES_API,
      GQL_VALIDATE,
      { courseId: course.value.id, code }
    )
    const pct = data?.validateCoupon?.percent ?? 0
    if (pct > 0) {
      const old = oldPrice.value || course.value.price
      const discounted =
        Math.max(0, Math.round(old * (1 - pct / 100) * 100)) / 100
      course.value.price = discounted
      couponPercent.value = pct
      couponApplied.value = true
      message.success(`Coupon applied: ${pct}% off`)
    } else {
      couponApplied.value = false
      message.error('Invalid coupon code')
    }
  } catch (e: any) {
    message.error(e?.message || 'Coupon validation failed')
  } finally {
    validatingCoupon.value = false
  }
}

// ===== ENROLLMENT / BUY NOW =====
function buyNow() {
  if (!course.value) return
  Modal.confirm({
    title: 'Proceed to checkout?',
    content: `Enroll in "${course.value.title}" for ${money(currentPrice.value)}?`,
    okText: 'Checkout',
    onOk: enrollNow
  })
}

async function enrollNow() {
  if (!course.value) return
  checkingOut.value = true
  try {
    await gfetch<{ enrollMe: { id: string } }>(STUDENTS_API, GQL_ENROLL, {
      courseId: course.value.id
    })
    message.success('Enrollment successful — redirecting...')
    router.push(`/course/${encodeURIComponent(course.value.id)}`)
  } catch (e: any) {
    message.error(e?.message || 'Enrollment failed')
  } finally {
    checkingOut.value = false
  }
}

// ===== LOAD =====
onMounted(async () => {
  loadCart()
  try {
    const data = await gfetch<{ course: Course }>(COURSES_API, GQL_COURSE, {
      id: courseId.value
    })
    course.value = data.course
  } catch (e: any) {
    message.error(e?.message || 'Failed to load course')
  } finally {
    pending.value = false
  }
})

// ===== SEO =====
useSeoMeta({
  title: () =>
    course.value?.title ? `${course.value.title} · Byway` : 'Course · Byway',
  description: () => course.value?.description || 'Learn on Byway',
  ogTitle: () => course.value?.title || 'Byway Course',
  ogDescription: () => course.value?.description || 'Learn on Byway',
  ogImage: () => course.value?.coverUrl || thumb
})
</script>

<style scoped>
.course-page { padding: 16px; background: #fff; }
.course-hero,
.course-details { max-width: 1200px; margin: 0 auto 24px; }
.subtitle { color: rgba(0,0,0,.65); margin: 0; }
.meta { color: rgba(0,0,0,.65); }
.sidebar-card .thumb {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 6px;
}

/* Instructor / Syllabus */
.instructor-card .muted,
.lesson-row { color: rgba(0,0,0,.65); }
.lesson-row { padding: 6px 0; }

@media (max-width: 768px) {
  .course-page { padding: 8px; }
}
</style>
