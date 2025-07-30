import { FastifyRequest, FastifyReply } from "fastify";
import { z, ZodError } from "zod";

export function validateIdParam() {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const schema = z.object({
      id: z.uuid({ error: "ID inválido. Deve ser um UUID válido." }),
    });

    const result = schema.safeParse(req.params);

    if (!result.success) {
      throw new ZodError(result.error.issues);
    }
  };
}
