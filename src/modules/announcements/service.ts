import { IAnnouncementsRepository } from "./repository";
import { Channel, StatusAnnouncement } from "./types/announcements.types";

export interface IAnnouncementsService {
  listAnnouncements: () => Promise<any>;
}

export class AnnouncementsService implements IAnnouncementsService {
  private announcementsRepository: IAnnouncementsRepository;

  constructor(repository: IAnnouncementsRepository) {
    this.announcementsRepository = repository;
  }

  async listAnnouncements() {
    return this.announcementsRepository.getAll();
  }
}
