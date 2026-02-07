#!/bin/bash
# start_db.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/configure_env.sh"

CONFIGURED_PORT=${POSTGRES_PORT:-5432}
CONTAINER_NAME="${POSTGRES_DB:-quiz_db}"

# Funzione per generare docker-compose.yml
generate_docker_compose() {
    cat > docker-compose.yml << EOF
version: '3.8'
services:
  postgres:
    image: postgres:16
    container_name: ${CONTAINER_NAME}
    environment:
      POSTGRES_USER: \${POSTGRES_USER:-user}
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD:-password}
      POSTGRES_DB: \${POSTGRES_DB:-quiz_db}
    ports:
      - "\${POSTGRES_PORT:-5432}:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
EOF
    echo "docker-compose.yml generato con container_name: $CONTAINER_NAME"
}

# Funzione per ottenere la porta corrente del container
get_container_port() {
    docker inspect --format='{{(index (index .NetworkSettings.Ports "5432/tcp") 0).HostPort}}' "$CONTAINER_NAME" 2>/dev/null
}

# Funzione per fermare e rimuovere il container
remove_container() {
    docker stop "$CONTAINER_NAME" 2>/dev/null
    docker rm "$CONTAINER_NAME" 2>/dev/null
}

# Funzione per creare nuovo container
create_container() {
    docker compose up -d postgres
}

# Rigenera PrismaClient
# prisma_generate() {
#     BACKEND_DIR="$SCRIPT_DIR/../backend"
#     if [ -d "$BACKEND_DIR" ]; then
#         echo "Genera il nuovo PrismaClient"
#         cd $BACKEND_DIR
#         pnpm exec npx prisma db push
#         pnpm prisma:generate
#         cd -
#     fi
# }

# Genera docker-compose.yml
generate_docker_compose

echo "Controllo container $CONTAINER_NAME..."

# Se il container non esiste, crealo
if ! docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "Creazione container..."
    create_container
else
    # Se esiste ma è fermo, avvialo
    if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        echo "Avvio container..."
        docker start "$CONTAINER_NAME"
    else
        echo "Container in esecuzione"

        # Controlla se la porta è corretta
        CURRENT_PORT=$(get_container_port)

        if [ -n "$CURRENT_PORT" ] && [ "$CURRENT_PORT" != "$CONFIGURED_PORT" ]; then
            echo "Porta errata: $CURRENT_PORT (dovrebbe essere: $CONFIGURED_PORT)"
            echo "Ricreazione automatica..."

            # Ferma e rimuovi il container esistente
            remove_container

            # Crea nuovo container con la porta corretta
            create_container
        else
            echo "Porta corretta: ${CURRENT_PORT:-$CONFIGURED_PORT}"
        fi
    fi
fi

# Attesa connessione PostgreSQL
echo "Attendo PostgreSQL..."
MAX_RETRIES=30
COUNT=0

until docker exec "$CONTAINER_NAME" pg_isready -U "${POSTGRES_USER:-user}" >/dev/null 2>&1 || [ $COUNT -eq $MAX_RETRIES ]; do
    sleep 1
    COUNT=$((COUNT+1))
done

if [ $COUNT -eq $MAX_RETRIES ]; then
    echo "PostgreSQL non risponde"
    exit 1
fi

# Rigenera PrismaClient
# prisma_generate

ACTUAL_PORT=$(get_container_port)
echo "PostgreSQL pronto su localhost:${ACTUAL_PORT:-$CONFIGURED_PORT}"
echo "Container: $CONTAINER_NAME"
echo "Database: ${POSTGRES_DB:-quiz_db}"
echo "Utente: ${POSTGRES_USER:-user}"
