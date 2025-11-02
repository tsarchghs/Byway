<template>
  <div class="homepage">
    <Header/>
    <!-- Hero Section -->
    <HeroSection />

    <!-- Stats Section -->
    <StatsSection />

    <!-- Top Categories -->
    <TopCategories />

    <!-- Top Courses -->
    <TopCourses />

    <!-- Top Instructors -->
    <TopInstructors />

    <!-- Instructors CTA Section -->
    <InstructorsSection />

    <!-- Footer -->
    <FooterSection />
  </div>
</template>

<script setup>
// Import Nuxt auto-registered components if needed
import HeroSection from '../components/HeroSection/index.vue'
import StatsSection from '../components/StatsSection/index.vue'
import TopCategories from '../components/TopCategories/index.vue'
import TopCourses from '../components/TopCourses/index.vue'
import TopInstructors from '../components/TopInstructors/index.vue'
import InstructorsSection from '../components/InstructorsSection/index.vue'
import FooterSection from '../components/FooterSection.vue'
import Header from '../../../../packages/shared-ui/src/components/Header.vue'
</script>

<style scoped>
.homepage {
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-x: hidden;
  background: #ffffff;
}

/* Add optional spacing between sections */
.homepage > *:not(:last-child) {
  margin-bottom: 80px;
}

@media (max-width: 768px) {
  .homepage > *:not(:last-child) {
    margin-bottom: 40px;
  }
}
</style>
