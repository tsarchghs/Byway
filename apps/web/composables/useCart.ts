// composables/useCart.ts
import { ref, computed } from 'vue'

export type CartItem = {
  id: string
  title: string
  price: number
  qty?: number
  courseId?: string
  thumbnail?: string
}

const _items = ref<CartItem[]>([])

export function useCart(){
  const items = computed(()=> _items.value)
  const total = computed(()=> items.value.reduce((s,i)=> s + i.price * (i.qty || 1), 0))

  function load(){
    if (process.client){
      const raw = localStorage.getItem('byway_cart')
      _items.value = raw ? JSON.parse(raw) : []
    }
  }
  function persist(){
    if (process.client){
      localStorage.setItem('byway_cart', JSON.stringify(_items.value))
    }
  }
  function add(item: CartItem){
    const found = _items.value.find(x=> x.id === item.id)
    if (found){ found.qty = (found.qty||1) + (item.qty||1) }
    else _items.value.push({...item, qty: item.qty || 1})
    persist()
  }
  function remove(id: string){
    _items.value = _items.value.filter(x=> x.id !== id)
    persist()
  }
  function clear(){
    _items.value = []
    persist()
  }

  if (_items.value.length === 0) load()

  return { items, total, add, remove, clear }
}
