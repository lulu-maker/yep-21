export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function isLengthBetween(value: string, min: number, max: number) {
  const len = value.trim().length;
  return len >= min && len <= max;
}

export function isPasswordLengthValid(value: string, min = 8, max = 128) {
  return value.length >= min && value.length <= max;
}
