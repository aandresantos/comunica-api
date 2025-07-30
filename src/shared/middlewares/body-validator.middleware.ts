import { FastifyReply, FastifyRequest } from "fastify";
import { ZodError, ZodType } from "zod";
import { AppError } from "../errors";

export const validateBody =
  (schema: ZodType) => async (req: FastifyRequest, _: FastifyReply) => {
    try {
      await schema.parseAsync(req.body);
    } catch (error) {
      if (error instanceof ZodError) {
        throw error;
      }

      throw new AppError("Há campos inválidos no body", 500);
    }
  };
