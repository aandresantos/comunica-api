import { database } from "@configs/database.config";
import { AnnouncementsRepository } from "./announcements.repository";
import { AnnouncementsService } from "./announcements.service";
import { AnnouncementsController } from "./announcements.controller";

export function buildAnnouncementsModule() {
  const repository = new AnnouncementsRepository(database);
  const service = new AnnouncementsService(repository);
  const controller = new AnnouncementsController(service);

  return controller;
}
