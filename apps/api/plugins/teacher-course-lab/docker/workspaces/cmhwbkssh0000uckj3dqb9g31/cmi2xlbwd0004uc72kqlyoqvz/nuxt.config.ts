export default defineNuxtConfig({
  devServer: {
    port: 3000,
    host: '0.0.0.0'
  },
  ssr: false, // SPA mode for labs
  future: {
    compatibilityVersion: 4
  }
});
