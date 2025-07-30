import { AnnouncementsRepository } from "../../announcements.repository";
import { client as pgClient, database } from "@src/lib/configs/database.config";
import {
  announcementsTable,
  NewAnnouncement,
} from "../../announcements.schema";
import pino from "pino";
import { ContextualArgs } from "../../announcements.interfaces";
import { and, eq, isNull, sql } from "drizzle-orm";
import { randomUUID } from "crypto";

describe("AnnouncementsRepository - Integration Tests", () => {
  let repository: AnnouncementsRepository;
  let mockLogger: pino.Logger;
  let mockContext: ContextualArgs["context"];

  const testAnnouncements: NewAnnouncement[] = [
    {
      title: "Chamado 1",
      author: "ana",
      channelType: "email",
      status: "draft",
      content: "announcement 1",
    },
    {
      title: "Chamado 2",
      author: "ana",
      channelType: "slack",
      status: "sent",
      content: "announcement 2",
    },
    {
      title: "Chamado 3",
      author: "bruno",
      channelType: "email",
      status: "sent",
      content: "announcement 3",
    },
    {
      title: "Chamado 4",

      author: "bruno",
      channelType: "teams",
      status: "draft",
      content: "announcement 4",
    },
    {
      title: "Chamado 5",
      author: "carla",
      channelType: "email",
      status: "draft",
      content: "announcement 5",
      deletedAt: new Date(),
    },
  ];

  beforeAll(() => {
    mockLogger = pino({ enabled: false });
    mockContext = { logger: mockLogger };
    repository = new AnnouncementsRepository(database);
  });

  beforeEach(async () => {
    await database.execute(sql`DELETE FROM ${announcementsTable}`);
    await database.insert(announcementsTable).values(testAnnouncements);
  });

  afterAll(async () => {
    pgClient.end();
  });

  describe("getAll", () => {
    it("should return all non-deleted announcements when no filters are applied", async () => {
      const result = await repository.getAll({
        query: {},
        context: mockContext,
      });

      expect(result.total).toBe(4);
      expect(result.data.length).toBe(4);
    });

    it("should correctly filter by a single status", async () => {
      const result = await repository.getAll({
        query: { status: "draft" },
        context: mockContext,
      });

      expect(result.total).toBe(2);
      expect(result.data.every((item) => item.status === "draft")).toBe(true);
    });

    it("should correctly filter by a single author", async () => {
      const result = await repository.getAll({
        query: { autor: "ana" },
        context: mockContext,
      });

      expect(result.total).toBe(2);
      expect(result.data.every((item) => item.author === "ana")).toBe(true);
    });

    it("should correctly filter by a combination of status and author", async () => {
      const result = await repository.getAll({
        query: { autor: "bruno", status: "sent" },
        context: mockContext,
      });

      expect(result.total).toBe(1);
      expect(result.data[0].title).toBe("Chamado 3");
    });

    it("should correctly apply pagination with limit and offset", async () => {
      const result = await repository.getAll({
        query: { limit: 2, offset: 1 },
        context: mockContext,
      });

      expect(result.total).toBe(4);
      expect(result.data.length).toBe(2);
    });

    it("should return an empty result if no announcements match the filter", async () => {
      const result = await repository.getAll({
        query: { autor: "daniel" },
        context: mockContext,
      });

      expect(result.total).toBe(0);
      expect(result.data.length).toBe(0);
    });
  });

  describe("getById", () => {
    it("should return a single announcement when a valid and existing ID is provided", async () => {
      const [newAnnouncement] = await database
        .insert(announcementsTable)
        .values({
          title: "Novo chamado",
          author: "Diretoria",
          content: "content",
          channelType: "email",
          status: "draft",
        })
        .returning();

      const targetId = newAnnouncement.id;

      const result = await repository.getById({
        id: targetId,
        context: mockContext,
      });

      expect(result).not.toBeNull();

      expect(result?.id).toBe(targetId);
      expect(result?.title).toBe("Novo chamado");
    });

    it("should return null when the provided ID does not exist", async () => {
      const nonExistentId = randomUUID();

      const result = await repository.getById({
        id: nonExistentId,
        context: mockContext,
      });

      expect(result).toBeNull();
    });

    it("should return null for an announcement that has been soft-deleted", async () => {
      const [foundDeleted] = await database
        .select({ id: announcementsTable.id })
        .from(announcementsTable)
        .where(eq(announcementsTable.title, "Chamado 5"));

      const result = await repository.getById({
        id: foundDeleted.id,
        context: mockContext,
      });

      expect(result).toBeNull();
    });
  });

  describe("update", () => {
    it("should correctly update the specified fields of an existing announcement", async () => {
      const [originalAnnouncement] = await database
        .insert(announcementsTable)
        .values({
          title: "Novo chamado",
          content: "conteúdo original",
          author: "Diretoria",
          channelType: "email",
          status: "draft",
        })
        .returning();

      const newValues = {
        status: "sent" as const,
      };

      const updatedAnnouncement = await repository.update({
        id: originalAnnouncement.id,
        data: newValues,
        context: mockContext,
      });

      expect(updatedAnnouncement).not.toBeNull();
      expect(updatedAnnouncement?.id).toBe(originalAnnouncement.id);
      expect(updatedAnnouncement?.status).toBe("sent");

      const foundAfterUpdate = await database
        .select()
        .from(announcementsTable)
        .where(eq(announcementsTable.id, originalAnnouncement.id));

      expect(foundAfterUpdate[0].status).toBe("sent");
    });

    it("should return null when trying to update a non-existent announcement", async () => {
      const nonExistentId = randomUUID();
      const updateData = { title: "Nem existe" };

      const result = await repository.update({
        id: nonExistentId,
        data: updateData,
        context: mockContext,
      });

      expect(result).toBeNull();
    });

    it("should not update a soft-deleted announcement", async () => {
      const [announcement] = await database
        .insert(announcementsTable)
        .values({
          title: "Chamado que vai ser deletado",
          content: "vai ser apagado!",
          author: "Diretoria",
          channelType: "email",
          status: "draft",
        })
        .returning();

      await database
        .update(announcementsTable)
        .set({
          deletedAt: new Date(),
          title: "Chamado apagado",
          content: "apagado",
        })
        .where(eq(announcementsTable.id, announcement.id));

      const updateData = { title: "Mudei de ideia!" };

      const result = await repository.update({
        id: announcement.id,
        data: updateData,
        context: mockContext,
      });

      expect(result).toBeNull();
    });
  });

  describe("create", () => {
    it("should insert a new announcement into the database and return it", async () => {
      const author = "Diretoria";
      const title = "Extra extra vai ter bolo!";

      const newAnnouncementData: NewAnnouncement = {
        title: title,
        content: "e é de chocolate",
        author: author,
        channelType: "teams",
        status: "draft",
      };

      const createdAnnouncement = await repository.create({
        data: newAnnouncementData,
        context: mockContext,
      });

      expect(createdAnnouncement).toBeDefined();
      expect(createdAnnouncement.id).toBeDefined();
      expect(createdAnnouncement.title).toBe(title);
      expect(createdAnnouncement.deletedAt).toBeNull();

      const foundInDb = await database
        .select()
        .from(announcementsTable)
        .where(eq(announcementsTable.id, createdAnnouncement.id));

      expect(foundInDb).toHaveLength(1);
      expect(foundInDb[0].author).toBe(author);
    });
  });

  describe("softDelete", () => {
    it("should set the deletedAt field and return true for an existing, non-deleted announcement", async () => {
      const [announcementToDelele] = await database
        .select()
        .from(announcementsTable)
        .where(eq(announcementsTable.title, "Chamado 1"));

      const wasDeleted = await repository.softDelete({
        id: announcementToDelele.id,
        context: mockContext,
      });

      expect(wasDeleted).toBe(true);

      const foundAfterDelete = await database
        .select()
        .from(announcementsTable)
        .where(eq(announcementsTable.id, announcementToDelele.id));

      expect(foundAfterDelete[0].deletedAt).not.toBeNull();
      expect(foundAfterDelete[0].deletedAt).toBeInstanceOf(Date);
    });

    it("should return false when trying to delete a non-existent announcement", async () => {
      const nonExistentId = randomUUID();

      const wasDeleted = await repository.softDelete({
        id: nonExistentId,
        context: mockContext,
      });

      expect(wasDeleted).toBe(false);
    });

    it("should return false when trying to delete an already deleted announcement", async () => {
      const [deletedAnnouncement] = await database
        .select()
        .from(announcementsTable)
        .where(eq(announcementsTable.title, "Chamado 5"));

      const wasDeleted = await repository.softDelete({
        id: deletedAnnouncement.id,
        context: mockContext,
      });

      expect(wasDeleted).toBe(false);
    });
  });
});
