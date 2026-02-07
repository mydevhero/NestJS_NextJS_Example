SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

source "$SCRIPT_DIR/configure_env.sh"

curl -X POST http://localhost:3000/quiz/1/answer -H "Content-Type: application/json" -d '{"userId": 1, "answer": 0}'
