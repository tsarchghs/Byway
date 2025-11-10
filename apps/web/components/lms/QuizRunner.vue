<template>
  <a-card :title="quiz?.title || 'Quiz'">
    <div v-if="!quiz">Loading...</div>
    <div v-else>
      <div v-for="q in quiz.questions" :key="q.id" style="margin-bottom:16px">
        <a-typography-text strong>{{ q.text }}</a-typography-text>
        <div v-if="q.type==='single'" style="margin-top:8px">
          <a-radio-group v-model:value="answers[q.id]">
            <a-radio v-for="opt in q.options" :key="opt" :value="opt">{{ opt }}</a-radio>
          </a-radio-group>
        </div>
        <div v-else-if="q.type==='multi'" style="margin-top:8px">
          <a-checkbox-group v-model:value="answers[q.id]">
            <a-checkbox v-for="opt in q.options" :key="opt" :value="opt">{{ opt }}</a-checkbox>
          </a-checkbox-group>
        </div>
        <div v-else-if="q.type==='text'" style="margin-top:8px">
          <a-input v-model:value="answers[q.id]" />
        </div>
      </div>
      <a-space>
        <a-button type="primary" @click="submit">Submit</a-button>
        <a-button @click="reset">Reset</a-button>
      </a-space>
      <a-alert v-if="score!=null" :message="`Score: ${score}/${total}`" type="success" style="margin-top:12px" />
    </div>
  </a-card>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const quizId = String(route.params.quizId)
const quiz = ref<any>(null)
const answers = ref<any>({})
const score = ref<number|null>(null)
const total = ref<number>(0)
function reset(){ answers.value = {}; score.value = null }
onMounted(async()=>{
  quiz.value = await $fetch(`/plugins/students-internal/api/quiz/${quizId}`)
  total.value = quiz.value?.questions?.length || 0
})
async function submit(){
  const payload = { quizId, answers: Object.keys(answers.value).map(k=> ({ id: k, value: answers.value[k] })) }
  const res:any = await $fetch('/plugins/students-internal/api/quiz/submit', { method: 'POST', body: payload })
  score.value = res.score; total.value = res.total
}
</script>
