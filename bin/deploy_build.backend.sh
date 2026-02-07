#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$SCRIPT_DIR/.."

cd "${PROJECT_DIR}" || exit 1;

pnpm install --ignore-workspace && ./bin/setup_backend_init.sh && pnpm --filter backend install --no-frozen-lockfile && ./bin/setup_backend.sh && pnpm --filter backend build
