<template>
  <a-list-item class="lesson-row" @click="onClick">
    <div :class="['lr-wrap', isActive && 'active']">
      <div class="lr-left">
        <component :is="icon" />
        <span class="lr-title">
          #{{ index + 1 }} · {{ item.title || 'Untitled' }}
        </span>
        <a-tag class="lr-type" :bordered="false">{{ item.type }}</a-tag>
        <span class="lr-min">
          <FieldTimeOutlined /> {{ Number(item.duration) || 0 }} min
        </span>
      </div>

      <div class="lr-right">
        <a-tag v-if="locked" color="default">
          <LockOutlined /> Locked
        </a-tag>
        <a-tag v-else-if="done" color="green">
          <CheckOutlined /> Done
        </a-tag>
      </div>
    </div>
  </a-list-item>
</template>

<script setup lang="ts">
import {
  VideoCameraOutlined,
  ReadOutlined,
  QuestionCircleOutlined,
  BookOutlined,
  FieldTimeOutlined,
  LockOutlined,
  CheckOutlined,
} from '@ant-design/icons-vue'
import { computed } from 'vue';

const props = defineProps<{
  item: any
  index: number
  locked: boolean
  done: boolean
  isActive: boolean
}>()

const emit = defineEmits(['select'])
const icon = computed(() => {
  switch (props.item.type) {
    case 'video':
      return VideoCameraOutlined
    case 'reading':
      return ReadOutlined
    case 'quiz':
      return QuestionCircleOutlined
    default:
      return BookOutlined
  }
})

const onClick = () => {
  if (!props.locked) emit('select', props.item.id)
}
</script>

<style scoped>
.lesson-row {
  cursor: pointer;
}
.lr-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.lr-wrap.active {
  background: #f5faff;
  border-radius: 6px;
}
.lr-left {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
}
.lr-title {
  font-weight: 600;
}
.lr-type {
  text-transform: capitalize;
}
.lr-min {
  color: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>
