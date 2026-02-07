#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$SCRIPT_DIR/.."

cd "${PROJECT_DIR}" || exit 1;

pnpm install --ignore-workspace && ./bin/setup_frontend_init.sh && pnpm --filter frontend install --no-frozen-lockfile && ./bin/setup_frontend.sh && pnpm --filter frontend build
