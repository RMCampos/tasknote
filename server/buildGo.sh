#!/bin/bash

CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build check.go
chmod +x check
mv check buildpacks/healthcheck/healthcheck

