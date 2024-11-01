#!/bin/bash

echo "Getting env vars and making them visible"
cd client/
export $(cat .env | xargs)
echo "Done!"

cd ..

docker build --file client/Dockerfile.dev --tag client:nightly .

SERVER_HOST="http://"$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' server)":8585"

echo "SERVER_HOST=$SERVER_HOST"

docker run -d --rm \
  --name client \
  -p 5000:5000 \
  -e VITE_BACKEND_SERVER="$SERVER_HOST" \
  -e VITE_BUILD=nightly \
  -v ./client:/app \
  client:nightly  
