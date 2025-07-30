import fastify, { FastifyReply, FastifyRequest } from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fCors from "@fastify/cors";
import fjwt from "@fastify/jwt";
import fCookie from "@fastify/cookie";
import { sql } from "drizzle-orm";

import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";

import { authRoutes } from "@auth/auth.routes";
import { integrationsRoutes } from "@integrations/integrations.routes";
import { announcementsRoutes } from "@announcements/announcements.routes";

import { errorHandler } from "@shared/handlers/error.handler";
import { ForbiddenError, UnauthorizedError } from "@shared/errors";

import { loggerOpts } from "@configs/logger.config";
import { swaggerConfig } from "@configs/swagger.config";
import { authConfig } from "@configs/auth.config";
import { database } from "@configs/database.config";

import {
  responseError,
  responseSuccess,
} from "@shared/helpers/response.helpers";
import { publicRoutesMiddleware } from "./shared/middlewares/auth.middleware";

export const buildApp = () => {
  const app = fastify({
    logger: loggerOpts,
  }).withTypeProvider<ZodTypeProvider>();

  app.addHook("preValidation", (req, reply) =>
    publicRoutesMiddleware(app, req, reply)
  );

  app.register(fCors, {
    origin: (origin, callback) => {
      const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || "").split(
        ","
      );

      if (process.env.NODE_ENV !== "production") {
        if (!origin || origin.startsWith("http://localhost")) {
          callback(null, true);
          return;
        }
      }

      if (allowedOrigins.includes(origin as string)) {
        callback(null, true);
      } else {
        callback(new ForbiddenError("Access blocked by CORS policy."), false);
      }
    },

    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  app.register(fjwt, { secret: authConfig.jwt.secret });

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

  app.setErrorHandler(errorHandler);
  app.register(fastifySwagger, swaggerConfig);

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.register(fastifySwaggerUi, { routePrefix: "/docs" });
  app.register(authRoutes, { prefix: "/auth" });
  app.register(announcementsRoutes, {
    prefix: "/chamados",
    preValidation: [app.authenticate],
  });
  app.register(integrationsRoutes, {
    prefix: "/integracao/dados",
    preValidation: [app.authenticate],
  });

  app.get("/health", async (req, reply) => {
    try {
      await database.execute(sql`SELECT 1`);

      const { body, statusCode } = responseSuccess({ db: "connected" });

      reply.status(statusCode).send(body);
    } catch (error) {
      req.log.error(error, "Health check failed: database connection error.");

      const { statusCode, body } = responseError(["db disconnected"], 503);

      reply.status(statusCode).send(body);
    }
  });

  return app;
};
