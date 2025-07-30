import fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { randomUUID } from "crypto";

import { announcementsRoutes } from "@src/modules/announcements/announcements.routes";
import { errorHandler } from "@shared/handlers/error.handler";
import { swaggerConfig } from "@configs/swagger.config";
import { loggerOpts } from "@configs/logger.config";
import { integrationsRoutes } from "./modules/integrations/integrations.routes";

export const buildApp = () => {
  const app = fastify({
    logger: loggerOpts,
  });

  app.setErrorHandler(errorHandler);

  app.register(fastifySwagger, swaggerConfig);

  app.register(fastifySwaggerUi, { routePrefix: "/docs" });
  app.register(announcementsRoutes, { prefix: "/chamados" });
  app.register(integrationsRoutes, { prefix: "/integracao/dados" });

  return app;
};
