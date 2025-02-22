# Build static files
# Node Bullseye has npm
FROM node:20.17-bullseye-slim AS build
ENV NODE_OPTIONS="--max-old-space-size=3072"

# Build
WORKDIR /app
COPY *.html *.json *.ts ./
COPY ./src ./src
COPY ./public ./public
RUN npm ci --ignore-scripts --no-update-notifier --omit=dev && \
    npm run build && \
    rm -rf node_modules

# Deploy container
# Caddy serves static files
FROM caddy:2.9.1-alpine
RUN apk add --no-cache ca-certificates curl

# Receive build number as argument, retain as environment variable
ARG BUILD
ENV BUILD=${BUILD}

# Copy files and run formatting
COPY --from=build /app/dist/ /app/dist
COPY Caddyfile /etc/caddy/Caddyfile
RUN caddy fmt --overwrite /etc/caddy/Caddyfile

# User, port and healthcheck
EXPOSE 5000
HEALTHCHECK CMD curl -f http://localhost:5000
USER 1001
