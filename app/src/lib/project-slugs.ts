const PUBLIC_TO_INTERNAL: Record<string, string> = {
  "agridesco-grand-kasai": "comicordia-agri",
};

const INTERNAL_TO_PUBLIC = Object.fromEntries(
  Object.entries(PUBLIC_TO_INTERNAL).map(([publicId, internalId]) => [internalId, publicId]),
) as Record<string, string>;

export function internalProjectId(id: string): string {
  return PUBLIC_TO_INTERNAL[id] ?? id;
}

export function publicProjectId(id: string): string {
  return INTERNAL_TO_PUBLIC[id] ?? id;
}

export function projectHref(id: string): string {
  return `/project/${publicProjectId(id)}`;
}
