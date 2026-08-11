export function boundedString(input: unknown, maxLength: number): string {
  return typeof input === "string" ? input.trim().slice(0, maxLength) : "";
}

export function nonNegativeFiniteNumber(input: unknown): number | null {
  return typeof input === "number" && Number.isFinite(input) ? Math.max(0, input) : null;
}

export function boundedInteger(input: unknown, minimum: number, maximum: number): number | null {
  if (typeof input !== "number" || !Number.isFinite(input)) return null;
  return Math.min(maximum, Math.max(minimum, Math.round(input)));
}

export function sanitizeStringArray(
  input: unknown,
  allowlist?: string[],
  maxLength = 80,
): string[] {
  if (!Array.isArray(input)) return [];
  const strings = input
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim().slice(0, maxLength))
    .filter(Boolean)
    .slice(0, 20);
  return allowlist ? strings.filter((value) => allowlist.includes(value)) : strings;
}
