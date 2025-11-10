<template>
  <a-affix :offset-top="16">
    <a-card>
      <a-space direction="vertical" style="width:100%">
        <a-typography-title :level="3" style="margin:0">{{ price }}</a-typography-title>
        <a-button type="primary" block :disabled="alreadyEnrolled" @click="$emit('add')">
          {{ alreadyEnrolled ? 'Already enrolled' : 'Add to cart' }}
        </a-button>
        <a-button block :disabled="alreadyEnrolled" @click="$emit('buy')">Buy now</a-button>
        <a-divider>Includes</a-divider>
        <a-space direction="vertical">
          <div>Lifetime access</div>
          <div>Certificate on completion</div>
          <div>Assignments & quizzes</div>
        </a-space>
      </a-space>
    </a-card>
  </a-affix>
</template>
<script setup lang="ts">
defineProps<{ price: string, alreadyEnrolled: boolean }>()
defineEmits<{ (e:'add'):void; (e:'buy'):void }>()
</script>
