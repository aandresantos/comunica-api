import { Logger } from "pino";
import { Announcement, NewAnnouncement } from "./announcements.schema";
import { ListAnnouncementsQuery } from "./dtos/list-announcements-query.dto";
import { UpdateAnnouncement } from "./dtos/update-annoucement.dto";
import { AnnouncementRepositoryFilters } from "./types/client-announcements.types";
import { FastifyBaseLogger } from "fastify";

export interface IAnnouncementsRepository {
  getAll: (args: GetAllRepoArgs) => Promise<{
    total: number;
    data: Announcement[];
  }>;
  getById: (args: GetByIdRepoArgs) => Promise<Announcement | null>;
  create: (args: CreateRepoArgs) => Promise<Announcement>;
  update: (args: UpdateRepoArgs) => Promise<Announcement | null>;
  softDelete: (args: DeleteRepoArgs) => Promise<Boolean>;
}

export interface IAnnouncementsService {
  listAnnouncements: (args: ListServiceArgs) => Promise<{
    total: number;
    data: Announcement[];
  }>;
  getAnnouncementById: (
    args: GetByIdServiceArgs
  ) => Promise<Announcement | null>;
  createAnnouncement: (args: CreateServiceArgs) => Promise<Announcement>;
  updateAnnouncement: (args: UpdateServiceArgs) => Promise<Announcement | null>;
  deleteAnnouncement: (args: DeleteServiceArgs) => Promise<void>;
}

export interface CallContext {
  logger: FastifyBaseLogger;
}

export interface ContextualArgs {
  context: CallContext;
}

export interface ListServiceArgs extends ContextualArgs {
  query: ListAnnouncementsQuery;
}

export interface GetByIdServiceArgs extends ContextualArgs {
  id: string;
}

export interface CreateServiceArgs extends ContextualArgs {
  data: NewAnnouncement;
}

export interface UpdateServiceArgs extends ContextualArgs {
  id: string;
  data: UpdateAnnouncement;
}

export interface DeleteServiceArgs extends ContextualArgs {
  id: string;
}

export interface GetAllRepoArgs extends ContextualArgs {
  query: AnnouncementRepositoryFilters;
}

export interface GetByIdRepoArgs extends ContextualArgs {
  id: string;
}

export interface CreateRepoArgs extends ContextualArgs {
  data: NewAnnouncement;
}

export interface UpdateRepoArgs extends ContextualArgs {
  id: string;
  data: Partial<Announcement>;
}

export interface DeleteRepoArgs extends ContextualArgs {
  id: string;
}
