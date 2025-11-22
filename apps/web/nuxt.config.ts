// Nuxt 4.2 host config
import { defineNuxtConfig } from 'nuxt/config'
import path from 'node:path'
import { dirname, resolve } from 'path'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { fileURLToPath } from 'node:url'
import { URL } from 'node:url'

export default defineNuxtConfig({
    alias: {
    '@shared-ui': '../../packages/shared-ui/src',
    '@shared': resolve(__dirname, '../../packages/shared-ui/src'),
    '@shared-apollo': fileURLToPath(new URL('../../packages/shared-apollo', import.meta.url)),
    '#shared': '../../packages/shared-ui/src'

  },
  vite: {
    plugins: [vueJsx()],
    resolve: {
      alias: {
        '@shared-apollo': fileURLToPath(new URL('../../packages/shared-apollo', import.meta.url)),
      }
    }
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
  nitro: {
    preset: "node-server",
    serveStatic: true,
  },
  ssr: true
})
