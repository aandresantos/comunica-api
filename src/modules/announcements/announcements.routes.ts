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
import { validateIdParam } from "@middlewares/param-validator.middleware";
import { AnnouncementViewModel } from "./annoucements.mapper";
import { ControllerResponse } from "@src/shared/types/base-response.types";
import z from "zod";

export async function announcementsRoutes(app: FastifyInstance) {
  const controller = buildAnnouncementsModule();

  app.get(
    "/",
    { schema: { querystring: listAnnouncementsQueryDto } },
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
    { schema: { body: createAnnouncementDto } },
    async (req, reply): Promise<ControllerResponse<AnnouncementViewModel>> => {
      const { body, statusCode } = await controller.create(
        req as FastifyRequest<{ Body: CreateAnnouncement }>
      );

      return reply.status(statusCode).send(body);
    }
  );

  app.put(
    "/:id",
    {
      schema: {
        body: updateAnnouncementDto,
        params: z.object({
          id: z.uuid({ message: "O ID do parâmetro deve ser um UUID válido." }),
        }),
      },
    },
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
