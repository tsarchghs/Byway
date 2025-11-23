<template>
  <Header/>
  <a-layout-content class="faq-page">
    <div class="faq-container">
      <!-- Header -->
      <div class="faq-header">
        <a-typography-title :level="2">Frequently Asked Questions</a-typography-title>
        <a-typography-text type="secondary">
          Find answers to the most common questions about Byway’s platform, courses, and instructors.
        </a-typography-text>
      </div>

      <!-- Search -->
      <div class="faq-search">
        <a-input-search
          v-model:value="search"
          placeholder="Search questions..."
          allow-clear
          @search="onSearch"
          style="max-width: 400px"
        />
      </div>

      <!-- Collapse FAQ -->
      <a-collapse accordion class="faq-collapse">
        <a-collapse-panel
          v-for="(faq, i) in filteredFaqs"
          :key="i"
          :header="faq.question"
          :extra="h(QuestionCircleOutlined)"
        >
          <a-typography-text>{{ faq.answer }}</a-typography-text>
        </a-collapse-panel>
      </a-collapse>

      <!-- Contact Support CTA -->
      <a-card class="faq-contact">
        <a-space direction="vertical" size="middle" align="center">
          <a-typography-title :level="4">Still have questions?</a-typography-title>
          <a-typography-text type="secondary">
            Our support team is here to help you with anything you need.
          </a-typography-text>
          <a-button type="primary" size="large" @click="goContact">
            Contact Support
          </a-button>
        </a-space>
      </a-card>
    </div>
  </a-layout-content>
</template>

<script setup lang="ts">
import Header from '../../../../packages/shared-ui/src/components/Header.vue'
import { ref, computed, h } from 'vue'
import { QuestionCircleOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'

const router = useRouter()

const goContact = () => router.push('/contact')

const search = ref('')

const faqs = ref([
  {
    question: 'How do I enroll in a course?',
    answer:
      'Simply visit the course page, click on “Enroll Now,” and follow the checkout steps. You’ll have instant access to your lessons.',
  },
  {
    question: 'Are the courses self-paced?',
    answer:
      'Yes, all Byway courses are completely self-paced. You can start, pause, and continue anytime.',
  },
  {
    question: 'Can I get a refund if I’m not satisfied?',
    answer:
      'Absolutely! We offer a 7-day refund policy if you’re not happy with your course experience.',
  },
  {
    question: 'Do I receive a certificate after completion?',
    answer:
      'Yes, after completing a course, you’ll receive a verified certificate of completion available in your dashboard.',
  },
  {
    question: 'Can instructors upload their own content?',
    answer:
      'Yes, verified instructors can publish new courses through the “Teach on Byway” dashboard.',
  },
])

// Filter logic
const filteredFaqs = computed(() => {
  if (!search.value) return faqs.value
  const results = faqs.value.filter((f) =>
    f.question.toLowerCase().includes(search.value.toLowerCase())
  )
  if (!results.length) message.info('No matching FAQs found.')
  return results
})
</script>

<style scoped>
.faq-page {
  background: #fafafa;
  padding: 80px 24px;
  display: flex;
  justify-content: center;
}

.faq-container {
  max-width: 900px;
  width: 100%;
}

.faq-header {
  text-align: center;
  margin-bottom: 40px;
}

.faq-search {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
}

.faq-collapse {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.faq-collapse .ant-collapse-item {
  border: none;
}

.faq-collapse .ant-collapse-header {
  font-weight: 500;
  font-size: 16px;
}

.faq-contact {
  margin-top: 64px;
  background: #fff;
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  box-shadow: 0 4px 16px rgba(22, 119, 255, 0.08);
}

@media (max-width: 768px) {
  .faq-page {
    padding: 64px 16px;
  }

  .faq-header {
    margin-bottom: 32px;
  }

  .faq-contact {
    padding: 32px 16px;
  }
}
</style>
