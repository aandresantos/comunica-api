import { FastifyInstance, FastifyRequest } from "fastify";
import { buildAuthModule } from "./auth.module";
import { validateBody } from "@src/shared/middlewares/body-validator.middleware";
import { registerDto, RegisterInput } from "./dtos/register-input.dto";
import { loginDto, LoginInput } from "./dtos/login-input.dto";

export const authRoutes = (app: FastifyInstance) => {
  const controller = buildAuthModule(app);

  app.post(
    "/register",
    { preHandler: validateBody(registerDto) },
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
    { preHandler: validateBody(loginDto) },
    async (req, reply) => {
      const { body, statusCode } = await controller.login(
        req as FastifyRequest<{ Body: LoginInput }>,
        reply
      );

      return reply.status(statusCode).send(body);
    }
  );
};
