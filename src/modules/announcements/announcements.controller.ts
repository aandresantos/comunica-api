import { FastifyRequest } from "fastify";

import { IAnnouncementsService } from "./announcements.interfaces";
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
    const paginated = await this.service.listAnnouncements(req.query);

    return responseSuccess({
      total: paginated.total,
      items: AnnouncementMapper.toViewModelList(paginated.data),
    });
  }

  async getById(
    req: FastifyRequest
  ): Promise<ControllerResponse<AnnouncementViewModel | null>> {
    const { id } = req.params as { id: string };

    const announcement = await this.service.getAnnouncementById(id);

    if (!announcement) {
      return responseError(["Chamado não encontrado"], 404);
    }

    return responseSuccess(AnnouncementMapper.toViewModel(announcement));
  }

  async create(
    req: FastifyRequest
  ): Promise<ControllerResponse<AnnouncementViewModel>> {
    const body = req.body as CreateAnnouncement;

    const created = await this.service.createAnnouncement(
      AnnouncementMapper.toDomain(body)
    );

    return responseCreated(AnnouncementMapper.toViewModel(created));
  }

  async update(
    req: FastifyRequest
  ): Promise<ControllerResponse<AnnouncementViewModel | null>> {
    const { id } = req.params as { id: string };
    const data = req.body as UpdateAnnouncement;

    const updated = await this.service.updateAnnouncement(id, data);
    if (!updated) {
      return responseError(["Chamado não encontrado"], 404);
    }

    return responseSuccess(AnnouncementMapper.toViewModel(updated));
  }

  async softDelete(req: FastifyRequest): Promise<ControllerResponse<null>> {
    const { id } = req.params as { id: string };

    const existing = await this.service.getAnnouncementById(id);
    if (!existing) {
      return responseError(["Chamado não encontrado"], 404);
    }

    await this.service.deleteAnnouncement(id);

    return responseNoContent();
  }
}
