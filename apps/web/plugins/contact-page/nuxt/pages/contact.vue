<template>
  <Header/>
  <a-layout-content class="contact-page">
    <div class="contact-container">
      <a-row :gutter="[48, 48]" align="top" justify="center">
        <!-- LEFT: Contact Form -->
        <a-col :xs="24" :sm="24" :md="14" :lg="12">
          <a-card bordered hoverable class="contact-card">
            <a-typography-title :level="3" class="form-title">Get in Touch</a-typography-title>
            <a-typography-text type="secondary">
              Have questions or feedback? We'd love to hear from you. Fill out the form below.
            </a-typography-text>

            <a-form
              :model="form"
              :rules="rules"
              layout="vertical"
              @finish="handleSubmit"
              class="contact-form"
            >
              <a-form-item label="Name" name="name" required>
                <a-input v-model:value="form.name" placeholder="Your full name" />
              </a-form-item>

              <a-form-item label="Email" name="email" required>
                <a-input v-model:value="form.email" type="email" placeholder="Your email address" />
              </a-form-item>

              <a-form-item label="Subject" name="subject">
                <a-input v-model:value="form.subject" placeholder="Subject" />
              </a-form-item>

              <a-form-item label="Message" name="message" required>
                <a-textarea
                  v-model:value="form.message"
                  placeholder="Type your message..."
                  :rows="5"
                />
              </a-form-item>

              <a-form-item>
                <a-button type="primary" html-type="submit" size="large" block>
                  Send Message
                </a-button>
              </a-form-item>
            </a-form>
          </a-card>
        </a-col>

        <!-- RIGHT: Contact Info -->
        <a-col :xs="24" :sm="24" :md="10" :lg="8">
          <a-card bordered class="info-card">
            <a-typography-title :level="4">Contact Information</a-typography-title>
            <a-space direction="vertical" size="large" class="info-list">
              <a-space>
                <EnvironmentOutlined class="icon" />
                <span>123 Main Street, Anytown, CA 12345</span>
              </a-space>
              <a-space>
                <PhoneOutlined class="icon" />
                <span>+(123) 456-7890</span>
              </a-space>
              <a-space>
                <MailOutlined class="icon" />
                <span>bywayedu@webkul.in</span>
              </a-space>
            </a-space>

            <a-divider />

            <a-typography-text strong>Follow Us</a-typography-text>
            <div class="social-icons">
              <a-tooltip title="Facebook"><FacebookFilled /></a-tooltip>
              <a-tooltip title="Twitter"><TwitterOutlined /></a-tooltip>
              <a-tooltip title="LinkedIn"><LinkedinFilled /></a-tooltip>
              <a-tooltip title="Instagram"><InstagramFilled /></a-tooltip>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </a-layout-content>
</template>

<script setup lang="ts">
import Header from '../../../../packages/shared-ui/src/components/Header.vue'
import {
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  FacebookFilled,
  TwitterOutlined,
  LinkedinFilled,
  InstagramFilled,
} from '@ant-design/icons-vue'
import { reactive } from 'vue'
import { message } from 'ant-design-vue'

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
})

const rules = {
  name: [{ required: true, message: 'Please enter your name', trigger: 'blur' }],
  email: [{ required: true, message: 'Please enter your email', trigger: 'blur' }],
  message: [{ required: true, message: 'Please enter a message', trigger: 'blur' }],
}

const handleSubmit = () => {
  message.success('Thank you! Your message has been sent.')
  Object.assign(form, { name: '', email: '', subject: '', message: '' })
}
</script>

<style scoped>
.contact-page {
  background: #fafafa;
  padding: 80px 24px;
  display: flex;
  justify-content: center;
}

.contact-container {
  max-width: 1200px;
  width: 100%;
}

.contact-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.form-title {
  margin-bottom: 16px;
}

.contact-form {
  margin-top: 24px;
}

.info-card {
  background: #fff;
  border-radius: 8px;
  text-align: left;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.info-list .icon {
  color: #1677ff;
  font-size: 18px;
}

.social-icons {
  display: flex;
  gap: 16px;
  font-size: 20px;
  margin-top: 12px;
  color: rgba(0, 0, 0, 0.65);
}

.social-icons .anticon:hover {
  color: #1677ff;
  transform: translateY(-2px);
  transition: all 0.2s ease;
}

@media (max-width: 768px) {
  .contact-page {
    padding: 64px 16px;
  }
}
</style>
