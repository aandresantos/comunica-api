import { FastifyRequest } from "fastify";

import {
  IIntegrationsService,
  JsonPlaceholderPost,
} from "./integrations.interfaces";
import {
  responseError,
  responseNoContent,
  responseSuccess,
} from "@shared/helpers/response.helpers";
import { ControllerResponse } from "@shared/types/base-response.types";

export class IntegrationsController {
  constructor(private service: IIntegrationsService) {}

  async getData(req: FastifyRequest): Promise<ControllerResponse<any>> {
    const logger = req.log.child({
      component: "IntegrationsController",
      operation: "getExternalData",
    });

    logger.info("Request received to fetch external data.");

    const data = await this.service.getExternalData<JsonPlaceholderPost>({
      url: "https://jsonplaceholder.typicode.com/posts",
      context: { logger },
    });

    logger.info("Successfully fetched and returning external data.");

    return responseSuccess(data);
  }
}
