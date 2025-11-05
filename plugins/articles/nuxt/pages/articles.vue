<template>
  <Header/>
  <a-layout-content class="articles-page">
    <div class="articles-container">
      <!-- Header Section -->
      <div class="header">
        <a-typography-title :level="2">Latest Articles</a-typography-title>
        <a-space size="middle" wrap>
          <a-input-search
            v-model:value="search"
            placeholder="Search articles"
            allow-clear
            style="width: 280px"
          />
          <a-select
            v-model:value="selectedCategory"
            placeholder="Filter by category"
            style="width: 180px"
            allow-clear
          >
            <a-select-option v-for="cat in categories" :key="cat" :value="cat">
              {{ cat }}
            </a-select-option>
          </a-select>
        </a-space>
      </div>

      <!-- Articles Grid -->
      <a-row :gutter="[32, 32]" justify="start" class="articles-grid">
        <a-col
          v-for="(article, index) in filteredArticles"
          :key="index"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
        >
          <a-card
            hoverable
            :cover="coverTemplate(article)"
            class="article-card"
          >
            <a-card-meta
              :title="article.title"
              :description="article.excerpt"
            />

            <template #actions>
              <a-space size="small">
                <a-avatar :src="article.author.avatar" size="small" />
                <a-typography-text>{{ article.author.name }}</a-typography-text>
              </a-space>
              <a-tag color="blue">{{ article.category }}</a-tag>
            </template>
          </a-card>
        </a-col>
      </a-row>

      <!-- Pagination -->
      <div class="pagination-container">
        <a-pagination
          v-model:current="page"
          :page-size="8"
          :total="filteredArticles.length"
          show-less-items
        />
      </div>
    </div>
  </a-layout-content>
</template>

<script setup lang="ts">
import Header from '../../../../packages/shared-ui/src/components/Header.vue'
import { ref, computed, h } from 'vue'
import { message } from 'ant-design-vue'
import { FileTextOutlined } from '@ant-design/icons-vue'

const search = ref('')
const selectedCategory = ref<string | null>(null)
const page = ref(1)

const categories = ['Business', 'Design', 'Programming', 'Marketing', 'AI', 'Education']

const articles = ref([
  {
    title: 'The Future of Online Learning',
    excerpt: 'Discover how AI and adaptive systems are transforming digital education...',
    image: '/articles/ai-learning.jpg',
    author: { name: 'Theresa Webb', avatar: '/instructors/theresa.jpg' },
    category: 'Education',
    date: '2025-10-10',
  },
  {
    title: 'Mastering Frontend in 2025',
    excerpt: 'React, Vue, and the evolution of design systems across modern stacks...',
    image: '/articles/frontend.jpg',
    author: { name: 'Wade Warren', avatar: '/instructors/ronald.jpg' },
    category: 'Programming',
    date: '2025-09-12',
  },
  {
    title: '10 Ways to Boost Your Business with Design Thinking',
    excerpt: 'Applying creative problem-solving in your business model...',
    image: '/articles/business-design.jpg',
    author: { name: 'Ronald Richards', avatar: '/instructors/ronald.jpg' },
    category: 'Business',
    date: '2025-09-22',
  },
])

// Filtered and searched results
const filteredArticles = computed(() => {
  let filtered = articles.value
  if (selectedCategory.value)
    filtered = filtered.filter((a) => a.category === selectedCategory.value)
  if (search.value)
    filtered = filtered.filter((a) =>
      a.title.toLowerCase().includes(search.value.toLowerCase())
    )
  if (!filtered.length) message.info('No articles found.')
  return filtered
})

// Template for card cover
const coverTemplate = (article: any) =>
  article.image
    ? h('img', { alt: article.title, src: article.image, class: 'card-cover' })
    : h(FileTextOutlined)
</script>

<style scoped>
.articles-page {
  background: #fafafa;
  padding: 80px 24px;
  display: flex;
  justify-content: center;
}

.articles-container {
  width: 100%;
  max-width: 1200px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;
}

.articles-grid {
  margin-top: 24px;
}

.article-card {
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.article-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 18px rgba(22, 119, 255, 0.1);
}

.card-cover {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.pagination-container {
  margin-top: 40px;
  text-align: center;
}

@media (max-width: 768px) {
  .articles-page {
    padding: 64px 16px;
  }
  .header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
