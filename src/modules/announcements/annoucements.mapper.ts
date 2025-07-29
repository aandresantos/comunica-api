import { Announcement, NewAnnouncement } from "./announcements.schema";
import {
  ChannelType,
  StatusAnnouncement,
  StatusAnnouncementType,
} from "./types/announcements.types";
import {
  StatusAnnouncementClient,
  StatusAnnouncementClientType,
} from "./types/client-announcements.types";
import { CreateAnnouncement } from "./dtos/create-annoucement.dto";
import { UpdateAnnouncement } from "./dtos/update-annoucement.dto";

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
      [StatusAnnouncementClient["ENVIADO"]]: StatusAnnouncement.SENT,
      [StatusAnnouncementClient["RASCUNHO"]]: StatusAnnouncement.DRAFT,
    };
    return map[status];
  }

  public static mapStatusDbToClient(
    status: StatusAnnouncementType
  ): StatusAnnouncementClientType {
    const map: Record<StatusAnnouncementType, StatusAnnouncementClientType> = {
      [StatusAnnouncement.SENT]: StatusAnnouncementClient["ENVIADO"],
      [StatusAnnouncement.DRAFT]: StatusAnnouncementClient["RASCUNHO"],
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

  public static toPartialDomain(
    dto: UpdateAnnouncement
  ): Partial<NewAnnouncement> {
    const mapped: Partial<NewAnnouncement> = {};

    if (dto.titulo !== undefined) mapped.title = dto.titulo;
    if (dto.conteudo !== undefined) mapped.content = dto.conteudo;
    if (dto.tipo_canal !== undefined) mapped.channelType = dto.tipo_canal;
    if (dto.status !== undefined)
      mapped.status = this.mapStatusClientToDb(dto.status);
    if (dto.autor !== undefined) mapped.author = dto.autor;
    if (dto.data_envio !== undefined) mapped.sentAt = dto.data_envio;

    return mapped;
  }
}
