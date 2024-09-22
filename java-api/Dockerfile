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
FROM gcr.io/distroless/java-base:nonroot AS deploy
ARG PORT=8585

# Receive build number as argument, retain as environment variable
ARG BUILD_NUMBER
ENV BUILD_NUMBER=${BUILD_NUMBER}

# Copy
WORKDIR /app
COPY --from=build /app/target/tasknote-api ./tasknote-api

# User, port and health check
USER 1001
EXPOSE ${PORT}
HEALTHCHECK CMD timeout 10s bash -c 'true > /dev/tcp/127.0.0.1/8585'

# Startup
ENTRYPOINT ["/app/tasknote-api", "-Dspring.profiles.active=prod"]
