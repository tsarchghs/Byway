<template>
  <section class="top-instructors">
    <!-- Header -->
    <div class="header">
      <a-typography-title :level="3" class="title">Top Instructors</a-typography-title>
      <a-button type="link" size="large" @click="go('/instructors')">
        View All
        <RightOutlined />
      </a-button>
    </div>

    <!-- Instructors Grid -->
    <a-row :gutter="[24, 24]" justify="start" class="instructor-grid">
      <a-col
        v-for="(instructor, index) in instructors"
        :key="index"
        :xs="24"
        :sm="12"
        :md="8"
        :lg="6"
      >
        <a-card hoverable bordered class="instructor-card">
          <a-space direction="vertical" align="center" size="middle" class="card-inner">
            <!-- Avatar -->
            <a-avatar
              :src="instructor.image"
              :size="96"
              shape="circle"
              class="avatar"
            />

            <!-- Info -->
            <div class="info">
              <a-typography-title :level="5" class="name">
                {{ instructor.name }}
              </a-typography-title>
              <a-typography-text type="secondary" class="role">
                {{ instructor.role }}
              </a-typography-text>
            </div>

            <a-divider class="divider" />

            <!-- Stats -->
            <a-space direction="horizontal" size="large" align="center" class="stats">
              <a-space align="center" size="small">
                <a-rate disabled :value="Number(instructor.rating)" allow-half />
                <a-typography-text strong>{{ instructor.rating }}</a-typography-text>
              </a-space>
              <a-typography-text type="secondary">
                {{ instructor.students }} Students
              </a-typography-text>
            </a-space>
          </a-space>
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

const instructors = [
  {
    name: 'Ronald Richards',
    role: 'UI/UX Designer',
    rating: '4.9',
    students: '2400',
    image: '/instructors/ronald.jpg',
  },
  {
    name: 'Theresa Webb',
    role: 'Frontend Developer',
    rating: '4.8',
    students: '1800',
    image: '/instructors/theresa.jpg',
  },
  {
    name: 'Cody Fisher',
    role: 'Digital Marketer',
    rating: '4.7',
    students: '2100',
    image: '/instructors/cody.jpg',
  },
  {
    name: 'Darrell Steward',
    role: 'Motion Designer',
    rating: '4.9',
    students: '2600',
    image: '/instructors/darrell.jpg',
  },
  {
    name: 'Jane Cooper',
    role: 'Photographer',
    rating: '4.8',
    students: '1900',
    image: '/instructors/jane.jpg',
  },
]
</script>

<style scoped>
.top-instructors {
  padding: 100px 24px;
  background: #fff;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 48px;
}

.title {
  margin: 0;
}

.instructor-card {
  text-align: center;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.instructor-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(22, 119, 255, 0.12);
}

.avatar {
  box-shadow: 0 2px 8px rgba(22, 119, 255, 0.1);
  transition: transform 0.3s ease;
}

.instructor-card:hover .avatar {
  transform: scale(1.05);
}

.info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.name {
  font-weight: 600;
  color: rgba(0, 0, 0, 0.88);
}

.role {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
}

.stats {
  justify-content: center;
}

.divider {
  margin: 8px 0;
  border-color: #f0f0f0;
}

/* Responsive */
@media (max-width: 768px) {
  .top-instructors {
    padding: 64px 16px;
  }

  .header {
    flex-direction: column;
    gap: 12px;
  }

  .name {
    font-size: 16px;
  }

  .role {
    font-size: 13px;
  }
}
</style>
