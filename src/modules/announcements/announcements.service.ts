import {
  IAnnouncementsRepository,
  IAnnouncementsService,
} from "./announcements.interfaces";

export class AnnouncementsService implements IAnnouncementsService {
  private announcementsRepository: IAnnouncementsRepository;

  constructor(repository: IAnnouncementsRepository) {
    this.announcementsRepository = repository;
  }

  async listAnnouncements() {
    return this.announcementsRepository.getAll();
  }
}
