import { z } from "zod";

export const registerDto = z.object({
  email: z
    .email({ error: "O e-mail deve conter @ e extensão" })
    .nonempty({ error: "Email é obrigatório" }),
  password: z
    .string({ error: "Password deve ser uma string" })
    .min(5, { error: "Password deve ter no mínimo 6 caracteres" })
    .nonempty({ error: "Password não pode ser vazio" }),
});

export type RegisterInput = z.infer<typeof registerDto>;
