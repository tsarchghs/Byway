<template>
  <div class="portal-page">
    <a-page-header title="Institution Portal" sub-title="Role-aware overview">
      <template #extra>
        <a-tag color="blue">{{ roleLabel }}</a-tag>
        <a-button type="primary" :loading="loading" @click="refresh">
          <template #icon><ReloadOutlined /></template>
          Refresh
        </a-button>
      </template>
    </a-page-header>

    <a-spin :spinning="loading">
      <a-row :gutter="[16, 16]" class="mt-3">
        <a-col :xs="24" :md="12">
          <a-card title="Institutions">
            <a-list :data-source="overview.institutions">
              <template #renderItem="{ item: inst }">
                <a-list-item>
                  <a-list-item-meta :title="inst.name" :description="inst.active ? 'Active' : 'Inactive'" />
                  <template #actions>
                    <a :href="`/institutions/${inst.id}`">Open</a>
                  </template>
                </a-list-item>
              </template>
            </a-list>
          </a-card>
        </a-col>

        <a-col :xs="24" :md="12">
          <a-card v-if="isAdminOrTeacher" title="Manage (admin/teacher)">
            <p>Use these to jump into the institution and teaching flows.</p>
            <a-space direction="vertical" style="width: 100%">
              <a-button block type="primary" href="/institutions">Go to Institutions list</a-button>
              <a-button block href="/teach">Go to Teach</a-button>
              <a-button block href="/teach-internal">Internal Teaching Console</a-button>
            </a-space>
          </a-card>
          <a-card v-else title="Your classrooms">
            <a-empty v-if="myClassrooms.length === 0" description="No classrooms yet" />
            <a-list v-else :data-source="myClassrooms">
              <template #renderItem="{ item: c }">
                <a-list-item>
                  <a-list-item-meta :title="c.title || c.code" :description="instName(c.institutionId)" />
                  <template #actions>
                    <a :href="`/institutions/${c.institutionId}`">Institution</a>
                  </template>
                </a-list-item>
              </template>
            </a-list>
          </a-card>
        </a-col>
      </a-row>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRuntimeConfig } from '#imports'
import { message } from 'ant-design-vue'
import { ReloadOutlined } from '@ant-design/icons-vue'
import { useAuth } from '../../../../packages/shared-ui/src/composables/useAuth'

const config = useRuntimeConfig()
const apiBase = config.public?.apiBase || 'http://localhost:4000'
const { token } = useAuth()

const loading = ref(false)
const overview = ref<any>({ user: null, institutions: [], departments: [], classrooms: [], members: [] })

function tokenHeader() {
  const t = token?.value || (typeof window !== 'undefined' ? localStorage.getItem('token') : '')
  return t ? { Authorization: `Bearer ${t}` } : {}
}

async function refresh() {
  loading.value = true
  try {
    const resp = await fetch(`${apiBase}/api/institution-portal/overview`, {
      headers: { 'content-type': 'application/json', ...tokenHeader() },
    })
    const data = await resp.json()
    if (!resp.ok) throw new Error(data?.error || 'Unable to load portal')
    overview.value = {
      user: data.user,
      institutions: data.institutions || [],
      departments: data.departments || [],
      classrooms: data.classrooms || [],
      members: data.members || [],
    }
  } catch (err: any) {
    message.error(err?.message || 'Failed to load portal')
  } finally {
    loading.value = false
  }
}

const role = computed(() => {
  const list = (overview.value.user?.roles || []).map((r: string) => r?.toLowerCase?.())
  if (list.includes('admin')) return 'admin'
  if (list.includes('teacher')) return 'teacher'
  if (list.includes('student')) return 'student'
  return (overview.value.user?.role || 'student').toLowerCase()
})

const roleLabel = computed(() => role.value?.toUpperCase?.() || 'STUDENT')
const isAdminOrTeacher = computed(() => ['admin', 'teacher', 'facultyadmin', 'dean'].includes(role.value))

const myMemberships = computed(() => {
  const uid = overview.value.user?.id
  if (!uid) return []
  return overview.value.members.filter((m: any) => m.userId === uid)
})

const myInstitutions = computed(() => {
  const ids = new Set(myMemberships.value.map((m: any) => m.institutionId))
  return overview.value.institutions.filter((i: any) => ids.has(i.id))
})

const myClassrooms = computed(() => {
  const ids = new Set(myInstitutions.value.map((i: any) => i.id))
  return overview.value.classrooms.filter((c: any) => ids.has(c.institutionId))
})

function instName(id: string) {
  return overview.value.institutions.find((i: any) => i.id === id)?.name || 'Institution'
}

onMounted(refresh)
</script>

<style scoped>
.portal-page {
  padding: 16px 20px 32px;
}
.mt-3 {
  margin-top: 12px;
}
</style>
