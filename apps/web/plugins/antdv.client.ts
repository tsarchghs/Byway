// /apps/web/plugins/antdv.client.ts
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import * as Icons from '@ant-design/icons-vue'

export default defineNuxtPlugin((nuxtApp) => {
  // Register Ant Design Vue globally
  nuxtApp.vueApp.use(Antd)

  // Optionally register all icons
  Object.entries(Icons).forEach(([key, component]) => {
    nuxtApp.vueApp.component(key, component)
  })
})
