<template>
  <section class="hero-section">
    <a-row class="hero-inner" align="middle" justify="space-between">
      <!-- Content Column -->
      <a-col :xs="24" :md="12" class="hero-content">
        <a-typography-title :level="1" class="hero-title">
          Learn Without Limits
        </a-typography-title>

        <a-typography-paragraph class="hero-subtitle">
          Explore thousands of courses and grow your skills with Byway’s world-class educators.
        </a-typography-paragraph>

        <a-space :size="16" class="hero-actions" wrap>
          <a-button type="primary" size="large" shape="round">
            Browse Courses
          </a-button>
          <a-button size="large" shape="round" ghost>
            Teach on Byway
          </a-button>
        </a-space>

        <a-tag color="blue" class="hero-badge">🎓 10,000+ new learners this week</a-tag>
      </a-col>

      <!-- Illustration Column -->
      <a-col :xs="24" :md="12" class="hero-illustrations-wrapper">
        <a-card hoverable bordered="false" class="hero-card">
          <img
            src="https://cdn.dribbble.com/userupload/6789410/file/original-bbde9b8ed35c91211e6e79f6bbfc508b.png"
            alt="Byway Learning Illustration"
            class="hero-image"
          />
        </a-card>
      </a-col>
    </a-row>
  </section>
</template>

<script setup lang="ts">
// future: accept props for title, subtitle, illustration
</script>

<style scoped>
.hero-section {
  background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%);
  width: 100%;
  padding: 96px 0;
  border-bottom: 1px solid #f0f0f0;
  overflow: hidden;
}

.hero-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
}

.hero-title {
  font-weight: 700;
  margin-bottom: 0;
}

.hero-subtitle {
  font-size: 18px;
  color: rgba(0, 0, 0, 0.65);
  max-width: 500px;
}

.hero-actions {
  margin-top: 1.5rem;
}

.hero-badge {
  margin-top: 12px;
  font-size: 14px;
}

.hero-card {
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  box-shadow: none;
}

.hero-image {
  max-width: 100%;
  border-radius: 12px;
  transition: transform 0.4s ease, box-shadow 0.3s ease;
}

.hero-card:hover .hero-image {
  transform: scale(1.05);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

/* Responsive */
@media (max-width: 992px) {
  .hero-section {
    padding: 64px 16px;
  }

  .hero-content {
    align-items: center;
    text-align: center;
  }

  .hero-actions {
    justify-content: center;
  }

  .hero-subtitle {
    max-width: 90%;
  }

  .hero-card {
    margin-top: 2rem;
  }
}
</style>
