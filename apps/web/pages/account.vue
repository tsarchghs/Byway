<template>
  <a-space direction="vertical" size="large" style="width:100%">
    <a-typography-title :level="2">Account</a-typography-title>
    <a-card>
      <a-descriptions bordered :column="1">
        <a-descriptions-item label="Name">{{ me?.firstName }} {{ me?.lastName }}</a-descriptions-item>
        <a-descriptions-item label="Email">{{ me?.email }}</a-descriptions-item>
      </a-descriptions>
    </a-card>
  </a-space>
</template>
<script setup lang="ts">
import { useUser } from '~/composables/useUser'
const { me } = useUser()
</script>
