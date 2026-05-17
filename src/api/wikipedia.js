/**
 * Birthday query:
 *   L1: Main local DB (82 figures)
 *   L2: Extra local DB (367 figures, 366/366 dates)
 *   L3: localStorage cache
 *   L4: zh.wikipedia.org — verified data for the queried date
 */
import { queryByBirthday } from '../data/historicalFigures';
import { default as EXTRA_FIGURES } from '../data/historicalFiguresExtra';
import { getCachedFigures, setCachedFigures } from './cache';

const ZH_WIKI = 'https://zh.wikipedia.org/api/rest_v1';
const FETCH_TIMEOUT = 4000;

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

  // L1: Main DB
  results.push(...queryByBirthday(month, day).map(f => mapFigure(f, 'local')));
  console.log('[L1] Main DB:', results.length);

  // L2: Extra DB
  const extra = EXTRA_FIGURES
    .filter(f => f.birth.m === month && f.birth.d === day)
    .map(f => mapFigure(f, 'local'))
    .filter(f => !hasName().has(f.name));
  results.push(...extra);
  console.log('[L2] Extra DB: +' + extra.length + ' = ' + results.length);

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
    console.log('[L3] Cache: +' + added.length);
  }

  // L4: zh.wikipedia.org — verified on-this-day births
  try {
    const url = `${ZH_WIKI}/feed/onthisday/births/${month}/${day}`;
    const res = await fetchWithTimeout(url);
    if (res.ok) {
      const data = await res.json();
      const existing = hasName();
      const wikiItems = (data.births || [])
        .filter(b => b.year != null && b.text)
        .slice(0, 30);

      for (const item of wikiItems) {
        const title = item.pages?.[0]?.title;
        const wikiUrl = item.pages?.[0]?.content_urls?.desktop?.page || '';
        if (existing.has(item.text)) continue;

        // Quick summary fetch (non-blocking if fails)
        let desc = '', thumbnail = null;
        if (title) {
          try {
            const detail = await fetchWithTimeout(
              `${ZH_WIKI}/page/summary/${encodeURIComponent(title)}`,
              2000
            ).then(r => r.ok ? r.json() : null);
            if (detail) {
              desc = detail.extract || '';
              thumbnail = detail.thumbnail?.source || null;
            }
          } catch { /* skip summary */ }
        }

        results.push({
          name: item.text, nameEn: '', year: String(item.year),
          description: desc.slice(0, 200), achievements: '',
          thumbnail, wikiUrl,
          civilization: guessCiv(item.text, desc),
          era: '', dynasty: '', tags: [],
          ideology: '', legend: 40, visual: 'western',
          source: 'zh-wiki',
        });
      }
      console.log('[L4] zh-wiki: ' + wikiItems.length + ' items, total ' + results.length);
    }
  } catch (e) { console.warn('[L4] zh-wiki skipped:', e.message); }

  // Sort by source priority + legend
  results.sort((a, b) => {
    const srcOrder = { local: 0, cache: 1, 'zh-wiki': 2 };
    const sa = srcOrder[a.source] ?? 3;
    const sb = srcOrder[b.source] ?? 3;
    if (sa !== sb) return sa - sb;
    return (b.legend || 0) - (a.legend || 0);
  });

  console.log('[Done] ' + results.length + ' figures for ' + month + '/' + day);
  return results;
}

function guessCiv(name, desc) {
  const t = (name + desc);
  if (/中国|中华|汉|唐|宋|明|清|元|秦|隋|华夏|中原/.test(t)) return '华夏文明';
  if (/日本|和|Japan|Japanese/.test(t)) return '日本文明';
  if (/韩国|朝鲜|Korea|Korean|Joseon/.test(t)) return '韩国文明';
  if (/印度|India|Indian/.test(t)) return '印度文明';
  if (/波斯|伊朗|Iran|Arab|Saudi|伊拉克|埃及|Islam|伊斯兰/.test(t)) return '伊斯兰文明';
  if (/希腊|Greece|Greek|罗马|Rome|Roman/.test(t)) return '希腊·罗马文明';
  return '西方文明';
}
