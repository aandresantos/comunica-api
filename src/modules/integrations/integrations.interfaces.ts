import { Logger } from "pino";
import { FastifyBaseLogger } from "fastify";

export interface IIntegrationsService {
  getExternalData<T>(args: GetDataServiceArgs): Promise<T>;
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

export interface JsonPlaceholderPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}
