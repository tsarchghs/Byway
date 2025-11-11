<template>
  <a-layout class="p-6">
    <a-page-header title="Explore" sub-title="Browse modules">
      <template #extra>
        <a-space>
          <a-button @click="$router.push('/plugins/authentication/login')">Login</a-button>
          <a-button type="primary" @click="$router.push('/plugins/course-author')">Author</a-button>
        </a-space>
      </template>
    </a-page-header>

    <a-row :gutter="[16,16]">
      <a-col :xs="24" :md="12" :lg="8">
        <a-card title="Courses" hoverable @click="$router.push('/plugins/course-platform/courses')">
          Discover and enroll in courses.
        </a-card>
      </a-col>
      <a-col :xs="24" :md="12" :lg="8">
        <a-card title="Institutions" hoverable @click="$router.push('/plugins/institutions')">
          Manage faculties and cohorts.
        </a-card>
      </a-col>
      <a-col :xs="24" :md="12" :lg="8">
        <a-card title="Gradebook" hoverable @click="$router.push('/plugins/students-internal/gradebook')">
          View grades and progress.
        </a-card>
      </a-col>
    </a-row>
  </a-layout>
</template>
<script setup lang="ts"></script>
