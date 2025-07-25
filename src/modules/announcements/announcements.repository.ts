import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { IAnnouncementsRepository } from "./announcements.interfaces";
import { Channel, StatusAnnouncement } from "./announcements.types";
import {
  Announcement,
  announcementsTable,
  NewAnnouncement,
} from "./announcements.schema";
import { eq, isNull } from "drizzle-orm";

export class AnnouncementsRepository implements IAnnouncementsRepository {
  // TODO: adicionar tx e throw

  constructor(private database: PostgresJsDatabase) {}

  async getAll() {
    const rows = await this.database
      .select()
      .from(announcementsTable)
      .where(isNull(announcementsTable.deletedAt));

    if (!rows.length) {
      return [];
    }

    return rows;
  }

  async getById(id: string) {
    const found = await this.database
      .select()
      .from(announcementsTable)
      .where(eq(announcementsTable.id, id));

    return found[0] || null;
  }

  async create(data: NewAnnouncement) {
    const inserted = await this.database
      .insert(announcementsTable)
      .values(data)
      .returning();
    return inserted[0];
  }

  async update(id: string, data: Partial<Announcement>) {
    const updated = await this.database
      .update(announcementsTable)
      .set(data)
      .where(eq(announcementsTable.id, id))
      .returning();
    return updated[0] || null;
  }

  async softDelete(id: string) {
    await this.database
      .update(announcementsTable)
      .set({ deletedAt: new Date() })
      .where(eq(announcementsTable.id, id));
  }
}
