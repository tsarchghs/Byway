<template>
  <a-layout-header class="byway-header">
    <div class="header-inner">
      <!-- Logo -->
      <NuxtLink to="/" class="logo">
        <img src="/plugins/homepage/logo.png" alt="Byway" class="logo-image" />
        <span class="logo-text">Byway</span>
      </NuxtLink>

      <!-- Nav links -->
      <nav class="nav">
        <NuxtLink to="/explore" class="nav-link" exact-active-class="nav-active">Explore</NuxtLink>
        <NuxtLink to="/courses" class="nav-link" exact-active-class="nav-active">Courses</NuxtLink>
        <NuxtLink to="/institutions" class="nav-link" exact-active-class="nav-active">Institutions</NuxtLink>
        <NuxtLink to="/assignments" class="nav-link" exact-active-class="nav-active">Assignments</NuxtLink>
        <NuxtLink to="/analytics" class="nav-link" exact-active-class="nav-active">Analytics</NuxtLink>
      </nav>

      <!-- Actions -->
      <div class="actions">
        <template v-if="isLoggedIn">
          <a-badge :count="items.length" offset="[8,0]">
            <a-button type="text" class="cart-btn" @click="cartOpen = true">
              <ShoppingCartOutlined />
              <span class="ml-1">Cart</span>
            </a-button>
          </a-badge>

          <a-dropdown trigger="click">
            <a-button type="text" class="account-btn">
              {{ user?.email || 'Account' }} <DownOutlined />
            </a-button>
            <template #overlay>
              <a-menu>
                <a-menu-item><NuxtLink to="/dashboard">Dashboard</NuxtLink></a-menu-item>
                <a-menu-item @click="doLogout">Logout</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>

        <template v-else>
          <NuxtLink to="/login">
            <a-button type="primary" ghost>Sign in</a-button>
          </NuxtLink>
        </template>
      </div>
    </div>

    <!-- Cart Drawer -->
    <a-drawer v-model:open="cartOpen" title="Your Cart" placement="right" width="420">
      <template v-if="items.length">
        <a-list :data-source="items" :renderItem="renderCartItem" />
      </template>
      <template v-else>
        <div class="empty-cart">
          <ShoppingCartOutlined style="font-size:40px;margin-bottom:12px" />
          <div>Your cart is empty</div>
        </div>
      </template>
    </a-drawer>
  </a-layout-header>
</template>

<script setup lang="ts">
import { ref, h } from 'vue'
import { ShoppingCartOutlined, DownOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { useAuth } from '../../../shared-ui/src/composables/useAuth'
import { useCart } from '../../../shared-ui/src/composables/useCart'

const { user, isLoggedIn, logout } = useAuth()
const { items, fetchCart, removeFromCart } = useCart()

const cartOpen = ref(false)
if (isLoggedIn.value) fetchCart()

function doLogout() {
  logout()
}

function renderCartItem(item: any) {
  return h('div', { class: 'cart-item' }, [
    h('div', { class: 'cart-title' }, `Course ${item.courseId}`),
    h('div', { class: 'cart-actions' }, [
      h('span', {}, `×${item.quantity}`),
      h('a', {
        onClick: () => removeFromCart(item.id),
        style: 'margin-left:8px;color:#f5222d;cursor:pointer;'
      }, [h(DeleteOutlined)])
    ])
  ])
}
</script>

<style scoped>
.byway-header {
  background: #001529;
  color: #fff;
  line-height: 64px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  height: 64px;
}
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  text-decoration: none;
}
.logo-image {
  height: 28px;
}
.logo-text {
  font-weight: 600;
  font-size: 18px;
}
.nav {
  display: flex;
  gap: 20px;
}
.nav-link {
  color: #fff;
  opacity: 0.85;
  transition: opacity 0.2s;
}
.nav-link:hover,
.nav-active {
  opacity: 1;
  text-decoration: underline;
}
.actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
.cart-btn, .account-btn {
  color: #fff !important;
}
.cart-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid rgba(0,0,0,.06);
}
.empty-cart {
  text-align: center;
  color: rgba(0,0,0,.45);
  padding: 24px 0;
}
</style>
