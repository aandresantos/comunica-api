import fastify from "fastify";

export const buildApp = () => {
  const app = fastify({ logger: true });

  return app;
};
