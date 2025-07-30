import { FastifyInstance, FastifyRequest } from "fastify";
import { buildAuthModule } from "./auth.module";
import { registerDto, RegisterInput } from "./dtos/register-input.dto";
import { loginDto, LoginInput } from "./dtos/login-input.dto";

export const authRoutes = (app: FastifyInstance) => {
  const controller = buildAuthModule(app);

  app.post(
    "/register",
    {
      schema: { body: registerDto },
      config: { rateLimit: { max: 5, timeWindow: "1 minute" } },
    },
    async (req, reply) => {
      const { body, statusCode } = await controller.register(
        req as FastifyRequest<{ Body: RegisterInput }>,
        reply
      );

      return reply.status(statusCode).send(body);
    }
  );

  app.post(
    "/login",
    {
      schema: { body: loginDto },
      config: { rateLimit: { max: 5, timeWindow: "1 minute" } },
    },
    async (req, reply) => {
      const { body, statusCode } = await controller.login(
        req as FastifyRequest<{ Body: LoginInput }>,
        reply
      );

      return reply.status(statusCode).send(body);
    }
  );
};
