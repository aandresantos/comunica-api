import { jsonSchemaTransform } from "fastify-type-provider-zod";
import { config } from "./app.config";

export const swaggerConfig = {
  swagger: {
    host: config.app.host,
    info: {
      version: "1.0.0",
      title: "Comunica API",
      description: "Documentação da Comunica API com CRUD completo.",
    },

    securityDefinitions: {
      bearerAuth: {
        type: "apiKey" as const,
        name: "Authorization",
        in: "header",
      },
    },

    security: [{ bearerAuth: [] }],
  },
  transform: jsonSchemaTransform,
};
