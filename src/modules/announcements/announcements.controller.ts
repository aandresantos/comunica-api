import { FastifyReply, FastifyRequest } from "fastify";
import { IAnnouncementsService } from "./announcements.interfaces";
import { CreateAnnouncement } from "./dtos/create-annoucement.dto";
import { AnnouncementMapper } from "./annoucements.mapper";
import { ListAnnouncementsQuery } from "./dtos/list-announcements-query.dto";

export class AnnouncementsController {
  constructor(private service: IAnnouncementsService) {}

  async getAll(
    req: FastifyRequest,
    reply: FastifyReply,
    query: ListAnnouncementsQuery
  ) {
    try {
      const paginatedAnnouncements = await this.service.listAnnouncements(
        query
      );

      const resultAsViewModel = AnnouncementMapper.toViewModelList(
        paginatedAnnouncements.data
      );

      return reply.send({
        data: resultAsViewModel,
        total: paginatedAnnouncements.total,
      });
    } catch (err) {
      console.log(err);
    }
  }

  async getById(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };

    const announcement = await this.service.getAnnouncementById(id);
    if (!announcement) {
      return reply.status(404).send({ message: "Anúncio não encontrado" });
    }

    return reply.send(AnnouncementMapper.toViewModel(announcement));
  }

  async create(req: FastifyRequest, reply: FastifyReply) {
    const body = req.body as CreateAnnouncement;

    const created = await this.service.createAnnouncement(
      AnnouncementMapper.toDomain(body)
    );

    return reply.status(201).send(AnnouncementMapper.toViewModel(created));
  }

  async update(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const data = req.body as any;

    const updated = await this.service.updateAnnouncement(id, data);
    if (!updated) {
      return reply.status(404).send({ message: "Anúncio não encontrado" });
    }

    return reply.send(AnnouncementMapper.toViewModel(updated));
  }

  async softDelete(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };

    await this.service.deleteAnnouncement(id);
    return reply.status(204).send();
  }
}
