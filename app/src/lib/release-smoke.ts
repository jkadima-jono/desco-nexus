export function canonicalFromHtml(body: string): string | null {
  return body.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i)?.[1]
    ?? body.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i)?.[1]
    ?? null;
}

export function canonicalTargetMatches(expected: URL, actual: URL): boolean {
  return expected.protocol === actual.protocol &&
    expected.hostname === actual.hostname &&
    expected.port === actual.port &&
    expected.pathname === actual.pathname &&
    expected.search === actual.search;
}
