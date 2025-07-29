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

    logger.info(
      { query: req.query },
      "Request received to list announcements."
    );

    const listArgs: ListServiceArgs = {
      query: req.query,
      context: { logger: req.log },
    };

    const paginated = await this.service.listAnnouncements(listArgs);

    logger.info(
      { foundCount: paginated.total },
      "Successfully processed list request."
    );

    return responseSuccess({
      total: paginated.total,
      items: AnnouncementMapper.toViewModelList(paginated.data),
    });
  }

  async getById(
    req: FastifyRequest<{ Params: { id: string } }>
  ): Promise<ControllerResponse<AnnouncementViewModel | null>> {
    const logger = req.log.child({
      operation: "getById",
      component: "AnnouncementsController",
    });

    logger.info(
      { announcementId: req.params.id },
      "Request received to get announcement by ID."
    );

    const { id } = req.params;

    const getByIdArgs: GetByIdServiceArgs = {
      id,
      context: { logger: req.log },
    };

    const announcement = await this.service.getAnnouncementById(getByIdArgs);

    if (!announcement) {
      logger.warn({ announcementId: id }, "Announcement not found.");

      return responseError(["Chamado não encontrado"], 404);
    }

    logger.info({ announcementId: id }, "Successfully retrieved announcement.");

    return responseSuccess(AnnouncementMapper.toViewModel(announcement));
  }

  async create(
    req: FastifyRequest<{ Body: CreateAnnouncement }>
  ): Promise<ControllerResponse<AnnouncementViewModel>> {
    const logger = req.log.child({
      operation: "create",
      component: "AnnouncementsController",
    });

    const { body } = req;

    logger.info(
      { author: body.autor },
      "Request received to create announcement."
    );

    const createArgs: CreateServiceArgs = {
      data: AnnouncementMapper.toDomain(body),
      context: { logger: req.log },
    };

    const created = await this.service.createAnnouncement(createArgs);

    logger.info(
      { announcementId: created.id },
      "Successfully created announcement."
    );

    return responseCreated(AnnouncementMapper.toViewModel(created));
  }

  async update(
    req: FastifyRequest<{ Params: { id: string }; Body: UpdateAnnouncement }>
  ): Promise<ControllerResponse<AnnouncementViewModel | null>> {
    const logger = req.log.child({
      operation: "update",
      component: "AnnouncementsController",
    });

    logger.info(
      { announcementId: req.params.id },
      "Request received to update announcement."
    );

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

    logger.info(
      { announcementId: updated.id },
      "Successfully updated announcement."
    );

    return responseSuccess(AnnouncementMapper.toViewModel(updated));
  }

  async softDelete(
    req: FastifyRequest<{ Params: { id: string } }>
  ): Promise<ControllerResponse<null>> {
    const logger = req.log.child({
      operation: "softDelete",
      component: "AnnouncementsController",
    });

    logger.info(
      { announcementId: req.params.id },
      "Request received to soft delete announcement."
    );

    const deleteArgs: DeleteServiceArgs = {
      id: req.params.id,
      context: { logger: req.log },
    };

    await this.service.deleteAnnouncement(deleteArgs);

    logger.info(
      { announcementId: req.params.id },
      "Successfully processed soft delete request."
    );

    return responseNoContent();
  }
}
