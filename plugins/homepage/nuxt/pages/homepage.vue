<template>
  <div class="homepage">
    <Header />

    <!-- Centered content wrapper -->
    <main class="page-container">
      <HeroSection />
      <StatsSection />
      <TopCategories />
      <TopCourses />
      <TopInstructors />
      <InstructorsSection />
    </main>

    <FooterSection />
  </div>
</template>

<script setup>
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
/* Global center container */
.page-container {
  width: 100%;
  max-width: 1200px; /* Keep consistent with other components */
  margin: 0 auto; /* Centers everything */
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Optional: normalize each section width */
.page-container > * {
  width: 100%;
  box-sizing: border-box;
}
</style>
