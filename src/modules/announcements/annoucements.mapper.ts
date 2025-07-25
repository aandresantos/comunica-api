import { Announcement, NewAnnouncement } from "./announcements.schema";
import {
  ChannelType,
  StatusAnnouncement,
  StatusAnnouncementType,
} from "./announcements.types";
import { CreateAnnouncementDto } from "./dtos/create-annoucement.dto";

export interface AnnouncementViewModel {
  id: string;
  titulo: string;
  conteudo: string;
  tipo_canal: ChannelType;
  status: StatusAnnouncementType;
  data_criacao: string;
  data_envio: string | null;
  autor: string;
  deletado_em: string | null;
}

export class AnnouncementMapper {
  public static toViewModel(announcement: Announcement): AnnouncementViewModel {
    const statusToUpper =
      announcement.status.toLocaleUpperCase() as keyof typeof StatusAnnouncement;

    return {
      id: announcement.id,
      titulo: announcement.title,
      conteudo: announcement.content,
      tipo_canal: announcement.channelType,
      status: StatusAnnouncement[statusToUpper] || StatusAnnouncement.SENT,
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

  public static toDomain(dto: CreateAnnouncementDto): NewAnnouncement {
    return {
      title: dto.titulo,
      content: dto.conteudo,
      channelType: dto.tipo_canal,
      status: "draft",
      author: dto.autor,
    };
  }
}
