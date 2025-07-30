import { Logger } from "pino";
import { FastifyBaseLogger } from "fastify";

export interface IIntegrationsService {
  getExternalData(url: string): Promise<any>;
}

export interface CallContext {
  logger: FastifyBaseLogger;
}

export interface ContextualArgs {
  context: CallContext;
}
