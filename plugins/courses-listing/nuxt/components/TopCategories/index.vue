<template>
  <section class="top-categories">
    <!-- Header -->
    <div class="top-categories-header">
      <h3 class="section-title">Top Categories</h3>
      <NuxtLink to="/categories" class="view-all-btn">View All</NuxtLink>
    </div>

    <!-- Category Cards -->
    <div class="categories-grid">
      <div
        v-for="(category, index) in categories"
        :key="index"
        class="category-card"
      >
        <div class="icon-wrapper">
          <div class="icon-circle">
            <img :src="category.icon" alt="" class="icon-image" />
          </div>
        </div>
        <h4 class="category-title">{{ category.title }}</h4>
        <p class="category-courses">{{ category.courses }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const categories = [
  {
    title: 'Astrology',
    courses: '11 Courses',
    icon: '/icons/telescope.svg'
  },
  {
    title: 'Programming',
    courses: '15 Courses',
    icon: '/icons/code-browser.svg'
  },
  {
    title: 'Business',
    courses: '8 Courses',
    icon: '/icons/briefcase.svg'
  },
  {
    title: 'Physics',
    courses: '6 Courses',
    icon: '/icons/atom.svg'
  }
]
</script>

<style scoped>
/* ==== Layout ==== */
.top-categories {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* ==== Header ==== */
.top-categories-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.section-title {
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: 24px;
  line-height: 140%;
  color: #0f172a;
}

.view-all-btn {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 10px 24px;
  gap: 6px;
  border-radius: 8px;
  font-family: "Inter", sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 160%;
  color: #3b82f6;
  text-decoration: none;
  border: 1px solid transparent;
  transition: all 0.2s ease-in-out;
}

.view-all-btn:hover {
  background: #3b82f6;
  color: #fff;
}

/* ==== Category Grid ==== */
.categories-grid {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 41px;
  width: 100%;
  flex-wrap: wrap;
}

.category-card {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  width: 286px;
  height: 224px;
  background: #fff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.12);
  border-radius: 16px;
  transition: transform 0.25s ease;
}

.category-card:hover {
  transform: translateY(-6px);
}

/* ==== Icon & Text ==== */
.icon-wrapper {
  position: relative;
  width: 100px;
  height: 100px;
  margin-bottom: 16px;
}

.icon-circle {
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 100px;
  background: #e0f2fe;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon-image {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.category-title {
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: 20px;
  line-height: 150%;
  color: #0f172a;
  margin: 0;
  text-align: center;
}

.category-courses {
  font-family: "Inter", sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 160%;
  color: #334155;
  text-align: center;
  margin: 4px 0 0;
}

/* ==== Responsive ==== */
@media (max-width: 1024px) {
  .categories-grid {
    justify-content: center;
    gap: 24px;
  }
}

@media (max-width: 768px) {
  .category-card {
    width: 45%;
    height: auto;
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .category-card {
    width: 100%;
  }
}
</style>
