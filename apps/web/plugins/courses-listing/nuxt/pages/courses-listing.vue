<template>
  <Header/>

  <div class="catalogue">
    <!-- ===== Header / Toolbar ===== -->
    <div class="catalogue-header">
      <a-typography-title :level="2" class="catalogue-title">All Courses</a-typography-title>

      <a-space :size="[12, 8]" wrap class="catalogue-controls">
        <a-button :icon="h(FilterOutlined)" @click="openFilters = true">Filter</a-button>

        <a-input-search
          v-model:value="q"
          placeholder="Search courses…"
          allow-clear
          style="width: 260px"
          @search="page = 1"
        />

        <a-select v-model:value="sortBy" style="width: 180px">
          <a-select-option value="popular">Popularity</a-select-option>
          <a-select-option value="rating">Rating</a-select-option>
          <a-select-option value="priceAsc">Price: Low → High</a-select-option>
          <a-select-option value="priceDesc">Price: High → Low</a-select-option>
          <a-select-option value="hoursAsc">Duration: Short → Long</a-select-option>
          <a-select-option value="hoursDesc">Duration: Long → Short</a-select-option>
        </a-select>

        <a-segmented
          v-model:value="viewMode"
          :options="[
            { label: 'Grid', value: 'grid', icon: h(AppstoreOutlined) },
            { label: 'List', value: 'list', icon: h(UnorderedListOutlined) }
          ]"
        />

        <!-- Plugin mount: add extra controls -->
        <slot name="toolbar-right" :filters="{ q, sortBy, viewMode }" />
      </a-space>
    </div>

    <!-- ===== Body ===== -->
    <div class="catalogue-body">
      <!-- Filters (desktop) -->
      <a-col :xs="0" :lg="6">
        <a-affix :offset-top="80">
          <a-card title="Filters" class="filters">
            <FiltersPanel
              v-model:minRating="minRating"
              v-model:durationRange="durationRange"
              v-model:levels="levels"
              v-model:languages="languages"
              @reset="resetFilters"
            />
          </a-card>
        </a-affix>
      </a-col>

      <!-- Results -->
      <a-col :xs="24" :lg="18">
        <!-- Grid -->
        <template v-if="viewMode === 'grid'">
          <a-row :gutter="[16,16]" class="product-grid">
            <a-col v-for="c in paged" :key="c.id" :xs="24" :sm="12" :md="8" :lg="8" :xl="6">
              <a-card hoverable class="product-card" @click="goCourse(c.id)">
                <template #cover>
                  <a-image :src="c.image" :alt="c.title" class="product-image" :preview="false" />
                </template>

                <a-card-meta :title="c.title" :description="`By ${c.author}`" />
                <div class="product-content">
                  <div class="rating">
                    <a-rate :value="c.rating" allow-half disabled style="font-size: 14px" />
                    <span class="rating-count">({{ c.ratingsCount.toLocaleString() }})</span>
                  </div>
                  <div class="product-meta">{{ c.hours }}h · {{ c.lectures }} lectures · {{ c.level }}</div>
                  <div class="card-footer">
                    <a-typography-text strong class="product-price">{{ euro(c.price) }}</a-typography-text>
                    <a-button 
                      type="link" 
                      size="small" 
                      @click.stop="addToCart(c)"
                      :loading="cartLoading"
                      :disabled="isInCart(c.id)"
                    >
                      {{ isInCart(c.id) ? 'In Cart' : 'Add to cart' }}
                    </a-button>
                  </div>
                </div>
                <!-- Plugin mount: inject ribbons/badges -->
                <slot name="card-extra" :course="c" />
              </a-card>
            </a-col>
          </a-row>
        </template>

        <!-- List -->
        <template v-else>
          <a-list
            item-layout="vertical"
            :data-source="paged"
            :renderItem="renderListItem"
            :split="true"
          />
        </template>

        <div class="pagination">
          <a-pagination
            v-model:current="page"
            :pageSize="pageSize"
            :total="filtered.length"
            show-less-items
          />
        </div>
      </a-col>
    </div>

    <!-- ===== Filters Drawer (mobile) ===== -->
    <a-drawer v-model:open="openFilters" title="Filter Courses" placement="left" :width="320">
      <FiltersPanel
        v-model:minRating="minRating"
        v-model:durationRange="durationRange"
        v-model:levels="levels"
        v-model:languages="languages"
        @reset="resetFilters"
      />
    </a-drawer>
  </div>
</template>

<script setup lang="tsx">
import FiltersPanel from '../components/FiltersPanel.vue'
import { h, ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import Header from '../../../../packages/shared-ui/src/components/Header.vue'
import { message } from 'ant-design-vue'
import {
  FilterOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons-vue'
import { useCart } from '../../../../packages/shared-ui/src/composables/useCart'

type Level = 'Beginner' | 'Intermediate' | 'Advanced'
type Course = {
  id: string
  title: string
  author: string
  rating: number
  ratingsCount: number
  hours: number
  lectures: number
  level: Level
  price: number
  image: string
  language: 'English' | 'Spanish' | 'Italian' | 'German'
}

/** ---------- Mock data ---------- */
const all = ref<Course[]>([
  { id: '1', title: 'Beginner’s Guide to Design', author: 'Ronald Richards', rating: 4.7, ratingsCount: 1200, hours: 22, lectures: 155, level: 'Beginner', price: 149.9, image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=800&auto=format&fit=crop', language: 'English' },
  { id: '2', title: 'Advanced Interaction Patterns', author: 'Ronald Richards', rating: 4.8, ratingsCount: 980, hours: 18, lectures: 120, level: 'Intermediate', price: 179.0, image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop', language: 'German' },
  { id: '3', title: 'Design Systems in Practice', author: 'Ronald Richards', rating: 4.6, ratingsCount: 1400, hours: 30, lectures: 180, level: 'Advanced', price: 199.0, image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop', language: 'Italian' },
  { id: '4', title: 'Practical Usability Testing', author: 'Ronald Richards', rating: 4.5, ratingsCount: 700, hours: 14, lectures: 88, level: 'Intermediate', price: 139.0, image: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=800&auto=format&fit=crop', language: 'Spanish' },
  { id: '5', title: 'Wireframing to Prototyping', author: 'Ronald Richards', rating: 4.4, ratingsCount: 560, hours: 10, lectures: 75, level: 'Beginner', price: 119.0, image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop', language: 'English' },
  { id: '6', title: 'Information Architecture Basics', author: 'Ronald Richards', rating: 4.2, ratingsCount: 350, hours: 12, lectures: 80, level: 'Beginner', price: 109.0, image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop', language: 'German' },
  { id: '7', title: 'Interaction Design Fundamentals', author: 'Ronald Richards', rating: 4.9, ratingsCount: 2200, hours: 26, lectures: 160, level: 'Intermediate', price: 189.0, image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop', language: 'English' },
  { id: '8', title: 'UX Research Field Guide', author: 'Ronald Richards', rating: 4.1, ratingsCount: 260, hours: 8, lectures: 60, level: 'Beginner', price: 89.0, image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop', language: 'Italian' },
  { id: '9', title: 'Mobile UX Patterns', author: 'Ronald Richards', rating: 4.3, ratingsCount: 410, hours: 16, lectures: 90, level: 'Intermediate', price: 149.0, image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop', language: 'Spanish' },
  { id: '10', title: 'Accessibility for Designers', author: 'Ronald Richards', rating: 4.6, ratingsCount: 860, hours: 12, lectures: 70, level: 'Beginner', price: 129.0, image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=800&auto=format&fit=crop', language: 'English' },
])

/** ---------- Toolbar state ---------- */
const q = ref('')
const sortBy = ref<'popular'|'rating'|'priceAsc'|'priceDesc'|'hoursAsc'|'hoursDesc'>('popular')
const viewMode = ref<'grid' | 'list'>('grid')

/** ---------- Filters state ---------- */
const openFilters = ref(false)
const minRating = ref<0|2|3|4>(0)
const durationRange = ref<[number, number]>([0, 30]) // hours
const levels = ref<Level[]>([])
const languages = ref<Array<Course['language']>>([])

function resetFilters() {
  minRating.value = 0
  durationRange.value = [0, 30]
  levels.value = []
  languages.value = []
}

/** ---------- Filtering / sorting / paging ---------- */
const filtered = computed(() => {
  const term = q.value.trim().toLowerCase()
  let list = all.value.filter(c => {
    const matchesQ = !term || c.title.toLowerCase().includes(term) || c.author.toLowerCase().includes(term)
    const matchesRating = c.rating >= (minRating.value || 0)
    const matchesDuration = c.hours >= durationRange.value[0] && c.hours <= durationRange.value[1]
    const matchesLevel = !levels.value.length || levels.value.includes(c.level)
    const matchesLang = !languages.value.length || languages.value.includes(c.language)
    return matchesQ && matchesRating && matchesDuration && matchesLevel && matchesLang
  })

  switch (sortBy.value) {
    case 'rating': list.sort((a,b) => b.rating - a.rating || b.ratingsCount - a.ratingsCount); break
    case 'priceAsc': list.sort((a,b) => a.price - b.price); break
    case 'priceDesc': list.sort((a,b) => b.price - a.price); break
    case 'hoursAsc': list.sort((a,b) => a.hours - b.hours); break
    case 'hoursDesc': list.sort((a,b) => b.hours - a.hours); break
    default: // popular
      list.sort((a,b) => b.ratingsCount - a.ratingsCount || b.rating - a.rating)
  }
  return list
})

const page = ref(1)
const pageSize = 12
const paged = computed(() => filtered.value.slice((page.value - 1) * pageSize, page.value * pageSize))

/** ---------- Cart Integration ---------- */
const router = useRouter()
const { addToCart: addToCartComposable, isInCart: isInCartComposable, loading: cartLoading } = useCart()

/** ---------- Actions ---------- */
function euro(v: number) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(v)
}

async function addToCart(c: Course) {
  try {
    await addToCartComposable(c.id, 1)
    message.success(`Added "${c.title}" to cart`)
  } catch (e: any) {
    if (e?.message?.includes('authenticated')) {
      message.warning('Please log in to add courses to your cart')
      router.push('/login')
    } else if (e?.message?.includes('Already enrolled')) {
      message.info(`You're already enrolled in "${c.title}"`)
    } else {
      message.error(e?.message || 'Failed to add course to cart')
    }
  }
}

function isInCart(courseId: string): boolean {
  return isInCartComposable(courseId)
}

function goCourse(id: string) {
  router.push(`/courses/${id}`)
}

/** ---------- List renderer ---------- */
function renderListItem(item: Course) {
  return h(
    'div',
    { class: 'list-item' },
    [
      h('div', { class: 'list-thumb-wrap', onClick: () => goCourse(item.id) }, [
        h('img', { class: 'list-thumb', src: item.image, alt: item.title })
      ]),
      h('div', { class: 'list-main' }, [
        h('div', { class: 'list-title' }, item.title),
        h('div', { class: 'list-author' }, `By ${item.author}`),
        h('div', { class: 'list-row' }, [
          h('span', { class: 'list-rating' }, [
            h('span', { class: 'rating-number' }, item.rating.toFixed(1)),
            h('span', { class: 'rating-stars' }, [
              h('span', null, ' '),
            ])
          ]),
          h('span', null, `• ${item.ratingsCount.toLocaleString()} ratings`),
          h('span', null, `• ${item.hours}h • ${item.lectures} lectures • ${item.level}`)
        ]),
        h('div', { class: 'list-price' }, euro(item.price)),
        h('div', { class: 'list-actions' }, [
          h('button', { 
            class: ['add-link', isInCart(item.id) && 'in-cart'], 
            onClick: () => addToCart(item),
            disabled: cartLoading.value || isInCart(item.id)
          }, [
            h(ShoppingCartOutlined),
            ' ',
            isInCart(item.id) ? 'In Cart' : 'Add to cart'
          ])
        ])
      ])
    ]
  )
}
</script>

<!-- Reusable filters panel -->

<style scoped>
.catalogue { max-width: 1200px; margin: 0 auto; padding: 24px; }
.catalogue-header { display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap; }
.catalogue-title { margin: 0; }
.catalogue-controls { margin-left:auto; }
.catalogue-body { display:flex; gap:24px; }
.product-card :deep(.ant-card-meta-title){ white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.product-image { height: 160px; object-fit: cover; }
.product-content { display:flex; flex-direction:column; gap:6px; padding-top:8px; }
.rating { display:flex; align-items:center; gap:6px; }
.rating-count { color: rgba(0,0,0,.45); font-size:12px; }
.product-meta { color: rgba(0,0,0,.45); font-size:13px; }
.card-footer { display:flex; justify-content:space-between; align-items:center; }
.product-price { color:#1677ff; }

/* List view */
.list-item { display:grid; grid-template-columns: 160px 1fr; gap:16px; padding:12px 0; }
.list-thumb { width:160px; height:100px; object-fit:cover; border-radius:8px; }
.list-title { font-weight:600; font-size:16px; }
.list-author, .list-row { color: rgba(0,0,0,.65); font-size:13px; margin-top:2px; }
.list-price { color:#1677ff; font-weight:600; margin-top:6px; }
.add-link { background:none; border:none; color:#1677ff; cursor:pointer; padding:0; }
.add-link:hover:not(:disabled) { opacity:0.8; }
.add-link:disabled, .add-link.in-cart { color:#52c41a; cursor:default; }
.pagination { display:flex; justify-content:center; margin-top:16px; }

/* Desktop filter card width */
.filters { width: 260px; }

/* Responsive */
@media (max-width: 1024px){
  .catalogue-body { flex-direction:column; }
  .list-item { grid-template-columns: 120px 1fr; }
  .list-thumb { width:120px; height:84px; }
}
</style>
