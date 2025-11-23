<template>
  <a-layout class="p-6">
    <StudentsNav subtitle="Explore" />
    <a-row :gutter="[16,16]">
      <a-col :xs="24" :md="8">
        <a-card title="Enrollments" hoverable @click="$router.push('/students/enrollments')">
          <p>See your courses and progress.</p>
        </a-card>
      </a-col>
      <a-col :xs="24" :md="8">
        <a-card title="My Courses" hoverable @click="$router.push('/students/my-courses')">
          <p>Jump back into any course.</p>
        </a-card>
      </a-col>
      <a-col :xs="24" :md="8">
        <a-card title="Gradebook" hoverable @click="$router.push('/students/gradebook')">
          <p>View grades by course and assignment.</p>
        </a-card>
      </a-col>
      <a-col :xs="24" :md="8">
        <a-card title="Institutions" hoverable @click="$router.push('/institutions')">
          <p>Browse institutions you belong to.</p>
        </a-card>
      </a-col>
    </a-row>
  </a-layout>
</template>
<script setup lang="ts">
import StudentsNav from "../components/StudentsNav.vue"
</script>
