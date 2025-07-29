import { AppError } from "@src/shared/errors";
import { AnnouncementMapper } from "./annoucements.mapper";
import {
  CreateServiceArgs,
  DeleteServiceArgs,
  GetByIdRepoArgs,
  IAnnouncementsService,
  ListServiceArgs,
  UpdateServiceArgs,
} from "./announcements.interfaces";
import { IAnnouncementsRepository } from "./announcements.interfaces";
import { Announcement } from "./announcements.schema";

export class AnnouncementsService implements IAnnouncementsService {
  constructor(private repository: IAnnouncementsRepository) {}

  async listAnnouncements({ query, context }: ListServiceArgs) {
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

    return await this.repository.getAll({ query: filters, context });
  }

  async getAnnouncementById(
    args: GetByIdRepoArgs
  ): Promise<Announcement | null> {
    const annoucement = await this.repository.getById(args);

    if (!annoucement || annoucement.deletedAt) {
      throw new AppError("Chamado não encontrado", 404);
    }

    return annoucement;
  }

  async createAnnouncement(args: CreateServiceArgs): Promise<Announcement> {
    return await this.repository.create(args);
  }

  async updateAnnouncement(
    args: UpdateServiceArgs
  ): Promise<Announcement | null> {
    const existing = await this.repository.getById(args);

    if (!existing || existing.deletedAt) {
      throw new AppError("Chamado não encontrado", 404);
    }

    const { data, ...rest } = args;

    const mappedAnnouncement = AnnouncementMapper.toPartialDomain(data);

    return await this.repository.update({
      ...rest,
      data: mappedAnnouncement,
    });
  }

  async deleteAnnouncement(args: DeleteServiceArgs): Promise<void> {
    const annoucement = await this.repository.getById(args);
    if (!annoucement) {
      throw new AppError("Chamado não encontrado", 404);
    }

    if (annoucement.deletedAt) {
      throw new AppError("Chamado já deletado");
    }

    await this.repository.softDelete(args);
  }
}
