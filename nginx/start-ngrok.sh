#!/bin/bash

ngrok http 8181 --log=stdout > ngrok-8181.log 2>&1 &

