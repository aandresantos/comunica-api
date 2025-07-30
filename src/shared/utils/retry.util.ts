export interface RetryOptions {
  retries: number;
  delay: number;
  factor?: number;
  onRetry?: (attempt: number, error: unknown) => void;
}

export async function retry<T>(
  proc: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  const { retries, delay, factor = 2, onRetry } = options;

  let attempt = 0;
  let lastError: unknown;

  while (attempt < retries) {
    try {
      return await proc();
    } catch (err) {
      lastError = err;
      attempt++;

      if (onRetry) {
        onRetry(attempt, err);
      }

      if (attempt >= retries) break;

      const currentDelay = delay * Math.pow(factor, attempt - 1);
      await new Promise((r) => setTimeout(r, currentDelay));
    }
  }

  throw lastError;
}
