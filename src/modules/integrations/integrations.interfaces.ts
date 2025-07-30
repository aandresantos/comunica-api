import { Logger } from "pino";
import { FastifyBaseLogger } from "fastify";

export interface IIntegrationsService {
  getExternalData(args: GetDataServiceArgs): Promise<any>;
}

export interface CallContext {
  logger: FastifyBaseLogger;
}

export interface ContextualArgs {
  context: CallContext;
}

export interface GetDataServiceArgs extends ContextualArgs {
  url: string;
}
