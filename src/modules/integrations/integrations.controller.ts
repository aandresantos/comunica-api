import { FastifyRequest } from "fastify";

import { IIntegrationsService } from "./integrations.interfaces";
import {
  responseError,
  responseNoContent,
  responseSuccess,
} from "@shared/helpers/response.helpers";
import { ControllerResponse } from "@shared/types/base-response.types";

export class IntegrationsController {
  constructor(private service: IIntegrationsService) {}

  async getData(): Promise<ControllerResponse<any>> {
    const data = await this.service.getExternalData(
      "https://jsonplaceholder.typicode.com/posts"
    );

    return responseSuccess(data);
  }
}
