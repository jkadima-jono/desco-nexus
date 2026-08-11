export function boundedString(input: unknown, maxLength: number): string {
  return typeof input === "string" ? input.trim().slice(0, maxLength) : "";
}

export function nonNegativeFiniteNumber(input: unknown): number | null {
  return typeof input === "number" && Number.isFinite(input) ? Math.max(0, input) : null;
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
