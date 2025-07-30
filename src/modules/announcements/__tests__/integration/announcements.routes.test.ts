import { FastifyInstance } from "fastify";
import { buildApp } from "@src/app";
import { CreateAnnouncement } from "../../dtos/create-annoucement.dto";

import { database, client as pgClient } from "@configs/database.config";
import {
  announcementsTable,
  NewAnnouncement,
} from "../../announcements.schema";
import { randomUUID } from "crypto";
import { eq, sql } from "drizzle-orm";
import { AnnouncementViewModel } from "../../annoucements.mapper";

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

  describe("PUT /chamados/:id", () => {
    it("should return 401 Unauthorized if no authentication token is provided", async () => {
      const anyUuid = randomUUID();

      const response = await app.inject({
        method: "PUT",
        url: `/chamados/${anyUuid}`,
        payload: { titulo: "qualquer" },
      });

      expect(response.statusCode).toBe(401);
    });

    it("should return 400 Bad Request if the announcement ID is not a valid UUID", async () => {
      const response = await app.inject({
        method: "PUT",
        url: "/chamados/" + "invalid-uuid",
        headers: { Authorization: `Bearer ${authToken}` },
        payload: { titulo: "qualquer" },
      });

      expect(response.statusCode).toBe(400);
    });

    it("should return 400 Bad Request if the request body is invalid", async () => {
      const [announcement] = await database
        .insert(announcementsTable)
        .values({
          title: "Registro Válido",
          content: "...",
          author: "test",
          channelType: "email",
          status: "draft",
        })
        .returning();

      const response = await app.inject({
        method: "PUT",
        url: `/chamados/${announcement.id}`,
        headers: { Authorization: `Bearer ${authToken}` },
        payload: { titulo: "a" },
      });
      const body = JSON.parse(response.body);

      expect(response.statusCode).toBe(400);
      expect(body.errors).toEqual([
        "/titulo: O título deve ter pelo menos 3 caracteres.",
      ]);
    });

    it("should return 404 Not Found if the announcement ID does not exist", async () => {
      const nonExistentId = randomUUID();

      const response = await app.inject({
        method: "PUT",
        url: `/chamados/${nonExistentId}`,
        headers: { Authorization: `Bearer ${authToken}` },
        payload: { titulo: "Título Válido Para Update" },
      });

      expect(response.statusCode).toBe(404);
    });

    it("should return 200 OK and the updated announcement when the request is valid", async () => {
      const [originalAnnouncement] = await database
        .insert(announcementsTable)
        .values({
          title: "Título Original",
          content: "Conteúdo Original",
          author: "Jest",
          channelType: "email",
          status: "draft",
        })
        .returning();

      const updatePayload = {
        titulo: "Título Atualizado com Sucesso!",
        status: "enviado",
      };

      const response = await app.inject({
        method: "PUT",
        url: `/chamados/${originalAnnouncement.id}`,
        headers: { Authorization: `Bearer ${authToken}` },
        payload: updatePayload,
      });
      const body = JSON.parse(response.body);

      expect(response.statusCode).toBe(200);
      expect(body.data.id).toBe(originalAnnouncement.id);
      expect(body.data.titulo).toBe("Título Atualizado com Sucesso!");
      expect(body.data.status).toBe("enviado");
      expect(body.data.conteudo).toBe("Conteúdo Original");
    });
  });

  describe("DELETE /chamados/:id", () => {
    it("should return 401 Unauthorized if no authentication token is provided", async () => {
      const anyUuid = randomUUID();

      const response = await app.inject({
        method: "DELETE",
        url: `/chamados/${anyUuid}`,
      });

      expect(response.statusCode).toBe(401);
    });

    it("should return 400 Bad Request if the announcement ID is not a valid UUID", async () => {
      const response = await app.inject({
        method: "DELETE",
        url: "/chamados/" + "invalid-uuid",
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(response.statusCode).toBe(400);
    });

    it("should return 404 Not Found if the announcement ID does not exist", async () => {
      const nonExistentId = randomUUID();

      const response = await app.inject({
        method: "DELETE",
        url: `/chamados/${nonExistentId}`,
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(response.statusCode).toBe(404);
    });

    it("should return 204 No Content and soft delete the announcement when the request is valid", async () => {
      const [announcementToDelete] = await database
        .insert(announcementsTable)
        .values({
          title: "Registro a ser Deletado",
          content: "...",
          author: "Jest",
          channelType: "email",
          status: "draft",
        })
        .returning();

      const targetId = announcementToDelete.id;

      const deleteResponse = await app.inject({
        method: "DELETE",
        url: `/chamados/${targetId}`,
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(deleteResponse.statusCode).toBe(204);
      expect(deleteResponse.body).toBe("");

      const foundAfterDelete = await database
        .select()
        .from(announcementsTable)
        .where(eq(announcementsTable.id, targetId));

      expect(foundAfterDelete).toHaveLength(1);
      expect(foundAfterDelete[0].deletedAt).not.toBeNull();
      expect(foundAfterDelete[0].deletedAt).toBeInstanceOf(Date);

      const getResponse = await app.inject({
        method: "GET",
        url: `/chamados/${targetId}`,
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect(getResponse.statusCode).toBe(404);
    });
  });

  describe("GET /chamados", () => {
    beforeEach(async () => {
      await database.execute(sql`DELETE FROM ${announcementsTable}`);
      const testData: NewAnnouncement[] = [
        {
          title: "A1",
          author: "ana",
          channelType: "email",
          status: "draft",
          content: "announcement",
          createdAt: new Date("2024-01-10"),
        },
        {
          title: "A2",
          author: "ana",
          channelType: "slack",
          status: "sent",
          content: "announcement",
          createdAt: new Date("2024-01-15"),
        },
        {
          title: "B1",
          author: "bruno",
          channelType: "email",
          status: "sent",
          content: "announcement",
          createdAt: new Date("2024-02-05"),
        },
        {
          title: "B2",
          author: "bruno",
          channelType: "teams",
          status: "draft",
          content: "announcement",
          createdAt: new Date("2024-02-20"),
        },
        {
          title: "C1",
          author: "carla",
          channelType: "email",
          status: "sent",
          content: "announcement",
          createdAt: new Date("2024-03-01"),
        },
        {
          title: "D1 (deleted)",
          author: "duda",
          channelType: "email",
          status: "draft",
          content: "announcement",
          createdAt: new Date("2024-01-01"),
          deletedAt: new Date(),
        },
      ];

      await database.insert(announcementsTable).values(testData);
    });

    it("should return 401 Unauthorized if no authentication token is provided", async () => {
      const response = await app.inject({ method: "GET", url: "/chamados" });
      expect(response.statusCode).toBe(401);
    });

    it("should return all non-deleted announcements (5) when no filters are applied", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/chamados",
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const body = JSON.parse(response.body);

      expect(response.statusCode).toBe(200);
      expect(body.data.total).toBe(5);
      expect(body.data.items.length).toBe(5);
    });

    it("should correctly filter by status", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/chamados?status=enviado",
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const body = JSON.parse(response.body);

      expect(response.statusCode).toBe(200);
      expect(body.data.total).toBe(3);
      expect(
        body.data.items.every(
          (item: AnnouncementViewModel) => item.status === "enviado"
        )
      ).toBe(true);
    });

    it("should correctly apply pagination with limit and offset", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/chamados?limit=2&offset=1",
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const body = JSON.parse(response.body);

      expect(response.statusCode).toBe(200);
      expect(body.data.total).toBe(5);
      expect(body.data.items.length).toBe(2);
      expect(body.data.items[0].titulo).toBe("A2");
      expect(body.data.items[1].titulo).toBe("B1");
    });

    it("should correctly filter by date range (data_inicial and data_final)", async () => {
      const startDate = "2024-02-01T00:00:00.000Z";
      const endDate = "2024-02-29T23:59:59.000Z";

      const response = await app.inject({
        method: "GET",
        url: `/chamados?data_inicial=${startDate}&data_final=${endDate}`,
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const body = JSON.parse(response.body);

      expect(response.statusCode).toBe(200);
      expect(body.data.total).toBe(2);
      expect(body.data.items.every((item: any) => item.autor === "bruno")).toBe(
        true
      );
    });

    it("should correctly handle a combination of filters", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/chamados?autor=ana&status=enviado",
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const body = JSON.parse(response.body);

      expect(response.statusCode).toBe(200);
      expect(body.data.total).toBe(1);
      expect(body.data.items[0].titulo).toBe("A2");
    });

    it("should return 400 Bad Request if a filter value is invalid", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/chamados?status=invalid_status",
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe("GET /chamados/:id", () => {
    it("should return 401 Unauthorized if no authentication token is provided", async () => {
      const anyUuid = randomUUID();
      const response = await app.inject({
        method: "GET",
        url: `/chamados/${anyUuid}`,
      });
      expect(response.statusCode).toBe(401);
    });

    it("should return 400 Bad Request if the announcement ID is not a valid UUID", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/chamados/" + "invalid-uuid",
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect(response.statusCode).toBe(400);
    });

    it("should return 404 Not Found if the announcement ID does not exist", async () => {
      const nonExistentId = randomUUID();
      const response = await app.inject({
        method: "GET",
        url: `/chamados/${nonExistentId}`,
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect(response.statusCode).toBe(404);
    });

    it("should return 404 Not Found for a soft-deleted announcement", async () => {
      const [announcement] = await database
        .insert(announcementsTable)
        .values({
          title: "Esse ta deletado",
          author: "test",
          channelType: "email",
          content: "content",
          status: "draft",
        })
        .returning();
      await database
        .update(announcementsTable)
        .set({ deletedAt: new Date() })
        .where(sql`${announcementsTable.id} = ${announcement.id}`);

      const response = await app.inject({
        method: "GET",
        url: `/chamados/${announcement.id}`,
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(response.statusCode).toBe(404);
    });

    it("should return 200 OK and the announcement when a valid ID is provided", async () => {
      const [announcement] = await database
        .insert(announcementsTable)
        .values({
          title: "Chamado encontrado pelo id",
          content: "...",
          author: "Jest",
          channelType: "teams",
          status: "sent",
        })
        .returning();

      const response = await app.inject({
        method: "GET",
        url: `/chamados/${announcement.id}`,
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const body = JSON.parse(response.body);

      expect(response.statusCode).toBe(200);
      expect(body.data.id).toBe(announcement.id);
      expect(body.data.titulo).toBe("Chamado encontrado pelo id");
      expect(body.data.status).toBe("enviado");
    });
  });
});
