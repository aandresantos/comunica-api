import { Announcement, NewAnnouncement } from "./announcements.schema";

export interface IAnnouncementsRepository {
  getAll: () => Promise<Announcement[]>;
  getById: (id: string) => Promise<Announcement | null>;
  create: (data: NewAnnouncement) => Promise<Announcement>;
  update: (
    id: string,
    data: Partial<NewAnnouncement>
  ) => Promise<Announcement | null>;
  softDelete: (id: string) => Promise<void>;
}

export interface IAnnouncementsService {
  listAnnouncements: () => Promise<Announcement[]>;
}
