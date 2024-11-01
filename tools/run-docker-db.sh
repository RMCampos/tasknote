#!/bin/bash

echo "Getting env vars and making them visible"
cd server/
export $(cat .env | xargs)
echo "Done!"

cd ..

echo "Starting Postgres DB..."
docker run -d --rm \
  --name db \
  -p 5432:5432 \
  -e POSTGRES_DB=$POSTGRES_DB \
  -e POSTGRES_USER=$POSTGRES_USER \
  -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
  -e PGDATA=/tmp \
  -v ./data:/tmp \
  postgres:15.8-bookworm

echo "Done!"
