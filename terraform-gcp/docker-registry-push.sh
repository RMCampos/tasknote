#!/bin/bash

PROJECT_ID="replace-me"
VERSION="23"
SOURCE_IMG="ghcr.io/rmcampos/tasknote/api:$VERSION"
DESTINATION_IMG="us-central1-docker.pkg.dev/$PROJECT_ID/tasknote-repo/api:$VERSION"
GHCR_PAT="replace-me"

# Login
echo $GHCR_PAT | docker login ghcr.io -u user --password-stdin
echo "Logged in on ghcr.io"

gcloud auth configure-docker us-central1-docker.pkg.dev
docker login us-central1-docker.pkg.dev
echo "Logged in on GCP Container Registry"

crane auth login ghcr.io -u RMCampos -p $GHCR_PAT
echo "Logged crane in on ghcr.io"

# Check if image already exists in destination
echo "Checking if $DESTINATION_IMG already exists in destination registry..."
if crane manifest "$DESTINATION_IMG" > /dev/null 2>&1; then
    echo "Image $DESTINATION_IMG already exists. Skipping push."
else
    echo "Image not found in destination. Proceeding with push..."
    
    docker pull $SOURCE_IMG
    docker tag $SOURCE_IMG $DESTINATION_IMG
    docker push $DESTINATION_IMG
    echo "Pushed image to GCP Container Registry"

    crane copy $SOURCE_IMG $DESTINATION_IMG
    echo "Copied image to GCP Container Registry with crane"
fi

# Verification
echo "Verifying push..."
if crane manifest "$DESTINATION_IMG" > /dev/null 2>&1; then
    echo "SUCCESS: Image $DESTINATION_IMG is properly pushed and available in the registry."
    gcloud artifacts docker images list us-central1-docker.pkg.dev/project-9f22294e-b6f5-41de-83c/tasknote-repo | grep "api:$VERSION"
else
    echo "FAILURE: Image $DESTINATION_IMG was not found in the destination registry."
    exit 1
fi

