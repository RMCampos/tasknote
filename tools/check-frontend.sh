#!/bin/bash

docker run -it --rm --name tasknote-web -e CHECK="TRUE" -v ./client:/app tasknote-web:nightly
