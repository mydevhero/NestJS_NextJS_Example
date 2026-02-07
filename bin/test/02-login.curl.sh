SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

source "$SCRIPT_DIR/configure_env.sh"

curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{"nickname": "Alice"}'
