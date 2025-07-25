export class AppError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Não foi encontrado.") {
    super(message, 404);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = "Requisição inválida.") {
    super(message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Não autorizado.") {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Acesso negado.") {
    super(message, 403);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Conflito de dados.") {
    super(message, 409);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = "Erro interno do servidor.") {
    super(message, 500);
  }
}
