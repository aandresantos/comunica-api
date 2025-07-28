export const Channel = {
  EMAIL: "email",
  SLACK: "slack",
  TEAMS: "teams",
} as const;

export type ChannelType = (typeof Channel)[keyof typeof Channel];

export const StatusAnnouncement = {
  SENT: "sent",
  DRAFT: "draft",
} as const;

export type StatusAnnouncementType =
  (typeof StatusAnnouncement)[keyof typeof StatusAnnouncement];
