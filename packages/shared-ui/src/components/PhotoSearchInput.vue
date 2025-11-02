<template>
  <div class="photo-search-input" ref="wrapper" @click.outside="showDropdown = false">
    <input
      ref="inputEl"
      v-model="query"
      type="text"
      :placeholder="placeholder || 'Search photos...'"
      class="search-field"
      @input="onInput"
      @focus="handleFocus"
    />

    <transition name="fade">
      <ul v-if="showDropdown && results.length" class="results-dropdown">
        <li
          v-for="photo in results"
          :key="photo.id"
          class="result-item"
          @click="selectPhoto(photo)"
        >
          <img :src="photo.imageUrl || fallback" class="result-thumb" alt="photo" />
          <div class="result-info">
            <div class="result-title">{{ photo.title || 'Untitled' }}</div>
            <div class="result-location" v-if="photo.location">{{ photo.location }}</div>
          </div>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps<{ placeholder?: string }>()

const query = ref('')
const results = ref<any[]>([])
const showDropdown = ref(false)
const fallback = 'https://via.placeholder.com/60?text=Photo'
const inputEl = ref<HTMLInputElement | null>(null)
let timeout: NodeJS.Timeout | null = null

function onInput() {
  if (timeout) clearTimeout(timeout)
  timeout = setTimeout(searchPhotos, 300)
}

function handleFocus() {
  updateDropdownPosition()
  showDropdown.value = results.value.length > 0
}

async function searchPhotos() {
  if (!query.value.trim()) {
    results.value = []
    showDropdown.value = false
    return
  }

  try {
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:4000'
    const res = await fetch(`${apiBase}/api/marketplace/photos?q=${encodeURIComponent(query.value)}`)
    const data = await res.json()

    results.value = Array.isArray(data) ? data : []
    await nextTick()
    updateDropdownPosition()
    showDropdown.value = results.value.length > 0
  } catch (err) {
    console.error('❌ Failed to fetch photos', err)
  }
}

// 🧭 Navigate to /search?q=<title>
function selectPhoto(photo: any) {
  const queryParam = encodeURIComponent(photo.title || query.value)
  showDropdown.value = false
  router.push(`/search?q=${queryParam}`)
}

// 🧩 Dynamic positioning (fixed overlay)
function updateDropdownPosition() {
  const el = inputEl.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const root = document.documentElement
  const dropdownWidth = rect.width * 0.95
  const dropdownLeft = rect.left + (rect.width - dropdownWidth) / 2
  const dropdownTop = rect.bottom + 4

  root.style.setProperty('--dropdown-left', dropdownLeft + 'px')
  root.style.setProperty('--dropdown-top', dropdownTop + 'px')
  root.style.setProperty('--dropdown-width', dropdownWidth + 'px')
}

onMounted(() => window.addEventListener('resize', updateDropdownPosition))
onBeforeUnmount(() => window.removeEventListener('resize', updateDropdownPosition))
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap');

.photo-search-input {
  position: relative;
  width: 100%;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.search-field {
  width: 100%;
  height: 44px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 0 12px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
}

.search-field:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59,130,246,0.2);
}

/* 🌈 Dropdown styling */
.results-dropdown {
  position: fixed;
  left: var(--dropdown-left, 0);
  top: var(--dropdown-top, 0);
  width: var(--dropdown-width, 100%);
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  list-style: none;
  margin: 0;
  padding: 4px 0;
  max-height: 320px;
  overflow-y: auto;
  z-index: 99999;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.result-item:hover {
  background: #f1f5f9;
}

.result-thumb {
  width: 44px;
  height: 44px;
  object-fit: cover;
  border-radius: 6px;
  background: #f1f5f9;
}

.result-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.result-title {
  font-size: 14px;
  color: #111827;
  font-weight: 500;
}

.result-location {
  font-size: 12px;
  color: #64748b;
}

/* ✨ Fade animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
