
import type { Ref } from 'vue'
import { computed } from 'vue'
import { useRoles } from './useRoles'
import { useAuth } from './useAuth'

export type NavItem = { label: string; to: string; show?: boolean }

export function useNav(){
  const { isTeacher, isAdmin, isStudent } = useRoles()
  const auth = useAuth()
  const isLoggedIn = computed(() => auth.isLoggedIn.value)

  const guest: NavItem[] = [
    { label:'Courses', to:'/courses', show:true },
    { label:'Explore', to:'/explore', show:true },
  ]

  const student: NavItem[] = [
    { label:'Courses', to:'/courses', show:true },
    { label:'Dashboard', to:'/dashboard', show:true },
    { label:'Gradebook', to:'/gradebook', show:true },
    { label:'Explore', to:'/explore', show:true },
    { label:'Profile', to:'/profile', show:true },
  ]

  const teacher: NavItem[] = [
    { label:'Courses', to:'/courses', show:true },
    { label:'Teach', to:'/teach', show:true },
    { label:'Institutions', to:'/institutions', show:true },
    { label:'Explore', to:'/explore', show:true },
    { label:'Profile', to:'/profile', show:true },
  ]

  const admin: NavItem[] = [
    { label:'Courses', to:'/courses', show:true },
    { label:'Institutions', to:'/institutions', show:true },
    { label:'Explore', to:'/explore', show:true },
    { label:'Profile', to:'/profile', show:true },
  ]

  const items = computed<NavItem[]>(() => {
    if (!isLoggedIn.value) return guest
    if (isAdmin.value) return admin
    if (isTeacher.value) return teacher
    return student
  })

  return { items, isLoggedIn }
}
