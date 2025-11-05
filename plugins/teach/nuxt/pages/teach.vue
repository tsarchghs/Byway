<template>
  <Header/>
  <a-layout-content class="teach-page">
    <div class="teach-container">
      <!-- HERO -->
      <section class="hero">
        <a-row align="middle" justify="space-between" gutter="48">
          <a-col :xs="24" :md="12">
            <a-typography-title :level="1">
              Share Your Knowledge.<br />
              Inspire Learners Worldwide.
            </a-typography-title>
            <a-typography-paragraph type="secondary">
              Join thousands of instructors who use Byway to teach what they love,
              reach a global audience, and make an impact.
            </a-typography-paragraph>
            <a-button type="primary" size="large" @click="scrollToForm">
              Start Teaching Today
            </a-button>
          </a-col>

          <a-col :xs="0" :md="12">
            <img
              src="/images/teach-hero.png"
              alt="Instructor teaching illustration"
              class="hero-image"
            />
          </a-col>
        </a-row>
      </section>

      <!-- WHY TEACH ON BYWAY -->
      <section class="benefits">
        <a-typography-title :level="2" class="section-title">
          Why Teach on Byway
        </a-typography-title>

        <a-row gutter="[24, 24]" justify="center">
          <a-col v-for="(benefit, i) in benefits" :key="i" :xs="24" :sm="12" :md="6">
            <a-card hoverable class="benefit-card">
              <template #cover>
                <component :is="benefit.icon" class="benefit-icon" />
              </template>
              <a-card-meta :title="benefit.title" :description="benefit.text" />
            </a-card>
          </a-col>
        </a-row>
      </section>

      <!-- HOW IT WORKS -->
      <section class="how-it-works">
        <a-typography-title :level="2" class="section-title">
          How It Works
        </a-typography-title>
        <a-steps :current="0" direction="horizontal" class="steps">
          <a-step
            v-for="(step, i) in steps"
            :key="i"
            :title="step.title"
            :description="step.desc"
            :icon="h(step.icon)"
          />
        </a-steps>
      </section>

      <!-- TEACH FORM -->
      <section ref="formSection" class="signup-form">
        <a-card bordered class="form-card">
          <a-typography-title :level="3">Become an Instructor</a-typography-title>
          <a-form layout="vertical" @finish="onSubmit" :model="formData">
            <a-form-item label="Full Name" name="name" required>
              <a-input v-model:value="formData.name" placeholder="Your full name" />
            </a-form-item>

            <a-form-item label="Email Address" name="email" required>
              <a-input type="email" v-model:value="formData.email" placeholder="you@example.com" />
            </a-form-item>

            <a-form-item label="Area of Expertise" name="expertise" required>
              <a-input v-model:value="formData.expertise" placeholder="e.g. Design, Programming" />
            </a-form-item>

            <a-form-item label="Tell us about yourself">
              <a-textarea v-model:value="formData.bio" rows="3" placeholder="Brief bio..." />
            </a-form-item>

            <a-button type="primary" html-type="submit" block>Submit</a-button>
          </a-form>
        </a-card>
      </section>
    </div>
  </a-layout-content>
</template>

<script setup lang="ts">
import Header from '../../../../packages/shared-ui/src/components/Header.vue'
import { ref, h, onMounted } from 'vue'
import {
  BookOutlined,
  DollarOutlined,
  GlobalOutlined,
  ToolOutlined,
  EditOutlined,
  UploadOutlined,
  UserOutlined,
  TrophyOutlined,
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

const benefits = [
  {
    title: 'Global Reach',
    text: 'Share your expertise with learners from over 100 countries.',
    icon: GlobalOutlined,
  },
  {
    title: 'Flexible Schedule',
    text: 'Create and publish courses at your own pace.',
    icon: BookOutlined,
  },
  {
    title: 'Earn Revenue',
    text: 'Get rewarded every time a learner enrolls in your course.',
    icon: DollarOutlined,
  },
  {
    title: 'Tools & Support',
    text: 'Access resources and analytics to grow your audience.',
    icon: ToolOutlined,
  },
]

const steps = [
  { title: 'Create Your Course', desc: 'Plan and record your lessons.', icon: EditOutlined },
  { title: 'Upload Content', desc: 'Add materials, quizzes, and videos.', icon: UploadOutlined },
  { title: 'Engage Learners', desc: 'Build your community of students.', icon: UserOutlined },
  { title: 'Earn & Grow', desc: 'Receive income and track progress.', icon: TrophyOutlined },
]

const formData = ref({
  name: '',
  email: '',
  expertise: '',
  bio: '',
})

const onSubmit = () => {
  message.success('Thanks for applying! We’ll get in touch soon.')
  formData.value = { name: '', email: '', expertise: '', bio: '' }
}

const formSection = ref<HTMLElement | null>(null)
const scrollToForm = () => formSection.value?.scrollIntoView({ behavior: 'smooth' })
</script>

<style scoped>
.teach-page {
  background: #fafafa;
  padding: 80px 24px;
  display: flex;
  justify-content: center;
}

.teach-container {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 80px;
}

/* HERO */
.hero {
  display: flex;
  align-items: center;
}

.hero-image {
  width: 100%;
  border-radius: 12px;
}

/* BENEFITS */
.benefits .section-title {
  text-align: center;
  margin-bottom: 32px;
}

.benefit-card {
  text-align: center;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.benefit-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(22, 119, 255, 0.1);
}

.benefit-icon {
  font-size: 40px;
  color: #1677ff;
  margin: 24px auto;
}

/* HOW IT WORKS */
.how-it-works .section-title {
  text-align: center;
  margin-bottom: 32px;
}

.steps {
  margin: 0 auto;
  max-width: 900px;
}

/* SIGNUP FORM */
.signup-form {
  display: flex;
  justify-content: center;
}

.form-card {
  width: 100%;
  max-width: 600px;
  border-radius: 12px;
}

@media (max-width: 768px) {
  .teach-page {
    padding: 64px 16px;
  }
  .teach-container {
    gap: 64px;
  }
}
</style>
