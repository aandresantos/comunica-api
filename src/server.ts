import Fastify, { FastifyInstance } from "fastify";

const server: FastifyInstance = Fastify({});

server.get("/", async (request, reply) => {
  return { data: "ta rodando :P" };
});

const start = async () => {
  await server.listen({ port: 3000 });
};

start();
