# AGENTS.md

## Big picture
- `tasknote` is a monorepo with a React/Vite frontend (`client/`) and Spring Boot API (`server/`) sharing a PostgreSQL schema managed by Flyway migrations (`server/src/main/resources/db/migration/`).
- Request boundary is explicit: unauthenticated endpoints under `/auth/**`, authenticated business endpoints under `/rest/**`, and public shared-note endpoints under `/public/**` (see `server/src/main/java/br/com/tasknoteapp/server/config/SecurityConfig.java`).
- Frontend talks directly to backend URLs from `client/src/api-service/apiConfig.ts` (`VITE_BACKEND_SERVER`), using `fetch` wrapper logic in `client/src/api-service/api.ts`.
- Auth is JWT-in-header + localStorage persistence (`API_TOKEN`), with automatic 2-minute token refresh in `client/src/context/AuthProvider.tsx` via `/rest/user-sessions/refresh`.

## Architecture details that matter
- Frontend route split is auth-state driven in `client/src/App.tsx` + `client/src/routes/ProtectedRoute/index.tsx`; private screens render through `client/src/layout/PrivateLayout/index.tsx`.
- Home view (`client/src/views/Home/index.tsx`) is a key integration surface: loads tasks/notes/tags, applies client-side filtering, and drives note sharing (`/rest/notes/{id}/share` + `/public/notes/{token}`).
- Backend follows controller -> service -> repository layering (`server/src/main/java/br/com/tasknoteapp/server/{controller,service,repository}`).
- Global API error shape comes from `server/src/main/java/br/com/tasknoteapp/server/controller/RestExceptionController.java`; frontend expects `message` or `fields[].fieldMessage` (`client/src/api-service/api.ts`).
- Email and password-reset flows are Mailgun-backed (`server/src/main/java/br/com/tasknoteapp/server/service/MailgunEmailService.java`) and use templates under `server/src/main/java/br/com/tasknoteapp/server/templates/` + `mailgun-templates/`.

## Developer workflows (use these first)
- Frontend quality gate: `bash tools/check-frontend.sh` (runs `npm ci`, `lint:fix`, `build`, `test:no-watch`).
- Backend quality gate: `bash tools/check-backend.sh` (runs checkstyle, compile, then `clean verify -P tests`).
- Important Maven default: tests/checkstyle/jacoco are skipped unless profile `-P tests` is enabled (`server/pom.xml`).
- Dev stack via Docker Compose/Taskfile (`Taskfile.yml`, `docker-compose.dev.yml`): app `5000`, API `8585`, Java debug port `5005`, Postgres `5432`.
- Frontend local dev: run from `client/` with `npm start`; backend local dev: run from `server/` with `./mvnw spring-boot:run`.

## CI/CD and release behavior
- PR workflows (`.github/workflows/client-ci.yml`, `.github/workflows/server-ci.yml`) run checks then push `:candidate` images to GHCR.
- Main workflows (`.github/workflows/main-client.yml`, `.github/workflows/main-server.yml`) push versioned tags + `latest`; backend workflow also increments `server/pom.xml` version.
- Deploy workflows (`.github/workflows/deploy-stg.yml`, `.github/workflows/deploy.yml`) apply Terraform in `terraform-stg/` and `terraform/` to Kubernetes.
- Infra wiring (secrets, services, ingress, image vars) is defined in `terraform/main.tf`.

## Project conventions to preserve
- Frontend style is ESLint flat config + stylistic rules (2-space indent, single quotes, semicolons) in `client/eslint.config.mjs`.
- Backend style is Google Checkstyle (`server/.mvn/google_checks.xml`), including 100-char line length and Javadoc requirements on public APIs.
- Integration tests are named `*IntTest.java` and are run by Failsafe; unit tests exclude that suffix (`server/pom.xml`).
- Migration files are versioned `V<timestamp>__description.sql`; never edit old migrations, add new ones in `server/src/main/resources/db/migration/`.

## Agent guardrails
- Prefer editing source, not generated artifacts (`server/target/`, `schemaspy/output/`, `TaskNoteBruno/results.html`).
- Keep API contract compatibility with frontend `ApiConfig` paths; changing endpoint paths requires synchronized client updates.
- When changing auth/session behavior, update both backend filters/controllers and frontend `AuthProvider` token lifecycle.
- If you change CI/build/deploy commands, update both `README.md` and this `AGENTS.md` to keep workflows discoverable.

