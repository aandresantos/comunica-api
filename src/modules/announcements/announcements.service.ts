import { AnnouncementMapper } from "./annoucements.mapper";
import { IAnnouncementsService } from "./announcements.interfaces";
import { IAnnouncementsRepository } from "./announcements.interfaces";
import { Announcement, NewAnnouncement } from "./announcements.schema";
import { ListAnnouncementsQuery } from "./dtos/list-announcements-query.dto";
import { AnnouncementRepositoryFilters } from "./types/client-announcements.types";

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
    return await this.repository.getById(id);
  }

  async createAnnouncement(data: NewAnnouncement): Promise<Announcement> {
    return await this.repository.create(data);
  }

  async updateAnnouncement(
    id: string,
    data: Partial<NewAnnouncement>
  ): Promise<Announcement | null> {
    const existing = await this.repository.getById(id);
    if (!existing) {
      return null;
    }

    return await this.repository.update(id, data);
  }

  async deleteAnnouncement(id: string): Promise<void> {
    const existing = await this.repository.getById(id);
    if (!existing) {
      throw new Error("Chamado não encontrado");
    }

    await this.repository.softDelete(id);
  }
}
