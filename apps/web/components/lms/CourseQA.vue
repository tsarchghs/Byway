<template>
  <div class="qa">
    <a-list :data-source="items" item-layout="horizontal">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-comment :author="item.author" :content="item.q">
            <template #datetime>{{ new Date(item.createdAt).toLocaleString() }}</template>
            <template v-if="item.a" #actions>
              <a-comment :author="item.answerBy || 'Instructor'" :content="item.a" />
            </template>
          </a-comment>
        </a-list-item>
      </template>
    </a-list>
    <a-divider />
    <a-form layout="vertical" @finish="ask">
      <a-form-item label="Ask a question">
        <a-input-textarea v-model:value="form.q" :rows="3" />
      </a-form-item>
      <a-button type="primary" html-type="submit">Ask</a-button>
    </a-form>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
const props = defineProps<{ courseId: string }>()
const items = ref<any[]>([])
const form = ref({ q:'' })

async function load(){
  try{
    const res:any = await $fetch('/plugins/students-internal/api/qna', { query: { courseId: props.courseId } })
    items.value = res.items || []
  }catch(e){
    items.value = []
  }
}
async function ask(){
  try{
    await $fetch('/plugins/students-internal/api/qna', { method:'POST', body: { courseId: props.courseId, q: form.value.q }})
    form.value.q = ''
    await load()
  }catch(e){}
}
onMounted(load)
</script>
<style scoped>
.qa{ max-width: 800px; }
</style>
