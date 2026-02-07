#!/usr/bin/env bash

# Inizializza il backend

# NOTE: Testato con node --version v24.13.0
# NOTE: Assicurati di installare pnpm [npm install -g pnpm]
# NOTE: Tutti i comandi npm trovati sui tutorial saranno sostituiti dalla controparte pnpm

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$SCRIPT_DIR/.."
SETUP_FRONTEND_DIR="$PROJECT_DIR/setup/frontend"
FRONTEND_DIR="$PROJECT_DIR/frontend"

source "$SCRIPT_DIR/configure_env.sh"

cd "$PROJECT_DIR"

# Inizia creando il frontend
pnpm npx create-next-app@latest frontend \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --use-pnpm \
  --yes

cd "${FRONTEND_DIR}" || exit 1;

#creato da next con la flag use-pnpm
rm pnpm-lock.yaml

cp -a "$SETUP_FRONTEND_DIR/package.json" .

# vim: set tabstop=2 shiftwidth=2 expandtab colorcolumn=121 :
