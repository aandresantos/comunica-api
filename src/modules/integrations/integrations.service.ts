import { AppError } from "@src/shared/errors";
import { cacheConfig } from "@configs/cache.config";
import {
  GetDataServiceArgs,
  IIntegrationsService,
} from "./integrations.interfaces";
import axios, { AxiosError } from "axios";
import { ICacheService } from "@src/shared/services/cache/cache.interfaces";
import { retry } from "@src/shared/utils/retry.util";

const CACHE_KEY = cacheConfig.services.integrations.key;

export class IntegrationsService implements IIntegrationsService {
  constructor(private cache: ICacheService) {}

  async getExternalData({ url, context }: GetDataServiceArgs): Promise<any> {
    const logger = context.logger.child({
      operation: "getExternalData",
      component: "IntegrationsService",
    });

    logger.info(
      { cacheKey: CACHE_KEY },
      "Starting external data retrieval process."
    );

    const cached = await this.cache.get(CACHE_KEY);

    if (cached) {
      logger.info({ cacheKey: CACHE_KEY }, "Cache hit. Returning fresh data.");

      return cached;
    }

    try {
      const retryOpts = { retries: 3, delay: 100, factor: 2 };

      const data = await retry(
        async () => {
          const response = await axios.get(url, { timeout: 5000 });
          return response.data;
        },
        {
          ...retryOpts,
          onRetry: (attempt, error) => {
            const err = error as AxiosError;

            logger.warn(
              {
                attempt,
                retries: retryOpts.retries,
                err: { message: err.message, code: err.code },
              },
              `Attempt ${attempt} failed. Retrying...`
            );
          },
        }
      );

      logger.info("Successfully retrieved data from external API.");

      await this.cache.set(CACHE_KEY, data);

      logger.info({ cacheKey: CACHE_KEY }, "Data has been set in cache.");

      return data;
    } catch (err) {
      const fallbackData = await this.cache.get(CACHE_KEY);

      if (fallbackData) {
        logger.warn(
          { cacheKey: CACHE_KEY },
          "Returning stale data from cache as a fallback."
        );

        return fallbackData;
      }

      logger.fatal(
        { cacheKey: CACHE_KEY },
        "No fallback data available in cache. Operation failed completely."
      );

      throw new AppError(
        "Não foi possível obter os dados da fonte externa",
        503
      );
    }
  }
}
