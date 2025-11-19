<template>
  <section class="role-portal" aria-live="polite">
    <header class="role-portal__header">
      <div class="role-portal__labels">
        <p class="role-portal__eyebrow">Unified campus portal</p>
        <h2>{{ hero.title }}</h2>
        <p>{{ hero.description }}</p>
      </div>

      <nav class="role-portal__switcher" aria-label="Select role">
        <button
          v-for="role in roles"
          :key="role"
          class="role-button"
          :data-active="role === activeRole"
          type="button"
          @click="handleRoleChange(role)"
        >
          <span class="role-button__label">{{ role }}</span>
          <span class="role-button__spotlight" v-if="role === activeRole">{{ hero.spotlight }}</span>
        </button>
      </nav>
    </header>

    <section class="role-portal__hero">
      <p class="role-portal__subtitle">{{ hero.subtitle }}</p>
      <div class="role-portal__stats">
        <article
          v-for="stat in quickStats"
          :key="stat.label"
          class="role-portal__stat"
        >
          <p class="role-portal__stat-label">{{ stat.label }}</p>
          <p class="role-portal__stat-value">{{ stat.value }}</p>
          <p class="role-portal__stat-helper">{{ stat.helper }}</p>
        </article>
      </div>
    </section>

    <section class="role-portal__timeline">
      <header>
        <h3>Momentum timeline</h3>
        <p>Highlights the next twelve focus areas tied to the {{ activeRole }} journey.</p>
      </header>
      <ol>
        <li v-for="item in timeline" :key="item.id">
          <div>
            <p class="timeline-label">{{ item.label }}</p>
            <p class="timeline-impact">{{ item.impact }}</p>
          </div>
          <p class="timeline-milestone">{{ item.milestone }}</p>
        </li>
      </ol>
    </section>

    <PortalPanels :sections="sections" />
  </section>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import PortalPanels from './PortalPanels.vue'
import { useRolePortal } from './useRolePortal'
import type { PortalRole } from './portalContent'

const props = defineProps<{ role?: PortalRole }>()
const emit = defineEmits<{
  (e: 'update:role', value: PortalRole): void
  (e: 'role-change', value: PortalRole): void
}>()

const initialRole = computed(() => props.role ?? 'student')
const portal = useRolePortal(initialRole.value)

const roles = portal.roles
const activeRole = portal.activeRole
const hero = portal.hero
const quickStats = portal.quickStats
const timeline = portal.timeline
const sections = portal.sections

const handleRoleChange = (role: PortalRole) => {
  portal.switchRole(role)
  emit('update:role', role)
  emit('role-change', role)
}

watch(
  () => props.role,
  (role) => {
    if (role) {
      portal.switchRole(role)
    }
  }
)
</script>

<style scoped>
.role-portal {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  padding: 2rem;
  border-radius: 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 40%, #dbeafe 100%);
  color: #0f172a;
}

.role-portal__header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 2rem;
}

.role-portal__eyebrow {
  margin: 0;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.25rem;
  color: #6366f1;
}

.role-portal__labels h2 {
  margin: 0.3rem 0;
  font-size: 2rem;
}

.role-portal__labels p {
  margin: 0;
  max-width: 32rem;
  color: #334155;
}

.role-portal__switcher {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.role-button {
  background: rgba(255, 255, 255, 0.65);
  border: 1px solid #c7d2fe;
  border-radius: 1rem;
  padding: 1rem;
  width: 220px;
  text-align: left;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.role-button[data-active='true'] {
  box-shadow: 0 15px 40px rgba(79, 70, 229, 0.25);
  border-color: #6366f1;
}

.role-button__label {
  display: block;
  font-size: 1.1rem;
  font-weight: 600;
  text-transform: capitalize;
}

.role-button__spotlight {
  display: block;
  margin-top: 0.5rem;
  color: #4c1d95;
  font-size: 0.9rem;
}

.role-portal__hero {
  background: #0f172a;
  border-radius: 1.5rem;
  padding: 1.5rem;
  color: #f8fafc;
}

.role-portal__subtitle {
  margin: 0 0 1rem;
  font-size: 1.1rem;
  color: #c7d2fe;
}

.role-portal__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.role-portal__stat {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  padding: 1rem;
}

.role-portal__stat-label {
  margin: 0;
  font-size: 0.9rem;
  color: #cbd5f5;
}

.role-portal__stat-value {
  margin: 0.35rem 0 0;
  font-size: 1.7rem;
  font-weight: 700;
}

.role-portal__stat-helper {
  margin: 0.35rem 0 0;
  color: #e0e7ff;
  font-size: 0.85rem;
}

.role-portal__timeline {
  background: #ffffff;
  border-radius: 1.25rem;
  border: 1px solid #cbd5f5;
  padding: 1.5rem;
  box-shadow: 0 10px 35px rgba(148, 163, 184, 0.2);
}

.role-portal__timeline header {
  margin-bottom: 1rem;
}

.role-portal__timeline h3 {
  margin: 0 0 0.35rem;
}

.role-portal__timeline ol {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.role-portal__timeline li {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.timeline-label {
  margin: 0;
  font-weight: 600;
}

.timeline-impact {
  margin: 0.25rem 0 0;
  color: #475569;
}

.timeline-milestone {
  margin: 0;
  color: #6366f1;
  font-weight: 600;
}

@media (max-width: 960px) {
  .role-portal__switcher {
    flex-wrap: wrap;
  }

  .role-button {
    width: 100%;
  }

  .role-portal__timeline li {
    flex-direction: column;
  }
}
</style>
