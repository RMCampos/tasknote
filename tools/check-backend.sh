#!/bin/bash

DOCKER_IMG="tasknote-api:nightly"

docker image inspect $DOCKER_IMG --format="ignore me"
if [ $? -eq 1 ]; then
  echo "Image not found locally! Building it..."

  if [ ! -f "server/.env" ]; then
    echo "No env file found for back-end. Creating one for you.."
    bash tools/run-create-env.sh "back"
  else
    echo "Env file in place. Moving on.."
  fi

  echo "Getting env vars and making them visible"
  cd server/
  export $(cat .env | xargs)
  echo "Done!"

  cd ..
  docker build --file server/Dockerfile.dev --tag tasknote-api:nightly .
else
  echo "Image found! Let's keep going."
fi


docker run -it --rm --name tasknote-api -e CHECK="TRUE" -v ./server:/app tasknote-api:nightly
