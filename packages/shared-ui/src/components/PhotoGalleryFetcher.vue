<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Photo {
  id: number
  title: string
  imageUrl: string
}

const columns = ref<Photo[][]>([[], [], [], []])
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:4000/api/marketplace/photos')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const photos: Photo[] = await res.json()

    // Distribute into 4 columns
    const newColumns: Photo[][] = [[], [], [], []]
    photos.forEach((photo, i) => newColumns[i % 4].push(photo))
    columns.value = newColumns
  } catch (e: any) {
    error.value = e.message || 'Failed to load photos.'
  } finally {
    loading.value = false
  }
})
</script>


<template>
  <div class="gallery-container">
    <div class="gallery-wrapper">
      <div class="gallery-grid">
        <!-- First 3 columns -->
        <div v-for="(col, colIndex) in columns.slice(0, 3)" :key="colIndex" class="gallery-column">
          <div
            v-for="photo in col"
            :key="photo.id"
            class="photo-card"
          >
            <img :src="photo.imageUrl || '/placeholder.svg'" :alt="photo.title" class="photo-image" />
            <div class="photo-overlay"></div>
            <div class="photo-title">{{ photo.title }}</div>
          </div>
        </div>

        <!-- 4th column with CTA -->
        <div class="gallery-column">
          <div class="cta-card">
            <h3>Want to submit a photo?</h3>
            <p>We are always looking for talented photographers to join us.</p>
            <button>Learn More</button>
          </div>

          <div
            v-for="photo in columns[3]"
            :key="photo.id"
            class="photo-card"
          >
            <img :src="photo.imageUrl || '/placeholder.svg'" :alt="photo.title" class="photo-image" />
            <div class="photo-overlay"></div>
            <div class="photo-title">{{ photo.title }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Layout Wrappers */
.gallery-container {
  min-height: 100vh;
  background-color: #f9fafb;
  padding: 3rem 1rem;
}
.gallery-wrapper {
  max-width: 1280px;
  margin: 0 auto;
}
.gallery-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}
@media (min-width: 768px) {
  .gallery-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (min-width: 1024px) {
  .gallery-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Columns */
.gallery-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Photo Cards */
.photo-card {
  position: relative;
  height: 440px;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}
.photo-card:hover {
  transform: scale(1.02);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}
.photo-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.photo-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}
.photo-card:hover .photo-overlay {
  opacity: 1;
}
.photo-title {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  color: white;
  font-weight: 600;
  font-size: 1.125rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
}
.photo-card:hover .photo-title {
  opacity: 1;
}

/* CTA Card */
.cta-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.cta-card h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}
.cta-card p {
  color: #4b5563;
  line-height: 1.6;
}
.cta-card button {
  align-self: flex-start;
  background-color: #2563eb;
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.cta-card button:hover {
  background-color: #1e40af;
}
</style>
