<template>
  <section class="top-courses">
    <!-- Header -->
    <div class="top-courses-header">
      <a-typography-title :level="3" class="section-title">Top Courses</a-typography-title>

      <a-button type="link" size="large" @click="go('/courses')">
        View All
        <RightOutlined />
      </a-button>
    </div>

    <!-- Course Grid -->
    <a-row :gutter="[24, 24]" justify="start" class="courses-grid">
      <a-col
        v-for="(course, i) in courses"
        :key="i"
        :xs="24"
        :sm="12"
        :md="12"
        :lg="6"
      >
        <a-card
          hoverable
          class="course-card"
          :cover="cover(course.image)"
        >
          <template #actions>
            <a-button type="primary" block shape="round">
              Enroll Now
            </a-button>
          </template>

          <a-space direction="vertical" size="small" class="course-content">
            <a-typography-title :level="5" class="course-title">
              {{ course.title }}
            </a-typography-title>

            <a-typography-text type="secondary" class="course-author">
              By {{ course.author }}
            </a-typography-text>

            <div class="rating">
              <a-rate disabled :value="4.5" allow-half />
              <a-typography-text type="secondary" class="rating-text">
                ({{ course.ratingCount }} ratings)
              </a-typography-text>
            </div>

            <a-typography-text class="course-meta">{{ course.details }}</a-typography-text>

            <a-typography-text strong class="course-price">
              {{ course.price }}
            </a-typography-text>
          </a-space>
        </a-card>
      </a-col>
    </a-row>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { RightOutlined } from '@ant-design/icons-vue'
import { h } from 'vue'

const router = useRouter()
const go = (path: string) => router.push(path)

const cover = (src: string) =>
  h('img', {
    alt: 'Course image',
    src,
    style: 'object-fit: cover; height: 180px; width: 100%; border-radius: 12px 12px 0 0;'
  })

const courses = [
  {
    title: "Beginner’s Guide to Design",
    author: "Ronald Richards",
    ratingCount: "1200",
    details: "22 Total Hours. 155 Lectures. Beginner",
    price: "$149.9",
    image: "/courses/design.jpg"
  },
  {
    title: "Advanced Web Development",
    author: "Wade Warren",
    ratingCount: "950",
    details: "30 Hours. 210 Lectures. Intermediate",
    price: "$199.9",
    image: "/courses/webdev.jpg"
  },
  {
    title: "Digital Marketing Essentials",
    author: "Theresa Webb",
    ratingCount: "700",
    details: "18 Hours. 120 Lectures. All Levels",
    price: "$99.9",
    image: "/courses/marketing.jpg"
  },
  {
    title: "Photography Masterclass",
    author: "Cody Fisher",
    ratingCount: "1500",
    details: "25 Hours. 140 Lectures. Beginner",
    price: "$129.9",
    image: "/courses/photo.jpg"
  }
]
</script>

<style scoped>
.top-courses {
  padding: 100px 24px;
  max-width: 1200px;
  margin: 0 auto;
  background: #fff;
}

.top-courses-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 48px;
}

.section-title {
  margin: 0;
}

.course-card {
  border-radius: 12px;
  transition: all 0.3s ease;
}

.course-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(22, 119, 255, 0.12);
}

.course-content {
  text-align: left;
}

.course-title {
  font-weight: 600;
  color: rgba(0, 0, 0, 0.88);
}

.course-author {
  font-size: 14px;
}

.rating {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rating-text {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.45);
}

.course-meta {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
}

.course-price {
  font-size: 18px;
  color: #1677ff;
  margin-top: 8px;
}

/* Responsive */
@media (max-width: 768px) {
  .top-courses {
    padding: 64px 16px;
  }

  .top-courses-header {
    flex-direction: column;
    gap: 12px;
  }

  .course-card {
    margin: 0 auto;
  }
}
</style>
