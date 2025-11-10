// composables/useWishlist.ts
import { ref } from 'vue'
const list = ref<any[]>([])
if (process.client){
  try{ list.value = JSON.parse(localStorage.getItem('byway_wishlist') || '[]') }catch{ list.value = [] }
}
function persist(){ if (process.client) localStorage.setItem('byway_wishlist', JSON.stringify(list.value)) }
export function useWishlist(){
  function add(item:any){ if (!list.value.find(i=> String(i.id)===String(item.id))){ list.value.push(item); persist() } }
  function remove(id:string){ const i = list.value.findIndex(x=> String(x.id)===String(id)); if (i>=0){ list.value.splice(i,1); persist() } }
  const items = list
  return { items, add, remove }
}
