#!/usr/bin/env bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

source "$SCRIPT_DIR/configure_env.sh"

BACKEND_DIR="$SCRIPT_DIR/../backend"

cd "${BACKEND_DIR}" || exit 1;

pnpm exec prisma studio

# vim: set tabstop=2 shiftwidth=2 expandtab colorcolumn=121 :
