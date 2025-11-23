<template>
  <div>
    <a-typography-title :level="5">Ratings</a-typography-title>

    <a-radio-group
      :value="minRating"
      @change="e => emit('update:minRating', e.target.value)"
      style="display:flex;gap:8px;flex-direction:column;margin-bottom:12px"
    >
      <a-radio :value="0">Any</a-radio>
      <a-radio :value="4">
        <a-rate disabled allow-half :value="4" style="font-size:14px" />&nbsp;4.0+
      </a-radio>
      <a-radio :value="3">
        <a-rate disabled allow-half :value="3" style="font-size:14px" />&nbsp;3.0+
      </a-radio>
      <a-radio :value="2">
        <a-rate disabled allow-half :value="2" style="font-size:14px" />&nbsp;2.0+
      </a-radio>
    </a-radio-group>

    <a-typography-title :level="5">Duration (hours)</a-typography-title>
    <a-slider
      range
      :min="0"
      :max="30"
      :step="1"
      :value="durationRange"
      @change="v => emit('update:durationRange', v)"
    />
    <div style="margin-bottom:12px;display:flex;gap:8px">
      <a-tag>{{ durationRange[0] }}h</a-tag>
      <a-tag>{{ durationRange[1] }}h</a-tag>
    </div>

    <a-typography-title :level="5">Level</a-typography-title>
    <a-checkbox-group
      :value="levels"
      :options="['Beginner','Intermediate','Advanced']"
      @change="v => emit('update:levels', v)"
      style="display:flex;flex-direction:column;gap:6px;margin-bottom:12px"
    />

    <a-typography-title :level="5">Language</a-typography-title>
    <a-checkbox-group
      :value="languages"
      :options="['English','Spanish','Italian','German']"
      @change="v => emit('update:languages', v)"
      style="display:flex;flex-direction:column;gap:6px;margin-bottom:12px"
    />

    <a-space>
      <a-button @click="emit('reset')">Reset</a-button>
    </a-space>

    <!-- Plugin mount inside filters -->
    <slot name="filters-extra" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  minRating: number
  durationRange: [number, number]
  levels: string[]
  languages: string[]
}>()

const emit = defineEmits([
  'update:minRating',
  'update:durationRange',
  'update:levels',
  'update:languages',
  'reset'
])
</script>
