#!/bin/bash

docker run -it --rm --name server -e CHECK="TRUE" -v ./server:/app server:nightly
