import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sql } from "drizzle-orm";

import {
  announcementsTable,
  NewAnnouncement,
} from "@src/modules/announcements/announcements.schema";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL não foi definida nas variáveis de ambiente.");
}
const client = postgres(connectionString, { max: 1 });
const db = drizzle(client);

async function seed() {
  await db.execute(sql`DELETE FROM ${announcementsTable}`);

  const announcementsData: NewAnnouncement[] = [
    {
      title: "Boas-vindas ao Comunica.In!",
      content:
        "Estamos muito felizes em ter você a bordo. Explore a plataforma e veja como é fácil gerenciar seus comunicados.",
      author: "Diretoria",
      channelType: "email",
      status: "sent",
      sentAt: new Date(),
    },
    {
      title: "Atualização de Política de Férias",
      content:
        "A nova política de férias entrará em vigor a partir do próximo mês. Por favor, consulte o documento anexo no portal de RH.",
      author: "Secretaria",
      channelType: "teams",
      status: "sent",
      sentAt: new Date(),
    },
    {
      title: "Lembrete: Reunião Geral Trimestral",
      content:
        "Nossa reunião geral acontecerá nesta sexta-feira. Preparem suas perguntas!",
      author: "Time Vendas",
      channelType: "slack",
      status: "draft",
    },
    {
      title: "Treinamento de Segurança da Informação",
      content: "Inscreva-se até sexta-feira no portal de treinamentos.",
      author: "TI",
      channelType: "email",
      status: "sent",
      sentAt: new Date(),
    },
    {
      title: "Nova parceria com academia",
      content:
        "Agora temos descontos exclusivos na Academia FitLife. Consulte benefícios.",
      author: "RH",
      channelType: "slack",
      status: "sent",
      sentAt: new Date(),
    },
    {
      title: "Campanha do Agasalho",
      content: "Doe roupas até o final do mês no ponto de coleta do 2º andar.",
      author: "Ação Social",
      channelType: "teams",
      status: "draft",
    },
    {
      title: "Atualização do sistema interno",
      content:
        "O sistema ficará fora do ar domingo das 2h às 6h para manutenção.",
      author: "TI",
      channelType: "email",
      status: "sent",
      sentAt: new Date(),
    },
    {
      title: "Nova sala de convivência inaugurada",
      content:
        "O espaço no 4º andar está disponível para todos os colaboradores.",
      author: "Facilities",
      channelType: "slack",
      status: "sent",
      sentAt: new Date(),
    },
    {
      title: "Pesquisa de Clima Organizacional",
      content: "Participe até sexta-feira e ajude a melhorar nosso ambiente.",
      author: "RH",
      channelType: "email",
      status: "draft",
    },
    {
      title: "Alerta: Golpes de phishing em circulação",
      content:
        "Nunca clique em links suspeitos. Confira orientações no portal de TI.",
      author: "TI",
      channelType: "teams",
      status: "sent",
      sentAt: new Date(),
    },
    {
      title: "Feira de Saúde e Bem-estar",
      content:
        "Vacinação, exames rápidos e palestras no pátio principal na próxima semana.",
      author: "RH",
      channelType: "email",
      status: "sent",
      sentAt: new Date(),
    },
    {
      title: "Nova funcionalidade do CRM",
      content: "Assista ao vídeo explicativo no nosso canal interno.",
      author: "Time Comercial",
      channelType: "slack",
      status: "draft",
    },
    {
      title: "Aniversariantes do mês",
      content: "Confira os aniversariantes no mural digital.",
      author: "RH",
      channelType: "email",
      status: "sent",
      sentAt: new Date(),
    },
    {
      title: "Café com a Diretoria",
      content: "Inscreva-se para participar do bate-papo com o CEO.",
      author: "Diretoria",
      channelType: "teams",
      status: "sent",
      sentAt: new Date(),
    },
    {
      title: "Concurso de Ideias Inovadoras",
      content:
        "Submeta sua proposta até o dia 15 e concorra a prêmios incríveis.",
      author: "Inovação",
      channelType: "slack",
      status: "draft",
    },
    {
      title: "Novo contrato de vale-alimentação",
      content: "Os cartões serão trocados a partir do próximo mês.",
      author: "RH",
      channelType: "email",
      status: "sent",
      sentAt: new Date(),
    },
    {
      title: "Black Friday Interna",
      content:
        "Descontos exclusivos para colaboradores em produtos da loja parceira.",
      author: "Marketing",
      channelType: "email",
      status: "sent",
      sentAt: new Date(),
    },
    {
      title: "Treinamento obrigatório LGPD",
      content: "Curso online disponível no portal até o dia 30.",
      author: "Compliance",
      channelType: "teams",
      status: "draft",
    },
    {
      title: "Premiação: Colaborador Destaque",
      content:
        "Vote no seu colega que mais se destacou no trimestre no portal de RH.",
      author: "RH",
      channelType: "slack",
      status: "sent",
      sentAt: new Date(),
    },
    {
      title: "Atenção ao uso do estacionamento",
      content: "Novo sistema de vagas será implantado a partir de segunda.",
      author: "Facilities",
      channelType: "email",
      status: "sent",
      sentAt: new Date(),
    },
    {
      title: "Expansão para nova filial",
      content: "Estamos abrindo um novo escritório em Belo Horizonte!",
      author: "Diretoria",
      channelType: "email",
      status: "draft",
    },
    {
      title: "Campanha de Vacinação",
      content: "Vacinas gratuitas disponíveis no ambulatório da empresa.",
      author: "RH",
      channelType: "teams",
      status: "sent",
      sentAt: new Date(),
    },
    {
      title: "Nova política de home office",
      content:
        "A partir do próximo mês, até 3 dias por semana poderão ser remotos.",
      author: "RH",
      channelType: "slack",
      status: "sent",
      sentAt: new Date(),
    },
    {
      title: "Atualização no plano de saúde",
      content: "Confira os novos benefícios no portal do colaborador.",
      author: "RH",
      channelType: "email",
      status: "draft",
    },
    {
      title: "Evento de integração de equipes",
      content:
        "Um dia especial de dinâmicas e aprendizado. Reserve sua agenda.",
      author: "RH",
      channelType: "teams",
      status: "sent",
      sentAt: new Date(),
    },
    {
      title: "Atenção ao uso de e-mails corporativos",
      content: "Evite encaminhar mensagens pessoais pelo e-mail da empresa.",
      author: "TI",
      channelType: "email",
      status: "sent",
      sentAt: new Date(),
    },
    {
      title: "Hackathon 2025",
      content: "Monte sua equipe e inscreva-se no desafio de inovação.",
      author: "Inovação",
      channelType: "slack",
      status: "draft",
    },
    {
      title: "Campanha de reciclagem",
      content: "Ajude o meio ambiente separando o lixo corretamente.",
      author: "Ação Social",
      channelType: "email",
      status: "sent",
      sentAt: new Date(),
    },
    {
      title: "Alerta: Atualização obrigatória de senha",
      content:
        "Acesse o portal até o final da semana e altere sua senha de acesso.",
      author: "TI",
      channelType: "teams",
      status: "sent",
      sentAt: new Date(),
    },
    {
      title: "Apoio psicológico disponível",
      content: "Serviço gratuito de apoio emocional. Agende sua sessão online.",
      author: "RH",
      channelType: "slack",
      status: "draft",
    },
    {
      title: "Prêmio de produtividade",
      content: "Os melhores times serão reconhecidos no evento anual.",
      author: "Diretoria",
      channelType: "email",
      status: "sent",
      sentAt: new Date(),
    },
    {
      title: "Alerta de TI: uso de VPN",
      content: "É obrigatório o uso de VPN para acesso remoto aos sistemas.",
      author: "TI",
      channelType: "email",
      status: "draft",
    },
    {
      title: "Benefícios flexíveis",
      content: "Agora você pode escolher onde gastar seus créditos mensais.",
      author: "RH",
      channelType: "teams",
      status: "sent",
      sentAt: new Date(),
    },
    {
      title: "Workshop de Liderança",
      content: "Treinamento exclusivo para gestores na próxima quarta-feira.",
      author: "RH",
      channelType: "slack",
      status: "sent",
      sentAt: new Date(),
    },
    {
      title: "Atenção: phishing interno detectado",
      content: "Desconsidere e-mails solicitando dados pessoais.",
      author: "TI",
      channelType: "email",
      status: "sent",
      sentAt: new Date(),
    },
    {
      title: "Aviso: feriado prolongado",
      content: "Na próxima semana, emenda do feriado será autorizada.",
      author: "Diretoria",
      channelType: "email",
      status: "draft",
    },
    {
      title: "Treinamento de ferramentas de vendas",
      content: "Nova turma aberta para o CRM e plataformas de automação.",
      author: "Comercial",
      channelType: "teams",
      status: "sent",
      sentAt: new Date(),
    },
    {
      title: "Atualização: frota de veículos",
      content: "Novos carros disponíveis para viagens corporativas.",
      author: "Facilities",
      channelType: "slack",
      status: "sent",
      sentAt: new Date(),
    },
    {
      title: "Nova versão do app mobile",
      content: "Baixe a atualização e confira as novidades.",
      author: "TI",
      channelType: "email",
      status: "draft",
    },
    {
      title: "Atenção: novo processo de reembolso",
      content: "Despesas devem ser lançadas até o dia 5 de cada mês.",
      author: "Financeiro",
      channelType: "teams",
      status: "sent",
      sentAt: new Date(),
    },
    {
      title: "Doação de sangue coletiva",
      content: "Participe desta ação solidária no próximo sábado.",
      author: "Ação Social",
      channelType: "slack",
      status: "sent",
      sentAt: new Date(),
    },
    {
      title: "Programa de Mentoria",
      content: "Inscreva-se para ser mentor ou mentorado neste ciclo.",
      author: "RH",
      channelType: "email",
      status: "sent",
      sentAt: new Date(),
    },
    {
      title: "Mudança no restaurante corporativo",
      content: "Novo cardápio e horários estendidos a partir de amanhã.",
      author: "Facilities",
      channelType: "email",
      status: "draft",
    },
    {
      title: "Pesquisa de satisfação com fornecedores",
      content: "Dê sua opinião sobre nossos parceiros estratégicos.",
      author: "Compras",
      channelType: "teams",
      status: "sent",
      sentAt: new Date(),
    },
    {
      title: "Férias coletivas em dezembro",
      content: "A empresa estará fechada do dia 20 ao dia 5 de janeiro.",
      author: "Diretoria",
      channelType: "slack",
      status: "sent",
      sentAt: new Date(),
    },
    {
      title: "Novo contrato de internet",
      content: "Mais velocidade disponível nos escritórios.",
      author: "TI",
      channelType: "email",
      status: "sent",
      sentAt: new Date(),
    },
    {
      title: "Aviso: reformas no prédio",
      content: "Haverá barulho durante os próximos 10 dias no 3º andar.",
      author: "Facilities",
      channelType: "teams",
      status: "draft",
    },
    {
      title: "Alerta de incêndio - teste",
      content: "Treinamento de evacuação na próxima semana.",
      author: "Segurança",
      channelType: "slack",
      status: "sent",
      sentAt: new Date(),
    },
    {
      title: "Oficina de produtividade pessoal",
      content: "Inscreva-se na oficina presencial no auditório.",
      author: "RH",
      channelType: "email",
      status: "sent",
      sentAt: new Date(),
    },
  ];

  await db.insert(announcementsTable).values(announcementsData);

  await client.end();
}

seed().catch((error) => {
  console.error("❌ Não foi possível rodar o seed:", error);
  process.exit(1);
});
