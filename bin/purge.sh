SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$SCRIPT_DIR/.."

cd "${PROJECT_DIR}" || exit 1;

rm frontend backend node_modules pnpm-lock.yaml docker-compose.yml -fr
