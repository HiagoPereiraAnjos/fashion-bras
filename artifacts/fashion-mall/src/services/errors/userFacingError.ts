import { ApiRequestError } from '@/services/api/request';

export type UserFacingErrorCategory =
  | 'validation'
  | 'authentication'
  | 'network'
  | 'unexpected';

interface UserFacingErrorOptions {
  unexpectedMessage: string;
  validationMessage?: string;
  authenticationMessage?: string;
  forbiddenMessage?: string;
  networkMessage?: string;
  allowValidationDetail?: boolean;
}

interface UserFacingErrorResult {
  category: UserFacingErrorCategory;
  message: string;
}

const NETWORK_MESSAGE_DEFAULT =
  'Nao foi possivel conectar ao servidor. Verifique sua conexao e tente novamente.';
const AUTH_MESSAGE_DEFAULT = 'Sua sessao expirou. Faca login novamente.';

function normalizeMessage(value: string | null | undefined): string | null {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function isLikelyNetworkError(error: Error): boolean {
  const message = error.message.toLowerCase();
  return (
    message.includes('network') ||
    message.includes('fetch') ||
    message.includes('failed to fetch') ||
    message.includes('load failed')
  );
}

export function resolveUserFacingError(
  error: unknown,
  options: UserFacingErrorOptions,
): UserFacingErrorResult {
  const validationMessage = options.validationMessage ?? options.unexpectedMessage;
  const authenticationMessage = options.authenticationMessage ?? AUTH_MESSAGE_DEFAULT;
  const forbiddenMessage = options.forbiddenMessage ?? authenticationMessage;
  const networkMessage = options.networkMessage ?? NETWORK_MESSAGE_DEFAULT;

  if (error instanceof ApiRequestError) {
    if (error.status === 0) {
      return { category: 'network', message: networkMessage };
    }

    if (error.status === 401) {
      return { category: 'authentication', message: authenticationMessage };
    }

    if (error.status === 403) {
      return { category: 'authentication', message: forbiddenMessage };
    }

    if (error.status === 400 || error.status === 409 || error.status === 413 || error.status === 422) {
      const message =
        options.allowValidationDetail === false
          ? null
          : normalizeMessage(error.details) ?? normalizeMessage(error.message);
      return { category: 'validation', message: message ?? validationMessage };
    }

    return { category: 'unexpected', message: options.unexpectedMessage };
  }

  if (error instanceof Error && isLikelyNetworkError(error)) {
    return { category: 'network', message: networkMessage };
  }

  return { category: 'unexpected', message: options.unexpectedMessage };
}
