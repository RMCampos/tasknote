#!/bin/bash
# Check if a given service is not running
# Return 0 (success) if it's not

TARGET="$1"
echo "Check for running image for $TARGET"

IS=$(docker ps --filter name=$TARGET --filter status=running | grep $TARGET | wc -l)

if [ $IS -eq 0 ]; then
	echo "Service $TARGET is not running"
	exit 0
fi

echo "Service $TARGET is running"
exit 1
