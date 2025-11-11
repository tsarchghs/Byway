
<template>
  <a-config-provider :theme="{ algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm }">
    <a-layout :class="['explore-wrap', isDark ? 'is-dark' : '']">
      <a-page-header
        class="page-header"
        title="Feature Explorer"
        sub-title="Browse all plugins, routes, and pages"
      >
        <template #extra>
          <a-space>
            <a-input-search v-model:value="q" placeholder="Search plugins/routes..." allow-clear />
            <a-switch :checked="isDark" @change="toggleDark">
              <template #checkedChildren>Dark</template>
              <template #unCheckedChildren>Light</template>
            </a-switch>
          </a-space>
        </template>
      </a-page-header>

      <div class="content p-4">
        <a-alert v-if="error" type="error" :message="error" show-icon class="mb-3" />

        <a-row :gutter="[16,16]">
          <a-col :xs="24" :md="8" v-for="plug in filtered" :key="plug.plugin">
            <a-card :title="plug.plugin" :bordered="false">
              <template #extra>
                <a-tag v-if="plug.manifest?.routes?.length" color="blue">{{ plug.manifest.routes.length }} route(s)</a-tag>
                <a-tag v-if="!plug.manifest?.routes?.length" color="gold">no manifest routes</a-tag>
              </template>

              <div class="mb-2" v-if="plug.manifest?.routes?.length">
                <div class="text-sm text-gray-500 mb-1">Manifest routes</div>
                <a-list size="small" :data-source="plug.manifest.routes" :renderItem="(r:any) => h('div', { class:'route-row' }, [
                  h('code', {}, r.path),
                  h(resolveComponent('a-button'), { type:'link', href: r.path, size:'small' }, { default: () => 'Open' })
                ])" />
              </div>

              <div v-if="plug.discoveredPages?.length">
                <div class="text-sm text-gray-500 mb-1">Discovered pages</div>
                <a-list size="small" :data-source="plug.discoveredPages" :renderItem="(p:any) => h('div', { class:'route-row' }, [
                  h('code', {}, p.replace('nuxt/pages','').replace('.vue','')),
                  h(resolveComponent('a-button'), { type:'link', href: guessRoute(plug.plugin, p), size:'small' }, { default: () => 'Open' })
                ])" />
              </div>
            </a-card>
          </a-col>
        </a-row>
      </div>
    </a-layout>
  </a-config-provider>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, h, resolveComponent } from 'vue'
import { theme } from 'ant-design-vue'
import { message } from 'ant-design-vue'

const isDark = ref(false)
const q = ref('')
const rows = ref<Array<any>>([])
const error = ref<string|undefined>()

function toggleDark() { isDark.value = !isDark.value }

function guessRoute(plugin:string, page:string) {
  // naive mapping: remove 'nuxt/pages' and .vue; Nuxt auto-routes by file path
  let p = page.replace(/^nuxt\/pages/, '').replace(/\.vue$/, '')
  // normalize dynamic segments
  p = p.replace(/\\/g, '/').replace(/\[([^\]]+)\]/g, ':$1')
  // mount under plugin base if needed (monorepo may prefix)
  // but we expose as path-like; attempt alias for common ones
  if (p === '/homepage') return '/'
  if (p === '/courses-listing') return '/courses'
  if (p === '/courses-detail') return '/course/:id'
  return p.startsWith('/') ? p : `/${p}`
}

const filtered = computed(() => {
  const s = q.value.trim().toLowerCase()
  if (!s) return rows.value
  return rows.value.filter((r:any) => {
    if (r.plugin.toLowerCase().includes(s)) return true
    const mr = (r.manifest?.routes||[]).some((x:any) => (x.path||'').toLowerCase().includes(s))
    const dp = (r.discoveredPages||[]).some((x:any) => (x||'').toLowerCase().includes(s))
    return mr || dp
  })
})

onMounted(async () => {
  try {
    const res = await fetch('/api/discovery/routes')
    const j = await res.json()
    if (!j.ok) throw new Error(j.error || 'Discovery failed')
    rows.value = j.plugins
  } catch (e:any) {
    error.value = e?.message || String(e)
    message.error(error.value)
  }
})

definePageMeta({
  alias: ['/explore']
})
</script>

<style scoped>
.explore-wrap { min-height: 100vh; }
.page-header { background: var(--ant-color-bg-container); margin: 8px 8px 0; border-radius: 12px; }
.content :deep(.ant-card) { border-radius: 12px; }
.route-row { display:flex; align-items:center; justify-content:space-between; gap: 8px; padding: 4px 0; }
.text-sm { font-size: 12px; }
.text-gray-500 { color: #888; }
.mb-1 { margin-bottom: 4px; }
.mb-2 { margin-bottom: 8px; }
.mb-3 { margin-bottom: 12px; }
.p-4 { padding: 16px; }
.is-dark { filter: brightness(0.96) contrast(1.02); }
</style>
