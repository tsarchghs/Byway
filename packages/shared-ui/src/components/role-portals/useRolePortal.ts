import { computed, ref } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import type { PortalContentEntry, PortalRole, PortalSection } from './portalContent'
import { portalContent } from './portalContent'

export interface RolePortalTimelineEntry {
  id: string
  label: string
  role: PortalRole
  milestone: string
  impact: string
}

export interface RolePortalHook {
  roles: PortalRole[]
  activeRole: Ref<PortalRole>
  portal: ComputedRef<PortalContentEntry>
  sections: ComputedRef<PortalSection[]>
  timeline: ComputedRef<RolePortalTimelineEntry[]>
  quickStats: ComputedRef<PortalContentEntry['quickStats']>
  hero: ComputedRef<PortalContentEntry['hero']>
  switchRole: (role: PortalRole) => void
}

const roleOrder: PortalRole[] = ['student', 'teacher', 'administration']

function resolvePortal(role: PortalRole): PortalContentEntry {
  return portalContent[role]
}

export function useRolePortal(initialRole: PortalRole = 'student'): RolePortalHook {
  const activeRole = ref<PortalRole>(initialRole)

  const portal = computed(() => resolvePortal(activeRole.value))

  const sections = computed(() => portal.value.sections)

  const quickStats = computed(() => portal.value.quickStats)

  const hero = computed(() => portal.value.hero)

  const timeline = computed<RolePortalTimelineEntry[]>(() => {
    return sections.value.slice(0, 12).map((section, index) => {
      const metric = section.metrics[index % section.metrics.length]
      return {
        id: `${section.id}-timeline-${index}`,
        label: section.title,
        role: activeRole.value,
        milestone: `${section.alignment} — anchored to ${metric.label}`,
        impact: section.summary,
      }
    })
  })

  const switchRole = (role: PortalRole) => {
    if (role === activeRole.value) return
    if (!roleOrder.includes(role)) return
    activeRole.value = role
  }

  return {
    roles: roleOrder,
    activeRole,
    portal,
    sections,
    timeline,
    quickStats,
    hero,
    switchRole,
  }
}
