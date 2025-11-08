// packages/shared-ui/src/composables/useCart.ts
import { ref, computed, watch, onMounted } from 'vue'

export interface CartItem {
  id: string
  title: string
  price: number
  image?: string
  qty: number
}

const STORAGE_KEY = 'byway:cart'
const items = ref<CartItem[]>([])

// ---------- helpers ----------
function load() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) items.value = JSON.parse(saved)
  } catch {
    items.value = []
  }
}
function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value))
}

// ---------- logic ----------
function addItem(raw: Omit<CartItem, 'qty'>) {
  const existing = items.value.find(i => i.id === raw.id)
  if (existing) existing.qty++
  else items.value.push({ ...raw, qty: 1 })
  save()
}

function removeItem(id: string) {
  items.value = items.value.filter(i => i.id !== id)
  save()
}

function clear() {
  items.value = []
  save()
}

const total = computed(() =>
  items.value.reduce((s, i) => s + i.price * i.qty, 0)
)

// ---------- init & sync ----------
if (typeof window !== 'undefined') {
  load()
  // auto-save on change
  watch(items, save, { deep: true })
  // cross-tab sync
  window.addEventListener('storage', e => {
    if (e.key === STORAGE_KEY) load()
  })
}

export function useCart() {
  return { items, total, addItem, removeItem, clear }
}
