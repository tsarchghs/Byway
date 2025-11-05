<template>
  <section class="stats-section">
    <a-row justify="center" align="middle" :gutter="[48, 48]" class="stats-row">
      <a-col
        v-for="(item, index) in stats"
        :key="index"
        :xs="24"
        :sm="12"
        :md="6"
        class="stat-item"
      >
        <a-card
          :hoverable="true"
          bordered="false"
          class="stat-card"
        >
          <a-space direction="vertical" align="center" size="small">
            <component :is="item.icon" class="stat-icon" />
            <a-statistic
              :value="item.value"
              :precision="0"
              :suffix="item.suffix"
              :value-style="{ color: '#1677ff', fontWeight: 600 }"
            />
            <a-typography-text type="secondary" class="stat-label">
              {{ item.label }}
            </a-typography-text>
          </a-space>
        </a-card>

        <!-- optional divider for desktop -->
        <template v-if="index < stats.length - 1 && windowWidth > 768">
          <a-divider type="vertical" class="stat-divider" />
        </template>
      </a-col>
    </a-row>
  </section>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { BookOutlined, UserOutlined, TeamOutlined, StarOutlined } from '@ant-design/icons-vue'

const stats = [
  { icon: BookOutlined, value: 250, suffix: '+', label: 'Courses by our best mentors' },
  { icon: UserOutlined, value: 1000, suffix: '+', label: 'Students enrolled' },
  { icon: TeamOutlined, value: 15, suffix: '+', label: 'Professional mentors' },
  { icon: StarOutlined, value: 2400, suffix: '+', label: 'Positive reviews' }
]

// ✅ start with a fallback value until mounted
const windowWidth = ref(1200)

const updateWidth = () => {
  if (typeof window !== 'undefined') windowWidth.value = window.innerWidth
}

onMounted(() => {
  updateWidth()
  window.addEventListener('resize', updateWidth)
})
onUnmounted(() => window.removeEventListener('resize', updateWidth))
</script>


<style scoped>
.stats-section {
  background: #fafafa;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  padding: 100px 24px;
  transition: all 0.3s ease;
}

.stats-row {
  max-width: 1200px;
  margin: 0 auto;
}

.stat-card {
  text-align: center;
  background: #fff;
  border-radius: 12px;
  padding: 32px 16px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.stat-icon {
  font-size: 28px;
  color: #1677ff;
}

.stat-label {
  font-size: 15px;
  color: rgba(0, 0, 0, 0.65);
  max-width: 220px;
  display: block;
  margin: 0 auto;
}

.stat-divider {
  height: 80px;
  margin: 0 16px;
  border-color: #f0f0f0;
}

/* Responsive */
@media (max-width: 768px) {
  .stats-section {
    padding: 64px 16px;
  }

  .stat-card {
    padding: 24px 12px;
  }

  .stat-icon {
    font-size: 24px;
  }

  .stat-divider {
    display: none;
  }
}
</style>
