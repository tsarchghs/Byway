<template>
  <header class="header-bar">
    <!-- Logo -->
    <div class="logo">Bloggrs</div>

    <!-- Search -->
    <div class="search">
      <div class="dropdown">
        <span class="dropdown-label">All</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="dropdown-icon"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      <PhotoSearchInput class="search-input" placeholder="Search a location" />

      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="search-icon"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-4.35-4.35m1.15-5.4A7 7 0 1110.4 4.35a7 7 0 017.4 7.4z"
        />
      </svg>
    </div>

    <!-- Actions -->
<!-- Actions -->
<div class="actions">
  <nav class="links">
    <a href="#">Use cases</a>
    <a href="#">About</a>
    <a href="#">Blog</a>
  </nav>

  <button class="cta">Get Started</button>

  <!-- 👇 Auth UI -->
  <template v-if="loggedIn">
    <div class="profile-wrapper" @click="toggleMenu">
      <img
        src="https://i.pravatar.cc/40"
        alt="Profile"
        class="profile-icon"
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="chevron"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>

      <div v-if="showMenu" class="dropdown-menu">
        <p class="user-name">{{ user?.name || 'User' }}</p>
        <a href="#" @click.prevent="router.push('/profile')">Profile</a>
        <button @click="logout">Logout</button>
      </div>
    </div>
  </template>

  <template v-else>
    <button @click="goLogin" class="login">Login</button>
  </template>
</div>

  </header>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PhotoSearchInput from './PhotoSearchInput.vue'

const router = useRouter()
const loggedIn = ref(false)
const user = ref<{ name?: string; email?: string } | null>(null)
const showMenu = ref(false)

function goLogin() {
  router.push('/login')
}

function toggleMenu() {
  showMenu.value = !showMenu.value
}

function logout() {
  localStorage.removeItem('token')
  loggedIn.value = false
  user.value = null
  router.push('/')
}

// ✅ Check login state on mount
onMounted(async () => {
  const token = localStorage.getItem('token')
  if (!token) return

  try {
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:4000'
    const res = await fetch(`${apiBase}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) {
      const data = await res.json()
      user.value = data
      loggedIn.value = true
    }
  } catch (err) {
    console.error('Auth check failed:', err)
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap');

.header-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 76px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 32px;
  gap: 24px;
  background: #ffffff;
  border-bottom: 1px solid #f1f5f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  font-family: 'Plus Jakarta Sans', sans-serif;
  z-index: 50;
  position: relative; /* no fixed positioning */
  width: 100%;
  top: auto;
  left: auto;
  right: auto;

}

/* Responsive layout improvements */
@media (max-width: 1024px) {
  .header-bar {
    flex-wrap: wrap;
    gap: 16px;
    padding: 12px 20px;
  }
  .search {
    width: 100%;
    order: 3;
  }
  .actions {
    width: 100%;
    justify-content: space-between;
    order: 2;
  }
}

.logo {
  font-weight: 700;
  font-size: 22px;
  letter-spacing: -0.02em;
  color: #000;
}

/* Search */
.search {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  max-width: 580px;
  height: 44px;
  background: #f1f5f9;
  border-radius: 4px;
  padding-right: 12px;
  flex-grow: 1;
}

.dropdown {
  display: flex;
  align-items: center;
  background: #f8fafc;
  padding: 12px;
  gap: 8px;
  border-radius: 4px;
}
.dropdown-label {
  font-size: 14px;
  color: #000;
}
.dropdown-icon {
  width: 16px;
  height: 16px;
  stroke: #64748b;
}
.search-input {
  flex: 1;
}
.search-icon {
  width: 20px;
  height: 20px;
  stroke: #64748b;
}

/* Actions */
.actions {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-shrink: 0;
}
.links {
  display: flex;
  gap: 16px;
}
.links a {
  text-decoration: none;
  font-size: 14px;
  color: #475569;
}
.links a:hover {
  color: #000;
}
.cta {
  background: #102fd8;
  border-radius: 5px;
  color: #f8fafc;
  font-size: 14px;
  font-weight: 700;
  padding: 8px 12px;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease;
}
.cta:hover {
  background: #1d3ff0;
}

/* Login button now styled same as link */
.login {
  font-size: 14px;
  font-weight: 400;
  color: #475569;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease;
}
.login:hover {
  color: #000;
}
/* ==============================
   Responsive Header Fixes
   ============================== */

/* Tablet (≤1024px) */
@media (max-width: 1024px) {
  .header-bar {
    flex-wrap: wrap;
    padding: 12px 20px;
    gap: 12px;
  }

  .search {
    order: 3;
    width: 100%;
  }

  .actions {
    width: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: 12px;
  }
}

/* Mobile (≤768px) */
@media (max-width: 768px) {
  .header-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 10px 16px;
    height: auto;
  }

  .logo {
    font-size: 20px;
  }

  .search {
    order: 2;
    width: 100%;
    gap: 8px;
  }

  .actions {
    order: 3;
    width: 100%;
    justify-content: space-between;
  }

  .links {
    display: none; /* optionally hide links for now */
  }

  .cta {
    flex-grow: 1;
    text-align: center;
  }
}
/* ========== Mid-tablet fix (760–900 px) ========== */
@media (max-width: 900px) and (min-width: 760px) {
  .header-bar {
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    padding: 12px 20px;
    height: auto;
  }

  .logo {
    flex: 1 1 100%;
    font-size: 20px;
  }

  /* Search bar full width under logo */
  .search {
    order: 3;
    width: 100%;
    max-width: 100%;
    flex: 1 1 100%;
  }

  /* Actions shrink to top-right corner */
  .actions {
    flex: 1 1 100%;
    justify-content: flex-start;
    gap: 12px;
  }

  /* Hide nav links if they wrap awkwardly */
  .links {
    display: none;
  }

  .cta {
    padding: 6px 10px;
    font-size: 13px;
  }
}
/* Profile icon + dropdown */
.profile-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.profile-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #e2e8f0;
}

.chevron {
  width: 16px;
  height: 16px;
  stroke: #475569;
}

.dropdown-menu {
  position: absolute;
  top: 46px;
  right: 0;
  background: #fff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  padding: 8px 0;
  width: 160px;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  z-index: 100;
}

.dropdown-menu a,
.dropdown-menu button {
  text-align: left;
  padding: 8px 16px;
  background: none;
  border: none;
  color: #334155;
  cursor: pointer;
  transition: background 0.2s;
  font-family: inherit;
}

.dropdown-menu a:hover,
.dropdown-menu button:hover {
  background: #f8fafc;
}

.user-name {
  font-weight: 600;
  color: #0f172a;
  padding: 8px 16px;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 4px;
}
/* --- Fix profile dropdown stacking and visibility --- */
.header-bar {
  overflow: visible !important; /* allow dropdown to show outside */
  z-index: 1000 !important; /* ensure above hero, filters, etc. */
  position: relative; /* anchor dropdown positioning */
}

.profile-wrapper {
  position: relative; /* positioning context for dropdown-menu */
  z-index: 1010; /* slightly above header background */
}

.dropdown-menu {
  position: absolute;
  top: 46px;
  right: 0;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  width: 160px;
  z-index: 1050; /* ✅ always above hero and filters */
}

</style>
