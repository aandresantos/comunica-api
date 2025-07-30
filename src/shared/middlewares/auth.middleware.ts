import { IAuthService } from "@src/modules/auth/auth.interfaces";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export const publicRoutesMiddleware = async (
  app: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const url = request.raw.url;

  if (!url) {
    return;
  }

  const publicRoutes = ["/docs", "/health", "/auth/login", "/auth/register"];

  const isPublicRoute = publicRoutes.some((route) => url.startsWith(route));

  if (!isPublicRoute) {
    await app.authenticate(request, reply);
  }
};
