<template>
  <section class="top-instructors">
    <!-- Header -->
    <div class="header">
      <h3 class="title">Top Instructors</h3>
      <NuxtLink to="/instructors" class="view-all">View All</NuxtLink>
    </div>

    <!-- Instructor Cards -->
    <div class="instructor-grid">
      <div
        v-for="(instructor, index) in instructors"
        :key="index"
        class="instructor-card"
      >
        <div class="card-inner">
          <div class="image-wrap">
            <img :src="instructor.image" alt="" class="image" />
          </div>

          <div class="info">
            <h4 class="name">{{ instructor.name }}</h4>
            <p class="role">{{ instructor.role }}</p>
          </div>

          <div class="divider"></div>

          <div class="stats">
            <div class="rating">
              <div class="star"></div>
              <span class="rating-value">{{ instructor.rating }}</span>
            </div>
            <span class="students">{{ instructor.students }} Students</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const instructors = [
  {
    name: "Ronald Richards",
    role: "UI/UX Designer",
    rating: "4.9",
    students: "2400",
    image: "/instructors/ronald.jpg"
  },
  {
    name: "Theresa Webb",
    role: "Frontend Developer",
    rating: "4.8",
    students: "1800",
    image: "/instructors/theresa.jpg"
  },
  {
    name: "Cody Fisher",
    role: "Digital Marketer",
    rating: "4.7",
    students: "2100",
    image: "/instructors/cody.jpg"
  },
  {
    name: "Darrell Steward",
    role: "Motion Designer",
    rating: "4.9",
    students: "2600",
    image: "/instructors/darrell.jpg"
  },
  {
    name: "Jane Cooper",
    role: "Photographer",
    rating: "4.8",
    students: "1900",
    image: "/instructors/jane.jpg"
  }
]
</script>

<style scoped>
/* ===== Layout ===== */
.top-instructors {

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
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.title {
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: 24px;
  line-height: 140%;
  color: #0f172a;
}

.view-all {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 24px;
  border-radius: 8px;
  font-family: "Inter", sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 160%;
  color: #3b82f6;
  text-decoration: none;
  transition: all 0.2s ease;
}

.view-all:hover {
  background: #3b82f6;
  color: #fff;
}

/* ===== Grid ===== */
.instructor-grid {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  width: 100%;
  flex-wrap: wrap;
}

/* ===== Card ===== */
.instructor-card {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 16px;
  gap: 16px;
  width: 212px;
  height: 281px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  box-shadow: 0px 0px 8px rgba(59, 130, 246, 0.12);
  border-radius: 16px;
  transition: transform 0.25s ease;
}

.instructor-card:hover {
  transform: translateY(-5px);
}

.card-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 180px;
}

/* ===== Image ===== */
.image-wrap {
  width: 177px;
  height: 132px;
  border-radius: 8px;
  overflow: hidden;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ===== Info ===== */
.info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-align: center;
}

.name {
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: 18px;
  line-height: 160%;
  color: #0f172a;
  margin: 0;
}

.role {
  font-family: "Inter", sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 150%;
  color: #334155;
}

/* ===== Divider ===== */
.divider {
  width: 180px;
  border-top: 1px solid #e2e8f0;
}

/* ===== Stats ===== */
.stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 180px;
  height: 20px;
}

.rating {
  display: flex;
  align-items: center;
  gap: 4px;
}

.star {
  width: 16px;
  height: 16px;
  background: #eab308;
  border-radius: 3px;
}

.rating-value {
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: 12px;
  color: #0f172a;
}

.students {
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: 12px;
  color: #334155;
}

/* ===== Responsive ===== */
@media (max-width: 1024px) {
  .instructor-grid {
    justify-content: center;
    gap: 24px;
  }
}

@media (max-width: 768px) {
  .instructor-card {
    width: 45%;
  }
}

@media (max-width: 480px) {
  .instructor-card {
    width: 100%;
  }
}
</style>
