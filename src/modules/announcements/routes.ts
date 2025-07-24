import { FastifyInstance } from "fastify";
import { AnnouncementsService, IAnnouncementsService } from "./service";
import {
  AnnouncementsRepository,
  IAnnouncementsRepository,
} from "./repository";

const repository: IAnnouncementsRepository = new AnnouncementsRepository();
const service: IAnnouncementsService = new AnnouncementsService(repository);

export async function announcementsRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    return service.listAnnouncements();
  });
}
