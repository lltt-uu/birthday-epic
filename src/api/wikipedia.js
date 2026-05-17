/**
 * 5-layer birthday query: LocalDB → Cache → WikidataCN → WikidataAll → Wikipedia
 * Cache: browser localStorage, survives page reloads
 * All external fetches run in parallel with per-request timeouts.
 */
import { queryByBirthday } from '../data/historicalFigures';
import { queryChineseBirthdays, queryAllBirthdays } from './cbdb';
import { getCachedFigures, setCachedFigures } from './cache';

const WIKI = 'https://en.wikipedia.org/api/rest_v1';
const FETCH_TIMEOUT = 4000; // per-request timeout in ms

function fetchWithTimeout(url, timeout = FETCH_TIMEOUT) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeout);
  return fetch(url, { signal: ctrl.signal }).finally(() => clearTimeout(timer));
}

export async function fetchBornOnDate(month, day) {
  const results = [];
  const names = () => new Set(results.map(f => f.name));

  // ── L1: Local database (instant, always works) ──
  const local = queryByBirthday(month, day).map(f => ({
    name: f.name, nameEn: f.nameEn || '',
    year: f.birth.y < 0 ? `${-f.birth.y} BC` : String(f.birth.y),
    description: f.desc || '', achievements: f.achievements || '',
    thumbnail: null, wikiUrl: f.wiki || '',
    civilization: f.civilization || '', era: f.era || '', dynasty: f.dynasty || '',
    tags: f.tags || [], ideology: f.ideology || '',
    legend: f.legend || 0, visual: f.visual || 'western', source: 'local',
  }));
  results.push(...local);
  console.log(`[L1] Local: ${local.length}`);

  // ── L2: Browser cache ──
  const cached = await getCachedFigures(month, day);
  if (cached && cached.length) {
    const existing = names();
    const added = cached.filter(f => !existing.has(f.name)).map(f => ({
      name: f.name, nameEn: '', year: f.year || '?',
      description: f.occupation || '', achievements: '',
      thumbnail: null, wikiUrl: f.wikiUrl || '',
      civilization: '华夏文明', era: '', dynasty: '', tags: [], ideology: '',
      legend: 50, visual: 'chinese', source: 'cache',
    }));
    results.push(...added);
    console.log(`[L2] Cache: ${cached.length} (${added.length} new)`);
  }

  // ── L3/L4/L5: External APIs — all in parallel ──
  const cnCount = results.filter(f => f.civilization === '华夏文明').length;
  const promises = [];

  // L3: Wikidata Chinese
  if (cnCount < 3) {
    promises.push((async () => {
      try {
        const wdCN = await queryChineseBirthdays(month, day);
        const existing = names();
        const added = wdCN.filter(f => !existing.has(f.name));
        results.push(...added);
        console.log(`[L3] Wikidata CN: ${wdCN.length} (${added.length} new)`);
        if (wdCN.length) {
          setCachedFigures(month, day, wdCN.map(f => ({
            name: f.name, year: f.year, occupation: f.occupation || f.description, wikiUrl: f.wikiUrl,
          })));
        }
        return { ok: true, source: 'wikidata-cn', count: wdCN.length };
      } catch (e) { console.warn('[L3] Skipped:', e.message); return { ok: false, source: 'wikidata-cn' }; }
    })());
  }

  // L4: Wikidata All (if still sparse)
  if (results.length < 8) {
    promises.push((async () => {
      try {
        const wdAll = await queryAllBirthdays(month, day);
        const existing = names();
        const cap = Math.max(5, 20 - results.length);
        const added = wdAll.filter(f => !existing.has(f.name)).slice(0, cap);
        results.push(...added);
        console.log(`[L4] Wikidata All: ${wdAll.length} (${added.length} added)`);
        return { ok: true, source: 'wikidata-all', count: wdAll.length };
      } catch (e) { console.warn('[L4] Skipped:', e.message); return { ok: false, source: 'wikidata-all' }; }
    })());
  }

  // L5: Wikipedia (only if still sparse)
  if (results.length < 5) {
    promises.push((async () => {
      try {
        const url = `${WIKI}/feed/onthisday/births/${month}/${day}`;
        const res = await fetchWithTimeout(url);
        if (!res.ok) throw new Error(`Wikipedia ${res.status}`);
        const data = await res.json();
        const existing = names();
        for (const item of (data.births || []).slice(0, 8)) {
          if (results.length >= 15) break;
          const title = item.pages?.[0]?.title;
          if (!title || existing.has(item.text)) continue;
          try {
            const detail = await fetchWithTimeout(`${WIKI}/page/summary/${encodeURIComponent(title)}`)
              .then(r => r.ok ? r.json() : null);
            results.push({
              name: item.text, nameEn: '', year: item.year || '?',
              description: detail?.extract || '', achievements: '',
              thumbnail: detail?.thumbnail?.source || null,
              wikiUrl: detail?.content_urls?.desktop?.page || '',
              civilization: guessCiv(item.text, detail?.extract || ''),
              era: '', dynasty: '', tags: [], ideology: '',
              legend: 45, visual: 'western', source: 'wikipedia',
            });
          } catch {}
        }
        console.log(`[L5] Wikipedia: ${results.length} total after enrichment`);
        return { ok: true, source: 'wikipedia' };
      } catch (e) { console.warn('[L5] Skipped:', e.message); return { ok: false, source: 'wikipedia' }; }
    })());
  }

  // Wait for all external requests to settle (max ~4s with per-request timeouts)
  if (promises.length) {
    await Promise.allSettled(promises);
  }

  // Sort: legend desc, then year asc
  results.sort((a, b) => {
    if (b.legend !== a.legend) return b.legend - a.legend;
    return (parseInt(a.year) || 0) - (parseInt(b.year) || 0);
  });

  console.log(`[Done] ${results.length} figures for ${month}/${day}`);
  return results;
}

function guessCiv(name, desc) {
  const t = (name + desc).toLowerCase();
  if (/china|chinese|qing|ming|tang|song|han|yuan/.test(t)) return '华夏文明';
  if (/japan|japanese/.test(t)) return '日本文明';
  if (/korea|korean/.test(t)) return '韩国文明';
  if (/india|indian/.test(t)) return '印度文明';
  if (/persia|iran|islam|arab/.test(t)) return '伊斯兰文明';
  if (/greece|greek|rome|roman/.test(t)) return '希腊·罗马文明';
  return '西方文明';
}

export { fetchWithTimeout };
