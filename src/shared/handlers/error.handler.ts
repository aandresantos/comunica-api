import { ZodError } from "zod";
import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "../errors";
import { BaseResponse, StatusResponse } from "../types/base-response.types";

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      success: false,
      errors: [error.message],
      status: StatusResponse.ERROR,
    } satisfies BaseResponse<void>);
  }

  if (error instanceof ZodError) {
    return reply.status(400).send({
      success: false,
      errors: (error as any).errors.map(
        (e: ZodError["issues"][0]) => `${e.path.join(".")}: ${e.message}`
      ),
      status: StatusResponse.ERROR,
    } satisfies BaseResponse<void>);
  }

  if (error.validation) {
    return reply.status(400).send({
      success: false,
      errors: [error.message],
      status: StatusResponse.ERROR,
    } satisfies BaseResponse<void>);
  }

  return reply.status(500).send({
    success: false,
    errors: ["Erro inesperado no servidor"],
    status: StatusResponse.ERROR,
  } satisfies BaseResponse<void>);
}
