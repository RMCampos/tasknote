#!/bin/bash

if [ -z "${DEPLOY_DOMAIN}" ]; then
  echo "DEPLOY_DOMAIN not defined."
  exit 1
fi

if [ -z "${API_KEY}" ]; then
  echo "API_KEY not defined."
  exit 1
fi

if [ -z "${CLIENT_APPID}" ]; then
  echo "CLIENT_APPID not defined."
  exit 1
fi

if [ -z "${PROD_URL}" ]; then
  echo "PROD_URL not defined."
  exit 1
fi

echo "DEPLOY_DOMAIN=${DEPLOY_DOMAIN}"
echo "API_KEY=${API_KEY}"
echo "CLIENT_APPID=${CLIENT_APPID}"
echo "PROD_URL=${PROD_URL}"
echo "cURL version $(curl --version)"

echo -e "\nPre-deployment check..."
if ! curl -s -f "${PROD_URL}" > /dev/null ; then
  echo "Prod environment is not healthy"
else
  echo "Prod environment is healthy"
fi

echo -e "\nUpdating Docker image tag..."
response=$(curl -X POST \
  "${DEPLOY_DOMAIN}/api/application.saveDockerProvider" \
  --max-time 30 \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -H "x-api-key: ${API_KEY}" \
  -d '{
    "dockerImage": "ghcr.io/ricardo-campos-org/react-typescript-todolist/client:prod-v359",
    "applicationId": "'"${CLIENT_APPID}"'",
    "username": "'"${GHCR_USERNAME}"'",
    "password": "'"${GHCR_PASSWORD}"'",
    "registryUrl": "ghcr.io"
    }' \
  -w "\n%{http_code}" \
  -s)

echo -e "\nResponse: $response"

status_code=$(echo "$response" | tail -n1)
echo -e "\nStatus code: $status_code"

if [ "$status_code" != "200" ]; then
  body=$(echo "$response" | sed '$d')
  
  echo "Update failed with status code $status_code"
  echo "Response body: $body"
  exit 1
else
  echo "Update succeeded!"
fi

echo -e "\nDeploying to prod (target: ${PROD_URL})..."
response=$(curl -X POST \
  "${DEPLOY_DOMAIN}/api/application.deploy" \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -H "x-api-key: ${API_KEY}" \
  -d "{\"applicationId\":\"${CLIENT_APPID}\"}" \
  -w "\n%{http_code}" \
  -s)

status_code=$(echo "$response" | tail -n1)
echo -e "\nStatus code: $status_code"

if [ "$status_code" != "200" ]; then
  body=$(echo "$response" | sed '$d')
  
  echo "Deployment failed with status code $status_code"
  echo "Response body: $body"
  exit 1
else
  echo "Deployment succeeded!"
fi

echo -e "\nVerifying deployment..."

sleep 15

echo -e "\nPre-deployment check..."
if ! curl -s -f "${PROD_URL}" > /dev/null ; then
  echo "Prod environment is not healthy"
else
  echo "Prod environment is healthy"
fi
