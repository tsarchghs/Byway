<template>
  <div class="course-page">
    <Header/>

    <main class="cp-main">
      <section class="left-col">
        <h1 class="title">{{ course.title }}</h1>


        <!-- Lesson viewer: shows the active lesson's video and content -->
        <section class="lesson-viewer" v-if="currentLesson">
          <h3 class="lesson-viewer-title">{{ currentLesson.num }} {{ currentLesson.title }}</h3>
          <div class="video-wrapper" v-if="currentLesson.videoId">
            <iframe
              :src="`https://www.youtube.com/embed/${currentLesson.videoId}?rel=0&showinfo=0`"
              frameborder="0"
              allowfullscreen
              title="Lesson video"
            ></iframe>
          </div>
          <div class="lesson-content" v-html="currentLesson.content || '<p>No content available for this lesson.</p>'"></div>
        </section>

        <!-- <nav class="tabs" role="tablist">
          <button class="tab" :class="{ active: activeTab==='details' }" @click="activeTab='details'">Details</button>
          <button class="tab" :class="{ active: activeTab==='instructor' }" @click="activeTab='instructor'">Instructor</button>
          <button class="tab" :class="{ active: activeTab==='courses' }" @click="activeTab='courses'">Courses</button>
          <button class="tab" :class="{ active: activeTab==='reviews' }" @click="activeTab='reviews'">Reviews</button>
        </nav> -->
<br/>
<br/>
<br/> 
        <section class="overview">
          <h4>Course Overview</h4>
          <p>{{ course.description }}</p>

          <h4>Key Learning Objectives</h4>
          <ul>
            <li v-for="(o,i) in course.objectives" :key="i">{{ o }}</li>
          </ul>
        </section>

        <section class="instructor">
          <h4>Instructor</h4>
          <div class="instructor-row">
            <div class="avatar" :style="{ backgroundImage: `url(${course.instructor.avatar})` }" />
            <div>
              <div class="name">{{ course.instructor.name }}</div>
              <div class="role">{{ course.instructor.role }}</div>
              <div class="meta">
                <span>{{ course.instructor.reviews }} Reviews</span>
                <span>•</span>
                <span>{{ course.instructor.students }} Students</span>
              </div>
            </div>
          </div>
        </section>

        <!-- more content omitted for brevity in template - kept realistic for mock data -->
      </section>

      <aside class="right-col" aria-label="Course completion">
        <h3 class="card-title">Course Completion</h3>

        <div class="progress-wrap" role="region" aria-label="Course progress">
          <div class="progress-circle" :title="`${completionPct}% Complete`">{{ completionPct }}%</div>
          <div class="progress-meta">
            <div class="count">{{ completedCount }} / {{ totalCount }} completed</div>
            <button class="mark-all" @click="markAllDone">Mark all done</button>
          </div>
        </div>

        <div class="sections">
          <template v-for="(sec, sk) in sectionsState" :key="sk">
            <div class="section-block">
              <button class="section-header" @click="toggleSection(sk)" :aria-expanded="sec.open">
                <svg class="chev" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path :d="sec.open ? 'M7 14l5-5 5 5' : 'M6 9l6 6 6-6'" stroke="#0F172A" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
                <span class="section-title">{{ sec.title }}</span>
                <span class="sec-count">{{ sec.lessons.length }} lessons</span>
              </button>

              <div class="lessons" v-show="sec.open">
                <div v-for="(l, idx) in sec.lessons" :key="l.id" :class="['lesson-row', { active: l.active }]" tabindex="0" @click="setActive(sk, idx)" @keydown.enter.prevent="setActive(sk, idx)" @keydown.space.prevent="toggleDoneByIndex(sk, idx)">
                  <div class="lesson-left">
                    <div class="checkbox" :class="{ checked: l.done, activeBox: l.active }" role="checkbox" :aria-checked="l.done" tabindex="0" @click.stop="toggleDoneByIndex(sk, idx)" @keydown.space.prevent="toggleDoneByIndex(sk, idx)">
                      <svg v-if="l.done" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12l4 4L19 6" stroke="#FFFFFF" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </div>
                    <div class="num">{{ l.num }}</div>
                    <div class="title">{{ l.title }}</div>
                  </div>
                  <div class="lesson-right">
                    <svg class="rec" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3" y="5" width="18" height="14" rx="2" ry="2" stroke="currentColor" stroke-width="2" fill="none"/><polygon points="11,9 16,12 11,15" fill="currentColor"/></svg>
                    <div class="dur">{{ l.duration }}</div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </aside>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import Header from '../../../../packages/shared-ui/src/components/Header.vue';

// Mock course data shaped to match the Figma/CSS
type Lesson = { id: string; num: string; title: string; duration: string; done?: boolean; active?: boolean; videoId?: string; content?: string }
type Section = { title: string; open: boolean; lessons: Lesson[] }

const course = reactive({
  title: 'Introduction to User Experience Design',
  hero: 'https://images.unsplash.com/photo-1519337265831-281ec6cc8514?q=80&w=1600&auto=format&fit=crop',
  description: `Embark on a transformative journey into the dynamic world of User Experience (UX) Design with our comprehensive course.`,
  objectives: [
    'Gain a clear understanding of what UX Design entails and its importance.',
    'Explore user-centered design principles.',
    'Learn elements of information architecture, interaction, and visual design.'
  ],
  instructor: { name: 'Ronald Richards', role: 'UI/UX Designer', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=320&auto=format&fit=crop', reviews: '40,445', students: '500' }
})

// Sections + lessons (several lesson types implied by the css)
const sectionsState = reactive<Record<string, Section>>({
  top: {
    title: 'Introduction to UX Design',
    open: true,
    lessons: [
      { id: 't1', num: '1.', title: 'What is UX Design?', duration: '4min', done: true, videoId: 'ysz5S6PUM-U', content: '<p>An introduction to UX design: what it is and why it matters.</p>' },
      { id: 't2', num: '2.', title: 'Historical Overview of UX', duration: '4min', done: true, videoId: 'M7lc1UVf-VE', content: '<p>A short history of how UX evolved over time.</p>' },
      { id: 't3', num: '3.', title: 'Understanding User-Centered Design', duration: '4min', active: true, videoId: 'J---aiyznGQ', content: '<p>User-centered design places the user at the heart of the process.</p>' }
    ]
  },
  mid: {
    title: 'Basics of User-Centered Design',
    open: false,
    lessons: [
      { id: 'm1', num: '1.', title: 'User Research', duration: '12min', videoId: 'dQw4w9WgXcQ', content: '<p>Methods for conducting effective user research.</p>' },
      { id: 'm2', num: '2.', title: 'Personas & Journeys', duration: '18min', videoId: 'oHg5SJYRHA0', content: '<p>How to craft personas and customer journeys.</p>' }
    ]
  },
  mid2: {
    title: 'Elements of User Experience',
    open: false,
    lessons: [
      { id: 'e1', num: '1.', title: 'Information Architecture', duration: '9min', videoId: 'ysz5S6PUM-U', content: '<p>Organizing content to help users find their way.</p>' },
      { id: 'e2', num: '2.', title: 'Interaction Design Basics', duration: '14min', videoId: 'M7lc1UVf-VE', content: '<p>Core interaction patterns and principles.</p>' }
    ]
  }
})

const activeTab = ref<'details'|'instructor'|'courses'|'reviews'>('details')

const completedCount = computed(() => {
  return Object.values(sectionsState).flatMap(s => s.lessons).filter(l => l.done).length
})
const totalCount = computed(() => Object.values(sectionsState).flatMap(s => s.lessons).length)
const completionPct = computed(() => totalCount.value ? Math.round((completedCount.value/totalCount.value)*100) : 0)

// compute the currently active lesson (first active flag) or null
const currentLesson = computed<Lesson | null>(() => {
  const all = Object.values(sectionsState).flatMap(s => s.lessons)
  return all.find(l => l.active) || null
})

function toggleSection(key: string) { sectionsState[key].open = !sectionsState[key].open }
function toggleDoneByIndex(sectionKey: string, idx: number) { const l = sectionsState[sectionKey].lessons[idx]; if (l) l.done = !l.done }
function setActive(sectionKey: string, idx: number) {
  // clear all active
  Object.values(sectionsState).forEach(s => s.lessons.forEach(x => (x.active = false)))
  const sec = sectionsState[sectionKey]
  if (sec) sec.open = true // expand when selecting
  const l = sectionsState[sectionKey].lessons[idx]
  if (l) l.active = true
}
function markAllDone() { Object.values(sectionsState).forEach(s => s.lessons.forEach(l => (l.done = true))) }
function playPreview() {
  // set first lesson with a video as active (or first lesson)
  const all = Object.values(sectionsState).flatMap(s => s.lessons)
  const withVideo = all.find(l => l.videoId)
  if (withVideo) {
    // find its section and index
    for (const [sk, sec] of Object.entries(sectionsState)) {
      const idx = sec.lessons.findIndex(x => x.id === withVideo.id)
      if (idx >= 0) { setActive(sk, idx); return }
    }
  }
  // fallback to first lesson
  for (const [sk, sec] of Object.entries(sectionsState)) {
    if (sec.lessons.length) { setActive(sk, 0); return }
  }
}

// small helpers to expose counts in template
const completedCountRef = computed(() => completedCount.value)

// expose
const completedCountExport = completedCount
const totalCountExport = totalCount
const completionPctExport = completionPct

// exports for template use
const completedCountVal = completedCount
const totalCountVal = totalCount
const completionPctVal = completionPct

// template uses shorter names
const completedCountAlias = completedCount
const totalCountAlias = totalCount
const completionPctAlias = completionPct

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
.course-page { font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial; color: #0F172A; background: #fff; min-height: 100vh }
.cp-header { height: 65px; background: #0F172A; color: #fff; display:flex; align-items:center; justify-content:space-between; padding: 0 80px }
.brand { display:flex; align-items:center; gap:12px }
.brand-logo { width: 31px; height: 31px }
.brand-name { font-weight:600 }

.cp-main { display:flex; gap: 40px; max-width: 1280px; margin: 24px auto; padding: 0 16px }
.left-col { flex: 1 1 720px }
/* Course Completion card (Figma: Frame 427318907) */
.right-col {
  width: 400px;
  box-sizing: border-box;
  background: #F8FAFC; /* grey/background */
  border: 1px solid #E2E8F0; /* grey/border */
  border-radius: 16px;
  padding: 16px;
}

.title { font-size: 24px; font-weight:600; margin-bottom:12px }
.hero { width:100%; height: 360px; border-radius:12px; background-size:cover; background-position:center; position:relative; overflow:hidden }
.play { position:absolute; inset:0; display:grid; place-items:center; border:0; background:linear-gradient(transparent, rgba(2,6,23,0.03)); cursor:pointer }
.play-ellipse { width:100px; height:100px; border-radius:999px; background:#F8FAFC }
.play-icon { width:44px; height:44px }

.tabs { display:flex; gap:12px; margin:18px 0 }
.tab { padding:12px 18px; border-radius:8px; background:#fff; border:1px solid #E2E8F0 }
.tab.active { background:#EFF6FF; border-color:transparent }

.overview h4 { font-size:20px; margin:0 0 8px 0 }
.overview p { color:#334155 }

.instructor-row { display:flex; gap:12px; align-items:center }
.avatar { width: 72px; height:72px; border-radius:999px; background-size:cover }
.instructor .name { color:#2563EB; font-weight:600 }
.instructor .role { color:#334155 }

.card-title {
  font-weight:600;
  font-size:24px; /* heading 3 */
  line-height: 140%;
  margin: 4px 0 12px 0;
  color: #0F172A;
}
.progress-wrap { display:flex; gap:12px; align-items:center; margin-bottom:12px }
.progress-circle { width:64px; height:64px; border-radius:999px; display:grid; place-items:center; background:linear-gradient(180deg,#EFF6FF,#E0F2FE); color:#2563EB; font-weight:600 }
.progress-meta .count { font-weight:600; color:#334155 }
.mark-all { background:transparent; border:0; color:#2563EB; cursor:pointer; font-weight:600 }

.section-block { background: transparent; border-top: 1px solid #E2E8F0; padding-top: 8px; margin-top: 8px }
.section-block:first-of-type { border-top: 0; margin-top: 0; padding-top: 0 }
.section-header { width:100%; display:flex; align-items:center; gap:8px; padding:12px 4px; background:transparent; border:0; text-align:left }
.section-header .sec-count { margin-left:auto; color:#64748B; font-size:14px }
.section-title { font-size:18px; font-weight:600; color: #0F172A }

.lessons { margin-top:6px; padding-bottom:8px; max-height: 520px; overflow:auto }
.lesson-row { display:flex; justify-content:space-between; align-items:center; gap:8px; padding:14px; border-radius:8px; cursor:pointer; background: transparent }
.lesson-row + .lesson-row { margin-top:6px }
.lesson-row:hover { transform: none; box-shadow: none; background: rgba(2,6,23,0.02) }
.lesson-row.active { background:#0F172A; color:#FFFFFF }
.lesson-left { display:flex; align-items:flex-start; gap:12px }
.checkbox { width:24px; height:24px; border-radius:5px; background:#FFFFFF; border:1px solid #E2E8F0; display:grid; place-items:center; flex: none }
.checkbox.checked { background:#3B82F6; border:0 }
.checkbox.activeBox { background:#FFFFFF; border:1px solid #E2E8F0 }
.num { font-weight:600; width:18px; color: inherit }
.title { width: 215px; font-size:16px; line-height:1.6; color: inherit }
.lesson-right { display:flex; align-items:center; gap:8px }
.rec { width:24px; height:24px }
.dur { color:#64748B }

.lesson-row.active .dur, .lesson-row.active .rec { opacity: 0.9; filter: brightness(1.4); color: rgba(255,255,255,0.9) }

/* Lesson viewer styles */
.lesson-viewer { margin-top: 18px; background: #ffffff; border-radius: 12px; padding: 12px; box-shadow: 0 6px 18px rgba(2,6,23,0.04) }
.lesson-viewer-title { font-size: 18px; font-weight:600; margin: 0 0 10px 0 }
.video-wrapper { position: relative; width: 100%; padding-bottom: 56.25%; /* 16:9 */ height: 0; overflow: hidden; border-radius: 8px; background: #000 }
.video-wrapper iframe { position: absolute; top:0; left:0; width:100%; height:100%; border:0 }
.lesson-content { margin-top: 12px; color: #334155; line-height: 1.6 }

/* responsive */
@media (max-width: 980px) {
  .cp-main { flex-direction:column; padding: 0 20px }
  .right-col { width:100% }
}

</style>
