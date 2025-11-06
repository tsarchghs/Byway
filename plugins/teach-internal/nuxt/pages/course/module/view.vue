<template>
  <a-config-provider :theme="{ algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm }">
    <a-layout :class="['admin-wrap', isDark ? 'is-dark' : '']">
      <!-- HEADER -->
      <a-page-header
        class="admin-header"
        title="Course Admin"
        :sub-title="`Edit · ${flatLessons.length} lesson${flatLessons.length!==1?'s':''}`"
      >
        <template #tags>
          <a-tag color="blue">{{ course.category || '—' }}</a-tag>
          <a-tag color="gold">{{ course.difficulty || '—' }}</a-tag>
          <a-tag v-if="totalMinutes" color="blue"><FieldTimeOutlined /> {{ totalMinutes }} min</a-tag>
        </template>
        <template #extra>
          <a-space>
            <a-switch v-model:checked="autoSave" :checked-children="'Auto-save'" :un-checked-children="'Manual save'"/>
            <a-tooltip title="Toggle dark">
              <a-button shape="circle" @click="toggleDark"><BulbOutlined/></a-button>
            </a-tooltip>
            <a-dropdown>
              <a-button>
                File <DownOutlined />
              </a-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="syncNow"><SaveOutlined /> Sync now</a-menu-item>
                  <a-menu-item @click="reloadFromApi"><CloudDownloadOutlined /> Reload</a-menu-item>
                  <!-- (No LS / Import / Export here anymore) -->
                </a-menu>
              </template>
            </a-dropdown>
          </a-space>
        </template>
      </a-page-header>

      <a-layout>
        <!-- LEFT: OUTLINE -->
        <a-layout-sider width="310" class="admin-sider" collapsible v-model:collapsed="siderCollapsed">
          <div class="sider-pad">
            <div class="cover" :style="coverStyle">
              <div class="cover-gradient"></div>
              <div class="cover-meta" v-if="!siderCollapsed">
                <div class="cover-title">{{ course.title || 'Untitled course' }}</div>
                <div class="cover-tags">
                  <a-tag v-if="course.category" color="blue">{{ course.category }}</a-tag>
                  <a-tag v-if="course.difficulty" color="gold">{{ course.difficulty }}</a-tag>
                </div>
              </div>
            </div>

            <a-input-search v-model:value="filter" placeholder="Filter lessons" allow-clear class="mt-2"/>

            <a-space class="mt-2" wrap>
              <a-button size="small" type="primary" @click="addModule"><PlusOutlined /> Module</a-button>
              <a-button size="small" @click="addLessonToCurrent" :disabled="!currentModule"><PlusOutlined /> Lesson</a-button>
              <a-button size="small" @click="expandAll">Expand</a-button>
              <a-button size="small" @click="collapseAll">Collapse</a-button>
            </a-space>

            <a-collapse v-model:activeKey="activePanels" class="mt-2" accordion>
              <a-collapse-panel
                v-for="(m, mi) in course.modules"
                :key="`m-${mi}`"
                :header="m.title || `Module ${mi+1}`"
              >
                <div class="mod-actions">
                  <a-space>
                    <a-button size="small" @click="moveModule(mi, -1)" :disabled="mi===0">↑</a-button>
                    <a-button size="small" @click="moveModule(mi, +1)" :disabled="mi===course.modules.length-1">↓</a-button>
                    <a-button size="small" @click="renameModule(mi)"><EditOutlined /></a-button>
                    <a-popconfirm title="Delete module?" ok-text="Delete" @confirm="removeModule(mi)">
                      <a-button size="small" danger><DeleteOutlined /></a-button>
                    </a-popconfirm>
                  </a-space>
                </div>

                <a-list size="small" :data-source="m.lessons">
                  <template #renderItem="{ item, index }">
                    <a-list-item
                      :class="['tree-lesson', selectedKey===`l-${mi}-${index}` && 'active']"
                      v-if="matchFilter(item)"
                      @click="select(mi, index)"
                    >
                      <a-list-item-meta
                        :title="item.title || 'Untitled'"
                        :description="(item.type || '—') + (item.duration ? ` · ${item.duration} min` : '') + (item.preview ? ' · preview' : '')"
                      />
                      <template #actions>
                        <a-space>
                          <a-button size="small" @click.stop="moveLesson(mi, index, -1)" :disabled="index===0">↑</a-button>
                          <a-button size="small" @click.stop="moveLesson(mi, index, +1)" :disabled="index===m.lessons.length-1">↓</a-button>
                          <a-popconfirm title="Delete lesson?" ok-text="Delete" @confirm="removeLesson(mi, index)">
                            <a-button size="small" danger><DeleteOutlined /></a-button>
                          </a-popconfirm>
                        </a-space>
                      </template>
                    </a-list-item>
                  </template>
                </a-list>

                <a-button size="small" class="mt-1" block @click="addLesson(mi)"><PlusOutlined /> Add lesson</a-button>
              </a-collapse-panel>
            </a-collapse>
          </div>
        </a-layout-sider>

        <!-- CENTER: EDITORS -->
        <a-layout-content class="admin-content">
          <a-tabs v-model:activeKey="tab">
            <a-tab-pane key="course" tab="Course">
              <a-row :gutter="16">
                <a-col :md="14" :xs="24">
                  <a-card title="Course details">
                    <a-form layout="vertical">
                      <a-form-item label="Title"><a-input v-model:value="course.title" @change="touch"/></a-form-item>
                      <a-form-item label="Category"><a-input v-model:value="course.category" @change="touch"/></a-form-item>
                      <a-form-item label="Difficulty">
                        <a-select v-model:value="course.difficulty" @change="touch" :options="diffOptions"/>
                      </a-form-item>
                      <a-form-item label="Description">
                        <a-textarea :rows="5" v-model:value="course.description" @change="touch"/>
                      </a-form-item>
                    </a-form>
                  </a-card>

                  <a-card class="mt-2" title="Assets (cover & files)">
                    <a-form layout="vertical">
                      <a-form-item label="Cover URL">
                        <a-input v-model:value="coverInput" placeholder="https://…" @pressEnter="setCover"/>
                        <div class="mt-1">
                          <a-button @click="setCover">Set cover</a-button>
                          <a-button @click="clearCover" type="link">Clear</a-button>
                        </div>
                      </a-form-item>
                      <a-divider />
                      <a-form-item label="Course files">
                        <a-space class="mb-1" wrap>
                          <a-input v-model:value="fileName" placeholder="Name"/>
                          <a-input v-model:value="fileUrl" placeholder="URL"/>
                          <a-button @click="addCourseFile"><PlusOutlined /> Add</a-button>
                        </a-space>
                        <a-list bordered :data-source="course.files">
                          <template #renderItem="{ item, index }">
                            <a-list-item>
                              <a-list-item-meta :title="item.name || 'Asset'" :description="item.url || item.thumbUrl"/>
                              <template #actions>
                                <a-button size="small" @click="removeCourseFile(index)" danger>Remove</a-button>
                              </template>
                            </a-list-item>
                          </template>
                        </a-list>
                      </a-form-item>
                    </a-form>
                  </a-card>
                </a-col>

                <a-col :md="10" :xs="24">
                  <a-card title="Pricing & discount">
                    <a-form layout="vertical">
                      <a-form-item label="Price (EUR)">
                        <a-input-number v-model:value="course.price" :min="0" style="width:100%" @change="touch"/>
                      </a-form-item>
                      <a-form-item label="Course discount (%)">
                        <a-input-number v-model:value="course.discount" :min="0" :max="100" style="width:100%" @change="touch"/>
                      </a-form-item>
                      <a-alert type="info" show-icon :message="`Payable: ${fmt(payablePreview)}`"/>
                    </a-form>
                  </a-card>

                  <a-card title="API" class="mt-2">
                    <a-space direction="vertical" style="width:100%">
                      <a-button block @click="syncNow"><SaveOutlined/> Sync now</a-button>
                      <a-button block @click="reloadFromApi"><CloudDownloadOutlined/> Reload from API</a-button>
                    </a-space>
                  </a-card>
                </a-col>
              </a-row>
            </a-tab-pane>

            <a-tab-pane key="lesson" tab="Lesson editor" force-render>
              <a-alert v-if="!currentLesson" type="warning" message="Select or create a lesson from the left outline." show-icon />
              <template v-else>
                <a-card :title="currentLesson.title || 'Lesson'">
                  <a-form layout="vertical">
                    <a-row :gutter="16">
                      <a-col :md="16" :xs="24">
                        <a-form-item label="Title"><a-input v-model:value="currentLesson.title" @change="touch"/></a-form-item>
                        <a-form-item label="Type">
                          <a-select v-model:value="currentLesson.type" :options="typeOptions" @change="touch"/>
                        </a-form-item>

                        <template v-if="currentLesson.type==='video'">
                          <a-form-item label="Video URL (YouTube accepted)">
                            <a-input v-model:value="currentLesson.videoUrl" @change="touch"/>
                          </a-form-item>
                          <a-form-item label="Notes / summary (optional)">
                            <a-textarea :rows="4" v-model:value="currentLesson.content" @change="touch"/>
                          </a-form-item>
                        </template>

                        <template v-else-if="currentLesson.type==='reading'">
                          <a-form-item label="Reading content (HTML or text)">
                            <a-textarea :rows="8" v-model:value="currentLesson.content" @change="touch"/>
                          </a-form-item>
                        </template>

                        <template v-else-if="currentLesson.type==='assignment'">
                          <a-form-item label="Brief">
                            <a-textarea :rows="6" v-model:value="currentLesson.content" @change="touch"/>
                          </a-form-item>
                          <a-form-item label="Rubric">
                            <a-textarea :rows="4" v-model:value="currentLesson.rubric" @change="touch"/>
                          </a-form-item>
                        </template>

                        <template v-else-if="currentLesson.type==='quiz'">
                          <a-alert type="info" show-icon message="Build questions below. MCQ supports multiple options; mark the correct one(s)." class="mb-2"/>
                          <a-space class="mb-2" wrap>
                            <a-button size="small" @click="addQuestion('mcq')"><PlusOutlined/> MCQ</a-button>
                            <a-button size="small" @click="addQuestion('tf')"><PlusOutlined/> True/False</a-button>
                            <a-button size="small" @click="addQuestion('short')"><PlusOutlined/> Short</a-button>
                          </a-space>

                          <a-collapse v-model:activeKey="activeQPanels">
                            <a-collapse-panel
                              v-for="(q, qi) in currentLesson.quiz?.questions || []"
                              :key="q.id"
                              :header="`Q${qi+1}: ${q.text || '(empty)'}`"
                            >
                              <a-form layout="vertical">
                                <a-form-item label="Question text">
                                  <a-input v-model:value="q.text" @change="touch"/>
                                </a-form-item>
                                <a-form-item label="Type">
                                  <a-select v-model:value="q.type" :options="qTypeOptions" @change="onQTypeChange(q)"/>
                                </a-form-item>

                                <div v-if="q.type==='mcq'">
                                  <div v-for="(opt, oi) in (q.options || [])" :key="oi" class="option-row">
                                    <a-input v-model:value="opt.text" placeholder="Option text" class="opt-input" @change="touch"/>
                                    <a-checkbox v-model:checked="opt.correct" @change="touch">Correct</a-checkbox>
                                    <a-button size="small" danger @click="removeOption(q, oi)">Remove</a-button>
                                  </div>
                                  <a-button size="small" class="mt-1" @click="addOption(q)"><PlusOutlined/> Add option</a-button>
                                </div>

                                <div class="mt-1">
                                  <a-space>
                                    <a-button size="small" @click="moveQuestion(qi, -1)" :disabled="qi===0">↑</a-button>
                                    <a-button size="small" @click="moveQuestion(qi, +1)" :disabled="qi===(currentLesson.quiz!.questions.length-1)">↓</a-button>
                                    <a-popconfirm title="Delete question?" ok-text="Delete" @confirm="removeQuestion(qi)">
                                      <a-button size="small" danger><DeleteOutlined/></a-button>
                                    </a-popconfirm>
                                  </a-space>
                                </div>
                              </a-form>
                            </a-collapse-panel>
                          </a-collapse>
                        </template>
                      </a-col>

                      <a-col :md="8" :xs="24">
                        <a-card size="small" title="Meta">
                          <a-form layout="vertical">
                            <a-form-item label="Duration (min)">
                              <a-input-number style="width:100%" :min="0" v-model:value="currentLesson.duration" @change="touch"/>
                            </a-form-item>
                            <a-form-item label="Tags (comma separated)">
                              <a-input v-model:value="tagsInput" @change="applyTags" placeholder="vue, reactivity"/>
                            </a-form-item>
                            <a-form-item>
                              <a-checkbox v-model:checked="currentLesson.preview" @change="touch">Preview (unlocked)</a-checkbox>
                            </a-form-item>
                            <a-form-item label="Unlock at (ISO)">
                              <a-input v-model:value="unlockInput" @change="applyUnlock"/>
                            </a-form-item>
                            <a-form-item label="Prerequisites">
                              <a-select
                                mode="multiple"
                                :options="prereqOptions"
                                v-model:value="currentLesson.prerequisites"
                                @change="touch"
                              />
                            </a-form-item>
                          </a-form>
                        </a-card>

                        <a-card size="small" class="mt-2" title="Resources">
                          <a-space class="mb-1" wrap>
                            <a-input v-model:value="resTitle" placeholder="Title"/>
                            <a-input v-model:value="resUrl" placeholder="URL"/>
                            <a-button @click="addResource"><PlusOutlined/> Add</a-button>
                          </a-space>
                          <a-list :data-source="currentLesson.resources || []" bordered>
                            <template #renderItem="{ item, index }">
                              <a-list-item>
                                <a-list-item-meta :title="item.title || item.name || 'Resource'" :description="item.url"/>
                                <template #actions>
                                  <a-button size="small" danger @click="removeResource(index)">Remove</a-button>
                                </template>
                              </a-list-item>
                            </template>
                          </a-list>
                        </a-card>

                        <a-card size="small" class="mt-2" title="Attachments">
                          <a-space class="mb-1" wrap>
                            <a-input v-model:value="attName" placeholder="Name"/>
                            <a-input v-model:value="attUrl" placeholder="URL"/>
                            <a-button @click="addAttachment"><PlusOutlined/> Add</a-button>
                          </a-space>
                          <a-list :data-source="currentLesson.attachments || []" bordered>
                            <template #renderItem="{ item, index }">
                              <a-list-item>
                                <a-list-item-meta :title="item.name || 'Attachment'" :description="item.url"/>
                                <template #actions>
                                  <a-button size="small" danger @click="removeAttachment(index)">Remove</a-button>
                                </template>
                              </a-list-item>
                            </template>
                          </a-list>
                        </a-card>
                      </a-col>
                    </a-row>
                  </a-form>
                </a-card>
              </template>
            </a-tab-pane>

            <a-tab-pane key="preview" tab="Preview (learner)">
              <a-card :title="currentLesson?.title || 'Select a lesson'">
                <template v-if="currentLesson">
                  <div class="preview-head">
                    <a-tag>{{ currentLesson.type }}</a-tag>
                    <a-tag v-if="currentLesson.preview" color="cyan">Preview</a-tag>
                    <span class="muted"><FieldTimeOutlined /> {{ currentLesson.duration || 0 }} min</span>
                  </div>

                  <div v-if="currentLesson.type==='video'">
                    <div v-if="ytEmbed(currentLesson.videoUrl)" class="video-wrap">
                      <iframe :src="ytEmbed(currentLesson.videoUrl)" frameborder="0" allowfullscreen />
                    </div>
                    <div v-else class="video-fallback">
                      <a-typography-paragraph>
                        Video URL: <a :href="currentLesson.videoUrl" target="_blank">{{ currentLesson.videoUrl || '—' }}</a>
                      </a-typography-paragraph>
                    </div>
                    <a-divider>Notes</a-divider>
                    <a-typography-paragraph style="white-space:pre-wrap">{{ currentLesson.content }}</a-typography-paragraph>
                  </div>

                  <div v-else-if="currentLesson.type==='reading'">
                    <a-typography-paragraph style="white-space:pre-wrap">{{ currentLesson.content || 'No content' }}</a-typography-paragraph>
                  </div>

                  <div v-else-if="currentLesson.type==='assignment'">
                    <a-typography-paragraph style="white-space:pre-wrap">{{ currentLesson.content || 'No brief' }}</a-typography-paragraph>
                    <a-alert v-if="currentLesson.rubric" type="info" show-icon :message="'Rubric'" :description="currentLesson.rubric" class="mt-1"/>
                  </div>

                  <div v-else-if="currentLesson.type==='quiz'">
                    <a-list :data-source="currentLesson.quiz?.questions || []" :renderItem="q => q">
                      <template #renderItem="{ item, index }">
                        <a-list-item>
                          <b>Q{{ index+1 }}</b>: {{ item.text || '(empty)' }}
                          <div v-if="item.type==='mcq'">
                            <ul class="mt-1">
                              <li v-for="(o, oi) in item.options || []" :key="oi">
                                {{ o.text || `Option ${oi+1}` }} <span v-if="o.correct" class="muted">✔</span>
                              </li>
                            </ul>
                          </div>
                          <div v-else-if="item.type==='tf'" class="muted">True/False</div>
                          <div v-else class="muted">Short answer</div>
                        </a-list-item>
                      </template>
                    </a-list>
                  </div>
                </template>
                <a-empty v-else description="Pick a lesson" />
              </a-card>
            </a-tab-pane>
          </a-tabs>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-config-provider>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import { theme, message } from 'ant-design-vue'
import {
  BulbOutlined, SaveOutlined, CloudDownloadOutlined,
  PlusOutlined, DeleteOutlined, EditOutlined, DownOutlined, FieldTimeOutlined
} from '@ant-design/icons-vue'
import { useRoute } from 'vue-router'

/** Utils */
const fmt = (n: number) => n.toLocaleString(undefined, { style: 'currency', currency: 'EUR' })
const uid = () => Math.random().toString(36).slice(2, 9)
const splitTags = (s:string) => s.split(',').map(x=>x.trim()).filter(Boolean)
const ytEmbed = (url?:string) => {
  if (!url) return ''
  if (/youtube\.com|youtu\.be/.test(url)) {
    const id = url.match(/(?:v=|be\/)([A-Za-z0-9_-]{6,})/)?.[1]
    return id ? `https://www.youtube.com/embed/${id}?rel=0` : ''
  }
  return ''
}

/** Types */
type QuizOption = { text: string; correct: boolean }
type QuizQuestion = { id: string; text: string; type: 'mcq'|'tf'|'short'; options?: QuizOption[] }
type Resource = { id?: string; name?: string; title?: string; kind?: 'pdf'|'file'|'link'; url: string }
type Lesson = {
  id: string
  moduleId?: string
  title: string
  type: 'video'|'reading'|'quiz'|'assignment'|string
  duration?: number
  content?: string
  videoUrl?: string
  rubric?: string
  resources?: Resource[]
  attachments?: { name?: string; url?: string }[]
  tags?: string[]
  prerequisites?: string[]
  unlockAt?: string|number|Date
  completed?: boolean
  preview?: boolean
  quiz?: { questions: QuizQuestion[] }
}
type ModuleT = { id?: string; courseId?: string; title: string; lessons: Lesson[] }
type CourseT = {
  id?: string
  title: string
  category: string
  difficulty: 'Beginner'|'Intermediate'|'Advanced'|string
  description: string
  price: number
  discount: number
  coverUrl?: string
  modules: ModuleT[]
  files: Array<{ name?: string; url?: string; thumbUrl?: string }>
}

/** Config / GraphQL helper */
const route = useRoute()
const API_URL = 'http://localhost:4000/api/teach-internal/graphql'
// rely on HttpOnly auth cookie; no localStorage token
function getAuthHeaders() {
  return { 'Content-Type':'application/json' } as Record<string,string>
}
async function fetchGraphQL<T=any>(query: string, variables?: Record<string, any>): Promise<T> {
  const resp = await fetch(API_URL, {
    method: 'POST',
    credentials: 'include',
    headers: getAuthHeaders(),
    body: JSON.stringify({ query, variables })
  })
  const json = await resp.json()
  if (json.errors?.length) throw new Error(json.errors[0]?.message || 'GraphQL error')
  return json.data as T
}

/** Theme & UI */
const isDark = ref(false)
function toggleDark(){ isDark.value = !isDark.value }

const tab = ref<'course'|'lesson'|'preview'>('course')
const siderCollapsed = ref(false)
const activePanels = ref<string[]>([])
const activeQPanels = ref<string[]>([])
const filter = ref('')

/** Base reactive state */
const course = reactive<CourseT>({
  title: '',
  category: '',
  difficulty: 'Beginner',
  description: '',
  price: 0,
  discount: 0,
  modules: [],
  files: []
})

/** Derived */
const totalMinutes = computed(()=> course.modules.flatMap(m=>m.lessons||[]).reduce((s,l)=> s+(l.duration||0), 0))
const coverUrl = computed(()=> course.files?.[0]?.url || course.coverUrl || '')
const coverStyle = computed(()=> ({ backgroundImage: coverUrl.value ? `url('${coverUrl.value}')` : 'linear-gradient(135deg,#111,#334155)' }))
const flatLessons = computed(()=> {
  const arr:{ id:string; label:string }[] = []
  course.modules.forEach((m, mi)=> (m.lessons||[]).forEach((l, li)=> arr.push({ id: l.id, label: `${m.title || `Module ${mi+1}`}: ${l.title || 'Untitled'}`})))
  return arr
})
const selectedKey = computed(()=>`l-${currentModuleIndex.value}-${currentLessonIndex.value}`)
const payablePreview = computed(() => (Number(course.price||0)) * (1 - Number(course.discount||0)/100))

/** Outline selection */
const currentModuleIndex = ref(0)
const currentLessonIndex = ref(0)
const currentModule = computed<ModuleT|undefined>(() => course.modules[currentModuleIndex.value])
const currentLesson  = computed<Lesson|undefined>(() => currentModule.value?.lessons?.[currentLessonIndex.value])
function select(mi:number, li:number){ currentModuleIndex.value = mi; currentLessonIndex.value = li; tab.value='lesson'; }

/** Options */
const typeOptions = [
  { label:'Video', value:'video' },
  { label:'Reading', value:'reading' },
  { label:'Quiz', value:'quiz' },
  { label:'Assignment', value:'assignment' },
]
const qTypeOptions = [
  { label:'Multiple Choice', value:'mcq' },
  { label:'True / False', value:'tf' },
  { label:'Short Answer', value:'short' },
]
const diffOptions = [
  { label:'Beginner', value:'Beginner' },
  { label:'Intermediate', value:'Intermediate' },
  { label:'Advanced', value:'Advanced' },
]

/** Filters */
function matchFilter(l:Lesson){
  const q = filter.value.trim().toLowerCase()
  if (!q) return true
  return (l.title||'').toLowerCase().includes(q) || (l.type||'').toLowerCase().includes(q)
}

/** GraphQL operations */
const GQL = {
  courseTree: `
    query CourseTree($id: String!) {
      course(id: $id) {
        id title category difficulty description price discount coverUrl
        modules { id title courseId
          lessons { id moduleId title type duration content videoUrl rubric metadata }
        }
      }
    }
  `,
  updateCourse: `
    mutation UpdateCourse(
      $id:String!,
      $title:String, $category:String, $difficulty:String, $description:String,
      $price:Float, $discount:Float, $coverUrl:String
    ){
      updateCourse(
        id:$id, title:$title, category:$category, difficulty:$difficulty, description:$description,
        price:$price, discount:$discount, coverUrl:$coverUrl
      ){ id }
    }
  `,
  createModule: `
    mutation CreateModule($courseId:String!, $title:String!){
      createModule(courseId:$courseId, title:$title){ id courseId title }
    }
  `,
  updateModule: `
    mutation UpdateModule($id:String!, $title:String){
      updateModule(id:$id, title:$title){ id }
    }
  `,
  deleteModule: `
    mutation DeleteModule($id:String!){
      deleteModule(id:$id){ id }
    }
  `,
  createLesson: `
    mutation CreateLesson(
      $moduleId:String!, $title:String!, $type:String!,
      $duration:Int, $content:String, $videoUrl:String, $rubric:String, $metadata: JSON
    ){
      createLesson(
        moduleId:$moduleId, title:$title, type:$type,
        duration:$duration, content:$content, videoUrl:$videoUrl, rubric:$rubric, metadata:$metadata
      ){ id moduleId title type duration content videoUrl rubric metadata }
    }
  `,
  updateLesson: `
    mutation UpdateLesson(
      $id:String!,
      $title:String, $type:String, $duration:Int, $content:String, $videoUrl:String, $rubric:String,
      $metadata: JSON
    ){
      updateLesson(
        id:$id, title:$title, type:$type, duration:$duration, content:$content, videoUrl:$videoUrl, rubric:$rubric,
        metadata:$metadata
      ){ id }
    }
  `,
  deleteLesson: `
    mutation DeleteLesson($id:String!){
      deleteLesson(id:$id){ id }
    }
  `
}

/** Normalize server course */
function normalizeCourse(src:any): CourseT {
  return {
    id: src.id,
    title: src.title || '',
    category: src.category || '',
    difficulty: src.difficulty || 'Beginner',
    description: src.description || '',
    price: Number(src.price ?? 0),
    discount: Number(src.discount ?? 0),
    coverUrl: src.coverUrl || '',
    modules: (src.modules || []).map((m:any) => ({
      id: m.id,
      courseId: m.courseId,
      title: m.title || '',
      lessons: (m.lessons || []).map((l:any) => {
        const md = l.metadata || {}
        return {
          id: l.id,
          moduleId: l.moduleId,
          title: l.title || '',
          type: l.type || 'reading',
          duration: l.duration ?? undefined,
          content: l.content || '',
          videoUrl: l.videoUrl || '',
          rubric: l.rubric || '',
          // merged metadata
          tags: md.tags || [],
          prerequisites: md.prerequisites || [],
          unlockAt: md.unlockAt || undefined,
          preview: !!md.preview,
          resources: md.resources || [],
          attachments: md.attachments || [],
          quiz: md.quiz || { questions: [] }
        } as Lesson
      })
    })),
    files: src.coverUrl ? [{ name: 'cover', url: src.coverUrl }] : []
  }
}

/** Replace the reactive course safely */
function replaceCourse(next:CourseT){
  next.modules ||= []
  next.files ||= []
  Object.keys(course).forEach(k => delete (course as any)[k])
  Object.assign(course, next)
  currentModuleIndex.value = Math.min(currentModuleIndex.value, Math.max(course.modules.length-1, 0))
  currentLessonIndex.value = Math.min(currentLessonIndex.value, Math.max(course.modules[currentModuleIndex.value]?.lessons.length-1 || 0, 0))
  reflectSideInputs()
}

/** Fetch */
const loading = ref(false)
async function fetchAllContent(id: string){
  loading.value = true
  try {
    const data = await fetchGraphQL<{ course: any }>(GQL.courseTree, { id })
    if (!data?.course) throw new Error('Course not found')
    replaceCourse(normalizeCourse(data.course))
  } catch (e:any) {
    console.warn('[CourseEditor] Failed to fetch API:', e.message)
    message.error(e.message || 'Failed to fetch course from API.')
  } finally {
    loading.value = false
  }
}

/** Debounced persistence (API only) */
const autoSave = ref(true)
let syncTimer:number|undefined

function buildLessonMetadata(l: Lesson){
  return {
    tags: l.tags || [],
    prerequisites: l.prerequisites || [],
    unlockAt: l.unlockAt || undefined,
    preview: !!l.preview,
    resources: l.resources || [],
    attachments: l.attachments || [],
    quiz: l.quiz || { questions: [] }
  }
}

async function apiUpdateCourse(){
  if (!course.id) return
  try {
    await fetchGraphQL(GQL.updateCourse, {
      id: course.id,
      title: course.title, category: course.category, difficulty: course.difficulty,
      description: course.description,
      price: Number(course.price ?? 0), discount: Number(course.discount ?? 0),
      coverUrl: coverUrl.value || ''
    })
  } catch (e:any){
    message.error('Update course failed: '+e.message)
  }
}
async function apiUpdateLesson(l: Lesson){
  if (!l?.id) return
  try {
    await fetchGraphQL(GQL.updateLesson, {
      id: l.id,
      title: l.title, type: l.type, duration: l.duration ?? null,
      content: l.content ?? '', videoUrl: l.videoUrl ?? '', rubric: l.rubric ?? '',
      metadata: buildLessonMetadata(l)
    })
  } catch (e:any){
    const msg = String(e?.message || '')
    if (msg.includes('No record was found for an update')) {
      message.warning('Lesson not found on server. Reloading…')
      if (course.id) await fetchAllContent(course.id)
    } else {
      message.error('Update lesson failed: '+msg)
    }
  }
}
async function syncDirty(){
  try {
    if (course.id) await apiUpdateCourse()
    if (currentLesson.value?.id) await apiUpdateLesson(currentLesson.value)
  } catch {}
}
function touch(syncApi = true){
  reflectSideInputs()
  if (syncApi && autoSave.value) {
    if (syncTimer) window.clearTimeout(syncTimer as any)
    syncTimer = window.setTimeout(syncDirty, 500) as any
  }
}
async function syncNow(){
  if (syncTimer) { window.clearTimeout(syncTimer as any); syncTimer = undefined }
  await syncDirty()
}
async function reloadFromApi(){
  if (!course.id) return
  await fetchAllContent(course.id)
}

/** Module CRUD */
async function apiCreateModule(title:string){
  if (!course.id) { message.warning('Open a valid course route with an ID.'); return }
  try {
    const data = await fetchGraphQL<{ createModule: any }>(GQL.createModule, { courseId: course.id, title })
    const created = data.createModule
    course.modules.push({ id: created.id, courseId: created.courseId, title: created.title, lessons: [] })
    activePanels.value = [`m-${course.modules.length-1}`]
    message.success('Module created')
  } catch (e:any){ message.error('Create module failed: '+e.message) }
}
async function apiUpdateModuleTitle(mi:number, title:string){
  const m = course.modules[mi]
  if (!m?.id) return
  try { await fetchGraphQL(GQL.updateModule, { id: m.id, title }); message.success('Module updated') }
  catch(e:any){ message.error('Update module failed: '+e.message) }
}
async function apiDeleteModule(mi:number){
  const m = course.modules[mi]
  if (!m?.id) { course.modules.splice(mi,1); return }
  try {
    await fetchGraphQL(GQL.deleteModule, { id: m.id })
    course.modules.splice(mi,1)
    currentModuleIndex.value = Math.max(0, Math.min(currentModuleIndex.value, course.modules.length-1))
    currentLessonIndex.value = 0
    message.success('Module deleted')
  } catch (e:any){ message.error('Delete module failed: '+e.message) }
}

/** Lesson CRUD */
async function apiCreateLesson(mi:number){
  const m = course.modules[mi]
  if (!m?.id) { message.warning('Create/save module first.'); return }
  try {
    const payload = {
      moduleId: m.id, title:'New lesson', type:'reading', duration:5, content:'',
      metadata: { tags:[], prerequisites:[], unlockAt:null, preview:false, resources:[], attachments:[], quiz:{questions:[]} }
    }
    const data = await fetchGraphQL<{ createLesson:any }>(GQL.createLesson, payload)
    const c = data.createLesson
    const md = c.metadata || {}
    m.lessons.push({
      id: c.id, moduleId: c.moduleId, title: c.title, type: c.type,
      duration: c.duration, content: c.content, videoUrl: c.videoUrl || '', rubric: c.rubric || '',
      tags: md.tags || [], prerequisites: md.prerequisites || [], unlockAt: md.unlockAt || undefined,
      preview: !!md.preview, resources: md.resources || [], attachments: md.attachments || [],
      quiz: md.quiz || { questions: [] }
    })
    select(mi, m.lessons.length-1)
    message.success('Lesson created')
  } catch (e:any){ message.error('Create lesson failed: '+e.message) }
}
async function apiDeleteLesson(mi:number, li:number){
  const l = course.modules[mi]?.lessons?.[li]
  if (!l) return
  if (!l.id) { course.modules[mi].lessons.splice(li,1); return }
  try {
    await fetchGraphQL(GQL.deleteLesson, { id: l.id })
    course.modules[mi].lessons.splice(li,1)
    currentLessonIndex.value = Math.max(0, Math.min(currentLessonIndex.value, (course.modules[mi].lessons.length-1)))
    message.success('Lesson deleted')
  } catch (e:any){ message.error('Delete lesson failed: '+e.message) }
}

/** Outline ops */
function addModule(){ apiCreateModule(`New module ${course.modules.length+1}`) }
function renameModule(mi:number){
  const now = prompt('Module title', course.modules[mi].title || '')
  if (now !== null){
    const title = now.trim()
    course.modules[mi].title = title
    apiUpdateModuleTitle(mi, title)
    touch(false)
  }
}
function removeModule(mi:number){
  const removedIds = new Set<string>((course.modules[mi].lessons||[]).map(l=>l.id))
  for (const m of course.modules){
    for (const l of (m.lessons||[])){
      if (l.prerequisites) l.prerequisites = l.prerequisites.filter(id=>!removedIds.has(id))
    }
  }
  apiDeleteModule(mi)
}
function moveModule(mi:number, dir:number){
  const ni = mi + dir
  if (ni<0 || ni>=course.modules.length) return
  const tmp = course.modules[mi]
  course.modules.splice(mi,1)
  course.modules.splice(ni,0,tmp)
  if (currentModuleIndex.value===mi) currentModuleIndex.value = ni
  touch() // if you track order in DB, call an API to persist order here
}

function addLesson(mi:number){ apiCreateLesson(mi) }
function addLessonToCurrent(){ if (currentModule.value) addLesson(currentModuleIndex.value) }
function removeLesson(mi:number, li:number){
  const removed = course.modules[mi].lessons[li]
  for (const m of course.modules){
    for (const l of (m.lessons||[])){
      if (l.prerequisites) l.prerequisites = l.prerequisites.filter(id => id !== removed.id)
    }
  }
  apiDeleteLesson(mi, li)
}
function moveLesson(mi:number, li:number, dir:number){
  const ni = li + dir
  const arr = course.modules[mi].lessons
  if (ni<0 || ni>=arr.length) return
  const tmp = arr[li]; arr.splice(li,1); arr.splice(ni,0,tmp)
  if (currentModuleIndex.value===mi && currentLessonIndex.value===li) currentLessonIndex.value = ni
  touch() // if you track order in DB, call an API to persist order here
}
function expandAll(){ activePanels.value = course.modules.map((_,i)=>`m-${i}`) }
function collapseAll(){ activePanels.value = [] }

/** Lesson meta helpers */
const tagsInput = ref('')
const unlockInput = ref('')
function reflectSideInputs(){
  if (currentLesson.value){
    tagsInput.value = (currentLesson.value.tags || []).join(', ')
    unlockInput.value = currentLesson.value.unlockAt ? String(currentLesson.value.unlockAt) : ''
  }
}
function applyTags(){ if (currentLesson.value){ currentLesson.value.tags = splitTags(tagsInput.value); touch() } }
function applyUnlock(){
  if (!currentLesson.value) return
  const v = unlockInput.value.trim()
  currentLesson.value.unlockAt = v || undefined
  touch()
}

/** Resources / Attachments */
const resTitle = ref(''); const resUrl = ref('')
function addResource(){
  if (!currentLesson.value) return
  if (!resUrl.value.trim()) return message.error('Resource URL required')
  currentLesson.value.resources = currentLesson.value.resources || []
  currentLesson.value.resources.push({ title: resTitle.value || undefined, url: resUrl.value.trim() })
  resTitle.value=''; resUrl.value=''
  touch()
}
function removeResource(i:number){ currentLesson.value?.resources?.splice(i,1); touch() }

const attName = ref(''); const attUrl = ref('')
function addAttachment(){
  if (!currentLesson.value) return
  if (!attUrl.value.trim()) return message.error('Attachment URL required')
  currentLesson.value.attachments = currentLesson.value.attachments || []
  currentLesson.value.attachments.push({ name: attName.value || undefined, url: attUrl.value.trim() })
  attName.value=''; attUrl.value=''
  touch()
}
function removeAttachment(i:number){ currentLesson.value?.attachments?.splice(i,1); touch() }

/** Course assets editor (maps first file to coverUrl on API) */
const coverInput = ref('')
const fileName = ref(''); const fileUrl = ref('')
function setCover(){
  const u = coverInput.value.trim()
  if (!u) return
  if (!course.files.length) course.files.push({ name:'cover', url: u })
  else course.files[0] = { ...(course.files[0]||{}), name: course.files[0]?.name || 'cover', url: u }
  if (course.id) apiUpdateCourse()
}
function clearCover(){
  if (course.files.length){ course.files.splice(0,1) }
  if (course.id) apiUpdateCourse()
}
function addCourseFile(){
  if (!fileUrl.value.trim()) return message.error('File URL required')
  course.files.push({ name: fileName.value || 'Asset', url: fileUrl.value.trim() })
  fileName.value=''; fileUrl.value=''
  touch()
}
function removeCourseFile(i:number){ course.files.splice(i,1); touch() }

/** Quiz builder */
function ensureQuiz(){ if (!currentLesson.value) return; currentLesson.value.quiz = currentLesson.value.quiz || { questions: [] } }
function addQuestion(kind: 'mcq'|'tf'|'short'){
  ensureQuiz()
  currentLesson.value!.quiz!.questions.push({
    id: uid(),
    text: '',
    type: kind,
    options: kind==='mcq' ? [{ text:'Option 1', correct:false }] : undefined
  })
  activeQPanels.value = [currentLesson.value!.quiz!.questions.at(-1)!.id]
  touch()
}
function removeQuestion(qi:number){ currentLesson.value?.quiz?.questions.splice(qi,1); touch() }
function moveQuestion(qi:number, dir:number){
  const qs = currentLesson.value?.quiz?.questions; if (!qs) return
  const ni = qi + dir; if (ni<0 || ni>=qs.length) return
  const tmp = qs[qi]; qs.splice(qi,1); qs.splice(ni,0,tmp); touch()
}
function addOption(q:QuizQuestion){ q.options = q.options || []; q.options.push({ text:'', correct:false }); touch() }
function removeOption(q:QuizQuestion, oi:number){ q.options?.splice(oi,1); touch() }
function onQTypeChange(q:QuizQuestion){
  if (q.type==='mcq' && !q.options) q.options = [{ text:'Option 1', correct:false }]
  if (q.type!=='mcq') delete q.options
  touch()
}

/** Lifecycle */
onMounted(async () => {
  const pathname = route.path
  function extractCourseIdFromPath(path: string): string | null {
    const courseMatch = path.match(/course\/([^/]+)/)
    const moduleMatch = path.match(/module\/([^/]+)/)
    return courseMatch?.[1] || moduleMatch?.[1] || null
  }
  const pid =
    (route.params.id ||
     route.params.courseId ||
     route.query.courseId ||
     extractCourseIdFromPath(pathname) ||
     '').toString()

  if (pid) await fetchAllContent(pid)
  reflectSideInputs()
})

/** Computed for prereqs */
const prereqOptions = computed(() =>
  flatLessons.value
    .filter(x => currentLesson.value ? x.id !== currentLesson.value.id : true)
    .map(x => ({ label: x.label, value: x.id }))
)
</script>

<style scoped>
.admin-wrap { min-height:100vh; background:#f6f8fb; }
.is-dark { background:#0b1220; }
.admin-header { background:#fff; border-bottom:1px solid #eef2f7; }
.is-dark .admin-header { background:#0f172a; }

.admin-sider { background:#0b1b2b; color:#cbd5e1; }
.sider-pad { padding:12px; background-color: white; }
.cover { height:140px; background-size:cover; background-position:center; position:relative; border-radius:8px; overflow:hidden; }
.cover-gradient { position:absolute; inset:0; background:linear-gradient(180deg,rgba(0,0,0,.0),rgba(0,0,0,.55)); }
.cover-meta { position:absolute; left:12px; right:12px; bottom:10px; color:#fff; }
.cover-title { font-weight:700; font-size:15px; }
.cover-tags { margin-top:6px; display:flex; gap:6px; flex-wrap:wrap; }

.mt-1{margin-top:8px;}
.mt-2{margin-top:12px;}
.mb-2{margin-bottom:12px;}

.admin-content { padding:16px; }
.mod-actions { margin-bottom:8px; }

.tree-lesson { cursor:pointer; border-radius:6px; }
.tree-lesson.active { background:#f0f9ff; }
.is-dark .tree-lesson.active { background:#0b1f37; }

.preview-head { display:flex; gap:8px; align-items:center; margin-bottom:8px; }
.video-wrap { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 8px; }
.video-wrap iframe { position:absolute; top:0; left:0; width:100%; height:100%; }
.video-fallback { background:#f5f5f5; border-radius:8px; padding:8px 12px; word-break:break-all; }
.is-dark .video-fallback { background:#0f172a; }

.option-row { display:flex; gap:8px; align-items:center; margin-bottom:6px; }
.opt-input { flex:1; }
</style>
