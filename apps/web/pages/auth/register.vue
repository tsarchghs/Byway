<template>
  <a-row justify="center">
    <a-col :xs="24" :sm="18" :md="12" :lg="8">
      <a-card title="Create an account">
        <a-form layout="vertical" @finish="submit">
          <a-form-item label="First name" name="firstName" :rules="[{ required:true }]"><a-input v-model:value="form.firstName" /></a-form-item>
          <a-form-item label="Last name" name="lastName" :rules="[{ required:true }]"><a-input v-model:value="form.lastName" /></a-form-item>
          <a-form-item label="Email" name="email" :rules="[{ required:true, type:'email' }]"><a-input v-model:value="form.email" /></a-form-item>
          <a-form-item label="Password" name="password" :rules="[{ required:true, min:6 }]"><a-input-password v-model:value="form.password" /></a-form-item>
          <a-space direction="vertical" style="width:100%">
            <a-button type="primary" html-type="submit" :loading="loading" block>Sign up</a-button>
            <NuxtLink to="/auth/login">Already have an account? Log in</NuxtLink>
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
const loading = ref(false)
const form = ref<any>({ firstName:'', lastName:'', email:'', password:'' })
async function submit(){
  loading.value = true
  try{
    const res:any = await sdk.register(form.value)
    if (res?.token){ setAuth(res.token, res.user); message.success('Welcome!'); navigateTo('/') }
  }catch{ message.error('Registration failed') } finally { loading.value = false }
}
</script>
