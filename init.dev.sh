#!/usr/bin/env bash
set -e

if ! command -v docker-compose &> /dev/null; then
    echo "docker-compose não encontrado."
    exit 1
fi

if [ ! -f .env ]; then
    echo "Arquivo .env não encontrado."
    exit 1
fi

export $(grep -v '^#' .env | xargs)

pnpm install
docker-compose up -d
pnpm db:push
pnpm db:seed
pnpm dev
