import { Announcement, NewAnnouncement } from "./announcements.schema";
import {
  ChannelType,
  StatusAnnouncement,
  StatusAnnouncementType,
} from "./types/announcements.types";
import { CreateAnnouncement } from "./dtos/create-annoucement.dto";
import {
  StatusAnnouncementClient,
  StatusAnnouncementClientType,
} from "./types/client-announcements.types";

export interface AnnouncementViewModel {
  id: string;
  titulo: string;
  conteudo: string;
  tipo_canal: ChannelType;
  status: StatusAnnouncementClientType;
  data_criacao: string;
  data_envio: string | null;
  autor: string;
  deletado_em: string | null;
}

export class AnnouncementMapper {
  public static mapStatusClientToDb(
    status: StatusAnnouncementClientType
  ): StatusAnnouncementType {
    const map: Record<StatusAnnouncementClientType, StatusAnnouncementType> = {
      [StatusAnnouncementClient.SENT]: StatusAnnouncement.SENT,
      [StatusAnnouncementClient.DRAFT]: StatusAnnouncement.DRAFT,
    };
    return map[status];
  }

  public static mapStatusDbToClient(
    status: StatusAnnouncementType
  ): StatusAnnouncementClientType {
    const map: Record<StatusAnnouncementType, StatusAnnouncementClientType> = {
      [StatusAnnouncement.SENT]: StatusAnnouncementClient.SENT,
      [StatusAnnouncement.DRAFT]: StatusAnnouncementClient.DRAFT,
    };
    return map[status];
  }

  public static toViewModel(announcement: Announcement): AnnouncementViewModel {
    return {
      id: announcement.id,
      titulo: announcement.title,
      conteudo: announcement.content,
      tipo_canal: announcement.channelType,
      status: this.mapStatusDbToClient(announcement.status),
      autor: announcement.author,
      data_criacao: announcement.createdAt.toISOString(),
      data_envio: announcement.sentAt
        ? announcement.sentAt.toISOString()
        : null,
      deletado_em: announcement.deletedAt
        ? announcement.deletedAt.toISOString()
        : null,
    };
  }

  public static toViewModelList(
    announcements: Announcement[]
  ): AnnouncementViewModel[] {
    return announcements.map((announcement) => this.toViewModel(announcement));
  }

  public static toDomain(dto: CreateAnnouncement): NewAnnouncement {
    return {
      title: dto.titulo,
      content: dto.conteudo,
      channelType: dto.tipo_canal,
      status: StatusAnnouncement.DRAFT,
      author: dto.autor,
    };
  }
}
