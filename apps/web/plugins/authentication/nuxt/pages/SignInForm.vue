<template>
  <a-form
    layout="vertical"
    :model="form"
    :rules="rules"
    @finish="onSubmit"
    class="signin-form"
  >
    <a-form-item name="email" label="Email">
      <a-input
        v-model:value="form.email"
        placeholder="Enter your email address"
      >
        <template #prefix>
          <MailOutlined />
        </template>
      </a-input>
    </a-form-item>

    <a-form-item name="password" label="Password">
      <a-input-password
        v-model:value="form.password"
        placeholder="Enter your password"
      >
        <template #prefix>
          <LockOutlined />
        </template>
      </a-input-password>
    </a-form-item>

    <div class="signin-actions">
      <a-checkbox v-model:checked="form.remember">Remember me</a-checkbox>
      <a-typography-link href="/forgot-password" class="forgot-link">
        Forgot password?
      </a-typography-link>
    </div>

    <a-form-item>
      <a-button
        type="primary"
        html-type="submit"
        block
        :loading="loading"
      >
        Sign In
      </a-button>
    </a-form-item>

    <a-divider>Or sign in with</a-divider>

    <a-space direction="vertical" style="width: 100%">
      <a-button block icon="<GoogleOutlined />">Google</a-button>
      <a-button block icon="<FacebookFilled />">Facebook</a-button>
      <a-button block icon="<WindowsFilled />">Microsoft</a-button>
    </a-space>
  </a-form>
</template>

<script setup>
import { reactive, ref } from 'vue'
import {
  MailOutlined,
  LockOutlined,
  GoogleOutlined,
  FacebookFilled,
  WindowsFilled,
} from '@ant-design/icons-vue'

const emit = defineEmits(['submit'])

const form = reactive({
  email: '',
  password: '',
  remember: false,
})

const loading = ref(false)

const rules = {
  email: [
    { required: true, message: 'Please enter your email', trigger: 'blur' },
    { type: 'email', message: 'Invalid email format', trigger: 'blur' },
  ],
  password: [
    { required: true, message: 'Please enter your password', trigger: 'blur' },
  ],
}

const onSubmit = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    emit('submit', { ...form })
  }, 800)
}
</script>

<style scoped>
.signin-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.signin-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.forgot-link {
  font-size: 14px;
  color: #1677ff;
}
</style>
