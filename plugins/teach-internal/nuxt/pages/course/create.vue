<template>
  <a-layout class="create-course-layout">
    <a-page-header
      title="Create a New Course"
      sub-title="Design, structure, and publish your course content"
      class="header"
      @back="goBack"
    />

    <a-card class="form-card" bordered>
      <a-steps v-model:current="currentStep" class="steps" size="small">
        <a-step title="Course Info" />
        <a-step title="Content" />
        <a-step title="Pricing" />
        <a-step title="Publish" />
      </a-steps>

      <div class="step-content">
        <!-- Step 1: Basic Info -->
        <a-form
          v-if="currentStep === 0"
          layout="vertical"
          :model="course"
          @finish="nextStep"
        >
          <a-form-item label="Course Title" name="title" required>
            <a-input v-model:value="course.title" placeholder="e.g. Advanced Vue 3 Workshop" />
          </a-form-item>

          <a-form-item label="Category" name="category" required>
            <a-select
              v-model:value="course.category"
              placeholder="Select a category"
              :options="categories"
            />
          </a-form-item>

          <a-form-item label="Difficulty" name="difficulty">
            <a-radio-group v-model:value="course.difficulty">
              <a-radio value="Beginner">Beginner</a-radio>
              <a-radio value="Intermediate">Intermediate</a-radio>
              <a-radio value="Advanced">Advanced</a-radio>
            </a-radio-group>
          </a-form-item>

          <a-form-item label="Description">
            <a-textarea
              v-model:value="course.description"
              rows="4"
              placeholder="Write a brief overview of your course..."
            />
          </a-form-item>

          <div class="actions">
            <a-button type="primary" html-type="submit">Next</a-button>
          </div>
        </a-form>

        <!-- Step 2: Content -->
        <div v-if="currentStep === 1">
          <a-upload
            v-model:file-list="course.files"
            list-type="picture-card"
            :max-count="1"
            :before-upload="() => false"
          >
            <div>
              <plus-outlined />
              <div style="margin-top: 8px">Upload Thumbnail</div>
            </div>
          </a-upload>

          <a-divider orientation="left">Modules</a-divider>
          <a-list
            bordered
            :data-source="course.modules"
            item-layout="horizontal"
            :renderItem="renderModule"
          />
          <a-button type="dashed" block @click="addModule">
            + Add Module
          </a-button>

          <div class="actions">
            <a-button @click="prevStep">Back</a-button>
            <a-button type="primary" @click="nextStep">Next</a-button>
          </div>
        </div>

        <!-- Step 3: Pricing -->
        <a-form
          v-if="currentStep === 2"
          layout="vertical"
          :model="course"
          @finish="nextStep"
        >
          <a-form-item label="Price (USD)" name="price" required>
            <a-input-number v-model:value="course.price" :min="0" />
          </a-form-item>

          <a-form-item label="Discount (%)" name="discount">
            <a-input-number v-model:value="course.discount" :min="0" :max="100" />
          </a-form-item>

          <div class="actions">
            <a-button @click="prevStep">Back</a-button>
            <a-button type="primary" html-type="submit">Next</a-button>
          </div>
        </a-form>

        <!-- Step 4: Publish -->
        <div v-if="currentStep === 3" class="publish-step">
          <a-result
            status="success"
            title="Ready to publish your course?"
            sub-title="Review your details before going live."
          >
            <template #extra>
              <a-space>
                <a-button @click="prevStep">Back</a-button>
                <a-button type="primary" @click="publishCourse">Publish Course</a-button>
              </a-space>
            </template>
          </a-result>
        </div>
      </div>
    </a-card>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, reactive, h } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

const currentStep = ref(0)

const categories = [
  { label: 'Programming', value: 'Programming' },
  { label: 'Design', value: 'Design' },
  { label: 'Marketing', value: 'Marketing' },
  { label: 'Photography', value: 'Photography' },
]

const course = reactive({
  title: '',
  category: '',
  difficulty: 'Beginner',
  description: '',
  price: 0,
  discount: 0,
  modules: [],
  files: [],
})

const nextStep = () => currentStep.value++
const prevStep = () => currentStep.value--
const goBack = () => history.back()

const addModule = () => {
  course.modules.push({
    title: `Module ${course.modules.length + 1}`,
    lessons: [],
  })
}


const renderModule = (item: any) =>
  h(
    'a-list-item',
    null,
    {
      default: () =>
        h('a-list-item-meta', {
          title: item.title,
          description: `${item.lessons.length} lessons`,
        }),
    }
  )

const publishCourse = () => {
  message.success(`🎉 Course "${course.title}" published successfully!`)
  currentStep.value = 0
}
</script>

<style scoped>
.create-course-layout {
  padding: 24px;
  background: #fafafa;
  min-height: 100vh;
}
.header {
  background: #fff;
  margin-bottom: 24px;
  border-radius: 8px;
  padding: 16px 24px;
}
.form-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 24px;
}
.steps {
  margin-bottom: 32px;
}
.actions {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
.publish-step {
  text-align: center;
  padding: 40px 0;
}
</style>
