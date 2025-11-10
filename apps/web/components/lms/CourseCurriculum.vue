<template>
  <a-card title="Syllabus">
    <a-collapse accordion>
      <a-collapse-panel v-for="(sec,idx) in sections" :key="idx" :header="sec.title">
        <a-list :data-source="sec.items">
          <template #renderItem="{ item }">
            <a-list-item>
              <a-space>
                <a-tag v-if="item.preview">Preview</a-tag>
                <span>{{ item.title }}</span>
                <span>• {{ item.duration || '—' }}</span>
              </a-space>
            </a-list-item>
          </template>
        </a-list>
      </a-collapse-panel>
    </a-collapse>
  </a-card>
</template>
<script setup lang="ts">
defineProps<{ sections:any[] }>()
</script>
