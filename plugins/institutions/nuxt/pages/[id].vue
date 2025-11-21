<template>
  <div class="inst-page">
    <!-- Header -->
    <div class="page-header">
      <div>
        <div class="title">{{ inst?.name || 'Institution' }}</div>
        <div class="subtitle">{{ inst?.location || 'No location set' }}</div>
      </div>
      <div class="actions">
        <a-button @click="refresh" :loading="loading"><ReloadOutlined /> Refresh</a-button>
        <a-button type="default" @click="openSettings"><SettingOutlined /> Settings</a-button>
        <a-button type="primary" @click="openInvite"><UserAddOutlined /> Invite</a-button>
        <a-button type="primary" @click="openDept"><PlusOutlined /> Add Department</a-button>
        <a-button type="primary" @click="openClassroom"><PlusOutlined /> New Classroom</a-button>
      </div>
    </div>

    <!-- Stats -->
    <a-row :gutter="16" class="section">
      <a-col :xs="12" :md="6"><a-card><div class="stat-label">Departments</div><div class="stat-value">{{ departments.length }}</div></a-card></a-col>
      <a-col :xs="12" :md="6"><a-card><div class="stat-label">Classrooms</div><div class="stat-value">{{ classroomStats.total }}</div></a-card></a-col>
      <a-col :xs="12" :md="6"><a-card><div class="stat-label">Active Classrooms</div><div class="stat-value">{{ classroomStats.active }}</div></a-card></a-col>
      <a-col :xs="12" :md="6"><a-card><div class="stat-label">Total Enrollment</div><div class="stat-value">{{ totalEnrollment }}</div></a-card></a-col>
    </a-row>

    <a-row :gutter="16" class="section">
      <!-- Departments -->
      <a-col :xs="24" :md="6">
        <a-card title="Departments" :loading="loading">
          <a-list :data-source="departments">
            <template #renderItem="{ item: d }">
              <a-list-item
                :class="['dept-item', selectedDept?.id === d.id ? 'active' : '']"
                @click="selectDept(d)"
              >
                <a-list-item-meta :title="d.name" :description="d.active ? 'Active' : 'Inactive'" />
              </a-list-item>
            </template>
          </a-list>
        </a-card>
      </a-col>

      <!-- Classrooms -->
      <a-col :xs="24" :md="12">
        <a-card :title="selectedDept ? `${selectedDept.name} Classrooms` : 'All Classrooms'" :loading="loading">
          <a-input-search v-model:value="classFilter" placeholder="Search classrooms..." class="mb-3" />
          <a-empty v-if="filteredClassrooms.length === 0" description="No classrooms" />
          <a-row v-else :gutter="12">
            <a-col v-for="c in filteredClassrooms" :key="c.id" :xs="24" :sm="12">
              <a-card hoverable>
                <div class="card-head">
                  <div>
                    <div class="card-title">{{ c.title || c.code }}</div>
                    <div class="card-sub">{{ c.code }}</div>
                  </div>
                  <a-tag :color="c.status === 'active' ? 'green' : 'default'">{{ c.status || 'pending' }}</a-tag>
                </div>
                <div class="row"><span>Capacity</span><strong>{{ c.capacity || 30 }}</strong></div>
                <div class="row"><span>Enrollment</span><strong>{{ c.enrollment || 0 }}</strong></div>
                <div class="row"><span>Department</span><strong>{{ deptName(c.departmentId) }}</strong></div>
                <div class="card-actions">
                  <a-button size="small" @click="editClassroom(c)">Edit</a-button>
                </div>
              </a-card>
            </a-col>
          </a-row>
        </a-card>
      </a-col>

      <!-- Members / Invites -->
      <a-col :xs="24" :md="6">
        <a-card title="Members" :loading="loading">
          <a-list :data-source="members">
            <template #renderItem="{ item: m }">
              <a-list-item>
                <a-list-item-meta :title="m.userId" :description="m.role" />
              </a-list-item>
            </template>
          </a-list>
        </a-card>
        <a-card title="Invites" class="mt-3" :loading="loading">
          <a-list :data-source="invites">
            <template #renderItem="{ item: i }">
              <a-list-item>
                <a-list-item-meta :title="i.code" :description="`Role: ${i.role}`" />
              </a-list-item>
            </template>
          </a-list>
        </a-card>
      </a-col>
    </a-row>

    <!-- Settings Modal -->
    <a-modal v-model:open="settingsOpen" title="Institution Settings" ok-text="Save" @ok="saveSettings">
      <a-form layout="vertical">
        <a-form-item label="Name"><a-input v-model:value="instForm.name" /></a-form-item>
        <a-form-item label="Slug"><a-input v-model:value="instForm.slug" /></a-form-item>
        <a-form-item label="Type"><a-input v-model:value="instForm.type" /></a-form-item>
        <a-form-item label="Location"><a-input v-model:value="instForm.location" /></a-form-item>
        <a-form-item label="Email"><a-input v-model:value="instForm.email" /></a-form-item>
        <a-form-item label="Phone"><a-input v-model:value="instForm.phone" /></a-form-item>
        <a-form-item label="Active"><a-switch v-model:checked="instForm.active" /></a-form-item>
      </a-form>
    </a-modal>

    <!-- Department Modal -->
    <a-modal v-model:open="deptOpen" title="Department" ok-text="Save" @ok="saveDept">
      <a-form layout="vertical">
        <a-form-item label="Name"><a-input v-model:value="deptForm.name" /></a-form-item>
        <a-form-item label="Slug"><a-input v-model:value="deptForm.slug" /></a-form-item>
        <a-form-item label="Active"><a-switch v-model:checked="deptForm.active" /></a-form-item>
      </a-form>
    </a-modal>

    <!-- Classroom Modal -->
    <a-modal v-model:open="classOpen" title="Classroom" ok-text="Save" @ok="saveClassroom">
      <a-form layout="vertical">
        <a-form-item label="Title"><a-input v-model:value="classForm.title" /></a-form-item>
        <a-form-item label="Code"><a-input v-model:value="classForm.code" /></a-form-item>
        <a-form-item label="Department">
          <a-select v-model:value="classForm.departmentId" allow-clear>
            <a-select-option :value="undefined">—</a-select-option>
            <a-select-option v-for="d in departments" :key="d.id" :value="d.id">{{ d.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="Capacity"><a-input-number v-model:value="classForm.capacity" :min="1" :max="500" style="width: 100%" /></a-form-item>
        <a-form-item label="Status"><a-input v-model:value="classForm.status" placeholder="active/inactive" /></a-form-item>
        <a-form-item label="Teach course">
          <a-select v-model:value="selectedCourseId" :options="courseOptions" allow-clear placeholder="Select course" />
        </a-form-item>
        <a-form-item label="Preferred modules">
          <a-select v-model:value="selectedModuleIds" :options="moduleOptions" mode="multiple" allow-clear placeholder="Select modules" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- Invite Modal -->
    <a-modal v-model:open="inviteOpen" title="Create Invite" ok-text="Create" @ok="saveInvite">
      <a-form layout="vertical">
        <a-form-item label="Role">
          <a-select v-model:value="inviteForm.role">
            <a-select-option value="student">Student</a-select-option>
            <a-select-option value="teacher">Teacher</a-select-option>
            <a-select-option value="admin">Admin</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="Expires At (optional)">
          <a-date-picker v-model:value="inviteForm.expiresAt" style="width: 100%" show-time />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRuntimeConfig } from '#imports'
import { message } from 'ant-design-vue'
import { useAuth } from '../../../../packages/shared-ui/src/composables/useAuth'
import { PlusOutlined, ReloadOutlined, SettingOutlined, UserAddOutlined } from '@ant-design/icons-vue'

const route = useRoute()
const config = useRuntimeConfig()
const apiBase = config.public?.apiBase || 'http://localhost:4000'
const { token } = useAuth()

const inst = ref<any>(null)
const departments = ref<any[]>([])
const classrooms = ref<any[]>([])
const members = ref<any[]>([])
const invites = ref<any[]>([])
const loading = ref(false)
const classFilter = ref('')

const settingsOpen = ref(false)
const deptOpen = ref(false)
const classOpen = ref(false)
const inviteOpen = ref(false)

const selectedDept = ref<any>(null)

const instForm = ref<any>({})
const deptForm = ref<any>({})
const classForm = ref<any>({})
const inviteForm = ref<any>({ role: 'student', expiresAt: null })
const selectedCourseId = ref<string | undefined>(undefined)
const selectedModuleIds = ref<string[]>([])
const courseOptions = ref<any[]>([])
const moduleOptions = ref<any[]>([])

function tokenHeader() {
  const t = token?.value || (typeof window !== 'undefined' ? localStorage.getItem('token') : '')
  return t ? { Authorization: `Bearer ${t}` } : {}
}

async function gql(query: string, variables: any = {}) {
  const resp = await fetch(`${apiBase}/api/institutions/graphql`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...tokenHeader() },
    body: JSON.stringify({ query, variables }),
  })
  const json = await resp.json()
  if (json.errors?.length) throw new Error(json.errors[0].message)
  return json.data
}

async function load() {
  loading.value = true
  try {
    const id = String(route.params.id)
    const data = await gql(
      `
      query($id:String!){
        institution(id:$id){ id name slug type location email phone active }
        departments(institutionId:$id){ id name slug active }
        classrooms(institutionId:$id){ id title code departmentId capacity status courseIds enrollments { id } }
        members(institutionId:$id){ id userId role status }
        stats(institutionId:$id){ classrooms activeClassrooms departments members students }
      }
    `,
      { id }
    )
    inst.value = data?.institution || null
    departments.value = data?.departments || []
    classrooms.value = (data?.classrooms || []).map((c: any) => ({
      ...c,
      enrollment: c.enrollments?.length || 0,
    }))
    members.value = data?.members || []
  } catch (e: any) {
    message.error(e?.message || 'Unable to load institution')
  } finally {
    loading.value = false
  }
}

const filteredClassrooms = computed(() => {
  return classrooms.value.filter((c) => {
    const matchesDept = selectedDept.value ? c.departmentId === selectedDept.value.id : true
    const matchesText = classFilter.value ? (c.title || '').toLowerCase().includes(classFilter.value.toLowerCase()) || (c.code || '').toLowerCase().includes(classFilter.value.toLowerCase()) : true
    return matchesDept && matchesText
  })
})

const classroomStats = computed(() => {
  const total = classrooms.value.length
  const active = classrooms.value.filter((c) => c.status === 'active').length
  return { total, active }
})

const totalEnrollment = computed(() => classrooms.value.reduce((s, c) => s + (c.enrollment || 0), 0))

function deptName(id?: string) {
  if (!id) return '—'
  return departments.value.find((d: any) => d.id === id)?.name || '—'
}

function selectDept(d: any) {
  selectedDept.value = selectedDept.value?.id === d.id ? null : d
}

function openSettings() {
  instForm.value = { ...inst.value }
  settingsOpen.value = true
}
function openDept(d?: any) {
  deptForm.value = d ? { ...d } : { name: '', slug: '', active: true }
  deptOpen.value = true
}
function openClassroom(c?: any) {
  classForm.value = c
    ? { ...c }
    : { title: '', code: '', departmentId: selectedDept.value?.id, capacity: 30, status: 'active' }
  classOpen.value = true
  loadCourseOptions()
  try {
    const raw = classForm.value?.courseIds
    if (raw) {
      const parsed = JSON.parse(raw)
      selectedCourseId.value = parsed?.courseId || undefined
      selectedModuleIds.value = Array.isArray(parsed?.preferredModuleIds) ? parsed.preferredModuleIds : []
      if (selectedCourseId.value) loadModuleOptions(String(selectedCourseId.value))
    }
  } catch {}
}
function openInvite() {
  inviteForm.value = { role: 'student', expiresAt: null }
  inviteOpen.value = true
}

async function saveSettings() {
  try {
    await gql(
      `mutation($id:String!,$name:String,$slug:String,$type:String,$location:String,$email:String,$phone:String,$active:Boolean){
        updateInstitution(id:$id,name:$name,slug:$slug,type:$type,location:$location,email:$email,phone:$phone,active:$active){ id }
      }`,
      { ...instForm.value, id: inst.value.id }
    )
    settingsOpen.value = false
    await load()
    message.success('Institution updated')
  } catch (e: any) {
    message.error(e?.message || 'Update failed')
  }
}

async function saveDept() {
  try {
    const vars = { institutionId: inst.value.id, ...deptForm.value }
    const mutation = deptForm.value.id
      ? `mutation($id:String!,$name:String,$slug:String,$contact:String,$head:String,$active:Boolean){ updateDepartment(id:$id,name:$name,slug:$slug,contact:$contact,head:$head,active:$active){ id } }`
      : `mutation($institutionId:String!,$name:String!,$slug:String!,$contact:String,$head:String,$active:Boolean){ createDepartment(institutionId:$institutionId,name:$name,slug:$slug,contact:$contact,head:$head,active:$active){ id } }`
    await gql(mutation, vars)
    deptOpen.value = false
    await load()
    message.success('Department saved')
  } catch (e: any) {
    message.error(e?.message || 'Save failed')
  }
}

async function saveClassroom() {
  try {
    const vars = { institutionId: inst.value.id, ...classForm.value }
    const mutation = classForm.value.id
      ? `mutation($id:String!,$departmentId:String,$name:String,$code:String,$teacherId:String,$capacity:Int,$status:String,$startsAt:String,$endsAt:String,$courseIds:String){
          updateClassroom(id:$id,departmentId:$departmentId,name:$name,code:$code,teacherId:$teacherId,capacity:$capacity,status:$status,startsAt:$startsAt,endsAt:$endsAt,courseIds:$courseIds){ id }
        }`
      : `mutation($institutionId:String!,$departmentId:String,$name:String!,$code:String!,$teacherId:String,$capacity:Int,$status:String,$startsAt:String,$endsAt:String,$courseIds:String){
          createClassroom(institutionId:$institutionId,departmentId:$departmentId,name:$name,code:$code,teacherId:$teacherId,capacity:$capacity,status:$status,startsAt:$startsAt,endsAt:$endsAt,courseIds:$courseIds){ id }
        }`
    // map title->name
    vars.name = vars.title || vars.name
    if (selectedCourseId.value) {
      vars.courseIds = JSON.stringify({ courseId: selectedCourseId.value, preferredModuleIds: selectedModuleIds.value })
    }
    await gql(mutation, vars)
    classOpen.value = false
    await load()
    message.success('Classroom saved')
  } catch (e: any) {
    message.error(e?.message || 'Save failed')
  }
}

async function saveInvite() {
  try {
    const vars: any = { institutionId: inst.value.id, role: inviteForm.value.role }
    if (inviteForm.value.expiresAt) vars.expiresAt = inviteForm.value.expiresAt
    await gql(`mutation($institutionId:String!,$role:String!,$expiresAt:String){ createInvite(institutionId:$institutionId, role:$role, expiresAt:$expiresAt){ id code } }`, vars)
    inviteOpen.value = false
    message.success('Invite created')
    await loadInvites()
  } catch (e: any) {
    message.error(e?.message || 'Invite failed')
  }
}

async function loadInvites() {
  try {
    const data = await gql(`query($id:String!){ stats(institutionId:$id){ members } }`, { id: inst.value.id })
    // simple refresh of members already done in load; invites not listed by API; skip if unavailable
  } catch {}
}

function editClassroom(c: any) {
  openClassroom({ ...c, name: c.title })
}

function refresh() {
  load()
}

onMounted(() => {
  load()
})
</script>

<style scoped>
.inst-page {
  padding: 16px 20px 32px;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  gap: 12px;
  flex-wrap: wrap;
}
.title {
  font-size: 24px;
  font-weight: 700;
}
.subtitle {
  color: #6b7280;
}
.actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.section {
  margin-top: 12px;
}
.stat-label {
  color: #64748b;
  font-size: 13px;
}
.stat-value {
  font-size: 22px;
  font-weight: 700;
}
.dept-item.active {
  background: #f0f5ff;
}
.card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-title {
  font-weight: 700;
}
.card-sub {
  color: #94a3b8;
  font-size: 12px;
}
.row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  margin: 4px 0;
}
.card-actions {
  margin-top: 8px;
  display: flex;
  justify-content: flex-end;
}
</style>
async function loadCourseOptions() {
  try {
    const resp = await fetch(`${apiBase}/api/teach-internal/courses`, { headers: { ...tokenHeader() } })
    const json = await resp.json().catch(() => ({}))
    const arr = Array.isArray(json?.data) ? json.data : []
    courseOptions.value = arr.map((c: any) => ({ label: c.title, value: c.id }))
  } catch { courseOptions.value = [] }
}
async function loadModuleOptions(courseId: string) {
  try {
    const resp = await fetch(`${apiBase}/api/teach-internal/modules`, { headers: { ...tokenHeader() } })
    const json = await resp.json().catch(() => ({}))
    const arr = Array.isArray(json?.data) ? json.data.filter((m: any) => m.courseId === courseId) : []
    moduleOptions.value = arr.map((m: any) => ({ label: m.title, value: m.id }))
  } catch { moduleOptions.value = [] }
}
watch(selectedCourseId, (cid) => { if (cid) loadModuleOptions(String(cid)); else moduleOptions.value = [] })
