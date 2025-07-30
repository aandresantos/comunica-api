import bcrypt from "bcrypt";
import { randomUUID, UUID } from "crypto";

import { AppError } from "@shared/errors";
import { authConfig } from "@configs/auth.config";
import {
  IAuthService,
  LoginUserServiceArgs,
  RegisterUserServiceArgs,
} from "./auth.interfaces";
import { FastifyInstance } from "fastify";

type User = {
  id: string;
  email: string;
  password: string;
};

const users: User[] = [
  {
    id: "senha-fake-123-pro-teste",
    email: "admin@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
];

export class AuthService implements IAuthService {
  constructor(
    private fastify: FastifyInstance,
    private configs: (typeof authConfig)["jwt"]
  ) {}

  async register(
    args: RegisterUserServiceArgs
  ): Promise<{ accessToken: string }> {
    try {
      const { email, password } = args.data;

      if (this.userExists(email)) {
        throw new AppError("E-mail já cadastrado", 400);
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const newUser: User = {
        id: this.genUserId(),
        email,
        password: passwordHash,
      };

      users.push(newUser);

      const accessToken = this.fastify.jwt.sign(
        { sub: newUser.id, email },
        { expiresIn: this.configs.expiresIn }
      );

      return { accessToken };
    } catch (err) {
      if (err instanceof AppError) {
        throw err;
      }

      throw new Error(err as any);
    }
  }

  async login(args: LoginUserServiceArgs) {
    const { email, password } = args.data;

    const user = this.findUser(email);

    if (!user) {
      throw new AppError("Usuário não encontrado", 400);
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new AppError("Credenciais inválidas", 401);
    }

    const accessToken = this.fastify.jwt.sign(
      { sub: user.id, email },
      { expiresIn: this.configs.expiresIn }
    );

    return { accessToken };
  }

  userExists(email: string): boolean {
    const userExists = users.find((u) => u.email === email);

    return !!userExists;
  }

  findUser(email: string): User | null {
    return users.find((u) => u.email === email) || null;
  }

  genUserId(): UUID {
    return randomUUID();
  }
}
