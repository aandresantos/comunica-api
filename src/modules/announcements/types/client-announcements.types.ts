import { ChannelType, StatusAnnouncementType } from "./announcements.types";

export const StatusAnnouncementClient = {
  SENT: "enviado",
  DRAFT: "rascunho",
} as const;

export type StatusAnnouncementClientType =
  (typeof StatusAnnouncementClient)[keyof typeof StatusAnnouncementClient];

export interface AnnouncementRepositoryFilters {
  status?: StatusAnnouncementType;
  tipo_canal?: ChannelType;
  autor?: string;
  data_inicial?: string;
  data_final?: string;
  limit?: string;
  offset?: string;
}
