<script setup lang="ts">
import { reactive } from 'vue'
import { message } from 'ant-design-vue'

const form = reactive({
  title: '',
  slug: '',
  description: '',
  difficulty: 'Beginner',
  starterRepoUrl: '',
  testsRepoUrl: '',
  runtime: 'node18',
  visibility: 'private',
  courseId: '',
  moduleId: '',
  lessonId: ''
})

async function submit() {
  try {
    const res = await fetch('/api/teacher-course-lab/challenges', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    if (!res.ok) throw new Error(await res.text())
    message.success('Challenge created')
  } catch (e: any) {
    message.error(e?.message || 'Failed to create challenge')
  }
}
</script>

<template>
  <div class="p-4">
    <a-page-header title="New Challenge" sub-title="Create a lab challenge" />
    <a-card>
      <a-form layout="vertical" @finish="submit">
        <a-form-item label="Title">
          <a-input v-model:value="form.title" />
        </a-form-item>
        <a-form-item label="Slug">
          <a-input v-model:value="form.slug" />
        </a-form-item>
        <a-form-item label="Description">
          <a-textarea v-model:value="form.description" :rows="4" />
        </a-form-item>
        <a-form-item label="Difficulty">
          <a-select v-model:value="form.difficulty">
            <a-select-option value="Beginner">Beginner</a-select-option>
            <a-select-option value="Intermediate">Intermediate</a-select-option>
            <a-select-option value="Advanced">Advanced</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="Starter Repo URL">
          <a-input v-model:value="form.starterRepoUrl" />
        </a-form-item>
        <a-form-item label="Tests Repo URL">
          <a-input v-model:value="form.testsRepoUrl" />
        </a-form-item>
        <a-form-item label="Runtime">
          <a-input v-model:value="form.runtime" placeholder="e.g., node18, python3.11" />
        </a-form-item>
        <a-form-item label="Visibility">
          <a-select v-model:value="form.visibility">
            <a-select-option value="private">private</a-select-option>
            <a-select-option value="course">course</a-select-option>
            <a-select-option value="public">public</a-select-option>
          </a-select>
        </a-form-item>

        <a-divider>Course bindings (optional)</a-divider>
        <a-form-item label="Course ID">
          <a-input v-model:value="form.courseId" placeholder="Course ID from courses plugin" />
        </a-form-item>
        <a-form-item label="Module ID">
          <a-input v-model:value="form.moduleId" placeholder="Module ID from modules plugin" />
        </a-form-item>
        <a-form-item label="Lesson ID">
          <a-input v-model:value="form.lessonId" placeholder="Lesson ID from lessons plugin" />
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit">Create</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>
