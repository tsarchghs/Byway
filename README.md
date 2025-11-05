# bloggrs-pluggable (Nuxt 4.2 + Express 5)

A minimal, **pluggable** starter showing:

- Nuxt **4.2** host app (`apps/web`) that dynamically mounts plugin pages via a module (`modules/plugin-loader.mjs`).
- Express **5** API (`apps/api`) that autoloads plugin routers from `plugins/*/server/index.mjs`.
- Shared component library (`packages/shared-ui`) consumed by both host and plugin pages.
- Example plugin: **marketplace** with `/products` and `/products/:id` routes and matching API endpoints.

## Quickstart

```bash
pnpm i
pnpm dev
```

- Web: http://localhost:3000
- API: http://localhost:4000

Visit **/products** to see the marketplace plugin (front-end provided by the plugin, mounted in the host app).

## Layout

- `apps/web` (Nuxt 4.2 host)
- `apps/api` (Express 5 API)
- `packages/shared-ui` (shared Vue components incl. Nuxt module for auto-register)
- `plugins/marketplace` (front-end pages + server router + manifest.json)

## Notes

- The loader looks for plugins in `plugins/*` by default, or use `BLOGGRS_PLUGINS_DIR=/abs/path/to/plugins`.
- Plugin pages are added with `pages:extend` (no rebuilds or file copies).
- API is a separate process so plugins can deploy independently if desired.
# Udemy-Design-ChatGPT-boilerplate
# Udemy-Design-ChatGPT-boilerplate
