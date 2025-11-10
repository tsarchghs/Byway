
<template>
  <div class="inst-wrap" :style="cssVars">
    <slot />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const baseUrl = useRuntimeConfig().public?.baseURL || ''
const color = ref('')
const banner = ref('')
const cssVars = computed(()=> ({
  '--inst-primary': color.value || '#1677ff',
  background: banner.value ? `url(${banner.value}) no-repeat top center / cover` : undefined
}))
onMounted(async () => {
  const q = 'query($slug:String!){ institutionBySlug(slug:$slug){ primaryColor bannerUrl } }'
  const r = await $fetch(`${baseUrl}/api/authentication/graphql`, { method:'POST', body:{ query:q, variables:{ slug: String(route.params.slug) }}}) as any
  color.value = r?.data?.institutionBySlug?.primaryColor || ''
  banner.value = r?.data?.institutionBySlug?.bannerUrl || ''
})
</script>

<style scoped>
.inst-wrap{ min-height:100%; }
:root, :host { --inst-primary:#1677ff; }
</style>
