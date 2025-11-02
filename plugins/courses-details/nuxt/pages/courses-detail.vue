<template>
  <Header/>
  <section class="course-hero">
    <!-- Breadcrumb -->
    <nav class="breadcrumb">
      <span>Home</span>
      <span class="divider">›</span>
      <span>Categories</span>
      <span class="divider">›</span>
      <span class="active">Introduction to User Experience Design</span>
    </nav>

    <!-- Content Row -->
    <div class="hero-row">
      <!-- Left: Intro text -->
      <div class="intro">
        <h1>Introduction to User Experience Design</h1>
        <p class="subtitle">
          This course is meticulously crafted to provide you with a foundational understanding of the
          principles, methodologies, and tools that drive exceptional user experiences in the digital
          landscape.
        </p>

        <div class="meta">
          <div class="rating">
            <span class="stars">★★★★★</span>
            <span>4.8 (22 000 ratings)</span>
          </div>
          <div class="divider"></div>
          <span>22 Total Hours · 155 Lectures · All levels</span>
        </div>

        <div class="author">
          <img src="/instructor.jpg" alt="Instructor" />
          <span>Created by <strong>Ronald Richards</strong></span>
        </div>

        <div class="languages">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="#334155" stroke-width="2" fill="none" />
          </svg>
          <span>English, Spanish, Italian, German</span>
        </div>
      </div>

      <!-- Right: Sidebar card -->
      <aside class="sidebar">
        <img class="thumb" src="/course-thumb.jpg" alt="Course thumbnail" />
        <div class="price-box">
          <div class="price-row">
            <span class="price">$49.5</span>
            <span class="old-price">$99.5</span>
            <span class="discount">50% Off</span>
          </div>
        </div>
        <button class="add">Add To Cart</button>
        <button class="buy">Buy Now</button>
        <div class="share">
          <span>Share</span>
          <div class="icons">
            <img src="/fb.svg" alt="fb" />
            <img src="/google.svg" alt="google" />
            <img src="/link.svg" alt="link" />
          </div>
        </div>
      </aside>
    </div>
  </section>
    <section class="course-details">
    <!-- Tabs -->
    <div class="tabs">
      <button
        v-for="(tab, i) in tabs"
        :key="i"
        :class="['tab', { active: activeTab === i }]"
        @click="activeTab = i"
      >
        {{ tab }}
      </button>
    </div>

    <hr class="divider" />

    <!-- Dynamic Tab Content -->
    <div v-if="activeTab === 0" class="tab-content details">
      <div class="description-block">
        <h4>Course Description</h4>
        <p>
          This interactive e-learning course introduces you to User Experience
          (UX) design. Gain a solid foundation in UX principles and apply them
          through interactive exercises.
        </p>
      </div>

      <div class="description-block">
        <h4>Certification</h4>
        <p>
          Upon successful completion, you’ll receive a certification that
          validates your expertise and opens new opportunities.
        </p>
      </div>

      <div class="instructor-block">
        <h4>Instructor</h4>
        <div class="instructor-card">
          <img src="/instructor.png" alt="Instructor" class="instructor-photo" />
          <div class="instructor-info">
            <h5 class="name">Ronald Richards</h5>
            <p class="title">UI/UX Designer</p>
            <div class="meta">
              <span>⭐ 40,445 Reviews</span>
              <span>🎓 500 Students</span>
              <span>📘 15 Courses</span>
            </div>
          </div>
        </div>
        <p class="bio">
          With over a decade of experience, Ronald brings a wealth of knowledge
          and has designed user-centric interfaces for renowned tech companies.
        </p>
      </div>

      <div class="syllabus-block">
        <h4>Syllabus</h4>
        <div class="syllabus">
          <div
            class="course"
            v-for="(lesson, index) in syllabus"
            :key="index"
          >
            <div class="lesson-info">
              <span class="lesson-title">{{ lesson.title }}</span>
              <div class="lesson-meta">
                <span>{{ lesson.lessons }} Lessons</span>
                <span>{{ lesson.duration }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="reviews-block">
        <h4>Learner Reviews</h4>

        <div class="reviews">
          <div
            class="review"
            v-for="(review, index) in reviews"
            :key="index"
          >
            <div class="review-header">
              <img :src="review.avatar" alt="User" class="review-avatar" />
              <div class="review-info">
                <h5>{{ review.name }}</h5>
                <div class="rating">
                  <span>⭐ {{ review.rating }}</span>
                  <small>{{ review.date }}</small>
                </div>
              </div>
            </div>
            <p class="review-text">{{ review.comment }}</p>
          </div>
        </div>

        <button class="more-reviews">Load More Reviews</button>
      </div>
    </div>
  </section>
</template>


<style scoped>
.course-hero {
  background: #f8fafc;
  border-radius: 16px;
  padding: 2.5rem;
  border: 1px solid #e2e8f0;
}

/* ─── Breadcrumb ───────────────────────────── */
.breadcrumb {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.4rem;
  font-size: 14px;
  color: #64748b;
  margin-bottom: 2rem;
}
.breadcrumb .divider {
  color: #94a3b8;
}
.breadcrumb .active {
  color: #2563eb;
  font-weight: 500;
}

/* ─── Layout Row ───────────────────────────── */
.hero-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 3rem;
  flex-wrap: wrap;
}

/* Left column */
.intro {
  flex: 1 1 60%;
  min-width: 320px;
}
.intro h1 {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 40px;
  line-height: 1.4;
  letter-spacing: -0.02em;
  color: #0f172a;
  margin-bottom: 1rem;
}
.subtitle {
  font-size: 16px;
  line-height: 1.6;
  color: #334155;
  margin-bottom: 1.25rem;
  max-width: 720px;
}
.meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  color: #334155;
  font-size: 14px;
  margin-bottom: 1rem;
}
.meta .divider {
  width: 1px;
  height: 16px;
  background: #cbd5e1;
}
.rating .stars {
  color: #fec84b;
  font-weight: 600;
  margin-right: 0.25rem;
}
.author {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 14px;
  color: #334155;
  margin-bottom: 0.75rem;
}
.author img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}
.author strong {
  color: #2563eb;
}
.languages {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: #334155;
  font-size: 14px;
}
.icon {
  width: 20px;
  height: 20px;
}

/* ─── Sidebar card ─────────────────────────── */
.sidebar {
  flex: 0 0 360px;
  background: #fff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.12);
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
}
.thumb {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1.25rem;
}
.price-box {
  margin-bottom: 1.25rem;
}
.price-row {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}
.price {
  font-weight: 600;
  font-size: 24px;
  color: #0f172a;
}
.old-price {
  position: relative;
  font-size: 18px;
  color: #0f172a;
  opacity: 0.3;
}
.old-price::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 1px;
  background: #94a3b8;
  transform: translateY(-50%);
}
.discount {
  font-size: 20px;
  color: #16a34a;
  font-weight: 600;
}
.add,
.buy {
  display: block;
  width: 100%;
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 0.6rem;
  transition: all 0.2s ease;
}
.add {
  background: #020617;
  color: #fff;
  border: none;
}
.add:hover {
  background: #1e293b;
}
.buy {
  background: #fff;
  color: #0f172a;
  border: 1px solid #020617;
}
.buy:hover {
  background: #0f172a;
  color: #fff;
}
.share {
  border-top: 1px solid #e2e8f0;
  margin-top: 1.5rem;
  padding-top: 1rem;
  text-align: left;
}
.share span {
  font-weight: 500;
  color: #0f172a;
  display: block;
  margin-bottom: 0.5rem;
}
.icons {
  display: flex;
  gap: 0.75rem;
}
.icons img {
  width: 28px;
  height: 28px;
  opacity: 0.85;
  transition: opacity 0.2s;
}
.icons img:hover {
  opacity: 1;
}

/* ─── Responsive ───────────────────────────── */
@media (max-width: 1024px) {
  .hero-row {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
    max-width: none;
    order: 2;
  }
  .intro {
    order: 1;
  }
}
@media (max-width: 768px) {
  .course-hero {
    padding: 1.5rem;
  }
  .intro h1 {
    font-size: 1.8rem;
  }
  .subtitle {
    font-size: 15px;
  }
}
@media (max-width: 480px) {
  .intro h1 {
    font-size: 1.5rem;
  }
  .sidebar {
    padding: 1rem;
  }
}
.course-details {
  background: #fff;
  padding: 40px 5%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

/* Tabs */
.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 20px;
}

.tab {
  padding: 14px 22px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  font-family: "Inter", sans-serif;
  font-size: 14px;
  transition: all 0.2s ease;
}

.tab.active {
  background: #eff6ff;
  border-color: #2563eb;
  color: #2563eb;
}

/* Section Dividers */
.divider {
  border: 1px solid #e2e8f0;
  margin: 16px 0 24px;
}

/* Description */
.description-block {
  margin-bottom: 32px;
}
.description-block h4 {
  font-size: 20px;
  color: #0f172a;
  margin-bottom: 8px;
}
.description-block p {
  font-size: 16px;
  color: #334155;
  line-height: 1.6;
}

/* Instructor */
.instructor-block {
  margin-bottom: 40px;
}
.instructor-card {
  display: flex;
  align-items: center;
  gap: 16px;
}
.instructor-photo {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #cbd5e1;
  object-fit: cover;
}
.instructor-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.instructor-info .name {
  color: #2563eb;
  font-weight: 600;
}
.instructor-info .meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  color: #0f172a;
  font-size: 14px;
}

/* Syllabus */
.syllabus-block {
  margin-bottom: 40px;
}
.syllabus {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}
.course {
  padding: 16px 24px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.lesson-title {
  font-weight: 600;
  color: #0f172a;
  font-size: 16px;
}
.lesson-meta {
  color: #334155;
  font-size: 14px;
  display: flex;
  gap: 12px;
}

/* Reviews */
.reviews-block {
  margin-bottom: 60px;
}
.review {
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
}
.review-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.review-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #cbd5e1;
}
.review-info h5 {
  margin: 0;
  color: #0f172a;
}
.rating {
  color: #334155;
  font-size: 14px;
}
.review-text {
  font-size: 16px;
  color: #334155;
  line-height: 1.6;
}
.more-reviews {
  border: 1px solid #0f172a;
  border-radius: 8px;
  background: #fff;
  color: #0f172a;
  padding: 10px 24px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.more-reviews:hover {
  background: #0f172a;
  color: #fff;
}

/* Responsive */
@media (max-width: 900px) {
  .instructor-card {
    flex-direction: column;
    align-items: flex-start;
  }
  .course {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}

@media (max-width: 600px) {
  .tabs {
    flex-direction: column;
  }
  .tab {
    width: 100%;
    text-align: center;
  }
}
</style>
<script>
export default {
  name: "CourseDetails",
  data() {
    return {
      activeTab: 0,
      tabs: ["Details", "Instructor", "Syllabus", "Reviews"],
      syllabus: [
        { title: "Introduction to UX Design", lessons: 5, duration: "1 hour" },
        { title: "User Research Fundamentals", lessons: 4, duration: "45 min" },
        { title: "Prototyping Essentials", lessons: 6, duration: "1.5 hour" },
        { title: "Usability Testing", lessons: 5, duration: "1 hour" },
      ],
      reviews: [
        {
          name: "Mark Doe",
          avatar: "/user1.png",
          rating: 5,
          date: "22nd March, 2024",
          comment:
            "Amazing course! The instructor made complex UX ideas simple and practical.",
        },
        {
          name: "Jane Smith",
          avatar: "/user2.png",
          rating: 5,
          date: "5th April, 2024",
          comment:
            "Loved it! Great structure and useful hands-on exercises for beginners.",
        },
      ],
    };
  },
};
</script>
<script setup>
import Header from '../../../../packages/shared-ui/src/components/Header.vue';
</script>