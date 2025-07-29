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
  constructor(private database: PostgresJsDatabase) {}

  async getAll(args: GetAllRepoArgs) {
    const { query, context } = args;

    const logger = context.logger.child({
      component: "AnnouncementsRepository",
      operation: "getAll",
    });

    const startTime = Date.now();

    try {
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

      const duration = Date.now() - startTime;

      logger.info(
        { duration, foundCount: total[0]?.count || 0 },
        "Successfully retrieved announcements from database."
      );

      if (duration > 500) {
        logger.warn(
          { duration, query },
          "Slow database query detected for getAll."
        );
      }

      return {
        total: Number(total[0]?.count || 0),
        data: rows,
      };
    } catch (err) {
      const duration = Date.now() - startTime;

      logger.error(
        { err, duration, query },
        "Failed to execute getAll query in database."
      );

      throw err;
    }
  }

  async getById(args: GetByIdRepoArgs): Promise<Announcement | null> {
    const { id, context } = args;
    const logger = context.logger.child({
      component: "AnnouncementsRepository",
      operation: "getById",
    });
    const startTime = Date.now();

    try {
      const found = await this.database
        .select()
        .from(announcementsTable)
        .where(eq(announcementsTable.id, id));

      const result = found?.[0] || null;

      const duration = Date.now() - startTime;

      logger.info(
        { duration, announcementId: id, found: !!result },
        "Successfully executed getById query."
      );

      return result;
    } catch (err) {
      const duration = Date.now() - startTime;

      logger.error(
        { err, duration, announcementId: id },
        "Failed to execute getById query."
      );

      throw err;
    }
  }

  async create(args: CreateRepoArgs): Promise<Announcement> {
    const { data, context } = args;

    const logger = context.logger.child({
      component: "AnnouncementsRepository",
      operation: "create",
    });

    const startTime = Date.now();

    try {
      const inserted = await this.database
        .insert(announcementsTable)
        .values(data)
        .returning();

      const duration = Date.now() - startTime;

      logger.info(
        { duration, announcementId: inserted[0].id },
        "Successfully created announcement in database."
      );

      return inserted[0];
    } catch (err) {
      const duration = Date.now() - startTime;

      logger.error(
        { err, duration, data: { ...data, content: "REDACTED" } },
        "Failed to execute create query."
      );

      throw err;
    }
  }

  async update(args: UpdateRepoArgs): Promise<Announcement | null> {
    const { id, data, context } = args;

    const logger = context.logger.child({
      component: "AnnouncementsRepository",
      operation: "update",
    });

    const startTime = Date.now();

    try {
      const updated = await this.database
        .update(announcementsTable)
        .set(data)
        .where(eq(announcementsTable.id, id))
        .returning();

      const result = updated[0] || null;

      const duration = Date.now() - startTime;

      logger.info(
        { duration, announcementId: id, updated: !!result },
        "Successfully executed update query."
      );

      return result;
    } catch (err) {
      const duration = Date.now() - startTime;

      logger.error(
        { err, duration, announcementId: id },
        "Failed to execute update query."
      );

      throw err;
    }
  }

  async softDelete(args: DeleteRepoArgs): Promise<boolean> {
    const { id, context } = args;

    const logger = context.logger.child({
      operation: "softDelete",
      component: "AnnouncementsRepository",
    });

    const startTime = Date.now();

    try {
      const result = await this.database
        .update(announcementsTable)
        .set({ deletedAt: new Date() })
        .where(
          and(
            ...[
              eq(announcementsTable.id, id),
              isNull(announcementsTable.deletedAt),
            ]
          )
        )
        .returning({ id: announcementsTable.id });

      const duration = Date.now() - startTime;

      const wasDeleted = result.length > 0;

      logger.info(
        { duration, announcementId: id, wasDeleted },
        "Successfully executed soft delete query."
      );

      return wasDeleted;
    } catch (err) {
      const duration = Date.now() - startTime;

      logger.error(
        { err, duration, announcementId: id },
        "Failed to execute soft delete query."
      );

      throw err;
    }
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
