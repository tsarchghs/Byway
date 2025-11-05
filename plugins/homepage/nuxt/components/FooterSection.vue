<template>
  <a-layout-footer class="footer">
    <div class="footer-container">
      <a-row :gutter="[48, 48]" justify="start">
        <!-- About -->
        <a-col :xs="24" :sm="24" :md="12" :lg="8">
          <a-space direction="vertical" size="middle">
            <img src="http://localhost:4000/plugins/homepage/image 4.png" alt="Byway Logo" class="footer-logo" />
            <a-typography-text class="footer-text">
              Empowering learners through accessible and engaging online education.
              Byway is a leading online learning platform dedicated to providing
              high-quality, flexible, and affordable educational experiences.
            </a-typography-text>
          </a-space>
        </a-col>

        <!-- Get Help -->
        <a-col :xs="12" :sm="12" :md="6" :lg="4">
          <a-typography-title :level="5" class="footer-title">Get Help</a-typography-title>
          <a-menu theme="dark" mode="vertical" selectable="false" class="footer-menu">
            <a-menu-item><NuxtLink to="/contact">Contact Us</NuxtLink></a-menu-item>
            <a-menu-item><NuxtLink to="/articles">Latest Articles</NuxtLink></a-menu-item>
            <a-menu-item><NuxtLink to="/faq">FAQ</NuxtLink></a-menu-item>
          </a-menu>
        </a-col>

        <!-- Programs -->
        <a-col :xs="12" :sm="12" :md="6" :lg="4">
          <a-typography-title :level="5" class="footer-title">Programs</a-typography-title>
          <a-menu theme="dark" mode="vertical" selectable="false" class="footer-menu">
            <a-menu-item><NuxtLink to="/programs/design">Art & Design</NuxtLink></a-menu-item>
            <a-menu-item><NuxtLink to="/programs/business">Business</NuxtLink></a-menu-item>
            <a-menu-item><NuxtLink to="/programs/it">IT & Software</NuxtLink></a-menu-item>
            <a-menu-item><NuxtLink to="/programs/languages">Languages</NuxtLink></a-menu-item>
            <a-menu-item><NuxtLink to="/programs/programming">Programming</NuxtLink></a-menu-item>
          </a-menu>
        </a-col>

        <!-- Contact -->
        <a-col :xs="24" :sm="24" :md="12" :lg="8">
          <a-typography-title :level="5" class="footer-title">Contact Us</a-typography-title>
          <a-space direction="vertical" size="small" class="footer-contact">
            <a-space>
              <EnvironmentOutlined /> <a-typography-text>123 Main Street, Anytown, CA 12345</a-typography-text>
            </a-space>
            <a-space>
              <PhoneOutlined /> <a-typography-text>+(123) 456-7890</a-typography-text>
            </a-space>
            <a-space>
              <MailOutlined /> <a-typography-text>bywayedu@webkul.in</a-typography-text>
            </a-space>
          </a-space>

          <div class="social-icons">
            <a-tooltip title="Facebook"><FacebookFilled /></a-tooltip>
            <a-tooltip title="Twitter"><TwitterOutlined /></a-tooltip>
            <a-tooltip title="LinkedIn"><LinkedinFilled /></a-tooltip>
            <a-tooltip title="Instagram"><InstagramFilled /></a-tooltip>
          </div>
        </a-col>
      </a-row>

      <a-divider class="footer-divider" />

      <!-- Bottom Bar -->
      <div class="footer-bottom">
        <a-typography-text type="secondary">
          © {{ new Date().getFullYear() }} Byway Education. All rights reserved.
        </a-typography-text>
      </div>

      <a-back-top />
    </div>
  </a-layout-footer>
</template>

<script setup lang="ts">
import {
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  FacebookFilled,
  TwitterOutlined,
  LinkedinFilled,
  InstagramFilled,
} from '@ant-design/icons-vue'
</script>

<style scoped>
.footer {
  background: #001529;
  color: rgba(255, 255, 255, 0.85);
  padding: 80px 24px 40px;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-logo {
  width: 120px;
}

.footer-title {
  color: #fff !important;
  margin-bottom: 12px;
}

.footer-text {
  color: rgba(255, 255, 255, 0.75);
  font-size: 14px;
  line-height: 1.7;
}

.footer-menu a {
  color: rgba(255, 255, 255, 0.75);
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-menu a:hover {
  color: #91caff;
}

.footer-contact .ant-typography {
  color: rgba(255, 255, 255, 0.75);
}

.social-icons {
  display: flex;
  gap: 16px;
  margin-top: 16px;
  font-size: 20px;
  color: rgba(255, 255, 255, 0.75);
}

.social-icons .anticon:hover {
  color: #1677ff;
  transform: translateY(-2px);
  transition: all 0.2s ease;
}

.footer-divider {
  border-color: rgba(255, 255, 255, 0.1);
  margin-top: 40px;
}

.footer-bottom {
  text-align: center;
  margin-top: 24px;
}

@media (max-width: 768px) {
  .footer {
    padding: 64px 16px 32px;
  }
  .social-icons {
    justify-content: center;
  }
}
</style>
