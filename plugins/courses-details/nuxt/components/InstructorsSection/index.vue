<template>
  <section class="instructors-section">
    <!-- Section 1: Become an Instructor -->
    <div class="instructor-block reverse">
      <div class="instructor-image">
        <img src="image1.png" alt="Instructor teaching" />
      </div>

      <div class="instructor-content">
        <div class="text-group">
          <h4>Become an Instructor</h4>
          <p>
            Instructors from around the world teach millions of students on
            Byway. We provide the tools and skills to teach what you love.
          </p>
        </div>

        <button class="cta-button">
          <span class="label">Start Teaching Today</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="arrow-icon"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Section 2: Transform Your Life -->
    <div class="instructor-block">
      <div class="instructor-content">
        <div class="text-group">
          <h4>Transform your life through education</h4>
          <p>
            Learners around the world are launching new careers, advancing in
            their fields, and enriching their lives.
          </p>
        </div>

        <button class="cta-button">
          <span class="label">Start Learning</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="arrow-icon"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div class="instructor-image">
        <img src="image2.png" alt="Learning experience" />
      </div>
    </div>
  </section>
</template>

<script setup>
// No script logic needed — purely presentational component
</script>

<style scoped>
.instructors-section {
  display: flex;
  flex-direction: column;
  gap: 100px;
  width: 100%;
  padding: 80px 20px;
  background: #fff;
}

/* Each block (row) */
.instructor-block {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 60px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

/* Reverse layout for alternating sides */
.instructor-block.reverse {
  flex-direction: row-reverse;
}

/* Image section */
.instructor-image {
  flex: 1 1 400px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.instructor-image img {
  width: 100%;
  max-width: 480px;
  height: auto;
  border-radius: 12px;
  object-fit: cover;
}

/* Text + Button content */
.instructor-content {
  flex: 1 1 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 20px;
}

.text-group h4 {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 20px;
  color: #000;
  margin: 0;
}

.text-group p {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: #1d2939;
  margin: 0;
}

/* Buttons */
.cta-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 28px;
  background: #020617;
  border: none;
  border-radius: 8px;
  color: #fff;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s ease;
}

.cta-button:hover {
  background: #1e293b;
}

.arrow-icon {
  width: 20px;
  height: 20px;
}

/* 📱 Mobile-first responsiveness */
@media (max-width: 900px) {
  .instructor-block,
  .instructor-block.reverse {
    flex-direction: column;
    text-align: center;
  }

  .instructor-content {
    align-items: center;
  }

  .text-group h4 {
    font-size: 18px;
  }

  .text-group p {
    font-size: 15px;
  }

  .cta-button {
    margin-top: 10px;
  }
}
</style>
