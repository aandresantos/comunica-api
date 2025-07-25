import { FastifyReply, FastifyRequest } from "fastify";
import { ZodError, ZodObject, ZodType } from "zod";
import { BaseResponse, StatusResponse } from "../types/base-response.types";

export const validateBody =
  (schema: ZodType) => async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      await schema.parseAsync(req.body);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        const errorMessages = error.issues.map(
          (issue) => `${issue.path.join(".")}: ${issue.message}`
        );

        return reply.code(400).send({
          success: false,
          status: StatusResponse.BAD_REQUEST,
          errors: errorMessages,
        } satisfies BaseResponse<void>);
      }

      return reply.code(500).send({
        success: false,
        status: StatusResponse.ERROR,
        errors: ["Erro interno no servidor."],
      } satisfies BaseResponse<void>);
    }
  };
