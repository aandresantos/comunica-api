import { FastifyBaseLogger } from "fastify";
import pino from "pino";
import {
  ContextualArgs,
  IAnnouncementsRepository,
  IAnnouncementsService,
} from "../../announcements.interfaces";
import { AnnouncementsService } from "../../announcements.service";
import { Announcement, NewAnnouncement } from "../../announcements.schema";
import { AppError } from "@src/shared/errors";
import { ListAnnouncementsQuery } from "../../dtos/list-announcements-query.dto";
import { UpdateAnnouncement } from "../../dtos/update-annoucement.dto";
import { StatusAnnouncementType } from "../../types/announcements.types";

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

  describe("listAnnouncements", () => {
    it("should correctly map all filters and call the repository", async () => {
      const queryFromController: ListAnnouncementsQuery = {
        status: "enviado",
        autor: "diretoria",
        tipo_canal: "slack",
        data_inicial: new Date("2024-08-01T00:00:00.000Z"),
        data_final: new Date("2024-08-31T23:59:59.000Z"),
      };

      const expectedRepoFilters = {
        autor: "diretoria",
        tipo_canal: "slack",
        status: "sent",
        data_inicial: "2024-08-01T00:00:00.000Z",
        data_final: "2024-08-31T23:59:59.000Z",
      };

      const fakeResult: { total: number; data: Announcement[] } = {
        total: 1,
        data: [
          {
            id: "valid-uuid",
            title: "Chamado para os colaboradores",
            content: "Todo dia é feriado",
            channelType: "slack",
            status: "draft",
            author: "diretoria",
            createdAt: new Date("2025-07-28T22:09:36.198Z"),
            sentAt: null,
            deletedAt: null,
          },
        ],
      };

      mockRepository.getAll.mockResolvedValue(fakeResult);

      const result = await service.listAnnouncements({
        query: queryFromController,
        context: mockContext,
      });

      expect(result).toEqual(fakeResult);
      expect(mockRepository.getAll).toHaveBeenCalledTimes(1);
      expect(mockRepository.getAll).toHaveBeenCalledWith(
        expect.objectContaining({
          query: expect.objectContaining(expectedRepoFilters),
          context: mockContext,
        })
      );
    });

    it("should call the repository with default pagination values when the query is empty", async () => {
      const emptyQuery = {};
      const fakeResult: { total: number; data: Announcement[] } = {
        total: 10,
        data: Array.from({ length: 10 }).map((_, i) => ({
          id: "valid-uuid-" + i,
          title: "Chamado " + i,
          content: "Conteudo " + i,
          channelType: "slack",
          status: "draft",
          author: "author." + i,
          createdAt: new Date("2025-07-28T22:09:36.198Z"),
          sentAt: null,
          deletedAt: null,
        })),
      };

      mockRepository.getAll.mockResolvedValue(fakeResult);

      await service.listAnnouncements({
        query: emptyQuery,
        context: mockContext,
      });

      expect(mockRepository.getAll).toHaveBeenCalledTimes(1);
      expect(mockRepository.getAll).toHaveBeenCalledWith(
        expect.objectContaining({ context: mockContext })
      );
    });

    it("should return an empty result when the repository finds nothing", async () => {
      const emptyQuery = {};
      const emptyResult = { total: 0, data: [] };
      mockRepository.getAll.mockResolvedValue(emptyResult);

      const result = await service.listAnnouncements({
        query: emptyQuery,
        context: mockContext,
      });

      expect(result).toEqual(emptyResult);
    });

    it("should re-throw an error if the repository fails unexpectedly", async () => {
      const databaseError = new Error("Erro de conexão");
      mockRepository.getAll.mockRejectedValue(databaseError);

      await expect(
        service.listAnnouncements({ query: {}, context: mockContext })
      ).rejects.toThrow(databaseError);
    });
  });

  describe("createAnnouncement", () => {
    it("should call the repository with the correct data and return the created announcement", async () => {
      const inputAnnouncement: NewAnnouncement = {
        title: "Novo Chamado",
        content: "Segunda feira tem bolo de graça",
        author: "diretoria",
        channelType: "email",
      };

      const expectedCreatedAnnouncement: Announcement = {
        ...inputAnnouncement,
        id: "new-valid-uuid",
        status: "draft",
        createdAt: new Date(),
        deletedAt: null,
        sentAt: null,
      };

      mockRepository.create.mockResolvedValue(expectedCreatedAnnouncement);

      const result = await service.createAnnouncement({
        data: inputAnnouncement,
        context: mockContext,
      });

      expect(result).toEqual(expectedCreatedAnnouncement);
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
      expect(mockRepository.create).toHaveBeenCalledWith({
        data: inputAnnouncement,
        context: mockContext,
      });
    });

    it("should re-throw an error if the repository fails to create the announcement", async () => {
      const inputAnnouncement: NewAnnouncement = {
        title: "Novo Chamado",
        content: "Férias todo mês",
        author: "diretoria",
        channelType: "email",
      };

      const databaseError = new Error(
        "Chaves duplicads violam a constraint única"
      );

      mockRepository.create.mockRejectedValue(databaseError);

      await expect(
        service.createAnnouncement({
          data: inputAnnouncement,
          context: mockContext,
        })
      ).rejects.toThrow(databaseError);
    });
  });

  describe("updateAnnouncement", () => {
    it("should successfully update an existing announcement", async () => {
      const existingAnnouncement: Announcement = {
        id: "original-uuid",
        author: "diretoria",
        title: "Título original",
        content: "Conteúdo original",
        channelType: "teams",
        status: "draft",
        createdAt: new Date("2025-07-28T22:09:36.198Z"),
        sentAt: null,
        deletedAt: null,
      };

      const updateDto: UpdateAnnouncement = {
        status: "enviado",
        data_envio: new Date(),
      };

      const mappedAnnouncementForRepo = {
        status: "sent" as StatusAnnouncementType,
        sentAt: updateDto.data_envio || null,
      };

      const expectedResult: Announcement = {
        ...existingAnnouncement,
        ...mappedAnnouncementForRepo,
      };

      mockRepository.getById.mockResolvedValue(existingAnnouncement);
      mockRepository.update.mockResolvedValue(expectedResult);

      const result = await service.updateAnnouncement({
        id: "original-uuid",
        data: updateDto,
        context: mockContext,
      });

      expect(result).toEqual(expectedResult);
      expect(mockRepository.getById).toHaveBeenCalledTimes(1);
      expect(mockRepository.getById).toHaveBeenCalledWith({
        id: "original-uuid",
        context: mockContext,
      });

      expect(mockRepository.update).toHaveBeenCalledTimes(1);
      expect(mockRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "original-uuid",
          data: mappedAnnouncementForRepo,
          context: mockContext,
        })
      );
    });

    it("should re-throw an error if the repository fails on the final update operation", async () => {
      mockRepository.getById.mockResolvedValue(null);

      const appError = new AppError("Chamado não encontrado");

      mockRepository.update.mockRejectedValue(appError);

      await expect(
        service.updateAnnouncement({
          id: "existing-uuid",
          data: { titulo: "Segunda feira tem bolo de graça" },
          context: mockContext,
        })
      ).rejects.toThrow(appError);
    });
  });

  describe("deleteAnnouncement", () => {
    it("should successfully delete an existing and non-deleted announcement", async () => {
      const existingAnnouncement: Announcement = {
        id: "existing-uuid",
        deletedAt: null,
      } as Announcement;

      mockRepository.getById.mockResolvedValue(existingAnnouncement);

      mockRepository.softDelete.mockResolvedValue(true);

      await expect(
        service.deleteAnnouncement({
          id: "existing-uuid",
          context: mockContext,
        })
      ).resolves.toBeUndefined();

      expect(mockRepository.getById).toHaveBeenCalledTimes(1);
      expect(mockRepository.softDelete).toHaveBeenCalledTimes(1);
      expect(mockRepository.softDelete).toHaveBeenCalledWith({
        id: "existing-uuid",
        context: mockContext,
      });
    });

    it("should throw an AppError if the announcement to delete is not found", async () => {
      mockRepository.getById.mockResolvedValue(null);

      await expect(
        service.deleteAnnouncement({ id: "uuid", context: mockContext })
      ).rejects.toThrow(new AppError("Chamado não encontrado", 404));
      expect(mockRepository.softDelete).not.toHaveBeenCalled();
    });

    it("should throw an AppError if the announcement has already been deleted", async () => {
      const alreadyDeletedAnnouncement: Announcement = {
        id: "deleted-uuid",
        deletedAt: new Date(),
      } as Announcement;

      mockRepository.getById.mockResolvedValue(alreadyDeletedAnnouncement);

      await expect(
        service.deleteAnnouncement({
          id: "deleted-uuid",
          context: mockContext,
        })
      ).rejects.toThrow(
        new AppError("Não foi possível deletar o Chamado", 404)
      );

      expect(mockRepository.softDelete).toHaveBeenCalledTimes(1);
    });

    it("should throw an AppError if the repository softDelete operation fails", async () => {
      const existingAnnouncement: Announcement = {
        id: "existing-uuid",
        deletedAt: null,
      } as Announcement;
      mockRepository.getById.mockResolvedValue(existingAnnouncement);

      mockRepository.softDelete.mockResolvedValue(false);

      await expect(
        service.deleteAnnouncement({
          id: "existing-uuid",
          context: mockContext,
        })
      ).rejects.toThrow(new AppError("Não foi possível deletar o Chamado"));

      expect(mockRepository.getById).toHaveBeenCalledTimes(1);
      expect(mockRepository.softDelete).toHaveBeenCalledTimes(1);
    });

    it("should re-throw an error if the repository fails unexpectedly during the delete operation", async () => {
      const existingAnnouncement: Announcement = {
        id: "existing-uuid",
        deletedAt: null,
      } as Announcement;

      mockRepository.getById.mockResolvedValue(existingAnnouncement);

      const databaseError = new Error("Timeout database");
      mockRepository.softDelete.mockRejectedValue(databaseError);

      await expect(
        service.deleteAnnouncement({
          id: "existing-uuid",
          context: mockContext,
        })
      ).rejects.toThrow(databaseError);
    });
  });
});
