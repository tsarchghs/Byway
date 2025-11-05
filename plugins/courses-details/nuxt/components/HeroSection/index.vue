<template>
  <section class="hero-section">
    <div class="hero-inner">
      <div class="hero-content">
        <h1 class="hero-title">Learn Without Limits</h1>
        <p class="hero-subtitle">
          Explore thousands of courses and grow your skills with Byway’s world-class educators.
        </p>
        <div class="hero-actions">
          <NuxtLink to="/courses" class="btn-primary">Browse Courses</NuxtLink>
          <NuxtLink to="/teach" class="btn-secondary">Teach on Byway</NuxtLink>
        </div>
      </div>
      <div class="hero-illustrations-wrapper">
        <HeroIllustrations />
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import HeroIllustrations from './HeroIllustrations.vue';
// Static hero section — can later accept props (e.g., title, subtitle, image)
</script>

<style scoped>
.hero-illustrations-wrapper {
  position: relative;
  width: 100%;
  height: 600px; /* visible height */
  overflow: visible;
}

/* ===== BASE STYLES ===== */
.hero-section {
  background: #ffffff;
  width: 100%;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1440px;
  padding: 0 4rem;
  box-sizing: border-box;
  gap: 2rem;
}

.hero-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.5rem;
}

.hero-title {
  font-family: "Inter", sans-serif;
  font-size: 48px;
  font-weight: 700;
  line-height: 1.2;
  color: #1e293b;
  margin: 0;
}

.hero-subtitle {
  font-family: "Inter", sans-serif;
  font-size: 18px;
  line-height: 1.6;
  color: #475569;
  max-width: 520px;
}

.hero-actions {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1.5rem;
  margin-top: 1rem;
}

.btn-primary {
  background: #334155;
  color: #ffffff;
  font-family: "Inter", sans-serif;
  font-size: 16px;
  font-weight: 500;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  text-decoration: none;
  transition: background 0.2s ease-in-out;
}

.btn-primary:hover {
  background: #1e293b;
}

.btn-secondary {
  background: transparent;
  color: #334155;
  border: 1px solid #334155;
  font-family: "Inter", sans-serif;
  font-size: 16px;
  font-weight: 500;
  padding: 12px 24px;
  border-radius: 6px;
  text-decoration: none;
  transition: all 0.2s ease-in-out;
}

.btn-secondary:hover {
  background: #334155;
  color: #ffffff;
}

/* ===== IMAGE ===== */
.hero-image {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.hero-image img {
  max-width: 100%;
  height: auto;
  border-radius: 12px;
}

/* ===== RESPONSIVE BREAKPOINTS ===== */

/* XL Screens (≥1600px) */
@media (min-width: 1600px) {
  .hero-inner {
    padding: 0 6rem;
  }
}

/* Laptops (1024px–1279px) */
@media (max-width: 1279px) {
  .hero-title {
    font-size: 40px;
  }
  .hero-subtitle {
    font-size: 16px;
  }
  .hero-inner {
    padding: 0 2rem;
  }
}

/* Tablets (768px–1023px) */
@media (max-width: 1023px) {
  .hero-inner {
    flex-direction: column-reverse;
    text-align: center;
  }

  .hero-content {
    align-items: center;
  }

  .hero-title {
    font-size: 36px;
  }

  .hero-subtitle {
    font-size: 16px;
    max-width: 90%;
  }

  .hero-actions {
    justify-content: center;
  }

  .hero-image {
    justify-content: center;
  }
}

/* Mobile (≤767px) */
@media (max-width: 767px) {
  .hero-section {
    min-height: auto;
    padding: 2rem 1rem;
  }

  .hero-title {
    font-size: 28px;
  }

  .hero-subtitle {
    font-size: 15px;
  }

  .btn-primary,
  .btn-secondary {
    font-size: 14px;
    padding: 10px 20px;
  }

  .hero-actions {
    flex-direction: column;
    gap: 0.75rem;
  }
}
/* === Additive fixes for HeroSection layout === */
.hero-section {
  position: relative;
  overflow: visible; /* allow illustrations to peek out */
}

.hero-inner {
  align-items: flex-start; /* aligns text top with images */
}

.hero-illustrations-wrapper {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
  overflow: visible;
  margin-right: -60px; /* pull slightly beyond container for better balance */
  position: relative;
}

@media (max-width: 1024px) {
  .hero-illustrations-wrapper {
    margin-right: 0;
    justify-content: center;
    transform: scale(0.8);
  }
}

</style>
