export function normalizeText(value: string): string {
  return value.trim();
}

export function isRequired(value: string): boolean {
  return normalizeText(value).length > 0;
}

export function hasMinLength(value: string, min: number): boolean {
  return normalizeText(value).length >= min;
}

export function isValidEmail(value: string): boolean {
  const normalized = normalizeText(value).toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
}

export function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 13;
}

export function isValidHttpUrl(value: string): boolean {
  const normalized = normalizeText(value);
  if (!normalized) return false;

  try {
    const url = new URL(normalized);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function isValidSlug(value: string): boolean {
  const normalized = normalizeText(value);
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalized);
}

export function isValidPath(value: string): boolean {
  const normalized = normalizeText(value);
  return normalized.startsWith('/');
}
