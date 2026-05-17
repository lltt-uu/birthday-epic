/**
 * Birthday query — local-first, no dependency on foreign APIs.
 * 448 figures cover every calendar date (366/366).
 * zh.wikipedia.org is tried as optional enrichment only.
 */
import { queryByBirthday } from '../data/historicalFigures';
import { default as EXTRA_FIGURES } from '../data/historicalFiguresExtra';
import { getCachedFigures, setCachedFigures } from './cache';

const ZH_WIKI = 'https://zh.wikipedia.org/api/rest_v1';
const FETCH_TIMEOUT = 2500;

function fetchWithTimeout(url, timeout = FETCH_TIMEOUT) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeout);
  return fetch(url, { signal: ctrl.signal }).finally(() => clearTimeout(timer));
}

function mapFigure(f, source = 'local') {
  return {
    name: f.name, nameEn: f.nameEn || '',
    year: (f.birth?.y != null)
      ? (f.birth.y < 0 ? `${-f.birth.y} BC` : String(f.birth.y))
      : '?',
    description: f.desc || '', achievements: f.achievements || '',
    thumbnail: null, wikiUrl: f.wiki || '',
    civilization: f.civilization || '', era: f.era || '',
    dynasty: f.dynasty || '', tags: f.tags || [],
    ideology: f.ideology || '', legend: f.legend || 0,
    visual: f.visual || 'western', source,
  };
}

export async function fetchBornOnDate(month, day) {
  const results = [];
  const hasName = () => new Set(results.map(f => f.name));

  // L1: Main DB (82 figures)
  const local = queryByBirthday(month, day).map(f => mapFigure(f, 'local'));
  results.push(...local);
  console.log('[L1] Local:', local.length);

  // L2: Extra DB (366 additional figures — every date covered)
  const extra = EXTRA_FIGURES
    .filter(f => f.birth.m === month && f.birth.d === day)
    .map(f => mapFigure(f, 'local'))
    .filter(f => !hasName().has(f.name));
  results.push(...extra);
  console.log('[L2] Extra:', extra.length, '→ total', results.length);

  // L3: localStorage cache
  const cached = await getCachedFigures(month, day);
  if (cached && cached.length) {
    const added = cached.filter(f => !hasName().has(f.name)).map(f => ({
      name: f.name, nameEn: '', year: f.year || '?',
      description: f.occupation || '', achievements: '',
      thumbnail: null, wikiUrl: f.wikiUrl || '',
      civilization: '华夏文明', era: '', dynasty: '',
      tags: [], ideology: '', legend: 50, visual: 'chinese',
      source: 'cache',
    }));
    results.push(...added);
    console.log('[L3] Cache:', added.length, 'new');
  }

  // L4: zh.wikipedia.org (domestic, may be accessible)
  if (results.length < 5) {
    try {
      const url = `${ZH_WIKI}/feed/onthisday/births/${month}/${day}`;
      const res = await fetchWithTimeout(url);
      if (res.ok) {
        const data = await res.json();
        const existing = hasName();
        for (const item of (data.births || []).slice(0, 8)) {
          if (results.length >= 15) break;
          const title = item.pages?.[0]?.title;
          if (!title || existing.has(item.text)) continue;
          try {
            const detail = await fetchWithTimeout(
              `${ZH_WIKI}/page/summary/${encodeURIComponent(title)}`
            ).then(r => r.ok ? r.json() : null);
            results.push({
              name: item.text, nameEn: '', year: item.year || '?',
              description: detail?.extract || '', achievements: '',
              thumbnail: detail?.thumbnail?.source || null,
              wikiUrl: detail?.content_urls?.desktop?.page || '',
              civilization: guessCiv(item.text, detail?.extract || ''),
              era: '', dynasty: '', tags: [], ideology: '',
              legend: 45, visual: 'western', source: 'zh-wiki',
            });
          } catch { /* skip this figure */ }
        }
        console.log('[L4] zh-wiki enriched:', results.length, 'total');
      }
    } catch (e) { console.warn('[L4] zh-wiki skipped:', e.message); }
  }

  // Sort by legend desc, then year asc
  results.sort((a, b) => {
    if (b.legend !== a.legend) return b.legend - a.legend;
    return (parseInt(a.year) || 0) - (parseInt(b.year) || 0);
  });

  console.log('[Done]', results.length, 'figures for', month + '/' + day);
  return results;
}

function guessCiv(name, desc) {
  const t = (name + desc).toLowerCase();
  if (/china|chinese|中国|中华|汉|唐|宋|明|清|元|秦|隋/.test(t)) return '华夏文明';
  if (/japan|japanese|日本/.test(t)) return '日本文明';
  if (/korea|korean|韩国|朝鲜/.test(t)) return '韩国文明';
  if (/india|indian|印度/.test(t)) return '印度文明';
  if (/persia|iran|islam|arab|波斯|伊朗|阿拉伯/.test(t)) return '伊斯兰文明';
  if (/greece|greek|rome|roman|希腊|罗马/.test(t)) return '希腊·罗马文明';
  return '西方文明';
}
