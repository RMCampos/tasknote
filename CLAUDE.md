# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Frontend (React/TypeScript)
```bash
cd client
npm start              # Start development server on port 5000
npm run build          # Build production bundle (TypeScript compilation + Vite build)
npm run preview        # Preview production build
npm test               # Run Vitest tests
npm run test:coverage  # Run tests with coverage report
npm run lint           # Run ESLint
npm run lint:fix       # Run ESLint with auto-fix
```

### Backend (Java/Spring Boot)
```bash
cd server
./mvnw spring-boot:run                    # Start development server
./mvnw clean compile                      # Compile Java sources
./mvnw test                              # Run unit tests only
./mvnw clean verify -Ptests              # Run all tests (unit + integration) with coverage
./mvnw spring-boot:build-image           # Build Docker image
./mvnw clean verify -Pnative             # Build GraalVM native image
```

### Docker Development Environment
```bash
bash tools/run-docker-db.sh      # Start PostgreSQL database
bash tools/run-docker-server.sh  # Start backend in Docker
bash tools/run-docker-client.sh  # Start frontend in Docker
bash tools/check-frontend.sh     # Run frontend quality checks
bash tools/check-backend.sh      # Run backend quality checks
```

## Architecture

### Monorepo Structure
- `client/` - React TypeScript frontend (Vite + Vitest)
- `server/` - Java Spring Boot REST API
- `tools/` - Development and deployment scripts
- `docker-compose.dev.yml` / `docker-compose.prod.yml` - Multi-service development and production environments
- `Taskfile.yml` - Task automation for docker builds and workflows

### Frontend Architecture (client/)
- **Framework**: React 19 with React Router v7
- **State Management**: React Context API for authentication and sidebar state
- **Authentication**: JWT tokens stored in localStorage with automatic refresh (2-minute intervals)
- **Routing**: Dynamic router configuration based on auth status (signed vs not-signed routes)
- **Internationalization**: i18next with support for English, Portuguese, Russian, Spanish
- **Styling**: Bootstrap 5 + SCSS with dark/light theme support
- **Testing**: Vitest with React Testing Library and coverage reporting
- **API Layer**: Centralized API service in `src/api-service/api.ts` with automatic auth headers

### Backend Architecture (server/)
- **Framework**: Spring Boot 3.5.9 with Java 21
- **Security**: Spring Security with JWT authentication
- **Database**: PostgreSQL with JPA/Hibernate and Flyway migrations
- **Testing**: Separate unit tests and integration tests with 75% coverage requirement
- **Build Options**: Traditional JAR or GraalVM native image compilation

### Key Components

**Authentication Flow:**
1. User credentials → `/auth/sign-in` endpoint
2. Server responds with JWT token and user data
3. Token stored in localStorage, added to all API requests via Authorization header
4. Automatic token refresh every 2 minutes via `/rest/user-sessions/refresh`
5. Protected routes wrap authenticated pages, redirect on auth failure

**Database Schema:**
- Core entities: Users, Tasks, Notes, Task URLs, Notes URLs
- User management with password reset functionality
- Task completion tracking and user statistics

## Development Workflow

### Manual Setup
1. Start database: `bash tools/run-docker-db.sh`
2. Start backend: `bash tools/run-docker-server.sh` or `cd server && ./mvnw spring-boot:run`
3. Start frontend: `bash tools/run-docker-client.sh` or `cd client && npm start`
4. Access app at http://localhost:5000

### Using Taskfile
Alternatively, use the Taskfile.yml for automated workflows:
```bash
task dev          # Start development environment (docker-compose.dev.yml)
task prod         # Start production environment (docker-compose.prod.yml)
task docker-build # Build all Docker images
```

### Quality Checks
Always run quality checks before submitting changes:
- Frontend: `bash tools/check-frontend.sh`
- Backend: `bash tools/check-backend.sh`

## Testing

### Frontend Testing
- **Framework**: Vitest + React Testing Library
- **Coverage**: Generated in `client/coverage/` directory
- **Run**: `cd client && npm test` or `npm run test:coverage`

### Backend Testing  
- **Unit Tests**: Standard JUnit tests, run with `./mvnw test`
- **Integration Tests**: Files ending in `*IntTest.java`, require database
- **Coverage**: JaCoCo reports, 75% minimum requirement
- **Full Test Suite**: `./mvnw clean verify -Ptests` (includes checkstyle, coverage)