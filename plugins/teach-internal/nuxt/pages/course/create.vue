<!-- src/pages/admin/CourseCreate.vue -->
<template>
  <a-config-provider :theme="{ algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm }">
    <a-layout class="admin-wrap" :class="isDark ? 'is-dark' : ''">
      <!-- HEADER -->
      <a-page-header
        class="admin-header"
        title="Create Course"
        sub-title="Step 1 • Basic details"
        @back="goBack"
      >
        <template #extra>
          <a-space>
            <a-tooltip title="Toggle dark">
              <a-button shape="circle" @click="toggleDark">
                <BulbOutlined />
              </a-button>
            </a-tooltip>
          </a-space>
        </template>
      </a-page-header>

      <!-- CONTENT -->
      <a-layout-content class="content">
        <a-row :gutter="16">
          <!-- LEFT -->
          <a-col :md="16" :xs="24">
            <a-card title="Course details" :loading="loading">
              <a-form ref="formRef" layout="vertical" :model="form" :rules="rules">
                <a-form-item label="Title" name="title">
                  <a-input v-model:value="form.title" placeholder="e.g. Advanced Vue 3 Workshop" />
                </a-form-item>

                <a-form-item label="Category" name="category">
                  <a-input v-model:value="form.category" placeholder="e.g. Programming" />
                </a-form-item>

                <a-form-item label="Difficulty" name="difficulty">
                  <a-select v-model:value="form.difficulty" :options="diffOptions" />
                </a-form-item>

                <a-form-item label="Description" name="description">
                  <a-textarea
                    v-model:value="form.description"
                    :rows="5"
                    placeholder="What will students learn?"
                  />
                </a-form-item>

                <a-row :gutter="16">
                  <a-col :span="12">
                    <a-form-item label="Price (EUR)" name="price">
                      <a-input-number v-model:value="form.price" :min="0" style="width:100%" />
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="Discount (%)" name="discount">
                      <a-input-number
                        v-model:value="form.discount"
                        :min="0"
                        :max="100"
                        style="width:100%"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>

                <a-form-item label="Cover URL (optional)" name="coverUrl">
                  <a-input v-model:value="form.coverUrl" placeholder="https://…" />
                </a-form-item>

                <a-alert
                  type="info"
                  show-icon
                  :message="`Preview price: ${fmt(payable)}`"
                  class="mb-2"
                />

                <a-space>
                  <a-button @click="goBack">Cancel</a-button>
                  <a-button type="primary" :loading="creating" @click="submit">
                    <SaveOutlined /> Create & Open Editor
                  </a-button>
                </a-space>
              </a-form>
            </a-card>
          </a-col>

          <!-- RIGHT PREVIEW -->
          <a-col :md="8" :xs="24">
            <a-card title="Live preview">
              <div class="preview">
                <div
                  class="cover"
                  :style="{
                    backgroundImage: form.coverUrl
                      ? `url('${form.coverUrl}')`
                      : 'linear-gradient(135deg,#111,#334155)',
                  }"
                />
                <div class="meta">
                  <div class="title">{{ form.title || 'Untitled course' }}</div>
                  <div class="tags">
                    <a-tag v-if="form.category" color="blue">{{ form.category }}</a-tag>
                    <a-tag v-if="form.difficulty" color="gold">{{ form.difficulty }}</a-tag>
                  </div>
                  <div class="price">{{ fmt(payable) }}</div>
                </div>
              </div>
            </a-card>
          </a-col>
        </a-row>
      </a-layout-content>
    </a-layout>
  </a-config-provider>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { theme, message } from 'ant-design-vue'
import { BulbOutlined, SaveOutlined } from '@ant-design/icons-vue'

/** Theme */
const isDark = ref(false)
function toggleDark() { isDark.value = !isDark.value }

/** Router */
const router = useRouter()
function goBack() { router.back() }

/** Teacher ID (from route or path) */
function useTeacherId() {
  const route = useRoute()
  return computed(() => {
    if (route.params.teacherId) return route.params.teacherId as string
    if (typeof window !== 'undefined') {
      const parts = window.location.pathname.split('/')
      const idx = parts.indexOf('teach-internal')
      return idx !== -1 ? parts[idx + 1] : null
    }
    return null
  })
}
const teacherId = useTeacherId()

/** Helpers */
const fmt = (n: number) =>
  n.toLocaleString(undefined, { style: 'currency', currency: 'EUR' })

/** Form state */
type FormT = {
  title: string
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | string
  description: string
  price: number
  discount: number
  coverUrl?: string
}
const form = ref<FormT>({
  title: '',
  category: '',
  difficulty: 'Beginner',
  description: '',
  price: 0,
  discount: 0,
  coverUrl: ''
})

/** Derived */
const payable = computed(() =>
  Number(form.value.price || 0) * (1 - Number(form.value.discount || 0) / 100)
)
const diffOptions = [
  { label: 'Beginner', value: 'Beginner' },
  { label: 'Intermediate', value: 'Intermediate' },
  { label: 'Advanced', value: 'Advanced' }
]

/** Validation */
import type { FormInstance, Rule } from 'ant-design-vue/es/form'
const formRef = ref<FormInstance>()
const rules: Record<string, Rule[]> = {
  title: [{ required: true, message: 'Title is required' }],
  price: [{ type: 'number', min: 0, message: 'Price must be ≥ 0' }],
  discount: [{ type: 'number', min: 0, max: 100, message: '0–100' }]
}

/** GraphQL */
const API_URL = 'http://localhost:4000/api/teach-internal/graphql'
function getAuthHeaders() {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  return headers
}
async function fetchGraphQL<T = any>(query: string, variables?: Record<string, any>): Promise<T> {
  const resp = await fetch(API_URL, {
    method: 'POST',
    credentials: 'include',
    headers: getAuthHeaders(),
    body: JSON.stringify({ query, variables })
  })
  const json = await resp.json()
  if (json.errors?.length) throw new Error(json.errors[0]?.message || 'GraphQL error')
  return json.data as T
}

const GQL = {
  createCourse: `
    mutation CreateCourse(
      $title:String!,
      $category:String,
      $difficulty:String,
      $description:String,
      $price:Float,
      $discount:Float,
      $teacherId:String!
    ){
      createCourse(
        title:$title,
        category:$category,
        difficulty:$difficulty,
        description:$description,
        price:$price,
        discount:$discount,
        teacherId:$teacherId
      ){ id }
    }
  `,
  updateCourseCover: `
    mutation UpdateCourse($id:String!, $coverUrl:String){
      updateCourse(id:$id, coverUrl:$coverUrl){ id }
    }
  `
}

/** Submit handler */
const loading = ref(false)
const creating = ref(false)

async function submit() {
  try { await formRef.value?.validate() } catch { return }

  creating.value = true
  try {
    const base = {
      title: form.value.title.trim(),
      category: form.value.category.trim() || null,
      difficulty: form.value.difficulty || null,
      description: form.value.description || '',
      price: Number(form.value.price || 0),
      discount: Number(form.value.discount || 0),
      teacherId: teacherId.value
    }
    const data = await fetchGraphQL<{ createCourse: { id: string } }>(GQL.createCourse, base)
    const newId = data.createCourse.id

    const cover = (form.value.coverUrl || '').trim()
    if (cover) await fetchGraphQL(GQL.updateCourseCover, { id: newId, coverUrl: cover })

    message.success('Course created')
    router.push(`/teach-internal/${teacherId.value}/course/${newId}/module/new/view`)
  } catch (e: any) {
    message.error(e?.message || 'Create course failed')
  } finally {
    creating.value = false
  }
}

definePageMeta({ layout: 'teacher' })
</script>

<style scoped>
.admin-wrap { min-height: 100vh; background: #f6f8fb; }
.is-dark { background: #0b1220; }
.admin-header { background: #fff; border-bottom: 1px solid #eef2f7; }
.is-dark .admin-header { background: #0f172a; }
.content { padding: 16px; }

/* Preview card */
.preview .cover {
  height: 140px;
  border-radius: 8px;
  background-size: cover;
  background-position: center;
}
.preview .meta { margin-top: 10px; }
.preview .title { font-weight: 700; font-size: 16px; }
.preview .tags { margin: 6px 0; display: flex; gap: 6px; flex-wrap: wrap; }
.preview .price { font-weight: 600; }

.mb-2 { margin-bottom: 12px; }
</style>
