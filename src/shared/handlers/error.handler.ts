import { ZodError } from "zod";
import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "../errors";

import { responseError } from "../helpers/response.helpers";
import { BaseResponse } from "../types/base-response.types";

export function errorHandler(
  error: FastifyError,
  _: FastifyRequest,
  reply: FastifyReply
) {
  if (error instanceof AppError) {
    const { body, statusCode } = responseError(
      [error.message],
      error.statusCode
    );

    return reply.status(statusCode).send(body);
  }

  if (error instanceof ZodError) {
    const errors = error.issues.map((e) => `${e.path.join(".")}: ${e.message}`);

    const { body, statusCode } = responseError(errors, error.statusCode);

    return reply.status(statusCode).send(body);
  }

  if (error?.validation) {
    const { body, statusCode } = responseError(
      [error.message],
      error.statusCode
    );

    return reply.status(statusCode).send(body);
  }

  const { body, statusCode } = responseError(
    ["Erro inesperado no servidor"],
    500
  );

  return reply.status(statusCode).send(body);
}
