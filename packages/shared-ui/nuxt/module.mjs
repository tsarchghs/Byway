import { defineNuxtModule, addComponent, createResolver } from '@nuxt/kit'

export default defineNuxtModule({
  meta: { name: '@bloggrs/shared-ui/nuxt' },
  async setup (_opts, _nuxt) {
    const { resolve } = createResolver(import.meta.url)
    await addComponent({
      name: 'BaseBadge',
      export: 'default',
      filePath: resolve('../src/components/BaseBadge.vue')
    })
  }
})
