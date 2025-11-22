<template>
  <a-layout-header class="byway-header">
    <div class="header-inner">
      <!-- Logo -->
      <NuxtLink to="/" class="logo">
        <img  alt="Byway" class="logo-image" />
        <span class="logo-text">Byway</span>
      </NuxtLink>

      <!-- Nav links -->
      <nav class="nav">
        <NuxtLink to="/categories" class="nav-link" exact-active-class="nav-active">Browse</NuxtLink>
        <NuxtLink to="/course-author" class="nav-link" exact-active-class="nav-active">Teach</NuxtLink>
        <NuxtLink to="/institutions" class="nav-link" exact-active-class="nav-active">Institutions</NuxtLink>
        <NuxtLink to="/students" class="nav-link" exact-active-class="nav-active">My Learning</NuxtLink>
      </nav>

      <!-- Actions -->
      <div class="actions">
        <template v-if="isLoggedIn">
          <a-badge :count="itemCount" :number-style="{ backgroundColor: '#52c41a' }" :offset="[8, 0]">
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
                <a-menu-item><NuxtLink to="/students">My Learning</NuxtLink></a-menu-item>
                <a-menu-item><NuxtLink to="/cart">Cart</NuxtLink></a-menu-item>
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
    <a-drawer 
      v-model:open="cartOpen" 
      title="Your Cart" 
      placement="right" 
      width="420"
      :closable="true"
    >
      <template v-if="loading">
        <a-spin style="width: 100%; text-align: center; padding: 24px" />
      </template>

      <template v-else-if="!isEmpty">
        <a-list 
          :data-source="items" 
          :renderItem="renderCartItem"
          :loading="loading"
        />
        
        <a-divider />
        
        <div class="cart-footer">
          <div class="cart-total">
            <div><span class="total-label">Items:</span> <span class="total-value">{{ itemCount }}</span></div>
            <div><span class="total-label">Subtotal:</span> <span class="total-value">€{{ totalPrice.toFixed(2) }}</span></div>
          </div>
          <a-space style="width: 100%; margin-top: 12px">
            <a-button block @click="handleClearCart" :loading="loading">
              Clear Cart
            </a-button>
            <NuxtLink to="/cart" style="flex: 1">
              <a-button type="primary" block @click="cartOpen = false">
                Go to Cart
              </a-button>
            </NuxtLink>
          </a-space>
          <NuxtLink to="/cart" style="width: 100%; display: block; margin-top: 8px">
            <a-button type="primary" block danger @click="cartOpen = false">
              Proceed to checkout
            </a-button>
          </NuxtLink>
        </div>
      </template>

      <template v-else>
        <div class="empty-cart">
          <ShoppingCartOutlined style="font-size: 48px; color: #d9d9d9; margin-bottom: 16px" />
          <div class="empty-text">Your cart is empty</div>
          <div class="empty-hint">Add courses to get started</div>
          <NuxtLink to="/categories">
            <a-button type="primary" style="margin-top: 16px" @click="cartOpen = false">
              Browse Courses
            </a-button>
          </NuxtLink>
        </div>
      </template>
    </a-drawer>
  </a-layout-header>
</template>

<script setup lang="ts">
import { ref, h, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ShoppingCartOutlined, DownOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { useAuth } from '../../../shared-ui/src/composables/useAuth'
import { useCart } from '../../../shared-ui/src/composables/useCart'
import { message, Modal } from 'ant-design-vue'

const router = useRouter()
const { user, isLoggedIn, logout } = useAuth()
const { cart, items, itemCount, totalPrice, loading, isEmpty, fetchCart, removeFromCart, clearCart } = useCart()

const cartOpen = ref(false)

// Fetch cart when user logs in
watch(isLoggedIn, (loggedIn) => {
  if (loggedIn) {
    fetchCart()
  }
}, { immediate: true })

function doLogout() {
  logout()
  cartOpen.value = false
}

async function handleRemoveItem(item: any) {
  try {
    await removeFromCart(item.id)
    message.success('Item removed from cart')
  } catch (e: any) {
    message.error(e?.message || 'Failed to remove item')
  }
}

async function handleClearCart() {
  Modal.confirm({
    title: 'Clear Cart?',
    content: 'Are you sure you want to remove all items from your cart?',
    okText: 'Clear',
    okType: 'danger',
    cancelText: 'Cancel',
    onOk: async () => {
      try {
        await clearCart()
        message.success('Cart cleared')
      } catch (e: any) {
        message.error(e?.message || 'Failed to clear cart')
      }
    }
  })
}

function renderCartItem(item: any) {
  const title = item.titleSnapshot || `Course ${item.courseId}`
  const price = typeof item.priceSnapshot === 'number' ? item.priceSnapshot : null
  return h('div', { class: 'cart-item' }, [
    h('div', { class: 'cart-item-main' }, [
      h('div', { class: 'cart-item-title' }, title),
      h('div', { class: 'cart-item-meta' }, [
        h('span', `Qty: ${item.quantity}`),
        price !== null ? h('span', { class: 'cart-price' }, ` · €${price.toFixed(2)}`) : null
      ].filter(Boolean))
    ]),
    h('div', { class: 'cart-item-actions' }, [
      h('a', {
        class: 'cart-action-btn',
        onClick: () => handleRemoveItem(item),
        title: 'Remove from cart'
      }, [h(DeleteOutlined)]),
      h('a', {
        class: 'cart-action-btn',
        onClick: () => {
          cartOpen.value = false
          router.push(`/course/${encodeURIComponent(item.courseId)}`)
        },
        title: 'View course'
      }, 'View')
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
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0,0,0,.1);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  text-decoration: none;
  font-weight: 600;
}

.logo:hover {
  opacity: 0.9;
}

.logo-image {
  height: 28px;
  width: auto;
}

.logo-text {
  font-weight: 600;
  font-size: 18px;
}

.nav {
  display: flex;
  gap: 20px;
  flex: 1;
  justify-content: center;
}

.nav-link {
  color: #fff;
  opacity: 0.85;
  transition: opacity 0.2s;
  text-decoration: none;
  padding: 0 8px;
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

.cart-btn:hover, .account-btn:hover {
  background: rgba(255,255,255,.1) !important;
}

/* Cart Drawer Styles */
.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(0,0,0,.06);
}

.cart-item:last-child {
  border-bottom: none;
}

.cart-item-main {
  flex: 1;
}

.cart-item-title {
  font-weight: 500;
  color: rgba(0,0,0,.85);
  margin-bottom: 4px;
}

.cart-item-meta {
  font-size: 12px;
  color: rgba(0,0,0,.45);
}

.cart-item-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cart-action-btn {
  color: #f5222d;
  cursor: pointer;
  font-size: 16px;
  transition: opacity 0.2s;
  display: inline-flex;
  align-items: center;
  padding: 4px;
}

.cart-action-btn:hover {
  opacity: 0.7;
}

.cart-footer {
  padding-top: 16px;
  border-top: 1px solid rgba(0,0,0,.06);
}

.cart-total {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
  padding: 8px 0;
}

.total-label {
  font-size: 14px;
  color: rgba(0,0,0,.65);
}

.total-value {
  font-size: 18px;
  font-weight: 600;
  color: rgba(0,0,0,.85);
}

.cart-price {
  color: rgba(0,0,0,.6);
}

.empty-cart {
  text-align: center;
  color: rgba(0,0,0,.45);
  padding: 48px 24px;
}

.empty-text {
  font-size: 16px;
  font-weight: 500;
  color: rgba(0,0,0,.85);
  margin-bottom: 8px;
}

.empty-hint {
  font-size: 14px;
  color: rgba(0,0,0,.45);
}

.ml-1 {
  margin-left: 6px;
}

@media (max-width: 768px) {
  .nav {
    display: none;
  }
  
  .logo-text {
    font-size: 16px;
  }
  
  .header-inner {
    padding: 0;
  }
}
</style>
