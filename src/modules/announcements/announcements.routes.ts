import { FastifyInstance } from "fastify";

import { validateBody } from "@middlewares/body-validator.middleware";
import { buildAnnouncementsModule } from "./announcements.module";
import { createAnnouncementDto } from "./dtos/create-annoucement.dto";
import { listAnnouncementsQueryDto } from "./dtos/list-announcements-query.dto";
import { ZodError } from "zod";

export async function announcementsRoutes(app: FastifyInstance) {
  const controller = buildAnnouncementsModule();

  app.get("/", (req, reply) => {
    try {
      const query = listAnnouncementsQueryDto.parse(req.query);

      return controller.getAll(req, reply, query);
    } catch (err) {
      return reply.status(400).send({ message: "Query inválida", error: err });
    }
  });

  app.get("/:id", (req, reply) => controller.getById(req, reply));

  app.post(
    "/",
    { preHandler: validateBody(createAnnouncementDto) },
    (req, reply) => controller.create(req, reply)
  );

  app.put("/:id", (req, reply) => controller.update(req, reply));

  app.delete("/:id", (req, reply) => controller.softDelete(req, reply));
}
