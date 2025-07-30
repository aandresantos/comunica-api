import { FastifyBaseLogger } from "fastify";
import { RegisterInput } from "./dtos/register-input.dto";
import { LoginInput } from "./dtos/login-input.dto";
import { JwtPayload } from "jsonwebtoken";

export interface IAuthService {
  register(args: RegisterUserServiceArgs): Promise<{ accessToken: string }>;
  login(args: LoginUserServiceArgs): Promise<{ accessToken: string }>;
}

export interface CallContext {
  logger: FastifyBaseLogger;
}

export interface ContextualArgs {
  context: CallContext;
}

export interface RegisterUserServiceArgs extends ContextualArgs {
  data: RegisterInput;
}

export interface LoginUserServiceArgs extends ContextualArgs {
  data: LoginInput;
}
