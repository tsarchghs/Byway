<template>
  <Header />

  <div class="course-page">
    <!-- ===== HERO ===== -->
    <a-card class="course-hero" :bordered="true">
      <a-breadcrumb style="margin-bottom: 16px">
        <a-breadcrumb-item>Home</a-breadcrumb-item>
        <a-breadcrumb-item>Categories</a-breadcrumb-item>
        <a-breadcrumb-item>Introduction to User Experience Design</a-breadcrumb-item>
      </a-breadcrumb>

      <a-row :gutter="[24,24]" align="top">
        <!-- LEFT -->
        <a-col :xs="24" :lg="16">
          <a-space direction="vertical" size="small" style="width:100%">
            <a-typography-title :level="1" style="margin:0">Introduction to User Experience Design</a-typography-title>
            <a-typography-paragraph class="subtitle">
              This course is meticulously crafted to provide you with a foundational understanding of the principles,
              methodologies, and tools that drive exceptional user experiences in the digital landscape.
            </a-typography-paragraph>

            <a-space align="center" wrap class="meta">
              <a-rate :value="4.8" allow-half disabled />
              <a-typography-text>4.8 (22,000 ratings)</a-typography-text>
              <a-divider type="vertical" />
              <a-typography-text>22 Total Hours · 155 Lectures · All levels</a-typography-text>
            </a-space>

            <a-space align="center">
              <a-avatar :size="40" src="/instructor.jpg" />
              <a-typography-text>Created by <a-typography-text strong>Ronald Richards</a-typography-text></a-typography-text>
            </a-space>

            <a-space align="center">
              <GlobalOutlined />
              <a-typography-text>English, Spanish, Italian, German</a-typography-text>
            </a-space>

            <!-- plugin mount -->
            <slot name="hero-extra" />
          </a-space>
        </a-col>

        <!-- RIGHT: purchase -->
        <a-col :xs="24" :lg="8">
          <a-affix :offset-top="84">
            <a-card hoverable class="sidebar-card" :bodyStyle="{padding:'16px'}">
              <a-image :src="thumb" alt="Course thumbnail" :preview="true" class="thumb" />
              <a-divider style="margin:12px 0" />

              <a-space align="baseline" wrap>
                <a-typography-title :level="3" style="margin:0">{{ formattedPrice }}</a-typography-title>
                <a-typography-text type="secondary" delete>{{ formattedOldPrice }}</a-typography-text>
                <a-tag color="green">{{ discountLabel }}</a-tag>
              </a-space>

              <a-alert type="success" show-icon message="30-day money-back guarantee" style="margin:12px 0" />

              <a-space direction="vertical" style="width:100%">
                <a-button type="primary" block :icon="h(ShoppingCartOutlined)" @click="addToCart">Add To Cart</a-button>
                <a-button block :icon="h(ThunderboltOutlined)" @click="buyNow">Buy Now</a-button>
                <a-button block :icon="h(HeartOutlined)" :type="inWishlist ? 'primary' : 'default'"
                          :ghost="!inWishlist" @click="toggleWishlist">
                  {{ inWishlist ? 'Wishlisted' : 'Add to Wishlist' }}
                </a-button>
              </a-space>

              <a-divider style="margin:12px 0" />

              <a-input-group compact style="margin-bottom: 8px">
                <a-input v-model:value="coupon" style="width:65%" placeholder="Coupon code" />
                <a-button style="width:35%" @click="applyCoupon">Apply</a-button>
              </a-input-group>
              <a-typography-text v-if="couponApplied" type="success">Coupon applied!</a-typography-text>

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
            </a-card>
          </a-affix>
        </a-col>
      </a-row>
    </a-card>

    <!-- ===== DETAILS ===== -->
    <a-card class="course-details" :bordered="true">
      <a-tabs v-model:activeKey="tabKey">
        <a-tab-pane key="details" tab="Details">
          <a-typography-title :level="4">Course Description</a-typography-title>
          <a-typography-paragraph>
            This interactive e-learning course introduces you to User Experience (UX) design.
            Gain a solid foundation in UX principles and apply them through interactive exercises.
          </a-typography-paragraph>

          <a-typography-title :level="4">Certification</a-typography-title>
          <a-typography-paragraph>
            Upon successful completion, you’ll receive a certification that validates your expertise and opens new opportunities.
          </a-typography-paragraph>
        </a-tab-pane>

        <a-tab-pane key="instructor" tab="Instructor">
          <a-card bordered class="instructor-card">
            <a-space align="start">
              <a-avatar :size="90" src="/instructor.png" />
              <div>
                <a-typography-title :level="5" style="margin:0;color:#1677ff">Ronald Richards</a-typography-title>
                <div class="muted">UI/UX Designer</div>
                <a-space size="small" wrap class="muted" style="margin-top:6px">
                  <span>⭐ 40,445 Reviews</span>
                  <span>🎓 500 Students</span>
                  <span>📘 15 Courses</span>
                </a-space>
              </div>
            </a-space>
            <a-typography-paragraph style="margin-top:12px">
              With over a decade of experience, Ronald brings a wealth of knowledge and has designed
              user-centric interfaces for renowned tech companies.
            </a-typography-paragraph>
          </a-card>
        </a-tab-pane>

        <a-tab-pane key="syllabus" tab="Syllabus">
          <a-collapse accordion>
            <a-collapse-panel
              v-for="(item, idx) in syllabus"
              :key="idx"
              :header="item.title"
              :extra="h('span', { class: 'muted' }, `${item.lessons} Lessons · ${item.duration}`)"
            >
              <a-list
                size="small"
                :data-source="Array.from({length: item.lessons}).map((_,i)=>`Lesson ${i+1}`)"
                :renderItem="(t)=> h('div', { class:'lesson-row' }, t)"
              />
            </a-collapse-panel>
          </a-collapse>
        </a-tab-pane>

        <a-tab-pane key="reviews" tab="Reviews">
          <a-list
            item-layout="horizontal"
            :data-source="visibleReviews"
            :renderItem="renderReview"
          />
          <div style="text-align:center;margin-top:8px">
            <a-button v-if="visibleReviews.length < reviews.length" @click="loadMoreReviews">
              Load More Reviews
            </a-button>
          </div>
        </a-tab-pane>

        <!-- plugin mount -->
        <slot name="tabs-extra" />
      </a-tabs>
    </a-card>

    <!-- Float CTAs (mobile helpful) -->
    <a-float-button-group shape="square" :style="{ right: '24px' }">
      <a-float-button :icon="h(ShoppingCartOutlined)" tooltip="Add to cart" @click="addToCart" />
      <a-float-button :icon="h(ThunderboltOutlined)" tooltip="Buy now" @click="buyNow" />
    </a-float-button-group>
  </div>
</template>

<script setup lang="ts">
import { h, ref, reactive, computed } from 'vue'
import Header from '../../../../packages/shared-ui/src/components/Header.vue'
import { message, Modal } from 'ant-design-vue'
import {
  ShoppingCartOutlined,
  ThunderboltOutlined,
  HeartOutlined,
  ShareAltOutlined,
  GlobalOutlined
} from '@ant-design/icons-vue'

type SyllabusItem = { title: string; lessons: number; duration: string }
type Review = { name: string; avatar: string; rating: number; date: string; comment: string }

const thumb = '/course-thumb.jpg'

// ----- Pricing / coupon -----
const basePrice = ref(99.5)
const discountPct = ref(50) // 0..100
const coupon = ref('')
const couponApplied = ref(false)

const currentPrice = computed(() => +(basePrice.value * (1 - discountPct.value / 100)).toFixed(2))
const formattedPrice = computed(() => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(currentPrice.value))
const formattedOldPrice = computed(() => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(basePrice.value))
const discountLabel = computed(() => `${discountPct.value}% Off`)

function applyCoupon() {
  const code = coupon.value.trim().toUpperCase()
  if (!code) return
  if (code === 'UX50') {
    discountPct.value = 50
    couponApplied.value = true
    message.success('Coupon UX50 applied: 50% off')
  } else if (code === 'NEW25') {
    discountPct.value = 25
    couponApplied.value = true
    message.success('Coupon NEW25 applied: 25% off')
  } else {
    couponApplied.value = false
    message.error('Invalid coupon code')
  }
}

// ----- Wishlist / cart -----
const inWishlist = ref(false)
function toggleWishlist() {
  inWishlist.value = !inWishlist.value
  message.success(inWishlist.value ? 'Added to wishlist' : 'Removed from wishlist')
}
function addToCart() {
  message.success(`Added to cart at ${formattedPrice.value}`)
}
function buyNow() {
  Modal.confirm({
    title: 'Proceed to checkout?',
    content: `You are about to purchase this course for ${formattedPrice.value}.`,
    okText: 'Checkout',
    onOk: () => message.success('Redirecting to checkout...')
  })
}

// ----- Share -----
function share(kind: 'link' | 'x' | 'linkedin') {
  const url = window.location.href
  if (kind === 'link') {
    navigator.clipboard?.writeText(url)
    message.success('Link copied')
  } else {
    message.info(`Open share dialog: ${kind.toUpperCase()}`)
  }
}

// ----- Tabs / syllabus / reviews -----
const tabKey = ref<'details'|'instructor'|'syllabus'|'reviews'>('details')

const syllabus = reactive<SyllabusItem[]>([
  { title: 'Introduction to UX Design', lessons: 5, duration: '1 hour' },
  { title: 'User Research Fundamentals', lessons: 4, duration: '45 min' },
  { title: 'Prototyping Essentials', lessons: 6, duration: '1.5 hours' },
  { title: 'Usability Testing', lessons: 5, duration: '1 hour' }
])

const reviews = reactive<Review[]>([
  { name: 'Mark Doe',  avatar: '/user1.png', rating: 5, date: '22 Mar 2024', comment: 'Amazing course! The instructor made complex UX ideas simple and practical.' },
  { name: 'Jane Smith', avatar: '/user2.png', rating: 5, date: '05 Apr 2024', comment: 'Loved it! Great structure and useful hands-on exercises for beginners.' }
])
const shown = ref(2)
const visibleReviews = computed(() => reviews.slice(0, shown.value))
function loadMoreReviews() { shown.value = Math.min(shown.value + 3, reviews.length) }

function renderReview(item: Review) {
  return h(
    'div',
    { class: 'review' },
    [
      h('div', { class: 'review-header' }, [
        h('img', { class: 'review-avatar', src: item.avatar, alt: 'User' }),
        h('div', { class: 'review-info' }, [
          h('h5', null, item.name),
          h('div', { class: 'rating' }, [
            h('span', null, `⭐ ${item.rating}`),
            h('small', { style: 'margin-left:8px' }, item.date)
          ])
        ])
      ]),
      h('p', { class: 'review-text' }, item.comment)
    ]
  )
}
</script>

<style scoped>
.course-page { padding: 16px; background: #fff; }
.course-hero, .course-details { max-width: 1200px; margin: 0 auto 24px; }
.subtitle { color: rgba(0,0,0,.65); margin: 0; }
.meta { color: rgba(0,0,0,.65); }
.sidebar-card .thumb { width: 100%; height: 200px; object-fit: cover; border-radius: 6px; }

/* Instructor / Reviews minor polish (reusing your classes so your CSS keeps working) */
.instructor-card .muted, .rating, .review-text { color: rgba(0,0,0,.65); }
.review { border: 1px solid #f0f0f0; border-radius: 10px; padding: 16px; transition: .2s; }
.review:hover { background: #f0faff; border-color: #91caff; }
.review-header { display:flex; gap:12px; align-items:center; margin-bottom:6px; }
.review-avatar { width:48px; height:48px; border-radius:50%; object-fit:cover; }
.lesson-row { padding:6px 0; }
@media (max-width: 768px) { .course-page { padding: 8px; } }
</style>
