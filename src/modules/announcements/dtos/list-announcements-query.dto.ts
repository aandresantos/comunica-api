import { z } from "zod";
import { Channel } from "../types/announcements.types";
import { StatusAnnouncementClient } from "../types/client-announcements.types";

export const listAnnouncementsQueryDto = z.object({
  limit: z.coerce
    .number()
    .min(1, { message: "O limite mínimo é 1" })
    .max(50, { message: "O limite máximo é de 50 Chamados" })
    .default(10)
    .optional(),
  offset: z.coerce
    .number()
    .min(0, { message: "O offset mínimo é 0" })
    .default(0)
    .optional(),
  status: z
    .enum(Object.values(StatusAnnouncementClient), {
      error: `O status deve ser: ${Object.values(StatusAnnouncementClient)
        .map((v, i, arr) =>
          i === arr.length - 1 && arr.length > 1 ? `ou ${v}` : v
        )
        .join(", ")}.`,
    })
    .optional(),
  tipo_canal: z
    .enum(Object.values(Channel), {
      error: `O tipo_canal deve ser: ${Object.values(Channel)
        .map((v, i, arr) =>
          i === arr.length - 1 && arr.length > 1 ? `ou ${v}` : v
        )
        .join(", ")}.`,
    })
    .optional(),
  autor: z.string().optional(),
  data_inicial: z.coerce.date({ error: "Data inicial inválida" }).optional(),
  data_final: z.coerce.date({ error: "Data final inválida" }).optional(),
});

export type ListAnnouncementsQuery = z.infer<typeof listAnnouncementsQueryDto>;
