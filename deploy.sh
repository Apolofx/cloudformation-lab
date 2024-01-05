#!/bin/bash

# Check if .env file exists
if [ ! -f .env ]; then
  echo "Error: .env file not found"
  exit 1
fi

# Read the .env file and construct parameter overrides
parameter_overrides="--parameter-overrides"

while IFS='=' read -r key value || [[ -n "$key" ]]; do
  parameter_overrides+=" $key=$value"
done < .env

echo "Running 'sam deploy' command with parameter overrides:"
echo "$parameter_overrides"


sam deploy $parameter_overrides
