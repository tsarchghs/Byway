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
import { message } from 'ant-design-vue'
import Header from '../../../../packages/shared-ui/src/components/Header.vue'
import SignInForm from './SignInForm.vue'
import SignUpForm from './SignUpForm.vue'
import { useAuth } from '@shared/composables/composables/useAuth'
import { useMutation } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'
// Apollo & GraphQL
import { useApolloPluginClient } from '~/composables/useApolloPluginClient'
import { onMounted } from 'vue'
// automatically uses /api/authentication/graphql
useApolloPluginClient()
const auth = useAuth()

const activeTab = ref('signin')

// --- GraphQL mutations ---
const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user { id email teacherProfileId }
    }
  }
`

const REGISTER_MUTATION = gql`
  mutation Register($email: String!, $password: String!, $firstName: String, $lastName: String) {
    register(email: $email, password: $password, firstName: $firstName, lastName: $lastName) {
      id
      email
    }
  }
`

// Apollo composables
const { mutate: login, onDone: onLoginDone, onError: onLoginError } = useMutation(LOGIN_MUTATION)
const { mutate: register, onDone: onRegisterDone, onError: onRegisterError } = useMutation(REGISTER_MUTATION)

// --- handlers ---
const handleSignIn = (data) => {
  login({
    email: data.email,
    password: data.password,
  })
}


onLoginDone(({ data }) => {
  const { token, user } = data.login
  auth.login({ token, user })
  message.success(`Welcome back, ${user.email}`)
  navigateTo('/') // redirect to homepage
})

onLoginError((err) => {
  message.error(err.message)
})

const handleSignUp = (data) => {
  if (data.password !== data.confirm) {
    return message.error('Passwords do not match')
  }
  register({
    email: data.email,
    password: data.password,
    firstName: data.firstName,
    lastName: data.lastName,
  })
}

onRegisterDone(({ data }) => {
  message.success(`Account created for ${data.register.email}`)
})

onRegisterError((err) => {
  message.error(err.message)
})

onMounted(() => {
  if (auth.isLoggedIn.value) {
    // Already logged in → go home or profile
    navigateTo('/')
  }
})
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
