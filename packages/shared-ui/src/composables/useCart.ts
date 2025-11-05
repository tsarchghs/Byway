import { ref, computed } from 'vue'

const items = ref<CartItem[]>([])
export function useCart() {
  const total = computed(() =>
    items.value.reduce((sum, i) => sum + i.price * i.qty, 0)
  )
  const addItem = (item: CartItem) => {
    const existing = items.value.find(i => i.id === item.id)
    existing ? existing.qty++ : items.value.push({ ...item, qty: 1 })
  }
  const removeItem = (id: string) =>
    (items.value = items.value.filter(i => i.id !== id))
  return { items, total, addItem, removeItem }
}
