<template>
  <a-layout class="course-internal">
    <!-- LEFT: SYLLABUS / PROGRESS -->
    <a-layout-sider
      width="300"
      collapsible
      v-model:collapsed="siderCollapsed"
      class="sider"
    >
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

      <div class="sider-body">
        <a-progress :percent="progressPercent" status="active" :stroke-width="8" />
        <div class="sider-actions">
          <a-button type="primary" block @click="resumeLast" :disabled="totalLessons === 0">
            <template #icon><PlayCircleOutlined/></template>
            Resume ({{ resumeLabel }})
          </a-button>
        </div>

        <a-input-search
          v-model:value="filterText"
          placeholder="Search lessons"
          allow-clear
          class="mt-2"
        />

        <a-tree
          class="mt-2"
          block-node
          :tree-data="filteredTreeData"
          :selectedKeys="[selectedTreeKey]"
          :expandedKeys="expandedKeys"
          @select="onSelectNode"
          @expand="(keys)=>expandedKeys = keys as string[]"
        />
      </div>
    </a-layout-sider>

    <!-- RIGHT: MAIN CONTENT -->
    <a-layout>
      <a-page-header class="header"
        :title="course.title || 'Course'"
        :sub-title="subTitle"
      >
        <template #tags>
          <a-tag v-if="course.category" color="blue">{{ course.category }}</a-tag>
          <a-tag v-if="course.difficulty" color="gold">{{ course.difficulty }}</a-tag>
        </template>
        <template #extra>
          <a-rate :value="rating" disabled />
          <a-button @click="shortcutsOpen = true" shape="circle">
            <template #icon>KeyboardOutlined</template>
          </a-button>
        </template>
      </a-page-header>

      <a-layout-content class="content">
        <a-row :gutter="24">
          <!-- PLAYER & TABS -->
          <a-col :xs="24" :lg="16">
            <a-card :title="currentLesson?.title || 'Select a lesson'" :loading="!currentLesson && totalLessons>0">
              <div v-if="currentLesson">
                <div class="player">
                  <template v-if="currentLesson.videoUrl">
                    <iframe
                      class="player-iframe"
                      :src="embedUrl(currentLesson.videoUrl)"
                      frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowfullscreen
                    />
                  </template>
                  <template v-else>
                    <a-empty description="No video for this lesson">
                      <template #image>
                        <PlayCircleOutlined style="font-size:48px" />
                      </template>
                    </a-empty>
                  </template>
                </div>

                <div class="player-actions">
                  <a-space>
                    <a-button :disabled="!hasPrev" @click="goPrev">
                      <template #icon><ArrowLeftOutlined/></template>
                      Prev
                    </a-button>
                    <a-button :disabled="!hasNext" type="primary" @click="goNext">
                      Next
                      <template #icon><ArrowRightOutlined/></template>
                    </a-button>
                  </a-space>
                  <a-space>
                    <a-switch v-model:checked="currentLesson.completed" @change="onToggleComplete"
                              :checked-children="'Done'" :un-checked-children="'Mark done'"/>
                    <a-button v-if="currentLesson.completed" type="default" size="small" @click="undoComplete">
                      <template #icon><UndoOutlined/></template>
                      Undo
                    </a-button>
                  </a-space>
                </div>
              </div>
              <a-empty v-else description="No lessons yet."> </a-empty>
            </a-card>

            <a-tabs class="mt-3" :items="tabItems" v-model:activeKey="activeTab" />

          </a-col>

          <!-- RIGHT RAIL -->
          <a-col :xs="24" :lg="8">
            <a-card title="About this course" class="mb-3">
              <p class="muted" v-if="!course.description">No description yet.</p>
              <p v-else v-html="safeHtml(course.description)"></p>
              <a-divider />
              <div class="meta-row"><span class="muted">Difficulty</span><span>{{ course.difficulty || '—' }}</span></div>
              <div class="meta-row"><span class="muted">Category</span><span>{{ course.category || '—' }}</span></div>
              <div class="meta-row"><span class="muted">Lessons</span><span>{{ totalLessons }}</span></div>
              <div class="meta-row"><span class="muted">Est. time</span><span>{{ estimatedTime }}</span></div>
              <a-divider />
              <div class="price-row">
                <span class="price" v-if="course.price">$
                  {{ discountedPrice.toFixed(2) }}
                  <del v-if="course.discount"> ${{ course.price.toFixed(2) }}</del>
                </span>
                <a-tag v-if="course.discount" color="red">{{ course.discount }}% off</a-tag>
              </div>
            </a-card>

            <a-card title="Syllabus">
              <a-collapse accordion>
                <a-collapse-panel v-for="(m, mi) in course.modules" :key="'pm-'+mi" :header="m.title || ('Module '+(mi+1))">
                  <a-list
                    size="small"
                    :data-source="m.lessons"
                    :renderItem="(l, li)=>renderMiniLesson(l, mi, li)"
                  />
                </a-collapse-panel>
              </a-collapse>
            </a-card>
          </a-col>
        </a-row>
      </a-layout-content>
    </a-layout>

    <!-- Shortcuts / Outline Drawer -->
    <a-drawer v-model:open="shortcutsOpen" title="Shortcuts & quick nav" placement="right" width="420">
      <p><b>Space</b> — Toggle complete</p>
      <p><b>J / K</b> — Prev / Next lesson</p>
      <p><b>/</b> — Focus lesson search</p>
      <a-divider />
      <a-input-search v-model:value="filterText" placeholder="Search lessons" allow-clear class="mb-2" />
      <a-tree block-node :tree-data="filteredTreeData" :selectedKeys="[selectedTreeKey]" @select="onSelectNode" />
    </a-drawer>
  </a-layout>
</template>

<script setup lang="ts">
import { reactive, ref, computed, h, onMounted, watch } from 'vue'
import {
  PlayCircleOutlined, ArrowLeftOutlined, ArrowRightOutlined, UndoOutlined,
  CheckCircleTwoTone, FileTextOutlined, MessageOutlined,
  PaperClipOutlined, FilePdfOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

/** ----- Types from your data model (extends your Step 2 `modules/lessons`) ----- */
type Lesson = {
  id: string
  title: string
  duration?: number            // minutes
  videoUrl?: string            // YouTube/Vimeo/etc
  content?: string             // HTML/markdown (rendered as HTML here)
  resources?: { id:string; name:string; kind:'pdf'|'file'|'link'; url:string }[]
  completed?: boolean
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
  files: any[]                 // from a-upload (uses thumbUrl/url)
}

/** ----- Source data (re-using your existing shape) ----- */
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

/** If modules are empty (from your create form), seed a friendly demo so the UI renders */
function seedIfEmpty() {
  if (course.modules.length === 0) {
    course.title = course.title || 'Advanced Vue 3 Workshop'
    course.category = course.category || 'Programming'
    course.description = course.description || 'Learn Composition API, reactivity, and Ant Design Vue by building a production-grade dashboard.'
    course.price = course.price || 69
    course.discount = course.discount || 20
    course.modules = [
      {
        title: 'Getting Started',
        lessons: [
          { id:'m0l0', title:'Welcome & Setup', duration:8, videoUrl:'https://www.youtube.com/watch?v=dQw4w9WgXcQ', content:'<p>Install dependencies and overview.</p>', completed:false },
          { id:'m0l1', title:'Project Tour',    duration:12, videoUrl:'', content:'<p>Tour the project structure.</p>' }
        ]
      },
      {
        title: 'Composition API Deep Dive',
        lessons: [
          { id:'m1l0', title:'Refs vs Reactives', duration:18, content:'<p>Understanding reactivity.</p>' },
          { id:'m1l1', title:'Computed & Watch',  duration:15, videoUrl:'https://www.youtube.com/watch?v=9bZkp7q19f0' }
        ]
      }
    ]
  }
}
seedIfEmpty()

/** ----- Sider / Outline ----- */
const siderCollapsed = ref(false)
const filterText = ref('')
const expandedKeys = ref<string[]>([])
const selectedTreeKey = ref<string>('')

const treeData = computed(() =>
  course.modules.map((m, mi) => ({
    key: `m-${mi}`,
    title: m.title || `Module ${mi+1}`,
    selectable: false,
    children: (m.lessons || []).map((l, li) => ({
      key: `l-${mi}-${li}`,
      title: h('span', { class:'lesson-node' }, [
        l.completed ? h(CheckCircleTwoTone, { twoToneColor:'#52c41a', style:'margin-right:6px' }) : null,
        h('span', l.title)
      ]),
      isLeaf: true
    }))
  }))
)

const filteredTreeData = computed(() => {
  const q = filterText.value.trim().toLowerCase()
  if (!q) return treeData.value
  return treeData.value
    .map((m:any) => {
      const kids = (m.children || []).filter((c:any) =>
        (c.title?.children?.[1] || '').toLowerCase().includes(q)
      )
      if (kids.length) return { ...m, children: kids, key: m.key }
      if ((m.title || '').toLowerCase().includes(q)) return { ...m }
      return null
    })
    .filter(Boolean) as any[]
})

function onSelectNode(keys: any) {
  const key = keys?.[0]
  if (!key) return
  selectedTreeKey.value = key
  const mi = Number(String(key).split('-')[1])
  const li = Number(String(key).split('-')[2])
  if (Number.isFinite(mi) && Number.isFinite(li)) {
    setCurrent(mi, li)
  }
}

/** ----- Current lesson / progress ----- */
const currentModuleIndex = ref(0)
const currentLessonIndex = ref(0)

const currentModule = computed<ModuleT|undefined>(() => course.modules[currentModuleIndex.value])
const currentLesson  = computed<Lesson|undefined>(() => currentModule.value?.lessons?.[currentLessonIndex.value])

const totalLessons = computed(() =>
  course.modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0)
)
const completedCount = computed(() =>
  course.modules.reduce((acc, m) => acc + (m.lessons?.filter(l => l.completed)?.length || 0), 0)
)
const progressPercent = computed(() => totalLessons.value ? Math.round((completedCount.value / totalLessons.value)*100) : 0)

const hasPrev = computed(() => flatIndex(currentModuleIndex.value, currentLessonIndex.value) > 0)
const hasNext = computed(() => flatIndex(currentModuleIndex.value, currentLessonIndex.value) < totalLessons.value - 1)

function flatIndex(mi:number, li:number) {
  let idx = 0
  for (let i=0; i<course.modules.length; i++) {
    if (i < mi) idx += course.modules[i].lessons?.length || 0
  }
  return idx + li
}
function setFromFlatIndex(idx:number) {
  let acc = 0
  for (let mi=0; mi<course.modules.length; mi++) {
    const len = course.modules[mi].lessons?.length || 0
    if (idx < acc + len) {
      setCurrent(mi, idx - acc); return
    }
    acc += len
  }
}
function setCurrent(mi:number, li:number) {
  currentModuleIndex.value = mi
  currentLessonIndex.value = li
  selectedTreeKey.value = `l-${mi}-${li}`
  // persist resume pointer
  localStorage.setItem(resumeKey.value, JSON.stringify({ mi, li }))
}
const resumeKey = computed(()=>`byway-course:${course.id || course.title || 'draft'}:resume`)
function resumeLast() {
  const raw = localStorage.getItem(resumeKey.value)
  if (raw) {
    try { const { mi, li } = JSON.parse(raw); setCurrent(mi, li); return } catch{}
  }
  // fallback: first lesson
  if (totalLessons.value>0) setCurrent(0,0)
}
const resumeLabel = computed(() => {
  const raw = localStorage.getItem(resumeKey.value)
  if (!raw) return totalLessons.value ? 'start' : '—'
  try {
    const { mi, li } = JSON.parse(raw)
    const l = course.modules[mi]?.lessons?.[li]
    return l ? l.title : 'start'
  } catch { return 'start' }
})

function onToggleComplete() {
  if (!currentLesson.value) return
  const done = !!currentLesson.value.completed
  message.success(done ? 'Marked as done' : 'Marked as not done')
  persistProgress()
}
function undoComplete() {
  if (!currentLesson.value) return
  currentLesson.value.completed = false
  message.info('Reverted completion'); persistProgress()
}
function goPrev() { if (!hasPrev.value) return; setFromFlatIndex(flatIndex(currentModuleIndex.value, currentLessonIndex.value)-1) }
function goNext() { if (!hasNext.value) return; setFromFlatIndex(flatIndex(currentModuleIndex.value, currentLessonIndex.value)+1) }

const progressKey = computed(()=>`byway-course:${course.id || course.title || 'draft'}:progress`)
function persistProgress() {
  const snapshot = course.modules.map(m => (m.lessons||[]).map(l => !!l.completed))
  localStorage.setItem(progressKey.value, JSON.stringify(snapshot))
}
function restoreProgress() {
  const raw = localStorage.getItem(progressKey.value)
  if (!raw) return
  try {
    const arr:boolean[][] = JSON.parse(raw)
    arr.forEach((row, mi)=> row.forEach((val, li)=>{
      const l = course.modules[mi]?.lessons?.[li]; if (l) l.completed = val
    }))
  } catch {}
}

/** ----- Notes (per-lesson, local) ----- */
type Note = { id:string; lessonId:string; text:string; ts:number }
const notes = ref<Note[]>([])
const noteText = ref('')
const notesKey = computed(()=>`byway-course:${course.id || course.title || 'draft'}:notes`)
function loadNotes() {
  const raw = localStorage.getItem(notesKey.value); if (!raw) return
  try { notes.value = JSON.parse(raw) } catch {}
}
function saveNotes() { localStorage.setItem(notesKey.value, JSON.stringify(notes.value)) }
function addNote() {
  if (!currentLesson.value || !noteText.value.trim()) return
  notes.value.unshift({ id: cryptoId(), lessonId: currentLesson.value.id, text: noteText.value.trim(), ts: Date.now() })
  noteText.value = ''; saveNotes()
}
function delNote(id:string){ notes.value = notes.value.filter(n=>n.id!==id); saveNotes() }
const lessonNotes = computed(()=> notes.value.filter(n => n.lessonId === currentLesson.value?.id))

/** ----- Q&A (local mock) ----- */
type Qa = { id:string; lessonId?:string; q:string; a?:string; ts:number }
const qas = ref<Qa[]>([
  { id:'q1', q:'How do I share a component library across modules?', a:'Use a local package + import via alias in Vite.', ts: Date.now()-86400000 }
])
const qaText = ref('')
function addQuestion() {
  if (!qaText.value.trim()) return
  qas.value.unshift({ id: cryptoId(), lessonId: currentLesson.value?.id, q: qaText.value.trim(), ts: Date.now() })
  qaText.value = ''
}

/** ----- Tabs under player ----- */
const activeTab = ref('overview')
const tabItems = computed(() => {
  const l = currentLesson.value
  return [
    {
      key:'overview',
      label:'Overview',
      children: l
        ? h('div', { class:'tab-pad' }, [
            h('div', { class:'lesson-meta' }, [
              h('span', { class:'muted' }, `Duration: ${l?.duration ?? '—'} min`)
            ]),
            h('div', { innerHTML: safeHtml(l?.content || '<p>No content yet.</p>') })
          ])
        : h('a-empty', { description:'Select a lesson' })
    },
    {
      key:'notes',
      label: h('span', [h(FileTextOutlined), ' Notes']),
      children: l
        ? h('div', { class:'tab-pad' }, [
            h('a-textarea', {
              rows:3, value: noteText.value,
              'onUpdate:value': (v:string)=> noteText.value = v,
              placeholder:'Write a quick note for this lesson…'
            }),
            h('div', { class:'mt-2' }, [
              h('a-button', { type:'primary', onClick: addNote }, { default:()=> 'Add note' })
            ]),
            h('a-list', {
              class:'mt-2', dataSource: lessonNotes.value,
              renderItem: (n:Note) => h('a-list-item', { key:n.id }, {
                actions: [ h('a', { onClick: ()=>delNote(n.id) }, 'Delete') ],
                default: () => [
                  h('a-list-item-meta', { title: new Date(n.ts).toLocaleString(), description: n.text })
                ]
              })
            })
          ])
        : h('a-empty', { description:'Select a lesson' })
    },
    {
      key:'qa',
      label: h('span', [h(MessageOutlined), ' Q&A']),
      children: h('div', { class:'tab-pad' }, [
        h('a-textarea', {
          rows:3, value: qaText.value,
          'onUpdate:value': (v:string)=> qaText.value = v,
          placeholder:'Ask a question…'
        }),
        h('div', { class:'mt-2' }, [
          h('a-button', { type:'primary', onClick: addQuestion }, { default:()=> 'Post question' })
        ]),
        h('a-list', {
          class:'mt-2',
          dataSource: qas.value.filter(q => !currentLesson.value || q.lessonId === currentLesson.value.id || !q.lessonId),
          renderItem: (q:Qa)=> h('a-list-item', { key:q.id }, {
            default: ()=> [
              h('a-list-item-meta', { title: q.q, description: new Date(q.ts).toLocaleString() }),
              q.a ? h('div', { class:'answer' }, [h('b', 'Answer: '), q.a]) : null
            ]
          })
        })
      ])
    },
    {
      key:'resources',
      label: h('span', [h(PaperClipOutlined), ' Resources']),
      children: l
        ? h('a-list', {
            class:'tab-pad',
            dataSource: (l.resources || []).concat(normalizedCourseFiles.value),
            renderItem: (r:any)=> h('a-list-item', { key:r.id }, {
              actions: [ h('a-button', { size:'small', onClick:()=>download(r) }, { default:()=>'Download' }) ],
              default: ()=> [
                h('a-list-item-meta', {
                  avatar: r.kind==='pdf' ? h(FilePdfOutlined) : h(PaperClipOutlined),
                  title: r.name,
                  description: r.url
                })
              ]
            })
          })
        : h('a-empty', { description:'Select a lesson' })
    },
    {
      key:'transcript',
      label:'Transcript',
      children: l
        ? h('div', { class:'tab-pad muted' }, 'Transcript not available for this lesson yet.')
        : h('a-empty', { description:'Select a lesson' })
    }
  ]
})

/** ----- Helpers / UI ----- */
const rating = 4.7
const subTitle = computed(()=> `${completedCount.value}/${totalLessons.value} lessons completed • ${progressPercent.value}%`)
const discountedPrice = computed(()=> course.price * (1 - (course.discount||0)/100))
const estimatedTime = computed(()=>{
  const minutes = course.modules.flatMap(m=>m.lessons||[]).reduce((s,l)=> s + (l.duration||12), 0)
  const h = Math.floor(minutes/60), m = minutes%60
  return h ? `${h}h ${m}m` : `${m}m`
})

const coverUrl = computed(()=>{
  const f = course.files?.[0]
  return f?.url || f?.thumbUrl || ''
})
const coverStyle = computed(()=> ({
  backgroundImage: coverUrl.value ? `url('${coverUrl.value}')` : 'linear-gradient(135deg,#111,#334155)'
}))
const normalizedCourseFiles = computed(()=> (course.files || []).map((f:any,i:number)=>({
  id:`f-${i}`,
  name: f.name || 'Course asset',
  kind: (String(f.name||'').toLowerCase().endsWith('.pdf') ? 'pdf' : 'file') as 'pdf'|'file',
  url: f.url || f.thumbUrl || '#'
})))

function renderMiniLesson(l:Lesson, mi:number, li:number){
  return h('a-list-item', {
    class: ['mini-lesson', l.completed && 'done'].filter(Boolean).join(' '),
    onClick: ()=> setCurrent(mi, li)
  }, {
    default:()=> [
      h('a-list-item-meta', {
        avatar: l.completed ? h(CheckCircleTwoTone, { twoToneColor:'#52c41a' }) : h(PlayCircleOutlined),
        title: l.title,
        description: (l.duration ? `${l.duration} min` : '')
      })
    ]
  })
}
function embedUrl(url:string){
  // naive transform for YouTube links; otherwise return as-is
  if (/youtube\.com|youtu\.be/.test(url)) {
    const id = url.match(/(?:v=|be\/)([A-Za-z0-9_-]{6,})/)?.[1]
    return id ? `https://www.youtube.com/embed/${id}?rel=0` : url
  }
  return url
}
function safeHtml(html:string){ return html } // assume sanitized upstream
function download(r:{name:string;url:string}){ message.success(`Downloading ${r.name}…`) }

/** ----- Lifecycle / persistence ----- */
onMounted(()=>{
  restoreProgress()
  // try select resume or first lesson
  resumeLast()
  // expand all modules initially
  expandedKeys.value = course.modules.map((_,i)=>`m-${i}`)
  loadNotes()
})

// keep notes/progress when lesson completion toggles
watch(()=>course.modules, ()=>{ /* deep watch not set; explicit persist via onToggleComplete */ }, { deep:true })
/** ----- Misc ----- */
function cryptoId(){ return Math.random().toString(36).slice(2,9) }
</script>

<style scoped>
.course-internal { min-height: 100vh; }
.sider { background:#0b1b2b; color:#cbd5e1; }
.cover { height: 160px; background-size: cover; background-position:center; position:relative; }
.cover-gradient { position:absolute; inset:0; background:linear-gradient(180deg,rgba(0,0,0,.0),rgba(0,0,0,.55)); }
.cover-meta { position:absolute; left:16px; right:16px; bottom:12px; color:#fff; }
.cover-title { font-weight:700; font-size:16px; line-height:1.2; }
.cover-tags { margin-top:8px; display:flex; gap:6px; flex-wrap:wrap; }

.sider-body { padding: 12px 12px 16px; }
.sider-actions { margin-top: 8px; }
.mt-2 { margin-top: 12px; }
.mt-3 { margin-top: 16px; }
.mb-2 { margin-bottom: 12px; }
.mb-3 { margin-bottom: 16px; }

.header { background:#fff; padding: 12px 20px; border-bottom:1px solid #eef2f7; }
.content { padding: 20px; background:#f6f8fb; }

.player { width:100%; aspect-ratio:16/9; background:#000; display:flex; align-items:center; justify-content:center; border-radius:8px; overflow:hidden; }
.player-iframe { width:100%; height:100%; border:0; }
.player-actions { margin-top:12px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; }

.muted { color:#94a3b8; }
.meta-row { display:flex; justify-content:space-between; margin:4px 0; }
.price-row { display:flex; align-items:center; gap:10px; }
.price { font-weight:700; font-size:18px; }

.lesson-node { display:flex; align-items:center; gap:6px; }
.mini-lesson.done :deep(.ant-list-item-meta-title){ text-decoration: line-through; color:#94a3b8; }

.tab-pad { padding: 8px 0; }
.answer { background:#f6f8fb; padding:8px 10px; border-radius:6px; }

.sider :deep(.ant-tree){ background:transparent; color:#cbd5e1; }
.sider :deep(.ant-tree-treenode-selected) { background: rgba(255,255,255,0.08) !important; }
</style>
