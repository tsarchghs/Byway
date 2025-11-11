<template>
  <div v-if="show" class="role-switch">
    <a-select :value="role" size="small" style="width: 140px" @change="onChange">
      <a-select-option value="guest">Guest</a-select-option>
      <a-select-option value="student">Student</a-select-option>
      <a-select-option value="teacher">Teacher</a-select-option>
      <a-select-option value="admin">Admin</a-select-option>
    </a-select>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoles } from '../composables/useRoles'
const { role, setRole } = useRoles()
const show = computed(() => process.env.NODE_ENV !== 'production')
function onChange(v: string){ setRole(v as any) }
</script>

<style scoped>
.role-switch { margin-left: 8px; }
</style>
