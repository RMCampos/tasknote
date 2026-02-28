#!/bin/bash
# Server - Back-end

CURRENT_DIR=$(pwd)

if [ ! -f "$CURRENT_DIR/pom.xml" ]; then
  cd "$CURRENT_DIR/server"
fi

echo "Running checks..."
echo "1/3 - Check Style started..."
./mvnw --no-transfer-progress checkstyle:check -Dcheckstyle.skip=false
if [ $? -eq 1 ]; then
  echo "Issues when running Check Style. Please review.."
  exit 1
fi

echo "2/3 - Build started..."
./mvnw --no-transfer-progress clean compile -DskipTests
if [ $? -eq 1 ]; then
  echo "Issues when running build. Please review.."
  exit 1
fi

echo "3/3 - Tests started..."
./mvnw --no-transfer-progress clean verify -P tests --file pom.xml
if [ $? -eq 1 ]; then
  echo "Issues when running test. Please review.."
  exit 1
fi

echo "You're good to go! Good job!"
exit 0
