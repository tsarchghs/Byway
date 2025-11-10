<template>
  <a-space direction="vertical" style="width:100%" size="large">
    <a-typography-title :level="2">Curriculum Editor</a-typography-title>
    <a-row :gutter="[16,16]">
      <a-col :xs="24" :lg="16">
        <a-card>
          <a-form layout="vertical" @finish="save">
            <a-form-item label="Section title">
              <a-input v-model:value="form.section" />
            </a-form-item>
            <a-form-item label="Lesson title">
              <a-input v-model:value="form.lesson" />
            </a-form-item>
            <a-form-item label="Duration (min)">
              <a-input-number v-model:value="form.duration" style="width:100%" />
            </a-form-item>
            <a-button type="primary" html-type="submit">Add lesson</a-button>
          </a-form>
          <a-divider />
          <a-list :data-source="sections">
            <template #renderItem="{ item, index }">
              <a-list-item>
                <a-typography-text strong>{{ item.title }}</a-typography-text>
                <a-list :data-source="item.items">
                  <template #renderItem="{ item: l }">
                    <a-list-item>{{ l.title }} • {{ l.duration }}m</a-list-item>
                  </template>
                </a-list>
              </a-list-item>
            </template>
          </a-list>
        </a-card>
      </a-col>
      <a-col :xs="24" :lg="8">
        <a-card title="Actions">
          <a-space direction="vertical" style="width:100%">
            <a-button type="primary" @click="persist">Save curriculum</a-button>
            <a-button @click="$router.push('/teach/courses')">Back to courses</a-button>
          </a-space>
        </a-card>
      </a-col>
    </a-row>
  </a-space>
</template>
<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const courseId = String(route.params.id||'new')

const form = reactive({ section:'', lesson:'', duration:10 })
const sections = ref<any[]>([
  { title:'Introduction', items: [] }
])

function save(){
  const sec = sections.value.find(s=> s.title === form.section) || (sections.value.push({ title: form.section, items: []}), sections.value[sections.value.length-1])
  sec.items.push({ title: form.lesson, duration: form.duration })
  form.lesson = ''; form.duration = 10
}

async function persist(){
  try{
    await $fetch('/plugins/teach-internal/api/curriculum', { method: 'POST', body: { courseId, sections: sections.value } })
  }catch(e){}
}

onMounted(async()=>{
  try{
    const res:any = await $fetch('/plugins/teach-internal/api/curriculum', { query: { courseId } })
    if (res.sections) sections.value = res.sections
  }catch(e){}
})
</script>
