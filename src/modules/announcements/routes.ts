import { FastifyInstance, FastifyRequest } from "fastify";
import { AnnouncementsService, IAnnouncementsService } from "./service";
import {
  AnnouncementsRepository,
  IAnnouncementsRepository,
} from "./repository";

const repository: IAnnouncementsRepository = new AnnouncementsRepository();
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

  app.post("/", async (req, reply) => {
    const { body } = req.body as FastifyRequest<{
      Body: { id: string };
    }>;

    return { data: "criado com sucesso" };
  });

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
