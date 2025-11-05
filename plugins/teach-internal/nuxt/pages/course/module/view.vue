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
                  <a-menu-item @click="saveToLS"><SaveOutlined /> Save</a-menu-item>
                  <a-menu-item @click="loadFromLS"><CloudDownloadOutlined /> Load</a-menu-item>
                  <a-menu-item @click="exportJSON"><ExportOutlined /> Export JSON</a-menu-item>
                  <a-menu-item @click="importJSONOpen = true"><ImportOutlined /> Import JSON</a-menu-item>
                  <a-menu-item danger @click="resetAll"><DeleteOutlined /> Reset LS (danger)</a-menu-item>
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

                  <a-card title="Utilities" class="mt-2">
                    <a-space direction="vertical" style="width:100%">
                      <a-button block @click="saveToLS"><SaveOutlined/> Save to localStorage</a-button>
                      <a-button block @click="loadFromLS"><CloudDownloadOutlined/> Load from localStorage</a-button>
                      <a-button block @click="exportJSON"><ExportOutlined/> Export JSON</a-button>
                      <a-button block @click="importJSONOpen = true"><ImportOutlined/> Import JSON</a-button>
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

                                <!-- MCQ options -->
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
                    <a-list
                      :data-source="currentLesson.quiz?.questions || []"
                      :renderItem="q => q"
                    >
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

      <!-- IMPORT JSON MODAL -->
      <a-modal v-model:open="importJSONOpen" title="Import course JSON" @ok="confirmImport" @cancel="cancelImport">
        <a-textarea v-model:value="importText" :rows="10" placeholder='Paste course JSON here…'/>
      </a-modal>
    </a-layout>
  </a-config-provider>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted, watch } from 'vue'
import { theme, message } from 'ant-design-vue'
import {
  BulbOutlined, SaveOutlined, CloudDownloadOutlined, ExportOutlined, ImportOutlined,
  PlusOutlined, DeleteOutlined, EditOutlined, DownOutlined, FieldTimeOutlined
} from '@ant-design/icons-vue'

/** ——— Shared types (align with learner component) ——— */
type QuizOption = { text: string; correct: boolean }
type QuizQuestion = { id: string; text: string; type: 'mcq'|'tf'|'short'; options?: QuizOption[] }
type Resource = { id?: string; name?: string; title?: string; kind?: 'pdf'|'file'|'link'; url: string }
type Lesson = {
  id: string
  title: string
  type: 'video'|'reading'|'quiz'|'assignment'
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
type ModuleT = { title: string; lessons: Lesson[] }
type CourseT = {
  id?: string | number
  title: string
  category: string
  difficulty: 'Beginner'|'Intermediate'|'Advanced'|string
  description: string
  price: number
  discount: number
  modules: ModuleT[]
  files: Array<{ name?: string; url?: string; thumbUrl?: string }>
}

/** ——— LocalStorage keys ——— */
const COURSE_DATA_KEY = computed(()=>`byway-course:${course.id || course.title || 'draft'}:data`)

/** ——— Helper for learner usage (paste in your learner onMounted): 
    const raw = localStorage.getItem(COURSE_DATA_KEY.value); if (raw) Object.assign(course, JSON.parse(raw));
    (You already have the same CourseT shape.) 
*/

/** ——— Seed (same spirit as learner) ——— */
const course = reactive<CourseT>({
  title: 'Advanced Vue 3 Workshop',
  category: 'Programming',
  difficulty: 'Intermediate',
  description: 'Learn Composition API, reactivity, and Ant Design Vue by building a production-grade dashboard.',
  price: 69,
  discount: 20,
  modules: [
    {
      title: 'Getting Started',
      lessons: [
        { id:'m0l0', title:'Welcome & Setup', type:'video', duration:8, videoUrl:'https://www.youtube.com/watch?v=dQw4w9WgXcQ', content:'What you’ll learn and how to setup.', preview:true },
        { id:'m0l1', title:'Project Tour', type:'reading', duration:12, content:'Tour the project structure.', preview:true },
      ]
    },
    {
      title: 'Composition API Deep Dive',
      lessons: [
        { id:'m1l0', title:'Refs vs Reactives', type:'reading', duration:18, content:'Understanding reactivity.' },
        { id:'m1l1', title:'Computed & Watch', type:'video', duration:15, videoUrl:'https://www.youtube.com/watch?v=9bZkp7q19f0' },
        { id:'m1l2', title:'Checkpoint', type:'quiz', duration:7, quiz:{questions:[
          { id:'q1', text:'Pick the correct option', type:'mcq', options:[{text:'A',correct:true},{text:'B',correct:false}]},
          { id:'q2', text:'Vue uses Virtual DOM (T/F)', type:'tf' },
          { id:'q3', text:'One word: reactive primitive in Vue?', type:'short' }
        ]}},
        { id:'m1l3', title:'Mini Assignment', type:'assignment', duration:20, content:'Build a tiny feature.', rubric:'Completeness / Correctness / Clarity', prerequisites:['m1l2'] },
      ]
    }
  ],
  files: []
})

/** ——— Theme ——— */
const DARK_KEY = 'byway:theme:dark'
const isDark = ref(false)
function toggleDark(){ isDark.value = !isDark.value; localStorage.setItem(DARK_KEY, JSON.stringify(isDark.value)) }

/** ——— UI State ——— */
const tab = ref<'course'|'lesson'|'preview'>('course')
const siderCollapsed = ref(false)
const activePanels = ref<string[]>([])
const activeQPanels = ref<string[]>([])
const filter = ref('')

/** ——— Outline selection ——— */
const currentModuleIndex = ref(0)
const currentLessonIndex = ref(0)
const currentModule = computed<ModuleT|undefined>(() => course.modules[currentModuleIndex.value])
const currentLesson  = computed<Lesson|undefined>(() => currentModule.value?.lessons?.[currentLessonIndex.value])
const selectedKey = computed(()=>`l-${currentModuleIndex.value}-${currentLessonIndex.value}`)

/** ——— Options ——— */
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

/** ——— Derived ——— */
const totalMinutes = computed(()=> course.modules.flatMap(m=>m.lessons||[]).reduce((s,l)=> s+(l.duration||0), 0))
const coverUrl = computed(()=> (course.files?.[0]?.url || course.files?.[0]?.thumbUrl || ''))
const coverStyle = computed(()=> ({ backgroundImage: coverUrl.value ? `url('${coverUrl.value}')` : 'linear-gradient(135deg,#111,#334155)' }))
const flatLessons = computed(()=> {
  const arr:{ id:string; label:string }[] = []
  course.modules.forEach((m, mi)=> m.lessons.forEach((l, li)=> arr.push({ id: l.id, label: `${m.title || `Module ${mi+1}`}: ${l.title || 'Untitled'}`})))
  return arr
})
const prereqOptions = computed(()=> (flatLessons.value
  .filter(x => currentLesson.value ? x.id !== currentLesson.value.id : true)
  .map(x => ({ label: x.label, value: x.id })) ))
const payablePreview = computed(()=> {
  const baseDiscounted = course.price * (1 - (course.discount||0)/100)
  return fmt(Math.round(baseDiscounted*100)/100)
})

/** ——— Simple filters ——— */
function matchFilter(l:Lesson){
  const q = filter.value.trim().toLowerCase()
  if (!q) return true
  return (l.title||'').toLowerCase().includes(q) || (l.type||'').toLowerCase().includes(q)
}

/** ——— Outline ops ——— */
function select(mi:number, li:number){ currentModuleIndex.value = mi; currentLessonIndex.value = li; tab.value='lesson' }
function addModule(){
  course.modules.push({ title:`New module ${course.modules.length+1}`, lessons:[] })
  activePanels.value = [`m-${course.modules.length-1}`]
  touch()
}
function renameModule(mi:number){
  const now = prompt('Module title', course.modules[mi].title || '')
  if (now !== null){ course.modules[mi].title = now.trim(); touch() }
}
function removeModule(mi:number){
  // cleanup prerequisites pointing to lessons in this module
  const removedIds = new Set<string>(course.modules[mi].lessons.map(l=>l.id))
  for (const m of course.modules){
    for (const l of m.lessons){
      if (l.prerequisites) l.prerequisites = l.prerequisites.filter(id=>!removedIds.has(id))
    }
  }
  course.modules.splice(mi,1)
  currentModuleIndex.value = Math.max(0, Math.min(currentModuleIndex.value, course.modules.length-1))
  currentLessonIndex.value = 0
  touch()
}
function moveModule(mi:number, dir:number){
  const ni = mi + dir
  if (ni<0 || ni>=course.modules.length) return
  const tmp = course.modules[mi]
  course.modules.splice(mi,1)
  course.modules.splice(ni,0,tmp)
  if (currentModuleIndex.value===mi) currentModuleIndex.value = ni
  touch()
}
function addLesson(mi:number){
  const l:Lesson = { id: uid(), title:'New lesson', type:'reading', duration:5, content:'' }
  course.modules[mi].lessons.push(l)
  select(mi, course.modules[mi].lessons.length-1)
  touch()
}
function addLessonToCurrent(){ if (currentModule.value) addLesson(currentModuleIndex.value) }
function removeLesson(mi:number, li:number){
  const removed = course.modules[mi].lessons[li]
  // cleanup prerequisites across course
  for (const m of course.modules){
    for (const l of m.lessons){
      if (l.prerequisites) l.prerequisites = l.prerequisites.filter(id => id !== removed.id)
    }
  }
  course.modules[mi].lessons.splice(li,1)
  currentLessonIndex.value = Math.max(0, Math.min(currentLessonIndex.value, (course.modules[mi].lessons.length-1)))
  touch()
}
function moveLesson(mi:number, li:number, dir:number){
  const ni = li + dir
  const arr = course.modules[mi].lessons
  if (ni<0 || ni>=arr.length) return
  const tmp = arr[li]; arr.splice(li,1); arr.splice(ni,0,tmp)
  if (currentModuleIndex.value===mi && currentLessonIndex.value===li) currentLessonIndex.value = ni
  touch()
}
function expandAll(){ activePanels.value = course.modules.map((_,i)=>`m-${i}`) }
function collapseAll(){ activePanels.value = [] }

/** ——— Lesson meta helpers ——— */
const tagsInput = ref('')
const unlockInput = ref('')
function applyTags(){ if (currentLesson.value){ currentLesson.value.tags = splitTags(tagsInput.value); touch() } }
function applyUnlock(){
  if (!currentLesson.value) return
  const v = unlockInput.value.trim()
  currentLesson.value.unlockAt = v || undefined
  touch()
}

/** ——— Resource / attachment temp inputs ——— */
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

/** ——— Course assets editor ——— */
const coverInput = ref('')
const fileName = ref(''); const fileUrl = ref('')
function setCover(){
  const u = coverInput.value.trim()
  if (!u) return
  if (!course.files.length) course.files.push({ name:'cover', url: u })
  else course.files[0] = { ...(course.files[0]||{}), name: course.files[0]?.name || 'cover', url: u }
  touch()
}
function clearCover(){ if (course.files.length){ course.files.splice(0,1) } touch() }
function addCourseFile(){
  if (!fileUrl.value.trim()) return message.error('File URL required')
  course.files.push({ name: fileName.value || 'Asset', url: fileUrl.value.trim() })
  fileName.value=''; fileUrl.value=''
  touch()
}
function removeCourseFile(i:number){ course.files.splice(i,1); touch() }

/** ——— Quiz builder helpers ——— */
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

/** ——— Persistence ——— */
const autoSave = ref(true)
let saveTimer:number|undefined
function touch(){
  // keep tag/unlock inputs reflected
  if (currentLesson.value){
    tagsInput.value = (currentLesson.value.tags || []).join(', ')
    unlockInput.value = currentLesson.value.unlockAt ? String(currentLesson.value.unlockAt) : ''
  }
  if (!autoSave.value) return
  if (saveTimer) window.clearTimeout(saveTimer as any)
  saveTimer = window.setTimeout(saveToLS, 400) as any
}
function saveToLS(){
  try {
    localStorage.setItem(COURSE_DATA_KEY.value, JSON.stringify(toPlain(course)))
    message.success('Saved')
  } catch (e:any) { message.error('Save failed: '+(e?.message||e)) }
}
function loadFromLS(){
  const raw = localStorage.getItem(COURSE_DATA_KEY.value)
  if (!raw) { message.info('No saved course found'); return }
  try {
    const parsed = JSON.parse(raw)
    replaceCourse(parsed)
    message.success('Loaded')
  } catch (e:any){ message.error('Load failed: '+(e?.message||e)) }
}
function exportJSON(){
  const blob = new Blob([JSON.stringify(toPlain(course), null, 2)], { type:'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = `${(course.title||'course').replace(/\s+/g,'_')}.json`; a.click()
  URL.revokeObjectURL(url)
}
const importJSONOpen = ref(false)
const importText = ref('')
function confirmImport(){
  try {
    const parsed = JSON.parse(importText.value || '{}')
    replaceCourse(parsed)
    importJSONOpen.value = false; importText.value=''
    message.success('Imported')
    saveToLS()
  } catch (e:any){ message.error('Invalid JSON: '+(e?.message||e)) }
}
function cancelImport(){ importJSONOpen.value=false; importText.value='' }
function resetAll(){
  localStorage.removeItem(COURSE_DATA_KEY.value)
  message.success('LocalStorage course data cleared')
}

/** ——— Misc ——— */
function splitTags(s:string){ return s.split(',').map(x=>x.trim()).filter(Boolean) }
function ytEmbed(url?:string){
  if (!url) return ''
  if (/youtube\.com|youtu\.be/.test(url)) {
    const id = url.match(/(?:v=|be\/)([A-Za-z0-9_-]{6,})/)?.[1]
    return id ? `https://www.youtube.com/embed/${id}?rel=0` : ''
  }
  return ''
}
function fmt(n:number){ return n.toLocaleString(undefined, { style:'currency', currency:'EUR' }) }
function uid(){ return Math.random().toString(36).slice(2,9) }
function toPlain<T>(x:T):T{ return JSON.parse(JSON.stringify(x)) }

/** Replace the reactive course safely (preserve reference used by template) */
function replaceCourse(next:CourseT){
  // Normalize minimal fields
  next.modules ||= []
  next.files ||= []
  Object.keys(course).forEach(k => delete (course as any)[k])
  Object.assign(course, next)
  // keep selection valid
  currentModuleIndex.value = Math.min(currentModuleIndex.value, Math.max(course.modules.length-1, 0))
  currentLessonIndex.value = Math.min(currentLessonIndex.value, Math.max(course.modules[currentModuleIndex.value]?.lessons.length-1 || 0, 0))
  touch()
}

/** ——— Lifecycle ——— */
onMounted(()=>{
  try { isDark.value = JSON.parse(localStorage.getItem(DARK_KEY) || 'false') } catch {}
  // try load existing
  const raw = localStorage.getItem(COURSE_DATA_KEY.value)
  if (raw){ try { replaceCourse(JSON.parse(raw)) } catch {} }
  // reflect current lesson meta in side inputs
  if (currentLesson.value){
    tagsInput.value = (currentLesson.value.tags || []).join(', ')
    unlockInput.value = currentLesson.value.unlockAt ? String(currentLesson.value.unlockAt) : ''
  }
})
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
