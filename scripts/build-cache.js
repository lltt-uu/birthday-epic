/**
 * Build static Wikidata cache — pre-fetch all dates not covered by local DB.
 * Run: node scripts/build-cache.js
 * Output: public/wikidata-cache.json
 */
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const CACHE_FILE = resolve(ROOT, 'public', 'wikidata-cache.json');

// Load local figures to find covered dates
let localDates;
try {
  const mod = await import('../src/data/historicalFigures.js');
  const figs = mod.default;
  localDates = new Set(figs.map(f => `${f.birth.m}-${f.birth.d}`));
  console.log(`Local DB: ${figs.length} figures, ${localDates.size} dates covered`);
} catch {
  localDates = new Set();
}

const MISSING = [];
for (let m = 1; m <= 12; m++) {
  const maxD = [31,29,31,30,31,30,31,31,30,31,30,31][m-1];
  for (let d = 1; d <= maxD; d++) {
    if (!localDates.has(`${m}-${d}`)) {
      MISSING.push([m, d]);
    }
  }
}
console.log(`Missing dates: ${MISSING.length}`);

// Fetch Wikidata for each missing date
const SPARQL = 'https://query.wikidata.org/sparql?format=json&query=';
const cache = {};

async function fetchDate(month, day) {
  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  const query = `
    SELECT DISTINCT ?person ?personLabel ?birthDate ?occupationLabel WHERE {
      ?person wdt:P31 wd:Q5; wdt:P569 ?birthDate.
      FILTER(SUBSTR(STR(?birthDate), 6, 5) = "${mm}-${dd}")
      OPTIONAL { ?person wdt:P106 ?occupation. }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "zh,en". }
    }
    ORDER BY DESC(?birthDate) LIMIT 20
  `;
  const url = SPARQL + encodeURIComponent(query);
  try {
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const bindings = data?.results?.bindings || [];
    return bindings.map(b => ({
      name: b.personLabel?.value || '?',
      year: (b.birthDate?.value || '').slice(0, 4),
      occupation: b.occupationLabel?.value || '',
      wikiUrl: b.person?.value || '',
    }));
  } catch (err) {
    console.warn(`  Failed ${month}/${day}: ${err.message}`);
    return [];
  }
}

console.log('\nFetching Wikidata (rate-limited, ~2 req/s)...');
let done = 0;
for (const [month, day] of MISSING) {
  const figures = await fetchDate(month, day);
  if (figures.length > 0) {
    cache[`${month}-${day}`] = figures;
  }
  done++;
  if (done % 20 === 0) {
    console.log(`  ${done}/${MISSING.length} (${Object.keys(cache).length} dates with data)`);
    // Save progress every 20 requests
    writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
  }
  // Rate limit: 500ms between requests
  await new Promise(r => setTimeout(r, 500));
}

writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
console.log(`\nDone! ${Object.keys(cache).length} dates cached to ${CACHE_FILE}`);
console.log(`Total figures in cache: ${Object.values(cache).flat().length}`);
