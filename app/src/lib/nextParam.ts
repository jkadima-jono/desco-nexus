// Validates a `?next=` redirect target so /login can send users back to
// where they came from without becoming an open redirect (CWE-601).
// Every current producer of `?next=` (mandates, deals, messages, saved,
// submit-project, project/[id]) is a same-origin, server-generated path —
// this only exists to stop a crafted URL like /login?next=//evil.com or
// /login?next=https://evil.com from ever being honored.
const SAFE_PATH = /^\/[a-zA-Z0-9\-_/]+$/;

export function sanitizeNextPath(next: string | null | undefined): string {
  const fallback = "/";
  if (!next) return fallback;
  if (!next.startsWith("/")) return fallback;
  if (next.startsWith("//")) return fallback;
  if (next.includes("\\")) return fallback;
  if (!SAFE_PATH.test(next)) return fallback;
  return next;
}
