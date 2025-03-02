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
FROM debian:bookworm-slim AS deploy
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy
WORKDIR /app
COPY --from=build /app/target/server ./tasknote-api

ARG BUILD
ENV BUILD=${BUILD}

# User, port and health check
USER 1001
EXPOSE ${PORT}
#HEALTHCHECK CMD timeout 10s bash -c 'true > /dev/tcp/127.0.0.1/8585'
HEALTHCHECK --interval=30s --timeout=5s CMD ["curl", "-f", "http://localhost:8585/actuator/health"]

# Startup
ENTRYPOINT ["/app/tasknote-api", "-Dspring.profiles.active=prod"]
