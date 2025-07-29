import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import {
  CreateRepoArgs,
  DeleteRepoArgs,
  GetAllRepoArgs,
  GetByIdRepoArgs,
  IAnnouncementsRepository,
  UpdateRepoArgs,
} from "./announcements.interfaces";
import {
  Announcement,
  announcementsTable,
  NewAnnouncement,
} from "./announcements.schema";
import { and, count, eq, gte, isNull, lte } from "drizzle-orm";
import { AnnouncementRepositoryFilters } from "./types/client-announcements.types";

export class AnnouncementsRepository implements IAnnouncementsRepository {
  // TODO: adicionar tx e throw

  constructor(private database: PostgresJsDatabase) {}

  async getAll({ query }: GetAllRepoArgs) {
    const { limit, offset } = query;

    const conditions = this.buildConditions(query);

    const [rows, total] = await Promise.all([
      this.database
        .select()
        .from(announcementsTable)
        .where(and(...conditions))
        .limit(Number(limit))
        .offset(Number(offset)),

      this.database
        .select({ count: count() })
        .from(announcementsTable)
        .where(and(...conditions)),
    ]);

    return {
      total: Number(total[0]?.count || 0),
      data: rows,
    };
  }

  async getById({ id }: GetByIdRepoArgs) {
    const found = await this.database
      .select()
      .from(announcementsTable)
      .where(eq(announcementsTable.id, id));

    return found[0] || null;
  }

  async create({ data }: CreateRepoArgs) {
    const inserted = await this.database
      .insert(announcementsTable)
      .values(data)
      .returning();
    return inserted[0];
  }

  async update({ id, data }: UpdateRepoArgs) {
    const updated = await this.database
      .update(announcementsTable)
      .set(data)
      .where(eq(announcementsTable.id, id))
      .returning();
    return updated[0] || null;
  }

  async softDelete({ id }: DeleteRepoArgs) {
    await this.database
      .update(announcementsTable)
      .set({ deletedAt: new Date() })
      .where(
        and(
          ...[
            eq(announcementsTable.id, id),
            isNull(announcementsTable.deletedAt),
          ]
        )
      );
  }

  private buildConditions(filters: AnnouncementRepositoryFilters) {
    const { status, tipo_canal, autor, data_inicial, data_final } = filters;

    const conditions = [isNull(announcementsTable.deletedAt)];

    if (status) conditions.push(eq(announcementsTable.status, status));

    if (tipo_canal)
      conditions.push(eq(announcementsTable.channelType, tipo_canal));

    if (autor) conditions.push(eq(announcementsTable.author, autor));

    if (data_inicial)
      conditions.push(
        gte(announcementsTable.createdAt, new Date(data_inicial))
      );

    if (data_final)
      conditions.push(lte(announcementsTable.createdAt, new Date(data_final)));

    return conditions;
  }
}
