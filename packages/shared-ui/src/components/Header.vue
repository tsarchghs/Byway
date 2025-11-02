<template>
  <header class="byway-header">
    <div class="header-inner">
      <!-- Logo -->
      <NuxtLink to="/" class="logo">
        <img src="http://localhost:4000/plugins/homepage/logo.png" alt="Byway logo" class="logo-image" />
        <span class="logo-text">Byway</span>
      </NuxtLink>

      <!-- Navigation -->
      <nav class="nav">
        <NuxtLink to="/categories" class="nav-link">Categories</NuxtLink>
      </nav>

      <!-- Search Bar -->
      <div class="search-bar">
        <span class="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search courses"
          class="search-input"
        />
      </div>

      <!-- Teach on Byway -->
      <NuxtLink to="/teach" class="teach-link">Teach on Byway</NuxtLink>

      <!-- Actions -->
      <div class="actions">
        <button class="cart-btn" aria-label="Cart">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.00014 14H18.1359C19.1487 14 19.6551 14 20.0582 13.8112C20.4134 13.6448 20.7118 13.3777 20.9163 13.0432C21.1485 12.6633 21.2044 12.16 21.3163 11.1534L21.9013 5.88835C21.9355 5.58088 21.9525 5.42715 21.9031 5.30816C21.8597 5.20366 21.7821 5.11697 21.683 5.06228C21.5702 5 21.4155 5 21.1062 5H4.50014M2 2H3.24844C3.51306 2 3.64537 2 3.74889 2.05032C3.84002 2.09463 3.91554 2.16557 3.96544 2.25376C4.02212 2.35394 4.03037 2.48599 4.04688 2.7501L4.95312 17.2499C4.96963 17.514 4.97788 17.6461 5.03456 17.7462C5.08446 17.8344 5.15998 17.9054 5.25111 17.9497C5.35463 18 5.48694 18 5.75156 18H19M7.5 21.5H7.51M16.5 21.5H16.51M8 21.5C8 21.7761 7.77614 22 7.5 22C7.22386 22 7 21.7761 7 21.5C7 21.2239 7.22386 21 7.5 21C7.77614 21 8 21.2239 8 21.5ZM17 21.5C17 21.7761 16.7761 22 16.5 22C16.2239 22 16 21.7761 16 21.5C16 21.2239 16.2239 21 16.5 21C16.7761 21 17 21.2239 17 21.5Z" stroke="#334155" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

        </button>
        <NuxtLink to="/login" class="login-btn">Log In</NuxtLink>
        <NuxtLink to="/signup" class="signup-btn">Sign Up</NuxtLink>
      </div>
    </div>

    <div class="divider"></div>
  </header>
</template>

<script setup lang="ts">
// No dynamic props yet, but we keep <script setup> for Nuxt 4 conventions
</script>

<style scoped>
.byway-header {
  background: #ffffff;
  width: 100%;
  border-bottom: 1px solid #e2e8f0;
}

.header-inner {
  max-width: 1440px;
  margin: 0 auto;
  height: 65px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  gap: 1rem;
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
}

.logo-image {
  width: 31px;
  height: 40px;
}

.logo-text {
  font-family: "Inter", sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #334155;
}

/* Navigation */
.nav {
  flex: 1;
  display: flex;
  justify-content: flex-start;
}

.nav-link {
  font-family: "Inter", sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #334155;
  text-decoration: none;
}

/* Search Bar */
.search-bar {
  display: flex;
  align-items: center;
  border: 1px solid #334155;
  border-radius: 8px;
  padding: 0 10px;
  width: 40%;
  max-width: 622px;
  height: 40px;
  gap: 10px;
}

.search-icon {
  font-size: 16px;
  color: #334155;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-family: "Inter", sans-serif;
  font-size: 14px;
  color: #334155;
}

/* Teach link */
.teach-link {
  font-family: "Inter", sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #334155;
  text-decoration: none;
}

/* Actions */
.actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.cart-btn {
  background: none;
  border: none;
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.cart-icon {
  width: 100%;
  height: 100%;
  border: 2px solid #334155;
  border-radius: 4px;
}

.login-btn {
  border: 1px solid #334155;
  background: transparent;
  padding: 10px 20px;
  border-radius: 4px;
  font-family: "Inter", sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #334155;
  text-decoration: none;
}

.signup-btn {
  background: #334155;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-family: "Inter", sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  text-decoration: none;
}

.divider {
  height: 1px;
  background: #e2e8f0;
}
/* ------------------------------
   📱 RESPONSIVE ADDITIVE STYLES
   ------------------------------ */

/* XXL Screens (≥1600px): keep centered and spaced */
@media (min-width: 1600px) {
  .header-inner {
    max-width: 1600px;
    padding: 0 4rem;
  }
}

/* XL Screens (1280px–1599px): default fine-tuning */
@media (max-width: 1599px) {
  .header-inner {
    padding: 0 3rem;
  }
}

/* Large Screens (1024px–1279px): shrink gaps */
@media (max-width: 1279px) {
  .header-inner {
    padding: 0 2rem;
    gap: 0.5rem;
  }
  .search-bar {
    width: 35%;
  }
  .teach-link {
    display: none; /* hide secondary link for space */
  }
}

/* Medium Screens (768px–1023px): tablets */
@media (max-width: 1023px) {
  .header-inner {
    padding: 0 1.5rem;
    gap: 0.5rem;
  }

  .logo-text {
    font-size: 14px;
  }

  .search-bar {
    width: 50%;
    height: 36px;
  }

  .actions {
    gap: 1rem;
  }

  .login-btn,
  .signup-btn {
    padding: 8px 16px;
    font-size: 13px;
  }
}

/* Small Screens (480px–767px): mobile landscape */
@media (max-width: 767px) {
  .header-inner {
    flex-wrap: wrap;
    justify-content: center;
    height: auto;
    padding: 0.75rem 1rem;
  }

  .logo {
    flex: 1 1 100%;
    justify-content: center;
    margin-bottom: 0.5rem;
  }

  .nav {
    display: none; /* hide top nav links */
  }

  .search-bar {
    width: 100%;
    order: 2;
  }

  .actions {
    width: 100%;
    justify-content: center;
    order: 3;
    margin-top: 0.5rem;
  }

  .login-btn,
  .signup-btn {
    flex: 1;
    text-align: center;
  }
}

/* Extra Small Screens (≤479px): mobile portrait */
@media (max-width: 479px) {
  .header-inner {
    flex-direction: column;
    align-items: stretch;
  }

  .logo-image {
    width: 24px;
    height: 30px;
  }

  .logo-text {
    font-size: 13px;
  }

  .search-bar {
    height: 34px;
    padding: 0 8px;
  }

  .search-input {
    font-size: 13px;
  }

  .actions {
    flex-direction: column;
    gap: 0.5rem;
  }

  .login-btn,
  .signup-btn {
    width: 100%;
    padding: 8px 0;
  }

  .cart-btn {
    display: none; /* optional hide */
  }
}

</style>
