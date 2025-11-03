<template>
  <Header/>
  <div class="author-page">
    <main class="author-main">
      <section class="author-header">
        <div class="author-meta">
          <div class="role">Instructor</div>
          <div class="name">{{ author.name }}</div>
          <div class="subtitle">{{ author.title }}</div>

          <div class="stats-row">
            <div class="stat">
              <div class="stat-label">Total Students</div>
              <div class="stat-value">{{ author.students.toLocaleString() }}</div>
            </div>
            <div class="stat">
              <div class="stat-label">Reviews</div>
              <div class="stat-value">{{ author.reviews }}</div>
            </div>
            <div class="stat">
              <div class="stat-label">Courses</div>
              <div class="stat-value">{{ author.courses.length }}</div>
            </div>
          </div>

          <div class="actions">
            <button class="btn-outline" @click="toggleFollow" :aria-pressed="isFollowing">
              {{ isFollowing ? 'Following' : 'Follow' }}
            </button>
            <button class="btn-ghost" @click="messageAuthor">Message</button>
          </div>
        </div>

        <div class="author-avatar">
          <img :src="author.avatar" :alt="`Avatar of ${author.name}`" />
        </div>
      </section>

      <section class="about">
        <h4>About {{ author.firstName }}</h4>
        <p class="bio" v-html="shortBio"></p>
        <button class="more-link" v-if="!bioExpanded" @click="bioExpanded = true">Read more</button>
        <div class="bio-full" v-if="bioExpanded" v-html="author.bio"></div>
      </section>

      <section class="expertise">
        <h4>Areas of Expertise</h4>
        <div class="tags">
          <button v-for="(tag,i) in author.expertise" :key="i" class="tag" @click="filterByTag(tag)">{{ tag }}</button>
        </div>
      </section>

      <section class="more-courses">
        <h4>More Courses by {{ author.firstName }}</h4>
        <div class="course-grid">
          <article v-for="c in visibleCourses" :key="c.id" class="course-card" @click="openCourse(c)">
            <div class="thumb" :style="{ backgroundImage: `url(${c.image})` }" />
            <div class="course-info">
              <div class="course-title">{{ c.title }}</div>
              <div class="course-meta">By {{ author.name }} • {{ c.level }} • {{ c.hours }}h</div>
            </div>
          </article>
        </div>
        <div class="course-actions">
          <button class="btn-outline" @click="showAll = !showAll">{{ showAll ? 'Show less' : 'View all' }}</button>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import Header from '../../../../packages/shared-ui/src/components/Header.vue';

import { ref, reactive, computed } from 'vue'

type CourseCard = { id: string; title: string; image: string; level: string; hours: number }

const author = reactive({
  name: 'Ronald Richards',
  firstName: 'Ronald',
  title: 'Web developer, UX/UI Designer, and Teacher',
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=320&auto=format&fit=crop',
  students: 1000,
  reviews: 154,
  bio: `<p>Ronald Richards is a highly skilled UX/UI Designer with over a decade of experience in crafting user-centric digital solutions. With a background in graphic design and a keen eye for detail, Ronald specializes in creating intuitive interfaces that delight users and drive business results.</p>
        <p>He has worked with startups and enterprises alike, leading cross-functional teams and mentoring junior designers.</p>`,
  expertise: ['UX Design', 'UI Design', 'Information Architecture', 'Interaction Design', 'Usability Testing'] as string[],
  courses: [
    { id: 'c1', title: `Beginner’s Guide to Design`, image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop', level: 'Beginner', hours: 22 },
    { id: 'c2', title: `Advanced Interaction Patterns`, image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop', level: 'Intermediate', hours: 18 },
    { id: 'c3', title: `Design Systems in Practice`, image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop', level: 'Advanced', hours: 30 }
  ] as CourseCard[]
})

const isFollowing = ref(false)
const bioExpanded = ref(false)
const showAll = ref(false)
const activeFilter = ref<string | null>(null)

function toggleFollow() { isFollowing.value = !isFollowing.value }
function messageAuthor() { alert(`Open message composer to ${author.name} (mock)`) }
function filterByTag(tag: string) {
  activeFilter.value = activeFilter.value === tag ? null : tag
}
function openCourse(c: CourseCard) {
  // in real app: navigate to course route; here we show a mock alert
  alert(`Open course: ${c.title}`)
}

const shortBio = computed(() => {
  // produce a short excerpt (approx 160 chars)
  const txt = author.bio.replace(/<[^>]+>/g, '')
  return txt.length > 160 ? txt.slice(0, 160) + '...' : txt
})

const visibleCourses = computed(() => showAll.value ? author.courses : author.courses.slice(0, 3))

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
.author-page { font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial; background: #FFFFFF; color: #0F172A; padding: 40px }
.author-main { max-width: 1140px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px }
.author-header { display:flex; justify-content:space-between; align-items:center; gap: 24px }
.author-meta { display:flex; flex-direction:column; gap:8px; max-width: 740px }
.role { font-size:14px; color:#334155 }
.name { font-size:32px; font-weight:600; color:#0F172A }
.subtitle { font-size:14px; color:#334155 }
.stats-row { display:flex; gap:24px; margin-top:12px }
.stat { display:flex; flex-direction:column }
.stat-label { font-size:14px; color:#334155 }
.stat-value { font-size:24px; font-weight:600; color:#0F172A }
.author-avatar img { width:200px; height:200px; border-radius:999px; object-fit:cover }
.actions { display:flex; gap:12px; margin-top:12px }
.btn-outline { padding:10px 20px; border-radius:8px; border:1px solid #020617; background:transparent; cursor:pointer }
.btn-outline[aria-pressed='true'] { background:#0F172A; color:#fff; border-color:transparent }
.btn-ghost { padding:10px 20px; border-radius:8px; background:#F8FAFC; border:1px solid #E2E8F0; cursor:pointer }

.about { background: transparent; padding: 8px 0 }
.about h4, .expertise h4, .more-courses h4 { font-size:20px; font-weight:600; color:#0F172A }
.bio { color:#334155 }
.more-link { background:none; border:0; color:#2563EB; cursor:pointer; margin-top:8px }
.tags { display:flex; gap:8px; flex-wrap:wrap; margin-top:8px }
.tag { background:#F8FAFC; border:1px solid #E2E8F0; padding:8px 12px; border-radius:8px; cursor:pointer }

.more-courses .course-grid { display:flex; gap:16px; flex-wrap:wrap; margin-top:12px }
.course-card { width: 266px; background:#fff; border:1px solid #E2E8F0; border-radius:16px; overflow:hidden; cursor:pointer; box-shadow: 0 0 8px rgba(59,130,246,0.06) }
.thumb { height:139px; background-size:cover; background-position:center }
.course-info { padding:12px }
.course-title { font-weight:600; color:#0F172A }
.course-meta { color:#334155; font-size:14px; margin-top:6px }
.course-actions { margin-top:12px }

@media (max-width: 980px) {
  .author-main { padding: 0 12px }
  .author-header { flex-direction:column; align-items:flex-start }
  .author-avatar img { width:120px; height:120px }
  .course-grid { justify-content:flex-start }
}

</style>
