<template>
  <a-card :hoverable="true" class="course-card" @click="$router.push(`/course/${course.id}`)">
    <template #cover>
      <div class="thumb-wrap">
        <img :src="course.thumbnail || placeholder" alt="" />
      </div>
    </template>
    <a-card-meta :title="course.title" :description="course.subtitle" />
    <div class="meta">
      <span>{{ course.teacherName || 'Byway Instructor' }}</span>
      <strong>{{ (course.price ?? 0).toFixed(2) }} €</strong>
    </div>
    <a-button type="primary" block @click.stop="addToCart">Add to cart</a-button>
  </a-card>
</template>

<script setup lang="ts">
import { useCart } from '~/composables/useCart'
const props = defineProps<{ course: any }>()
const cart = useCart()
const placeholder = 'https://dummyimage.com/640x360/eee/aaa.jpg&text=Course'

function addToCart(){
  cart.add({
    id: props.course.id,
    title: props.course.title,
    price: props.course.price ?? 0,
    courseId: props.course.id,
    thumbnail: props.course.thumbnail
  })
}
</script>

<style scoped>
.course-card{ cursor:pointer; }
.thumb-wrap{ width:100%; height:160px; background:#f5f5f5; display:flex; align-items:center; justify-content:center; overflow:hidden;}
.thumb-wrap img{ width:100%; height:100%; object-fit:cover;}
.meta{ display:flex; align-items:center; justify-content:space-between; margin-top:8px; }
</style>
