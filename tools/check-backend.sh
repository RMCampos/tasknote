#!/bin/bash

cd java-api
./mvnw --no-transfer-progress clean compile -DskipTests && \
  ./mvnw --no-transfer-progress checkstyle:checkstyle -Dskip.checkstyle=false && \
  ./mvnw --no-transfer-progress clean verify -P tests --file pom.xml