### Builder
FROM ghcr.io/graalvm/native-image:22.3.3 AS build

# Copy
WORKDIR /app
COPY pom.xml mvnw ./
COPY src ./src
COPY .mvn/ ./.mvn

# Build
RUN ./mvnw -B package -Pnative -DskipTests


### Deployer
FROM debian:bookworm-20250929-slim AS deploy
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy
WORKDIR /app
COPY --from=build /app/target/server ./tasknote-api

ARG BUILD
ARG SOURCE_PR
ENV BUILD=${BUILD}
ENV SOURCE_PR=${SOURCE_PR}

# Add metadata to the final image
LABEL org.opencontainers.image.authors="Ricardo Campos <ricardompcampos@gmail.com>" \
      org.opencontainers.image.vendor="Ricardo Campos Org" \
      org.opencontainers.image.title="TaskNoteApp server" \
      org.opencontainers.image.description="Spring Cloud Native REST API service" \
      org.opencontainers.image.version="${SOURCE_PR}" \
      org.opencontainers.image.source="https://github.com/ricardo-campos-org/react-typescript-todolist"

# User, port and health check
USER 1001
EXPOSE ${PORT}
#HEALTHCHECK CMD timeout 10s bash -c 'true > /dev/tcp/127.0.0.1/8585'
HEALTHCHECK --interval=30s --timeout=5s CMD ["curl", "-f", "http://localhost:8585/actuator/health"]

# Startup
ENTRYPOINT ["/app/tasknote-api", "-Dspring.profiles.active=prod"]
