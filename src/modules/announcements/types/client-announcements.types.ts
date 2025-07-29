import { ChannelType, StatusAnnouncementType } from "./announcements.types";

export const StatusAnnouncementClient = {
  ENVIADO: "enviado",
  RASCUNHO: "rascunho",
} as const;

export type StatusAnnouncementClientType =
  (typeof StatusAnnouncementClient)[keyof typeof StatusAnnouncementClient];

export interface AnnouncementRepositoryFilters {
  status?: StatusAnnouncementType;
  tipo_canal?: ChannelType;
  autor?: string;
  data_inicial?: string;
  data_final?: string;
  limit?: number;
  offset?: number;
}
