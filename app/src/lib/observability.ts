type Fields = Record<string, string | number | boolean | null | undefined>;

export function logOperationalEvent(
  level: "info" | "warn" | "error",
  event: string,
  fields: Fields = {},
) {
  const entry = JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    event,
    ...Object.fromEntries(Object.entries(fields).filter(([, value]) => value !== undefined)),
  });
  if (level === "error") console.error(entry);
  else if (level === "warn") console.warn(entry);
  else console.info(entry);
}

export async function observed<T>(
  operation: string,
  fields: Fields,
  work: () => Promise<T>,
): Promise<T> {
  const startedAt = Date.now();
  try {
    const result = await work();
    logOperationalEvent("info", `${operation}.completed`, { ...fields, durationMs: Date.now() - startedAt });
    return result;
  } catch (error) {
    logOperationalEvent("error", `${operation}.failed`, {
      ...fields,
      durationMs: Date.now() - startedAt,
      errorType: error instanceof Error ? error.name : "unknown",
    });
    throw error;
  }
}
