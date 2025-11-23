// Floating contextual navigation so no page is a dead end
export default defineNuxtPlugin((nuxtApp) => {
  if (process.server) return
  const container = document.createElement('div')
  container.id = 'byway-float-nav'
  container.style.position = 'fixed'
  container.style.right = '16px'
  container.style.bottom = '16px'
  container.style.zIndex = '1000'
  document.body.appendChild(container)

  const go = (path:string) => { window.location.href = path }

  container.innerHTML = `
    <div class="tw-shadow-lg tw-rounded-2xl tw-bg-white tw-border tw-overflow-hidden" style="min-width:220px">
      <div class="tw-px-4 tw-py-3 tw-border-b tw-text-sm tw-font-medium">Quick Nav</div>
      <div class="tw-p-3 tw-space-y-2">
        <button class="tw-w-full tw-py-2 tw-rounded-lg tw-border tw-text-sm" data-nav="/dashboard">Dashboard</button>
        <button class="tw-w-full tw-py-2 tw-rounded-lg tw-border tw-text-sm" data-nav="/courses">Courses</button>
        <button class="tw-w-full tw-py-2 tw-rounded-lg tw-border tw-text-sm" data-nav="/plugins/students-internal/gradebook">Gradebook</button>
        <button class="tw-w-full tw-py-2 tw-rounded-lg tw-border tw-text-sm" data-nav="/institutions">Institutions</button>
      </div>
    </div>
  `
  container.addEventListener('click', (e:any) => {
    const btn = e.target?.closest('button[data-nav]')
    if (btn) go(btn.getAttribute('data-nav'))
  })
})
