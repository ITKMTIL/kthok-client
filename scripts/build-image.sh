#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if [ -f .env ]; then
  set -a
  . ./.env
  set +a
fi

IMAGE="${IMAGE:-kthok-client}"
TAG="${TAG:-latest}"
PLATFORM="${PLATFORM:-linux/amd64}"

docker build --platform="$PLATFORM" \
  --build-arg NEXT_PUBLIC_CORE_URL="${NEXT_PUBLIC_CORE_URL:-http://localhost:3001}" \
  --build-arg NEXT_PUBLIC_GOOGLE_CLIENT_ID="${NEXT_PUBLIC_GOOGLE_CLIENT_ID:-}" \
  --build-arg NEXT_PUBLIC_SITE_URL="${NEXT_PUBLIC_SITE_URL:-http://localhost:3000}" \
  -t "$IMAGE:$TAG" .

if [ "${PUSH:-0}" = "1" ]; then
  docker push "$IMAGE:$TAG"
fi

echo "Built $IMAGE:$TAG for $PLATFORM"
