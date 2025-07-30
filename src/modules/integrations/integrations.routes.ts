import { FastifyInstance } from "fastify";
import { buildIntegrationsModule } from "./integrations.module";

export const integrationsRoutes = (app: FastifyInstance) => {
  const controller = buildIntegrationsModule();

  app.get("/", async (req, reply) => {
    const { body, statusCode } = await controller.getData();

    return reply.status(statusCode).send(body);
  });
};
