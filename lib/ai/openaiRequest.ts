export type OpenAIRequestOptions = {
  timeoutMs?: number;
  maxAttempts?: number;
};

const DEFAULT_TIMEOUT_MS = 45_000;
const DEFAULT_MAX_ATTEMPTS = 3;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function isRetryableError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const lowered = error.message.toLowerCase();

  return (
    lowered.includes("timeout") ||
    lowered.includes("timed out") ||
    lowered.includes("etimedout") ||
    lowered.includes("429") ||
    lowered.includes("rate limit") ||
    lowered.includes("overloaded") ||
    lowered.includes("temporarily unavailable")
  );
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timeoutId: NodeJS.Timeout | undefined;

  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error("OpenAI request timed out."));
        }, timeoutMs);
      }),
    ]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

export async function runOpenAIRequest<T>(
  operation: () => Promise<T>,
  options: OpenAIRequestOptions = {},
): Promise<T> {
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const maxAttempts = options.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await withTimeout(operation(), timeoutMs);
    } catch (error) {
      lastError = error;

      if (!isRetryableError(error) || attempt === maxAttempts) {
        throw error;
      }

      await delay(300 * attempt);
    }
  }

  throw lastError ?? new Error("OpenAI request failed.");
}
