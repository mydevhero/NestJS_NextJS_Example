#!/usr/bin/env bash

# Inizializza il backend

# NOTE: Testato con node --version v24.13.0
# NOTE: Assicurati di installare pnpm [npm install -g pnpm]
# NOTE: Tutti i comandi npm trovati sui tutorial saranno sostituiti dalla controparte pnpm

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$SCRIPT_DIR/.."
SETUP_BACKEND_DIR="$PROJECT_DIR/setup/backend"
BACKEND_DIR="$PROJECT_DIR/backend"

source "$SCRIPT_DIR/configure_env.sh"

cd "$PROJECT_DIR"

# NOTA(1) - Crea progetto nest
nest new backend --skip-git --strict --package-manager pnpm # Specifica a NestJS di utilizzare pnpm come gestore pacchetti

cd "${BACKEND_DIR}" || exit 1;

# Copia package.json
cp "$SETUP_BACKEND_DIR/package.json" .

# vim: set tabstop=2 shiftwidth=2 expandtab colorcolumn=121 :
