<template>
  <section class="top-categories">
    <!-- Header -->
    <div class="top-categories-header">
      <a-typography-title :level="3" class="section-title">Top Categories</a-typography-title>

      <a-button type="link" size="large" class="view-all-btn" @click="go('/categories')">
        View All
        <RightOutlined />
      </a-button>
    </div>

    <!-- Categories Grid -->
    <a-row :gutter="[24, 24]" class="categories-grid">
      <a-col
        v-for="(category, index) in categories"
        :key="index"
        :xs="24"
        :sm="12"
        :md="6"
      >
        <a-card
          hoverable
          bordered
          class="category-card"
        >
          <div class="icon-wrapper">
            <div class="icon-circle">
              <img :src="category.icon" :alt="category.title" class="icon-image" />
            </div>
          </div>

          <a-typography-title :level="5" class="category-title">
            {{ category.title }}
          </a-typography-title>

          <a-typography-text type="secondary" class="category-courses">
            {{ category.courses }}
          </a-typography-text>
        </a-card>
      </a-col>
    </a-row>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { RightOutlined } from '@ant-design/icons-vue'

const router = useRouter()
const go = (path: string) => router.push(path)

const categories = [
  { title: 'Astrology', courses: '11 Courses', icon: '/icons/telescope.svg' },
  { title: 'Programming', courses: '15 Courses', icon: '/icons/code-browser.svg' },
  { title: 'Business', courses: '8 Courses', icon: '/icons/briefcase.svg' },
  { title: 'Physics', courses: '6 Courses', icon: '/icons/atom.svg' },
]
</script>

<style scoped>
.top-categories {
  padding: 100px 24px;
  background: #fff;
  max-width: 1200px;
  margin: 0 auto;
}

.top-categories-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 48px;
}

.section-title {
  margin: 0;
  color: rgba(0, 0, 0, 0.88);
}

.view-all-btn {
  font-weight: 500;
  color: #1677ff;
}

.view-all-btn:hover {
  background-color: #e6f4ff;
  border-radius: 8px;
}

/* Category Cards */
.category-card {
  text-align: center;
  border-radius: 12px;
  transition: all 0.3s ease;
  padding: 24px 16px;
}

.category-card:hover {
  transform: translateY(-4px);
  border-color: #91caff;
  box-shadow: 0 8px 20px rgba(22, 119, 255, 0.15);
}

/* Icons */
.icon-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.icon-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #e6f4ff;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background 0.3s ease;
}

.category-card:hover .icon-circle {
  background: #bae0ff;
}

.icon-image {
  width: 36px;
  height: 36px;
  object-fit: contain;
}

/* Text */
.category-title {
  font-weight: 600;
  margin-top: 12px;
  color: rgba(0, 0, 0, 0.88);
}

.category-courses {
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
}

/* Responsive */
@media (max-width: 768px) {
  .top-categories {
    padding: 64px 16px;
  }

  .top-categories-header {
    flex-direction: column;
    gap: 12px;
  }

  .section-title {
    font-size: 22px;
  }

  .icon-circle {
    width: 70px;
    height: 70px;
  }
}
</style>
