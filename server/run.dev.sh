#!/bin/bash

./mvnw -ntp \
  spring-boot:run \
  -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=*:5005" \
  -Dmaven.plugin.validation=VERBOSE
