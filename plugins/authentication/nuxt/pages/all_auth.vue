<template>
  <Header />

  <a-row class="signin-section">
    <!-- Left Form -->
    <a-col :xs="24" :md="14" class="signin-content">
      <a-card class="signin-card" bordered>
        <a-tabs v-model:activeKey="activeTab" centered>
          <a-tab-pane key="signin" tab="Sign In">
            <SignInForm @submit="handleSignIn" />
          </a-tab-pane>

          <a-tab-pane key="signup" tab="Create Account">
            <SignUpForm @submit="handleSignUp" />
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </a-col>

    <!-- Right Side Image -->
    <a-col :xs="0" :md="10" class="signin-image" />
  </a-row>
</template>

<script setup>
import { ref } from 'vue'
import Header from '../../../../packages/shared-ui/src/components/Header.vue'
import { message } from 'ant-design-vue'
import SignInForm from './SignInForm.vue'
import SignUpForm from './SignUpForm.vue'

const activeTab = ref('signin')

const handleSignIn = (data) => {
  console.log('Sign In Data:', data)
  message.success(`Welcome back, ${data.email}`)
}

const handleSignUp = (data) => {
  console.log('Sign Up Data:', data)
  message.success(`Account created for ${data.email}`)
}
</script>

<style scoped>
.signin-section {
  min-height: 100vh;
  background: #f0f5ff;
}
.signin-content {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 40px;
  background: #fff;
}
.signin-card {
  width: 100%;
  max-width: 460px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}
.signin-image {
  background: url('signin-bg.jpg') center/cover no-repeat;
  min-height: 100vh;
}
</style>
