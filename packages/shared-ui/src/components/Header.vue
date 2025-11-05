<template>
  <a-layout-header class="byway-header">
    <div class="header-inner">
      <!-- 🪶 Logo -->
      <NuxtLink to="/" class="logo">
        <img
          src="http://localhost:4000/plugins/homepage/logo.png"
          alt="Byway logo"
          class="logo-image"
        />
        <span class="logo-text">Byway</span>
      </NuxtLink>

      <!-- 📚 Navigation -->
      <nav class="nav">
        <NuxtLink to="/categories" class="nav-link">Categories</NuxtLink>
      </nav>

      <!-- 🔍 Search -->
      <a-input-search
        v-model:value="q"
        placeholder="Search courses..."
        allow-clear
        style="width: 260px"
      />

      <!-- 🎓 Teach -->
      <NuxtLink to="/teach" class="teach-link">Teach on Byway</NuxtLink>

      <!-- ⚙️ Actions -->
      <div class="actions">
        <!-- 🛒 Cart -->
        <a-badge :count="cart.items.length" show-zero>
          <a-button
            type="text"
            shape="circle"
            @click="openCart = true"
            aria-label="Cart"
            class="cart-btn"
          >
            <ShoppingCartOutlined style="font-size:20px" />
          </a-button>
        </a-badge>

        <!-- 🔐 Auth Section -->
        <template v-if="!isLoggedIn">
          <a-button href="/auth/login">Log In</a-button>
          <a-button type="primary" href="/auth/signup">Sign Up</a-button>
        </template>

        <template v-else>
          <a-dropdown>
            <a class="ant-dropdown-link" @click.prevent>
              <UserOutlined /> {{ user.email }}
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <NuxtLink to="/profile">Profile</NuxtLink>
                </a-menu-item>
                <a-menu-item @click="logout">Logout</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>
      </div>
    </div>

    <!-- 🧾 Cart Drawer -->
    <a-drawer
      v-model:open="openCart"
      placement="right"
      width="360"
      title="Your Cart"
    >
      <template v-if="cart.items.length > 0">
        <a-list
          :data-source="cart.items"
          item-layout="horizontal"
          :renderItem="renderCartItem"
        />
        <a-divider />
        <div
          style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;"
        >
          <span><strong>Total:</strong></span>
          <span><strong>{{ euro(cart.total) }}</strong></span>
        </div>
        <a-button type="primary" block size="large">Checkout</a-button>
      </template>

      <template v-else>
        <div
          style="text-align:center;padding:48px 0;color:rgba(0,0,0,.45)"
        >
          <ShoppingCartOutlined style="font-size:40px;margin-bottom:12px" />
          <div>Your cart is empty</div>
        </div>
      </template>
    </a-drawer>
  </a-layout-header>
</template>

<script setup lang="ts">
import { ref, h, computed } from 'vue'
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons-vue'
import { useCart } from '../composables/useCart'
import { useAuth } from '../composables/useAuth'

const q = ref('')
const openCart = ref(false)
const cart = useCart()
const auth = useAuth()

const user = computed(() => auth.user.value)
const isLoggedIn = computed(() => auth.isLoggedIn.value)

function logout() {
  auth.logout()
}

function renderCartItem(item: any) {
  return h('a-list-item', {}, {
    default: () =>
      h('div', { style: 'display:flex;align-items:center;gap:10px;' }, [
        h('img', {
          src: item.image,
          style: 'width:48px;height:48px;object-fit:cover;border-radius:6px;',
        }),
        h('div', null, [
          h('div', { style: 'font-weight:500' }, item.title),
          h(
            'div',
            { style: 'color:rgba(0,0,0,.45);font-size:13px' },
            `€${item.price.toFixed(2)}`
          ),
        ]),
      ]),
  })
}

function euro(v: number) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(v)
}
</script>

<style scoped>
.byway-header {
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  padding: 0 24px;
}
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  max-width: 1200px;
  margin: 0 auto;
  gap: 1rem;
}
.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}
.logo-image {
  width: 30px;
  height: 30px;
}
.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: #001529;
}
.nav {
  flex: 1;
  display: flex;
  gap: 1rem;
}
.nav-link {
  color: #000;
  text-decoration: none;
}
.nav-link:hover {
  color: #1677ff;
}
.actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.cart-btn {
  transition: transform 0.2s ease;
}
.cart-btn:hover {
  transform: scale(1.1);
}
</style>
