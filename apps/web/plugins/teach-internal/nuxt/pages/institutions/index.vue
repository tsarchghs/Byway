<template>
  <a-layout class="p-6">
    <a-card title="Institutions" :bordered="false">
      <div class="mb-4 flex gap-2">
        <a-input v-model:value="form.name" placeholder="Name" style="max-width: 240px" />
        <a-input v-model:value="form.domain" placeholder="Domain (optional)" style="max-width: 240px" />
        <a-input v-model:value="form.logoUrl" placeholder="Logo URL (optional)" style="max-width: 240px" />
        <a-button type="primary" @click="create">Create</a-button>
      </div>
      <a-table :data-source="rows" :columns="cols" row-key="id" />
    </a-card>
  </a-layout>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
const rows = ref<any[]>([])
const cols = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Domain', dataIndex: 'domain', key: 'domain' },
  { title: 'Actions', key: 'act', customRender: ({ record }: any) => {
    return h('a', { href: `/institutions/${record.name.toLowerCase().replace(/\s+/g,'-')}/admin` }, 'Open')
  }},
]
const form = reactive({ name: '', domain: '', logoUrl: '' })

const config = useRuntimeConfig()
const baseUrl = config.public?.apiBase || 'http://localhost:4000'
async function list() {
  const r = await $fetch(`${baseUrl}/api/authentication/graphql`, {
    method: 'POST',
    body: { query: 'query{ institutions{ id name domain logoUrl } }' }
  }) as any
  rows.value = r.data?.institutions ?? []
}
async function create() {
  if (!form.name) return
  const r = await $fetch(`${baseUrl}/api/authentication/graphql`, {
    method: 'POST',
    body: { query: 'mutation($name:String!,$domain:String,$logoUrl:String){ createInstitution(name:$name,domain:$domain,logoUrl:$logoUrl){ id } }', variables: form }
  })
  await list()
  form.name=''; form.domain=''; form.logoUrl=''
}
onMounted(list)


definePageMeta({ alias: ['/institutions'] })
</script>
