<template>
  <a-space direction="vertical" size="large" style="width:100%">
    <a-page-header :title="course.title || 'Course builder'">
      <template #extra>
        <a-space>
          <a-button @click="save" type="primary" :loading="saving">Save</a-button>
          <a-button @click="preview">Preview</a-button>
        </a-space>
      </template>
    </a-page-header>

    <a-row :gutter="[16,16]">
      <a-col :xs="24" :lg="16">
        <a-card title="Curriculum">
          <a-space direction="vertical" style="width:100%">
            <a-list :data-source="course.sections">
              <template #header>
                <a-space>
                  <a-input v-model:value="newSection" placeholder="New section title" style="width:260px" />
                  <a-button @click="addSection" :disabled="!newSection">Add section</a-button>
                </a-space>
              </template>
              <template #renderItem="{ item:sec, index:sIdx }">
                <a-list-item>
                  <a-typography-title :level="4" style="margin:0">{{ sec.title }}</a-typography-title>
                  <a-list :data-source="sec.items">
                    <template #header>
                      <a-space>
                        <a-input v-model:value="newLesson[sIdx]" placeholder="New lesson title" style="width:260px" />
                        <a-button @click="addLesson(sIdx)" :disabled="!newLesson[sIdx]">Add lesson</a-button>
                      </a-space>
                    </template>
                    <template #renderItem="{ item:lsn, index:lIdx }">
                      <a-list-item>
                        <a-space>
                          <a-input v-model:value="lsn.title" style="width:260px" />
                          <a-input v-model:value="lsn.duration" style="width:120px" placeholder="e.g. 8m" />
                          <a-switch v-model:checked="lsn.preview" checked-children="Preview" un-checked-children="Private" />
                          <a-button size="small" danger @click="removeLesson(sIdx, lIdx)">Remove</a-button>
                        </a-space>
                      </a-list-item>
                    </template>
                  </a-list>
                </a-list-item>
              </template>
            </a-list>
          </a-space>
        </a-card>
      </a-col>
      <a-col :xs="24" :lg="8">
        <a-card title="Course settings">
          <a-form layout="vertical">
            <a-form-item label="Title"><a-input v-model:value="course.title" /></a-form-item>
            <a-form-item label="Subtitle"><a-input v-model:value="course.subtitle" /></a-form-item>
            <a-form-item label="Category"><a-input v-model:value="course.category" /></a-form-item>
            <a-form-item label="Price (€)"><a-input-number v-model:value="course.price" :min="0" style="width:100%" /></a-form-item>
          </a-form>
          <a-divider />
          <a-space>
            <a-button @click="publish" type="primary">Publish</a-button>
            <a-button @click="unpublish">Unpublish</a-button>
          </a-space>
        </a-card>
      </a-col>
    </a-row>
  </a-space>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const id = String(route.params.id)
const saving = ref(false)
const course = ref<any>({ id, title:'', subtitle:'', category:'', price:0, sections: [] })
const newSection = ref('')
const newLesson = ref<Record<number,string>>({})

onMounted(async()=>{
  try{ const res:any = await $fetch(`/plugins/teach-internal/api/course/${id}`); course.value = res }
  catch{}
})

function addSection(){
  course.value.sections.push({ title: newSection.value, items: [] })
  newSection.value = ''
}
function addLesson(sIdx:number){
  const title = newLesson.value[sIdx]
  if (!title) return
  course.value.sections[sIdx].items.push({ id: `l${Date.now()}`, title, duration:'5m', preview:false })
  newLesson.value[sIdx] = ''
}
function removeLesson(sIdx:number, lIdx:number){
  course.value.sections[sIdx].items.splice(lIdx,1)
}

async function save(){
  saving.value = true
  try{
    await $fetch(`/plugins/teach-internal/api/course/${id}`, { method:'PUT', body: course.value })
  } finally {
    saving.value = false
  }
}

async function publish(){ await $fetch(`/plugins/teach-internal/api/course/${id}/publish`, { method:'POST' }) }
async function unpublish(){ await $fetch(`/plugins/teach-internal/api/course/${id}/unpublish`, { method:'POST' }) }
function preview(){ window.open(`/course/${id}`, '_blank') }
</script>
