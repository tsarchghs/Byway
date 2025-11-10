<template>
  <a-card title="Instructors">
    <a-list :data-source="instructors">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-space>
            <a-avatar :src="item.avatar" />
            <div>
              <div class="name">{{ item.name }}</div>
              <div class="bio">{{ item.bio }}</div>
            </div>
          </a-space>
        </a-list-item>
      </template>
    </a-list>
  </a-card>
</template>
<script setup lang="ts">
defineProps<{ instructors:any[] }>()
</script>
<style scoped>
.name{ font-weight:600 }
.bio{ color:#666 }
</style>
