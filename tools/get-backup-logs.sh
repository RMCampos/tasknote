#!/bin/bash

# Configuration
NAMESPACE="tasknote"
LABEL="app=tasknote-db-backup"

# Get the name of the most recent backup pod
LATEST_POD=$(kubectl get pods -n "$NAMESPACE" -l "$LABEL" --sort-by=.metadata.creationTimestamp -o jsonpath='{.items[-1].metadata.name}' 2>/dev/null)

if [ -z "$LATEST_POD" ]; then
  echo "Error: No backup pods found in namespace '$NAMESPACE' with label '$LABEL'."
  exit 1
fi

echo "--- Logs for latest backup pod: $LATEST_POD ---"
kubectl logs -n "$NAMESPACE" "$LATEST_POD"
