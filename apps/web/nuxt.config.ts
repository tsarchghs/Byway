// Nuxt 4.2 host config
import { defineNuxtConfig } from 'nuxt/config'
import path from 'node:path'
import vueJsx from '@vitejs/plugin-vue-jsx'
export default defineNuxtConfig({
    alias: {
    '@shared-ui': '../../packages/shared-ui/src',
  },
  vite: {
    plugins: [vueJsx()]
  },
  future: { compatibilityVersion: 4 },
  devtools: { enabled: true },
  modules: [
    // Shared components auto-registered as global components
    '@bloggrs/shared-ui/nuxt',
    // Dynamically mount plugin pages
    path.resolve('./modules/plugin-loader.mjs'),
  ],
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE || 'http://localhost:4000'
    }
  },
  nitro: { preset: 'node' },
  ssr: true
})
