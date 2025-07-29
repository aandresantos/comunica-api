import { z } from "zod";
import { StatusAnnouncementClient } from "../types/client-announcements.types";
import { Channel } from "../types/announcements.types";

export const updateAnnouncementDto = z.object({
  titulo: z
    .string()
    .min(3, { error: "O título deve ter pelo menos 3 caracteres." })
    .optional(),
  conteudo: z
    .string()
    .min(5, { error: "O conteúdo deve ter pelo menos 5 caracteres." })
    .optional(),
  tipo_canal: z
    .enum(Object.values(Channel), { error: "Tipo de canal inválido." })
    .optional(),
  status: z
    .enum(Object.values(StatusAnnouncementClient), {
      error: "Status inválido.",
    })
    .optional(),
  data_envio: z.coerce.date({ message: "Data de envio inválida." }).optional(),
  autor: z.string({ error: "Autor inválido." }).optional(),
});

export type UpdateAnnouncement = z.infer<typeof updateAnnouncementDto>;
