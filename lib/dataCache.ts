const cache = new Map<string, Promise<any>>();
 
export function fetchCached(url: string): Promise<any> {
  if (!cache.has(url)) {
    const p = fetch(url).then(r => r.json()).catch(err => { cache.delete(url); throw err; });
    cache.set(url, p);
  }
  return cache.get(url)!;
}
 
export function prefetch(url: string) {
  fetchCached(url).catch(() => {});
}
 
