// composables/useUser.ts
import { ref, computed } from 'vue'
const _token = ref<string | null>(null)
const _me = ref<any>(null)
const _roles = ref<string[]>([])
function load(){
  if (process.client){
    _token.value = localStorage.getItem('byway_token')
    _me.value = JSON.parse(localStorage.getItem('byway_me') || 'null')
  }
}
load()
export function useUser(){
  const isAuthed = computed(()=> !!_token.value)
  function setAuth(token: string, me: any){
    _token.value = token; _me.value = me
    if (process.client){
      localStorage.setItem('byway_token', token)
      localStorage.setItem('byway_me', JSON.stringify(me))
    }
    _roles.value = Array.isArray(me?.roles) ? me.roles : (me?.isTeacher ? ['instructor'] : ['student'])
  }
  function clear(){
    _token.value = null; _me.value = null
    if (process.client){
      localStorage.removeItem('byway_token')
      localStorage.removeItem('byway_me')
    }
    _roles.value = []
  }
  function logout(){ clear(); if (process.client) window.location.href = '/' }
  function hasRole(r:string){ return _roles.value.includes(r) }
  return { token: _token, me: _me, roles:_roles, isAuthed, setAuth, logout, hasRole }
}
