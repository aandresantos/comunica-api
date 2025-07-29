import { Announcement, NewAnnouncement } from "./announcements.schema";
import { ListAnnouncementsQuery } from "./dtos/list-announcements-query.dto";
import { UpdateAnnouncement } from "./dtos/update-annoucement.dto";
import { AnnouncementRepositoryFilters } from "./types/client-announcements.types";

export interface IAnnouncementsRepository {
  getAll: (
    query: AnnouncementRepositoryFilters
  ) => Promise<{ total: number; data: Announcement[] }>;
  getById: (id: string) => Promise<Announcement | null>;
  create: (data: NewAnnouncement) => Promise<Announcement>;
  update: (
    id: string,
    data: Partial<NewAnnouncement>
  ) => Promise<Announcement | null>;
  softDelete: (id: string) => Promise<void>;
}

export interface IAnnouncementsService {
  listAnnouncements: (
    query: ListAnnouncementsQuery
  ) => Promise<{ total: number; data: Announcement[] }>;
  getAnnouncementById: (id: string) => Promise<Announcement | null>;
  createAnnouncement: (data: NewAnnouncement) => Promise<Announcement>;
  updateAnnouncement: (
    id: string,
    data: UpdateAnnouncement
  ) => Promise<Announcement | null>;
  deleteAnnouncement: (id: string) => Promise<void>;
}
