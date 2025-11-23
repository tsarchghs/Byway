<template>
  <Header />

  <div class="author-page">
    <main class="author-main">
      <!-- ===== Header / Meta ===== -->
      <a-card :bordered="false" class="author-header-card">
        <div class="author-header">
          <div class="author-meta">
            <a-typography-text type="secondary" class="role">Instructor</a-typography-text>
            <a-typography-title :level="2" class="name">{{ author.name }}</a-typography-title>
            <a-typography-paragraph class="subtitle">{{ author.title }}</a-typography-paragraph>

            <a-space :size="24" wrap class="stats-row">
              <a-statistic title="Total Students" :value="author.students" />
              <a-statistic title="Reviews" :value="author.reviews" />
              <a-statistic title="Courses" :value="author.courses.length" />
              <!-- plugin mount point -->
              <slot name="stats-extra" :author="author" />
            </a-space>

            <a-space class="actions" :size="12" wrap>
              <a-button
                :type="isFollowing ? 'primary' : 'default'"
                :ghost="!isFollowing"
                @click="toggleFollow"
                :icon="h(isFollowing ? CheckOutlined : UserAddOutlined)"
              >
                {{ isFollowing ? 'Following' : 'Follow' }}
              </a-button>

              <a-button @click="openMessage = true" :icon="h(MailOutlined)">Message</a-button>

              <a-dropdown>
                <a-button :icon="h(ShareAltOutlined)">Share</a-button>
                <template #overlay>
                  <a-menu>
                    <a-menu-item key="link" @click="copyProfileLink">Copy profile link</a-menu-item>
                    <a-menu-item key="tweet">Share on X (Twitter)</a-menu-item>
                    <a-menu-item key="linkedin">Share on LinkedIn</a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>

              <!-- plugin mount point -->
              <slot name="header-actions" :author="author" />
            </a-space>
          </div>

          <div class="author-avatar">
            <a-avatar :size="160" :src="author.avatar" />
          </div>
        </div>
      </a-card>

      <!-- ===== About ===== -->
      <a-card :bordered="true">
        <a-typography-title :level="4">About {{ author.firstName }}</a-typography-title>

        <a-typography-paragraph v-if="!bioExpanded" v-html="shortBio" class="bio" />
        <a-typography-paragraph v-else v-html="author.bio" class="bio-full" />

        <a-button type="link" @click="bioExpanded = !bioExpanded">
          {{ bioExpanded ? 'Show less' : 'Read more' }}
        </a-button>
      </a-card>

      <!-- ===== Expertise / Tags ===== -->
      <a-card :bordered="true">
        <a-typography-title :level="4">Areas of Expertise</a-typography-title>
        <a-space :size="[8, 8]" wrap>
          <a-checkable-tag
            v-for="(tag,i) in author.expertise"
            :key="i"
            :checked="activeTags.has(tag)"
            @change="onToggleTag(tag)"
          >
            {{ tag }}
          </a-checkable-tag>
        </a-space>
      </a-card>

      <!-- ===== Courses ===== -->
      <a-card :bordered="true">
        <div class="courses-header">
          <a-typography-title :level="4" style="margin: 0">
            More Courses by {{ author.firstName }}
          </a-typography-title>

          <a-space :size="12" wrap class="toolbar">
            <a-segmented
              v-model:value="levelFilter"
              :options="['All','Beginner','Intermediate','Advanced']"
            />
            <a-select v-model:value="sortBy" style="width: 180px">
              <a-select-option value="popular">Most Popular</a-select-option>
              <a-select-option value="hoursAsc">Shortest Duration</a-select-option>
              <a-select-option value="hoursDesc">Longest Duration</a-select-option>
              <a-select-option value="titleAsc">Title A–Z</a-select-option>
            </a-select>
            <slot name="courses-toolbar-right" :author="author" />
          </a-space>
        </div>

        <a-row :gutter="[16,16]" style="margin-top: 12px">
          <a-col
            v-for="c in pagedCourses"
            :key="c.id"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="8"
            :xl="6"
          >
            <a-card
              hoverable
              class="course-card"
              @click="openCourse(c)"
              :cover="h('img', { alt: c.title, src: c.image })"
            >
              <a-card-meta :title="c.title" :description="`By ${author.name} • ${c.level} • ${c.hours}h`" />
            </a-card>
          </a-col>
        </a-row>

        <div class="course-actions">
          <a-pagination
            v-if="filteredCourses.length > pageSize"
            v-model:current="page"
            :total="filteredCourses.length"
            :pageSize="pageSize"
            show-less-items
          />
        </div>
      </a-card>
    </main>

    <!-- ===== Message Drawer ===== -->
    <a-drawer v-model:open="openMessage" title="Message the instructor" width="420">
      <a-form layout="vertical" @finish="sendMessage">
        <a-form-item name="subject" label="Subject" :rules="[{ required: true, message: 'Please enter a subject' }]">
          <a-input v-model:value="messageForm.subject" placeholder="Subject" />
        </a-form-item>
        <a-form-item
          name="body"
          label="Message"
          :rules="[{ required: true, message: 'Please write a message' }]"
        >
          <a-textarea v-model:value="messageForm.body" :rows="6" placeholder="Write your message…" />
        </a-form-item>
        <a-space>
          <a-button @click="openMessage = false">Cancel</a-button>
          <a-button type="primary" html-type="submit">Send</a-button>
        </a-space>
      </a-form>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { h, ref, reactive, computed } from 'vue'
import Header from '../../../../packages/shared-ui/src/components/Header.vue'

// icons
import {
  UserAddOutlined,
  CheckOutlined,
  MailOutlined,
  ShareAltOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

// ===== Types =====
type CourseCard = { id: string; title: string; image: string; level: 'Beginner'|'Intermediate'|'Advanced'; hours: number }

// ===== Data =====
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
    { id: 'c3', title: `Design Systems in Practice`, image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop', level: 'Advanced', hours: 30 },
    { id: 'c4', title: `Practical Usability Testing`, image: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=800&auto=format&fit=crop', level: 'Intermediate', hours: 14 },
    { id: 'c5', title: `Wireframing to Prototyping`, image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=800&auto=format&fit=crop', level: 'Beginner', hours: 10 },
  ] as CourseCard[]
})

const isFollowing = ref(false)
const bioExpanded = ref(false)
const activeTags = reactive(new Set<string>())

const levelFilter = ref<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All')
const sortBy = ref<'popular'|'hoursAsc'|'hoursDesc'|'titleAsc'>('popular')

const page = ref(1)
const pageSize = 8

// ===== Computed =====
const shortBio = computed(() => {
  const txt = author.bio.replace(/<[^>]+>/g, '')
  return txt.length > 200 ? txt.slice(0, 200) + '…' : txt
})

const filteredCourses = computed(() => {
  let list = [...author.courses]
  // level filter
  if (levelFilter.value !== 'All') list = list.filter(c => c.level === levelFilter.value)

  // tag filter heuristic: if any active tag words appear in title, keep
  if (activeTags.size) {
    const words = Array.from(activeTags).map(t => t.toLowerCase())
    list = list.filter(c => words.some(w => c.title.toLowerCase().includes(w)))
  }

  // sort
  switch (sortBy.value) {
    case 'hoursAsc': list.sort((a,b) => a.hours - b.hours); break
    case 'hoursDesc': list.sort((a,b) => b.hours - a.hours); break
    case 'titleAsc': list.sort((a,b) => a.title.localeCompare(b.title)); break
    default: /* popular */ break
  }
  return list
})

const pagedCourses = computed(() => {
  const start = (page.value - 1) * pageSize
  return filteredCourses.value.slice(start, start + pageSize)
})

// ===== Message Drawer =====
const openMessage = ref(false)
const messageForm = reactive({ subject: '', body: '' })

function sendMessage() {
  // mock send
  openMessage.value = false
  messageForm.subject = ''
  messageForm.body = ''
  message.success('Message sent!')
}

// ===== Actions =====
function toggleFollow() {
  isFollowing.value = !isFollowing.value
  message.success(isFollowing.value ? 'You are now following this instructor' : 'Unfollowed')
}

function copyProfileLink() {
  navigator.clipboard?.writeText(window.location.href)
  message.success('Profile link copied')
}

function onToggleTag(tag: string) {
  if (activeTags.has(tag)) activeTags.delete(tag)
  else activeTags.add(tag)
  page.value = 1
}

function openCourse(c: CourseCard) {
  // replace with navigateTo in Nuxt or router push
  message.info(`Open course: ${c.title}`)
}
</script>

<style scoped>
.author-page {
  background: #fff;
  padding: 24px 16px 40px;
}
.author-main {
  max-width: 1180px;
  margin: 0 auto;
  display: grid;
  gap: 16px;
}

/* header */
.author-header-card { }
.author-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}
.author-meta {
  display: grid;
  gap: 8px;
  min-width: 260px;
}
.role { text-transform: uppercase; letter-spacing: .4px; }
.subtitle { color: rgba(0,0,0,.65); margin: 0; }
.stats-row { margin-top: 8px; }
.actions { margin-top: 8px; }
.author-avatar { display: grid; place-items: center; }

/* courses */
.courses-header {
  display: flex; justify-content: space-between; gap: 12px; align-items: center; flex-wrap: wrap;
}
.toolbar { margin-left: auto; }
.course-card :deep(.ant-card-meta-title) { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.course-actions { margin-top: 12px; text-align: center; }

/* responsive */
@media (max-width: 768px) {
  .author-page { padding: 16px 12px 28px; }
  .author-header { flex-direction: column; align-items: flex-start; }
}
</style>
