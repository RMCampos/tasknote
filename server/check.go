package main

import (
	"net/http"
	"os"
	"time"
)

func main() {
	client := http.Client{
		Timeout: 5 * time.Second,
	}
	// Use 127.0.0.1 as the healthcheck runs inside the container
	resp, err := client.Get("http://127.0.0.1:8585/health")
	if err != nil || resp.StatusCode != http.StatusOK {
		os.Exit(1)
	}
	os.Exit(0)
}
