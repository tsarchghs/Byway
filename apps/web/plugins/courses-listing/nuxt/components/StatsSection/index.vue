<template>
  <section class="stats-section">
    <div
      v-for="(item, i) in stats"
      :key="i"
      class="stat-item"
    >
      <h2 class="stat-value">{{ item.value }}</h2>
      <p class="stat-label">{{ item.label }}</p>
      <!-- vertical divider except after last -->
      <div v-if="i < stats.length - 1" class="divider"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
const stats = [
  { value: '250+', label: 'Courses by our best mentors' },
  { value: '1000+', label: 'Students enrolled' },
  { value: '15+', label: 'Professional mentors' },
  { value: '2400+', label: 'Positive reviews' }
]
</script>

<style scoped>
.stats-section {
    margin-top: 200px;
}
.stats-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40px 80px;
  gap: 80px;
  background: #f8fafc;
  flex-wrap: wrap;
}

.stat-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  width: 192px;
  height: 69px;
  flex: none;
}

.stat-value {
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: 32px;
  line-height: 130%;
  color: #0f172a;
  margin: 0;
}

.stat-label {
  font-family: "Inter", sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 150%;
  color: #0f172a;
  text-align: center;
  margin: 0;
}

/* vertical divider between stats */
.divider {
  position: absolute;
  right: -40px;
  top: 50%;
  transform: translateY(-50%) rotate(90deg);
  width: 55px;
  border: 4px solid #e2e8f0;
}

/* responsive adjustments */
@media (max-width: 1024px) {
  .stats-section {
    gap: 40px;
    padding: 40px;
  }
}

@media (max-width: 768px) {
  .stats-section {
    flex-direction: column;
    gap: 32px;
  }
  .divider {
    display: none;
  }
}
</style>
