<template>
  <a-form layout="vertical" :model="form" :rules="rules" @finish="onSubmit">
    <a-form-item name="firstName" label="First Name">
      <a-input v-model:value="form.firstName" placeholder="Enter your first name" />
    </a-form-item>

    <a-form-item name="lastName" label="Last Name">
      <a-input v-model:value="form.lastName" placeholder="Enter your last name" />
    </a-form-item>

    <a-form-item name="email" label="Email">
      <a-input v-model:value="form.email" placeholder="Enter your email" />
    </a-form-item>

    <a-form-item name="password" label="Password">
      <a-input-password v-model:value="form.password" placeholder="Enter your password" />
    </a-form-item>

    <a-form-item name="confirm" label="Confirm Password" :rules="[{ validator: validateConfirm }]">
      <a-input-password v-model:value="form.confirm" placeholder="Repeat your password" />
    </a-form-item>

    <a-form-item>
      <a-button type="primary" html-type="submit" block :loading="loading">
        Create Account
      </a-button>
    </a-form-item>

    <a-divider>Or sign up with</a-divider>
    <a-space direction="vertical" style="width:100%">
      <a-button block icon="<GoogleOutlined />">Google</a-button>
      <a-button block icon="<FacebookFilled />">Facebook</a-button>
      <a-button block icon="<WindowsFilled />">Microsoft</a-button>
    </a-space>
  </a-form>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { GoogleOutlined, FacebookFilled, WindowsFilled } from '@ant-design/icons-vue'

const emit = defineEmits(['submit'])

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirm: ''
})

const loading = ref(false)

const rules = {
  firstName: [{ required: true, message: 'Please enter your first name' }],
  lastName: [{ required: true, message: 'Please enter your last name' }],
  email: [
    { required: true, message: 'Please enter your email' },
    { type: 'email', message: 'Invalid email format' }
  ],
  password: [{ required: true, message: 'Please enter your password' }],
  confirm: [{ required: true, message: 'Please confirm your password' }]
}

const validateConfirm = (_rule, value) => {
  if (value !== form.password) return Promise.reject('Passwords do not match')
  return Promise.resolve()
}

const onSubmit = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    emit('submit', { ...form })
  }, 800)
}
</script>
