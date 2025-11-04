<template>
  <a-card v-if="l" class="module-item" :bordered="true">

    <!-- HEADER -->
    <div class="mi-head">
      <div class="mi-head-left">
        <a-tag>{{ idx + 1 }}</a-tag>
<a-tag :color="typeColor(l?.type || 'video')">{{ l?.type || 'video' }}</a-tag>
<a-tag color="blue">{{ l?.duration || 0 }} min</a-tag>
<a-tag v-if="status.label" :color="status.color">{{ status.label }}</a-tag>
<span class="mi-title" :title="l?.title || 'Untitled'">
  {{ l?.title || 'Untitled' }}
</span>

      </div>

      <a-space>
        <a-button size="small" @click="$emit('preview', l)">
          <EyeOutlined /> Preview
        </a-button>
        <a-button size="small" @click="$emit('duplicate', idx)">
          <CopyOutlined /> Duplicate
        </a-button>
        <a-button size="small" :disabled="idx === 0" @click="$emit('move', idx, -1)">
          <ArrowUpOutlined />
        </a-button>
        <a-button size="small" :disabled="idx >= totalLessons - 1" @click="$emit('move', idx, 1)">
          <ArrowDownOutlined />
        </a-button>
        <a-popconfirm title="Delete this lesson?" ok-text="Delete" ok-type="danger" @confirm="$emit('remove', idx)">
          <a-button size="small" danger>
            <DeleteOutlined /> Delete
          </a-button>
        </a-popconfirm>
        <a-button type="text" @click="collapsed = !collapsed">
          {{ collapsed ? 'Expand' : 'Collapse' }}
        </a-button>
      </a-space>
    </div>

    <a-divider class="mi-divider" />

    <div v-show="!collapsed">
      <a-row :gutter="16">
        <!-- LEFT: MAIN FIELDS -->
        <a-col :xs="24" :md="16">
          <a-form layout="vertical">
            <a-form-item label="Title" :rules="[{ required: true, message: 'Lesson title is required' }]">
              <a-input v-model:value="l.title" placeholder="e.g. Reactive primitives" />
            </a-form-item>

            <a-form-item label="Type">
              <a-select v-model:value="l.type" style="width:100%">
                <a-select-option value="video">
                  <VideoCameraOutlined /> Video
                </a-select-option>
                <a-select-option value="reading">
                  <ReadOutlined /> Reading
                </a-select-option>
                <a-select-option value="quiz">
                  <QuestionCircleOutlined /> Quiz
                </a-select-option>
                <a-select-option value="assignment">
                  <PaperClipOutlined /> Assignment
                </a-select-option>
              </a-select>
            </a-form-item>

            <!-- TYPE-SPECIFIC EDITORS -->
            <template v-if="l.type === 'video'">
              <a-form-item label="Video URL">
                <a-input v-model:value="l.videoUrl" placeholder="https://…" />
              </a-form-item>
              <a-form-item label="Transcript / Notes">
                <a-textarea v-model:value="l.content" rows="4" />
              </a-form-item>
            </template>

            <template v-else-if="l.type === 'reading'">
              <a-form-item label="Article / Notes">
                <a-textarea
                  v-model:value="l.content"
                  rows="8"
                  placeholder="Paste or write the reading content…"
                />
              </a-form-item>
            </template>

            <template v-else-if="l.type === 'assignment'">
              <a-form-item label="Brief">
                <a-textarea
                  v-model:value="l.content"
                  rows="5"
                  placeholder="Describe the task students must complete"
                />
              </a-form-item>
              <a-form-item label="Rubric (optional)">
                <a-textarea v-model:value="l.rubric" rows="4" placeholder="How will you grade it?" />
              </a-form-item>
            </template>

            <template v-else-if="l.type === 'quiz'">
              <a-divider orientation="left">Questions</a-divider>

              <div v-for="(q, qIdx) in l?.quiz?.questions" :key="q.id" class="quiz-q">
                <a-card size="small" :title="`Q${qIdx + 1}`" style="margin-bottom:8px">
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

                    <template v-if="q.type === 'mcq'">
                      <a-form-item label="Options">
                        <div v-for="(opt, oIdx) in q.options" :key="oIdx" class="mcq-opt">
                          <a-input v-model:value="opt.text" style="width:70%" placeholder="Option text" />
                          <a-checkbox v-model:checked="opt.correct" style="margin-left:8px">Correct</a-checkbox>
                          <a-button danger type="text" @click="removeOption(qIdx, oIdx)">
                            <DeleteOutlined />
                          </a-button>
                        </div>
                        <a-button size="small" type="dashed" @click="addOption(qIdx)" style="margin-top:6px">
                          <PlusOutlined /> Add option
                        </a-button>
                      </a-form-item>
                    </template>

                    <div class="row-right">
                      <a-space>
                        <a-button size="small" @click="moveQuestion(qIdx, -1)"><ArrowUpOutlined /></a-button>
                        <a-button size="small" @click="moveQuestion(qIdx, 1)"><ArrowDownOutlined /></a-button>
                        <a-button size="small" danger @click="removeQuestion(qIdx)"><DeleteOutlined /></a-button>
                      </a-space>
                    </div>
                  </a-form>
                </a-card>
              </div>

              <a-button type="dashed" size="small" @click="addQuestion()">
                <PlusOutlined /> Add question
              </a-button>
            </template>
          </a-form>
        </a-col>

        <!-- RIGHT: SETTINGS -->
        <a-col :xs="24" :md="8">
          <a-form layout="vertical">
            <a-form-item label="Estimated Time (min)">
              <a-input-number v-model:value="l.duration" :min="1" :max="600" style="width:100%" />
            </a-form-item>

            <a-form-item label="Prerequisite lessons (IDs)">
              <a-select
                v-model:value="l.prerequisites"
                mode="multiple"
                :options="prereqOptions"
                placeholder="Optional"
              />
            </a-form-item>

            <a-form-item label="Tags">
              <a-select v-model:value="l.tags" mode="tags" placeholder="Add tags" />
            </a-form-item>

            <a-form-item label="Availability">
              <a-date-picker
                v-model:value="l.unlockAt"
                show-time
                style="width:100%"
                placeholder="Optional unlock at"
              />
            </a-form-item>

            <a-form-item label="Resources (links)">
              <div v-for="(r, rIdx) in l.resources" :key="rIdx" class="resource-row">
                <a-input v-model:value="r.title" placeholder="Title" style="width:35%" />
                <a-input v-model:value="r.url" placeholder="https://…" style="width:55%;margin-left:8px" />
                <a-button type="text" danger @click="removeResource(rIdx)">
                  <DeleteOutlined />
                </a-button>
              </div>
              <a-button size="small" type="dashed" @click="addResource" style="margin-top:6px">
                <PlusOutlined /> Add resource
              </a-button>
            </a-form-item>

            <a-form-item label="Attachments">
              <a-upload v-model:file-list="l.attachments" :before-upload="() => false" :multiple="true">
                <a-button size="small"><PaperClipOutlined /> Add files</a-button>
              </a-upload>
            </a-form-item>
          </a-form>
        </a-col>
      </a-row>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  PlusOutlined,
  DeleteOutlined,
  EyeOutlined,
  CopyOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  VideoCameraOutlined,
  ReadOutlined,
  PaperClipOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons-vue'

type QuizOption = { text: string; correct: boolean }
type QuizQuestion = { id: string; text: string; type: 'mcq' | 'tf' | 'short'; options: QuizOption[] }
type Lesson = {
  id: string
  title: string
  type: 'video' | 'reading' | 'quiz' | 'assignment'
  duration: number
  content?: string
  videoUrl?: string
  rubric?: string
  resources: { title: string; url: string }[]
  attachments: any[]
  tags: string[]
  prerequisites: (string | number)[]
  unlockAt?: any
  quiz?: { questions: QuizQuestion[] }
}

const props = defineProps<{
  lesson: Lesson
  idx: number
  totalLessons: number
  prereqOptions: { label: string; value: string | number }[]
  startCollapsed?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:lesson', val: Lesson): void
  (e: 'preview', lesson: Lesson): void
  (e: 'duplicate', idx: number): void
  (e: 'remove', idx: number): void
  (e: 'move', idx: number, dir: number): void
}>()

// v-model bridge
const l = computed({
  get: () => props.lesson || ({
    id: '',
    title: '',
    type: 'video',
    duration: 0,
    content: '',
    videoUrl: '',
    rubric: '',
    resources: [],
    attachments: [],
    tags: [],
    prerequisites: [],
    unlockAt: null,
    quiz: { questions: [] },
  }) as Lesson,
  set: (val: Lesson) => emit('update:lesson', val),
})

// UI
const collapsed = ref(!!props.startCollapsed)
watch(() => props.startCollapsed, (v) => (collapsed.value = !!v))

// Helpers
const uid = () => Math.random().toString(36).slice(2)

const status = computed(() => {
  const unlock = l.value.unlockAt
  if (!unlock) return { label: '', color: '' }
  // Check if unlockAt is in the future
  const unlockDate = (unlock && typeof unlock === 'object' && 'toDate' in unlock && typeof unlock.toDate === 'function')
    ? (unlock as any).toDate()
    : new Date(unlock)
  const future = unlockDate.getTime() > Date.now()
  return future ? { label: 'Scheduled', color: 'gold' } : { label: 'Available', color: 'green' }
})

const typeColor = (t?: Lesson['type']) =>
  ({ video: 'purple', reading: 'cyan', quiz: 'red', assignment: 'geekblue' }[t || 'video'])

// Quiz ops
const ensureQuiz = () => {
  if (!l.value.quiz) l.value.quiz = { questions: [] }
  if (!Array.isArray(l.value.quiz.questions)) l.value.quiz.questions = []
}
const addQuestion = () => {
  ensureQuiz()
  l.value.quiz!.questions.push({ id: uid(), text: '', type: 'mcq', options: [{ text: '', correct: false }] })
}
const removeQuestion = (qIdx: number) => {
  ensureQuiz()
  l.value.quiz!.questions.splice(qIdx, 1)
}
const moveQuestion = (qIdx: number, dir: number) => {
  ensureQuiz()
  const qs = l.value.quiz!.questions
  const to = qIdx + dir
  if (to < 0 || to >= qs.length) return
  const [q] = qs.splice(qIdx, 1)
  qs.splice(to, 0, q)
}
const addOption = (qIdx: number) => {
  ensureQuiz()
  l.value.quiz!.questions[qIdx].options.push({ text: '', correct: false })
}
const removeOption = (qIdx: number, oIdx: number) => {
  ensureQuiz()
  l.value.quiz!.questions[qIdx].options.splice(oIdx, 1)
}

// Resources
const addResource = () => l.value.resources.push({ title: '', url: '' })
const removeResource = (rIdx: number) => l.value.resources.splice(rIdx, 1)
</script>

<style scoped>
.module-item {
  margin-bottom: 12px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,.04);
}

.mi-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mi-head-left {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.mi-title {
  margin-left: 6px;
  font-weight: 600;
  color: #1f1f1f;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mi-divider { margin: 12px 0 16px; }

.row-right {
  display: flex;
  justify-content: flex-end;
}

.quiz-q :deep(.ant-card-head) {
  min-height: 36px;
  padding: 0 12px;
}

.mcq-opt {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}

.resource-row {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
}
</style>
