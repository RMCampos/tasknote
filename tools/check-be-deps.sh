#!/bin/bash

CURRENT_DIR=$(pwd)

if [ ! -f "$CURRENT_DIR/pom.xml" ]; then
  cd "$CURRENT_DIR/server"
fi

#
# Get latest version of the `maven-failsafe-plugin` plugin
#
LATEST_FAILSAFE=$(
  curl -s https://repo1.maven.org/maven2/org/apache/maven/plugins/maven-failsafe-plugin/maven-metadata.xml \
| grep -oE '<version>[0-9]+\.[0-9]+(\.[0-9]+)?</version>' \
| sed -E 's/<\/?version>//g' \
| sort -V \
| tail -n 1
)

# Get current version from pom.xml, reading from the `failsafe.version` property
CURRENT_FAILSAFE=$(./mvnw help:evaluate -Dexpression=failsafe.version -q -DforceStdout 2>/dev/null)

if [ "$LATEST_FAILSAFE" != "$CURRENT_FAILSAFE" ]; then
    echo "The maven-failsafe-plugin is outdated. Current version: $CURRENT_FAILSAFE, Latest version: $LATEST_FAILSAFE"
    exit 1
else
    echo "The maven-failsafe-plugin is up to date. Current version: $CURRENT_FAILSAFE"
fi



#
# Get latest version of the `maven-surefire-plugin` plugin
#
LATEST_SUREFIRE=$(
  curl -s https://repo1.maven.org/maven2/org/apache/maven/plugins/maven-surefire-plugin/maven-metadata.xml \
| grep -oE '<version>[0-9]+\.[0-9]+(\.[0-9]+)?</version>' \
| sed -E 's/<\/?version>//g' \
| sort -V \
| tail -n 1
)

# Get current version from pom.xml, reading from the `surefire.version` property
CURRENT_SUREFIRE=$(./mvnw help:evaluate -Dexpression=surefire.version -q -DforceStdout 2>/dev/null)

if [ "$LATEST_SUREFIRE" != "$CURRENT_SUREFIRE" ]; then
    echo "The maven-surefire-plugin is outdated. Current version: $CURRENT_SUREFIRE, Latest version: $LATEST_SUREFIRE"
    exit 1
else
    echo "The maven-surefire-plugin is up to date. Current version: $CURRENT_SUREFIRE"
fi



#
# Get latest version of the `maven-jacoco-plugin` plugin
#
LATEST_JACOCO=$(
  curl -s https://repo1.maven.org/maven2/org/jacoco/jacoco-maven-plugin/maven-metadata.xml \
| grep -oE '<version>[0-9]+\.[0-9]+(\.[0-9]+)?</version>' \
| sed -E 's/<\/?version>//g' \
| sort -V \
| tail -n 1
)

# Get current version from pom.xml, reading from the `jacoco.version` property
CURRENT_JACOCO=$(./mvnw help:evaluate -Dexpression=jacoco.version -q -DforceStdout 2>/dev/null)
if [ "$LATEST_JACOCO" != "$CURRENT_JACOCO" ]; then
    echo "The maven-jacoco-plugin is outdated. Current version: $CURRENT_JACOCO, Latest version: $LATEST_JACOCO"
    exit 1
else
    echo "The maven-jacoco-plugin is up to date. Current version: $CURRENT_JACOCO"
fi


# --
#
# Get latest version of the `maven-checkstyle-plugin` plugin
#
LATEST_CHECKSTYLE=$(
  curl -s https://repo1.maven.org/maven2/org/apache/maven/plugins/maven-checkstyle-plugin/maven-metadata.xml \
| grep -oE '<version>[0-9]+\.[0-9]+(\.[0-9]+)?</version>' \
| sed -E 's/<\/?version>//g' \
| sort -V \
| tail -n 1
)

# Get current version from pom.xml, reading from the `checkstyle.version` property
CURRENT_CHECKSTYLE=$(./mvnw help:evaluate -Dexpression=checkstyle.version -q -DforceStdout 2> /dev/null)
if [ "$LATEST_CHECKSTYLE" != "$CURRENT_CHECKSTYLE" ]; then
    echo "The maven-checksytle-plugin is outdated. Current version: $CURRENT_CHECKSTYLE, Latest version: $LATEST_CHECKSTYLE"
    exit 1
else
    echo "The maven-cehckstyle-plugin is up to date. Current version: $CURRENT_CHECKSTYLE"
fi


# --

#
# Get latest version of the Spring Boot Starter Web plugin
# 
LATEST_SPRINGBOOT=$(
  curl -s https://repo1.maven.org/maven2/org/springframework/boot/spring-boot-maven-plugin/maven-metadata.xml \
| grep -oE '<version>[0-9]+\.[0-9]+(\.[0-9]+)?</version>' \
| sed -E 's/<\/?version>//g' \
| sort -V \
| tail -n 1
)

# Get current version from pom.xml, reading from the `springboot.version` property
CURRENT_SPRINGBOOT=$(./mvnw help:evaluate -Dexpression=springboot.version -q -DforceStdout 2>/dev/null)
if [ "$LATEST_SPRINGBOOT" != "$CURRENT_SPRINGBOOT" ]; then
    echo "Spring Boot is outdated. Current version: $CURRENT_SPRINGBOOT, Latest version: $LATEST_SPRINGBOOT"
    exit 1
else
    echo "Spring Boot is up to date. Current version: $CURRENT_SPRINGBOOT"
fi 

