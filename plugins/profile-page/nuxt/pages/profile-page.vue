<template>
  <Header />

  <a-layout class="profile-page">
    <!-- ===== Left: Profile / Nav ===== -->
    <a-layout-sider
      width="320"
      breakpoint="lg"
      collapsible
      v-model:collapsed="collapsed"
      :collapsedWidth="0"
      theme="light"
      style="background:#fff"
    >
      <a-card :bordered="false" style="margin: 12px">
        <div class="center">
          <a-upload
            :beforeUpload="beforeUpload"
            :showUploadList="false"
            accept="image/*"
          >
            <a-avatar :size="120" :src="previewSrc || profile.avatar" />
            <div style="margin-top:8px">
              <a-button size="small" :icon="h(UploadOutlined)">Change</a-button>
            </div>
          </a-upload>
        </div>

        <a-typography-title :level="4" style="text-align:center;margin:12px 0 0">
          {{ profile.name }}
        </a-typography-title>
        <a-typography-text type="secondary" style="display:block;text-align:center">
          {{ profile.title }}
        </a-typography-text>

        <a-row :gutter="[8,8]" style="margin-top:12px">
          <a-col :span="8"><a-statistic title="Students" :value="profile.students" /></a-col>
          <a-col :span="8"><a-statistic title="Reviews" :value="profile.reviews" /></a-col>
          <a-col :span="8"><a-statistic title="Courses" :value="profile.courses" /></a-col>
        </a-row>

        <a-space style="margin-top:12px" :size="8" wrap>
          <a-button @click="shareProfile" :icon="h(ShareAltOutlined)">Share</a-button>
          <a-button
            :type="isFollowing ? 'primary' : 'default'"
            :ghost="!isFollowing"
            @click="toggleFollow"
            :icon="h(isFollowing ? CheckOutlined : UserAddOutlined)"
          >
            {{ isFollowing ? 'Following' : 'Follow' }}
          </a-button>
        </a-space>
      </a-card>

      <a-menu
        mode="inline"
        :selectedKeys="menuKeys"
        @select="onMenu"
        style="border-right:0"
      >
        <a-menu-item key="profile" :icon="h(UserOutlined)">Profile</a-menu-item>
        <a-menu-item key="courses" :icon="h(BookOutlined)">My Courses</a-menu-item>
        <a-menu-item key="teachers" :icon="h(TeamOutlined)">Teachers</a-menu-item>
        <a-menu-item key="message" :icon="h(MailOutlined)">Message</a-menu-item>
        <a-menu-item key="reviews" :icon="h(StarOutlined)">My Reviews</a-menu-item>
      </a-menu>
    </a-layout-sider>

    <!-- ===== Right: Content ===== -->
    <a-layout>
      <a-page-header :title="headerTitle" style="background:#fff;margin:12px;border:1px solid #f0f0f0;border-radius:8px" />

      <a-layout-content style="margin:12px">
        <!-- Profile tab -->
        <a-card v-if="activeTab==='profile'" :bordered="true">
          <a-form layout="vertical" @finish="saveProfile" :model="form" :rules="rules" ref="formRef">
            <a-row :gutter="[16,16]">
              <a-col :xs="24" :md="12">
                <a-form-item label="First Name" name="firstName">
                  <a-input v-model:value="form.firstName" placeholder="First name" />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :md="12">
                <a-form-item label="Last Name" name="lastName">
                  <a-input v-model:value="form.lastName" placeholder="Last name" />
                </a-form-item>
              </a-col>

              <a-col :xs="24">
                <a-form-item label="Headline" name="headline">
                  <a-input v-model:value="form.headline" placeholder="Headline" />
                </a-form-item>
              </a-col>

              <a-col :xs="24">
                <a-form-item label="Description" name="description">
                  <a-textarea v-model:value="form.description" :rows="4" placeholder="Tell people about you…" />
                </a-form-item>
              </a-col>

              <a-col :xs="24" :md="12">
                <a-form-item label="Language" name="language">
                  <a-select
                    v-model:value="form.language"
                    :options="languages.map(l=>({label:l,value:l}))"
                    placeholder="Select language"
                    allow-clear
                  />
                </a-form-item>
              </a-col>

              <a-col :xs="24" :md="12">
                <a-form-item label="Website">
                  <a-input v-model:value="links.website" placeholder="https://example.com" />
                </a-form-item>
              </a-col>
            </a-row>

            <a-divider />

            <a-typography-title :level="5">Avatar Preview</a-typography-title>
            <a-image
              v-if="previewSrc"
              :src="previewSrc"
              :width="220"
              style="border-radius:8px;border:1px dashed #d9d9d9"
            />
            <a-empty v-else description="Select an image to preview" />

            <a-space style="margin-top:12px">
              <a-button @click="resetForm">Reset</a-button>
              <a-button type="primary" html-type="submit" :icon="h(SaveOutlined)">Save Profile</a-button>
              <a-button @click="saveImage" :icon="h(PictureOutlined)">Save Image</a-button>
            </a-space>
          </a-form>
        </a-card>

        <!-- Courses tab -->
        <a-card v-else-if="activeTab==='courses'">
          <a-row justify="space-between" align="middle" style="margin-bottom:12px">
            <a-col>
              <a-typography-title :level="4" style="margin:0">Courses ({{ mockCourses.length }})</a-typography-title>
            </a-col>
            <a-col>
              <a-space wrap>
                <a-input-search v-model:value="searchQuery" placeholder="Search courses" style="width:220px" />
                <a-select v-model:value="sortBy" style="width:160px">
                  <a-select-option value="recent">Recent</a-select-option>
                  <a-select-option value="popular">Popular</a-select-option>
                  <a-select-option value="progress">Progress</a-select-option>
                </a-select>
                <a-button type="primary" :icon="h(PlusOutlined)" @click="addCourse">Add Course</a-button>
              </a-space>
            </a-col>
          </a-row>

          <a-row :gutter="[16,16]">
            <a-col v-for="c in filteredCourses" :key="c.id" :xs="24" :sm="12" :md="8">
              <a-card hoverable @click="openCourse(c.id)">
                <template #cover>
                  <img :src="c.image" :alt="c.title" style="height:140px;object-fit:cover" />
                </template>
                <a-card-meta :title="c.title" :description="`By ${c.author} • ${c.level} • ${c.hours}h`" />
                <div style="margin-top:8px">
                  <a-progress :percent="c.progress" size="small" />
                </div>
              </a-card>
            </a-col>
          </a-row>
        </a-card>

        <!-- Messages tab -->
        <a-card v-else-if="activeTab==='message'">
          <a-row :gutter="[16,16]">
            <a-col :xs="24" :md="9">
              <a-input-search v-model:value="messageSearch" placeholder="Search messages" style="margin-bottom:8px" />
              <a-list
                item-layout="horizontal"
                :data-source="filteredMessages"
                :render-item="renderMessageItem"
                :split="true"
                style="background:#fff"
              />
            </a-col>

            <a-col :xs="24" :md="15">
              <a-card v-if="selectedMessage" :title="selectedMessage.subject">
                <template #extra>
                  <a-typography-text type="secondary">{{ selectedMessage.date }}</a-typography-text>
                </template>

                <a-space align="start" style="margin-bottom:12px">
                  <a-avatar :src="selectedMessage.avatar" />
                  <div>
                    <div class="view-name">{{ selectedMessage.name }}</div>
                    <a-typography-text type="secondary">{{ selectedMessage.email || '' }}</a-typography-text>
                  </div>
                </a-space>

                <a-typography-paragraph>{{ selectedMessage.body }}</a-typography-paragraph>

                <a-form @finish="sendReply" layout="vertical">
                  <a-form-item label="Reply">
                    <a-textarea v-model:value="replyText" :rows="4" placeholder="Write your reply…" />
                  </a-form-item>
                  <a-button type="primary" html-type="submit">Send Reply</a-button>
                </a-form>
              </a-card>
              <a-empty v-else description="Select a message" />
            </a-col>
          </a-row>
        </a-card>

        <!-- Others -->
        <a-card v-else>
          <a-empty :description="`Content for ${activeTab}`" />
        </a-card>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { h, ref, reactive, computed } from 'vue'
import Header from '../../../../packages/shared-ui/src/components/Header.vue'
import { message as antdMessage } from 'ant-design-vue'
import {
  ShareAltOutlined,
  UserAddOutlined,
  CheckOutlined,
  UploadOutlined,
  SaveOutlined,
  PictureOutlined,
  UserOutlined,
  BookOutlined,
  TeamOutlined,
  MailOutlined,
  StarOutlined,
  PlusOutlined
} from '@ant-design/icons-vue'

/** ===== State: profile ===== */
const profile = reactive({
  name: 'John Doe',
  title: 'Product Designer & Teacher',
  avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop',
  students: 1200,
  reviews: 512,
  courses: 12
})
const isFollowing = ref(false)
const collapsed = ref(false)
const activeTab = ref<'profile'|'courses'|'teachers'|'message'|'reviews'>('profile')
const menuKeys = computed(() => [activeTab.value])

function toggleFollow(){ isFollowing.value = !isFollowing.value; antdMessage.success(isFollowing.value ? 'Following' : 'Unfollowed') }
function shareProfile(){
  navigator.clipboard?.writeText(window.location.href)
  antdMessage.success('Profile link copied')
}
function onMenu({ key }: { key: typeof activeTab.value }) { activeTab.value = key }

/** ===== Header title ===== */
const headerTitle = computed(() => {
  switch (activeTab.value) {
    case 'profile': return 'Profile'
    case 'courses': return 'My Courses'
    case 'teachers': return 'Teachers'
    case 'message': return 'Message'
    case 'reviews': return 'My Reviews'
  }
})

/** ===== Form ===== */
const formRef = ref()
const form = reactive({
  firstName: 'John',
  lastName: 'Doe',
  headline: 'Product Designer & Teacher',
  description: 'I design delightful user experiences.',
  language: ''
})
const rules = {
  firstName: [{ required: true, message: 'Please enter first name' }],
  lastName: [{ required: true, message: 'Please enter last name' }],
}
const languages = ['English', 'Spanish', 'French', 'German']
const links = reactive({ website: '' })

/** ===== Avatar upload preview ===== */
const previewSrc = ref<string | null>(profile.avatar)
function beforeUpload(file: File) {
  const reader = new FileReader()
  reader.onload = () => (previewSrc.value = String(reader.result))
  reader.readAsDataURL(file)
  return false // prevent auto upload
}
function saveProfile(){
  localStorage.setItem('profileForm', JSON.stringify(form))
  localStorage.setItem('profileImage', previewSrc.value || '')
  antdMessage.success('Profile saved')
}
function resetForm(){
  form.firstName = 'John'
  form.lastName = 'Doe'
  form.headline = 'Product Designer & Teacher'
  form.description = 'I design delightful user experiences.'
  form.language = ''
  previewSrc.value = profile.avatar
  localStorage.removeItem('profileForm')
  localStorage.removeItem('profileImage')
  antdMessage.info('Form reset')
}
function saveImage(){
  if (!previewSrc.value) return antdMessage.warning('No image selected')
  localStorage.setItem('profileImage', previewSrc.value)
  antdMessage.success('Image saved')
}

/** ===== Courses ===== */
type Course = {
  id: string; title: string; author: string; image: string;
  level: 'Beginner'|'Intermediate'|'Advanced'; hours: number; progress: number;
  ratings: number; createdAt: number
}
const mockCourses: Course[] = [
  { id:'c1', title:'Beginner’s Guide to Design', author:'Ronald Richards', image:'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop', level:'Beginner', hours:22, progress:36, ratings:1200, createdAt:2 },
  { id:'c2', title:'Interaction Patterns', author:'Esther Howard', image:'https://images.unsplash.com/photo-1522199710521-72d69614c702?q=80&w=800&auto=format&fit=crop', level:'Intermediate', hours:16, progress:68, ratings:860, createdAt:1 }
]
const searchQuery = ref('')
const sortBy = ref<'recent'|'popular'|'progress'>('recent')

const filteredCourses = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  let list = mockCourses.slice()
  if (q) list = list.filter(c => c.title.toLowerCase().includes(q) || c.author.toLowerCase().includes(q))
  if (sortBy.value === 'progress') list.sort((a,b)=>b.progress-a.progress)
  else if (sortBy.value === 'popular') list.sort((a,b)=>b.ratings-a.ratings)
  else list.sort((a,b)=>b.createdAt-a.createdAt)
  return list
})
function addCourse(){ antdMessage.info('Add course (mock)') }
function openCourse(id: string){ antdMessage.info(`Open course ${id}`) }

/** ===== Messages ===== */
const messageSearch = ref('')
const messages = ref([
  { id:'m1', name:'Ronald Richards', avatar:'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop', subject:'Re: Your design question', snippet:'Thanks for your question…', body:'Thank you for asking your doubt, I’ll send you a PDF covering your issues. If you have further questions I can help.', date:'18 Mar 2024', read:false },
  { id:'m2', name:'Devon Lane', avatar:'https://images.unsplash.com/photo-1545996124-1c6f3c6f1f1f?q=80&w=400&auto=format&fit=crop', subject:'Quick follow-up', snippet:'I’ll get back to you…', body:'I’ll get back to you as soon as possible. Thanks for your patience.', date:'18 Mar 2024', read:true }
])
const selectedMessage = ref(messages.value[0] || null)
const replyText = ref('')

const filteredMessages = computed(() => {
  const q = messageSearch.value.trim().toLowerCase()
  return !q ? messages.value : messages.value.filter(m =>
    (m.name + ' ' + m.subject + ' ' + m.snippet).toLowerCase().includes(q)
  )
})
function renderMessageItem(item:any){
  const click = () => selectMessage(item)
  return h('div', { onClick: click }, [
    h('div', { style:'padding:8px;border-radius:8px;cursor:pointer;background:'+(!item.read ? '#e6f4ff' : 'transparent') }, [
      h('div', { style:'display:flex;gap:10px;align-items:center' }, [
        h('img', { src:item.avatar, style:'width:36px;height:36px;border-radius:50%;object-fit:cover' }),
        h('div', null, [
          h('div', { style:'font-weight:600' }, item.name),
          h('div', { style:'color:rgba(0,0,0,.65);font-size:12px' }, item.snippet)
        ]),
        h('div', { style:'margin-left:auto;color:rgba(0,0,0,.45);font-size:12px' }, item.date)
      ])
    ])
  ])
}
function selectMessage(m:any){
  selectedMessage.value = m
  const idx = messages.value.findIndex(x=>x.id===m.id)
  if (idx >= 0) messages.value[idx].read = true
}
function sendReply(){
  if (!replyText.value.trim()) return antdMessage.warning('Please enter a reply')
  antdMessage.success('Reply sent')
  replyText.value = ''
}

/** ===== Persist previously saved form/image if present ===== */
try{
  const saved = localStorage.getItem('profileForm'); if (saved) Object.assign(form, JSON.parse(saved))
  const savedImg = localStorage.getItem('profileImage'); if (savedImg) previewSrc.value = savedImg
}catch(e){}
</script>

<style scoped>
.profile-page { background:#f5f5f5; min-height:100vh; }
.center { display:grid; place-items:center; }
.view-name { font-weight:600; }
</style>
