
<template>
  <a-layout-header class="byway-header">
    <div class="header-inner">
      <NuxtLink to="/" class="logo">
        <img src="/plugins/homepage/logo.png" alt="Byway" class="logo-image" />
        <span class="logo-text">Byway</span>
      </NuxtLink>

      <nav class="nav">
        <NuxtLink to="/explore" class="nav-link">Explore</NuxtLink>
        <NuxtLink to="/courses" class="nav-link">Courses</NuxtLink>
        <NuxtLink to="/institutions" class="nav-link">Institutions</NuxtLink>
        <NuxtLink to="/assignments" class="nav-link">Assignments</NuxtLink>
        <NuxtLink to="/analytics" class="nav-link">Analytics</NuxtLink>
      </nav>

      <div class="actions">
        <template v-if="isLoggedIn">
          <a-badge :count="items.length">
            <a-button type="text" @click="cartOpen=true">
              <template #icon><ShoppingCartOutlined /></template>
              Cart
            </a-button>
          </a-badge>
          <a-dropdown>
            <a-button type="text">
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
          <NuxtLink to="/login"><a-button>Sign in</a-button></NuxtLink>
        </template>
      </div>
    </div>

    <a-drawer v-model:open="cartOpen" title="Your cart" placement="right" width="420">
      <a-list :data-source="items" :renderItem="renderCartItem"/>
      <div v-if="!items.length" class="empty-cart">
        <ShoppingCartOutlined style="font-size:40px;margin-bottom:12px" />
        <div>Your cart is empty</div>
      </div>
    </a-drawer>
  </a-layout-header>
</template>

<script setup lang="ts">
import { ref, h } from 'vue'
import { ShoppingCartOutlined, DownOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { useAuth } from '@/packages/shared-ui/src/composables/useAuth'
import { useCart } from '@/packages/shared-ui/src/composables/useCart'

const { user, isLoggedIn, logout } = useAuth()
const { items, fetchCart, removeFromCart } = useCart()

const cartOpen = ref(false)
if (isLoggedIn.value) fetchCart()

function doLogout() { logout() }

function renderCartItem(item:any) {
  return h('div', { class: 'cart-item' }, [
    h('div', { class: 'cart-title' }, `Course ${item.courseId}`),
    h('div', { class: 'cart-actions' }, [
      h('span', {}, `×${item.quantity}`),
      h('a', { onClick: () => removeFromCart(item.id) }, [ h(DeleteOutlined) ])
    ])
  ])
}
</script>

<style scoped>
.byway-header { display:flex; align-items:center; padding:0 16px; }
.header-inner { display:flex; align-items:center; justify-content:space-between; width:100%; }
.logo { display:flex; align-items:center; gap:8px; color:inherit; text-decoration:none; }
.logo-image { height:28px; }
.nav { display:flex; gap:12px; }
.nav-link { color:#fff; opacity:.9; }
.actions { display:flex; align-items:center; gap:8px; }
.cart-item { display:flex; align-items:center; justify-content:space-between; padding:8px 0; border-bottom:1px solid rgba(0,0,0,.06); }
.empty-cart { text-align:center; color:rgba(0,0,0,.45); padding:24px 0; }
</style>
