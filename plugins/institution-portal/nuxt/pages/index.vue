<template>
  <div class="portal-page">
    <a-page-header :title="pageTitle" sub-title="Unified portal for students, teachers, and administrators">
      <template #extra>
        <a-tag color="blue">{{ roleLabel }}</a-tag>
        <a-button :loading="loading" @click="refresh">
          <template #icon><ReloadOutlined /></template>
          Refresh
        </a-button>
        <a-button
          v-if="canToggleTeacherView"
          type="default"
          @click="toggleViewMode"
        >
          View as {{ viewMode === 'student' ? 'Teacher' : 'Student' }}
        </a-button>
        <a-button type="primary" v-if="canCreateInstitution" @click="openInstitutionModal()">
          <template #icon><PlusOutlined /></template>
          New Institution
        </a-button>
        <a-button v-if="!isAdminOrTeacher" @click="openJoinModal">
          <template #icon><LinkOutlined /></template>
          Join with Invite
        </a-button>
      </template>
    </a-page-header>

    <a-spin :spinning="loading">
      <a-row :gutter="[16, 16]" class="section">
        <!-- Institutions -->
        <a-col :xs="24" :lg="6">
          <a-card title="Institutions" :loading="loading">
            <a-list :data-source="overview.institutions">
              <template #renderItem="{ item: inst }">
                <a-list-item
                  :class="['inst-item', selectedInstId === inst.id ? 'active' : '']"
                  @click="selectInst(inst.id)"
                >
                  <a-list-item-meta :title="inst.name" :description="inst.active ? 'Active' : 'Inactive'" />
                </a-list-item>
              </template>
            </a-list>
            <template #extra>
              <a-button type="link" size="small" v-if="canCreateInstitution" @click.stop="openInstitutionModal()">New</a-button>
            </template>
          </a-card>
        </a-col>

        <!-- Details -->
        <a-col :xs="24" :lg="12">
          <div v-if="!selectedInst">
            <a-empty description="Select an institution to see details" />
          </div>
          <div v-else>
            <div class="section">
              <a-row :gutter="12">
                <a-col :xs="12" :md="6"><a-card><div class="stat-label">Departments</div><div class="stat-value">{{ deptCount }}</div></a-card></a-col>
                <a-col :xs="12" :md="6"><a-card><div class="stat-label">Classrooms</div><div class="stat-value">{{ classCount }}</div></a-card></a-col>
                <a-col :xs="12" :md="6"><a-card><div class="stat-label">Active Classrooms</div><div class="stat-value">{{ activeClassCount }}</div></a-card></a-col>
                <a-col :xs="12" :md="6"><a-card><div class="stat-label">Members</div><div class="stat-value">{{ memberCount }}</div></a-card></a-col>
              </a-row>
            </div>

            <div class="section">
              <a-row :gutter="[12, 12]">
                <a-col :xs="24" :md="10">
                  <a-card
                    title="Departments"
                    :extra="isAdminOrTeacherForInst ? hButton('Add', openDeptModal) : null"
                    :loading="detailLoading"
                  >
                    <a-list :data-source="detail.departments">
                      <template #renderItem="{ item: d }">
                        <a-list-item @click="selectDept(d.id)" :class="['dept-item', selectedDeptId === d.id ? 'active' : '']">
                          <a-list-item-meta :title="d.name" :description="d.active ? 'Active' : 'Inactive'" />
                        </a-list-item>
                      </template>
                    </a-list>
                  </a-card>
                </a-col>

                <a-col :xs="24" :md="14">
                  <a-card
                    :title="selectedDept ? `${selectedDept.name} Classrooms` : 'Classrooms'"
                    :extra="isAdminOrTeacherForInst ? hButton('New', openClassModal) : null"
                    :loading="detailLoading"
                  >
                    <a-input-search v-model:value="classFilter" placeholder="Search classroom title/code" class="mb-2" />
                    <a-empty v-if="filteredClasses.length === 0" description="No classrooms" />
                    <a-row v-else :gutter="12">
                      <a-col v-for="c in filteredClasses" :key="c.id" :xs="24" :sm="12">
                        <a-card size="small" hoverable>
                          <div class="card-head">
                            <div>
                              <div class="card-title">{{ c.title || c.code }}</div>
                              <div class="card-sub">{{ deptName(c.departmentId) }}</div>
                            </div>
                            <a-tag :color="c.status === 'active' ? 'green' : 'default'">{{ c.status || 'pending' }}</a-tag>
                          </div>
                          <div class="row"><span>Capacity</span><strong>{{ c.capacity || 0 }}</strong></div>
                          <div class="row"><span>Enrollment</span><strong>{{ c.enrollment || 0 }}</strong></div>
                          <div class="row"><span>Code</span><strong>{{ c.code }}</strong></div>
                          <div class="card-actions" v-if="isAdminOrTeacherForInst">
                            <a-button size="small" @click="openClassModal(c)">Edit</a-button>
                          </div>
                        </a-card>
                      </a-col>
                    </a-row>
                  </a-card>
                </a-col>
              </a-row>
            </div>
          </div>
        </a-col>

        <!-- Members / Invites -->
        <a-col :xs="24" :lg="6">
          <a-card title="Members" :loading="detailLoading">
            <a-list :data-source="detail.members">
              <template #renderItem="{ item: m }">
                <a-list-item>
                  <a-list-item-meta :title="m.userId" :description="m.role" />
                </a-list-item>
              </template>
            </a-list>
          </a-card>
          <a-card v-if="isAdminOrTeacherForInst" class="mt-2" title="Invites">
            <a-space direction="vertical" style="width: 100%">
              <a-input v-model:value="inviteForm.code" placeholder="Enter invite code to share" disabled />
              <a-button type="primary" block @click="openInviteModal">Create Invite</a-button>
            </a-space>
          </a-card>
        </a-col>
      </a-row>
    </a-spin>

    <!-- Institution modal -->
    <a-modal v-model:open="instModalOpen" :title="instForm.id ? 'Update Institution' : 'Create Institution'" ok-text="Save" @ok="saveInstitution">
      <a-form layout="vertical">
        <a-form-item label="Name" required><a-input v-model:value="instForm.name" /></a-form-item>
        <a-form-item label="Slug" required><a-input v-model:value="instForm.slug" /></a-form-item>
        <a-form-item label="Type"><a-input v-model:value="instForm.type" /></a-form-item>
        <a-form-item label="Location"><a-input v-model:value="instForm.location" /></a-form-item>
        <a-form-item label="Email"><a-input v-model:value="instForm.email" /></a-form-item>
        <a-form-item label="Phone"><a-input v-model:value="instForm.phone" /></a-form-item>
        <a-form-item label="Active">
          <a-switch v-model:checked="instForm.active" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- Join modal -->
    <a-modal v-model:open="joinModalOpen" title="Join with Invite" ok-text="Join" @ok="redeemInvite">
      <a-form layout="vertical">
        <a-form-item label="Invite Code" required>
          <a-input v-model:value="joinCode" placeholder="Enter invite code" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- Department modal -->
    <a-modal v-model:open="deptModalOpen" :title="deptForm.id ? 'Update Department' : 'Add Department'" ok-text="Save" @ok="saveDepartment">
      <a-form layout="vertical">
        <a-form-item label="Name" required><a-input v-model:value="deptForm.name" /></a-form-item>
        <a-form-item label="Slug" required><a-input v-model:value="deptForm.slug" /></a-form-item>
        <a-form-item label="Head"><a-input v-model:value="deptForm.head" /></a-form-item>
        <a-form-item label="Contact"><a-input v-model:value="deptForm.contact" /></a-form-item>
        <a-form-item label="Active"><a-switch v-model:checked="deptForm.active" /></a-form-item>
      </a-form>
    </a-modal>

    <!-- Classroom modal -->
    <a-modal v-model:open="classModalOpen" :title="classForm.id ? 'Update Classroom' : 'New Classroom'" ok-text="Save" @ok="saveClassroom">
      <a-form layout="vertical">
        <a-form-item label="Title" required><a-input v-model:value="classForm.title" /></a-form-item>
        <a-form-item label="Code" required><a-input v-model:value="classForm.code" /></a-form-item>
        <a-form-item label="Department">
          <a-select v-model:value="classForm.departmentId" allow-clear>
            <a-select-option :value="undefined">—</a-select-option>
            <a-select-option v-for="d in detail.departments" :key="d.id" :value="d.id">{{ d.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="Capacity"><a-input-number v-model:value="classForm.capacity" :min="1" :max="500" style="width: 100%" /></a-form-item>
        <a-form-item label="Status"><a-input v-model:value="classForm.status" placeholder="active/inactive" /></a-form-item>
      </a-form>
    </a-modal>

    <!-- Invite modal -->
    <a-modal v-model:open="inviteModalOpen" title="Create Invite" ok-text="Create" @ok="createInvite">
      <a-form layout="vertical">
        <a-form-item label="Role" required>
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
import { computed, h, onMounted, ref } from 'vue'
import { useRuntimeConfig } from '#imports'
import { message } from 'ant-design-vue'
import { PlusOutlined, ReloadOutlined, LinkOutlined } from '@ant-design/icons-vue'
import { useAuth } from '../../../../packages/shared-ui/src/composables/useAuth'

const config = useRuntimeConfig()
const apiBase = config.public?.apiBase || 'http://localhost:4000'
const { token } = useAuth()

const loading = ref(false)
const detailLoading = ref(false)
const overview = ref<any>({ user: null, institutions: [], departments: [], classrooms: [], members: [] })
const detail = ref<any>({ inst: null, departments: [], classrooms: [], members: [], stats: null })
const selectedInstId = ref<string | null>(null)
const selectedDeptId = ref<string | null>(null)
const classFilter = ref('')

const instModalOpen = ref(false)
const joinModalOpen = ref(false)
const deptModalOpen = ref(false)
const classModalOpen = ref(false)
const inviteModalOpen = ref(false)

const instForm = ref<any>({ active: true })
const deptForm = ref<any>({ active: true })
const classForm = ref<any>({ status: 'active', capacity: 30 })
const inviteForm = ref<any>({ role: 'student', expiresAt: null, code: '' })
const joinCode = ref('')
const viewMode = ref<'student' | 'teacher'>('student')

function tokenHeader() {
  // pull token from useAuth first, then fall back to localStorage for browser-only calls
  const t =
    token?.value ||
    (typeof window !== 'undefined' ? localStorage.getItem('token') || localStorage.getItem('access_token') : '')
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

async function refresh() {
  loading.value = true
  try {
    const resp = await fetch(`${apiBase}/api/institution-portal/overview`, {
      headers: { 'content-type': 'application/json', ...tokenHeader() },
    })
    const data = await resp.json().catch(async () => {
      const text = await resp.text()
      throw new Error(text || 'Unexpected response from portal API')
    })
    if (!resp.ok) throw new Error(data?.error || 'Unable to load portal')
    overview.value = {
      user: data.user,
      institutions: data.institutions || [],
      departments: data.departments || [],
      classrooms: data.classrooms || [],
      members: data.members || [],
    }
    if (data.institutions?.length && !selectedInstId.value) {
      selectInst(data.institutions[0].id)
    }
  } catch (err: any) {
    message.error(err?.message || 'Failed to load portal')
  } finally {
    loading.value = false
  }
}

async function loadDetail(instId: string) {
  detailLoading.value = true
  try {
    const data = await gql(
      `
      query($id:String!){
        institution(id:$id){ id name slug type location email phone active }
        departments(institutionId:$id){ id name slug active head contact }
        classrooms(institutionId:$id){ id title code departmentId capacity status enrollments { id } }
        members(institutionId:$id){ id userId role status institutionId }
        stats(institutionId:$id){ classrooms activeClassrooms departments members students }
      }`,
      { id: instId }
    )
    detail.value = {
      inst: data?.institution || null,
      departments: data?.departments || [],
      classrooms: (data?.classrooms || []).map((c: any) => ({ ...c, enrollment: c.enrollments?.length || 0 })),
      members: data?.members || [],
      stats: data?.stats || null,
    }
    selectedDeptId.value = null
  } catch (err: any) {
    message.error(err?.message || 'Failed to load institution')
    detail.value = { inst: null, departments: [], classrooms: [], members: [], stats: null }
  } finally {
    detailLoading.value = false
  }
}

function selectInst(id: string) {
  selectedInstId.value = id
  loadDetail(id)
}

const selectedInst = computed(() => overview.value.institutions.find((i: any) => i.id === selectedInstId.value) || null)
const selectedDept = computed(() => detail.value.departments.find((d: any) => d.id === selectedDeptId.value) || null)

const role = computed(() => {
  // base role from user/roles; defaults to student
  const list = (overview.value.user?.roles || []).map((r: string) => r?.toLowerCase?.())
  if (list.includes('admin')) return 'admin'
  if (list.includes('teacher')) return 'teacher'
  if (list.includes('student')) return 'student'
  return (overview.value.user?.role || 'student').toLowerCase()
})

const canToggleTeacherView = computed(() => !!overview.value.user?.teacherProfileId && role.value === 'teacher')
const effectiveRole = computed(() => {
  if (canToggleTeacherView.value) return viewMode.value === 'teacher' ? 'teacher' : 'student'
  return role.value
})

const roleLabel = computed(() => effectiveRole.value?.toUpperCase?.() || 'STUDENT')
const isAdminOrTeacher = computed(() => ['admin', 'teacher', 'facultyadmin', 'dean'].includes(effectiveRole.value))
const canCreateInstitution = computed(() => isAdminOrTeacher.value)

function myRoleForInst(instId?: string) {
  if (!instId) return null
  const uid = overview.value.user?.id
  const mem = detail.value.members.find((m: any) => m.institutionId === instId && m.userId === uid)
  return mem?.role?.toLowerCase?.() || role.value
}
const isAdminOrTeacherForInst = computed(() => {
  const r = myRoleForInst(selectedInstId.value)
  const effective = r || effectiveRole.value
  return ['admin', 'teacher', 'facultyadmin', 'dean'].includes(effective || '')
})

const myMemberships = computed(() => {
  const uid = overview.value.user?.id
  if (!uid) return []
  return overview.value.members.filter((m: any) => m.userId === uid)
})

const myInstitutions = computed(() => {
  const ids = new Set(myMemberships.value.map((m: any) => m.institutionId))
  return overview.value.institutions.filter((i: any) => ids.has(i.id))
})

const filteredClasses = computed(() => {
  const items = detail.value.classrooms || []
  const deptMatch = selectedDeptId.value
  const term = classFilter.value.toLowerCase()
  return items.filter((c: any) => {
    const matchesDept = deptMatch ? c.departmentId === deptMatch : true
    const matchesText = term ? (c.title || '').toLowerCase().includes(term) || (c.code || '').toLowerCase().includes(term) : true
    return matchesDept && matchesText
  })
})

const deptCount = computed(() => detail.value.departments.length || 0)
const classCount = computed(() => detail.value.classrooms.length || 0)
const activeClassCount = computed(() => detail.value.classrooms.filter((c: any) => c.status === 'active').length || 0)
const memberCount = computed(() => detail.value.members.length || 0)

function deptName(id?: string) {
  if (!id) return '—'
  return detail.value.departments.find((d: any) => d.id === id)?.name || '—'
}

function hButton(label: string, onClick: () => void) {
  return h(
    'a-button',
    {
      size: 'small',
      type: 'link',
      onClick: (e: MouseEvent) => {
        e.stopPropagation()
        onClick()
      },
    },
    { default: () => label }
  )
}

function openInstitutionModal(inst?: any) {
  instForm.value = inst
    ? { ...inst }
    : { name: '', slug: '', type: '', location: '', email: '', phone: '', active: true }
  instModalOpen.value = true
}
function openJoinModal() {
  joinCode.value = ''
  joinModalOpen.value = true
}
function openDeptModal(d?: any) {
  if (!selectedInstId.value) return message.warning('Select an institution first')
  deptForm.value = d ? { ...d } : { name: '', slug: '', head: '', contact: '', active: true }
  deptModalOpen.value = true
}
function openClassModal(c?: any) {
  if (!selectedInstId.value) return message.warning('Select an institution first')
  classForm.value = c
    ? { ...c }
    : { title: '', code: '', departmentId: selectedDeptId.value, capacity: 30, status: 'active' }
  classModalOpen.value = true
}
function openInviteModal() {
  inviteForm.value = { role: 'student', expiresAt: null, code: '' }
  inviteModalOpen.value = true
}

async function saveInstitution() {
  try {
    const vars = { ...instForm.value }
    const mutation = vars.id
      ? `mutation($id:String!,$name:String,$slug:String,$type:String,$location:String,$email:String,$phone:String,$active:Boolean){
          updateInstitution(id:$id,name:$name,slug:$slug,type:$type,location:$location,email:$email,phone:$phone,active:$active){ id }
        }`
      : `mutation($name:String!,$slug:String!,$type:String,$location:String,$email:String,$phone:String,$active:Boolean){
          createInstitution(name:$name,slug:$slug,type:$type,location:$location,email:$email,phone:$phone,active:$active){ id }
        }`
    const data = await gql(mutation, vars)
    instModalOpen.value = false
    await refresh()
    if (!selectedInstId.value && data?.createInstitution?.id) selectInst(data.createInstitution.id)
    message.success('Institution saved')
  } catch (err: any) {
    message.error(err?.message || 'Save failed')
  }
}

async function redeemInvite() {
  if (!joinCode.value) return message.warning('Enter a code')
  try {
    const userId = overview.value.user?.id
    if (!userId) throw new Error('No user')
    await gql(`mutation($code:String!,$userId:String!){ redeemInvite(code:$code,userId:$userId){ id } }`, {
      code: joinCode.value,
      userId,
    })
    joinModalOpen.value = false
    message.success('Joined institution')
    await refresh()
  } catch (err: any) {
    message.error(err?.message || 'Join failed')
  }
}

async function saveDepartment() {
  if (!selectedInstId.value) return message.warning('Select an institution first')
  try {
    const vars = { institutionId: selectedInstId.value, ...deptForm.value }
    const mutation = vars.id
      ? `mutation($id:String!,$name:String,$slug:String,$contact:String,$head:String,$active:Boolean){ updateDepartment(id:$id,name:$name,slug:$slug,contact:$contact,head:$head,active:$active){ id } }`
      : `mutation($institutionId:String!,$name:String!,$slug:String!,$contact:String,$head:String,$active:Boolean){ createDepartment(institutionId:$institutionId,name:$name,slug:$slug,contact:$contact,head:$head,active:$active){ id } }`
    await gql(mutation, vars)
    deptModalOpen.value = false
    await loadDetail(selectedInstId.value)
    message.success('Department saved')
  } catch (err: any) {
    message.error(err?.message || 'Save failed')
  }
}

async function saveClassroom() {
  if (!selectedInstId.value) return message.warning('Select an institution first')
  try {
    const vars = { institutionId: selectedInstId.value, ...classForm.value }
    vars.name = vars.title || vars.name
    const mutation = vars.id
      ? `mutation($id:String!,$departmentId:String,$name:String,$code:String,$teacherId:String,$capacity:Int,$status:String,$startsAt:String,$endsAt:String){
          updateClassroom(id:$id,departmentId:$departmentId,name:$name,code:$code,teacherId:$teacherId,capacity:$capacity,status:$status,startsAt:$startsAt,endsAt:$endsAt){ id }
        }`
      : `mutation($institutionId:String!,$departmentId:String,$name:String!,$code:String!,$teacherId:String,$capacity:Int,$status:String,$startsAt:String,$endsAt:String){
          createClassroom(institutionId:$institutionId,departmentId:$departmentId,name:$name,code:$code,teacherId:$teacherId,capacity:$capacity,status:$status,startsAt:$startsAt,endsAt:$endsAt){ id }
        }`
    await gql(mutation, vars)
    classModalOpen.value = false
    await loadDetail(selectedInstId.value)
    message.success('Classroom saved')
  } catch (err: any) {
    message.error(err?.message || 'Save failed')
  }
}

async function createInvite() {
  if (!selectedInstId.value) return message.warning('Select an institution first')
  try {
    const vars: any = { institutionId: selectedInstId.value, role: inviteForm.value.role }
    if (inviteForm.value.expiresAt) vars.expiresAt = inviteForm.value.expiresAt
    const data = await gql(
      `mutation($institutionId:String!,$role:String!,$expiresAt:String){ createInvite(institutionId:$institutionId, role:$role, expiresAt:$expiresAt){ code } }`,
      vars
    )
    inviteForm.value.code = data?.createInvite?.code || ''
    inviteModalOpen.value = false
    message.success(`Invite created${inviteForm.value.code ? `: ${inviteForm.value.code}` : ''}`)
  } catch (err: any) {
    message.error(err?.message || 'Invite failed')
  }
}

function toggleViewMode() {
  viewMode.value = viewMode.value === 'student' ? 'teacher' : 'student'
}

const pageTitle = computed(() => selectedInst?.value?.name || 'Institution Portal')
const filteredMembers = computed(() => detail.value.members)
const myClassrooms = computed(() => {
  const ids = new Set(myInstitutions.value.map((i: any) => i.id))
  return overview.value.classrooms.filter((c: any) => ids.has(c.institutionId))
})

onMounted(refresh)
</script>

<style scoped>
.portal-page {
  padding: 16px 20px 32px;
}
.section {
  margin-top: 12px;
}
.inst-item.active {
  background: #f0f5ff;
}
.dept-item.active {
  background: #f5f5f5;
}
.stat-label {
  color: #64748b;
  font-size: 13px;
}
.stat-value {
  font-size: 22px;
  font-weight: 700;
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
.mt-2 {
  margin-top: 12px;
}
.mb-2 {
  margin-bottom: 8px;
}
</style>
