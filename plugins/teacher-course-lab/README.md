# teacher-course-lab (plugin)

CS50-style labs for Byway/Bloggrs: challenges, code-server sessions, submissions, grading.

## Highlights

- **Own DB (Prisma / SQLite)** – autonomous plugin database with models: LabChallenge, LabSession, LabWorkspace, Submission.
- **APIs** – REST under `/api/teacher-course-lab/*` and optional GraphQL (`/api/teacher-course-lab/graphql`) if `apollo-server-express` is present in host app.
- **Nuxt Pages** – Teacher and Student UIs under routes defined in `manifest.json`.
- **Code Server** – `docker/docker-compose.yml` gives a local code-server with Traefik labels (works with OrbStack or Docker Desktop on macOS).

## Quick Start

1. **Prisma Client** (inside plugin folder):

   ```bash
   cd plugins/teacher-course-lab/server
   export DATABASE_URL_TEACHER_COURSE_LAB="file:./tclab.db"
   npx prisma generate
   npx prisma db push
   ```

2. **Start Traefik** (required for docker-per-session mode):

   ```bash
   cd plugins/teacher-course-lab/docker
   docker compose up -d traefik
   # Traefik dashboard: http://localhost:8081
   ```

   For shared mode, also start code-server:
   ```bash
   CODE_SERVER_PASSWORD=changeme CODE_SERVER_HOST=codeserver.localhost docker compose up -d
   # open http://codeserver.localhost (or http://localhost:8080)
   ```

3. **Use REST**:

   - `GET /api/teacher-course-lab/health`
   - `GET /api/teacher-course-lab/challenges`
   - `POST /api/teacher-course-lab/challenges`
   - `POST /api/teacher-course-lab/session/start`
   - `POST /api/teacher-course-lab/session/stop`
   - `POST /api/teacher-course-lab/submit`

4. **GraphQL** (optional): ensure `apollo-server-express` is available in the host.
   The plugin will auto-mount `/api/teacher-course-lab/graphql`.

## Notes

- Cross-plugin integration should be via API calls; foreign references are stored as strings (e.g., `courseId` from courses plugin).
- The plugin registers itself via `server/index.mjs` using `export async function register(app)`.
- Avoid modifying existing files; this plugin is an additive feature per your HARD RULES.
## Auth & Identity

This plugin expects the host app to attach `req.user` (with an `id` field) to incoming
requests. GraphQL context receives `ctx.user` from `req.user` in `server/index.mjs`.
Unauthenticated users will receive 401/GraphQL errors when attempting to create
challenges, start sessions, or submit work.

## Session Spawner (code-server)

Configure via environment variables:

- `TCLAB_SPAWNER_MODE`:
  - `shared`: reuse a single code-server instance at `CODE_SERVER_BASE_URL`.
  - `docker-per-session` (default): each lab session gets its own `docker run`-spawned code-server with Traefik routing.
- `CODE_SERVER_BASE_URL`: e.g. `http://codeserver.localhost` (used in shared mode, matches Traefik host rule).
- `CODE_SERVER_DEFAULT_TOKEN` / `CODE_SERVER_PASSWORD`: used as code-server password.
- `TCLAB_WORKSPACES_ROOT`: host path for per-session workspaces (default:
  `plugins/teacher-course-lab/docker/workspaces`).
- `TCLAB_CODE_SERVER_IMAGE`: override image (default `codercom/code-server:4.21.1`).
- `TCLAB_TRAEFIK_NETWORK`: Docker network name for Traefik (default: `tclab-traefik-network`).
- `TCLAB_TRAEFIK_DOMAIN`: Domain for Traefik routing (default: `localhost`).
- `TCLAB_TRAEFIK_ENTRYPOINT`: Traefik entrypoint name (default: `web`).

### Traefik Setup

For `docker-per-session` mode, Traefik must be running to route requests to per-session code-server containers:

1. **Start Traefik** (required before spawning sessions):
   ```bash
   cd plugins/teacher-course-lab/docker
   docker compose up -d traefik
   ```

2. **Session URLs**: Each session gets a unique subdomain like `lab-<sessionId>.localhost`.
   - Example: `http://lab-abc123def456.localhost`
   - Containers are automatically added to the Traefik network and configured with proper labels.

3. **Network**: The spawner automatically creates/verifies the Traefik network (`tclab-traefik-network`) exists.

## Grading Runner

`server/services/grader.mjs` contains `runGrading(submissionId)` which currently
implements a mocked "always-pass" grading flow. Replace its internals with real
container exec / queue-based grading.

## Course Bindings (REST bridge)

Lab challenges can be bound to external Course / Module / Lesson records via:

- Prisma fields on `LabChallenge`: `courseId`, `moduleId`, `lessonId`.
- REST endpoints:
  - `GET /api/teacher-course-lab/bindings/challenge/:id`
  - `POST /api/teacher-course-lab/bindings/challenge/:id`

Optional remote metadata is fetched from `TCLAB_COURSES_API_BASE`, e.g.:

- `GET $TCLAB_COURSES_API_BASE/courses/:courseId`
- `GET $TCLAB_COURSES_API_BASE/modules/:moduleId`
- `GET $TCLAB_COURSES_API_BASE/lessons/:lessonId`

Adjust the paths in `server/services/courses-bridge.mjs` to match your existing
course/module/lesson plugin APIs.
