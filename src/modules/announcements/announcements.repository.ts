import { IAnnouncementsRepository } from "./announcements.interfaces";
import { Channel, StatusAnnouncement } from "./announcements.types";

export class AnnouncementsRepository implements IAnnouncementsRepository {
  async getAll() {
    return [
      {
        id: "123-456-789",
        titulo: "Testando",
        conteudo: "Testando o nome também",
        tipo_canal: Channel.EMAIL,
        status: StatusAnnouncement.DRAFT,
        autor: "andre.santos",
        deletado_em: null,
        data_envio: new Date(),
        data_criacao: new Date(),
      },
    ];
  }
}
