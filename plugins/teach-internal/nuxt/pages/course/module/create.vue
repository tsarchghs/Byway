<template>
  <!--
    Module Create Page (Fully Mocked, Feature-Complete)
    - Preserves and extends all features from the original component
    - Adds safety nets (autosave, restore, undo/redo, import/export, keyboard shortcuts)
    - Uses Ant Design Vue components; zero backend dependency required
  -->
  <a-layout class="module-create-layout">
    <!-- =======================================
         Page Header
    ======================================== -->
    <a-page-header
      title="Create New Module"
      :sub-title="courseTitle"
      class="page-header"
      @back="goBack"
    >
      <template #avatar>
        <a-avatar :src="teacher.avatar" />
      </template>

      <template #tags>
        <a-tag color="blue">Teacher: {{ teacherName }}</a-tag>
        <a-tag color="green">Course: {{ courseId }}</a-tag>
        <a-tag :color="moduleData.isPublic ? 'cyan' : 'gold'">
          {{ moduleData.isPublic ? 'Public' : 'Private' }}
        </a-tag>
      </template>

      <template #extra>
        <a-space :size="8" wrap>
          <a-popover placement="bottomRight">
            <template #content>
              <div style="min-width:260px">
                <a-typography-title :level="5" style="margin-top:0">Draft</a-typography-title>
                <a-descriptions size="small" :column="1" bordered>
                  <a-descriptions-item label="Autosave">{{ autosaveEnabled ? 'On' : 'Off' }}</a-descriptions-item>
                  <a-descriptions-item label="Last saved">{{ lastSavedAt || '—' }}</a-descriptions-item>
                  <a-descriptions-item label="Version">{{ draftVersion }}</a-descriptions-item>
                </a-descriptions>
                <a-space style="margin-top:8px">
                  <a-button size="small" @click="toggleAutosave">
                    {{ autosaveEnabled ? 'Disable autosave' : 'Enable autosave' }}
                  </a-button>
                  <a-button size="small" @click="forceSaveDraft">
                    Save now
                  </a-button>
                </a-space>
              </div>
            </template>
            <a-badge :status="autosaveEnabled ? 'processing' : 'default'">
              <a-button><save-outlined /> Draft</a-button>
            </a-badge>
          </a-popover>

          <a-button @click="openTemplates"><file-add-outlined /> Templates</a-button>
          <a-button @click="openBulkAdd"><copy-outlined /> Bulk add</a-button>

          <a-dropdown>
            <template #overlay>
              <a-menu>
                <a-menu-item @click="openImport">
                  <upload-outlined /> Import JSON
                </a-menu-item>
                <a-menu-item @click="openExport">
                  <download-outlined /> Export JSON
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item @click="openSettings">
                  <setting-outlined /> Settings
                </a-menu-item>
                <a-menu-item @click="openShortcuts">
                  <keyboard-outlined /> Shortcuts
                </a-menu-item>
              </a-menu>
            </template>
            <a-button>
              <more-outlined />
            </a-button>
          </a-dropdown>

          <a-button @click="saveDraft"><save-outlined /> Save draft</a-button>
          <a-button type="primary" @click="saveModule"><check-outlined /> Save module</a-button>
        </a-space>
      </template>
    </a-page-header>

    <!-- =======================================
         Restored Banner
    ======================================== -->
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

    <!-- =======================================
         High-level Meta & Progress
    ======================================== -->
    <a-card class="progress-card" :bordered="false">
      <a-row :gutter="16" align="middle">
        <a-col :xs="24" :md="12">
          <a-space direction="vertical" style="width:100%">
            <a-typography-text type="secondary">Completeness</a-typography-text>
            <a-progress :percent="completenessPct" :status="completenessPct >= 90 ? 'success' : (completenessPct >= 60 ? 'normal' : 'active')" />
            <a-typography-text type="secondary">
              {{ completenessLabel }}
            </a-typography-text>
          </a-space>
        </a-col>
        <a-col :xs="24" :md="12">
          <a-space direction="vertical" style="width:100%">
            <a-typography-text type="secondary">Totals</a-typography-text>
            <div class="totals">
              <a-tag color="blue">Lessons: {{ moduleData.lessons.length }}</a-tag>
              <a-tag color="purple">Minutes: {{ totalMinutes }}</a-tag>
              <a-tag color="volcano">Quizzes: {{ quizzesCount }}</a-tag>
              <a-tag color="geekblue">Assignments: {{ assignmentsCount }}</a-tag>
              <a-tag v-if="hasWarnings" color="orange">Warnings: {{ warnings.length }}</a-tag>
            </div>
          </a-space>
        </a-col>
      </a-row>
    </a-card>

    <!-- =======================================
         Module Form
    ======================================== -->
    <a-card class="form-card" bordered>
      <a-form layout="vertical" :model="moduleData">
        <a-form-item
          label="Module Title"
          name="title"
          :rules="[{ required: true, message: 'Title is required' }]"
          :validate-status="moduleData.title ? '' : 'warning'"
          :help="!moduleData.title ? 'A strong, student-focused title helps discoverability.' : ''"
        >
          <a-input
            v-model:value="moduleData.title"
            placeholder="e.g. Composition API Basics"
            @blur="maybeGenerateSlug"
          />
        </a-form-item>

        <a-row :gutter="16">
          <a-col :xs="24" :md="16">
            <a-form-item label="Description">
              <a-textarea
                v-model:value="moduleData.description"
                rows="3"
                placeholder="What will students learn in this module?"
              />
            </a-form-item>

            <!-- Objectives (chips + suggest) -->
            <a-form-item label="Learning Objectives (tags)">
              <a-select
                v-model:value="moduleData.objectives"
                mode="tags"
                placeholder="Add objectives (press Enter)"
                :token-separators="[',']"
                :options="objectiveSuggestions"
              />
              <a-typography-text type="secondary">
                Tip: Keep objectives measurable and concise.
              </a-typography-text>
            </a-form-item>
          </a-col>

          <a-col :xs="24" :md="8">
            <a-form-item label="Visibility">
              <a-switch
                v-model:checked="moduleData.isPublic"
                checked-children="Public"
                un-checked-children="Private"
              />
            </a-form-item>

            <a-form-item label="Module Availability">
              <a-date-picker
                v-model:value="moduleData.unlockAt"
                show-time
                style="width:100%"
                placeholder="Optional unlock date/time"
              />
            </a-form-item>

            <a-form-item label="Module Slug (URL)">
              <a-input v-model:value="moduleData.slug" placeholder="auto-generated-from-title" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider orientation="left">
          Lessons <span class="muted">({{ moduleData.lessons.length }})</span>
        </a-divider>

        <!-- Quick Add Toolbar -->
        <a-space style="margin-bottom:12px;" wrap>
          <a-button type="dashed" @click="addLesson()">
            <plus-outlined /> Add lesson
          </a-button>
          <a-button @click="expandAll">Expand all</a-button>
          <a-button @click="collapseAll">Collapse all</a-button>
          <a-button @click="addQuizCheckpoint">
            <question-circle-outlined /> Add checkpoint quiz
          </a-button>
          <a-button @click="addMiniAssignment">
            <paper-clip-outlined /> Add mini assignment
          </a-button>
          <a-button @click="addVideoIntro">
            <video-camera-outlined /> Add intro video
          </a-button>
          <a-tag color="blue">Total time: {{ totalMinutes }} min</a-tag>
        </a-space>

        <!-- Undo / Redo -->
        <a-space style="margin-bottom:12px;">
          <a-tooltip title="Undo (Ctrl/Cmd+Z)">
            <a-button :disabled="!canUndo" @click="undoChange">
              <arrow-left-outlined /> Undo
            </a-button>
          </a-tooltip>
          <a-tooltip title="Redo (Ctrl/Cmd+Shift+Z)">
            <a-button :disabled="!canRedo" @click="redoChange">
              <arrow-right-outlined /> Redo
            </a-button>
          </a-tooltip>
          <a-divider type="vertical" />
          <a-typography-text type="secondary">History: {{ historyIndex + 1 }} / {{ history.length }}</a-typography-text>
        </a-space>

        <!-- Lessons List -->
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
                      <a-select-option value="video">
                        <video-camera-outlined /> Video
                      </a-select-option>
                      <a-select-option value="reading">
                        <read-outlined /> Reading
                      </a-select-option>
                      <a-select-option value="quiz">
                        <question-circle-outlined /> Quiz
                      </a-select-option>
                      <a-select-option value="assignment">
                        <paper-clip-outlined /> Assignment
                      </a-select-option>
                    </a-select>
                  </a-form-item>

                  <!-- Type: Video -->
                  <template v-if="lesson.type==='video'">
                    <a-form-item label="Video URL">
                      <a-input v-model:value="lesson.videoUrl" placeholder="https://..." />
                    </a-form-item>
                    <a-form-item label="Transcript / Notes">
                      <a-textarea v-model:value="lesson.content" rows="4" />
                    </a-form-item>
                  </template>

                  <!-- Type: Reading -->
                  <template v-else-if="lesson.type==='reading'">
                    <a-form-item label="Article / Notes">
                      <a-textarea
                        v-model:value="lesson.content"
                        rows="6"
                        placeholder="Paste or write the reading content..."
                      />
                    </a-form-item>
                    <a-alert
                      v-if="readingTime(lesson.content) > 0"
                      type="info"
                      show-icon
                      :message="`Estimated reading time: ${readingTime(lesson.content)} min`"
                    />
                  </template>

                  <!-- Type: Assignment -->
                  <template v-else-if="lesson.type==='assignment'">
                    <a-form-item label="Brief">
                      <a-textarea
                        v-model:value="lesson.content"
                        rows="4"
                        placeholder="Describe the task students must complete"
                      />
                    </a-form-item>
                    <a-form-item label="Rubric (optional)">
                      <a-textarea
                        v-model:value="lesson.rubric"
                        rows="3"
                        placeholder="How will you grade it?"
                      />
                    </a-form-item>
                  </template>

                  <!-- Type: Quiz -->
                  <template v-else-if="lesson.type==='quiz'">
                    <a-divider orientation="left">Questions</a-divider>

                    <div v-if="!(lesson.quiz?.questions?.length)">
                      <a-empty description="No questions yet" />
                    </div>

                    <div
                      v-for="(q, qIdx) in (lesson.quiz?.questions || [])"
                      :key="q.id"
                      class="quiz-q"
                    >
                      <a-card
                        size="small"
                        :title="`Q${qIdx+1}`"
                        style="margin-bottom:8px"
                      >
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
                                <a-button danger type="text" @click="removeOption(idx,qIdx,oIdx)">
                                  <delete-outlined />
                                </a-button>
                              </div>
                              <a-button size="small" type="dashed" @click="addOption(idx,qIdx)" style="margin-top:6px">
                                <plus-outlined /> Add option
                              </a-button>
                            </a-form-item>
                          </template>

                          <template v-else-if="q.type==='tf'">
                            <a-alert
                              type="info"
                              show-icon
                              message="This will be a True/False question."
                            />
                          </template>

                          <template v-else-if="q.type==='short'">
                            <a-alert
                              type="info"
                              show-icon
                              message="This will be a short, free-text answer."
                            />
                          </template>

                          <div class="row-right">
                            <a-space>
                              <a-button size="small" @click="moveQuestion(idx,qIdx,-1)">
                                <arrow-up-outlined />
                              </a-button>
                              <a-button size="small" @click="moveQuestion(idx,qIdx,1)">
                                <arrow-down-outlined />
                              </a-button>
                              <a-button size="small" danger @click="removeQuestion(idx,qIdx)">
                                <delete-outlined />
                              </a-button>
                            </a-space>
                          </div>
                        </a-form>
                      </a-card>
                    </div>

                    <a-space>
                      <a-button type="dashed" size="small" @click="addQuestion(idx)">
                        <plus-outlined /> Add question
                      </a-button>
                      <a-button size="small" @click="seedFiveMcq(idx)">
                        <copy-outlined /> Seed 5 MCQ
                      </a-button>
                    </a-space>
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
                      <a-button type="text" danger @click="removeResource(idx,rIdx)">
                        <delete-outlined />
                      </a-button>
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
                    <a-space wrap>
                      <a-button @click="duplicateLesson(idx)"><copy-outlined /> Duplicate</a-button>
                      <a-button @click="previewLesson(lesson)"><eye-outlined /> Preview</a-button>
                      <a-button @click="moveLesson(idx,-1)"><arrow-up-outlined /></a-button>
                      <a-button @click="moveLesson(idx,1)"><arrow-down-outlined /></a-button>
                      <a-popconfirm title="Delete this lesson?" @confirm="removeLesson(idx)">
                        <a-button danger><delete-outlined /> Delete</a-button>
                      </a-popconfirm>
                    </a-space>
                  </div>
                </a-form>
              </a-col>
            </a-row>

            <!-- Inline Warnings for Lesson -->
            <div v-if="lessonWarnings(idx).length" class="lesson-warn">
              <a-alert
                v-for="(w, wi) in lessonWarnings(idx)"
                :key="wi"
                type="warning"
                show-icon
                :message="w"
                style="margin-top:8px"
              />
            </div>
          </a-collapse-panel>
        </a-collapse>
      </a-form>
    </a-card>

    <!-- =======================================
         Preview Modal
    ======================================== -->
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
                <a :href="safeUrl(r.url)" target="_blank">{{ r.title || r.url }}</a>
              </li>
            </ul>
          </div>
        </a-space>
      </div>
    </a-modal>

    <!-- =======================================
         Templates Modal
    ======================================== -->
    <a-modal v-model:open="templatesOpen" title="Lesson templates" @ok="applyTemplate" @cancel="templatesOpen=false">
      <a-radio-group v-model:value="selectedTemplate" style="width:100%">
        <a-radio :value="'video:intro'">Intro video (goals + overview)</a-radio>
        <a-radio :value="'reading:notes'">Concept reading (definitions + examples)</a-radio>
        <a-radio :value="'quiz:checkpoint'">Checkpoint quiz (5 MCQs)</a-radio>
        <a-radio :value="'assignment:mini'">Mini assignment (15-30 min)</a-radio>
      </a-radio-group>
    </a-modal>

    <!-- =======================================
         Bulk Add Modal
    ======================================== -->
    <a-modal v-model:open="bulkOpen" title="Bulk add lessons" @ok="confirmBulkAdd" @cancel="bulkOpen=false" ok-text="Create">
      <a-typography-paragraph>
        Paste lines like: <code>Video | Composition API intro | 8</code> (Type | Title | Minutes). One per line.
      </a-typography-paragraph>
      <a-textarea
        v-model:value="bulkText"
        rows="6"
        placeholder="Video | Setup dev env | 6&#10;Reading | Reactivity notes | 10"
      />
    </a-modal>

    <!-- =======================================
         Import Modal
    ======================================== -->
    <a-modal v-model:open="importOpen" title="Import JSON" ok-text="Import" @ok="confirmImport" @cancel="importOpen=false">
      <a-typography-paragraph>
        Paste a JSON export of a module. This overwrites the current form.
      </a-typography-paragraph>
      <a-textarea v-model:value="importText" :rows="10" placeholder='{"title":"...","lessons":[...]}' />
    </a-modal>

    <!-- =======================================
         Export Modal
    ======================================== -->
    <a-modal v-model:open="exportOpen" title="Export JSON" :footer="null" @cancel="exportOpen=false" width="720px">
      <a-alert type="success" message="Copy the JSON below" show-icon style="margin-bottom:12px" />
      <a-textarea :value="exportText" :rows="14" />
    </a-modal>

    <!-- =======================================
         Settings Modal
    ======================================== -->
    <a-modal v-model:open="settingsOpen" title="Module settings" ok-text="Done" @ok="settingsOpen=false" @cancel="settingsOpen=false">
      <a-form layout="vertical">
        <a-form-item label="Default lesson duration (min)">
          <a-input-number v-model:value="settings.defaultDuration" :min="1" :max="600" />
        </a-form-item>
        <a-form-item label="Warn if lesson missing title">
          <a-switch v-model:checked="settings.warnMissingTitle" />
        </a-form-item>
        <a-form-item label="Warn if duration is 0">
          <a-switch v-model:checked="settings.warnZeroDuration" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- =======================================
         Keyboard Shortcuts Help
    ======================================== -->
    <a-modal v-model:open="shortcutsOpen" title="Keyboard shortcuts" :footer="null" @cancel="shortcutsOpen=false">
      <a-descriptions bordered :column="1" size="small">
        <a-descriptions-item label="Save draft">Ctrl/Cmd + S</a-descriptions-item>
        <a-descriptions-item label="Add lesson">Ctrl/Cmd + Enter</a-descriptions-item>
        <a-descriptions-item label="Undo">Ctrl/Cmd + Z</a-descriptions-item>
        <a-descriptions-item label="Redo">Ctrl/Cmd + Shift + Z</a-descriptions-item>
        <a-descriptions-item label="Expand all">Ctrl/Cmd + .</a-descriptions-item>
        <a-descriptions-item label="Collapse all">Ctrl/Cmd + ,</a-descriptions-item>
      </a-descriptions>
    </a-modal>
  </a-layout>
</template>

<script setup lang="ts">
/* ==========================================================================================
   Script: Fully mocked business logic with quality-of-life features.
   No backend required. Safe defaults. Strong UX for teachers.
========================================================================================== */

import {
  ref,
  reactive,
  computed,
  watch,
  onMounted,
  onUnmounted,
  nextTick
} from 'vue'
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
  FileAddOutlined,
  UploadOutlined,
  DownloadOutlined,
  SettingOutlined,
  MoreOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

// ------------------------------------------------------------------
// Context (SSR-safe)
// ------------------------------------------------------------------
const route = useRoute()
const teacherId = (route.params as any).teacher_id || 'unknown'
const courseId = (route.query as any).course_id || 'draft'
const courseTitle = ref('Advanced Vue 3 Workshop')
const teacher = { avatar: '/instructors/theresa.jpg' }
const teacherName = 'Theresa Webb'

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
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
type ModuleDraft = {
  title: string
  description: string
  objectives: string[]
  isPublic: boolean
  unlockAt: any
  slug: string
  lessons: Lesson[]
}

// ------------------------------------------------------------------
// Module state
// ------------------------------------------------------------------
const moduleData = reactive<ModuleDraft>({
  title: '',
  description: '',
  objectives: [],
  isPublic: true,
  unlockAt: null,
  slug: '',
  lessons: []
})

const activePanels = ref<(string|number)[]>([])
const previewOpen = ref(false)
const previewData = ref<Lesson | null>(null)

const templatesOpen = ref(false)
const selectedTemplate = ref<string>('video:intro')

const bulkOpen = ref(false)
const bulkText = ref('')

const restored = ref(false)

// Import / Export / Settings / Shortcuts
const importOpen = ref(false)
const importText = ref('')
const exportOpen = ref(false)
const exportText = ref('')
const settingsOpen = ref(false)
const shortcutsOpen = ref(false)

const settings = reactive({
  defaultDuration: 5,
  warnMissingTitle: true,
  warnZeroDuration: true
})

// Suggestions (mock)
const objectiveSuggestions = [
  { label: 'Understand reactivity', value: 'Understand reactivity' },
  { label: 'Use Composition API', value: 'Use Composition API' },
  { label: 'Build reusable components', value: 'Build reusable components' },
]

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------
const uid = () => Math.random().toString(36).slice(2)
const readingTime = (text?: string) => {
  if (!text) return 0
  const words = (text.trim().match(/\S+/g) || []).length
  return Math.max(1, Math.ceil(words / 200))
}

const totalMinutes = computed(() =>
  moduleData.lessons.reduce((t, l) => t + (Number(l.duration) || 0), 0)
)
const quizzesCount = computed(() =>
  moduleData.lessons.filter(l => l.type === 'quiz').length
)
const assignmentsCount = computed(() =>
  moduleData.lessons.filter(l => l.type === 'assignment').length
)

const completenessPct = computed(() => {
  // naive completeness: title + desc + at least one lesson with title and duration
  let pct = 0
  if (moduleData.title) pct += 30
  if (moduleData.description) pct += 20
  if (moduleData.lessons.length) {
    const good = moduleData.lessons.filter(l => l.title && l.duration > 0).length
    pct += Math.min(50, Math.round((good / Math.max(1, moduleData.lessons.length)) * 50))
  }
  return Math.min(100, pct)
})
const completenessLabel = computed(() => {
  if (completenessPct.value >= 90) return 'Ready to publish'
  if (completenessPct.value >= 60) return 'Looking good — a few gaps remain'
  return 'Work in progress'
})

const panelTitle = (lesson: Lesson, idx: number) =>
  `#${idx+1} · ${lesson.type} · ${lesson.title || 'Untitled'} · ${lesson.duration||0} min`

const prereqOptions = (idx: number) =>
  moduleData.lessons
    .map((l, i) => ({ label: `#${i+1} ${l.title || 'Untitled'}`, value: l.id }))
    .filter((_, i) => i < idx) // only previous lessons

const safeUrl = (url?: string) => (url || '').trim() || '#'

// ------------------------------------------------------------------
// Draft persistence (localStorage)
// ------------------------------------------------------------------
const STORAGE_KEY = `byway:module-draft:${teacherId}:${courseId}`
const autosaveEnabled = ref(true)
const lastSavedAt = ref<string>('')
const draftVersion = ref(1)

const saveDraft = () => {
  if (process.client) {
    const payload = JSON.stringify(moduleData)
    localStorage.setItem(STORAGE_KEY, payload)
    lastSavedAt.value = new Date().toLocaleString()
    draftVersion.value += 1
    message.success('Draft saved locally')
  }
}
const forceSaveDraft = () => saveDraft()
const toggleAutosave = () => {
  autosaveEnabled.value = !autosaveEnabled.value
  message.info(`Autosave ${autosaveEnabled.value ? 'enabled' : 'disabled'}`)
}

// Restore on mount
onMounted(() => {
  try {
    const raw = process.client ? localStorage.getItem(STORAGE_KEY) : null
    if (raw) {
      const parsed = JSON.parse(raw)
      Object.assign(moduleData, parsed)
      restored.value = true
      expandAll()
    } else {
      // Seed with two example lessons (mock) for a richer first-load experience
      addVideoIntro()
      addReadingConcept()
    }
  } catch (e) {
    // ignore restore errors
  }
  // attach keyboard listeners
  window.addEventListener('keydown', onKeydown)
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})

// Autosave watcher (debounced)
let autosaveTimer: any = null
watch(
  moduleData,
  () => {
    if (!autosaveEnabled.value) return
    clearTimeout(autosaveTimer)
    autosaveTimer = setTimeout(() => {
      saveDraft()
      pushHistory() // capture autosave as a history step
    }, 600)
  },
  { deep: true }
)

// ------------------------------------------------------------------
// Undo/Redo (simple snapshot-based history)
// ------------------------------------------------------------------
const history = ref<string[]>([])
const historyIndex = ref(-1)
const canUndo = computed(() => historyIndex.value > 0)
const canRedo = computed(() => historyIndex.value < history.value.length - 1)

const snapshot = () => JSON.stringify(moduleData)
const restoreSnapshot = (s: string) => Object.assign(moduleData, JSON.parse(s))
const pushHistory = () => {
  const s = snapshot()
  // If current equals last, skip
  if (history.value[historyIndex.value] === s) return
  // Truncate forward history if needed
  history.value = history.value.slice(0, historyIndex.value + 1)
  history.value.push(s)
  historyIndex.value = history.value.length - 1
}
const undoChange = () => {
  if (!canUndo.value) return
  historyIndex.value -= 1
  restoreSnapshot(history.value[historyIndex.value])
}
const redoChange = () => {
  if (!canRedo.value) return
  historyIndex.value += 1
  restoreSnapshot(history.value[historyIndex.value])
}

// Initialize first history state
nextTick(() => pushHistory())

// ------------------------------------------------------------------
// Import / Export / Settings / Shortcuts
// ------------------------------------------------------------------
const openImport = () => {
  importText.value = ''
  importOpen.value = true
}
const confirmImport = () => {
  try {
    const parsed = JSON.parse(importText.value || '{}')
    Object.assign(moduleData, parsed)
    importOpen.value = false
    expandAll()
    pushHistory()
    message.success('Imported module JSON')
  } catch (e:any) {
    message.error(`Invalid JSON: ${e?.message || e}`)
  }
}

const openExport = () => {
  exportText.value = snapshot()
  exportOpen.value = true
}
const openSettings = () => (settingsOpen.value = true)
const openShortcuts = () => (shortcutsOpen.value = true)

// ------------------------------------------------------------------
// Keyboard Shortcuts
// ------------------------------------------------------------------
function onKeydown(e: KeyboardEvent) {
  const meta = e.metaKey || e.ctrlKey
  const shift = e.shiftKey
  // Save draft: Ctrl/Cmd + S
  if (meta && e.key.toLowerCase() === 's') {
    e.preventDefault()
    saveDraft()
  }
  // Add lesson: Ctrl/Cmd + Enter
  if (meta && e.key === 'Enter') {
    e.preventDefault()
    addLesson()
  }
  // Undo: Ctrl/Cmd + Z
  if (meta && !shift && e.key.toLowerCase() === 'z') {
    e.preventDefault()
    undoChange()
  }
  // Redo: Ctrl/Cmd + Shift + Z
  if (meta && shift && e.key.toLowerCase() === 'z') {
    e.preventDefault()
    redoChange()
  }
  // Expand all: Ctrl/Cmd + .
  if (meta && e.key === '.') {
    e.preventDefault()
    expandAll()
  }
  // Collapse all: Ctrl/Cmd + ,
  if (meta && e.key === ',') {
    e.preventDefault()
    collapseAll()
  }
}

// ------------------------------------------------------------------
// Lesson CRUD
// ------------------------------------------------------------------
const addLesson = (preset?: Partial<Lesson>) => {
  const base: Lesson = {
    id: uid(),
    title: '',
    type: 'video',
    duration: settings.defaultDuration,
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
  activePanels.value = [...new Set([...activePanels.value, newLesson.id])]
  pushHistory()
}
const duplicateLesson = (idx: number) => {
  const copy = JSON.parse(JSON.stringify(moduleData.lessons[idx])) as Lesson
  copy.id = uid()
  copy.title = copy.title ? `${copy.title} (copy)` : 'Untitled (copy)'
  moduleData.lessons.splice(idx+1, 0, copy)
  activePanels.value = [...new Set([...activePanels.value, copy.id])]
  pushHistory()
}
const removeLesson = (idx: number) => {
  moduleData.lessons.splice(idx, 1)
  pushHistory()
}
const moveLesson = (idx: number, dir: number) => {
  const to = idx + dir
  if (to < 0 || to >= moduleData.lessons.length) return
  const [l] = moduleData.lessons.splice(idx, 1)
  moduleData.lessons.splice(to, 0, l)
  pushHistory()
}

// Quick insertion helpers
const addQuizCheckpoint = () =>
  addLesson({
    type: 'quiz',
    title: 'Checkpoint quiz',
    duration: 8,
    quiz: {
      questions: Array.from({ length: 5 }).map((_, i) => ({
        id: uid(),
        text: `Question ${i + 1}`,
        type: 'mcq',
        options: [
          { text: 'A', correct: true },
          { text: 'B', correct: false }
        ]
      }))
    }
  })
const addMiniAssignment = () =>
  addLesson({
    type: 'assignment',
    title: 'Mini assignment',
    duration: 20,
    content: 'Build a small feature using today’s concept.',
    rubric: '✅ Completeness, ✅ Correctness, ✅ Clarity'
  })
const addVideoIntro = () =>
  addLesson({
    type: 'video',
    title: 'Module intro & goals',
    duration: 6,
    content: 'What we will build, key concepts, how to succeed.'
  })
const addReadingConcept = () =>
  addLesson({
    type: 'reading',
    title: 'Core concepts',
    duration: 10,
    content: 'Definitions, examples, pitfalls, and quick checks.'
  })

// ------------------------------------------------------------------
// Quiz ops
// ------------------------------------------------------------------
const addQuestion = (lIdx: number) => {
  moduleData.lessons[lIdx].quiz?.questions.push({
    id: uid(),
    text: '',
    type: 'mcq',
    options: [{ text: '', correct: false }]
  })
  pushHistory()
}
const removeQuestion = (lIdx: number, qIdx: number) => {
  moduleData.lessons[lIdx].quiz?.questions.splice(qIdx, 1)
  pushHistory()
}
const moveQuestion = (lIdx: number, qIdx: number, dir: number) => {
  const qs = moduleData.lessons[lIdx].quiz?.questions || []
  const to = qIdx + dir
  if (to < 0 || to >= qs.length) return
  const [q] = qs.splice(qIdx, 1)
  qs.splice(to, 0, q)
  pushHistory()
}
const addOption = (lIdx: number, qIdx: number) => {
  moduleData.lessons[lIdx].quiz?.questions[qIdx].options.push({ text: '', correct: false })
  pushHistory()
}
const removeOption = (lIdx: number, qIdx: number, oIdx: number) => {
  moduleData.lessons[lIdx].quiz?.questions[qIdx].options.splice(oIdx, 1)
  pushHistory()
}
const seedFiveMcq = (lIdx: number) => {
  const qs = moduleData.lessons[lIdx].quiz?.questions || []
  for (let i = 0; i < 5; i++) {
    qs.push({
      id: uid(),
      text: `Auto-seeded MCQ ${qs.length + 1}`,
      type: 'mcq',
      options: [
        { text: 'Option A', correct: true },
        { text: 'Option B', correct: false },
        { text: 'Option C', correct: false }
      ]
    })
  }
  moduleData.lessons[lIdx].quiz!.questions = qs
  pushHistory()
}

// ------------------------------------------------------------------
// Resources
// ------------------------------------------------------------------
const addResource = (lIdx: number) => {
  moduleData.lessons[lIdx].resources.push({ title: '', url: '' })
  pushHistory()
}
const removeResource = (lIdx: number, rIdx: number) => {
  moduleData.lessons[lIdx].resources.splice(rIdx, 1)
  pushHistory()
}

// ------------------------------------------------------------------
// Collapse helpers
// ------------------------------------------------------------------
const expandAll = () => (activePanels.value = moduleData.lessons.map(l => l.id))
const collapseAll = () => (activePanels.value = [])

// ------------------------------------------------------------------
// Templates
// ------------------------------------------------------------------
const openTemplates = () => (templatesOpen.value = true)
const applyTemplate = () => {
  const [type, key] = selectedTemplate.value.split(':')
  if (type === 'video' && key === 'intro') {
    addVideoIntro()
  }
  if (type === 'reading' && key === 'notes') {
    addReadingConcept()
  }
  if (type === 'quiz' && key === 'checkpoint') {
    addQuizCheckpoint()
  }
  if (type === 'assignment' && key === 'mini') {
    addMiniAssignment()
  }
  templatesOpen.value = false
}

// ------------------------------------------------------------------
// Bulk add
// ------------------------------------------------------------------
const openBulkAdd = () => {
  bulkOpen.value = true
  bulkText.value = ''
}
const confirmBulkAdd = () => {
  const lines = bulkText.value.split('\n').map(l => l.trim()).filter(Boolean)
  for (const line of lines) {
    const [typeRaw, titleRaw, minRaw] = line.split('|').map(s => (s || '').trim())
    const type = (typeRaw?.toLowerCase() as any) || 'video'
    const duration = Number(minRaw) || settings.defaultDuration
    addLesson({ type, title: titleRaw || 'Untitled', duration })
  }
  bulkOpen.value = false
  message.success(`Added ${lines.length} lessons`)
}

// ------------------------------------------------------------------
// Save (mock) / Back
// ------------------------------------------------------------------
const saveModule = () => {
  if (!moduleData.title) return message.error('Please add a module title')
  // This is mocked; integrate with your API as needed.
  // The payload is fully self-contained:
  console.log('Saving module payload', { teacherId, courseId, moduleData })
  message.success(`Module "${moduleData.title}" saved`)
  pushHistory()
}
const goBack = () => history.back()

// ------------------------------------------------------------------
// Slug generation
// ------------------------------------------------------------------
const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
const maybeGenerateSlug = () => {
  if (!moduleData.slug && moduleData.title) {
    moduleData.slug = slugify(moduleData.title)
  }
}

// ------------------------------------------------------------------
// Warnings
// ------------------------------------------------------------------
const warnings = computed<string[]>(() => {
  const list: string[] = []
  if (!moduleData.title) list.push('Module is missing a title.')
  if (!moduleData.lessons.length) list.push('No lessons — add at least one.')
  if (moduleData.lessons.some(l => !l.title) && settings.warnMissingTitle) {
    list.push('Some lessons are missing a title.')
  }
  if (moduleData.lessons.some(l => !l.duration) && settings.warnZeroDuration) {
    list.push('Some lessons have zero duration.')
  }
  return list
})
const hasWarnings = computed(() => warnings.value.length > 0)

const lessonWarnings = (idx: number) => {
  const l = moduleData.lessons[idx]
  const result: string[] = []
  if (!l.title && settings.warnMissingTitle) result.push('Missing lesson title')
  if (!l.duration && settings.warnZeroDuration) result.push('Duration is zero')
  if (l.type === 'video' && !l.videoUrl) result.push('Video URL is empty')
  if (l.type === 'quiz' && !(l.quiz?.questions?.length)) result.push('Quiz has no questions')
  return result
}
</script>

<style scoped>
/* ==========================================================================================
   Styles: clean, breathable UI; small helper utilities for clarity
========================================================================================== */

.module-create-layout {
  background: #fafafa;
  min-height: 100vh;
  padding: 24px;
}

.page-header {
  background: #fff;
  border-radius: 8px;
  padding: 16px 24px;
  box-shadow: 0 2px 6px rgba(0,0,0,.04);
}

.restore { margin: 16px 0; }

.progress-card {
  margin-top: 16px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,.05);
  padding: 16px;
}

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
  background:#f5f5f5;
  border-radius:8px;
  padding:8px 12px;
  word-break:break-all;
  border: 1px dashed #e6e6e6;
}

.quiz-q :deep(.ant-card-head) { min-height: 36px; padding: 0 12px; }
.mcq-opt { display:flex; align-items:center; gap:6px; margin-bottom:6px; }
.resource-row { display:flex; align-items:center; margin-bottom:6px; }

.lesson-warn :deep(.ant-alert) {
  border-radius: 8px;
}

.totals {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
