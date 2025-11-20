#!/usr/bin/env bash
set -euo pipefail

# Wait for compose services to report 'Up' then tail logs.
# Usage: compose-logs-wait.sh [compose-file] [services...]

COMPOSE_FILE=${1:-/workspace/docker-compose.yml}
shift || true
SERVICES=(${@:-web tailwind})

MAX_WAIT=60
SLEEP_INTERVAL=1

echo "Waiting for compose services to start: ${SERVICES[*]} (compose file: ${COMPOSE_FILE})"
start_time=$(date +%s)

all_up() {
  for svc in "${SERVICES[@]}"; do
    # Check if the service shows 'Up' in docker-compose ps output
    if ! docker-compose -f "${COMPOSE_FILE}" ps "${svc}" 2>/dev/null | grep -q "Up"; then
      return 1
    fi
  done
  return 0
}

while true; do
  if all_up; then
    echo "Compose services are up. Attaching to logs..."
    break
  fi
  now=$(date +%s)
  elapsed=$((now - start_time))
  if [ "$elapsed" -ge "$MAX_WAIT" ]; then
    echo "Timed out waiting for services to be fully up after ${MAX_WAIT}s. Attaching to logs anyway..."
    break
  fi
  sleep ${SLEEP_INTERVAL}
done

exec docker-compose -f "${COMPOSE_FILE}" logs -f "${SERVICES[@]}"
