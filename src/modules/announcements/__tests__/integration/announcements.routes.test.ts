import { FastifyInstance } from "fastify";
import { buildApp } from "@src/app";
import { CreateAnnouncement } from "../../dtos/create-annoucement.dto";

import { client as pgClient } from "@configs/database.config";

describe("Announcements Routes - Integration Tests", () => {
  let app: FastifyInstance;
  let authToken = "";

  beforeAll(async () => {
    app = buildApp();
    await app.ready();

    const registerResponse = await app.inject({
      method: "POST",
      url: "/auth/register",
      payload: {
        email: "teste@example.com",
        password: "12356",
      },
    });

    const body = JSON.parse(registerResponse.body);
    authToken = body.data.accessToken;

    expect(authToken).toBeDefined();
    expect(typeof authToken).toBe("string");
  });

  afterAll(async () => {
    await Promise.all([app.close(), pgClient.end()]);
  });

  describe("POST /chamados", () => {
    it("should return 401 Unauthorized if no authentication token is provided", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/chamados",
        payload: {
          titulo: "Chamado Válido",
          conteudo: "Conteúdo com mais de dez caracteres.",
          autor: "Teste",
          tipo_canal: "email",
        },
      });

      expect(response.statusCode).toBe(401);
    });

    it("should return 400 Bad Request if the request body is invalid", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/chamados",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        payload: { titulo: "short" },
      });

      const body = JSON.parse(response.body);
      expect(response.statusCode).toBe(400);

      expect(body.errors).toEqual([
        "/conteudo: O conteudo deve ser uma string",
        '/tipo_canal: O tipo de canal deve ser "email", "slack" ou "teams".',
        "/autor: O autor deve ser uma string",
      ]);
    });

    it("should return 201 Created and the new announcement when the request is valid", async () => {
      const newAnnouncement: CreateAnnouncement = {
        titulo: "Chamado de Teste de Integração",
        conteudo: "Este conteúdo foi criado por um teste automatizado.",
        autor: "Jest",
        tipo_canal: "teams",
      };

      const response = await app.inject({
        method: "POST",
        url: "/chamados",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        payload: newAnnouncement,
      });

      const body = JSON.parse(response.body);

      expect(response.statusCode).toBe(201);
      expect(body.data.id).toBeDefined();
      expect(body.data.titulo).toBe(newAnnouncement.titulo);
    });
  });
});
