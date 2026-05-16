/**
 * Browser-side persistent cache for Wikidata results.
 * Saves to localStorage so repeated birthday queries are instant.
 * Cache is also pre-seeded with a static JSON file for common dates.
 */

const STORAGE_KEY = 'birthday_epic_cache';
const STATIC_CACHE_URL = '/wikidata-cache.json';

let memoryCache = {};
let staticCache = {};
let loaded = false;

/** Load static cache + localStorage on first call. */
async function ensureLoaded() {
  if (loaded) return;
  loaded = true;

  // 1. Load pre-built static cache
  try {
    const res = await fetch(STATIC_CACHE_URL);
    if (res.ok) {
      staticCache = await res.json();
      console.log(`[Cache] Static: ${Object.keys(staticCache).length} dates loaded`);
    }
  } catch { /* file doesn't exist yet */ }

  // 2. Load localStorage cache
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      memoryCache = JSON.parse(raw);
      console.log(`[Cache] Local: ${Object.keys(memoryCache).length} dates`);
    }
  } catch { /* corrupted or empty */ }

  // 3. Merge static into memory (static wins if conflict)
  for (const [k, v] of Object.entries(staticCache)) {
    if (!memoryCache[k]) memoryCache[k] = v;
  }
}

export async function getCachedFigures(month, day) {
  await ensureLoaded();
  const key = `${month}-${day}`;
  const figures = memoryCache[key] || staticCache[key] || null;
  if (figures) {
    console.log(`[Cache] Hit for ${month}/${day}: ${figures.length} figures`);
    return figures;
  }
  return null;
}

export async function setCachedFigures(month, day, figures) {
  await ensureLoaded();
  const key = `${month}-${day}`;
  memoryCache[key] = figures.slice(0, 20); // Keep max 20 per date

  // Persist to localStorage
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryCache));
  } catch { /* quota exceeded, ignore */ }
}

export function getCacheStats() {
  const memKeys = Object.keys(memoryCache);
  const staticKeys = Object.keys(staticCache);
  const totalKeys = new Set([...memKeys, ...staticKeys]);
  return {
    memoryDates: memKeys.length,
    staticDates: staticKeys.length,
    totalDates: totalKeys.size,
    totalFigures: [...totalKeys].reduce((sum, k) =>
      sum + (memoryCache[k] || staticCache[k] || []).length, 0),
  };
}
