import { AppError } from "@src/shared/errors";
import { AnnouncementMapper } from "./annoucements.mapper";
import { IAnnouncementsService } from "./announcements.interfaces";
import { IAnnouncementsRepository } from "./announcements.interfaces";
import { Announcement, NewAnnouncement } from "./announcements.schema";
import { ListAnnouncementsQuery } from "./dtos/list-announcements-query.dto";
import { UpdateAnnouncement } from "./dtos/update-annoucement.dto";

export class AnnouncementsService implements IAnnouncementsService {
  constructor(private repository: IAnnouncementsRepository) {}

  async listAnnouncements(query: ListAnnouncementsQuery) {
    const status = query.status
      ? AnnouncementMapper.mapStatusClientToDb(query.status)
      : undefined;

    const createdAt = query.data_inicial
      ? query.data_inicial.toISOString()
      : undefined;

    const deletedAt = query.data_final
      ? query.data_final.toISOString()
      : undefined;

    const filters = {
      ...query,
      status: status,
      data_inicial: createdAt,
      data_final: deletedAt,
    };

    return await this.repository.getAll(filters);
  }

  async getAnnouncementById(id: string): Promise<Announcement | null> {
    const annoucement = await this.repository.getById(id);

    if (!annoucement || annoucement.deletedAt) {
      throw new AppError("Chamado não encontrado", 404);
    }

    return annoucement;
  }

  async createAnnouncement(data: NewAnnouncement): Promise<Announcement> {
    return await this.repository.create(data);
  }

  async updateAnnouncement(
    id: string,
    data: UpdateAnnouncement
  ): Promise<Announcement | null> {
    const existing = await this.repository.getById(id);

    if (!existing || existing.deletedAt) {
      throw new AppError("Chamado não encontrado", 404);
    }

    const mappedAnnouncement = AnnouncementMapper.toPartialDomain(data);

    return await this.repository.update(id, mappedAnnouncement);
  }

  async deleteAnnouncement(id: string): Promise<void> {
    const annoucement = await this.repository.getById(id);
    if (!annoucement) {
      throw new AppError("Chamado não encontrado", 404);
    }

    if (annoucement.deletedAt) {
      throw new AppError("Chamado já deletado");
    }

    await this.repository.softDelete(id);
  }
}
