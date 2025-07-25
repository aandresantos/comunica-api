import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
  varchar,
} from "drizzle-orm/pg-core";

export const channelTypeEnum = pgEnum("channel_type", [
  "email",
  "slack",
  "teams",
]);
export const statusEnum = pgEnum("status", ["draft", "sent"]);

export const announcementsTable = pgTable("announcements", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  content: text("content").notNull(),

  channelType: channelTypeEnum("channel_type").notNull(),
  status: statusEnum("status").notNull().default("draft"),

  author: varchar("author", { length: 120 }).notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

export type Announcement = typeof announcementsTable.$inferSelect;
export type NewAnnouncement = typeof announcementsTable.$inferInsert;
