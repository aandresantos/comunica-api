import { z } from "zod";
import { Channel } from "../types/announcements.types";
import { StatusAnnouncementClient } from "../types/client-announcements.types";

export const listAnnouncementsQueryDto = z.object({
  limit: z.string().optional().default("10"),
  offset: z.string().optional().default("0"),
  status: z.enum(Object.values(StatusAnnouncementClient)).optional(),
  tipo_canal: z.enum(Object.values(Channel)).optional(),
  autor: z.string().optional(),
  data_inicial: z.coerce.date().optional(),
  data_final: z.coerce.date().optional(),
});

export type ListAnnouncementsQuery = z.infer<typeof listAnnouncementsQueryDto>;
