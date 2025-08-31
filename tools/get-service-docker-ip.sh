#!/bin/bash

SERVICE="$1"

# Get the IP address of the Docker container running the database
IP=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $SERVICE)

# Output the IP address
echo "$IP"
