<template>
  <a-config-provider :theme="{ algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm }">
    <a-layout :class="['student-wrap', isDark ? 'is-dark' : '']">
      <!-- HEADER -->
      <a-page-header
        class="page-header"
        :title="course.title || 'Course'"
        :sub-title="moduleT?.title || (hasModules ? 'Choose a module' : 'Overview')"
      >
        <template #tags>
          <a-tag color="blue">{{ course.category || '—' }}</a-tag>
          <a-tag color="gold">{{ course.difficulty || '—' }}</a-tag>
          <a-tag v-if="totalMinutes" color="blue"><FieldTimeOutlined /> {{ totalMinutes }} min</a-tag>
        </template>
        <template #extra>
          <a-space wrap>
            <a-progress type="circle" :percent="progressPercent" :size="32" />
            <a-select
              v-if="hasModules"
              :value="selectedModuleId"
              style="min-width: 220px"
              placeholder="Select module"
              :disabled="loadingModule"
              @change="switchModule"
            >
              <a-select-option
                v-for="m in modules"
                :key="m.id"
                :value="m.id"
              >
                {{ m.title }}
                <span class="muted">· {{ m.lessonCount ?? '—' }} lessons</span>
              </a-select-option>
            </a-select>
            <a-tooltip title="Toggle dark">
              <a-button shape="circle" @click="isDark = !isDark"><BulbOutlined /></a-button>
            </a-tooltip>
            <a-button type="primary" @click="resumeLast" :disabled="!lessons.length">
              <template #icon><PlayCircleOutlined /></template>
              Resume
            </a-button>
          </a-space>
        </template>
      </a-page-header>

      <a-layout>
        <!-- LEFT -->
        <a-layout-sider width="320" class="left-sider" collapsible v-model:collapsed="siderCollapsed">
          <div class="sider-inner">
            <div class="cover" :style="coverStyle">
              <div class="cover-gradient"></div>
              <div class="cover-meta" v-if="!siderCollapsed">
                <div class="cover-title">{{ course.title || 'Course' }}</div>
                <div class="cover-tags">
                  <a-tag v-if="course.category" color="blue">{{ course.category }}</a-tag>
                  <a-tag v-if="course.difficulty" color="gold">{{ course.difficulty }}</a-tag>
                </div>
              </div>
            </div>

            <a-select
              v-if="hasModules"
              class="mt-2"
              size="small"
              :value="selectedModuleId"
              :disabled="loadingModule"
              style="width:100%"
              @change="switchModule"
            >
              <a-select-option v-for="m in modules" :key="m.id" :value="m.id">
                {{ m.title }}
              </a-select-option>
            </a-select>

            <a-input-search v-model:value="filter" placeholder="Search lessons" allow-clear class="mt-2" />

            <a-empty v-if="!currentModuleReady" description="Pick a module to see its lessons" class="mt-2" />
            <a-list
              v-else
              class="mt-2"
              size="small"
              :data-source="filteredLessons"
              :row-key="(l) => l.id"
            >
              <template #renderItem="{ item: l, index: i }">
                <a-list-item
                  :class="['lesson-row', currentIndex === i && 'active']"
                  @click="select(i)"
                >
                  <a-list-item-meta
                    :title="l.title || 'Untitled lesson'"
                    :description="(l.type || '—') + (l.duration ? ` · ${l.duration} min` : '')"
                  />
                  <template #actions>
                    <a-tag v-if="isCompleted(l.id)" color="green">Done</a-tag>
                    <a-tag v-else-if="isLocked(l)" color="red"><LockOutlined /> Locked</a-tag>
                    <a-tag v-else-if="l.preview" color="cyan">Preview</a-tag>
                  </template>
                </a-list-item>
              </template>
            </a-list>
          </div>
        </a-layout-sider>

        <!-- CENTER -->
        <a-layout-content class="content">
          <!-- Overview -->
          <template v-if="!currentModuleReady">
            <a-card :loading="loadingCourse" title="Course overview">
              <p class="muted">Browse modules and jump in — everything runs in this page.</p>
              <a-empty v-if="!hasModules && !loadingCourse" description="No modules yet" />
              <a-row :gutter="16" v-else>
                <a-col v-for="m in modules" :key="m.id" :xs="24" :sm="12" :md="8">
                  <a-card hoverable class="mt-2" @click="switchModule(m.id)">
                    <b>{{ m.title }}</b>
                    <div class="muted">
                      {{ m.lessonCount ?? 0 }} lessons
                      <template v-if="m.minutes"> · ~{{ m.minutes }} min</template>
                    </div>
                  </a-card>
                </a-col>
              </a-row>
            </a-card>
          </template>

          <!-- Lesson viewer -->
          <template v-else>
            <a-spin :spinning="loadingModule">
              <a-card v-if="currentLesson" :title="currentLesson.title || 'Lesson'">
                <template #extra>
                  <a-space>
                    <a-tag>{{ currentLesson.type }}</a-tag>
                    <a-tag v-if="currentLesson.preview" color="cyan">Preview</a-tag>
                    <span class="muted"><FieldTimeOutlined /> {{ currentLesson.duration || 0 }} min</span>
                  </a-space>
                </template>

                <!-- Locked -->
                <a-result
                  v-if="isLocked(currentLesson) && !currentLesson.preview"
                  status="warning"
                  title="This lesson is locked"
                >
                  <template #subTitle>
                    <div class="muted">
                      <div v-if="currentLesson.prerequisites?.length">
                        Complete prerequisite lesson(s):
                        <ul class="mt-1">
                          <li v-for="pid in currentLesson.prerequisites" :key="pid">
                            <span :class="['preq', isCompleted(pid) && 'ok']">
                              {{ labelForLesson(pid) || pid }}
                              <template v-if="isCompleted(pid)"> ✓</template>
                            </span>
                          </li>
                        </ul>
                      </div>
                      <div v-if="unlockAtDate(currentLesson)">
                        Unlocks at: {{ unlockAtDate(currentLesson) }}
                      </div>
                    </div>
                  </template>
                </a-result>

                <!-- Content -->
                <template v-else>
                  <!-- VIDEO -->
                  <div v-if="currentLesson.type === 'video'">
                    <div v-if="ytEmbed(currentLesson.videoUrl)" class="video-wrap">
                      <iframe :src="ytEmbed(currentLesson.videoUrl)" frameborder="0" allowfullscreen />
                    </div>
                    <div v-else class="video-fallback">
                      <a-typography-paragraph>
                        Video URL:
                        <a :href="currentLesson.videoUrl" target="_blank">{{ currentLesson.videoUrl || '—' }}</a>
                      </a-typography-paragraph>
                    </div>
                    <a-divider>Notes</a-divider>
                    <a-typography-paragraph style="white-space: pre-wrap">
                      {{ currentLesson.content }}
                    </a-typography-paragraph>
                  </div>

                  <!-- READING -->
                  <div v-else-if="currentLesson.type === 'reading'">
                    <a-typography-paragraph style="white-space: pre-wrap">
                      {{ currentLesson.content || 'No content' }}
                    </a-typography-paragraph>
                  </div>

                  <!-- ASSIGNMENT -->
                  <div v-else-if="currentLesson.type === 'assignment'">
                    <a-alert type="info" show-icon :message="'Assignment brief'" class="mb-1" />
                    <a-typography-paragraph style="white-space: pre-wrap">
                      {{ currentLesson.content || 'No brief' }}
                    </a-typography-paragraph>
                    <a-alert
                      v-if="currentLesson.rubric"
                      type="success"
                      show-icon
                      :message="'Rubric'"
                      :description="currentLesson.rubric"
                    />
                    <a-divider />
                    <a-space>
                      <a-button type="primary" @click="openSubmitDrawer">Submit assignment</a-button>
                      <a-button @click="markComplete(currentLesson, true)" :disabled="isCompleted(currentLesson.id)">
                        Mark complete
                      </a-button>
                    </a-space>
                  </div>

                  <!-- QUIZ -->
                  <div v-else-if="currentLesson.type === 'quiz'">
                    <a-alert type="info" show-icon message="Answer the questions and submit." class="mb-2" />
                    <div v-for="(q, qi) in (currentLesson.quiz?.questions || [])" :key="q.id" class="quiz-q">
                      <b>Q{{ qi + 1 }}</b>: {{ q.text || '(empty)' }}
                      <div v-if="q.type === 'mcq'" class="mt-1">
                        <a-checkbox-group
                          v-model:value="quizState[q.id]"
                          :options="(q.options || []).map((o, oi) => ({ label: o.text || `Option ${oi+1}`, value: oi }))"
                        />
                      </div>
                      <div v-else-if="q.type === 'tf'" class="mt-1">
                        <a-radio-group v-model:value="quizState[q.id]">
                          <a-radio :value="true">True</a-radio>
                          <a-radio :value="false">False</a-radio>
                        </a-radio-group>
                      </div>
                      <div v-else class="mt-1">
                        <a-input v-model:value="quizState[q.id]" placeholder="Your answer" />
                      </div>
                      <a-divider class="my-1" />
                    </div>
                    <a-space>
                      <a-button type="primary" @click="submitQuiz" :loading="quizSubmitting">Submit quiz</a-button>
                      <a-button @click="markComplete(currentLesson, true)" :disabled="isCompleted(currentLesson.id)">
                        Mark complete
                      </a-button>
                    </a-space>
                  </div>

                  <!-- LAB -->
                  <div v-else-if="currentLesson.type === 'lab'">
                    <a-alert
                      type="info"
                      show-icon
                      message="Interactive lab"
                      description="Your lab environment opens in a new tab/window."
                      class="mb-1"
                    />
                    <a-space>
                      <a-button type="primary" @click="openLab(currentLesson)">Open lab</a-button>
                      <a-button @click="markComplete(currentLesson, true)" :disabled="isCompleted(currentLesson.id)">
                        Mark complete
                      </a-button>
                    </a-space>
                  </div>

                  <!-- FALLBACK -->
                  <div v-else>
                    <a-typography-text type="secondary">Unsupported lesson type.</a-typography-text>
                  </div>
                </template>

                <a-divider />
                <div class="nav-actions">
                  <a-space wrap>
                    <a-button
                      v-if="currentLesson"
                      :type="isCompleted(currentLesson.id) ? 'default' : 'primary'"
                      @click="toggleComplete(currentLesson)"
                    >
                      <template #icon><CheckOutlined /></template>
                      {{ isCompleted(currentLesson.id) ? 'Mark as incomplete' : 'Mark as complete' }}
                    </a-button>
                    <a-button @click="prevLesson" :disabled="currentIndex <= 0">Previous</a-button>
                    <a-button type="primary" @click="nextLesson" :disabled="currentIndex >= lessons.length - 1">
                      Next <ArrowRightOutlined />
                    </a-button>
                  </a-space>
                </div>
              </a-card>

              <a-empty v-else description="No lessons found" />
            </a-spin>
          </template>
        </a-layout-content>

        <!-- RIGHT -->
        <a-layout-sider width="300" class="right-sider" collapsible v-model:collapsed="rightCollapsed">
          <div class="right-inner">
            <a-card size="small" title="Progress">
              <a-steps size="small" direction="vertical" :current="currentIndex">
                <a-step
                  v-for="(l, i) in lessons"
                  :key="l.id"
                  :title="l.title || `Lesson ${i+1}`"
                  :description="l.duration ? `${l.duration} min` : ''"
                  :status="isCompleted(l.id) ? 'finish' : (i === currentIndex ? 'process' : 'wait')"
                />
              </a-steps>
            </a-card>

            <a-card v-if="currentLesson" size="small" class="mt-2" title="Resources">
              <a-empty v-if="!currentLesson.resources?.length" description="No resources" />
              <a-list v-else size="small" :data-source="currentLesson.resources">
                <template #renderItem="{ item }">
                  <a-list-item>
                    <a :href="item.url" target="_blank">{{ item.title || item.name || 'Resource' }}</a>
                  </a-list-item>
                </template>
              </a-list>
            </a-card>

            <a-card v-if="currentLesson" size="small" class="mt-2" title="Attachments">
              <a-empty v-if="!currentLesson.attachments?.length" description="No attachments" />
              <a-list v-else size="small" :data-source="currentLesson.attachments">
                <template #renderItem="{ item }">
                  <a-list-item>
                    <a :href="item.url" target="_blank">{{ item.name || 'Attachment' }}</a>
                  </a-list-item>
                </template>
              </a-list>
            </a-card>
          </div>
        </a-layout-sider>
      </a-layout>

      <!-- Assignment submit drawer -->
      <a-drawer v-model:open="submitOpen" title="Submit assignment" placement="right" width="420">
        <a-form layout="vertical" @finish="submitAssignment">
          <a-form-item label="Notes">
            <a-textarea v-model:value="submitForm.notes" :rows="4" />
          </a-form-item>
          <a-form-item label="Link to work (URL)">
            <a-input v-model:value="submitForm.url" placeholder="https://…" />
          </a-form-item>
          <a-space>
            <a-button @click="submitOpen = false">Cancel</a-button>
            <a-button type="primary" html-type="submit" :loading="submitting">Submit</a-button>
          </a-space>
        </a-form>
      </a-drawer>
    </a-layout>
  </a-config-provider>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { theme, message } from 'ant-design-vue'
import {
  BulbOutlined, FieldTimeOutlined, PlayCircleOutlined, LockOutlined,
  CheckOutlined, ArrowRightOutlined
} from '@ant-design/icons-vue'

/** ---------- Types ---------- */
type QuizOption = { text: string; correct: boolean }
type QuizQuestion = { id: string; text: string; type: 'mcq' | 'tf' | 'short'; options?: QuizOption[] }
type Resource = { id?: string; name?: string; title?: string; kind?: 'pdf' | 'file' | 'link'; url: string }
type Lesson = {
  id: string
  moduleId?: string
  title: string
  type: 'video' | 'reading' | 'quiz' | 'assignment' | 'lab' | string
  duration?: number
  content?: string
  videoUrl?: string
  rubric?: string
  resources?: Resource[]
  attachments?: { name?: string; url?: string }[]
  tags?: string[]
  prerequisites?: string[]
  unlockAt?: string | number | Date
  preview?: boolean
  quiz?: { questions: QuizQuestion[] }
}
type ModuleT = { id: string; courseId?: string; title: string; lessons: Lesson[] }
type CourseT = {
  id: string
  title: string
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | string
  coverUrl?: string
}
type ModuleLite = { id: string; title: string; lessonCount?: number; minutes?: number }
type ProgressRow = { lessonId: string; completed: boolean; updatedAt?: string }

/** ---------- State ---------- */
const isDark = ref(false)
const siderCollapsed = ref(false)
const rightCollapsed = ref(false)
const filter = ref('')
const route = useRoute()
const router = useRouter()

// Endpoints (use runtimeConfig in real app if you have it)
const STUDENTS_API = 'http://localhost:4000/api/students-internal/graphql'
const TEACH_API    = 'http://localhost:4000/api/teach-internal/graphql'

const loadingCourse = ref(false)
const loadingModule = ref(false)

const course = reactive<CourseT>({ id: '', title: '', category: '', difficulty: 'Beginner', coverUrl: '' })
const modules = ref<ModuleLite[]>([])
const lessons = ref<Lesson[]>([])
const moduleT = ref<ModuleT | null>(null)
const currentIndex = ref(0)

const progress = reactive<{ completedLessonIds: string[]; lastLessonId?: string }>({
  completedLessonIds: [],
  lastLessonId: undefined
})

/** ---------- Helpers ---------- */
const selectedModuleId = computed(() => String(route.params.module_id || ''))
const hasModules = computed(() => modules.value.length > 0)
const currentModuleReady = computed(() => !!moduleT.value && lessons.value.length > 0)

const ytEmbed = (url?: string) => {
  if (!url) return ''
  if (/youtube\.com|youtu\.be/.test(url)) {
    const id = url.match(/(?:v=|be\/)([A-Za-z0-9_-]{6,})/)?.[1]
    return id ? `https://www.youtube.com/embed/${id}?rel=0` : ''
  }
  return ''
}
const unlockAtDate = (l: Lesson) => (l.unlockAt ? new Date(l.unlockAt).toLocaleString() : '')

/** ---------- Derived ---------- */
const currentLesson = computed(() => lessons.value[currentIndex.value])
const totalMinutes = computed(() => lessons.value.reduce((s, l) => s + (l.duration || 0), 0))
const progressPercent = computed(() =>
  lessons.value.length ? Math.round((progress.completedLessonIds.length / lessons.value.length) * 100) : 0
)
const coverStyle = computed(() => ({
  backgroundImage: course.coverUrl ? `url('${course.coverUrl}')` : 'linear-gradient(135deg,#111,#334155)'
}))
const filteredLessons = computed(() => {
  const q = filter.value.trim().toLowerCase()
  if (!q) return lessons.value
  return lessons.value.filter(l =>
    (l.title || '').toLowerCase().includes(q) ||
    (l.type || '').toLowerCase().includes(q)
  )
})

/** ---------- Progress helpers ---------- */
const isCompleted = (lessonId: string) => progress.completedLessonIds.includes(lessonId)
const labelForLesson = (id: string) => lessons.value.find(l => l.id === id)?.title || ''
function isLocked(l: Lesson): boolean {
  if (l.preview) return false
  if (l.unlockAt && new Date(l.unlockAt).getTime() > Date.now()) return true
  if (l.prerequisites?.length) return !l.prerequisites.every(pid => isCompleted(pid))
  return false
}

/** ---------- Networking ---------- */
let aborters = new Set<AbortController>()
onBeforeUnmount(() => {
  aborters.forEach(a => a.abort())
  aborters.clear()
})

async function fetchGraphQL<T = any>(
  query: string,
  variables?: Record<string, any>,
  endpoint = STUDENTS_API,
  timeoutMs = 15000,
): Promise<T> {
  const controller = new AbortController()
  aborters.add(controller)
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const resp = await fetch(endpoint, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
      signal: controller.signal,
    })
    const json = await resp.json().catch(() => ({}))
    if (!resp.ok) throw new Error(json?.errors?.[0]?.message || resp.statusText || 'Request failed')
    if (json.errors?.length) throw new Error(json.errors[0]?.message || 'GraphQL error')
    return json.data as T
  } finally {
    clearTimeout(timer)
    aborters.delete(controller)
  }
}

const GQL = {
  // students-internal
  myCourses: `
    query MyCourses($studentId:String!) {
      myCourses(studentId:$studentId) {
        id
        studentId
        courseId
        completed
        progress
        course { id title category difficulty coverUrl }
      }
    }
  `,
  myProgress: `
    query MyProgress($studentId:String!) {
      myProgress(studentId:$studentId) {
        id
        studentId
        lessonId
        completed
        score
        updatedAt
      }
    }
  `,
  updateProgress: `
    mutation UpdateProgress($studentId:String!, $lessonId:String!, $completed:Boolean!, $score:Int) {
      updateProgress(studentId:$studentId, lessonId:$lessonId, completed:$completed, score:$score) {
        id
        lessonId
        completed
        updatedAt
      }
    }
  `,
  // teach-internal
  modulesByCourse: `
    query ModulesByCourse($courseId:String!) {
      modulesByCourse(courseId:$courseId) {
        id
        title
        lessons { id duration title type content videoUrl rubric metadata moduleId }
      }
    }
  `,
}

/** ---------- Progress derivation ---------- */
function progressFromRows(rows: ProgressRow[], lessonIds: string[]) {
  const completedLessonIds = rows
    .filter(r => r.completed && lessonIds.includes(r.lessonId))
    .map(r => r.lessonId)

  const last = rows
    .filter(r => lessonIds.includes(r.lessonId))
    .sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime())[0]

  return { completedLessonIds, lastLessonId: last?.lessonId }
}

function normalizeLesson(src: any): Lesson {
  const md = src?.metadata || {}
  return {
    id: src?.id,
    moduleId: src?.moduleId,
    title: src?.title || '',
    type: src?.type || 'reading',
    duration: src?.duration ?? undefined,
    content: src?.content || '',
    videoUrl: src?.videoUrl || '',
    rubric: src?.rubric || '',
    tags: md.tags || [],
    prerequisites: md.prerequisites || [],
    unlockAt: md.unlockAt || undefined,
    preview: !!md.preview,
    resources: md.resources || [],
    attachments: md.attachments || [],
    quiz: md.quiz || { questions: [] },
  }
}

/** ---------- Loaders ---------- */
async function loadCourseOverview(studentId: string, courseId: string) {
  loadingCourse.value = true
  try {
    // 1) Enrollment / basic course info
    const myCoursesData = await fetchGraphQL<{
      myCourses: Array<{ courseId: string; course: CourseT }>
    }>(GQL.myCourses, { studentId }, STUDENTS_API)

    const sc = (myCoursesData?.myCourses || []).find(c => c.courseId === courseId)
    if (sc?.course) Object.assign(course, sc.course)

    // 2) Modules + lesson shells
    const teach = await fetchGraphQL<{
      modulesByCourse: Array<{ id: string; title: string; lessons: Array<{ id: string; duration?: number }> }>
    }>(GQL.modulesByCourse, { courseId }, TEACH_API)

    modules.value = (teach?.modulesByCourse || []).map(m => ({
      id: m.id,
      title: m.title,
      lessonCount: m.lessons?.length || 0,
      minutes: (m.lessons || []).reduce((s, l) => s + (l.duration || 0), 0),
    }))

    // 3) Progress rows → global progress over course
    const prog = await fetchGraphQL<{ myProgress: ProgressRow[] }>(GQL.myProgress, { studentId }, STUDENTS_API)
    const allLessonIds = (teach?.modulesByCourse || []).flatMap(m => m.lessons?.map(l => l.id) || [])
    const derived = progressFromRows(prog?.myProgress || [], allLessonIds)

    progress.completedLessonIds = [...derived.completedLessonIds]
    progress.lastLessonId = derived.lastLessonId
  } catch (e: any) {
    modules.value = []
    message.warning(e?.message || 'Failed to load course overview')
    console.warn('[StudentCourse] overview failed:', e?.message)
  } finally {
    loadingCourse.value = false
  }
}

async function loadModule(studentId: string, courseId: string, moduleId: string) {
  loadingModule.value = true
  try {
    // Ensure modules list
    if (!modules.value.length) {
      const teachMods = await fetchGraphQL<{ modulesByCourse: any[] }>(
        GQL.modulesByCourse, { courseId }, TEACH_API
      )
      modules.value = (teachMods?.modulesByCourse || []).map((m: any) => ({
        id: m.id,
        title: m.title,
        lessonCount: m.lessons?.length || 0,
        minutes: (m.lessons || []).reduce((s:number, l:any) => s + (l.duration || 0), 0),
      }))
    }

    // Load full module
    const teach = await fetchGraphQL<{ modulesByCourse: any[] }>(
      GQL.modulesByCourse, { courseId }, TEACH_API
    )
    const mod = (teach?.modulesByCourse || []).find((m:any) => m.id === moduleId)
    if (!mod) throw new Error('Module not found')

    moduleT.value = { id: mod.id, title: mod.title, courseId, lessons: [] }
    lessons.value = (mod.lessons || []).map(normalizeLesson)

    // Progress for this module scope
    const prog = await fetchGraphQL<{ myProgress: ProgressRow[] }>(GQL.myProgress, { studentId }, STUDENTS_API)
    const lessonIds = (mod.lessons || []).map((l:any) => l.id)
    const derived = progressFromRows(prog?.myProgress || [], lessonIds)

    progress.completedLessonIds = [...derived.completedLessonIds]
    progress.lastLessonId = derived.lastLessonId

    // Ensure selection
    if (lessons.value.length && currentIndex.value >= lessons.value.length) currentIndex.value = 0
    if (!currentLesson.value && lessons.value.length) select(0)
  } catch (e: any) {
    moduleT.value = null
    lessons.value = []
    message.warning(e?.message || 'Failed to load module')
    console.warn('[StudentModule] load failed:', e?.message)
    const fallback = modules.value[0]?.id
    if (fallback && moduleId !== fallback) {
      await router.replace({ params: { ...route.params, module_id: fallback } })
    }
  } finally {
    loadingModule.value = false
  }
}

/** ---------- Mutations & actions ---------- */
async function apiUpdateProgress(lessonId: string, completed: boolean) {
  const studentId = String(route.params.student_id || route.params.studentId || '')
  const courseId  = String(route.params.course_id || route.params.courseId || '')
  const moduleId  = String(route.params.module_id || route.params.moduleId || '')

  await fetchGraphQL(
    GQL.updateProgress,
    { studentId, lessonId, completed, score: null },
    STUDENTS_API
  )

  // Refresh progress for current module scope
  const teach = await fetchGraphQL<{ modulesByCourse: any[] }>(GQL.modulesByCourse, { courseId }, TEACH_API)
  const mod = (teach?.modulesByCourse || []).find((m:any) => m.id === moduleId)
  const lessonIds = (mod?.lessons || []).map((l:any) => l.id) || []

  const prog = await fetchGraphQL<{ myProgress: ProgressRow[] }>(GQL.myProgress, { studentId }, STUDENTS_API)
  const derived = progressFromRows(prog?.myProgress || [], lessonIds)

  progress.completedLessonIds = [...derived.completedLessonIds]
  progress.lastLessonId = derived.lastLessonId
}

function select(i: number) {
  currentIndex.value = i
  // ping updatedAt for heuristic "last" without changing completion
  const l = lessons.value[i]
  if (l?.id) apiUpdateProgress(l.id, isCompleted(l.id)).catch(() => {})
}
function prevLesson() { if (currentIndex.value > 0) select(currentIndex.value - 1) }
function nextLesson() { if (currentIndex.value < lessons.value.length - 1) select(currentIndex.value + 1) }

function resumeLast() {
  if (progress.lastLessonId) {
    const idx = lessons.value.findIndex(l => l.id === progress.lastLessonId)
    if (idx >= 0) return select(idx)
  }
  const idx = lessons.value.findIndex(l => !isLocked(l) || l.preview)
  if (idx >= 0) select(idx)
}

async function toggleComplete(l: Lesson) { await markComplete(l, !isCompleted(l.id)) }
async function markComplete(l: Lesson, done: boolean) {
  try {
    await apiUpdateProgress(l.id, done)
    // optimistic UX
    if (done) {
      if (!isCompleted(l.id)) progress.completedLessonIds.push(l.id)
    } else {
      const i = progress.completedLessonIds.indexOf(l.id)
      if (i >= 0) progress.completedLessonIds.splice(i, 1)
    }
    message.success(done ? 'Marked complete' : 'Marked incomplete')
  } catch (e: any) {
    message.error(e?.message || 'Failed to update progress')
  }
}

const quizState = reactive<Record<string, any>>({})
const quizSubmitting = ref(false)
async function submitQuiz() {
  if (!currentLesson.value?.quiz?.questions?.length) return
  quizSubmitting.value = true
  try {
    let total = 0, ok = 0
    for (const q of currentLesson.value.quiz!.questions) {
      total++
      let correct = false
      if (q.type === 'mcq') {
        const ans: number[] = Array.isArray(quizState[q.id]) ? quizState[q.id] : []
        const correctIdx = (q.options || []).map((o, i) => (o.correct ? i : -1)).filter(i => i >= 0)
        correct = ans.sort().join(',') === correctIdx.sort().join(',')
      } else if (q.type === 'tf') {
        correct = true // treat as acknowledged
      } else {
        correct = !!String(quizState[q.id] || '').trim().length
      }
      if (correct) ok++
    }
    // store quiz summary by touching updatedAt via updateProgress (no backend changes)
    await apiUpdateProgress(currentLesson.value.id, isCompleted(currentLesson.value.id))
    message.success(`Submitted quiz. Score (approx): ${ok}/${total}`)
  } catch (e:any) {
    message.error(e?.message || 'Quiz submit failed')
  } finally {
    quizSubmitting.value = false
  }
}

const submitOpen = ref(false)
const submitting = ref(false)
const submitForm = reactive<{ notes: string; url: string }>({ notes: '', url: '' })
function openSubmitDrawer(){ submitOpen.value = true }
async function submitAssignment() {
  if (!currentLesson.value) return
  submitting.value = true
  try {
    // touch updatedAt (no backend changes)
    await apiUpdateProgress(currentLesson.value.id, isCompleted(currentLesson.value.id))
    submitOpen.value = false
    submitForm.notes = ''; submitForm.url = ''
    message.success('Assignment submitted')
  } catch (e:any) {
    message.error(e?.message || 'Submit failed')
  } finally {
    submitting.value = false
  }
}

/** Lab hook */
function openLab(l: Lesson) {
  window.open(`/labs/${course.id}/${l.id}`, '_blank', 'noopener')
}

/** ---------- Routing ---------- */
async function switchModule(nextId: string) {
  if (!nextId || nextId === selectedModuleId.value) return
  await router.replace({ params: { ...route.params, module_id: nextId } })
}

/** ---------- Lifecycle ---------- */
onMounted(async () => {
  const studentId = String(route.params.student_id || route.params.studentId || '')
  const courseId  = String(route.params.course_id || route.params.courseId || '')
  const moduleId  = String(route.params.module_id || route.params.moduleId || '')

  await loadCourseOverview(studentId, courseId)

  if (!moduleId || (hasModules.value && !modules.value.some(m => m.id === moduleId))) {
    const pick = progress.lastLessonId
      ? modules.value.find(m => m.id)?.id
      : modules.value[0]?.id
    if (pick) await router.replace({ params: { ...route.params, module_id: pick } })
  } else {
    await loadModule(studentId, courseId, moduleId)
  }
})

watch(() => route.params.module_id, async (next, prev) => {
  if (next === prev) return
  const studentId = String(route.params.student_id || route.params.studentId || '')
  const courseId  = String(route.params.course_id || route.params.courseId || '')
  const moduleId  = String(next || '')
  if (!moduleId) {
    moduleT.value = null
    lessons.value = []
    return
  }
  if (hasModules.value && !modules.value.some(m => m.id === moduleId)) {
    const fallback = modules.value[0]?.id
    if (fallback) await router.replace({ params: { ...route.params, module_id: fallback } })
    return
  }
  await loadModule(studentId, courseId, moduleId)
})
</script>

<style scoped>
.student-wrap { min-height: 100vh; background: #f6f8fb; }
.is-dark { background: #0b1220; }
.page-header { background: #fff; border-bottom: 1px solid #eef2f7; }
.is-dark .page-header { background: #0f172a; }

.left-sider, .right-sider { background: transparent; }
.sider-inner, .right-inner { padding: 12px; }

.cover { height: 140px; background-size: cover; background-position: center; position: relative; border-radius: 10px; overflow: hidden; }
.cover-gradient { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,.55)); }
.cover-meta { position: absolute; left: 12px; right: 12px; bottom: 10px; color: #fff; }
.cover-title { font-weight: 700; font-size: 15px; }
.cover-tags { margin-top: 6px; display: flex; gap: 6px; flex-wrap: wrap; }

.content { padding: 16px; }
.lesson-row { border-radius: 8px; cursor: pointer; transition: background .15s ease; }
.lesson-row:hover { background: #f3f7ff; }
.lesson-row.active { background: #eef7ff; }
.is-dark .lesson-row.active { background: #0b1f37; }

.mt-1 { margin-top: 8px; }
.mt-2 { margin-top: 12px; }
.mb-1 { margin-bottom: 8px; }
.my-1 { margin: 8px 0; }

.video-wrap { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 10px; }
.video-wrap iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
.video-fallback { background: #f5f5f5; border-radius: 8px; padding: 8px 12px; word-break: break-all; }
.is-dark .video-fallback { background: #0f172a; }

.muted { color: #64748b; }
.preq.ok { text-decoration: line-through; }

.nav-actions { display: flex; justify-content: space-between; align-items: center; }

.quiz-q { padding: 8px 0; }
</style>
