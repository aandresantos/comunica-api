import { authConfig } from "@src/lib/configs/auth.config";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { FastifyInstance } from "fastify";

export function buildAuthModule(fastify: FastifyInstance) {
  const service = new AuthService(fastify, authConfig.jwt);
  const controller = new AuthController(service);

  return controller;
}
