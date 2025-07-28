import { FastifyInstance, FastifyRequest } from "fastify";

import { validateBody } from "@middlewares/body-validator.middleware";
import { buildAnnouncementsModule } from "./announcements.module";
import { createAnnouncementDto } from "./dtos/create-annoucement.dto";
import {
  ListAnnouncementsQuery,
  listAnnouncementsQueryDto,
} from "./dtos/list-announcements-query.dto";
import { ZodError } from "zod";
import { validateQuery } from "@middlewares/query-validator.middleware";

export async function announcementsRoutes(app: FastifyInstance) {
  const controller = buildAnnouncementsModule();

  app.get(
    "/",
    { preHandler: validateQuery(listAnnouncementsQueryDto) },
    (req, reply) =>
      controller.getAll(
        req as FastifyRequest<{ Querystring: ListAnnouncementsQuery }>,
        reply
      )
  );

  app.get("/:id", (req, reply) => controller.getById(req, reply));

  app.post(
    "/",
    { preHandler: validateBody(createAnnouncementDto) },
    (req, reply) => controller.create(req, reply)
  );

  app.put("/:id", (req, reply) => controller.update(req, reply));

  app.delete("/:id", (req, reply) => controller.softDelete(req, reply));
}
