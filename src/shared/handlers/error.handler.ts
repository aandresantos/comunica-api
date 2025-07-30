import { ZodError } from "zod";
import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { AppError, ForbiddenError, UnauthorizedError } from "../errors";

import { responseError } from "../helpers/response.helpers";
import { BaseResponse } from "../types/base-response.types";
import { FastifySchemaValidationError } from "fastify/types/schema";
import { hasZodFastifySchemaValidationErrors } from "fastify-type-provider-zod";

export function errorHandler(
  error: FastifyError,
  req: FastifyRequest,
  reply: FastifyReply
) {
  if (error instanceof UnauthorizedError || error instanceof ForbiddenError) {
    const { body, statusCode } = responseError(
      [error.message],
      error.statusCode
    );

    return reply.status(statusCode).send(body);
  }

  if (error instanceof ZodError) {
    const errors = error.issues.map(
      (e) => `${e.path.join(".") || "request"}: ${e.message}`
    );
    const { body, statusCode } = responseError(errors, 400);
    return reply.status(statusCode).send(body);
  }

  if (hasZodFastifySchemaValidationErrors(error)) {
    const zodErrors = error.validation.map(
      (e) => `${e.instancePath || "request"}: ${e.message}`
    );

    const { body, statusCode } = responseError(zodErrors, 400);
    return reply.status(statusCode).send(body);
  }

  if (error.validation) {
    const errors = error.validation.map((err) => {
      const path =
        err.instancePath.substring(1).replace(/\//g, ".") || "request";
      return `${path}: ${err.message}`;
    });
    const { body, statusCode } = responseError(errors, 400);
    return reply.status(statusCode).send(body);
  }

  if (error instanceof AppError) {
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
