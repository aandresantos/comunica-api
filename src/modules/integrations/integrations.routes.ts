import { FastifyInstance } from "fastify";
import { buildIntegrationsModule } from "./integrations.module";

export const integrationsRoutes = (app: FastifyInstance) => {
  const controller = buildIntegrationsModule();

  app.get(
    "/",
    {
      config: { rateLimit: { max: 15, timeWindow: "1 minute" } },
    },
    async (req, reply) => {
      const { body, statusCode } = await controller.getData(req);

      return reply.status(statusCode).send(body);
    }
  );
};
