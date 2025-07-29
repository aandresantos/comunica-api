import { FastifyRequest } from "fastify";

import {
  CreateServiceArgs,
  DeleteServiceArgs,
  GetByIdServiceArgs,
  IAnnouncementsService,
  ListServiceArgs,
  UpdateServiceArgs,
} from "./announcements.interfaces";
import { CreateAnnouncement } from "./dtos/create-annoucement.dto";
import {
  AnnouncementMapper,
  AnnouncementViewModel,
} from "./annoucements.mapper";
import { ListAnnouncementsQuery } from "./dtos/list-announcements-query.dto";
import { UpdateAnnouncement } from "./dtos/update-annoucement.dto";
import {
  responseCreated,
  responseError,
  responseNoContent,
  responseSuccess,
} from "@shared/helpers/response.helpers";
import { ControllerResponse } from "@shared/types/base-response.types";

export class AnnouncementsController {
  constructor(private service: IAnnouncementsService) {}

  async getAll(
    req: FastifyRequest<{ Querystring: ListAnnouncementsQuery }>
  ): Promise<
    ControllerResponse<{ total: number; items: AnnouncementViewModel[] }>
  > {
    const logger = req.log.child({
      operation: "getAll",
      component: "AnnouncementsController",
    });

    const listArgs: ListServiceArgs = {
      query: req.query,
      context: { logger: req.log },
    };

    const paginated = await this.service.listAnnouncements(listArgs);

    return responseSuccess({
      total: paginated.total,
      items: AnnouncementMapper.toViewModelList(paginated.data),
    });
  }

  async getById(
    req: FastifyRequest
  ): Promise<ControllerResponse<AnnouncementViewModel | null>> {
    const logger = req.log.child({
      operation: "getById",
      component: "AnnouncementsController",
    });

    const { id } = req.params as { id: string };

    const getByIdArgs: GetByIdServiceArgs = {
      id,
      context: { logger: req.log },
    };

    const announcement = await this.service.getAnnouncementById(getByIdArgs);

    if (!announcement) {
      logger.warn({ announcementId: id }, "Announcement not found.");

      return responseError(["Chamado não encontrado"], 404);
    }

    return responseSuccess(AnnouncementMapper.toViewModel(announcement));
  }

  async create(
    req: FastifyRequest
  ): Promise<ControllerResponse<AnnouncementViewModel>> {
    const logger = req.log.child({
      operation: "create",
      component: "AnnouncementsController",
    });

    const body = req.body as CreateAnnouncement;

    const createArgs: CreateServiceArgs = {
      data: AnnouncementMapper.toDomain(body),
      context: { logger: req.log },
    };

    const created = await this.service.createAnnouncement(createArgs);

    return responseCreated(AnnouncementMapper.toViewModel(created));
  }

  async update(
    req: FastifyRequest<{ Params: { id: string }; Body: UpdateAnnouncement }>
  ): Promise<ControllerResponse<AnnouncementViewModel | null>> {
    const logger = req.log.child({
      operation: "update",
      component: "AnnouncementsController",
    });

    const updateArgs: UpdateServiceArgs = {
      id: req.params.id,
      data: req.body,
      context: { logger: req.log },
    };

    const updated = await this.service.updateAnnouncement(updateArgs);

    if (!updated) {
      logger.warn(
        { announcementId: req.params.id },
        "Announcement to update was not found."
      );

      return responseError(["Chamado não encontrado"], 404);
    }

    return responseSuccess(AnnouncementMapper.toViewModel(updated));
  }

  async softDelete(
    req: FastifyRequest<{ Params: { id: string } }>
  ): Promise<ControllerResponse<null>> {
    const logger = req.log.child({
      operation: "softDelete",
      component: "AnnouncementsController",
    });

    const deleteArgs: DeleteServiceArgs = {
      id: req.params.id,
      context: { logger: req.log },
    };

    const existing = await this.service.getAnnouncementById(deleteArgs);

    if (!existing) {
      logger.warn(
        { announcementId: req.params.id },
        "Announcement to delete was not found."
      );

      return responseError(["Chamado não encontrado"], 404);
    }

    await this.service.deleteAnnouncement(deleteArgs);

    return responseNoContent();
  }
}
