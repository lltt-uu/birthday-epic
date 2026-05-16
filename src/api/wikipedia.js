/**
 * 5-layer birthday query: LocalDB → Cache → WikidataCN → WikidataAll → Wikipedia
 * Cache: browser localStorage, survives page reloads
 * Timeout: 8s safety net in App.jsx
 */
import { queryByBirthday } from '../data/historicalFigures';
import { queryChineseBirthdays, queryAllBirthdays } from './cbdb';
import { getCachedFigures, setCachedFigures } from './cache';

const WIKI = 'https://en.wikipedia.org/api/rest_v1';

export async function fetchBornOnDate(month, day) {
  const results = [];
  const names = () => new Set(results.map(f => f.name));

  // L1: Local database (82 figures, instant)
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

  // L2: Browser cache
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

  // L3: Wikidata Chinese figures (skip if cache already covered this date)
  const cnCount = results.filter(f => f.civilization === '华夏文明').length;
  if (cnCount < 3) {
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
    } catch (e) { console.warn('[L3]', e.message); }
  } else {
    console.log(`[L3] Skip (${cnCount} CN figures already)`);
  }

  // L4: Wikidata all (skip if we have enough)
  if (results.length < 8) {
    try {
      const wdAll = await queryAllBirthdays(month, day);
      const existing = names();
      const cap = Math.max(5, 20 - results.length);
      const added = wdAll.filter(f => !existing.has(f.name)).slice(0, cap);
      results.push(...added);
      console.log(`[L4] Wikidata All: ${wdAll.length} (${added.length} added)`);
    } catch (e) { console.warn('[L4]', e.message); }
  } else {
    console.log(`[L4] Skip (${results.length} figures already)`);
  }

  // L5: Wikipedia (only if sparse)
  if (results.length < 5) {
    try {
      const url = `${WIKI}/feed/onthisday/births/${month}/${day}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const existing = names();
        for (const item of (data.births || []).slice(0, 8)) {
          if (results.length >= 15) break;
          const title = item.pages?.[0]?.title;
          if (!title || existing.has(item.text)) continue;
          try {
            const detail = await fetch(`${WIKI}/page/summary/${encodeURIComponent(title)}`).then(r => r.ok ? r.json() : null);
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
      }
      console.log(`[L5] Wikipedia: ${results.length} total after enrichment`);
    } catch (e) { console.warn('[L5]', e.message); }
  }

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
