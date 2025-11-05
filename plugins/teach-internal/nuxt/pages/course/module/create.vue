<template>
  <a-layout class="module-create-layout">
    <a-page-header
      title="Create New Module"
      :sub-title="courseTitle"
      class="page-header"
      @back="goBack"
    >
      <template #avatar>
        <a-avatar :src="teacher.avatar" />
      </template>
      <template #extra>
        <a-space>
          <a-button @click="openTemplates"><file-add-outlined /> Templates</a-button>
          <a-button @click="openBulkAdd"><copy-outlined /> Bulk add</a-button>
          <a-button @click="saveDraft"><save-outlined /> Save draft</a-button>
          <a-button type="primary" @click="saveModule"><check-outlined /> Save module</a-button>
        </a-space>
      </template>
    </a-page-header>

    <div class="restore" v-if="restored">
      <a-alert
        type="info"
        show-icon
        message="Draft restored"
        description="We found a saved draft for this module and restored it."
        closable
        @close="restored=false"
      />
    </div>

    <a-card class="form-card" bordered>
      <a-form layout="vertical" :model="moduleData">
        <a-form-item label="Module Title" name="title" :rules="[{ required: true, message: 'Title is required' }]">
          <a-input v-model:value="moduleData.title" placeholder="e.g. Composition API Basics" />
        </a-form-item>

        <a-row :gutter="16">
          <a-col :xs="24" :md="16">
            <a-form-item label="Description">
              <a-textarea v-model:value="moduleData.description" rows="3" placeholder="What will students learn in this module?" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="8">
            <a-form-item label="Learning Objectives (tags)">
              <a-select
                v-model:value="moduleData.objectives"
                mode="tags"
                placeholder="Add objectives (press Enter)"
                :token-separators="[',']"
              />
            </a-form-item>
            <a-form-item label="Visibility">
              <a-switch v-model:checked="moduleData.isPublic" checked-children="Public" un-checked-children="Private" />
            </a-form-item>
            <a-form-item label="Module Availability">
              <a-date-picker
                v-model:value="moduleData.unlockAt"
                show-time
                style="width:100%"
                placeholder="Optional unlock date/time"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider orientation="left">Lessons <span class="muted">({{ moduleData.lessons.length }})</span></a-divider>

        <a-space style="margin-bottom:12px;" wrap>
          <a-button type="dashed" @click="addLesson()"><plus-outlined /> Add lesson</a-button>
          <a-button @click="expandAll">Expand all</a-button>
          <a-button @click="collapseAll">Collapse all</a-button>
          <a-tag color="blue">Total time: {{ totalMinutes }} min</a-tag>
        </a-space>

        <a-collapse v-model:activeKey="activePanels">
          <a-collapse-panel
            v-for="(lesson, idx) in moduleData.lessons"
            :key="lesson.id"
            :header="panelTitle(lesson, idx)"
          >
            <a-row :gutter="16">
              <a-col :xs="24" :md="16">
                <a-form layout="vertical">
                  <a-form-item label="Title" :rules="[{ required: true, message: 'Lesson title is required' }]">
                    <a-input v-model:value="lesson.title" placeholder="e.g. Reactive primitives" />
                  </a-form-item>

                  <a-form-item label="Type">
                    <a-select v-model:value="lesson.type" style="width:100%">
                      <a-select-option value="video"><video-camera-outlined /> Video</a-select-option>
                      <a-select-option value="reading"><read-outlined /> Reading</a-select-option>
                      <a-select-option value="quiz"><question-circle-outlined /> Quiz</a-select-option>
                      <a-select-option value="assignment"><paper-clip-outlined /> Assignment</a-select-option>
                    </a-select>
                  </a-form-item>

                  <!-- Type-specific fields -->
                  <template v-if="lesson.type==='video'">
                    <a-form-item label="Video URL">
                      <a-input v-model:value="lesson.videoUrl" placeholder="https://..." />
                    </a-form-item>
                    <a-form-item label="Transcript / Notes">
                      <a-textarea v-model:value="lesson.content" rows="4" />
                    </a-form-item>
                  </template>

                  <template v-else-if="lesson.type==='reading'">
                    <a-form-item label="Article / Notes">
                      <a-textarea v-model:value="lesson.content" rows="6" placeholder="Paste or write the reading content..." />
                    </a-form-item>
                  </template>

                  <template v-else-if="lesson.type==='assignment'">
                    <a-form-item label="Brief">
                      <a-textarea v-model:value="lesson.content" rows="4" placeholder="Describe the task students must complete" />
                    </a-form-item>
                    <a-form-item label="Rubric (optional)">
                      <a-textarea v-model:value="lesson.rubric" rows="3" placeholder="How will you grade it?" />
                    </a-form-item>
                  </template>

                  <template v-else-if="lesson.type==='quiz'">
                    <a-divider orientation="left">Questions</a-divider>
                    <div v-for="(q, qIdx) in lesson.quiz.questions" :key="q.id" class="quiz-q">
                      <a-card size="small" :title="`Q${qIdx+1}`" style="margin-bottom:8px">
                        <a-form layout="vertical">
                          <a-form-item label="Question">
                            <a-input v-model:value="q.text" />
                          </a-form-item>
                          <a-form-item label="Type">
                            <a-select v-model:value="q.type" style="width:100%">
                              <a-select-option value="mcq">Multiple choice</a-select-option>
                              <a-select-option value="tf">True/False</a-select-option>
                              <a-select-option value="short">Short answer</a-select-option>
                            </a-select>
                          </a-form-item>

                          <template v-if="q.type==='mcq'">
                            <a-form-item label="Options">
                              <div v-for="(opt, oIdx) in q.options" :key="oIdx" class="mcq-opt">
                                <a-input v-model:value="opt.text" style="width:70%" placeholder="Option text" />
                                <a-checkbox v-model:checked="opt.correct" style="margin-left:8px">Correct</a-checkbox>
                                <a-button danger type="text" @click="removeOption(idx,qIdx,oIdx)"><delete-outlined /></a-button>
                              </div>
                              <a-button size="small" type="dashed" @click="addOption(idx,qIdx)" style="margin-top:6px">
                                <plus-outlined /> Add option
                              </a-button>
                            </a-form-item>
                          </template>

                          <div class="row-right">
                            <a-space>
                              <a-button size="small" @click="moveQuestion(idx,qIdx,-1)"><arrow-up-outlined /></a-button>
                              <a-button size="small" @click="moveQuestion(idx,qIdx,1)"><arrow-down-outlined /></a-button>
                              <a-button size="small" danger @click="removeQuestion(idx,qIdx)"><delete-outlined /></a-button>
                            </a-space>
                          </div>
                        </a-form>
                      </a-card>
                    </div>
                    <a-button type="dashed" size="small" @click="addQuestion(idx)"><plus-outlined /> Add question</a-button>
                  </template>
                </a-form>
              </a-col>

              <a-col :xs="24" :md="8">
                <a-form layout="vertical">
                  <a-form-item label="Estimated Time (min)">
                    <a-input-number v-model:value="lesson.duration" :min="1" :max="600" style="width:100%" />
                  </a-form-item>
                  <a-form-item label="Prerequisite lessons (IDs)">
                    <a-select
                      v-model:value="lesson.prerequisites"
                      mode="multiple"
                      :options="prereqOptions(idx)"
                      placeholder="Optional"
                    />
                  </a-form-item>
                  <a-form-item label="Tags">
                    <a-select v-model:value="lesson.tags" mode="tags" placeholder="Add tags" />
                  </a-form-item>
                  <a-form-item label="Availability">
                    <a-date-picker v-model:value="lesson.unlockAt" show-time style="width:100%" placeholder="Optional" />
                  </a-form-item>

                  <a-form-item label="Resources (links)">
                    <div v-for="(r, rIdx) in lesson.resources" :key="rIdx" class="resource-row">
                      <a-input v-model:value="r.title" placeholder="Title" style="width:35%" />
                      <a-input v-model:value="r.url" placeholder="https://…" style="width:55%;margin-left:8px" />
                      <a-button type="text" danger @click="removeResource(idx,rIdx)"><delete-outlined /></a-button>
                    </div>
                    <a-button size="small" type="dashed" @click="addResource(idx)" style="margin-top:6px">
                      <plus-outlined /> Add resource
                    </a-button>
                  </a-form-item>

                  <a-form-item label="Attachments">
                    <a-upload
                      v-model:file-list="lesson.attachments"
                      :before-upload="() => false"
                      :multiple="true"
                    >
                      <a-button size="small"><paper-clip-outlined /> Add files</a-button>
                    </a-upload>
                  </a-form-item>

                  <div class="row-right">
                    <a-space>
                      <a-button @click="duplicateLesson(idx)"><copy-outlined /> Duplicate</a-button>
                      <a-button @click="previewLesson(lesson)"><eye-outlined /> Preview</a-button>
                      <a-button @click="moveLesson(idx,-1)"><arrow-up-outlined /></a-button>
                      <a-button @click="moveLesson(idx,1)"><arrow-down-outlined /></a-button>
                      <a-button danger @click="removeLesson(idx)"><delete-outlined /> Delete</a-button>
                    </a-space>
                  </div>
                </a-form>
              </a-col>
            </a-row>
          </a-collapse-panel>
        </a-collapse>
      </a-form>
    </a-card>

    <!-- Preview Modal -->
    <a-modal v-model:open="previewOpen" title="Student Preview" width="720px" :footer="null">
      <div v-if="previewData">
        <a-typography-title :level="4">{{ previewData.title }}</a-typography-title>
        <a-space direction="vertical" style="width:100%">
          <a-tag>{{ previewData.type }}</a-tag>
          <a-typography-text type="secondary">Estimated: {{ previewData.duration || 0 }} min</a-typography-text>
          <div v-if="previewData.type==='video' && previewData.videoUrl">
            <a-typography-text strong>Video:</a-typography-text>
            <div class="video-box">{{ previewData.videoUrl }}</div>
          </div>
          <div v-if="previewData.content">
            <a-typography-text strong>Content:</a-typography-text>
            <a-typography-paragraph>{{ previewData.content }}</a-typography-paragraph>
          </div>
          <div v-if="previewData.type==='quiz' && previewData.quiz?.questions?.length">
            <a-divider>Questions</a-divider>
            <ol style="padding-left:20px;margin:0">
              <li v-for="q in previewData.quiz.questions" :key="q.id">{{ q.text }}</li>
            </ol>
          </div>
          <div v-if="previewData.resources?.length">
            <a-divider>Resources</a-divider>
            <ul>
              <li v-for="(r, i) in previewData.resources" :key="i">
                <a :href="r.url" target="_blank">{{ r.title || r.url }}</a>
              </li>
            </ul>
          </div>
        </a-space>
      </div>
    </a-modal>

    <!-- Templates Modal -->
    <a-modal v-model:open="templatesOpen" title="Lesson templates" @ok="applyTemplate" @cancel="templatesOpen=false">
      <a-radio-group v-model:value="selectedTemplate" style="width:100%">
        <a-radio :value="'video:intro'">Intro video (goals + overview)</a-radio>
        <a-radio :value="'reading:notes'">Concept reading (definitions + examples)</a-radio>
        <a-radio :value="'quiz:checkpoint'">Checkpoint quiz (5 MCQs)</a-radio>
        <a-radio :value="'assignment:mini'">Mini assignment (15-30 min)</a-radio>
      </a-radio-group>
    </a-modal>

    <!-- Bulk Add Modal -->
    <a-modal v-model:open="bulkOpen" title="Bulk add lessons" @ok="confirmBulkAdd" @cancel="bulkOpen=false" ok-text="Create">
      <a-typography-paragraph>
        Paste lines like: <code>Video | Composition API intro | 8</code> (Type | Title | Minutes). One per line.
      </a-typography-paragraph>
      <a-textarea v-model:value="bulkText" rows="6" placeholder="Video | Setup dev env | 6&#10;Reading | Reactivity notes | 10" />
    </a-modal>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRoute } from '#imports'
import {
  PlusOutlined,
  SaveOutlined,
  CheckOutlined,
  CopyOutlined,
  DeleteOutlined,
  EyeOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  VideoCameraOutlined,
  ReadOutlined,
  PaperClipOutlined,
  QuestionCircleOutlined,
  FileAddOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

// ---- Context (SSR-safe) ----
const route = useRoute()
const teacherId = (route.params as any).teacher_id || 'unknown'
const courseId = (route.query as any).course_id || 'draft'
const courseTitle = ref('Advanced Vue 3 Workshop')
const teacher = { avatar: '/instructors/theresa.jpg' }

// ---- Module state ----
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

const moduleData = reactive({
  title: '',
  description: '',
  objectives: [] as string[],
  isPublic: true,
  unlockAt: null as any,
  lessons: [] as Lesson[],
})

const activePanels = ref<(string|number)[]>([])
const previewOpen = ref(false)
const previewData = ref<Lesson | null>(null)
const templatesOpen = ref(false)
const selectedTemplate = ref<string>('video:intro')
const bulkOpen = ref(false)
const bulkText = ref('')
const restored = ref(false)

// ---- Helpers ----
const uid = () => Math.random().toString(36).slice(2)
const totalMinutes = computed(() => moduleData.lessons.reduce((t, l) => t + (Number(l.duration)||0), 0))
const panelTitle = (lesson: Lesson, idx: number) => `#${idx+1} · ${lesson.type} · ${lesson.title || 'Untitled'} · ${lesson.duration||0} min`

const addLesson = (preset?: Partial<Lesson>) => {
  const base: Lesson = {
    id: uid(),
    title: '',
    type: 'video',
    duration: 5,
    content: '',
    videoUrl: '',
    rubric: '',
    resources: [],
    attachments: [],
    tags: [],
    prerequisites: [],
    unlockAt: null,
    quiz: { questions: [] }
  }
  const newLesson = Object.assign(base, preset || {})
  moduleData.lessons.push(newLesson)
  activePanels.value = [...activePanels.value, newLesson.id]
}

const duplicateLesson = (idx: number) => {
  const copy = JSON.parse(JSON.stringify(moduleData.lessons[idx])) as Lesson
  copy.id = uid()
  copy.title = copy.title ? `${copy.title} (copy)` : 'Untitled (copy)'
  moduleData.lessons.splice(idx+1, 0, copy)
  activePanels.value = [...activePanels.value, copy.id]
}

const removeLesson = (idx: number) => moduleData.lessons.splice(idx, 1)
const moveLesson = (idx: number, dir: number) => {
  const to = idx + dir
  if (to < 0 || to >= moduleData.lessons.length) return
  const [l] = moduleData.lessons.splice(idx, 1)
  moduleData.lessons.splice(to, 0, l)
}

const prereqOptions = (idx: number) =>
  moduleData.lessons
    .map((l, i) => ({ label: `#${i+1} ${l.title || 'Untitled'}`, value: l.id }))
    .filter((_, i) => i < idx) // only previous lessons

const previewLesson = (l: Lesson) => { previewData.value = l; previewOpen.value = true }

// ---- Quiz ops ----
const addQuestion = (lIdx: number) => {
  moduleData.lessons[lIdx].quiz?.questions.push({ id: uid(), text: '', type: 'mcq', options: [{ text:'', correct:false }] })
}
const removeQuestion = (lIdx: number, qIdx: number) => moduleData.lessons[lIdx].quiz?.questions.splice(qIdx,1)
const moveQuestion = (lIdx: number, qIdx: number, dir: number) => {
  const qs = moduleData.lessons[lIdx].quiz?.questions || []
  const to = qIdx + dir
  if (to < 0 || to >= qs.length) return
  const [q] = qs.splice(qIdx,1)
  qs.splice(to,0,q)
}
const addOption = (lIdx: number, qIdx: number) => moduleData.lessons[lIdx].quiz?.questions[qIdx].options.push({ text:'', correct:false })
const removeOption = (lIdx: number, qIdx: number, oIdx: number) => moduleData.lessons[lIdx].quiz?.questions[qIdx].options.splice(oIdx,1)

// ---- Resources ----
const addResource = (lIdx: number) => moduleData.lessons[lIdx].resources.push({ title:'', url:'' })
const removeResource = (lIdx: number, rIdx: number) => moduleData.lessons[lIdx].resources.splice(rIdx,1)

// ---- Collapse helpers ----
const expandAll = () => activePanels.value = moduleData.lessons.map(l => l.id)
const collapseAll = () => activePanels.value = []

// ---- Templates ----
const openTemplates = () => { templatesOpen.value = true }
const applyTemplate = () => {
  const [type, key] = selectedTemplate.value.split(':')
  if (type === 'video' && key === 'intro') {
    addLesson({
      type: 'video',
      title: 'Module intro & goals',
      duration: 6,
      content: 'What we will build, key concepts, how to succeed.',
    })
  }
  if (type === 'reading' && key === 'notes') {
    addLesson({
      type: 'reading',
      title: 'Concept notes',
      duration: 10,
      content: 'Definitions, examples, pitfalls, and quick checks.',
    })
  }
  if (type === 'quiz' && key === 'checkpoint') {
    addLesson({
      type: 'quiz',
      title: 'Checkpoint quiz',
      duration: 8,
      quiz: { questions: Array.from({ length: 5 }).map(() => ({ id: uid(), text:'Question text', type:'mcq', options:[{text:'A',correct:true},{text:'B',correct:false}] })) }
    })
  }
  if (type === 'assignment' && key === 'mini') {
    addLesson({
      type: 'assignment',
      title: 'Mini assignment',
      duration: 20,
      content: 'Build a small feature using today’s concept.',
      rubric: '✅ Completeness, ✅ Correctness, ✅ Clarity',
    })
  }
  templatesOpen.value = false
}

// ---- Bulk add ----
const openBulkAdd = () => { bulkOpen.value = true; bulkText.value='' }
const confirmBulkAdd = () => {
  const lines = bulkText.value.split('\n').map(l => l.trim()).filter(Boolean)
  for (const line of lines) {
    const [typeRaw, titleRaw, minRaw] = line.split('|').map(s => (s||'').trim())
    const type = (typeRaw?.toLowerCase() as any) || 'video'
    const duration = Number(minRaw) || 5
    addLesson({ type, title: titleRaw || 'Untitled', duration })
  }
  bulkOpen.value = false
  message.success(`Added ${lines.length} lessons`)
}

// ---- Persistence (SSR-safe) ----
const STORAGE_KEY = `byway:module-draft:${teacherId}:${courseId}`

onMounted(() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      Object.assign(moduleData, parsed)
      restored.value = true
      expandAll()
    }
  } catch {}
})

watch(moduleData, (val) => {
  if (process.client) localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
}, { deep: true })

const saveDraft = () => {
  if (process.client) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(moduleData))
    message.success('Draft saved locally')
  }
}

const saveModule = () => {
  if (!moduleData.title) return message.error('Please add a module title')
  // Hook into your API here (POST).
  console.log('Saving module payload', { teacherId, courseId, moduleData })
  message.success(`Module "${moduleData.title}" saved`)
}

const goBack = () => history.back()
</script>

<style scoped>
.module-create-layout {
  background: #fafafa;
  min-height: 100vh;
  padding: 24px;
}
.page-header {
  background: #fff;
  border-radius: 8px;
  padding: 16px 24px;
}
.restore { margin: 16px 0; }
.form-card {
  margin-top: 16px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,.05);
  padding: 24px;
}
.muted { color: rgba(0,0,0,.45); }
.row-right { display:flex; justify-content:flex-end; }
.video-box {
  background:#f5f5f5; border-radius:8px; padding:8px 12px; word-break:break-all;
}
.quiz-q :deep(.ant-card-head) { min-height: 36px; padding: 0 12px; }
.mcq-opt { display:flex; align-items:center; gap:6px; margin-bottom:6px; }
.resource-row { display:flex; align-items:center; margin-bottom:6px; }
</style>
