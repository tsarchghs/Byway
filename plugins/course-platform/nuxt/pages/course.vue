<template>
  <div class="course-page">
    <Header />

    <main class="cp-main">
      <!-- LEFT -->
      <section class="left-col">
        <a-typography-title :level="2" style="margin-bottom: 12px">
          {{ course.title }}
        </a-typography-title>

        <!-- LESSON VIEWER -->
        <a-card
          class="lesson-viewer"
          :title="currentLesson ? `${currentLesson.num} ${currentLesson.title}` : 'Select a lesson to begin'"
        >
          <template #extra>
            <a-space>
              <a-button v-if="currentLesson?.videoId" type="text" @click="playPreview" :icon="h(PlayCircleOutlined)">
                Preview
              </a-button>
              <a-button type="text" @click="openNotes = true" :icon="h(EditOutlined)">Notes</a-button>
            </a-space>
          </template>

          <div v-if="currentLesson?.videoId" class="video-wrapper">
            <iframe
              :src="`https://www.youtube.com/embed/${currentLesson.videoId}?rel=0&showinfo=0`"
              frameborder="0"
              allowfullscreen
              title="Lesson video"
            ></iframe>
          </div>
          <a-empty v-else description="Pick a lesson from the right to start" />

          <a-typography-paragraph v-html="currentLesson?.content || '<p>No content available for this lesson.</p>'" />
        </a-card>

        <!-- TABS: details / instructor / reviews -->
        <a-tabs v-model:activeKey="activeTab" style="margin-top: 16px">
          <a-tab-pane key="details" tab="Details">
            <a-typography-title :level="4">Course Overview</a-typography-title>
            <a-typography-paragraph>{{ course.description }}</a-typography-paragraph>

            <a-typography-title :level="5">Key Learning Objectives</a-typography-title>
            <a-list
              size="small"
              :data-source="course.objectives"
              :renderItem="(o) => h('div', { class: 'objective-item' }, [h('span', o)])"
            />
          </a-tab-pane>

          <a-tab-pane key="instructor" tab="Instructor">
            <a-card bordered>
              <a-space align="start">
                <a-avatar :size="64" :src="course.instructor.avatar" />
                <div>
                  <a-typography-text strong>{{ course.instructor.name }}</a-typography-text>
                  <div class="muted">{{ course.instructor.role }}</div>
                  <a-space size="small" class="muted" style="margin-top: 6px">
                    <span>{{ course.instructor.reviews }} Reviews</span>
                    <span>•</span>
                    <span>{{ course.instructor.students }} Students</span>
                  </a-space>
                </div>
              </a-space>
            </a-card>
          </a-tab-pane>

          <a-tab-pane key="reviews" tab="Reviews">
            <a-empty description="Reviews coming soon" />
          </a-tab-pane>
        </a-tabs>
      </section>

      <!-- RIGHT -->
      <aside class="right-col" aria-label="Course completion">
        <a-affix :offset-top="24">
          <a-card title="Course Completion" :bordered="true">
            <a-space align="center" :size="16">
              <a-progress type="circle" :percent="completionPct" :width="82" />
              <div>
                <div class="count">{{ completedCount }} / {{ totalCount }} completed</div>
                <a-popconfirm
                  title="Mark all lessons as done?"
                  ok-text="Yes"
                  cancel-text="No"
                  @confirm="markAllDone"
                >
                  <a-button type="link">Mark all done</a-button>
                </a-popconfirm>
              </div>
            </a-space>

            <a-divider />

            <!-- Sections / Lessons -->
            <a-collapse
              v-model:activeKey="openPanels"
              expand-icon-position="end"
              :accordion="false"
              style="background: transparent"
            >
              <a-collapse-panel
                v-for="([sk, sec]) in sectionsEntries"
                :key="sk"
                :header="`${sec.title} (${sec.lessons.length})`"
              >
                <div class="lessons">
                  <div
                    v-for="(l, idx) in sec.lessons"
                    :key="l.id"
                    class="lesson-row"
                    :class="{ active: l.active }"
                    @click="setActive(sk, idx)"
                  >
                    <a-checkbox v-model:checked="l.done" @click.stop />
                    <span class="num">{{ l.num }}</span>
                    <span class="title">{{ l.title }}</span>

                    <a-space style="margin-left: auto">
                      <VideoCameraOutlined />
                      <span class="dur">{{ l.duration }}</span>
                    </a-space>
                  </div>
                </div>
              </a-collapse-panel>
            </a-collapse>
          </a-card>
        </a-affix>
      </aside>
    </main>

    <!-- Quick actions -->
    <a-float-button-group shape="square" :style="{ right: '24px' }">
      <a-float-button :tooltip="'Continue next lesson'" @click="goToNextIncomplete" :icon="h(PlayCircleOutlined)" />
      <a-float-button :tooltip="'Notes'" @click="openNotes = true" :icon="h(EditOutlined)" />
      <a-float-button :tooltip="'Share'" :icon="h(ShareAltOutlined)" />
    </a-float-button-group>

    <!-- Notes drawer -->
    <a-drawer v-model:open="openNotes" title="My notes for this lesson" width="420">
      <a-typography-text v-if="!currentLesson" type="secondary">Open a lesson to attach notes.</a-typography-text>
      <a-textarea
        v-else
        v-model:value="notes[currentLesson.id]"
        :rows="10"
        placeholder="Write your notes here…"
      />
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { h, ref, reactive, computed, watch } from 'vue'
import Header from '../../../../packages/shared-ui/src/components/Header.vue'

// Icons
import {
  PlayCircleOutlined,
  EditOutlined,
  ShareAltOutlined,
  VideoCameraOutlined
} from '@ant-design/icons-vue'

// ----- Types -----
type Lesson = {
  id: string
  num: string
  title: string
  duration: string
  done?: boolean
  active?: boolean
  videoId?: string
  content?: string
}
type Section = { title: string; open: boolean; lessons: Lesson[] }

// ----- Mock Data -----
const course = reactive({
  title: 'Introduction to User Experience Design',
  description:
    'Embark on a transformative journey into UX Design with a hands-on, project-first path.',
  instructor: {
    name: 'Ronald Richards',
    role: 'UI/UX Designer',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=320&auto=format&fit=crop',
    reviews: '40,445',
    students: '500'
  },
  objectives: [
    'Understand the role and impact of UX Design',
    'Explore user-centered design principles',
    'Practice IA, interaction, and visual design basics'
  ]
})

const sectionsState = reactive<Record<string, Section>>({
  top: {
    title: 'Introduction to UX Design',
    open: true,
    lessons: [
      {
        id: 't1',
        num: '1.',
        title: 'What is UX Design?',
        duration: '4min',
        done: true,
        videoId: 'ysz5S6PUM-U',
        content: '<p>An introduction to UX design: what it is and why it matters.</p>'
      },
      {
        id: 't2',
        num: '2.',
        title: 'Historical Overview of UX',
        duration: '4min',
        done: true,
        videoId: 'M7lc1UVf-VE',
        content: '<p>A short history of how UX evolved over time.</p>'
      },
      {
        id: 't3',
        num: '3.',
        title: 'Understanding User-Centered Design',
        duration: '4min',
        active: true,
        videoId: 'J---aiyznGQ',
        content: '<p>User-centered design places the user at the heart of the process.</p>'
      }
    ]
  },
  mid: {
    title: 'Basics of User-Centered Design',
    open: false,
    lessons: [
      {
        id: 'm1',
        num: '1.',
        title: 'User Research',
        duration: '12min',
        videoId: 'dQw4w9WgXcQ',
        content: '<p>Methods for conducting effective user research.</p>'
      },
      {
        id: 'm2',
        num: '2.',
        title: 'Personas & Journeys',
        duration: '18min',
        videoId: 'oHg5SJYRHA0',
        content: '<p>How to craft personas and customer journeys.</p>'
      }
    ]
  },
  mid2: {
    title: 'Elements of User Experience',
    open: false,
    lessons: [
      {
        id: 'e1',
        num: '1.',
        title: 'Information Architecture',
        duration: '9min',
        videoId: 'ysz5S6PUM-U',
        content: '<p>Organizing content to help users find their way.</p>'
      },
      {
        id: 'e2',
        num: '2.',
        title: 'Interaction Design Basics',
        duration: '14min',
        videoId: 'M7lc1UVf-VE',
        content: '<p>Core interaction patterns and principles.</p>'
      }
    ]
  }
})

// ----- Derived -----
const sectionsEntries = computed(() => Object.entries(sectionsState))
const allLessons = computed(() => Object.values(sectionsState).flatMap(s => s.lessons))
const completedCount = computed(() => allLessons.value.filter(l => l.done).length)
const totalCount = computed(() => allLessons.value.length)
const completionPct = computed(() => (totalCount.value ? Math.round((completedCount.value / totalCount.value) * 100) : 0))
const currentLesson = computed<Lesson | null>(() => allLessons.value.find(l => l.active) || null)

// Tabs
const activeTab = ref<'details' | 'instructor' | 'reviews'>('details')

// Collapse control (sync with section.open)
const openPanels = ref<string[]>(
  sectionsEntries.value.filter(([_, s]) => s.open).map(([k]) => k)
)
watch(
  openPanels,
  keys => {
    // reflect collapse into section.open
    for (const [k, sec] of sectionsEntries.value) sec.open = keys.includes(k)
  },
  { deep: true }
)

// Notes per lesson
const openNotes = ref(false)
const notes = reactive<Record<string, string>>({})

// ----- Actions -----
function setActive(sectionKey: string, idx: number) {
  allLessons.value.forEach(l => (l.active = false))
  const sec = sectionsState[sectionKey]
  if (!sec) return
  sec.open = true
  if (!openPanels.value.includes(sectionKey)) openPanels.value.push(sectionKey)
  const l = sec.lessons[idx]
  if (l) l.active = true
}

function markAllDone() {
  for (const sec of Object.values(sectionsState)) {
    for (const l of sec.lessons) l.done = true
  }
}

function playPreview() {
  const withVideo = allLessons.value.find(l => l.videoId)
  if (withVideo) {
    for (const [sk, sec] of Object.entries(sectionsState)) {
      const idx = sec.lessons.findIndex(x => x.id === withVideo.id)
      if (idx >= 0) return setActive(sk, idx)
    }
  }
  // fallback
  const firstSection = Object.entries(sectionsState)[0]
  if (firstSection && firstSection[1].lessons.length) setActive(firstSection[0], 0)
}

function goToNextIncomplete() {
  const next = allLessons.value.find(l => !l.done)
  if (!next) return
  for (const [sk, sec] of Object.entries(sectionsState)) {
    const idx = sec.lessons.findIndex(x => x.id === next.id)
    if (idx >= 0) return setActive(sk, idx)
  }
}
</script>

<style scoped>
.course-page {
  min-height: 100vh;
  background: #fff;
}

.cp-main {
  display: flex;
  gap: 24px;
  max-width: 1280px;
  margin: 24px auto;
  padding: 0 20px;
}
.left-col {
  flex: 1 1 720px;
  min-width: 0;
}
.right-col {
  width: 380px;
  min-width: 320px;
}

/* viewer */
.lesson-viewer {
  margin-bottom: 16px;
}
.video-wrapper {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%;
  border-radius: 8px;
  overflow: hidden;
  background: #000;
  margin-bottom: 12px;
}
.video-wrapper iframe {
  position: absolute; inset: 0;
  width: 100%; height: 100%; border: 0;
}

/* lessons list */
.lessons { display: grid; gap: 8px; }
.lesson-row {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px; border-radius: 8px; cursor: pointer;
  transition: background .2s ease;
}
.lesson-row:hover { background: #f5f9ff; }
.lesson-row.active { background: #1677ff; color: #fff; }
.lesson-row.active .dur { color: rgba(255,255,255,.9); }
.num { font-weight: 600; width: 20px; }
.title { flex: 1 1 auto; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dur { font-size: 12px; color: rgba(0,0,0,.45); }

.muted { color: rgba(0,0,0,.45); }

/* responsive */
@media (max-width: 1024px) {
  .cp-main { flex-direction: column; }
  .right-col { width: 100%; }
}
</style>
