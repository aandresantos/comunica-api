import { FastifyInstance, FastifyRequest } from "fastify";

import { buildAnnouncementsModule } from "./announcements.module";
import {
  ListAnnouncementsQuery,
  listAnnouncementsQueryDto,
} from "./dtos/list-announcements-query.dto";
import {
  UpdateAnnouncement,
  updateAnnouncementDto,
} from "./dtos/update-annoucement.dto";
import {
  CreateAnnouncement,
  createAnnouncementDto,
} from "./dtos/create-annoucement.dto";
import { validateBody } from "@middlewares/body-validator.middleware";
import { validateQuery } from "@middlewares/query-validator.middleware";
import { validateIdParam } from "@middlewares/param-validator.middleware";

export async function announcementsRoutes(app: FastifyInstance) {
  const controller = buildAnnouncementsModule();

  app.get(
    "/",
    { preHandler: validateQuery(listAnnouncementsQueryDto) },
    async (req, reply) => {
      const { body, statusCode } = await controller.getAll(
        req as FastifyRequest<{ Querystring: ListAnnouncementsQuery }>
      );

      return reply.status(statusCode).send(body);
    }
  );

  app.get("/:id", { preHandler: validateIdParam() }, async (req, reply) => {
    const { body, statusCode } = await controller.getById(
      req as FastifyRequest<{ Params: { id: string } }>
    );

    return reply.status(statusCode).send(body);
  });

  app.post(
    "/",
    { preHandler: validateBody(createAnnouncementDto) },
    async (req, reply) => {
      const { body, statusCode } = await controller.create(
        req as FastifyRequest<{ Body: CreateAnnouncement }>
      );

      return reply.status(statusCode).send(body);
    }
  );

  app.put(
    "/:id",
    { preHandler: [validateIdParam(), validateBody(updateAnnouncementDto)] },
    async (req, reply) => {
      const { body, statusCode } = await controller.update(
        req as FastifyRequest<{
          Params: { id: string };
          Body: UpdateAnnouncement;
        }>
      );

      return reply.status(statusCode).send(body);
    }
  );

  app.delete("/:id", { preHandler: validateIdParam() }, async (req, reply) => {
    const { body, statusCode } = await controller.softDelete(
      req as FastifyRequest<{ Params: { id: string } }>
    );

    return reply.status(statusCode).send(body);
  });
}
