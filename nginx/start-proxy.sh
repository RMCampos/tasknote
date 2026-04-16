#!/bin/bash


docker run -d \
  --name ngrok-tasknote-proxy \
  -p 127.0.0.1:8181:8181 \
  -v ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro \
  --restart unless-stopped \
  --network tasknote-network \
  nginx:stable
