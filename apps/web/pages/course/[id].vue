<template>
  <a-row :gutter="[24,24]">
    <a-col :xs="24" :lg="16">
      <CourseHero :course="course" :rating="rating" :reviews="reviews.length" />
      <CourseCurriculum :sections="course.sections || []" style="margin-top:16px" />
      <CourseInstructors :instructors="instructors" style="margin-top:16px" />
      <CourseReviews :items="reviews" style="margin-top:16px" />
    </a-col>
    <a-col :xs="24" :lg="8">
      <StickyPurchaseCard :price="price" :alreadyEnrolled="alreadyEnrolled" @add="addToCart" @buy="buyNow" />
                            </a-col>
    <a-col :xs="24">
      <ReviewForm :courseId="id" @submitted="loadReviews" style="margin-top:16px" />
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
useHead({ title: 'Course — Byway' })
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCart } from '~/composables/useCart'
import { useSdk } from '~/composables/useSdk'
import { useEnrollments } from '~/composables/useEnrollments'
import StickyPurchaseCard from '~/components/lms/StickyPurchaseCard.vue'
import CourseHero from '~/components/lms/CourseHero.vue'
import CourseCurriculum from '~/components/lms/CourseCurriculum.vue'
import CourseInstructors from '~/components/lms/CourseInstructors.vue'
import CourseReviews from '~/components/lms/CourseReviews.vue'
import ReviewForm from '~/components/lms/ReviewForm.vue'

const route = useRoute()
const router = useRouter()
const sdk = useSdk()
const cart = useCart ? useCart() : { add: ()=>{}, items:{value:[]} }
const { isEnrolled } = useEnrollments()

const id = String(route.params.id)
const course = ref<any>({ id, title:'', subtitle:'', price:0, category:'', sections:[] })
const instructors = ref<any[]>([])
const reviews = ref<any[]>([])
const rating = computed(()=> reviews.value.length ? reviews.value.reduce((s,i)=> s+i.rating, 0)/reviews.value.length : 4.7)

onMounted(async()=>{
  try{
    course.value = await sdk.getCourse(id)
  }catch{
    course.value = {
      id, title: 'Demo Course', subtitle: 'Hands-on course', price: 49.99, category: 'Programming',
      sections: [
        { title:'Introduction', items:[{ id:'l1', title:'Welcome', duration:'3m', preview:true }, { id:'l2', title:'Setup', duration:'8m' }]},
        { title:'Core Concepts', items:[{ id:'l3', title:'State management', duration:'14m' }, { id:'l4', title:'Routing', duration:'10m' }]}
      ]
    }
  }
  try{ instructors.value = await $fetch(`/plugins/students-internal/api/course/${id}/instructors`) }catch{ instructors.value = [] }
  await loadReviews()
})

const price = computed(()=> (course.value?.price ?? 0).toLocaleString(undefined,{style:'currency',currency:'EUR'}))
const alreadyEnrolled = computed(()=> isEnrolled(id))

function addToCart(){
  if (alreadyEnrolled.value) return
  cart.add({ id: String(course.value.id), title: course.value.title, price: course.value.price ?? 0, courseId: String(course.value.id), thumbnail: course.value.thumbnail })
}
async function buyNow(){
  if (alreadyEnrolled.value) { router.push('/dashboard'); return }
  addToCart(); router.push('/checkout')
}
async function loadReviews(){
  try{
    const r:any = await $fetch(`/plugins/students-internal/api/course/${id}/reviews`)
    reviews.value = r.items || []
  }catch{ reviews.value = [] }
}
</script>
