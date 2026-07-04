const cache = new Map<string, Promise<any>>();
const resolved = new Map<string, any>();

export function fetchCached(url: string): Promise<any> {
  if (!cache.has(url)) {
    const p = fetch(url)
      .then(r => r.json())
      .then(data => { resolved.set(url, data); return data; })
      .catch(err => { cache.delete(url); throw err; });
    cache.set(url, p);
  }
  return cache.get(url)!;
}

// Returns data synchronously if already fetched, null otherwise.
// Use for useState initial values to skip the loading flash entirely.
export function getCached(url: string): any | null {
  return resolved.get(url) ?? null;
}

export function prefetch(url: string) {
  fetchCached(url).catch(() => {});
}