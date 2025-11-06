<template>
  <Header />
  <a-layout-content class="teach-page">
    <div class="teach-container">
      <!-- HERO -->
      <section class="hero">
        <a-row align="middle" justify="space-between" gutter="48">
          <a-col :xs="24" :md="12">
            <a-typography-title :level="1">
              Become a Teacher on Byway
            </a-typography-title>
            <a-typography-paragraph type="secondary">
              Share your knowledge, inspire learners, and grow your teaching career.
            </a-typography-paragraph>
          </a-col>
          <a-col :xs="0" :md="12">
            <img src="/images/teach-hero.png" alt="Teach" class="hero-image" />
          </a-col>
        </a-row>
      </section>

      <!-- ONBOARD STEPS -->
      <section class="onboard">
        <a-steps :current="currentStep" class="steps" size="small">
          <a-step title="User Account" v-if="!isLoggedIn" />
          <a-step title="Teacher Profile" />
          <a-step title="Complete" />
        </a-steps>

        <a-card class="form-card">
          <!-- Step 1: User Registration -->
          <div v-if="currentStep === 0 && !isLoggedIn">
            <a-typography-title :level="3">Create Your Account</a-typography-title>
            <a-form layout="vertical" :model="userForm" @finish="handleUserSubmit">
              <a-form-item label="Full Name" name="name" required>
                <a-input v-model:value="userForm.name" />
              </a-form-item>
              <a-form-item label="Email" name="email" required>
                <a-input type="email" v-model:value="userForm.email" />
              </a-form-item>
              <a-form-item label="Password" name="password" required>
                <a-input-password v-model:value="userForm.password" />
              </a-form-item>
              <a-button type="primary" html-type="submit" block>Continue</a-button>
            </a-form>
          </div>

          <!-- Step 2: Teacher Profile -->
          <div v-if="currentStep === stepIndex('teacher')">
            <a-typography-title :level="3">Your Teacher Profile</a-typography-title>
            <a-form layout="vertical" :model="teacherForm" @finish="handleTeacherSubmit">
              <a-form-item label="Bio" name="bio" required>
                <a-textarea
                  v-model:value="teacherForm.bio"
                  rows="3"
                  placeholder="Tell learners about yourself..."
                />
              </a-form-item>

              <a-form-item label="Subjects" name="subjects" required>
                <a-select
                  mode="tags"
                  placeholder="e.g. Design, Programming, Marketing"
                  v-model:value="teacherForm.subjects"
                />
              </a-form-item>

              <a-form-item label="Avatar URL" name="avatarUrl">
                <a-input v-model:value="teacherForm.avatarUrl" placeholder="https://..." />
              </a-form-item>

              <a-form-item label="Payout Email" name="payoutEmail">
                <a-input
                  type="email"
                  v-model:value="teacherForm.payoutEmail"
                  placeholder="for receiving earnings"
                />
              </a-form-item>

              <a-button type="primary" html-type="submit" block>
                Save & Continue
              </a-button>
            </a-form>
          </div>

          <!-- Step 3: Complete -->
          <div v-if="currentStep === stepIndex('complete')" class="done">
            <a-result
              status="success"
              title="You're officially a Byway Instructor!"
              sub-title="Start creating your first course now."
            >
              <template #extra>
                <a-button type="primary" @click="goToDashboard">
                  Go to Dashboard
                </a-button>
              </template>
            </a-result>
          </div>
        </a-card>
      </section>
    </div>
  </a-layout-content>
</template>

<script setup lang="ts">
import Header from '../../../../packages/shared-ui/src/components/Header.vue'
import { ref, computed } from 'vue'
import { message } from 'ant-design-vue'
import { useAuth } from '../../../../packages/shared-ui/src/composables/useAuth'
import { useRouter } from 'vue-router'
import { watchEffect } from 'vue'
const auth = useAuth()
const user = computed(() => auth.user.value)
const token = computed(() => auth.token.value)
const isLoggedIn = computed(() => auth.isLoggedIn.value)
const currentStep = ref(isLoggedIn.value ? 1 : 0)

const stepIndex = (type: 'user' | 'teacher' | 'complete') =>
  isLoggedIn.value
    ? type === 'teacher'
      ? 1
      : type === 'complete'
      ? 2
      : 0
    : type === 'user'
    ? 0
    : type === 'teacher'
    ? 1
    : 2

// ==============================
// Step 1 — Register User
// ==============================
const userForm = ref({ name: '', email: '', password: '' })

async function handleUserSubmit() {
  try {
    const res = await fetch('http://localhost:4000/api/authentication/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          mutation($email:String!,$password:String!,$name:String){
            register(email:$email, password:$password, firstName:$name) {
              id
              email
              firstName
              token
            }
          }
        `,
        variables: userForm.value,
      }),
    })

    const json = await res.json()
    const created = json.data?.register
    if (!created?.id) throw new Error('User registration failed')

    // Store auth data
    const fakeToken = created.token // replace with real JWT if auth plugin issues one
    auth.login({
      token: fakeToken,
      user: { id: created.id, email: created.email, name: created.firstName },
    })

    message.success('Account created! Continue to fill your teacher profile.')
    currentStep.value = 1
  } catch (err: any) {
    message.error(err.message || 'Account creation failed.')
  }
}

// ==============================
// Step 2 — Teacher Profile
// ==============================
const teacherForm = ref({
  bio: '',
  subjects: [],
  avatarUrl: '',
  payoutEmail: '',
})
const router = useRouter()

watchEffect(() => {
  // ✅ If logged in AND already has a teacher profile, redirect immediately
  if (isLoggedIn.value && user.value?.teacherProfileId) {
    router.push(`/teach-internal/${user.value.teacherProfileId}`)
  }
})
async function handleTeacherSubmit() {
  try {
    if (!token.value) throw new Error('Not authenticated.')

    const formattedSubjects = Array.isArray(teacherForm.value.subjects)
      ? teacherForm.value.subjects.join(', ')
      : teacherForm.value.subjects

    // 1️⃣ Create the teacher profile in the teach plugin
    const createRes = await fetch('http://localhost:4000/api/teach/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.value}`,
      },
      body: JSON.stringify({
        query: `
          mutation($bio:String!,$subjects:String,$avatarUrl:String,$payoutEmail:String){
            createTeacherProfile(bio:$bio,subjects:$subjects,avatarUrl:$avatarUrl,payoutEmail:$payoutEmail){
              id
            }
          }
        `,
        variables: {
          bio: teacherForm.value.bio,
          subjects: formattedSubjects,
          avatarUrl: teacherForm.value.avatarUrl,
          payoutEmail: teacherForm.value.payoutEmail,
        },
      }),
    })

    const createdJson = await createRes.json()
    if (createdJson.errors) throw new Error(createdJson.errors[0]?.message)
    const teacherProfileId = createdJson.data?.createTeacherProfile?.id
    if (!teacherProfileId) throw new Error('Teacher profile ID missing.')

    // 2️⃣ Update the user in the authentication plugin to link teacherProfileId
    const linkRes = await fetch('http://localhost:4000/api/authentication/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.value}`,
      },
      body: JSON.stringify({
        query: `
          mutation($teacherProfileId:String!){
            updateUserTeacherProfile(teacherProfileId:$teacherProfileId){
              id
              teacherProfileId
            }
          }
        `,
        variables: { teacherProfileId },
      }),
    })

    const linkJson = await linkRes.json()
    if (linkJson.errors) throw new Error(linkJson.errors[0]?.message)

    // 3️⃣ Optionally refresh the local auth user
    auth.login({
      token: token.value,
      user: {
        ...user.value,
        teacherProfileId,
      },
    })

    message.success('Teacher profile created and linked successfully!')
    currentStep.value = 2
  } catch (err: any) {
    message.error(err.message || 'Failed to save teacher profile.')
  }
}

// ==============================
// Step 3 — Completion
// ==============================
function goToDashboard() {
  const userId = user.value?.id
  if (!userId) return message.error('Missing user.')
  window.location.href = `http://localhost:3000/teach-internal/${userId}`
}
</script>

<style scoped>
.teach-page {
  background: #fafafa;
  padding: 80px 24px;
  display: flex;
  justify-content: center;
}
.teach-container {
  width: 100%;
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  gap: 48px;
}
.hero-image {
  width: 100%;
  border-radius: 12px;
}
.steps {
  margin-bottom: 32px;
  text-align: center;
}
.form-card {
  max-width: 600px;
  margin: 0 auto;
  border-radius: 12px;
}
.done {
  text-align: center;
}
</style>
