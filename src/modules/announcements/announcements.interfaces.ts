export interface IAnnouncementsRepository {
  getAll: () => Promise<any>;
}

export interface IAnnouncementsService {
  listAnnouncements: () => Promise<any>;
}
