import { IAnnouncementsService } from "./announcements.interfaces";
import { IAnnouncementsRepository } from "./announcements.interfaces";
import { Announcement, NewAnnouncement } from "./announcements.schema";

export class AnnouncementsService implements IAnnouncementsService {
  constructor(private repository: IAnnouncementsRepository) {}

  async listAnnouncements(): Promise<Announcement[]> {
    return this.repository.getAll();
  }

  async getAnnouncementById(id: string): Promise<Announcement | null> {
    return this.repository.getById(id);
  }

  async createAnnouncement(data: NewAnnouncement): Promise<Announcement> {
    return this.repository.create(data);
  }

  async updateAnnouncement(
    id: string,
    data: Partial<NewAnnouncement>
  ): Promise<Announcement | null> {
    const existing = await this.repository.getById(id);
    if (!existing) {
      return null;
    }

    return this.repository.update(id, data);
  }

  async deleteAnnouncement(id: string): Promise<void> {
    const existing = await this.repository.getById(id);
    if (!existing) {
      throw new Error("Chamado não encontrado");
    }

    await this.repository.softDelete(id);
  }
}
