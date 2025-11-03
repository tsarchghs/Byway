<template>
  <Header/>
  <div class="profile-page">
    <main class="profile-layout">
      <!-- Left: Profile card -->
      <aside class="profile-card" aria-label="Profile card">
        <div class="avatar-wrap center">
          <img :src="previewSrc || profile.avatar" :alt="`Avatar of ${profile.name}`" class="avatar" />
        </div>

        <div class="name center">{{ profile.name }}</div>

        <button class="share-btn center" @click="shareProfile" aria-label="Share profile">
          <span class="btn-text">Share Profile</span>
          <!-- circled share icon per Figma: circle with small connected nodes -->
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" class="share-svg">
            <circle cx="12" cy="12" r="10" stroke="#0F172A" stroke-width="2" fill="none" />
            <circle cx="8.5" cy="9.5" r="1.25" fill="#0F172A" />
            <circle cx="15.5" cy="7.5" r="1.25" fill="#0F172A" />
            <circle cx="15.5" cy="15.5" r="1.25" fill="#0F172A" />
            <path d="M9.2 10.2 L14 8" stroke="#0F172A" stroke-width="1.2" stroke-linecap="round" />
            <path d="M14.2 9.2 L14.2 14" stroke="#0F172A" stroke-width="1.2" stroke-linecap="round" />
          </svg>
        </button>

        <div class="card-stats-row">
          <div class="stat">
            <div class="stat-label">Total Students</div>
            <div class="stat-value">{{ profile.students.toLocaleString() }}</div>
          </div>
          <div class="stat">
            <div class="stat-label">Reviews</div>
            <div class="stat-value">{{ profile.reviews }}</div>
          </div>
          <div class="stat">
            <div class="stat-label">Courses</div>
            <div class="stat-value">{{ profile.courses }}</div>
          </div>
        </div>

        <div class="divider" />

        <nav class="side-nav" role="navigation" aria-label="Profile links">
          <button :class="['nav-item', { active: activeTab==='profile' }]" @click="activeTab='profile'">Profile</button>
          <button :class="['nav-item', { active: activeTab==='courses' }]" @click="activeTab='courses'">My Courses</button>
          <button :class="['nav-item', { active: activeTab==='teachers' }]" @click="activeTab='teachers'">Teachers</button>
          <button :class="['nav-item', { active: activeTab==='message' }]" @click="activeTab='message'">Message</button>
          <button :class="['nav-item', { active: activeTab==='reviews' }]" @click="activeTab='reviews'">My Reviews</button>
        </nav>
      </aside>

      <!-- Right: Content area -->
      <section class="profile-content">
        <header class="content-header">
          <h2>{{ headerTitle }}</h2>
        </header>

        <div class="content-body">
          <template v-if="activeTab==='profile'">
            <div class="panel">
              <div class="form-grid">
                <div class="input-block">
                  <label>First Name</label>
                  <input v-model="form.firstName" placeholder="Label" />
                </div>
                <div class="input-block">
                  <label>Last Name</label>
                  <input v-model="form.lastName" placeholder="Label" />
                </div>
                <div class="input-block wide">
                  <label>Headline</label>
                  <input v-model="form.headline" placeholder="Label" />
                </div>
                <div class="input-block wide">
                  <label>Description</label>
                  <textarea v-model="form.description" rows="4" placeholder="Label"></textarea>
                </div>
                <div class="input-block">
                  <label>Language</label>
                  <select v-model="form.language">
                    <option disabled value="">Label</option>
                    <option v-for="l in languages" :key="l" :value="l">{{ l }}</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="panel">
              <h4>Image Preview</h4>
              <div class="image-preview-large">
                <img :src="previewSrc" alt="Image preview" v-if="previewSrc" />
                <div class="image-placeholder" v-else>
                  <svg width="48" height="36" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" fill="#E6EEF3"/><path d="M8 11l2 2 4-4" stroke="#CBD5E1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
              </div>

              <div class="upload-row">
                <input class="upload-input" type="text" readonly :value="fileName || ''" placeholder="Label" />
                <label class="upload-btn">
                  Upload Image
                  <input type="file" @change="onFileChange" accept="image/*" style="display:none" />
                </label>
              </div>
              <div class="form-actions">
                <button class="btn primary" @click="saveImage">Save Image</button>
              </div>
            </div>

            <div class="panel links-panel">
              <h4>Links</h4>
              <div class="links-grid">
                <label>Website<input placeholder="Label" /></label>
                <label>X (Formerly twitter)<input placeholder="Label" /></label>
                <label>LinkedIn<input placeholder="Label" /></label>
                <label>Youtube<input placeholder="Label" /></label>
                <label>Facebook<input placeholder="Label" /></label>
              </div>
            </div>
          </template>

          <template v-else-if="activeTab==='courses'">
            <div class="courses-wrapper">
              <div class="courses-header">
                <div class="courses-title-row">
                  <h3 class="courses-title">Courses ({{ mockCourses.length }})</h3>
                </div>

                <div class="courses-controls">
                  <div class="search">
                    <input v-model="searchQuery" placeholder="Search courses" />
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 21l-4.35-4.35" stroke="#334155" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="11" cy="11" r="6" stroke="#334155" stroke-width="1.5"/></svg>
                  </div>

                  <div class="controls-right">
                    <div class="sort-by">
                      <label class="sort-label">Sort By</label>
                      <select v-model="sortBy">
                        <option value="recent">Recent</option>
                        <option value="popular">Popular</option>
                        <option value="progress">Progress</option>
                      </select>
                    </div>

                    <button class="btn add-course" @click="addCourse">
                      Add Course
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="#0F172A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>

                    <button class="btn filter-btn" @click="toggleFilters">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M22 7H2l8 7v6l4-2v-4l8-7z" stroke="#0F172A" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>
                  </div>
                </div>
              </div>

              <div class="courses-panel">
                <div class="courses-grid">
                  <article v-for="c in filteredCourses" :key="c.id" class="course-card">
                    <div class="thumb" :style="{ backgroundImage: `url(${c.image})` }" />
                    <div class="info">
                      <div class="title">{{ c.title }}</div>
                      <div class="meta">By {{ c.author }} • {{ c.level }} • {{ c.hours }}h</div>
                      <div class="progress-wrap">
                        <div class="progress-bg">
                          <div class="progress-fg" :style="{ width: c.progress + '%' }"></div>
                        </div>
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </template>

          <template v-else-if="activeTab==='message'">
            <div class="messages-layout">
              <div class="messages-list-panel">
                <div class="messages-header">
                  <h3 class="messages-title">Messages</h3>
                  <div class="messages-controls">
                    <div class="search small">
                      <input v-model="messageSearch" placeholder="Search messages" />
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 21l-4.35-4.35" stroke="#334155" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="11" cy="11" r="6" stroke="#334155" stroke-width="1.5"/></svg>
                    </div>
                  </div>
                </div>

                <div class="messages-list">
                  <article v-for="m in filteredMessages" :key="m.id" :class="['message-item', { unread: !m.read, active: selectedMessage && selectedMessage.id===m.id }]" @click="selectMessage(m)">
                    <div class="msg-left">
                      <div class="msg-avatar" :style="{ backgroundImage: `url(${m.avatar})` }"></div>
                      <div class="msg-meta">
                        <div class="msg-name">{{ m.name }}</div>
                        <div class="msg-snippet">{{ m.snippet }}</div>
                      </div>
                    </div>
                    <div class="msg-right">
                      <div class="msg-date">{{ m.date }}</div>
                    </div>
                  </article>
                </div>
              </div>

              <div class="messages-view-panel" v-if="selectedMessage">
                <div class="view-header">
                  <div class="view-left">
                    <div class="view-avatar" :style="{ backgroundImage: `url(${selectedMessage.avatar})` }"></div>
                    <div>
                      <div class="view-name">{{ selectedMessage.name }}</div>
                      <div class="view-sub">{{ selectedMessage.subject }}</div>
                    </div>
                  </div>
                  <div class="view-date">{{ selectedMessage.date }}</div>
                </div>

                <div class="view-body">
                  <p>{{ selectedMessage.body }}</p>
                </div>

                <div class="reply-panel">
                  <textarea v-model="replyText" rows="4" placeholder="Write your reply..."></textarea>
                  <div class="form-actions"><button class="btn primary" @click="sendReply">Send Reply</button></div>
                </div>
              </div>
            </div>
          </template>

          <template v-else-if="activeTab==='reviews'">
            <div class="reviews-panel">
              <div class="reviews-header">
                <h3 class="reviews-title">Reviews ({{ mockReviews.length }})</h3>
                <button class="dots-btn" aria-label="more options">
                  <svg width="20" height="6" viewBox="0 0 20 6" fill="none" aria-hidden="true"><circle cx="3" cy="3" r="1.5" fill="#475569"/><circle cx="10" cy="3" r="1.5" fill="#475569"/><circle cx="17" cy="3" r="1.5" fill="#475569"/></svg>
                </button>
              </div>

              <div class="review-list">
                <article v-for="r in mockReviews" :key="r.id" class="review-card">
                  <div class="review-top">
                    <div class="course-label">Course Name:</div>
                    <div class="course-title">{{ r.course }}</div>
                    <div class="rating">
                      <div class="stars">
                        <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= r.rating }">★</span>
                      </div>
                      <div class="rating-count">({{ r.rating }})</div>
                    </div>
                  </div>

                  <div class="review-body">{{ r.text }}</div>

                  <div class="review-footer">
                    <div class="review-author">
                      <div class="author-avatar" :style="{ backgroundImage: `url(${r.avatar})` }"></div>
                      <div class="author-meta">
                        <div class="author-name">{{ r.name }}</div>
                        <div class="author-date">{{ r.date }}</div>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="placeholder">Content for {{ activeTab }}</div>
          </template>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import Header from '../../../../packages/shared-ui/src/components/Header.vue';

import { ref, reactive, computed } from 'vue'

const profile = reactive({
  name: 'John Doe',
  title: 'Product Designer & Teacher',
  avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop',
  students: 1200,
  reviews: 512,
  courses: 12
})

const isFollowing = ref(false)
const activeTab = ref<'profile'|'courses'|'teachers'|'message'|'reviews'>('profile')

const form = reactive({ firstName: 'John', lastName: 'Doe', headline: 'Product Designer & Teacher', description: 'I design delightful user experiences.', language: '' })

const languages = ['English', 'Spanish', 'French', 'German']
const previewSrc = ref<string | null>(profile.avatar)
const fileName = ref<string | null>(null)

function toggleFollow() { isFollowing.value = !isFollowing.value }
function shareProfile() { navigator.clipboard?.writeText(window.location.href).then(()=> alert('Profile link copied (mock)')) }

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files && input.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => { previewSrc.value = String(reader.result); fileName.value = file.name }
  reader.readAsDataURL(file)
}

function saveProfile() {
  // persist form to localStorage (mock)
  localStorage.setItem('profileForm', JSON.stringify(form))
  localStorage.setItem('profileImage', previewSrc.value || '')
  alert('Profile saved (mock)')
}
function resetForm() { 
  form.firstName = 'John'; 
  form.lastName = 'Doe'; 
  form.headline = 'Product Designer & Teacher'; 
  form.description = 'I design delightful user experiences.'; 
  previewSrc.value = profile.avatar
  fileName.value = null
  // clear persisted state
  localStorage.removeItem('profileForm')
  localStorage.removeItem('profileImage')
}

const headerTitle = computed(() => {
  switch (activeTab.value) {
    case 'profile': return 'Profile'
    case 'courses': return 'My Courses'
    case 'teachers': return 'Teachers'
    case 'message': return 'Message'
    case 'reviews': return 'My Reviews'
  }
})

const mockCourses = [
  { id: 'c1', title: 'Beginner’s Guide to Design', author: 'Ronald Richards', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop', level: 'Beginner', hours: 22, progress: 36, ratings: 1200, createdAt: 2 },
  { id: 'c2', title: 'Interaction Patterns', author: 'Esther Howard', image: 'https://images.unsplash.com/photo-1522199710521-72d69614c702?q=80&w=800&auto=format&fit=crop', level: 'Intermediate', hours: 16, progress: 68, ratings: 860, createdAt: 1 }
]

const searchQuery = ref('')
const sortBy = ref<'recent'|'popular'|'progress'>('recent')
const showFilters = ref(false)

const filteredCourses = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  let list = mockCourses.slice()
  if (q) list = list.filter(c => (c.title || '').toLowerCase().includes(q) || (c.author || '').toLowerCase().includes(q))
  if (sortBy.value === 'progress') list.sort((a,b) => (b.progress || 0) - (a.progress || 0))
  else if (sortBy.value === 'popular') list.sort((a,b) => (b.ratings || 0) - (a.ratings || 0))
  else list.sort((a,b) => (b.createdAt || 0) - (a.createdAt || 0))
  return list
})

function addCourse() { alert('Add course (mock)') }
function toggleFilters() { showFilters.value = !showFilters.value }

// Reviews data
const mockReviews = [
  {
    id: 'r1',
    course: 'Beginner’s Guide to Design',
    rating: 5,
    text: 'I was initially apprehensive, having no prior design experience. But the instructor did an amazing job of breaking down complex concepts into easily digestible modules. The video lectures were engaging, and the real-world examples helped solidify my understanding.',
    name: 'Alex Johnson',
    avatar: 'https://images.unsplash.com/photo-1545996124-1c6f3c6f1f1f?q=80&w=400&auto=format&fit=crop',
    date: '12th Feb, 2024'
  },
  {
    id: 'r2',
    course: 'Interaction Patterns',
    rating: 4,
    text: 'Great pacing and practical exercises. Loved the quizzes.',
    name: 'Jamie Lee',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop',
    date: '3rd Jan, 2024'
  }
]

// Messages data and helpers
const messageSearch = ref('')
const messages = ref([
  {
    id: 'm1',
    name: 'Ronald Richards',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop',
    subject: 'Re: Your design question',
    snippet: "Thank you for asking your doubt, I’ll send you a pdf file which cover the problems you are facing...",
    body: "Thank you for asking your doubt, I’ll send you a pdf file which cover the problems you are facing. If you have any further questions I can help.",
    date: '18th March, 2024',
    read: false
  },
  {
    id: 'm2',
    name: 'Devon Lane',
    avatar: 'https://images.unsplash.com/photo-1545996124-1c6f3c6f1f1f?q=80&w=400&auto=format&fit=crop',
    subject: 'Quick follow-up',
    snippet: "I’ll Get back to you as soon as possible.",
    body: "I’ll Get back to you as soon as possible. Thanks for your patience.",
    date: '18th March, 2024',
    read: true
  }
])

const selectedMessage = ref(messages.value[0] || null)
const replyText = ref('')

const filteredMessages = computed(() => {
  const q = messageSearch.value.trim().toLowerCase()
  if (!q) return messages.value
  return messages.value.filter(m => (m.name + ' ' + m.subject + ' ' + m.snippet).toLowerCase().includes(q))
})

function selectMessage(m: any) {
  selectedMessage.value = m
  // mark as read
  const idx = messages.value.findIndex(x => x.id === m.id)
  if (idx >= 0) messages.value[idx].read = true
}

function sendReply() {
  if (!replyText.value.trim()) { alert('Please enter a reply'); return }
  // append a tiny confirmation (in real app we'd post to server)
  alert('Reply sent (mock): ' + replyText.value)
  replyText.value = ''
}

const message = ref('')
function sendMessage() { alert(`Message sent (mock): ${message.value}`); message.value = '' }

function saveImage() {
  // in a real app, upload to server; here persist to localStorage
  if (previewSrc.value) {
    localStorage.setItem('profileImage', previewSrc.value)
    alert('Image saved (mock)')
  } else {
    alert('No image selected')
  }
}

// load saved form/image if present
try {
  const saved = localStorage.getItem('profileForm')
  if (saved) {
    const parsed = JSON.parse(saved)
    Object.assign(form, parsed)
  }
  const savedImg = localStorage.getItem('profileImage')
  if (savedImg) previewSrc.value = savedImg || profile.avatar
} catch (e) { /* ignore */ }

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
.profile-page { font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial; background:#FFFFFF; color:#0F172A; padding: 24px }
.profile-layout { max-width: 1200px; margin: 0 auto; display: flex; gap: 24px }
  .profile-card { width: 290px; background: #F8FAFC; border-radius:16px; padding:24px 0; box-sizing:border-box; display:flex; flex-direction:column; align-items:center; gap:16px; min-height:607px }
  .avatar-wrap.center { width:164px; height:270px; display:flex; align-items:flex-start; justify-content:center }
  .avatar { width:160px; height:160px; border-radius:999px; object-fit:cover }
  .name.center { font-size:20px; font-weight:600; color:#0F172A; text-align:center; line-height:30px; height:30px }
  .share-btn.center { width:164px; height:48px; display:inline-flex; align-items:center; justify-content:center; gap:6px; padding:10px 24px; background:#FFFFFF; border:1px solid #E2E8F0; border-radius:8px; cursor:pointer }
  .share-btn .btn-text { font-weight:500; font-size:14px; color:#0F172A; line-height:22px }
  .share-svg { margin-left:6px }
  .card-stats-row { display:flex; gap:18px; margin:0; padding:0 12px }
  .stat { display:flex; flex-direction:column; align-items:center }
  .stat-label { font-size:14px; color:#334155 }
  .stat-value { font-size:20px; font-weight:600 }
  .divider { width:274px; height:0; border-top:1px solid #E2E8F0; margin:12px 0 }
  .side-nav { display:flex; flex-direction:column; width:290px; margin-top:0 }
  .nav-item { display:block; text-align:left; padding:16px; border-bottom:1px solid #E2E8F0; background:#F8FAFC; color:#334155; font-size:14px; width:100%; box-sizing:border-box; height:53px; line-height:21px }
  .nav-item.active { background:#0F172A; color:#FFFFFF }

  .profile-content { flex:1; background:#FFFFFF; border-radius:16px; padding:20px; box-sizing:border-box; border:1px solid #E2E8F0 }
  .content-header h2 { margin:0; font-size:24px; font-weight:600 }
  .panel { background:#FFFFFF; border:1px solid #E2E8F0; border-radius:12px; padding:18px; margin-bottom:16px }
  .form-grid { display:grid; grid-template-columns: 1fr 1fr; gap:16px }
  .input-block { display:flex; flex-direction:column }
  .input-block.wide { grid-column: 1 / -1 }
  label { font-size:14px; color:#0F172A; margin-bottom:8px }
  input, textarea, select { padding:12px; border-radius:8px; border:1px solid #E2E8F0; font-size:16px }
  .image-preview-large { display:flex; align-items:center; justify-content:center; height:180px; background:#F1F6F9; border-radius:8px }
  .image-preview-large img { max-width:100%; max-height:100%; object-fit:cover; border-radius:8px }
  .image-placeholder { width:160px; height:96px; display:grid; place-items:center; background:#E6EEF3; border-radius:8px }
  .upload-row { display:flex; gap:12px; align-items:center; margin-top:12px }
  .upload-input { flex:1; padding:12px; border-radius:8px; border:1px solid #E2E8F0 }
  .upload-btn { background:#FFFFFF; border:1px solid #E2E8F0; padding:10px 12px; border-radius:8px; cursor:pointer }
  .form-actions { margin-top:18px; display:flex; gap:12px }

  .courses-grid { display:flex; gap:16px; flex-wrap:wrap }
.course-card { width:298px; border:1px solid #E2E8F0; border-radius:16px; overflow:hidden; background:#fff }
.thumb { height:139px; background-size:cover; background-position:center }
.info { padding:12px }
.title { font-weight:600 }
.meta { color:#334155; margin-top:6px }
  /* courses header and controls */
  .courses-wrapper { width:100% }
  .courses-header { display:flex; flex-direction:column; gap:16px; margin-bottom:16px }
  .courses-title { font-size:20px; font-weight:600; color:#0F172A; margin:0 }
  .courses-controls { display:flex; justify-content:space-between; align-items:center; gap:24px }
  .search { display:flex; align-items:center; gap:12px; width:300px; height:44px; padding:10px; background:#FFFFFF; border:1px solid #E2E8F0; border-radius:8px }
  .search input { border:0; outline:none; width:100%; font-size:14px }
  .controls-right { display:flex; align-items:center; gap:16px; width:354px; justify-content:flex-end }
  .sort-by { display:flex; align-items:center; gap:8px }
  .sort-label { font-size:16px; color:#0F172A }
  .add-course { background:#FFFFFF; border:1px solid #0F172A; padding:10px 24px; border-radius:8px; display:inline-flex; gap:8px; align-items:center; cursor:pointer }
  .filter-btn { background:#FFFFFF; border:1px solid #E2E8F0; padding:10px 12px; border-radius:8px; cursor:pointer }
  .progress-wrap { margin-top:12px }
  .progress-bg { width:263px; height:3px; background:#E0F2FE; border-radius:60px; position:relative }
  .progress-fg { height:3px; background:#2563EB; border-radius:60px; position:absolute; left:0; top:0 }
  /* messages styles */
  .messages-layout { display:flex; gap:18px }
  .messages-list-panel { width:360px; background:#FFFFFF; border:1px solid #E2E8F0; border-radius:12px; padding:12px }
  .messages-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px }
  .messages-title { margin:0; font-size:20px; font-weight:600 }
  .search.small { display:flex; align-items:center; gap:8px; width:300px; height:44px; padding:10px; background:#FFFFFF; border:1px solid #E2E8F0; border-radius:8px }
  .search.small input { border:0; outline:none; width:100% }
  .messages-list { display:flex; flex-direction:column; gap:8px; max-height:520px; overflow:auto }
  .message-item { display:flex; justify-content:space-between; align-items:center; padding:12px; border-radius:8px; cursor:pointer }
  .message-item.unread { background:#F1F9FF }
  .message-item.active { background:#EFF6FF; border:1px solid #E0F2FE }
  .msg-left { display:flex; gap:12px; align-items:center }
  .msg-avatar { width:40px; height:40px; border-radius:8px; background-size:cover; background-position:center }
  .msg-name { font-weight:600; color:#0F172A }
  .msg-snippet { font-size:14px; color:#334155 }
  .msg-right .msg-date { font-size:13px; color:#334155 }

  .messages-view-panel { flex:1; background:#FFFFFF; border:1px solid #E2E8F0; border-radius:12px; padding:16px; display:flex; flex-direction:column; gap:12px }
  .view-header { display:flex; justify-content:space-between; align-items:center }
  .view-left { display:flex; gap:12px; align-items:center }
  .view-avatar { width:40px; height:40px; border-radius:8px; background-size:cover; background-position:center }
  .view-name { font-weight:600 }
  .view-sub { font-size:14px; color:#334155 }
  .view-date { font-size:14px; color:#334155 }
  .view-body { background:#FAFCFF; padding:12px; border-radius:8px; min-height:120px }
  .reply-panel textarea { width:100%; padding:12px; border-radius:8px; border:1px solid #E2E8F0 }

  /* reviews styles - tuned to match design */
  .reviews-panel { background:#FFFFFF; border:1px solid #E2E8F0; border-radius:16px; padding:20px; width:902px; box-shadow: 0 1px 2px rgba(15,23,42,0.04); }
  .reviews-header { display:flex; align-items:center; position:relative; padding-right:40px }
  .reviews-title { margin:0; font-size:20px; font-weight:600; color:#0F172A }
  .dots-btn { background:transparent; border:0; cursor:pointer; position:absolute; right:16px; top:16px; padding:6px }
  .review-list { display:flex; flex-direction:column; gap:16px; margin-top:16px }
  .review-card { background:#FFFFFF; border-radius:12px; padding:16px; border:1px solid #E8EEF5; width:100% }
  .review-top { display:flex; align-items:center; gap:12px }
  .course-label { font-size:14px; color:#334155; width:94px; flex:0 0 94px }
  .course-title { font-size:18px; font-weight:600; color:#0F172A }
  .rating { margin-left:auto; display:flex; align-items:center; gap:8px }
  .stars { color:#FBBF24; font-size:18px; line-height:1 }
  .star { opacity:0.35; margin-right:2px }
  .star.filled { opacity:1 }
  .rating-count { font-size:13px; color:#334155 }
  .review-body { margin-top:12px; color:#334155; font-size:16px; line-height:1.6; margin-left:94px }
  .review-footer { margin-top:12px; display:flex; align-items:center }
  .author-avatar { width:40px; height:40px; border-radius:8px; background-size:cover; background-position:center }
  .author-meta { margin-left:8px }
  .author-name { font-weight:600 }
  .author-date { font-size:13px; color:#334155 }

@media (max-width: 980px) {
  .profile-layout { flex-direction:column }
  .profile-card { width:100% }
  .profile-content { width:100% }
  .form-grid { grid-template-columns: 1fr }
}

</style>
