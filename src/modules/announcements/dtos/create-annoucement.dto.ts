import { z as zod } from "zod";

export const createAnnouncementDto = zod.object({
  titulo: zod
    .string()
    .nonempty({ message: "O título é obrigatório." })
    .min(5, { message: "O título deve ter no mínimo 5 caracteres." }),

  conteudo: zod
    .string()
    .nonempty({ message: "O conteúdo é obrigatório." })
    .min(10, { message: "O conteúdo deve ter no mínimo 10 caracteres." }),

  tipo_canal: zod.enum(["email", "slack", "teams"], {
    error: 'O tipo de canal deve ser "email", "slack" ou "teams".',
  }),

  autor: zod.string().nonempty({ message: "O autor é obrigatório." }),
});

export type CreateAnnouncementDto = zod.infer<typeof createAnnouncementDto>;
