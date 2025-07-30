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
    const logger = context.logger.child({
      component: "AnnouncementsService",
      operation: "listAnnouncements",
    });

    try {
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
    } catch (err) {
      logger.error(
        { err, query },
        "An error occurred while listing announcements."
      );

      throw err;
    }
  }

  async getAnnouncementById(
    args: GetByIdRepoArgs
  ): Promise<Announcement | null> {
    const { id, context } = args;
    const logger = context.logger.child({
      component: "AnnouncementsService",
      operation: "getAnnouncementById",
    });

    try {
      const announcement = await this.repository.getById(args);

      if (!announcement || announcement.deletedAt) {
        logger.warn(
          { announcementId: id, found: false },
          "Announcement not found or already deleted."
        );

        throw new AppError("Chamado não encontrado", 404);
      }

      return announcement;
    } catch (err) {
      if (!(err instanceof AppError)) {
        logger.error(
          { err, announcementId: id },
          "An unexpected error occurred while getting announcement."
        );
      }

      throw err;
    }
  }

  async createAnnouncement(args: CreateServiceArgs): Promise<Announcement> {
    const { data, context } = args;
    const logger = context.logger.child({
      component: "AnnouncementsService",
      operation: "createAnnouncement",
    });

    try {
      return await this.repository.create({ data, context });
    } catch (err) {
      logger.error(
        { err },
        "An error occurred while creating an announcement."
      );

      throw err;
    }
  }

  async updateAnnouncement(
    args: UpdateServiceArgs
  ): Promise<Announcement | null> {
    const logger = args.context.logger.child({
      component: "AnnouncementsService",
      operation: "updateAnnouncement",
    });

    try {
      const existing = await this.repository.getById({
        id: args.id,
        context: args.context,
      });

      if (!existing || existing.deletedAt) {
        logger.warn(
          { announcementId: args.id },
          "Attempted to update an announcement that was not found."
        );

        throw new AppError("Chamado não encontrado", 404);
      }

      const { data, ...rest } = args;

      const mappedAnnouncement = AnnouncementMapper.toPartialDomain(data);

      return await this.repository.update({
        ...rest,
        data: mappedAnnouncement,
      });
    } catch (err) {
      if (!(err instanceof AppError)) {
        logger.error(
          { err, announcementId: args.id },
          "An unexpected error occurred while updating announcement."
        );
      }

      throw err;
    }
  }

  async deleteAnnouncement(args: DeleteServiceArgs): Promise<void> {
    const { id, context } = args;
    const logger = context.logger.child({
      component: "AnnouncementsService",
      operation: "deleteAnnouncement",
    });

    try {
      const annoucement = await this.repository.getById({ id, context });

      if (!annoucement || annoucement.deletedAt) {
        throw new AppError("Chamado não encontrado", 404);
      }

      const wasDeleted = await this.repository.softDelete({ id, context });

      if (!wasDeleted) {
        throw new AppError("Não foi possível deletar o Chamado");
      }

      return;
    } catch (err) {
      if (!(err instanceof AppError)) {
        logger.error(
          { err, announcementId: id },
          "An unexpected error occurred while deleting announcement."
        );
      }

      throw err;
    }
  }
}
