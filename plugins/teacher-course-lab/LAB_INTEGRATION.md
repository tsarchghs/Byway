# Lab Integration with Nuxt and Express Projects

This document describes how the `teacher-course-lab` plugin integrates with lab lessons defined in `teach-internal`, supporting both Nuxt (FRONTEND_NUXT) and Express (BACKEND_NODE) lab projects with automated testing.

## Overview

When a lab lesson is created in `teach-internal` with lab metadata, students can:
1. Start a lab session (gets a code-server workspace)
2. Work on a Nuxt or Express project scaffolded automatically
3. Submit their work for grading
4. Get automated test results based on tests defined in lesson metadata

## Lab Metadata Structure

Lab metadata is stored in `lesson.metadata.lab` and includes:

```typescript
{
  kind: "BACKEND_NODE" | "FRONTEND_NUXT",
  dockerImage: string,        // e.g., "node:22-alpine"
  buildCmd: string,           // e.g., "npm install" or "pnpm i"
  startCmd: string,           // e.g., "npm start" or "pnpm dev"
  devPort: number,            // e.g., 3000
  traefikHost?: string,       // Optional Traefik host for routing
  codeServer?: {
    url?: string,
    containerId?: string
  },
  apiTests?: ApiTestMock[],   // For BACKEND_NODE labs
  uiTests?: UiTestMock[]      // For FRONTEND_NUXT labs
}
```

## Project Initialization

When a lab session starts:

1. **Spawner** (`server/services/spawner.mjs`):
   - Creates workspace directory
   - Calls `initializeLabProject()` if lab metadata is present
   - Spawns code-server container with workspace mounted

2. **Project Initializer** (`server/services/project-initializer.mjs`):
   - For `BACKEND_NODE`: Creates Express.js project with:
     - `package.json` with express, cors dependencies
     - `server.js` with basic Express setup and health endpoint
     - `.gitignore`, `README.md`
   
   - For `FRONTEND_NUXT`: Creates Nuxt.js project with:
     - `package.json` with nuxt dependency
     - `nuxt.config.ts` configured for the lab
     - `app.vue` and `pages/index.vue`
     - `.gitignore`, `README.md`

## Student Workflow

1. **Start Session**: Student starts a lab session via `/api/teacher-course-lab/session/start`
   - System creates workspace and scaffolds project (if lab metadata exists)
   - Student gets code-server URL

2. **Develop**: Student opens code-server and:
   - Runs `npm install` (or equivalent from `buildCmd`)
   - Starts dev server with `npm start` / `npm run dev` (from `startCmd`)
   - Works on the lab requirements

3. **Submit**: Student submits via `/api/teacher-course-lab/submit`
   - System runs automated tests
   - Results stored in submission record

## Test Execution

### API Tests (BACKEND_NODE)

Tests run against the running Express server (typically on `devPort`):

```javascript
{
  id: string,
  name: string,
  method: string,          // "GET", "POST", etc.
  path: string,            // "/api/health"
  pathParams?: KV[],       // For dynamic paths like "/api/users/:id"
  query?: KV[],            // Query string parameters
  headers?: KV[],          // Custom headers
  auth?: { type: "bearer", token?: string },
  bodyJson?: string,       // Request body (JSON string)
  expectedStatus?: number,
  expectMode?: "json-subset" | "contains-text" | "exact-json",
  expectJsonStr?: string,  // Expected JSON response
  expectTextLine?: string  // Comma-separated text snippets to find
}
```

### UI Tests (FRONTEND_NUXT)

Tests check rendered HTML for expected content:

```javascript
{
  id: string,
  name: string,
  path: string,            // "/" or "/about"
  expectTextLine?: string, // Comma-separated text snippets
  points?: number
}
```

## Grading Flow

1. **Grader** (`server/services/grader.mjs`) is called when submission is created
2. Fetches lab metadata from lesson via `courses-bridge.mjs`
3. Resolves base URL (Traefik host or `localhost:devPort`)
4. Runs tests via `test-runner.mjs`:
   - For BACKEND_NODE: Executes all `apiTests`
   - For FRONTEND_NUXT: Executes all `uiTests`
5. Updates submission with:
   - `passed`: boolean (all tests passed)
   - `gradePct`: percentage (0-100)
   - `feedback`: test results summary

## URL Resolution

Tests need to know where the lab is running:

1. **Traefik mode**: If `traefikHost` is set, use `http://${traefikHost}`
2. **Local mode**: Fall back to `http://localhost:${devPort}`

The grader resolves the URL via `resolveLabBaseUrl()` in `test-runner.mjs`.

## API Endpoints

### New Endpoints

- `GET /api/teacher-course-lab/challenges/:id/lab-meta`
  - Returns lab metadata for a challenge (from bound lesson)

### Existing Endpoints (Enhanced)

- `POST /api/teacher-course-lab/session/start`
  - Now accepts `labMeta` in spawner (fetched automatically if challenge has `lessonId`)
  - Initializes project template in workspace

- `POST /api/teacher-course-lab/submit`
  - Enhanced grader now runs real tests from lesson metadata

## Integration with teach-internal

The `courses-bridge.mjs` service:

1. Fetches lesson data via GraphQL from `/api/teach-internal/graphql`
2. Extracts `lesson.metadata.lab` for lab configuration
3. Falls back to REST if GraphQL is unavailable

## Environment Variables

- `TCLAB_COURSES_API_BASE`: Base URL for teach-internal API (default: `http://localhost:4000/api/teach-internal`)
- All existing spawner env vars (see README.md)

## Future Enhancements

- [ ] Auto-start dev server in container (separate container or same container)
- [ ] Health check polling before running tests
- [ ] Support for more lab kinds (Python, Rust, etc.)
- [ ] Test timeout configuration
- [ ] Parallel test execution for faster grading
- [ ] Test result artifacts (screenshots, logs)

## Notes

- Students must manually start the dev server after opening code-server
- Tests assume the dev server is running when submission is made
- Traefik routing is optional but recommended for production
- Project templates are minimal; students build on top of them

