import { FastifyInstance } from "fastify";

// TODO: por o BaseResponse aqui
export async function announcementsRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    return { data: "Chamados" };
  });
}
