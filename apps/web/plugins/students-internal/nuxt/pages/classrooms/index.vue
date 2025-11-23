<template>
  <a-config-provider :theme="{ algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm }">
    <a-layout :class="['classrooms-wrap', isDark ? 'is-dark' : '']" data-test-id="classrooms-wrap">
      
      <!-- HEADER -->
      <a-page-header
        class="page-header"
        title="Classrooms"
        sub-title="Your cohorts & active groups"
      >
        <template #extra>
          <a-space>
            <a-button href="/students/courses" type="default">
              <template #icon><BookOutlined /></template>
              My Courses
            </a-button>

            <a-tooltip title="Toggle dark mode">
              <a-button @click="toggleDark" data-test-id="toggle-dark">
                <BulbOutlined />
              </a-button>
            </a-tooltip>
          </a-space>
        </template>
      </a-page-header>

      <div class="p-4">

        <!-- INSTITUTION BANNER -->
        <div v-if="institution" class="institution-banner">
          <img v-if="institution.bannerUrl" :src="institution.bannerUrl" alt="Institution Banner" class="banner-img" />
          <div class="banner-overlay">
            <h2 class="inst-name">{{ institution.name }}</h2>
            <p class="inst-sub">{{ institution.tagline }}</p>
          </div>
        </div>

        <!-- BREADCRUMB -->
        <a-breadcrumb class="mb-3 mt-3">
          <a-breadcrumb-item to="/students">Students</a-breadcrumb-item>
          <a-breadcrumb-item>Classrooms</a-breadcrumb-item>
        </a-breadcrumb>

        <!-- FILTER BAR -->
        <a-card :bordered="false" class="mb-4">
          <a-space wrap>
            <a-input-search
              v-model:value="search"
              placeholder="Search classrooms..."
              style="width: 240px"
              data-test-id="search"
            />

            <a-select
              v-model:value="courseFilter"
              placeholder="Filter by course"
              allow-clear
              style="width: 200px"
            >
              <a-select-option v-for="c in courseList" :key="c" :value="c">
                {{ c }}
              </a-select-option>
            </a-select>
          </a-space>
        </a-card>

        <!-- GRID VIEW -->
        <a-row :gutter="[16,16]">

          <a-col
            v-for="item in filteredRows"
            :key="item.id"
            :xs="24" :sm="12" :md="8" :lg="6"
          >
            <a-card
              hoverable
              class="classroom-card"
              :cover="
                item.thumbnail
                  ? h('img', { src: item.thumbnail, class: 'thumb-img' })
                  : h('div', { class: 'thumb-placeholder' }, 'No Image')
              "
            >
              <a-card-meta
                :title="item.name"
                :description="item.course"
              >
                <template #avatar>
                  <a-avatar size="large">
                    <template v-if="item.avatar">
                      <img :src="item.avatar" />
                    </template>
                    <template v-else><BookOutlined /></template>
                  </a-avatar>
                </template>
              </a-card-meta>

              <div class="card-bottom">
                <a-badge :count="item.members" show-zero />
                <a-button
                  type="primary"
                  size="small"
                  class="ml-2"
                  :href="`/students/classrooms/${item.id}`"
                  data-test-id="open-classroom"
                >
                  Open
                </a-button>
              </div>
            </a-card>
          </a-col>

        </a-row>

        <!-- EMPTY STATE -->
        <a-empty
          v-if="!filteredRows.length && !loading"
          description="No classrooms found"
          class="mt-4"
        />
      </div>
    </a-layout>
  </a-config-provider>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, h } from "vue";
import { useGql } from '#shared/composables/useGql.ts'
import { theme } from "ant-design-vue";
import { BulbOutlined, BookOutlined } from "@ant-design/icons-vue";
import { definePageMeta } from "#imports";

definePageMeta({ layout: "student", title: "Classrooms", ssr: false });

/* UI state */
const isDark = ref(false);
const loading = ref(true);

/* Filters */
const search = ref("");
const courseFilter = ref("");

/* Data */
const rows = ref<any[]>([]);
const institution = ref<any | null>(null); // institution banner metadata

/* Fetch classrooms + institution info */
onMounted(async () => {
  try {
    const { call, endpoints } = useGql();

    const q = `
      query($studentId:String) {
        classroomsByStudent(studentId:$studentId) {
          id
          name
          course
          members
          thumbnail
          avatar
        }
        institutionMeta {
          name
          tagline
          bannerUrl
        }
      }
    `;

    const d: any = await call(endpoints.students, q, {
      studentId: undefined,
    });

    rows.value = d?.classroomsByStudent ?? [];
    institution.value = d?.institutionMeta ?? null;

  } catch (err) {
    // Mock fallback
    institution.value = {
      name: "Byway Demo University",
      tagline: "Learning Without Limits",
      bannerUrl: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a",
    };

    rows.value = [
      {
        id: "c101",
        name: "Cohort A",
        course: "JS Essentials",
        members: 24,
        thumbnail: "https://images.unsplash.com/photo-1581276879432-15a43cae5c49",
      },
      {
        id: "c102",
        name: "Data 2025",
        course: "Python for Data",
        members: 18,
        thumbnail: "https://images.unsplash.com/photo-1537432376769-00aabc873637",
      },
      {
        id: "c103",
        name: "Frontend Bootcamp",
        course: "Vue 4 Foundations",
        members: 32,
        thumbnail: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
      },
    ];
  }

  loading.value = false;
});

/* Filters */
const filteredRows = computed(() => {
  let list = rows.value;

  if (search.value) {
    const s = search.value.toLowerCase();
    list = list.filter(r =>
      r.name.toLowerCase().includes(s) ||
      r.course.toLowerCase().includes(s)
    );
  }

  if (courseFilter.value) {
    list = list.filter(r => r.course === courseFilter.value);
  }

  return list;
});

/* dark mode */
function toggleDark() {
  isDark.value = !isDark.value;

  if (typeof document !== "undefined") {
    if (isDark.value) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }
}

/* derived */
const courseList = computed(() =>
  [...new Set(rows.value.map(r => r.course))].sort()
);
</script>

<style scoped>
.classrooms-wrap {
  min-height: 100vh;
  background: var(--ant-color-bg-layout);
}

.is-dark {
  color-scheme: dark;
}

.page-header {
  background: var(--ant-color-bg-container);
  margin: 8px;
  padding: 12px;
  border-radius: 12px;
}

/* Institution Banner */
.institution-banner {
  position: relative;
  height: 180px;
  border-radius: 12px;
  overflow: hidden;
  background: #000;
}

.banner-img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  opacity: 0.9;
}

.banner-overlay {
  position: absolute;
  inset: 0;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);
}

.inst-name {
  margin: 0;
  color: #fff;
  font-size: 22px;
  font-weight: 700;
}

.inst-sub {
  margin: 0;
  margin-top: 4px;
  color: #e5e7eb;
  font-size: 14px;
}

/* Cards */
.classroom-card {
  border-radius: 10px;
  overflow: hidden;
}

.thumb-img {
  height: 140px;
  width: 100%;
  object-fit: cover;
}

.thumb-placeholder {
  height: 140px;
  display: flex;
  background: #f3f4f6;
  justify-content: center;
  align-items: center;
  color: #94a3b8;
}

.card-bottom {
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.p-4 {
  padding: 16px;
}

.mb-3 {
  margin-bottom: 16px;
}

.mb-4 {
  margin-bottom: 16px;
}

.mt-3 {
  margin-top: 12px;
}
</style>
