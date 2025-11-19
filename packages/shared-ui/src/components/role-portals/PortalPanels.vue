<template>
  <section class="portal-panels" aria-label="Portal focus areas">
    <article
      v-for="section in sections"
      :key="section.id"
      class="portal-panel"
    >
      <header class="panel-header">
        <div class="panel-title">
          <h3>{{ section.title }}</h3>
          <p class="panel-summary">{{ section.summary }}</p>
        </div>
        <p class="panel-alignment">{{ section.alignment }}</p>
      </header>

      <ul class="metrics" aria-label="Key indicators">
        <li v-for="metric in section.metrics" :key="metric.label" class="metric">
          <p class="metric-label">{{ metric.label }}</p>
          <p class="metric-value" :data-trend="metric.trend">{{ metric.value }}</p>
          <p class="metric-context">{{ metric.context }}</p>
        </li>
      </ul>

      <section class="actions" aria-label="Actions">
        <h4>Momentum</h4>
        <ol>
          <li v-for="action in section.actions" :key="action.id">
            <div>
              <p class="action-label">{{ action.label }}</p>
              <p class="action-description">{{ action.description }}</p>
              <p class="action-highlight">{{ action.highlight }}</p>
            </div>
            <a :href="action.route" class="action-link">{{ action.cta }}</a>
          </li>
        </ol>
      </section>

      <section class="resources" aria-label="Resources">
        <h4>Resources</h4>
        <ul>
          <li v-for="resource in section.resources" :key="resource.id">
            <p class="resource-label">{{ resource.label }}</p>
            <p class="resource-description">{{ resource.description }} ({{ resource.format }})</p>
          </li>
        </ul>
      </section>

      <section class="narrative" aria-label="Narrative context">
        <p v-for="(line, idx) in section.narrative" :key="idx">{{ line }}</p>
      </section>
    </article>
  </section>
</template>

<script setup lang="ts">
import type { PortalSection } from './portalContent'

defineProps<{ sections: PortalSection[] }>()
</script>

<style scoped>
.portal-panels {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: 1.5rem;
}

.portal-panel {
  background: #ffffff;
  border-radius: 1.25rem;
  border: 1px solid #e0e7ff;
  padding: 1.5rem;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.panel-title h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #111827;
}

.panel-summary {
  margin: 0.35rem 0 0;
  color: #4b5563;
}

.panel-alignment {
  margin: 0;
  font-size: 0.9rem;
  color: #6b7280;
}

.metrics {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.75rem;
}

.metric {
  background: #f9fafb;
  border-radius: 0.75rem;
  padding: 0.75rem;
}

.metric-label {
  margin: 0;
  font-weight: 600;
  color: #111827;
}

.metric-value {
  margin: 0.25rem 0;
  font-size: 1.2rem;
  font-weight: 700;
}

.metric-value[data-trend='up'] {
  color: #16a34a;
}

.metric-value[data-trend='down'] {
  color: #dc2626;
}

.metric-value[data-trend='steady'] {
  color: #2563eb;
}

.metric-context {
  margin: 0;
  color: #6b7280;
  font-size: 0.85rem;
}

.actions,
.resources,
.narrative {
  margin: 0;
}

.actions h4,
.resources h4 {
  margin: 0 0 0.35rem;
  font-size: 1rem;
}

.actions ol {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.actions li {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.action-label {
  margin: 0;
  font-weight: 600;
}

.action-description,
.action-highlight {
  margin: 0.25rem 0 0;
  color: #4b5563;
}

.action-link {
  align-self: center;
  background: #2563eb;
  color: #fff;
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 600;
}

.resources ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.resource-label {
  margin: 0;
  font-weight: 600;
}

.resource-description {
  margin: 0.2rem 0 0;
  color: #4b5563;
}

.narrative p {
  margin: 0.35rem 0 0;
  color: #374151;
}
</style>
