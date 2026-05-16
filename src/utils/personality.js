/**
 * Personality Analysis Engine — supports civilization-aware analysis.
 */

const TRAITS = {
  scientist:  { cn:'探索者', traits:['理性','求知','孤独','洞察','精确'], era:'理性与发现的时代', essence:'你用逻辑之光照亮未知的深渊，在沉默中听见宇宙的回响。' },
  artist:     { cn:'创作者', traits:['敏感','创造','激情','浪漫','反叛'], era:'美与激情的时代', essence:'你的灵魂是一幅未完成的杰作，每一笔都是对世界的重新定义。' },
  leader:     { cn:'统领者', traits:['决断','远见','责任','魄力','权谋'], era:'秩序与变革的时代', essence:'历史在你身后奔涌，你的每一个选择都在改写文明的剧本。' },
  philosopher:{ cn:'觉悟者', traits:['深思','智慧','超然','辩证','内省'], era:'思想与觉悟的时代', essence:'你在时间的长河中凝望星辰，于无声处听见真理的低语。' },
  explorer:   { cn:'远征者', traits:['冒险','好奇','坚韧','开拓','自由'], era:'发现与远征的时代', essence:'地平线之外是你的归宿，未知是你的故乡。' },
  rebel:      { cn:'变革者', traits:['反叛','激情','不羁','革新','勇气'], era:'颠覆与重生的时代', essence:'你生来就是要打破规则的——旧世界的裂痕中，透出你的光芒。' },
  sage:       { cn:'圣贤', traits:['仁爱','智慧','克己','礼乐','中正'], era:'教化与立德的年代', essence:'以身为炬，照亮万世。你的存在本身就是文明的坐标。' },
  warrior:    { cn:'将星', traits:['勇武','忠诚','坚毅','牺牲','荣耀'], era:'烽火与英雄的时代', essence:'金戈铁马是你人生的底色。你用热血在历史上刻下不可磨灭的印记。' },
};

const PREFIXES = [
  '在时间的长河中，你的灵魂与这些传奇共振——',
  '星辰排列的瞬间，命运将你与这些伟大灵魂绑定——',
  '跨越世纪的共鸣，你所不知道的历史镜像——',
  '时间的河流在这一天分叉，你与这些伟大灵魂共享了起点——',
  '千万年来，这一天的星辰始终照耀着同一种灵魂——',
];

const SUFFIXES = [
  '这不是巧合。这是宇宙为你写下的注脚。',
  '命运之书翻到这一页，你的名字与他们并列。',
  '在无限的时间线中，你选择了这一天——与传奇同行。',
  '你是他们的回声，而他们是你的前奏。',
  '历史不会重复，但它会押韵。你就是那个韵脚。',
];

function classify(figure) {
  const d = (figure.description || figure.desc || '').toLowerCase();
  const t = (figure.tags || []).join(' ').toLowerCase();
  const i = (figure.ideology || '').toLowerCase();
  const text = d + t + i;

  const rules = [
    { cat:'sage', kw:['儒学','儒家','仁政','礼乐','君子','王道','教化','圣人','贤者','明君'] },
    { cat:'warrior', kw:['军事','勇武','英雄','霸王','武将','征战','抗金','忠烈','武圣','征服'] },
    { cat:'scientist', kw:['科学','医学','数学','物理','化学','生物','天文','算法','发明','航天'] },
    { cat:'artist', kw:['艺术','音乐','绘画','诗歌','文学','小说','戏剧','书法','作曲','诗'] },
    { cat:'leader', kw:['皇帝','政治','国王','总统','统治','帝国','立法','改革','权谋','霸业'] },
    { cat:'philosopher', kw:['哲学','思想家','道家','佛教','禅宗','心学','理学','形而上学'] },
    { cat:'explorer', kw:['探索','远征','发现','冒险','航海','开拓','自由'] },
    { cat:'rebel', kw:['革命','反叛','抗争','变革','革新','推翻','打破','救国','觉醒'] },
  ];

  for (const {cat, kw} of rules) {
    if (kw.some(k => text.includes(k))) return cat;
  }
  return 'scientist';
}

export function analyzePersonality(figures) {
  if (!figures || figures.length === 0) {
    return {
      era:'时间的迷雾', keywords:['神秘','独特','未知'],
      essence:'你的命运尚未被书写，而这正是你最强大的力量。',
      prefix:'时间的长河沉默不语——', suffix:'也许，你就是那个将要被后人铭记的名字。',
      mostLike:null, categories:{}, civilizationTags:[], topIdeology:'',
    };
  }

  // Classify & count
  const cats = {};
  const civs = {};
  const ideologies = {};
  for (const f of figures) {
    const cat = classify(f);
    cats[cat] = (cats[cat] || 0) + 1;
    const civ = f.civilization || '未知';
    civs[civ] = (civs[civ] || 0) + 1;
    const ideo = f.ideology || f.ideology_raw || '';
    if (ideo) ideologies[ideo] = (ideologies[ideo] || 0) + 1;
  }

  // Dominant
  const topCat = Object.entries(cats).sort((a,b) => b[1]-a[1])[0]?.[0] || 'scientist';
  const pool = TRAITS[topCat] || TRAITS.scientist;
  const topCiv = Object.entries(civs).sort((a,b) => b[1]-a[1])[0]?.[0] || '';
  const topIdeo = Object.entries(ideologies).sort((a,b) => b[1]-a[1])[0]?.[0] || '';

  // Most legendary
  const sorted = [...figures].sort((a,b) => (b.legend||0) - (a.legend||0));
  const mostLike = sorted[0] || figures[Math.floor(Math.random() * figures.length)];

  // Keywords from top 2 categories
  const allTraits = Object.entries(cats).sort((a,b) => b[1]-a[1]).slice(0,2)
    .flatMap(([c]) => TRAITS[c]?.traits || []).slice(0,5);

  // Civilization-aware era description
  let eraDesc = pool.era;
  if (topCiv === '华夏文明') eraDesc = '华夏群星闪耀时';
  else if (topCiv === '日本文明') eraDesc = '和风雅韵的时代';
  else if (topCiv === '韩国文明') eraDesc = '东方晨曦的时代';
  else if (topCiv === '伊斯兰文明') eraDesc = '黄金智慧的时代';
  else if (topCiv === '希腊文明') eraDesc = '西方文明的曙光';
  else if (topCiv === '印度文明') eraDesc = '恒河智慧的时代';

  return {
    era: eraDesc,
    keywords: [...new Set(allTraits)].slice(0,5),
    essence: pool.essence,
    prefix: PREFIXES[Math.floor(Math.random()*PREFIXES.length)],
    suffix: SUFFIXES[Math.floor(Math.random()*SUFFIXES.length)],
    mostLike,
    categories: cats,
    civilizationTags: Object.keys(civs),
    topCiv,
    topIdeo,
    topCat: pool.cn,
  };
}

export function generateShareText(birthday, mostLike) {
  if (!mostLike) return '我在时间长河中找到了自己的生日密码 🌌 #历史人格档案';
  const name = mostLike.name || '传奇人物';
  return `我与 ${name} 同一天生日 🎂 在时间的长河中，我们共享同一天降临这个世界。`;
}
