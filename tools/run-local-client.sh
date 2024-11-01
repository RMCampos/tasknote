#!/bin/bash

echo "Getting env vars and making them visible"
cd client/
export $(cat .env | xargs)
echo "Done!"

npm start
