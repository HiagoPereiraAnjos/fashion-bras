import { runtimeConfig } from '@/config/runtime';

export class ApiRequestError extends Error {
  readonly status: number;
  readonly details?: string;

  constructor(message: string, status = 0, details?: string) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.details = details;
  }
}

function resolveApiUrl(path: string): string {
  if (!path.startsWith('/')) {
    throw new Error(`API path must start with "/". Received: "${path}"`);
  }

  if (!runtimeConfig.apiBaseUrl) return path;
  return `${runtimeConfig.apiBaseUrl}${path}`;
}

function extractProblemDetail(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object') return null;

  const detail = (payload as Record<string, unknown>).detail;
  if (typeof detail === 'string' && detail.trim().length > 0) return detail.trim();

  const title = (payload as Record<string, unknown>).title;
  if (typeof title === 'string' && title.trim().length > 0) return title.trim();

  return null;
}

async function parseJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text.trim()) return null;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

export async function requestApi<T>(
  path: string,
  options: RequestInit,
  parser: { parse: (value: unknown) => T },
): Promise<T> {
  const response = await fetch(resolveApiUrl(path), {
    credentials: 'omit',
    ...options,
  });
  const payload = await parseJson(response);

  if (!response.ok) {
    const detail = extractProblemDetail(payload);
    throw new ApiRequestError(
      detail ?? `Requisicao falhou com status ${response.status}.`,
      response.status,
      detail ?? undefined,
    );
  }

  return parser.parse(payload);
}
