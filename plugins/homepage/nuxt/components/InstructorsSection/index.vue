<template>
  <section class="instructors-section">
    <a-row
      v-for="(block, index) in blocks"
      :key="index"
      :gutter="[48, 48]"
      class="instructor-block"
      :class="{ reverse: index % 2 === 0 }"
      align="middle"
      justify="space-between"
    >
      <!-- Image -->
      <a-col :xs="24" :md="12" class="instructor-image">
        <a-card hoverable :bordered="false" class="image-card">
          <img :src="block.image" :alt="block.title" class="instructor-img" />
        </a-card>
      </a-col>

      <!-- Content -->
      <a-col :xs="24" :md="12" class="instructor-content">
        <a-space direction="vertical" size="middle">
          <a-typography-title :level="3">{{ block.title }}</a-typography-title>
          <a-typography-paragraph class="instructor-text">
            {{ block.text }}
          </a-typography-paragraph>

          <a-button
            type="primary"
            size="large"
            shape="round"
            @click="go(block.ctaLink)"
          >
            {{ block.ctaLabel }}
            <RightOutlined />
          </a-button>
        </a-space>
      </a-col>
    </a-row>
  </section>
</template>

<script setup lang="ts">
import { RightOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const go = (link: string) => router.push(link)

const blocks = [
  {
    title: 'Become an Instructor',
    text: 'Instructors from around the world teach millions of students on Byway. We provide the tools and skills to teach what you love.',
    image: 'image1.png',
    ctaLabel: 'Start Teaching Today',
    ctaLink: '/teach'
  },
  {
    title: 'Transform your life through education',
    text: 'Learners around the world are launching new careers, advancing in their fields, and enriching their lives through Byway courses.',
    image: 'image2.png',
    ctaLabel: 'Start Learning',
    ctaLink: '/courses'
  }
]
</script>

<style scoped>
.instructors-section {
  background: #fff;
  padding: 100px 24px;
  border-top: 1px solid #f0f0f0;
}

.instructor-block {
  max-width: 1200px;
  margin: 0 auto 80px;
}

.instructor-block.reverse {
  flex-direction: row-reverse;
}

.image-card {
  overflow: hidden;
  border-radius: 12px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.image-card:hover {
  transform: scale(1.03);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.instructor-img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 12px;
}

.instructor-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.instructor-text {
  color: rgba(0, 0, 0, 0.65);
  font-size: 16px;
  max-width: 500px;
}

@media (max-width: 768px) {
  .instructors-section {
    padding: 64px 16px;
  }
  .instructor-block {
    flex-direction: column;
    text-align: center;
  }
  .instructor-content {
    align-items: center;
  }
  .instructor-text {
    max-width: 90%;
  }
}
</style>
