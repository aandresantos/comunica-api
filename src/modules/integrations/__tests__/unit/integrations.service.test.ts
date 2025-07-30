import axios from "axios";
import pino from "pino";
import { IntegrationsService } from "../../integrations.service";
import { IIntegrationsService } from "../../integrations.interfaces";
import { ContextualArgs } from "@integrations/integrations.interfaces";
import { AppError } from "@shared/errors";
import { retry } from "@shared/utils/retry.util";
import { ICacheService } from "@shared/services/cache/cache.interfaces";

jest.mock("axios");
jest.mock("@src/shared/utils/retry.util");

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedRetry = retry as jest.Mock;

describe("Integrations Service - Unit Tests", () => {
  let service: IIntegrationsService;
  let mockCache: jest.Mocked<ICacheService>;
  let mockLogger: pino.Logger;
  let mockContext: ContextualArgs["context"];
  const testUrl = "https://fake.api/data";

  const CACHE_KEY = "integrationsData";
  beforeEach(() => {
    mockLogger = pino({ enabled: false });
    mockContext = { logger: mockLogger };

    mockCache = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    };

    service = new IntegrationsService(mockCache);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return data from cache if it exists (cache hit)", async () => {
    const cachedData = [{ id: 1, title: "From Cache" }];
    mockCache.get.mockResolvedValue(cachedData);

    const result = await service.getExternalData({
      url: testUrl,
      context: mockContext,
    });

    expect(result).toEqual(cachedData);

    expect(mockCache.get).toHaveBeenCalledWith(CACHE_KEY);
    expect(mockCache.get).toHaveBeenCalledTimes(1);
    expect(mockedRetry).not.toHaveBeenCalled();
    expect(mockCache.set).not.toHaveBeenCalled();
  });

  it("should fetch from API and set cache if cache is empty (cache miss)", async () => {
    const apiData = [{ id: 2, title: "From API" }];
    mockCache.get.mockResolvedValue(null);

    mockedRetry.mockResolvedValue(apiData);

    const result = await service.getExternalData({
      url: testUrl,
      context: mockContext,
    });

    expect(result).toEqual(apiData);
    expect(mockCache.get).toHaveBeenCalledTimes(1);
    expect(mockedRetry).toHaveBeenCalledTimes(1);
    expect(mockCache.set).toHaveBeenCalledWith(CACHE_KEY, apiData);
  });

  it("should return stale data from cache as fallback if API fails", async () => {
    const staleCachedData = [{ id: 3, title: "Stale Cache Data" }];
    const apiError = new Error("API is down");

    mockCache.get
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(staleCachedData);

    mockedRetry.mockRejectedValue(apiError);

    const result = await service.getExternalData({
      url: testUrl,
      context: mockContext,
    });

    expect(result).toEqual(staleCachedData);
    expect(mockCache.get).toHaveBeenCalledTimes(2);
    expect(mockedRetry).toHaveBeenCalledTimes(1);
    expect(mockCache.set).not.toHaveBeenCalled();
  });

  it("should throw an AppError if API fails and there is no cache for fallback", async () => {
    const apiError = new Error("API is down and cache is cold");
    mockCache.get.mockResolvedValue(null);
    mockedRetry.mockRejectedValue(apiError);

    await expect(
      service.getExternalData({ url: testUrl, context: mockContext })
    ).rejects.toThrow(
      new AppError("Não foi possível obter os dados da fonte externa", 503)
    );

    expect(mockCache.get).toHaveBeenCalledTimes(2);
    expect(mockedRetry).toHaveBeenCalledTimes(1);
    expect(mockCache.set).not.toHaveBeenCalled();
  });
});
