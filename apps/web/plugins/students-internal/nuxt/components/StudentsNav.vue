<template>
  <a-page-header
    title="Student"
    :sub-title="subtitle"
    class="mb-4"
    @back="onBack"
  >
    <template #tags>
      <a-tag color="blue">{{ roleLabel }}</a-tag>
    </template>
    <template #extra>
      <a-space>
        <a-button @click="$router.push('/students')">Explore</a-button>
        <a-button @click="$router.push('/students/enrollments')">Enrollments</a-button>
        <a-button @click="$router.push('/students/gradebook')">Gradebook</a-button>
        <a-button @click="$router.push('/institutions')">Institutions</a-button>
        <a-button @click="$router.push('/teach/gradebook')">Teacher GB</a-button>
      </a-space>
    </template>
  </a-page-header>
</template>
<script setup lang="ts">
const props = defineProps<{ subtitle?: string, role?: string }>()
const subtitle = computed(()=> props.subtitle || 'Dashboard')
const roleLabel = computed(()=> props.role || 'student')
const router = useRouter()
function onBack(){
  try { router.back() } catch { router.push('/students') }
}
</script>
