import { IntegrationsController } from "./integrations.controller";
import { IntegrationsService } from "./integrations.service";
import { NodeCacheService } from "@src/shared/services/cache/node-cache.service";
import { cacheConfig } from "@src/lib/configs/cache.config";

export function buildIntegrationsModule() {
  const cache = new NodeCacheService({
    ttlInSeconds: cacheConfig.services.integrations.ttl,
  });
  const service = new IntegrationsService(cache);
  const controller = new IntegrationsController(service);

  return controller;
}
