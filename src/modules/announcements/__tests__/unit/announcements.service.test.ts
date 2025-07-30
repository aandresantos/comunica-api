import { FastifyBaseLogger } from "fastify";
import {
  ContextualArgs,
  IAnnouncementsRepository,
  IAnnouncementsService,
} from "../../announcements.interfaces";
import pino from "pino";
import { AnnouncementsService } from "../../announcements.service";
import { Announcement } from "../../announcements.schema";
import { AppError } from "@src/shared/errors";

describe("AnnouncementsService - Unit Tests", () => {
  let service: IAnnouncementsService;
  let mockRepository: jest.Mocked<IAnnouncementsRepository>;
  let mockLogger: FastifyBaseLogger;
  let mockContext: ContextualArgs["context"];

  beforeEach(() => {
    mockLogger = pino({ enabled: false });
    mockContext = { logger: mockLogger };

    mockRepository = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
    };

    service = new AnnouncementsService(mockRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAnnouncementById", () => {
    it("should return an announcement when a valid ID is provided", async () => {
      const fakeAnnouncement: Announcement = {
        id: "valid-uuid",
        title: "Chamado para os colaboradores",
        content: "Todo dia é feriado",
        channelType: "slack",
        status: "draft",
        author: "diretoria",
        createdAt: new Date("2025-07-28T22:09:36.198Z"),
        sentAt: null,
        deletedAt: null,
      };

      mockRepository.getById.mockResolvedValue(fakeAnnouncement);

      const result = await service.getAnnouncementById({
        id: "valid-uuid",
        context: mockContext,
      });

      expect(result).toEqual(fakeAnnouncement);
      expect(mockRepository.getById).toHaveBeenCalledWith({
        id: "valid-uuid",
        context: mockContext,
      });
      expect(mockRepository.getById).toHaveBeenCalledTimes(1);
    });

    it("should throw an AppError when the announcement is not found", async () => {
      mockRepository.getById.mockResolvedValue(null);

      await expect(
        service.getAnnouncementById({
          id: "invalid-uuid",
          context: mockContext,
        })
      ).rejects.toThrow(new AppError("Chamado não encontrado", 404));
    });

    it("should throw an AppError when the announcement is soft-deleted", async () => {
      const fakeDeletedAnnouncement: Announcement = {
        id: "valid-uuid",
        title: "Chamado para os colaboradores",
        content: "Todo dia é feriado",
        channelType: "slack",
        status: "draft",
        author: "diretoria",
        deletedAt: new Date(),
        createdAt: new Date("2025-07-28T22:09:36.198Z"),
        sentAt: null,
      };

      mockRepository.getById.mockResolvedValue(fakeDeletedAnnouncement);

      await expect(
        service.getAnnouncementById({ id: "valid-uuid", context: mockContext })
      ).rejects.toThrow(AppError);
    });

    it("should re-throw the error if repository fail unexpectedly", async () => {
      const databaseError = new Error("Falha de conexão com o banco de dados");

      mockRepository.getById.mockRejectedValue(databaseError);

      await expect(
        service.getAnnouncementById({ id: "any-uuid", context: mockContext })
      ).rejects.toThrow(databaseError);

      expect(mockRepository.getById).toHaveBeenCalledTimes(1);
    });
  });
});
