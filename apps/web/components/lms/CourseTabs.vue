<template>
  <a-tabs default-active-key="overview">
    <a-tab-pane key="overview" tab="Overview">
      <slot name="overview" />
    </a-tab-pane>
    <a-tab-pane key="curriculum" tab="Curriculum">
      <slot name="curriculum" />
    </a-tab-pane>
    <a-tab-pane key="reviews" tab="Reviews">
      <CourseReviews :course-id="courseId" />
    </a-tab-pane>
    <a-tab-pane key="qa" tab="Q&A">
      <CourseQA :course-id="courseId" />
    </a-tab-pane>
  </a-tabs>
</template>
<script setup lang="ts">
defineProps<{ courseId: string }>()
import CourseReviews from '~/components/lms/CourseReviews.vue'
import CourseQA from '~/components/lms/CourseQA.vue'
</script>
