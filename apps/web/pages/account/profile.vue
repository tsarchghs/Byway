<template>
  <a-card title="Profile">
    <a-form layout="vertical" @finish="save">
      <a-form-item label="First name"><a-input v-model:value="me.firstName" /></a-form-item>
      <a-form-item label="Last name"><a-input v-model:value="me.lastName" /></a-form-item>
      <a-form-item label="Headline"><a-input v-model:value="me.headline" /></a-form-item>
      <a-form-item label="Bio"><a-textarea v-model:value="me.bio" :rows="4" /></a-form-item>
      <a-form-item label="Roles">
        <a-select v-model:value="roles" mode="multiple" :options="roleOpts" style="width:100%" />
      </a-form-item>
      <a-button type="primary" html-type="submit">Save</a-button>
    </a-form>
  </a-card>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { useUser } from '~/composables/useUser'
const { me, roles } = useUser() as any
const roleOpts = [{label:'student',value:'student'},{label:'instructor',value:'instructor'},{label:'admin',value:'admin'}]
function save(){ if (process.client){ localStorage.setItem('byway_me', JSON.stringify(me.value)); message.success('Saved') } }
</script>
