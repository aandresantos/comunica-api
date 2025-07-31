#!/usr/bin/env bash
set -e

if ! command -v docker-compose &> /dev/null; then
    echo "docker-compose não encontrado."
    exit 1
fi

docker-compose down -v
