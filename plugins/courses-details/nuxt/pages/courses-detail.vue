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
                    @click="addToCartFn"
                    :loading="adding || cartLoading"
                    :disabled="isInCartCourse"
                  >
                    {{ isInCartCourse ? 'In Cart' : 'Add To Cart' }}
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

        <slot name="tabs-extra" />
      </a-tabs>
    </a-card>

    <!-- Float CTAs -->
    <a-float-button-group shape="square" :style="{ right: '24px' }">
      <a-float-button 
        :icon="h(ShoppingCartOutlined)" 
        tooltip="Add to cart" 
        @click="addToCartFn"
        :disabled="isInCartCourse"
      />
      <a-float-button :icon="h(ThunderboltOutlined)" tooltip="Buy now" @click="buyNow" />
    </a-float-button-group>
  </div>
</template>

<script setup lang="ts">
import { h, ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery, gql } from '@apollo/client/core'
import Header from '../../../../packages/shared-ui/src/components/Header.vue'
import { message, Modal } from 'ant-design-vue'
import {
  ShoppingCartOutlined,
  ThunderboltOutlined,
  HeartOutlined,
  ShareAltOutlined
} from '@ant-design/icons-vue'
import { useCart } from '../../../../packages/shared-ui/src/composables/useCart'
import { useAuth } from '../../../../packages/shared-ui/src/composables/useAuth'

const route = useRoute()
const router = useRouter()
const { user } = useAuth()
const { addToCart, isInCart, loading: cartLoading, fetchCart } = useCart()

// ===== GraphQL Queries =====
const ME_QUERY = gql`query Me { me { id email roles displayName } }`
const COURSE_QUERY = gql`
  query Course($id: String!) {
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

const { data: meData, loading: meLoading } = useQuery(ME_QUERY)
const { data: courseData, loading: courseLoading, refetch: refetchCourse } = useQuery(
  COURSE_QUERY,
  { variables: { id: route.params.id as string } }
)

const me = computed(() => meData?.me || null)
const course = computed(() => courseData?.course || null)
const pending = computed(() => courseLoading.value || meLoading.value)

// ===== Cart State =====
const adding = ref(false)
const isInCartCourse = computed(() => course.value ? isInCart(course.value.id) : false)

// ===== Checkout State =====
const checkingOut = ref(false)

// ===== Wishlist State (placeholder) =====
const inWishlist = ref(false)

// ===== Coupon State =====
const coupon = ref('')
const couponApplied = ref(false)
const validatingCoupon = ref(false)
const discountPct = ref(0)

// ===== UI State =====
const tabKey = ref('details')
const thumb = ref('/course-placeholder.png')

// ===== Course Computed =====
const currentPrice = computed(() => {
  if (!course.value) return 0
  const basePrice = course.value.price || 0
  const discount = discountPct.value > 0 ? (basePrice * discountPct.value) / 100 : 0
  return basePrice - discount
})

const oldPrice = computed(() => course.value?.price || 0)
const showOldPrice = computed(() => discountPct.value > 0)
const discountLabel = computed(() => `-${discountPct.value}%`)

const instructor = reactive({
  name: 'Instructor Name',
  title: 'Course Instructor',
  avatar: '/instructor.png',
  bio: ''
})

const totalLectures = computed(() => {
  if (!course.value?.modules) return 0
  return course.value.modules.reduce((sum: number, mod: any) => sum + (mod.lessons?.length || 0), 0)
})

const totalDuration = computed(() => {
  if (!course.value?.modules) return 0
  return course.value.modules.reduce((sum: number, mod: any) => {
    const lessonSum = mod.lessons?.reduce((s: number, l: any) => s + (l.duration || 0), 0) || 0
    return sum + lessonSum
  }, 0)
})

const totalDurationLabel = computed(() => {
  const hours = Math.floor(totalDuration.value / 60)
  const mins = totalDuration.value % 60
  if (hours > 0) return `${hours}h ${mins}m`
  return `${mins}m`
})

const syllabus = computed(() => {
  if (!course.value?.modules) return []
  return course.value.modules.map((mod: any) => ({
    id: mod.id,
    title: mod.title,
    lessons: mod.lessons?.length || 0,
    items: mod.lessons || [],
    durationLabel: mod.lessons?.reduce((sum: number, l: any) => sum + (l.duration || 0), 0) || 0
  }))
})

// ===== Helper Functions =====
function money(v: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v)
}

// ===== Cart Actions =====
async function handleAddToCart() {
  if (!course.value) {
    message.error('Course not loaded')
    return
  }

  if (!user.value?.id) {
    message.warning('Please log in to add courses to your cart')
    router.push('/login')
    return
  }

  adding.value = true
  try {
    await addToCart(course.value.id, 1)
    message.success(`Added "${course.value.title}" to cart`)
    await fetchCart()
  } catch (e: any) {
    if (e?.message?.includes('authenticated')) {
      message.warning('Please log in to add courses to your cart')
      router.push('/login')
    } else if (e?.message?.includes('Already enrolled')) {
      message.info(`You're already enrolled in "${course.value.title}"`)
    } else {
      message.error(e?.message || 'Failed to add course to cart')
    }
  } finally {
    adding.value = false
  }
}

const addToCartFn = handleAddToCart

// ===== Checkout Actions =====
async function buyNow() {
  if (!course.value) {
    message.error('Course not loaded')
    return
  }

  if (!user.value?.id) {
    message.warning('Please log in to purchase courses')
    router.push('/login')
    return
  }

  checkingOut.value = true
  try {
    // Add to cart first if not already there
    if (!isInCartCourse.value) {
      await addToCart(course.value.id, 1)
    }

    // Redirect to checkout
    router.push('/checkout')
  } catch (e: any) {
    message.error(e?.message || 'Failed to proceed to checkout')
  } finally {
    checkingOut.value = false
  }
}

// ===== Wishlist Actions (placeholder) =====
function toggleWishlist() {
  inWishlist.value = !inWishlist.value
  message.info(inWishlist.value ? 'Added to wishlist' : 'Removed from wishlist')
}

// ===== Coupon Actions =====
async function applyCoupon() {
  if (!course.value || !coupon.value.trim()) {
    message.warning('Please enter a coupon code')
    return
  }

  validatingCoupon.value = true
  try {
    // TODO: Implement coupon validation via GraphQL
    // For now, mock validation
    message.success('Coupon applied!')
    couponApplied.value = true
    discountPct.value = 10 // Mock 10% discount
  } catch (e: any) {
    message.error(e?.message || 'Invalid coupon code')
  } finally {
    validatingCoupon.value = false
  }
}

// ===== Share Actions =====
function share(platform: 'link' | 'x' | 'linkedin') {
  const url = typeof window !== 'undefined' ? window.location.href : ''
  const title = course.value?.title || 'Course'

  if (platform === 'link') {
    navigator.clipboard?.writeText(url)
    message.success('Link copied to clipboard!')
    return
  }

  const shareUrls = {
    x: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
  }

  if (shareUrls[platform]) {
    window.open(shareUrls[platform], '_blank', 'width=600,height=400')
  }
}

// ===== Lifecycle =====
onMounted(async () => {
  if (user.value?.id) {
    await fetchCart()
  }
})

// Watch for route changes
watch(() => route.params.id, (newId) => {
  if (newId) {
    refetchCourse()
  }
}, { immediate: true })

// Watch cart state to update isInCart
watch(() => course.value?.id, async (courseId) => {
  if (courseId && user.value?.id) {
    await fetchCart()
  }
}, { immediate: true })
</script>

<style scoped>
.course-page { padding: 16px; background: #fff; }
.course-hero,
.course-details { max-width: 1200px; margin: 0 auto 24px; }
.subtitle { color: rgba(0,0,0,.65); margin: 0; }
.meta { color: rgba(0,0,0,.65); }
.sidebar-card .thumb { width: 100%; height: 200px; object-fit: cover; border-radius: 6px; }
.instructor-card .muted, .lesson-row { color: rgba(0,0,0,.65); }
.lesson-row { padding: 6px 0; }
@media (max-width: 768px) { .course-page { padding: 8px; } }
</style>
