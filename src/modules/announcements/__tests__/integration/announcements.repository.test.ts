import { AnnouncementsRepository } from "../../announcements.repository";
import { client as pgClient, database } from "@src/lib/configs/database.config";
import {
  announcementsTable,
  NewAnnouncement,
} from "../../announcements.schema";
import pino from "pino";
import { ContextualArgs } from "../../announcements.interfaces";
import { sql } from "drizzle-orm";

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
      content: "announcement",
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
});
