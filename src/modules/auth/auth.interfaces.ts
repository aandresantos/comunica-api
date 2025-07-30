import { FastifyBaseLogger } from "fastify";
import { RegisterInput } from "./dtos/register-input.dto";
import { LoginInput } from "./dtos/login-input.dto";
import { JwtPayload } from "jsonwebtoken";

export interface IAuthService {
  register(args: RegisterUserServiceArgs): Promise<AuthResponse>;
  login(args: LoginUserServiceArgs): Promise<AuthResponse>;
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

export interface AuthResponse {
  tokenType: "Bearer";
  accessToken: string;
  expiresIn: number;
}
