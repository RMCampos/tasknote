#!/bin/bash

TARGET="$1"
echo "Check for running image for $TARGET"

IS=$(docker ps --filter name=$TARGET --filter status=running | grep $TARGET | wc -l)

if [ $IS -eq 1 ]; then
	echo "Service $TARGET is running"
	exit 0
fi

echo "Service $TARGET not running"
exit 1
