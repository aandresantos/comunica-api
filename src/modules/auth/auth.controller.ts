import { FastifyReply, FastifyRequest } from "fastify";

import { responseSuccess } from "@shared/helpers/response.helpers";
import { ControllerResponse } from "@shared/types/base-response.types";
import { AuthResponse, IAuthService } from "./auth.interfaces";
import { RegisterInput } from "./dtos/register-input.dto";
import { LoginInput } from "./dtos/login-input.dto";

export class AuthController {
  constructor(private service: IAuthService) {}

  async register(
    req: FastifyRequest<{ Body: RegisterInput }>,
    reply: FastifyReply
  ): Promise<ControllerResponse<AuthResponse>> {
    const logger = req.log.child({
      component: "AuthController",
      operation: "register",
    });

    logger.info("Request received to register user.");

    const data = req.body;

    const authResponse = await this.service.register({
      data,
      context: { logger },
    });

    logger.info("Successfully registred user.");

    return responseSuccess(authResponse);
  }

  async login(
    req: FastifyRequest<{ Body: LoginInput }>,
    reply: FastifyReply
  ): Promise<ControllerResponse<AuthResponse>> {
    const logger = req.log.child({
      component: "AuthController",
      operation: "login",
    });

    const data = req.body;

    const authResponse = await this.service.login({
      data,
      context: { logger },
    });

    return responseSuccess(authResponse);
  }
}
