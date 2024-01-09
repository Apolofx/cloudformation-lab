#!/bin/bash
# This script reads the current ENV environment variable value and injects
# the corresponding parameter values to the template.yaml before `sam deploy`

script_dir=$(dirname "$(realpath "$0")")

if [ -z "$ENV" ]; then
  echo "Error: ENV environment variable not set"
  exit 1
fi

env_file=$(find "$script_dir" -maxdepth 1 -type f -name ".env.$ENV")

if [ -z "$env_file" ]; then
  echo "Error: .env.$ENV not found in the script's directory"
  exit 1
fi

parameter_overrides=""

while IFS='=' read -r key value || [[ -n "$key" ]]; do
  parameter_overrides+=" $key=$value"
done < "$env_file"

echo "Parameter overrides for '$ENV' environment"
echo "$parameter_overrides"
export CLOUDFORMATION_PARAMETER_OVERRIDES="$parameter_overrides"