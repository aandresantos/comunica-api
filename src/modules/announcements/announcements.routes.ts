import { FastifyInstance } from "fastify";

import { validateBody } from "@middlewares/body-validator.middleware";
import { buildAnnouncementsModule } from "./announcements.module";
import { createAnnouncementDto } from "./dtos/create-annoucement.dto";

export async function announcementsRoutes(app: FastifyInstance) {
  const controller = buildAnnouncementsModule();

  app.get("/", (req, reply) => controller.getAll(req, reply));

  app.get("/:id", (req, reply) => controller.getById(req, reply));

  app.post(
    "/",
    { preHandler: validateBody(createAnnouncementDto) },
    (req, reply) => controller.create(req, reply)
  );

  app.put("/:id", (req, reply) => controller.update(req, reply));

  app.delete("/:id", (req, reply) => controller.softDelete(req, reply));
}
