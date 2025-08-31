#!/bin/bash
# Checks if a given image and tag are present locally to prevent running when it's not

TARGET="$1"

IS=$(docker images $TARGET:candidate | wc -l)

if [ $IS -eq 0 ]; then
	echo "Image $TARGET:candidate not found locally, please build it"
	exit 1;
fi

echo "Image $TARGET:candidate found"
exit 0
