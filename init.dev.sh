#!/usr/bin/env bash
set -e

if command -v docker compose >/dev/null 2>&1; then
  DC="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
  DC="docker-compose"
else
  echo "Erro: nem docker compose nem docker-compose encontrado."
  exit 1
fi

if [ ! -f .env ]; then
  echo "Arquivo .env não encontrado."
  exit 1
fi

export $(grep -v '^#' .env | xargs)

pnpm install
$DC up -d database 
pnpm db:push
pnpm db:seed
pnpm dev
