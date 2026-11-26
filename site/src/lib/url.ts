const BASE = ((import.meta as ImportMeta & { env?: { BASE_URL?: string } }).env?.BASE_URL ?? '/').replace(/\/$/, '');

/** Prefixes a root-relative path with the deploy base (e.g. /royal-bees-site on GitHub Pages, nothing on the real domain). */
export function u(path: string): string {
  return path.startsWith('/') && !path.startsWith('//') ? BASE + path : path;
}
