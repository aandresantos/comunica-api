import { FastifyReply, FastifyRequest } from "fastify";

import { responseSuccess } from "@shared/helpers/response.helpers";
import { ControllerResponse } from "@shared/types/base-response.types";
import { IAuthService } from "./auth.interfaces";
import { RegisterInput } from "./dtos/register-input.dto";
import { LoginInput } from "./dtos/login-input.dto";

export class AuthController {
  constructor(private service: IAuthService) {}

  async register(
    req: FastifyRequest<{ Body: RegisterInput }>,
    reply: FastifyReply
  ): Promise<ControllerResponse<{ accessToken: string }>> {
    const logger = req.log.child({
      component: "AuthController",
      operation: "register",
    });

    logger.info("Request received to register user.");

    const data = req.body;

    const { accessToken } = await this.service.register({
      data,
      context: { logger },
    });

    logger.info("Successfully registred user.");

    reply.setCookie("access_token", accessToken, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      signed: true,
    });

    return responseSuccess({ accessToken });
  }

  async login(
    req: FastifyRequest<{ Body: LoginInput }>,
    reply: FastifyReply
  ): Promise<ControllerResponse<{ accessToken: string }>> {
    const logger = req.log.child({
      component: "AuthController",
      operation: "login",
    });

    const data = req.body;

    const { accessToken } = await this.service.login({
      data,
      context: { logger },
    });

    reply.setCookie("access_token", accessToken, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      signed: true,
    });

    return responseSuccess({ accessToken });
  }
}
