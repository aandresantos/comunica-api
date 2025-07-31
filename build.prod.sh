#!/usr/bin/env bash
set -e

IMAGE_NAME="comunica-api:latest"
CONTAINER_NAME="comunica_api"
DB_CONTAINER_NAME="comunica_db_dev"
PORT=3000
DB_PORT=5432

if command -v docker compose >/dev/null 2>&1; then
  DC="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
  DC="docker-compose"
else
  echo "Erro: nem docker compose nem docker-compose encontrado."
  exit 1
fi

echo "🔹 Construindo a imagem Docker..."
docker build -t $IMAGE_NAME .

echo "🔹 Removendo containers anteriores (API e DB se existirem)..."
docker rm -f $CONTAINER_NAME 2>/dev/null || true

DB_CONTAINERS=$(docker ps -a --filter "name=$DB_CONTAINER_NAME" -q)
if [ -n "$DB_CONTAINERS" ]; then
  echo "Encontrado(s) container(s) de DB antigo(s): $DB_CONTAINERS"
  docker rm -f $DB_CONTAINERS
fi

echo "🔹 Liberando porta $DB_PORT se estiver ocupada..."
if lsof -i tcp:$DB_PORT -sTCP:LISTEN -t >/dev/null; then
  PID=$(lsof -i tcp:$DB_PORT -sTCP:LISTEN -t)
  echo "Matando processo PID $PID na porta $DB_PORT"
  kill -9 $PID
fi

echo "🔹 Limpando imagens e containers parados..."
docker image prune -f
docker container prune -f

echo "🔹 Subindo todos os serviços com $DC up..."
$DC up -d

echo "✅ Tudo pronto!"
