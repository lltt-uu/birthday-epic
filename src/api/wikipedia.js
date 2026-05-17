/**
 * Birthday query: LocalDB → ExtraDB → Cache
 * External APIs are optionally tried in parallel with timeouts,
 * but local data is always sufficient for any date.
 */
import { queryByBirthday } from '../data/historicalFigures';
import { default as EXTRA_FIGURES } from '../data/historicalFiguresExtra';
import { queryChineseBirthdays, queryAllBirthdays } from './cbdb';
import { getCachedFigures, setCachedFigures } from './cache';

const WIKI = 'https://en.wikipedia.org/api/rest_v1';
const FETCH_TIMEOUT = 3000;

function fetchWithTimeout(url, timeout = FETCH_TIMEOUT) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeout);
  return fetch(url, { signal: ctrl.signal }).finally(() => clearTimeout(timer));
}

function mapFigure(f) {
  return {
    name: f.name, nameEn: f.nameEn || '',
    year: (f.birth?.y != null) ? (f.birth.y < 0 ? `${-f.birth.y} BC` : String(f.birth.y)) : '?',
    description: f.desc || '', achievements: f.achievements || '',
    thumbnail: null, wikiUrl: f.wiki || '',
    civilization: f.civilization || '', era: f.era || '', dynasty: f.dynasty || '',
    tags: f.tags || [], ideology: f.ideology || '',
    legend: f.legend || 0, visual: f.visual || 'western',
    source: f.source || 'local',
  };
}

export async function fetchBornOnDate(month, day) {
  const results = [];
  const hasName = () => new Set(results.map(f => f.name));

  // L1: Main local DB
  const local = queryByBirthday(month, day).map(mapFigure);
  results.push(...local);
  console.log('[L1] Local:', local.length);

  // L2: Extra DB (366 days covered)
  const extra = EXTRA_FIGURES
    .filter(f => f.birth.m === month && f.birth.d === day)
    .map(mapFigure)
    .filter(f => !hasName().has(f.name));
  results.push(...extra);
  console.log('[L2] Extra:', extra.length);

  // L3: Browser cache
  const cached = await getCachedFigures(month, day);
  if (cached && cached.length) {
    const added = cached.filter(f => !hasName().has(f.name)).map(f => ({
      name: f.name, nameEn: '', year: f.year || '?',
      description: f.occupation || '', achievements: '',
      thumbnail: null, wikiUrl: f.wikiUrl || '',
      civilization: '华夏文明', era: '', dynasty: '', tags: [], ideology: '',
      legend: 50, visual: 'chinese', source: 'cache',
    }));
    results.push(...added);
    console.log('[L3] Cache:', cached.length, '(' + added.length + ' new)');
  }

  // L4-L5: External APIs in parallel (non-blocking, just enrich if available)
  const promises = [];
  const cnCount = results.filter(f => f.civilization === '华夏文明').length;

  if (cnCount < 3) {
    promises.push((async () => {
      try {
        const wdCN = await queryChineseBirthdays(month, day);
        const existing = hasName();
        const added = wdCN.filter(f => !existing.has(f.name));
        results.push(...added);
        console.log('[L4] Wikidata CN:', wdCN.length, '(' + added.length + ' new)');
        if (wdCN.length) setCachedFigures(month, day, wdCN.map(f => ({
          name: f.name, year: f.year, occupation: f.occupation || f.description, wikiUrl: f.wikiUrl,
        })));
      } catch (e) { console.warn('[L4] Skipped:', e.message); }
    })());
  }

  if (results.length < 5) {
    promises.push((async () => {
      try {
        const wdAll = await queryAllBirthdays(month, day);
        const existing = hasName();
        const cap = Math.max(5, 20 - results.length);
        const added = wdAll.filter(f => !existing.has(f.name)).slice(0, cap);
        results.push(...added);
        console.log('[L5] Wikidata All:', wdAll.length, '(' + added.length + ' new)');
      } catch (e) { console.warn('[L5] Skipped:', e.message); }
    })());

    promises.push((async () => {
      try {
        const url = `${WIKI}/feed/onthisday/births/${month}/${day}`;
        const res = await fetchWithTimeout(url);
        if (!res.ok) throw new Error('Wikipedia ' + res.status);
        const data = await res.json();
        const existing = hasName();
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
        console.log('[L6] Wikipedia enriched:', results.length, 'total');
      } catch (e) { console.warn('[L6] Skipped:', e.message); }
    })());
  }

  if (promises.length) {
    await Promise.allSettled(promises);
  }

  results.sort((a, b) => {
    if (b.legend !== a.legend) return b.legend - a.legend;
    return (parseInt(a.year) || 0) - (parseInt(b.year) || 0);
  });

  console.log('[Done]', results.length, 'figures for', month + '/' + day);
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
