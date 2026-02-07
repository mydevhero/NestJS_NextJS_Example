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

cd "${BACKEND_DIR}" || exit 1;

# TUTORIAL(1) - Segui il tutorial -> https://www.prisma.io/docs/getting-started/prisma-postgres/quickstart/prisma-orm
# TUTORIAL(2) - Segui il tutorial -> https://www.prisma.io/docs/getting-started/prisma-orm/add-to-existing-project/prisma-postgres

# TUTORIAL(1.1) - https://www.prisma.io/docs/getting-started/prisma-postgres/quickstart/prisma-orm#1-create-a-new-project
###pnpm add typescript tsx @types/node --save-dev
pnpm exec npx tsc --init

# TUTORIAL(1.2) - https://www.prisma.io/docs/getting-started/prisma-postgres/quickstart/prisma-orm#2-install-required-dependencies
# TUTORIAL(2.1) - https://www.prisma.io/docs/getting-started/prisma-orm/add-to-existing-project/prisma-postgres#1-set-up-prisma-orm
###pnpm add prisma @types/node @types/pg --save-dev
###pnpm add @prisma/client @prisma/adapter-pg pg dotenv

# Swagger e lettura delle variabili d'ambiente (@nestjs/config)
###pnpm add @nestjs/swagger @nestjs/config swagger-ui-express
###pnpm add -D @types/swagger-ui-express
###pnpm add class-validator class-transformer


# TUTORIAL(1.3) - https://www.prisma.io/docs/getting-started/prisma-postgres/quickstart/prisma-orm#3-configure-esm-support
# Il tutorial suggerisce di configurare tsconfig.json con una sua configurazione
# Problema: backend/tsconfig.json è stato creato danno script NOTA(1)
# Soluzione: faccio un merge manuale del file creato da nest con le modifiche proposte da prisma e creo una patch
# Mantenimento: nel tempo verifica prima di ogni utilizzo dello script se la base fornita da nest e la configurazione
#  proposta da prisma sono cambiate, eventualmente fai il merge manuale e crea la patch

# TUTORIAL(2.2) - https://www.prisma.io/docs/getting-started/prisma-orm/add-to-existing-project/prisma-postgres#2-initialize-prisma-orm
pnpm exec npx prisma init --datasource-provider postgresql --output ../generated/prisma

# !!! : Il file .env è stato settato automaticamente, ma non corrisponde alla
#  configurazione di questo progetto, lo usiamo come documentazione
#
# Dati di accesso con il container di PostgreSQL
#  fai corrispondere i dati del container con la stringa
echo '# Solo come esempio' > .env
echo '# DATABASE_URL="postgresql://user:password@localhost:5432/quiz_db?schema=public"' >> .env

#pnpm install
#rm pnpm-lock.yaml
################################################################################
# Aggiungiamo i dati di progetto                                               #
################################################################################

# A questo punto possiamo aggiungere quel che serve per iniziare il progetto
#  secondo le specifiche. La definizione "concreta" è nella directory /setup

# Copia main.ts
cp "$SETUP_BACKEND_DIR/src/main.ts" src/

nest generate module quiz
nest generate controller quiz
nest generate service quiz

nest generate module auth
nest generate controller auth
nest generate service auth

# mkdir -p src/quiz/dto/ || exit 1;

# Copia tsconfig.json
cp "$SETUP_BACKEND_DIR/tsconfig.json" .

# Copia backend/src
cp -a "$SETUP_BACKEND_DIR/src" .

# Test di integrazione module dei quiz
cp -a "$SETUP_BACKEND_DIR/test" .

# Copia la libreria condivisa
cp -a "$SETUP_BACKEND_DIR/lib" .

# Copia Prisma
cp -a "$SETUP_BACKEND_DIR/prisma" .
cp -a "$SETUP_BACKEND_DIR/prisma.config.ts" .

# Arrivati fin qui possiamo iniziare la migrazione verso PostgreSQL, ma prima
#  facciamo il reset nel db casomai ci sono residui vecchi, stiamo
#  inizializzando un nuovo progetto, quindi è obbligatorio partire con un db che
#  sia certamente vuoto
rm -fr prisma/migrations
pnpm exec prisma migrate reset -f

# Prepariamo la migrazione col nuovo prisma/schema.prisma
pnpm exec npx prisma migrate dev --name init

# Genera i client prisma
pnpm exec npx prisma generate

# Seeding
pnpm exec prisma db seed

# vim: set tabstop=2 shiftwidth=2 expandtab colorcolumn=121 :
