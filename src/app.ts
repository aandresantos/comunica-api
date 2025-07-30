import fastify, { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fjwt, { FastifyJWT } from "@fastify/jwt";
import fCookie from "@fastify/cookie";

import { announcementsRoutes } from "@src/modules/announcements/announcements.routes";
import { errorHandler } from "@shared/handlers/error.handler";
import { swaggerConfig } from "@configs/swagger.config";
import { loggerOpts } from "@configs/logger.config";
import { integrationsRoutes } from "./modules/integrations/integrations.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { authConfig } from "./lib/configs/auth.config";
import { publicRoutesMiddleware } from "./shared/middlewares/auth.middleware";
import { UnauthorizedError } from "./shared/errors";

export const buildApp = () => {
  const app = fastify({
    logger: loggerOpts,
  });

  app.register(fCookie, {
    secret: authConfig.cookie.secret,
    hook: "preHandler",
  });

  app.register(fjwt, {
    secret: authConfig.jwt.secret,
    cookie: {
      cookieName: "access_token",
      signed: true,
    },
  });

  app.decorate(
    "authenticate",
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        await req.jwtVerify();
      } catch (err) {
        throw new UnauthorizedError("Unauthorized");
      }
    }
  );

  app.addHook(
    "preHandler",
    async (req, reply) => await publicRoutesMiddleware(app, req, reply)
  );

  app.setErrorHandler(errorHandler);
  app.register(fastifySwagger, swaggerConfig);

  app.register(fastifySwaggerUi, { routePrefix: "/docs" });
  app.register(authRoutes, { prefix: "/auth" });
  app.register(announcementsRoutes, { prefix: "/chamados" });
  app.register(integrationsRoutes, { prefix: "/integracao/dados" });

  return app;
};
