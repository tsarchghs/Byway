<template>
  <a-layout class="module-learn-layout">
    <!-- HEADER -->
    <a-page-header
      class="page-header"
      :title="module.title || 'Module'"
      :sub-title="courseTitle"
      @back="goBack"
    >
      <template #tags>
        <a-tag v-for="t in module.objectives" :key="t">{{ t }}</a-tag>
        <a-tag v-if="totalMinutes" color="blue"><FieldTimeOutlined /> {{ totalMinutes }} min</a-tag>
      </template>
      <template #extra>
        <a-space>
          <a-button @click="notesOpen = true"><FileTextOutlined /> Notes</a-button>
          <a-button @click="resourcesOpen = true"><PaperClipOutlined /> Resources</a-button>
          <a-button type="primary" @click="goStartOrNext">
            <PlayCircleOutlined /> {{ nextCta }}
          </a-button>
        </a-space>
      </template>
    </a-page-header>

    <!-- BODY -->
    <a-layout class="body">
      <!-- SIDEBAR -->
      <a-layout-sider
        width="320"
        collapsible
        v-model:collapsed="collapsed"
        class="lesson-sider"
      >
        <div class="sider-top" v-if="!collapsed">
          <a-progress
            type="circle"
            :percent="progressPercent"
            :width="86"
          />
          <div class="sider-meta">
            <div class="pct">{{ progressPercent }}% complete</div>
            <div class="count">{{ doneCount }} / {{ module.lessons.length }} lessons</div>
          </div>
        </div>

        <a-divider v-if="!collapsed" style="margin:12px 0" />

        <div class="lesson-list">
<a-list :data-source="module.lessons">
  <template #renderItem="{ item, index }">
    <RenderLessonItem
      :item="item"
      :index="index"
      :locked="isLocked(item)"
      :done="isDone(item.id)"
      :is-active="currentId === item.id"
      @select="goTo"
    />
  </template>
</a-list>

        </div>
      </a-layout-sider>

      <!-- CONTENT -->
      <a-layout-content class="content">
        <template v-if="current">
          <!-- Locked gate -->
          <a-result
            v-if="isLocked(current)"
            status="warning"
            title="This lesson is locked"
            :sub-title="lockedReason(current)"
          >
            <template #extra>
              <a-button type="primary" @click="goStartOrNext">Go to next available</a-button>
            </template>
          </a-result>

          <template v-else>
            <div class="lesson-head">
              <div class="lh-left">
                <a-tag>{{ current.type }}</a-tag>
                <h2 class="lesson-title">{{ current.title || 'Untitled lesson' }}</h2>
                <div class="muted">
                  <FieldTimeOutlined /> {{ Number(current.duration) || 0 }} min
                </div>
              </div>
              <div class="lh-right">
                <a-space>
                  <a-button @click="notesOpen = true"><FileTextOutlined /> Notes</a-button>
                  <a-button @click="resourcesOpen = true"><PaperClipOutlined /> Resources</a-button>
                  <a-button
                    :type="isDone(current.id) ? 'default' : 'primary'"
                    @click="toggleDone(current.id)"
                  >
                    <template v-if="isDone(current.id)">
                      <CheckCircleTwoTone two-tone-color="#52c41a" /> Completed
                    </template>
                    <template v-else>
                      <CheckOutlined /> Mark complete
                    </template>
                  </a-button>
                </a-space>
              </div>
            </div>

            <!-- VIEWER -->
            <a-card class="viewer" :bordered="false">
              <!-- VIDEO -->
              <template v-if="current.type === 'video'">
                <div v-if="ytEmbed(current.videoUrl)" class="video-wrap">
                  <iframe
                    :src="ytEmbed(current.videoUrl)"
                    frameborder="0"
                    allowfullscreen
                    title="Lesson video"
                  />
                </div>
                <div v-else class="video-fallback">
                  <a-typography-paragraph>
                    Video URL: <a :href="current.videoUrl" target="_blank">{{ current.videoUrl || '—' }}</a>
                  </a-typography-paragraph>
                </div>
                <a-divider>Notes</a-divider>
                <a-typography-paragraph style="white-space:pre-wrap">{{ current.content }}</a-typography-paragraph>
              </template>

              <!-- READING -->
              <template v-else-if="current.type === 'reading'">
                <a-typography-paragraph style="white-space:pre-wrap">
                  {{ current.content || 'No content provided.' }}
                </a-typography-paragraph>
              </template>

              <!-- ASSIGNMENT -->
              <template v-else-if="current.type === 'assignment'">
                <a-typography-paragraph style="white-space:pre-wrap">
                  {{ current.content || 'No brief provided.' }}
                </a-typography-paragraph>
                <a-alert v-if="current.rubric" type="info" show-icon :message="'Rubric'" :description="current.rubric" style="margin:12px 0" />
                <a-form layout="vertical" @finish="submitAssignment(current.id)">
                  <a-form-item label="Submit a link to your work">
                    <a-input v-model:value="assignmentLinks[current.id]" placeholder="https://…" />
                  </a-form-item>
                  <a-space>
                    <a-button type="primary" html-type="submit">Submit</a-button>
                    <a-typography-text type="secondary" v-if="assignmentSubmitted(current.id)">
                      Submitted ✔
                    </a-typography-text>
                  </a-space>
                </a-form>
              </template>

              <!-- QUIZ -->
              <template v-else-if="current.type === 'quiz'">
                <a-alert
                  type="info"
                  show-icon
                  message="Checkpoint"
                  description="Answer MCQs for a score. True/False and Short are self-check (counted as answered)."
                  style="margin-bottom:12px"
                />
                <div v-for="(q, qIdx) in (current.quiz?.questions || [])" :key="q.id" class="quiz-item">
                  <a-card :title="`Q${qIdx+1}`" size="small" style="margin-bottom:8px">
                    <div class="q-text">{{ q.text || 'Question' }}</div>

                    <!-- MCQ -->
                    <div v-if="q.type === 'mcq'">
<a-radio-group
  :value="getAnswer(current.id, q.id)"
  @update:value="setAnswer(current.id, q.id, $event)"
  style="width:100%"
>
  <div v-for="(opt, oi) in q.options" :key="oi" class="mcq-row">
    <a-radio :value="oi">{{ opt.text || `Option ${oi + 1}` }}</a-radio>
  </div>
</a-radio-group>

                    </div>

                    <!-- True/False -->
<!-- True/False -->
<div v-else-if="q.type === 'tf'">
  <a-radio-group :value="getAnswer(current.id, q.id)"">
    <a-radio value="T">True</a-radio>
    <a-radio value="F">False</a-radio>
  </a-radio-group>
</div>

<!-- Short -->
<div v-else>
  <a-input
    @update:value="setAnswer(current.id, q.id, $event)""
    placeholder="Your answer"
  />
</div>

                  </a-card>
                </div>

                <a-space>
                  <a-button type="primary" @click="gradeCurrentQuiz">Submit quiz</a-button>
                  <a-typography-text v-if="quizScores[current.id]">
                    Score: {{ quizScores[current.id].score }}/{{ quizScores[current.id].total }}
                    <span v-if="quizScores[current.id].passed"> — Passed ✔</span>
                  </a-typography-text>
                </a-space>
              </template>
            </a-card>

            <!-- RESOURCES inline (quick access) -->
            <div v-if="(current.resources && current.resources.length) || (current.attachments && current.attachments.length)" class="resources-inline">
              <a-divider>Resources</a-divider>
              <ul class="res-list" v-if="current.resources?.length">
                <li v-for="(r, i) in current.resources" :key="i">
                  <a :href="r.url" target="_blank">{{ r.title || r.url }}</a>
                </li>
              </ul>
              <div v-if="current.attachments?.length" class="muted">
                {{ current.attachments.length }} attachment(s) available (see drawer)
              </div>
            </div>

            <!-- NAV -->
            <div class="lesson-nav">
              <a-space>
                <a-button :disabled="!prevId" @click="goTo(prevId)"><ArrowLeftOutlined /> Previous</a-button>
                <a-button :disabled="!nextId" type="primary" @click="goTo(nextId)">Next <ArrowRightOutlined /></a-button>
              </a-space>
            </div>
          </template>
        </template>

        <a-empty v-else description="No lessons in this module" />
      </a-layout-content>
    </a-layout>

    <!-- RESOURCES DRAWER -->
    <a-drawer v-model:open="resourcesOpen" title="Resources & Attachments" placement="right" :width="420">
      <div v-if="current">
        <a-typography-title :level="5">For: {{ current.title || 'Lesson' }}</a-typography-title>
        <a-divider />
        <a-typography-title :level="5">Links</a-typography-title>
        <a-empty v-if="!current.resources?.length" description="No links" />
        <a-list v-else :data-source="current.resources" bordered>
          <template #renderItem="{ item }">
            <a-list-item>
              <a :href="item.url" target="_blank">
                <LinkOutlined /> {{ item.title || item.url }}
              </a>
            </a-list-item>
          </template>
        </a-list>

        <a-divider />
        <a-typography-title :level="5">Attachments</a-typography-title>
        <a-empty v-if="!current.attachments?.length" description="No attachments" />
        <a-list v-else :data-source="current.attachments" bordered>
          <template #renderItem="{ item }">
            <a-list-item>
              <PaperClipOutlined />
              <span style="margin-left:8px">{{ item.name || 'Attachment' }}</span>
            </a-list-item>
          </template>
        </a-list>
      </div>
    </a-drawer>

    <!-- NOTES DRAWER -->
    <a-drawer v-model:open="notesOpen" title="My notes" placement="right" :width="420">
      <a-typography-text type="secondary" v-if="!current">Open a lesson to take notes.</a-typography-text>
      <template v-else>
        <a-typography-title :level="5">{{ current.title }}</a-typography-title>
        <a-textarea
          v-model:value="notes[current.id]"
          :rows="12"
          placeholder="Write your personal notes here…"
          @change="persist()"
        />
        <div style="margin-top:8px" class="muted">Saved locally.</div>
      </template>
    </a-drawer>

    <!-- MODULE COMPLETE -->
    <a-modal v-model:open="moduleDoneOpen" title="Module finished 🎉" :footer="null">
      <a-result
        status="success"
        title="Great job!"
        :sub-title="`You’ve completed ${module.lessons.length} lessons.`"
      />
    </a-modal>
  </a-layout>
</template>

<script setup lang="ts">
import RenderLessonItem from '../components/RenderLessonItem.vue';
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  PlayCircleOutlined,
  CheckOutlined,
  CheckCircleTwoTone,
  LockOutlined,
  FieldTimeOutlined,
  PaperClipOutlined,
  FileTextOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  ReadOutlined,
  VideoCameraOutlined,
  QuestionCircleOutlined,
  LinkOutlined,
  BookOutlined,
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
const getAnswer = (lessonId: string, qid: string) => {
  return quizAnswers.value?.[lessonId]?.[qid] ?? ''
}

const setAnswer = (lessonId: string, qid: string, val: any) => {
  if (!quizAnswers.value[lessonId]) quizAnswers.value[lessonId] = {}
  quizAnswers.value[lessonId][qid] = val
}

/** ---------- Types (mirror your builder) ---------- */
type QuizOption = { text: string; correct: boolean }
type QuizQuestion = { id: string; text: string; type: 'mcq'|'tf'|'short'; options: QuizOption[] }
type Lesson = {
  id: string
  title: string
  type: 'video'|'reading'|'quiz'|'assignment'
  duration: number
  content?: string
  videoUrl?: string
  rubric?: string
  resources: { title: string; url: string }[]
  attachments: any[]
  tags: string[]
  prerequisites: (string|number)[]
  unlockAt?: any
  quiz?: { questions: QuizQuestion[] }
}
type ModuleData = {
  title: string
  description?: string
  objectives: string[]
  isPublic: boolean
  unlockAt?: any
  lessons: Lesson[]
}

/** ---------- Route & Local ---------- */
const route = useRoute()
const teacherId = (route.params as any).teacher_id || 'teacher'
const courseId = (route.params as any).course_id || (route.query as any).course_id || 'course'
const moduleId = (route.params as any).module_id || 'module'
const courseTitle = ref('Advanced Vue 3 Workshop') // adapt if you have real data

const STORAGE_DRAFT_KEY = `byway:module-draft:${teacherId}:${courseId}` // reusing builder draft if present
const STORAGE_PROGRESS_KEY = `byway:module-progress:${courseId}:${moduleId}`

/** ---------- State ---------- */
const collapsed = ref(false)
const resourcesOpen = ref(false)
const notesOpen = ref(false)
const moduleDoneOpen = ref(false)

const module = reactive<ModuleData>({
  title: '',
  description: '',
  objectives: [],
  isPublic: true,
  unlockAt: null as any,
  lessons: [],
})

const currentId = ref<string | null>(null)

/** learner state */
const done = ref<Record<string, boolean>>({})
const notes = ref<Record<string, string>>({})
const quizAnswers = ref<Record<string, Record<string, any>>>({}) // lessonId -> questionId -> answer
const quizScores = ref<Record<string, { score: number; total: number; passed: boolean }>>({})
const assignmentLinks = ref<Record<string, string>>({})

/** ---------- Derived ---------- */
const totalMinutes = computed(() =>
  module.lessons.reduce((t, l) => t + (Number(l.duration) || 0), 0)
)
const doneCount = computed(() => Object.values(done.value).filter(Boolean).length)
const progressPercent = computed(() =>
  module.lessons.length ? Math.round((doneCount.value / module.lessons.length) * 100) : 0
)
const current = computed<Lesson | null>(() => module.lessons.find(l => l.id === currentId.value) || null)
const currentIdx = computed(() => module.lessons.findIndex(l => l.id === currentId.value))
const prevId = computed(() => (currentIdx.value > 0 ? module.lessons[currentIdx.value - 1].id : null))
const nextId = computed(() => (currentIdx.value >= 0 && currentIdx.value < module.lessons.length - 1
  ? module.lessons[currentIdx.value + 1].id : null))

const nextCta = computed(() => {
  const next = firstAvailableIncomplete()
  if (!next) return 'Start'
  return currentId.value === next.id ? 'Continue' : (doneCount.value ? 'Continue' : 'Start')
})

/** ---------- Helpers ---------- */
const isDone = (id: string) => !!done.value[id]

const ytEmbed = (url?: string) => {
  if (!url) return null
  const m = url.match(/(?:youtu\.be\/|v=)([A-Za-z0-9_\-]{6,})/)
  return m ? `https://www.youtube.com/embed/${m[1]}?rel=0` : null
}

const isLocked = (l: Lesson) => {
  // Unlock date
  if (l.unlockAt) {
    const t = new Date(l.unlockAt as any).getTime()
    if (!isNaN(t) && Date.now() < t) return true
  }
  // Prerequisites
  if (l.prerequisites?.length) {
    const unmet = l.prerequisites.some(pid => !done.value[String(pid)])
    if (unmet) return true
  }
  return false
}

const lockedReason = (l: Lesson) => {
  if (l.unlockAt) {
    const t = new Date(l.unlockAt as any)
    if (!isNaN(t.getTime()) && Date.now() < t.getTime()) {
      return `Unlocks at ${t.toLocaleString()}`
    }
  }
  if (l.prerequisites?.length) return 'Complete the prerequisite lessons first.'
  return 'Locked'
}

const firstAvailableIncomplete = () => {
  return module.lessons.find(l => !isLocked(l) && !isDone(l.id)) || module.lessons.find(l => !isLocked(l)) || null
}

const goTo = (id: string | null) => {
  if (!id) return
  currentId.value = id
}

const goStartOrNext = () => {
  const target = firstAvailableIncomplete() || module.lessons[0]
  if (target) goTo(target.id)
}

const toggleDone = (id: string) => {
  done.value[id] = !done.value[id]
  persist()
  if (Object.values(done.value).every(Boolean) && module.lessons.length) {
    moduleDoneOpen.value = true
  }
}

/** Quiz grading: MCQ exact match; TF/short count as answered */
const PASS_RATIO = 0.6
const gradeQuiz = (l: Lesson) => {
  const qs = l.quiz?.questions || []
  let score = 0
  let total = 0
  const answers = quizAnswers.value[l.id] || {}
  for (const q of qs) {
    if (q.type === 'mcq') {
      total++
      const chosen = answers[q.id]
      if (typeof chosen === 'number' && q.options?.[chosen]?.correct) score++
    } else {
      // consider answered if any value present
      total++
      if (answers[q.id] !== undefined && answers[q.id] !== '') score++
    }
  }
  const passed = total ? score / total >= PASS_RATIO : true
  quizScores.value[l.id] = { score, total, passed }
  if (passed) {
    done.value[l.id] = true
    message.success(`Quiz passed: ${score}/${total}`)
  } else {
    message.warning(`Quiz score: ${score}/${total} (need ${(PASS_RATIO*100)|0}% )`)
  }
  persist()
}

const gradeCurrentQuiz = () => { if (current.value) gradeQuiz(current.value) }

const assignmentSubmitted = (lessonId: string) => !!assignmentLinks.value[lessonId]
const submitAssignment = (lessonId: string) => {
  if (!assignmentLinks.value[lessonId]) return message.error('Please add a link.')
  done.value[lessonId] = true
  message.success('Assignment submitted')
  persist()
}

/** ---------- Persistence ---------- */
const persist = () => {
  if (typeof window === 'undefined') return
  const payload = {
    done: done.value,
    notes: notes.value,
    quizAnswers: quizAnswers.value,
    quizScores: quizScores.value,
    assignmentLinks: assignmentLinks.value,
    currentId: currentId.value,
  }
  localStorage.setItem(STORAGE_PROGRESS_KEY, JSON.stringify(payload))
}

const loadPersist = () => {
  if (typeof window === 'undefined') return
  const raw = localStorage.getItem(STORAGE_PROGRESS_KEY)
  if (!raw) return
  try {
    const parsed = JSON.parse(raw)
    done.value = parsed.done || {}
    notes.value = parsed.notes || {}
    quizAnswers.value = parsed.quizAnswers || {}
    quizScores.value = parsed.quizScores || {}
    assignmentLinks.value = parsed.assignmentLinks || {}
    currentId.value = parsed.currentId || null
  } catch {}
}

/** Seed module from builder draft (dev) or fallback */
const hydrateModule = () => {
  // If you provide real module data, assign it here instead
  if (process.client) {
    const draft = localStorage.getItem(STORAGE_DRAFT_KEY)
    if (draft) {
      try {
        const parsed = JSON.parse(draft)
        // keep only fields we use
        module.title = parsed.title || 'Module'
        module.description = parsed.description || ''
        module.objectives = parsed.objectives || []
        module.isPublic = parsed.isPublic ?? true
        module.unlockAt = parsed.unlockAt ?? null
        module.lessons = Array.isArray(parsed.lessons) ? parsed.lessons : []
      } catch {}
    }
  }
  // if empty, create a small demo structure
  if (!module.lessons.length) {
    module.title = 'Sample Module'
    module.objectives = ['intro', 'practice']
    module.lessons = [
      { id: 'l1', title: 'Welcome', type: 'video', duration: 5, videoUrl: 'https://youtu.be/dQw4w9WgXcQ', content: 'What you’ll learn today.', resources: [], attachments: [], tags: [], prerequisites: [] },
      { id: 'l2', title: 'Concept Notes', type: 'reading', duration: 10, content: 'Key definitions and examples.', resources: [], attachments: [], tags: [], prerequisites: [] },
      { id: 'l3', title: 'Checkpoint', type: 'quiz', duration: 7, resources: [], attachments: [], tags: [], prerequisites: [], quiz: { questions: [
        { id:'q1', text:'Pick the correct option', type:'mcq', options:[{text:'A',correct:true},{text:'B',correct:false}]}
      ]}},
      { id: 'l4', title: 'Mini Assignment', type: 'assignment', duration: 20, content: 'Build a tiny feature.', rubric: 'Completeness / Correctness / Clarity', resources: [], attachments: [], tags: [], prerequisites: ['l3'] },
    ] as Lesson[]
  }

  // Choose initial lesson
  const initial = firstAvailableIncomplete() || module.lessons[0]
  if (initial && !currentId.value) currentId.value = initial.id
}

/** ---------- Renderers ---------- */

/** ---------- Lifecycle ---------- */
onMounted(() => {
  hydrateModule()
  loadPersist()
})

watch([done, notes, quizAnswers, quizScores, assignmentLinks, currentId], persist, { deep: true })

/** ---------- Nav ---------- */
const goBack = () => history.back()
</script>

<style scoped>
.module-learn-layout {
  min-height: 100vh;
  background: #fafafa;
}
.page-header {
  background: #fff;
  border-radius: 8px;
  padding: 12px 24px;
  margin: 16px;
}
.body {
  margin: 0 16px 16px;
  background: transparent;
}
.lesson-sider {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  margin-right: 12px;
}
.sider-top {
  display: flex; align-items: center; gap: 12px; padding: 6px 6px 12px;
}
.sider-meta .pct { font-weight: 600; }
.sider-meta .count { color: rgba(0,0,0,.45); }

.lesson-list {
  max-height: calc(100vh - 260px);
  overflow: auto;
  padding-right: 4px;
}

.lesson-row { cursor: pointer; }
.lr-wrap { display:flex; align-items:center; justify-content:space-between; width:100%; }
.lr-wrap.active { background: #f5faff; border-radius: 6px; }
.lr-left { display:flex; align-items:center; gap:8px; padding:8px; }
.lr-title { font-weight: 600; }
.lr-type { text-transform: capitalize; }
.lr-min { color: rgba(0,0,0,.45); display:flex; align-items:center; gap:4px; }

.content {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  min-height: calc(100vh - 120px);
}

.lesson-head {
  display:flex; align-items:flex-start; justify-content:space-between; gap:12px; margin-bottom:8px;
}
.lesson-title { margin: 0; }
.muted { color: rgba(0,0,0,.45); }

.viewer { margin-top: 8px; }
.video-wrap { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 8px; }
.video-wrap iframe { position:absolute; top:0; left:0; width:100%; height:100%; }
.video-fallback { background:#f5f5f5; border-radius:8px; padding:8px 12px; word-break:break-all; }

.resources-inline { margin-top: 8px; }
.res-list { padding-left: 18px; }

.lesson-nav {
  margin-top: 12px;
  display:flex; justify-content:flex-end;
}

.quiz-item .q-text { margin-bottom: 8px; font-weight: 600; }
.mcq-row { padding: 6px 0; }
</style>
