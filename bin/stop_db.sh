#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/configure_env.sh"

CONTAINER_NAME="${POSTGRES_DB:-quiz_db}"

docker stop ${CONTAINER_NAME}
