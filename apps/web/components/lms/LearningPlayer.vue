<template>
  <a-row :gutter="[16,16]">
    <a-col :xs="24" :lg="16">
      <a-card class="player-card" :title="current?.title || 'Lesson'">
        <div class="video-wrap">
          <video v-if="current?.videoUrl" :src="current.videoUrl" controls style="width:100%"></video>
          <div v-else class="video-placeholder">No video available</div>
        </div>
        <a-typography-paragraph style="margin-top:12px">{{ current?.description }}</a-typography-paragraph>
        <a-space>
          <a-button :disabled="!prev" @click="goPrev">Prev</a-button>
          <a-button type="primary" :disabled="!next" @click="goNext">Next</a-button>
          <a-button @click="markDone">Mark complete</a-button>
          <NuxtLink :to="quizLink"><a-button ghost>Take quiz</a-button></NuxtLink>
        </a-space>
      </a-card>
    </a-col>
    <a-col :xs="24" :lg="8">
      <a-card title="Course content">
        <a-steps direction="vertical" :current="activeIndex">
          <a-step v-for="(l,idx) in lessons" :key="l.id" :title="l.title" @click="goIdx(idx)" />
        </a-steps>
        <a-divider />
        <a-progress :percent="progress" />
      </a-card>
    </a-col>
  </a-row>
</template>
<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLessons } from '~/composables/useLessons'
import { useSdk } from '~/composables/useSdk'
import { message } from 'ant-design-vue'
const route = useRoute()
const router = useRouter()
const sdk = useSdk()
const courseId = String(route.params.courseId)
const { lessons, activeIndex, current, next, prev, initFromCourse, setActive, progress } = useLessons(courseId)
const quizLink = computed(()=> `/learn/${courseId}/quiz/main`)
onMounted(async()=>{
  // Load existing progress
  try{ const p:any = await $fetch(`/plugins/students-internal/api/progress/${courseId}`); if (Array.isArray(p?.completed) && p.completed.length>0){ setActive(Math.min(p.completed.length, lessons.value.length-1)) } }catch{}

  try{
    const c:any = await sdk.getCourse(courseId)
    initFromCourse(c)
    const idx = lessons.value.findIndex(l=> String(l.id) === String(route.query.lessonId || ''))
    if (idx>=0) setActive(idx)
  }catch(e){
    initFromCourse({ sections:[{ title:'Intro', items:[{ id:'l1', title:'Welcome', description:'', videoUrl:'' }]}] })
  }
})
function goIdx(i:number){ setActive(i); router.replace({ query: { lessonId: lessons.value[i].id } }) }
function goPrev(){ if (prev.value!=null) goIdx(prev.value) }
function goNext(){ if (next.value!=null) goIdx(next.value) }
async function markDone(){
  try{
    await $fetch('/plugins/students-internal/api/progress', { method:'POST', body:{ courseId, lessonId: current.value?.id, total: lessons.value.length } })
    message.success('Marked complete')
  }catch{ message.error('Could not save progress') }
}
</script>
<style scoped>
.video-wrap{ background:#000; min-height:280px; display:flex; align-items:center; justify-content:center; }
.video-placeholder{ color:#fff; padding:24px; }
</style>
