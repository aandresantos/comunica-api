import fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { randomUUID } from "crypto";

import { announcementsRoutes } from "@src/modules/announcements/announcements.routes";
import { errorHandler } from "@shared/handlers/error.handler";
import { swaggerConfig } from "@configs/swagger.config";
import { loggerOpts } from "@configs/logger.config";

export const buildApp = () => {
  const app = fastify({
    logger: loggerOpts,
  });

  app.addHook("onRequest", async (request, reply) => {
    const traceId = (request.headers["x-trace-id"] as string) || randomUUID();
    (request as any).traceId = traceId;
    reply.header("x-trace-id", traceId);
  });

  app.addHook("onRequest", async (request) => {
    request.log = request.log.child({
      traceId: (request as any).traceId,
      component: "api",
    });
  });

  app.setErrorHandler(errorHandler);

  app.register(fastifySwagger, swaggerConfig);

  app.register(fastifySwaggerUi, { routePrefix: "/docs" });
  app.register(announcementsRoutes, { prefix: "/chamados" });

  return app;
};
