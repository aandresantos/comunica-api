import fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

import { config } from "@configs/app.config";
import { announcementsRoutes } from "@src/modules/announcements/announcements.routes";

export const buildApp = () => {
  const app = fastify({ logger: true });

  app.register(fastifySwagger, {
    swagger: {
      host: config.app.host,
      info: {
        version: "1.0.0",
        title: "Comunica API",
        description: "Documentação da Comunica API com CRUD completo.",
      },
    },
  });

  app.register(fastifySwaggerUi, { routePrefix: "/docs" });
  app.register(announcementsRoutes, { prefix: "/chamados" });

  return app;
};
