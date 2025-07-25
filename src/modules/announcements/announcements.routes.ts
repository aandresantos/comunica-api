import { FastifyInstance, FastifyRequest } from "fastify";
import { AnnouncementsService } from "./announcements.service";
import { AnnouncementsRepository } from "./announcements.repository";
import {
  IAnnouncementsRepository,
  IAnnouncementsService,
} from "./announcements.interfaces";
import { createAnnouncementDto } from "./dtos/create-annoucement.dto";
import { validateBody } from "@middlewares/body-validator.middleware";
import { database } from "@src/lib/configs/database.config";

// TODO: mover repo e service pra um module
const repository: IAnnouncementsRepository = new AnnouncementsRepository(
  database
);
const service: IAnnouncementsService = new AnnouncementsService(repository);

export async function announcementsRoutes(app: FastifyInstance) {
  // TODO: implementar camada de handler
  app.get("/", async () => {
    return service.listAnnouncements();
  });

  app.get("/:id", async (req, reply) => {
    const { id } = req.params as FastifyRequest<{ Params: { id: string } }>;

    return { data: id };
  });

  app.post(
    "/",
    { preHandler: validateBody(createAnnouncementDto) },
    async (req, reply) => {
      const body = req.body;

      return { data: "criado com sucesso" };
    }
  );

  app.post("/:id", async (req, reply) => {
    const { id } = req.params as FastifyRequest<{ Params: { id: string } }>;
    const { body } = req.body as FastifyRequest<{
      Body: { id: string };
    }>;

    return { data: "atualizado com sucesso" };
  });

  app.delete("/:id", async (req, reply) => {
    const { id } = req.params as FastifyRequest<{ Params: { id: string } }>;

    return { data: "deletado com sucesso" };
  });
}
