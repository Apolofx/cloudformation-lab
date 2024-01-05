#!/bin/bash

if [ -z "$ENV" ]; then
  echo "Error: ENV environment variable not set"
  exit 1
fi

env_file=".env.$ENV"

if [ ! -f "$env_file" ]; then
  echo "Error: $env_file not found"
  exit 1
fi

parameter_overrides="--parameter-overrides"

while IFS='=' read -r key value || [[ -n "$key" ]]; do
  parameter_overrides+=" $key=$value"
done < "$env_file"

echo "Running 'sam deploy' command with parameter overrides:"
echo "$parameter_overrides"

sam deploy $parameter_overrides -t ../template.yaml --stack-name=sam-app-$ENV --config-file ./ci/samconfig.toml
