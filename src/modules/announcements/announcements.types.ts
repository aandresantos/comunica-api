export const Channel = {
  EMAIL: "email",
  SLACK: "slack",
  TEAMS: "teams",
} as const;

export type ChannelType = (typeof Channel)[keyof typeof Channel];

export const StatusAnnouncement = {
  SENT: "enviado",
  DRAFT: "rascunho",
} as const;

export type StatusAnnouncementType =
  (typeof StatusAnnouncement)[keyof typeof StatusAnnouncement];
