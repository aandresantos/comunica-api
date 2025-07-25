import { FastifyInstance, FastifyRequest } from "fastify";
import { AnnouncementsService } from "./announcements.service";
import { AnnouncementsRepository } from "./announcements.repository";
import {
  IAnnouncementsRepository,
  IAnnouncementsService,
} from "./announcements.interfaces";
import {
  CreateAnnouncementDto,
  createAnnouncementDto,
} from "./dtos/create-annoucement.dto";
import { validateBody } from "@middlewares/body-validator.middleware";
import { database } from "@src/lib/configs/database.config";
import { NewAnnouncement } from "./announcements.schema";
import { AnnouncementMapper } from "./annoucements.mapper";
import { errorHandler } from "@src/shared/handlers/error.handler";

// TODO: mover repo e service pra um module
const repository: IAnnouncementsRepository = new AnnouncementsRepository(
  database
);
const service: IAnnouncementsService = new AnnouncementsService(repository);

// TODO: criar controller
export async function announcementsRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    return service.listAnnouncements();
  });

  app.get("/:id", async (req, reply) => {
    const { id } = req.params as { id: string };

    const announcement = await service.getAnnouncementById(id);
    if (!announcement) {
      return reply.status(404).send({ message: "Anúncio não encontrado" });
    }

    return announcement;
  });

  app.post(
    "/",
    { preHandler: validateBody(createAnnouncementDto) },
    async (req, reply) => {
      const body = req.body as CreateAnnouncementDto;

      const created = await service.createAnnouncement(
        AnnouncementMapper.toDomain(body)
      );

      return reply.status(201).send(AnnouncementMapper.toViewModel(created));
    }
  );

  //TODO: adicionar validações
  app.put("/:id", async (req, reply) => {
    const { id } = req.params as { id: string };
    const data = req.body as any;

    const updated = await service.updateAnnouncement(id, data);
    if (!updated) {
      return reply.status(404).send({ message: "Anúncio não encontrado" });
    }

    return updated;
  });

  app.delete("/:id", async (req, reply) => {
    const { id } = req.params as { id: string };

    try {
      await service.deleteAnnouncement(id);
      return reply.status(204).send();
    } catch (error) {
      return reply.status(404).send({ message: "Anúncio não encontrado" });
    }
  });
}
