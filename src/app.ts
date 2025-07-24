import fastify from "fastify";
import { announcementsRoutes } from "@announcements/routes";

export const buildApp = () => {
  const app = fastify({ logger: true });

  app.register(announcementsRoutes, { prefix: "/chamados" });

  return app;
};
