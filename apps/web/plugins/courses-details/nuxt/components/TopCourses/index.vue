<template>
  <section class="top-courses">
    <!-- Header -->
    <div class="top-courses-header">
      <h3 class="section-title">Top Courses</h3>
      <NuxtLink to="/courses" class="view-all-btn">View All</NuxtLink>
    </div>

    <!-- Course Cards -->
    <div class="courses-grid">
      <div
        v-for="(course, i) in courses"
        :key="i"
        class="course-card"
      >
        <img :src="course.image" alt="" class="course-image" />

        <div class="course-content">
          <h4 class="course-title">{{ course.title }}</h4>
          <p class="course-author">By {{ course.author }}</p>

          <div class="rating">
            <div class="stars">
              <span v-for="s in 5" :key="s" class="star" />
            </div>
            <span class="rating-text">({{ course.ratingCount }} Ratings)</span>
          </div>

          <p class="course-meta">{{ course.details }}</p>
          <p class="course-price">{{ course.price }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
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
/* ===== Layout ===== */
.top-courses {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* ===== Header ===== */
.top-courses-header {
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
  border-radius: 8px;
  font-family: "Inter", sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 160%;
  color: #3b82f6;
  text-decoration: none;
  transition: all 0.2s ease-in-out;
}

.view-all-btn:hover {
  background: #3b82f6;
  color: #fff;
}

/* ===== Courses Grid ===== */
.courses-grid {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  gap: 40px;
  width: 100%;
  flex-wrap: wrap;
}

.course-card {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 298px;
  background: #fff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.12);
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.25s ease;
}

.course-card:hover {
  transform: translateY(-6px);
}

/* ===== Card Image ===== */
.course-image {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 8px 8px 0 0;
}

/* ===== Card Content ===== */
.course-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  padding: 16px;
  width: 100%;
}

.course-title {
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: 18px;
  line-height: 160%;
  color: #0f172a;
  margin: 0;
}

.course-author {
  font-family: "Inter", sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #334155;
  margin: 0;
}

.rating {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  width: 16px;
  height: 16px;
  background-color: #eab308;
  border-radius: 2px;
}

.rating-text {
  font-family: "Inter", sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #334155;
}

.course-meta {
  font-family: "Inter", sans-serif;
  font-size: 14px;
  color: #334155;
  line-height: 150%;
}

.course-price {
  font-family: "Inter", sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: #0f172a;
  margin-top: auto;
}

/* ===== Responsive ===== */
@media (max-width: 1024px) {
  .courses-grid {
    justify-content: center;
    gap: 24px;
  }
}

@media (max-width: 768px) {
  .course-card {
    width: 45%;
  }
}

@media (max-width: 480px) {
  .course-card {
    width: 100%;
  }
}
</style>
