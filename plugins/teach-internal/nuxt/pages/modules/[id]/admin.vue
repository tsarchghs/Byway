<template>
  <a-layout class="p-6">
    <a-card :title="`Module Admin · ${module?.title || route.params.id}`" :bordered="false">
      <div class="mb-4 flex flex-wrap gap-2 items-center">
        <a-input v-model:value="userId" placeholder="Your userId (for roles)" style="max-width:260px" />
        <a-button @click="checkTeacher">Check Teacher Access</a-button>
        <a-button type="primary" @click="saveOrder" :disabled="!dirty">Save Order</a-button>
      </div>

      <a-alert v-if="allowed===false" type="warning" message="Access denied: Teacher/Admin role required" show-icon class="mb-3" />

      <div class="grid md:grid-cols-2 gap-4">
        <a-card title="Lessons (drag to reorder)" size="small">
          <ul>
            <li v-for="(l, idx) in lessons" :key="l.id"
                draggable="true"
                @dragstart="dragStart(idx)"
                @dragover.prevent
                @drop="drop(idx)"
                class="p-2 border rounded mb-2 bg-white">
              <div class="flex items-center justify-between">
                <span>#{{ idx+1 }} · {{ l.title }}</span>
                <a-tag>{{ l.position ?? idx }}</a-tag>
              </div>
            </li>
          </ul>
        </a-card>

        <a-card title="Resources" size="small">
          <div class="flex gap-2 mb-2">
            <a-input v-model:value="rName" placeholder="Name" style="max-width:200px" />
            <a-input v-model:value="rUrl" placeholder="URL" style="min-width:260px" />
            <a-button @click="addResource">Add</a-button>
          </div>
          <a-list :data-source="resources" :renderItem="renderRes" />
        </a-card>
      </div>
    </a-card>
  </a-layout>
</template>

<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()
const baseUrl = config.public?.apiBase || 'http://localhost:4000'

const module = ref<any>(null)
const lessons = ref<any[]>([])
const dirty = ref(false)

const dragIndex = ref<number | null>(null)
function dragStart(idx:number){ dragIndex.value = idx }
function drop(idx:number){
  const from = dragIndex.value
  if (from===null || from===idx) return
  const item = lessons.value.splice(from,1)[0]
  lessons.value.splice(idx,0,item)
  dirty.value = true
}
async function loadModule() {
  const q = 'query($id:String!){ moduleById(id:$id){ id title } }'
  const r = await $fetch(`${baseUrl}/api/teach-internal/graphql`, { method: 'POST', body: { query: q, variables: { id: String(route.params.id) }}}) as any
  module.value = r.data?.moduleById ?? null
}
async function loadLessons() {
  if (!module.value) return
  const q = 'query($moduleId:String!){ lessonsByModule(moduleId:$moduleId){ id title position } }'
  const r = await $fetch(`${baseUrl}/api/teach-internal/graphql`, { method: 'POST', body: { query: q, variables: { moduleId: module.value.id }}}) as any
  lessons.value = r.data?.lessonsByModule ?? []
}
async function saveOrder() {
  const ids = lessons.value.map((l:any)=> l.id)
  const q = 'mutation($moduleId:String!,$ids:[String!]!){ reorderLessons(moduleId:$moduleId, ids:$ids) }'
  await $fetch(`${baseUrl}/api/teach-internal/graphql`, { method: 'POST', body: { query: q, variables: { moduleId: module.value.id, ids }}})
  dirty.value = false
  await loadLessons()
}

const resources = ref<any[]>([])
const rName = ref(''); const rUrl = ref('')
function addResource(){ if(rName.value && rUrl.value){ resources.value.unshift({ name:rName.value, url:rUrl.value }); rName.value=''; rUrl.value='' } }
function renderRes({ item }: any){ return h('a-list-item', {}, [ h('a', { href:item.url, target:'_blank' }, item.name) ]) }

const userId = ref('')
const allowed = ref<boolean | null>(null)
async function checkTeacher(){
  if(!userId.value){ allowed.value=null; return }
  const q = 'query($userId:String!,$institutionId:String!,$role:String!){ hasRole(userId:$userId,institutionId:$institutionId,role:$role) }'
  const r = await $fetch(`${baseUrl}/api/authentication/graphql`, { method: 'POST', body: { query: q, variables: { userId: userId.value, institutionId: String(route.params.id), role: 'Teacher' }}}) as any
  allowed.value = !!r?.data?.hasRole
}

async function init(){ await loadModule(); await loadLessons() }
onMounted(init)

definePageMeta({ layout: 'institution' })


definePageMeta({ layout:'teacher', title:'Module Admin' })
</script>
