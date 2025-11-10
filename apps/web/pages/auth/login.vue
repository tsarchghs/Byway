<template>
  <a-row justify="center">
    <a-col :xs="24" :sm="18" :md="12" :lg="8">
      <a-card title="Log in">
        <a-form layout="vertical" @finish="submit">
          <a-form-item label="Email" name="email" :rules="[{ required:true, type:'email' }]">
            <a-input v-model:value="email" type="email" autocomplete="email" />
          </a-form-item>
          <a-form-item label="Password" name="password" :rules="[{ required:true }]" >
            <a-input-password v-model:value="password" autocomplete="current-password" />
          </a-form-item>
          <a-space direction="vertical" style="width:100%">
            <a-button type="primary" html-type="submit" :loading="loading" block>Log in</a-button>
            <NuxtLink to="/auth/register">Need an account? Register</NuxtLink>
          </a-space>
        </a-form>
      </a-card>
    </a-col>
  </a-row>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { useUser } from '~/composables/useUser'
import { useSdk } from '~/composables/useSdk'
const { setAuth } = useUser()
const sdk = useSdk()
const email = ref('demo@example.com')
const password = ref('demo1234')
const loading = ref(false)
async function submit(){
  loading.value = true
  try{
    const res:any = await sdk.login(email.value, password.value)
    if (res?.token){ setAuth(res.token, res.user); message.success('Welcome back!'); navigateTo('/') }
  }catch{ message.error('Login failed') } finally { loading.value = false }
}
</script>
