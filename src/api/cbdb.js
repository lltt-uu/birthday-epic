/**
 * CBDB + Wikidata Hybrid — Chinese Historical Figure Enrichment
 *
 * CBDB doesn't have a public REST API (only HTML web search),
 * so we use Wikidata's structured data as the primary enrichment source.
 * Wikidata has millions of Chinese historical figures with birth dates,
 * dynasty tags, and occupation classifications.
 *
 * This module:
 * 1. Queries Wikidata for Chinese figures born on a specific date
 * 2. Enriches with dynasty/era/tags
 * 3. Caches results locally
 * 4. Merges with local database
 */

const WIKIDATA_SPARQL = 'https://query.wikidata.org/sparql?format=json&query=';
const WIKIDATA_API = 'https://www.wikidata.org/w/api.php';

/** Cached queries — avoid redundant API calls */
const cache = new Map();
const CACHE_TTL = 3600000; // 1 hour

function cacheKey(month, day) {
  return `birth_${month}_${day}`;
}

function getCached(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.time > CACHE_TTL) { cache.delete(key); return null; }
  return entry.data;
}

function setCache(key, data) {
  cache.set(key, { data, time: Date.now() });
}

/**
 * Query Wikidata for Chinese historical figures born on month/day.
 * Uses SPARQL to find people with:
 * - Country of citizenship: various Chinese dynasties (Q148, Q8733, etc.)
 * - OR born in China / ancient China
 * - Has birth date matching month/day
 */
export async function queryChineseBirthdays(month, day) {
  const key = cacheKey(month, day);
  const cached = getCached(key);
  if (cached) { console.log('[CBDB] Cache hit:', cached.length); return cached; }

  const monthStr = String(month).padStart(2, '0');
  const dayStr = String(day).padStart(2, '0');

  // Wikidata SPARQL: find people with Chinese citizenship or Chinese birth place,
  // who have a known birth date matching the given month/day
  const query = `
    SELECT DISTINCT ?person ?personLabel ?birthDate ?occupationLabel ?dynastyLabel ?desc WHERE {
      ?person wdt:P31 wd:Q5;
              wdt:P569 ?birthDate.
      FILTER(SUBSTR(STR(?birthDate), 6, 5) = "${monthStr}-${dayStr}")

      # Chinese citizenship OR birth place in China OR Chinese civilization tag
      { ?person wdt:P27 wd:Q148. }           # People's Republic of China
      UNION { ?person wdt:P27 wd:Q8733. }     # ancient China / dynastic China
      UNION { ?person wdt:P19 ?birthPlace.
              ?birthPlace wdt:P17 wd:Q148. }  # born in modern China
      UNION { ?person wdt:P19 ?birthPlace.
              ?birthPlace wdt:P17 wd:Q8733. } # born in ancient China
      UNION { ?person wdt:P172 ?ethnicity.
              ?ethnicity wdt:P361 wd:Q19187. } # part of Han Chinese ethnic group

      OPTIONAL { ?person wdt:P106 ?occupation. }
      OPTIONAL { ?person wdt:P27 ?dynasty. }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "zh,en". }
      OPTIONAL {
        ?article schema:about ?person;
                 schema:isPartOf <https://zh.wikipedia.org/>;
                 schema:description ?desc.
        FILTER(LANG(?desc) = "zh")
      }
    }
    ORDER BY DESC(?birthDate)
    LIMIT 30
  `;

  try {
    const url = WIKIDATA_SPARQL + encodeURIComponent(query);
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) throw new Error(`SPARQL ${res.status}`);

    const data = await res.json();
    const bindings = data?.results?.bindings || [];

    const results = bindings.map(b => ({
      name: b.personLabel?.value || '未知',
      nameEn: '',
      year: b.birthDate?.value?.slice(0, 4) || '?',
      description: b.desc?.value || b.occupationLabel?.value || '',
      occupation: b.occupationLabel?.value || '',
      dynasty: b.dynastyLabel?.value || '',
      wikiUrl: b.person?.value || '',
      thumbnail: null,
      civilization: '华夏文明',
      era: guessChineseEra(b.birthDate?.value?.slice(0, 4) || ''),
      tags: [],
      ideology: '',
      legend: 60,
      visual: 'chinese',
      source: 'wikidata-cn',
    }));

    console.log(`[CBDB] Wikidata Chinese figures for ${month}/${day}: ${results.length}`);
    setCache(key, results);
    return results;
  } catch (err) {
    console.warn('[CBDB] Wikidata SPARQL failed:', err.message);
    return [];
  }
}

/**
 * Guess Chinese era from birth year.
 */
function guessChineseEra(yearStr) {
  const y = parseInt(yearStr);
  if (isNaN(y)) return '';
  if (y < -2000) return '上古';
  if (y < -770) return '夏商周';
  if (y < -475) return '春秋';
  if (y < -221) return '战国';
  if (y < -206) return '秦';
  if (y < 220) return '汉';
  if (y < 280) return '三国';
  if (y < 420) return '晋';
  if (y < 589) return '南北朝';
  if (y < 618) return '隋';
  if (y < 907) return '唐';
  if (y < 960) return '五代';
  if (y < 1279) return '宋';
  if (y < 1368) return '元';
  if (y < 1644) return '明';
  if (y < 1912) return '清';
  if (y < 1949) return '近代';
  return '现代';
}

/**
 * Query Wikidata mixed (all nationalities) — good for balancing results.
 */
export async function queryAllBirthdays(month, day) {
  const key = `all_${month}_${day}`;
  const cached = getCached(key);
  if (cached) { console.log('[Wikidata] Cache hit:', cached.length); return cached; }

  const monthStr = String(month).padStart(2, '0');
  const dayStr = String(day).padStart(2, '0');

  const query = `
    SELECT DISTINCT ?person ?personLabel ?birthDate ?occupationLabel ?countryLabel WHERE {
      ?person wdt:P31 wd:Q5;
              wdt:P569 ?birthDate.
      FILTER(SUBSTR(STR(?birthDate), 6, 5) = "${monthStr}-${dayStr}")
      OPTIONAL { ?person wdt:P106 ?occupation. }
      OPTIONAL { ?person wdt:P27 ?country. }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "zh,en". }
    }
    ORDER BY DESC(?birthDate)
    LIMIT 50
  `;

  try {
    const url = WIKIDATA_SPARQL + encodeURIComponent(query);
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) throw new Error(`SPARQL ${res.status}`);

    const data = await res.json();
    const bindings = data?.results?.bindings || [];

    const results = bindings.map(b => {
      const country = b.countryLabel?.value || '';
      let civ = '西方文明';
      if (/中国|中华|China|Chinese|汉|唐|宋|明|清|元|秦|晋|隋/.test(country)) civ = '华夏文明';
      else if (/日本|日本国|Japan|Japanese/.test(country)) civ = '日本文明';
      else if (/韩国|朝鲜|Korea|Korean|Joseon/.test(country)) civ = '韩国文明';
      else if (/印度|India|Indian/.test(country)) civ = '印度文明';
      else if (/希腊|Greece|Greek|罗马|Rome|Roman/.test(country)) civ = '希腊·罗马文明';
      else if (/伊朗|波斯|Persia|Iran|Arab|Saudi|伊拉克|Egypt|埃及/.test(country)) civ = '伊斯兰文明';

      return {
        name: b.personLabel?.value || '未知',
        nameEn: '',
        year: b.birthDate?.value?.slice(0, 4) || '?',
        description: b.occupationLabel?.value || '',
        occupation: b.occupationLabel?.value || '',
        dynasty: '',
        wikiUrl: b.person?.value || '',
        thumbnail: null,
        civilization: civ,
        era: '',
        tags: [],
        ideology: '',
        legend: 50,
        visual: civ === '华夏文明' ? 'chinese' : 'western',
        source: 'wikidata',
      };
    });

    console.log(`[Wikidata] All figures for ${month}/${day}: ${results.length}`);
    setCache(key, results);
    return results;
  } catch (err) {
    console.warn('[Wikidata] SPARQL failed:', err.message);
    return [];
  }
}

/**
 * Get WikiData person details by ID.
 */
export async function getPersonDetail(wikidataId) {
  const url = `${WIKIDATA_API}?action=wbgetentities&ids=${wikidataId}&props=labels|descriptions|claims&languages=zh|en&format=json&origin=*`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data?.entities?.[wikidataId] || null;
  } catch { return null; }
}

/**
 * Export cache for persistence (localStorage in browser).
 */
export function exportCache() {
  const obj = {};
  for (const [k, v] of cache) {
    obj[k] = v;
  }
  return JSON.stringify(obj);
}

export function importCache(json) {
  try {
    const obj = JSON.parse(json);
    for (const [k, v] of Object.entries(obj)) {
      cache.set(k, v);
    }
    return cache.size;
  } catch { return 0; }
}
