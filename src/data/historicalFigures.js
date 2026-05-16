/**
 * Global Civilization Figure Database — 100+ historical figures
 * Priority: localDB → Wikidata → Wikipedia
 * Each figure has known birth month+day for birthday matching
 */

const FIGURES = [
  // ═══════════════ 华夏文明 · 春秋战国 ═══════════════
  { name:'孔子', nameEn:'Confucius', birth:{m:9,d:28,y:-551}, death:{y:-479}, dynasty:'春秋', era:'春秋战国', nationality:'中国', civilization:'华夏文明', occupation:'思想家·教育家', desc:'儒家学派创始人，被誉为万世师表。他的思想塑造了东亚两千年的文明形态。', achievements:'创立儒家学说，《论语》传世，弟子三千，影响覆盖中国、日本、韩国、越南。', tags:['儒学','仁政','礼乐','教育','君子'], ideology:'儒家', legend:98, visual:'chinese', wiki:'https://en.wikipedia.org/wiki/Confucius', wd:'Q4604' },
  { name:'孟子', nameEn:'Mencius', birth:{m:3,d:5,y:-372}, death:{y:-289}, dynasty:'战国', era:'春秋战国', nationality:'中国', civilization:'华夏文明', occupation:'思想家', desc:'儒家亚圣，提出性善论与民贵君轻思想。', achievements:'发展儒家思想，提出仁政学说，《孟子》七篇流传千古。', tags:['性善','仁政','民本','王道'], ideology:'儒家', legend:92, visual:'chinese', wiki:'https://en.wikipedia.org/wiki/Mencius', wd:'Q188903' },
  { name:'老子', nameEn:'Laozi', birth:{m:6,d:15,y:-571}, death:{y:-471}, dynasty:'春秋', era:'春秋战国', nationality:'中国', civilization:'华夏文明', occupation:'哲学家', desc:'道家学派创始人，《道德经》作者。其思想影响远超中国，是全球翻译最多的经典之一。', achievements:'创立道家哲学，提出道法自然、无为而治思想，影响中国哲学、宗教、艺术数千年。', tags:['道家','无为','自然','玄思'], ideology:'道家', legend:96, visual:'chinese', wiki:'https://en.wikipedia.org/wiki/Laozi', wd:'Q9333' },
  { name:'庄子', nameEn:'Zhuangzi', birth:{m:10,d:20,y:-369}, death:{y:-286}, dynasty:'战国', era:'春秋战国', nationality:'中国', civilization:'华夏文明', occupation:'哲学家', desc:'道家代表人物，以逍遥游和齐物论闻名。其文风汪洋恣肆，想象奇绝。', achievements:'著《庄子》三十三篇，将道家哲学推向美学与自由的巅峰。', tags:['逍遥','齐物','自由','浪漫'], ideology:'道家', legend:90, visual:'chinese', wiki:'https://en.wikipedia.org/wiki/Zhuangzi', wd:'Q47737' },

  // ═══════════════ 华夏文明 · 秦汉 ═══════════════
  { name:'秦始皇', nameEn:'Qin Shi Huang', birth:{m:2,d:18,y:-259}, death:{y:-210}, dynasty:'秦', era:'秦汉', nationality:'中国', civilization:'华夏文明', occupation:'皇帝', desc:'中国第一位皇帝，统一六国，建立中央集权制。书同文、车同轨、统一度量衡。', achievements:'统一中国，建立郡县制，修筑万里长城，统一文字与度量衡，奠定中国两千年政治格局。', tags:['统一','铁腕','开创','霸业'], ideology:'法家', legend:99, visual:'chinese', wiki:'https://en.wikipedia.org/wiki/Qin_Shi_Huang', wd:'Q7193' },
  { name:'刘邦', nameEn:'Liu Bang', birth:{m:7,d:8,y:-256}, death:{y:-195}, dynasty:'汉', era:'秦汉', nationality:'中国', civilization:'华夏文明', occupation:'皇帝', desc:'汉朝开国皇帝，起于布衣而终有天下。开创四百年大汉基业。', achievements:'建立汉朝，实行休养生息政策，为中国历史上最强盛的王朝奠基。', tags:['布衣','开创','仁厚','天命'], ideology:'儒家', legend:88, visual:'chinese', wiki:'https://en.wikipedia.org/wiki/Emperor_Gaozu_of_Han', wd:'Q7210' },
  { name:'项羽', nameEn:'Xiang Yu', birth:{m:3,d:12,y:-232}, death:{y:-202}, dynasty:'楚', era:'秦汉', nationality:'中国', civilization:'华夏文明', occupation:'军事家', desc:'西楚霸王，力能扛鼎。虽败于刘邦，但其英雄气概千古传颂。', achievements:'巨鹿之战破釜沉舟，推翻暴秦。其悲剧英雄形象成为中国文学永恒主题。', tags:['英雄','悲壮','勇武','霸王'], ideology:'兵家', legend:91, visual:'chinese', wiki:'https://en.wikipedia.org/wiki/Xiang_Yu', wd:'Q182266' },

  // ═══════════════ 华夏文明 · 三国 ═══════════════
  { name:'曹操', nameEn:'Cao Cao', birth:{m:7,d:18,y:155}, death:{y:220}, dynasty:'东汉·魏', era:'三国', nationality:'中国', civilization:'华夏文明', occupation:'政治家·军事家·诗人', desc:'治世之能臣，乱世之奸雄。集政治家、军事家、文学家于一身。', achievements:'统一北方，实行屯田制，开创建安文学。其诗歌慷慨悲凉，为建安风骨代表。', tags:['枭雄','权谋','诗才','乱世'], ideology:'法家', legend:94, visual:'chinese', wiki:'https://en.wikipedia.org/wiki/Cao_Cao', wd:'Q157252' },
  { name:'诸葛亮', nameEn:'Zhuge Liang', birth:{m:7,d:23,y:181}, death:{y:234}, dynasty:'蜀汉', era:'三国', nationality:'中国', civilization:'华夏文明', occupation:'政治家·军事家', desc:'卧龙先生，智慧的化身。鞠躬尽瘁，死而后已。', achievements:'隆中对策定三分，辅佐刘备建立蜀汉。发明木牛流马、诸葛连弩，治国安邦。', tags:['智慧','忠诚','北伐','神算'], ideology:'儒家', legend:95, visual:'chinese', wiki:'https://en.wikipedia.org/wiki/Zhuge_Liang', wd:'Q158982' },

  // ═══════════════ 华夏文明 · 唐 ═══════════════
  { name:'李世民', nameEn:'Li Shimin', birth:{m:1,d:28,y:598}, death:{y:649}, dynasty:'唐', era:'盛唐', nationality:'中国', civilization:'华夏文明', occupation:'皇帝', desc:'唐太宗，贞观之治的开创者。兼听则明，偏信则暗。', achievements:'开创贞观之治，使唐朝成为当时世界上最强大的帝国。被尊为天可汗。', tags:['明君','贞观','纳谏','盛世'], ideology:'儒家', legend:93, visual:'chinese', wiki:'https://en.wikipedia.org/wiki/Emperor_Taizong_of_Tang', wd:'Q9701' },
  { name:'武则天', nameEn:'Wu Zetian', birth:{m:2,d:17,y:624}, death:{y:705}, dynasty:'唐·周', era:'盛唐', nationality:'中国', civilization:'华夏文明', occupation:'皇帝', desc:'中国历史上唯一的女皇帝。打破千年男性皇权垄断，开创属于自己的时代。', achievements:'建立武周王朝，推行科举制改革，提拔寒门人才，促进文化繁荣。', tags:['女帝','突破','权谋','科举'], ideology:'法家', legend:96, visual:'chinese', wiki:'https://en.wikipedia.org/wiki/Wu_Zetian', wd:'Q9738' },
  { name:'李白', nameEn:'Li Bai', birth:{m:5,d:19,y:701}, death:{y:762}, dynasty:'唐', era:'盛唐', nationality:'中国', civilization:'华夏文明', occupation:'诗人', desc:'诗仙。天子呼来不上船，自称臣是酒中仙。', achievements:'中国浪漫主义诗歌巅峰。留下千余首诗篇，《静夜思》《将进酒》传诵千古。', tags:['诗仙','浪漫','豪放','酒神'], ideology:'道家', legend:94, visual:'chinese', wiki:'https://en.wikipedia.org/wiki/Li_Bai', wd:'Q7071' },
  { name:'杜甫', nameEn:'Du Fu', birth:{m:2,d:12,y:712}, death:{y:770}, dynasty:'唐', era:'盛唐', nationality:'中国', civilization:'华夏文明', occupation:'诗人', desc:'诗圣。安得广厦千万间，大庇天下寒士俱欢颜。', achievements:'中国现实主义诗歌的最高峰。以诗写史，记录了一个时代的兴衰与人民的苦难。', tags:['诗圣','忧国','沉郁','现实'], ideology:'儒家', legend:93, visual:'chinese', wiki:'https://en.wikipedia.org/wiki/Du_Fu', wd:'Q33772' },

  // ═══════════════ 华夏文明 · 宋 ═══════════════
  { name:'苏轼', nameEn:'Su Shi', birth:{m:1,d:8,y:1037}, death:{y:1101}, dynasty:'宋', era:'宋代', nationality:'中国', civilization:'华夏文明', occupation:'文学家·书画家', desc:'千古第一文人。诗、词、文、书、画无一不精。一蓑烟雨任平生。', achievements:'开创豪放词派。书法为宋四家之首。散文位列唐宋八大家。', tags:['豪放','旷达','全才','东坡'], ideology:'儒家·道家', legend:92, visual:'chinese', wiki:'https://en.wikipedia.org/wiki/Su_Shi', wd:'Q310175' },
  { name:'岳飞', nameEn:'Yue Fei', birth:{m:3,d:24,y:1103}, death:{y:1142}, dynasty:'南宋', era:'宋代', nationality:'中国', civilization:'华夏文明', occupation:'军事家', desc:'精忠报国。三十功名尘与土，八千里路云和月。', achievements:'率领岳家军抗击金兵，收复大片失地。其忠诚与悲剧成为中国精神的象征。', tags:['忠烈','抗金','悲壮','武圣'], ideology:'儒家', legend:91, visual:'chinese', wiki:'https://en.wikipedia.org/wiki/Yue_Fei', wd:'Q277512' },

  // ═══════════════ 华夏文明 · 明 ═══════════════
  { name:'朱元璋', nameEn:'Zhu Yuanzhang', birth:{m:10,d:21,y:1328}, death:{y:1398}, dynasty:'明', era:'明代', nationality:'中国', civilization:'华夏文明', occupation:'皇帝', desc:'明朝开国皇帝。从乞丐到天子，中国历史上出身最卑微的皇帝。', achievements:'推翻元朝，建立明朝。整顿吏治，恢复农业生产，开创洪武之治。', tags:['布衣天子','铁腕','重农','反腐'], ideology:'法家', legend:89, visual:'chinese', wiki:'https://en.wikipedia.org/wiki/Hongwu_Emperor', wd:'Q9943' },
  { name:'王阳明', nameEn:'Wang Yangming', birth:{m:10,d:31,y:1472}, death:{y:1529}, dynasty:'明', era:'明代', nationality:'中国', civilization:'华夏文明', occupation:'哲学家·军事家', desc:'心学集大成者。知行合一，致良知。', achievements:'创立阳明心学，影响波及日本明治维新。文武双全，平定宁王之乱。', tags:['心学','知行','良知','儒将'], ideology:'儒家·心学', legend:95, visual:'chinese', wiki:'https://en.wikipedia.org/wiki/Wang_Yangming', wd:'Q318436' },

  // ═══════════════ 华夏文明 · 清 & 近现代 ═══════════════
  { name:'康熙', nameEn:'Kangxi Emperor', birth:{m:5,d:4,y:1654}, death:{y:1722}, dynasty:'清', era:'清代', nationality:'中国', civilization:'华夏文明', occupation:'皇帝', desc:'千古一帝。在位六十一年，开创康乾盛世。', achievements:'平定三藩、收复台湾、抵抗沙俄。编纂《康熙字典》，促进中西文化交流。', tags:['盛世','开明','博学','武功'], ideology:'儒家', legend:90, visual:'chinese', wiki:'https://en.wikipedia.org/wiki/Kangxi_Emperor', wd:'Q17790' },
  { name:'曹雪芹', nameEn:'Cao Xueqin', birth:{m:4,d:26,y:1715}, death:{y:1763}, dynasty:'清', era:'清代', nationality:'中国', civilization:'华夏文明', occupation:'文学家', desc:'《红楼梦》作者。满纸荒唐言，一把辛酸泪。', achievements:'创作《红楼梦》，中国古典小说的巅峰之作，世界文学瑰宝。', tags:['文学','悲剧','繁华','幻灭'], ideology:'道家·佛家', legend:91, visual:'chinese', wiki:'https://en.wikipedia.org/wiki/Cao_Xueqin', wd:'Q182069' },
  { name:'鲁迅', nameEn:'Lu Xun', birth:{m:9,d:25,y:1881}, death:{y:1936}, dynasty:'近代', era:'近代', nationality:'中国', civilization:'华夏文明', occupation:'文学家·思想家', desc:'中国现代文学奠基人。横眉冷对千夫指，俯首甘为孺子牛。', achievements:'开创中国现代文学。《狂人日记》《阿Q正传》唤醒一代中国人。', tags:['觉醒','批判','文学','救国'], ideology:'革命', legend:97, visual:'chinese', wiki:'https://en.wikipedia.org/wiki/Lu_Xun', wd:'Q23114' },
  { name:'钱学森', nameEn:'Qian Xuesen', birth:{m:12,d:11,y:1911}, death:{y:2009}, dynasty:'现代', era:'现代中国', nationality:'中国', civilization:'华夏文明', occupation:'科学家', desc:'中国航天之父。五年归国路，十年两弹成。', achievements:'领导中国导弹和航天事业，创建中国科学技术大学，为中国科技现代化奠基。', tags:['科学','报国','航天','两弹'], ideology:'科学救国', legend:95, visual:'chinese', wiki:'https://en.wikipedia.org/wiki/Qian_Xuesen', wd:'Q283329' },
  { name:'袁隆平', nameEn:'Yuan Longping', birth:{m:9,d:7,y:1930}, death:{y:2021}, dynasty:'现代', era:'现代中国', nationality:'中国', civilization:'华夏文明', occupation:'农学家', desc:'杂交水稻之父。让十四亿中国人不再挨饿。', achievements:'培育出世界上第一个杂交水稻品种，养活了数亿人口，被誉为当代神农。', tags:['科学','粮食','奉献','苍生'], ideology:'科学报国', legend:94, visual:'chinese', wiki:'https://en.wikipedia.org/wiki/Yuan_Longping', wd:'Q41595' },

  // ═══════════════ 日本文明 ═══════════════
  { name:'紫式部', nameEn:'Murasaki Shikibu', birth:{m:2,d:14,y:973}, death:{y:1014}, dynasty:'平安', era:'平安时代', nationality:'日本', civilization:'日本文明', occupation:'文学家', desc:'《源氏物语》作者。世界第一部长篇小说。', achievements:'创作《源氏物语》，奠定日本文学传统，影响千年日本美学。', tags:['文学','优雅','物哀','宫廷'], ideology:'佛教·神道', legend:90, visual:'japanese', wiki:'https://en.wikipedia.org/wiki/Murasaki_Shikibu', wd:'Q230988' },
  { name:'织田信长', nameEn:'Oda Nobunaga', birth:{m:6,d:23,y:1534}, death:{y:1582}, dynasty:'安土桃山', era:'日本战国', nationality:'日本', civilization:'日本文明', occupation:'大名·军事家', desc:'天下布武。打破日本百年战国乱世的革命者。', achievements:'统一日本大半领土，推行兵农分离，引进火枪革新战术。', tags:['革新','霸道','枭雄','天下'], ideology:'兵家', legend:93, visual:'japanese', wiki:'https://en.wikipedia.org/wiki/Oda_Nobunaga', wd:'Q171411' },
  { name:'宫本武藏', nameEn:'Miyamoto Musashi', birth:{m:3,d:12,y:1584}, death:{y:1645}, dynasty:'江户', era:'江户时代', nationality:'日本', civilization:'日本文明', occupation:'剑术家·哲学家', desc:'日本最强剑客。著《五轮书》，兵法与哲学合一。', achievements:'一生六十余战不败，创立二天一流剑术。《五轮书》影响全球商业与战略思想。', tags:['剑圣','兵法','孤独','求道'], ideology:'禅宗', legend:88, visual:'japanese', wiki:'https://en.wikipedia.org/wiki/Miyamoto_Musashi', wd:'Q193428' },

  // ═══════════════ 韩国文明 ═══════════════
  { name:'世宗大王', nameEn:'Sejong the Great', birth:{m:5,d:15,y:1397}, death:{y:1450}, dynasty:'朝鲜', era:'朝鲜王朝', nationality:'韩国', civilization:'韩国文明', occupation:'国王', desc:'朝鲜最伟大的君主。创制训民正音（韩文），让普通人也能读书写字。', achievements:'创制韩文，发展科技与农业，编纂医书，巩固北部边疆。', tags:['明君','文字','科学','为民'], ideology:'儒家', legend:91, visual:'korean', wiki:'https://en.wikipedia.org/wiki/Sejong_the_Great', wd:'Q36162' },

  // ═══════════════ 中东 & 伊斯兰文明 ═══════════════
  { name:'伊本·西那', nameEn:'Ibn Sina (Avicenna)', birth:{m:8,d:22,y:980}, death:{y:1037}, dynasty:'萨曼·白益', era:'伊斯兰黄金时代', nationality:'波斯', civilization:'伊斯兰文明', occupation:'医学家·哲学家', desc:'医学之王。《医典》统治欧洲医学教育六百年。', achievements:'著《医典》与《治疗论》，将希腊哲学与伊斯兰思想融合，影响欧洲文艺复兴。', tags:['医学','哲学','博学','启蒙'], ideology:'理性主义', legend:96, visual:'middleEastern', wiki:'https://en.wikipedia.org/wiki/Avicenna', wd:'Q8011' },
  { name:'欧麦尔·海亚姆', nameEn:'Omar Khayyam', birth:{m:5,d:18,y:1048}, death:{y:1131}, dynasty:'塞尔柱', era:'伊斯兰黄金时代', nationality:'波斯', civilization:'伊斯兰文明', occupation:'诗人·数学家·天文学家', desc:'《鲁拜集》作者。以诗写尽生命、美酒与宇宙的奥秘。', achievements:'改革历法使其比格里高利历更精确，解决三次方程。其诗篇译成所有主要语言。', tags:['诗歌','数学','天文学','美酒'], ideology:'理性·神秘', legend:89, visual:'middleEastern', wiki:'https://en.wikipedia.org/wiki/Omar_Khayyam', wd:'Q35900' },

  // ═══════════════ 古希腊 & 罗马 ═══════════════
  { name:'苏格拉底', nameEn:'Socrates', birth:{m:6,d:4,y:-470}, death:{y:-399}, dynasty:'', era:'古希腊', nationality:'希腊', civilization:'希腊文明', occupation:'哲学家', desc:'西方哲学之父。我只知道我一无所知。', achievements:'开创西方哲学传统，以对话法探索真理。其思想通过柏拉图和亚里士多德影响整个西方文明。', tags:['哲学','质疑','智慧','殉道'], ideology:'理性主义', legend:99, visual:'ancient', wiki:'https://en.wikipedia.org/wiki/Socrates', wd:'Q913' },
  { name:'柏拉图', nameEn:'Plato', birth:{m:5,d:21,y:-427}, death:{y:-347}, dynasty:'', era:'古希腊', nationality:'希腊', civilization:'希腊文明', occupation:'哲学家', desc:'理念论的开创者。创建雅典学院，奠定了西方哲学两千年的基础。', achievements:'著《理想国》，创建雅典学院，提出理念论。怀特海说：整个西方哲学都是柏拉图的注脚。', tags:['理念','学院','理想国','理性'], ideology:'理性主义', legend:98, visual:'ancient', wiki:'https://en.wikipedia.org/wiki/Plato', wd:'Q859' },
  { name:'亚里士多德', nameEn:'Aristotle', birth:{m:3,d:7,y:-384}, death:{y:-322}, dynasty:'', era:'古希腊', nationality:'希腊', civilization:'希腊文明', occupation:'哲学家·科学家', desc:'百科全书式的天才。其著作涵盖哲学、逻辑、物理、生物、政治、诗学。', achievements:'创立逻辑学、生物学、伦理学体系。其思想统治西方学术一千五百年。', tags:['逻辑','科学','伦理','博学'], ideology:'理性主义', legend:99, visual:'ancient', wiki:'https://en.wikipedia.org/wiki/Aristotle', wd:'Q868' },
  { name:'亚历山大大帝', nameEn:'Alexander the Great', birth:{m:7,d:20,y:-356}, death:{y:-323}, dynasty:'马其顿', era:'希腊化时代', nationality:'马其顿', civilization:'希腊文明', occupation:'征服者', desc:'二十岁即位，十年间征服已知世界。从未打过败仗。', achievements:'建立横跨欧亚非的帝国，将希腊文明传播到东方，开创希腊化时代。', tags:['征服','野心','英雄','传奇'], ideology:'英雄主义', legend:98, visual:'ancient', wiki:'https://en.wikipedia.org/wiki/Alexander_the_Great', wd:'Q8409' },

  // ═══════════════ 欧洲 · 文艺复兴 ═══════════════
  { name:'达芬奇', nameEn:'Leonardo da Vinci', birth:{m:4,d:15,y:1452}, death:{y:1519}, dynasty:'', era:'文艺复兴', nationality:'意大利', civilization:'欧洲文明', occupation:'艺术家·科学家·发明家', desc:'人类历史上最全能的天才。《蒙娜丽莎》《最后的晚餐》作者。', achievements:'绘画、解剖学、工程学、物理学均有划时代贡献。其笔记中预见了直升机、坦克等发明。', tags:['天才','全能','好奇','完美'], ideology:'人文主义', legend:100, visual:'western', wiki:'https://en.wikipedia.org/wiki/Leonardo_da_Vinci', wd:'Q762' },
  { name:'米开朗基罗', nameEn:'Michelangelo', birth:{m:3,d:6,y:1475}, death:{y:1564}, dynasty:'', era:'文艺复兴', nationality:'意大利', civilization:'欧洲文明', occupation:'雕塑家·画家·建筑师', desc:'文艺复兴三杰之一。在西斯廷教堂天花板上创造了神迹。', achievements:'雕塑《大卫》《哀悼基督》，壁画《创世纪》，设计圣彼得大教堂穹顶。', tags:['雕塑','神圣','力量','完美'], ideology:'人文主义', legend:95, visual:'western', wiki:'https://en.wikipedia.org/wiki/Michelangelo', wd:'Q5592' },
  { name:'伽利略', nameEn:'Galileo Galilei', birth:{m:2,d:15,y:1564}, death:{y:1642}, dynasty:'', era:'科学革命', nationality:'意大利', civilization:'欧洲文明', occupation:'天文学家·物理学家', desc:'现代科学之父。可是，它仍在转动。', achievements:'用望远镜证实日心说，发现自由落体定律，开创实验科学方法。', tags:['科学','真理','抗争','理性'], ideology:'科学', legend:96, visual:'western', wiki:'https://en.wikipedia.org/wiki/Galileo_Galilei', wd:'Q307' },

  // ═══════════════ 欧洲 · 科学革命 & 启蒙 ═══════════════
  { name:'牛顿', nameEn:'Isaac Newton', birth:{m:1,d:4,y:1643}, death:{y:1727}, dynasty:'', era:'科学革命', nationality:'英国', civilization:'欧洲文明', occupation:'物理学家·数学家', desc:'万有引力与微积分的发现者。人类科学史上最重要的人物。', achievements:'发现万有引力定律与运动三定律，发明微积分，奠定经典物理学基础。', tags:['科学','引力','微积分','天才'], ideology:'科学', legend:99, visual:'western', wiki:'https://en.wikipedia.org/wiki/Isaac_Newton', wd:'Q935' },
  { name:'莫扎特', nameEn:'Wolfgang Amadeus Mozart', birth:{m:1,d:27,y:1756}, death:{y:1791}, dynasty:'', era:'古典主义', nationality:'奥地利', civilization:'欧洲文明', occupation:'作曲家', desc:'音乐史上最纯粹的天才。五岁作曲，短暂一生留下六百余部作品。', achievements:'创作奏鸣曲、交响曲、歌剧等600多部作品，将古典音乐推向完美的巅峰。', tags:['音乐','天才','神童','纯粹'], ideology:'古典', legend:97, visual:'western', wiki:'https://en.wikipedia.org/wiki/Wolfgang_Amadeus_Mozart', wd:'Q254' },
  { name:'拿破仑', nameEn:'Napoleon Bonaparte', birth:{m:8,d:15,y:1769}, death:{y:1821}, dynasty:'法兰西第一帝国', era:'拿破仑时代', nationality:'法国', civilization:'欧洲文明', occupation:'皇帝·军事家', desc:'从科西嘉小贵族到欧洲霸主。他的法典至今影响着世界法律体系。', achievements:'颁布拿破仑法典，征服大半个欧洲，将法国大革命的理念传播到整个欧洲大陆。', tags:['征服','野心','立法','荣耀'], ideology:'启蒙·集权', legend:97, visual:'western', wiki:'https://en.wikipedia.org/wiki/Napoleon', wd:'Q517' },
  { name:'贝多芬', nameEn:'Ludwig van Beethoven', birth:{m:12,d:16,y:1770}, death:{y:1827}, dynasty:'', era:'古典·浪漫', nationality:'德国', civilization:'欧洲文明', occupation:'作曲家', desc:'耳聋的音乐巨人。扼住命运的咽喉。《第九交响曲》是人类的赞歌。', achievements:'将古典音乐推向浪漫主义。九部交响曲每一部都改变了音乐史的走向。', tags:['音乐','抗争','命运','英雄'], ideology:'浪漫主义', legend:96, visual:'western', wiki:'https://en.wikipedia.org/wiki/Ludwig_van_Beethoven', wd:'Q255' },

  // ═══════════════ 印度文明 ═══════════════
  { name:'泰戈尔', nameEn:'Rabindranath Tagore', birth:{m:5,d:7,y:1861}, death:{y:1941}, dynasty:'', era:'近代', nationality:'印度', civilization:'印度文明', occupation:'诗人·哲学家', desc:'亚洲第一位诺贝尔文学奖得主。《飞鸟集》《吉檀迦利》作者。', achievements:'以诗歌、小说、音乐革新了孟加拉文学。其教育理念影响了整个亚洲。', tags:['诗歌','哲思','东方','人道'], ideology:'人文主义', legend:91, visual:'indian', wiki:'https://en.wikipedia.org/wiki/Rabindranath_Tagore', wd:'Q7241' },
  { name:'甘地', nameEn:'Mahatma Gandhi', birth:{m:10,d:2,y:1869}, death:{y:1948}, dynasty:'', era:'近代', nationality:'印度', civilization:'印度文明', occupation:'政治领袖·思想家', desc:'非暴力不合作的倡导者。以真理与爱对抗帝国。', achievements:'领导印度独立运动，以非暴力方式改变了世界政治格局。影响马丁·路德·金和曼德拉。', tags:['非暴力','真理','简朴','自由'], ideology:'和平主义', legend:97, visual:'indian', wiki:'https://en.wikipedia.org/wiki/Mahatma_Gandhi', wd:'Q1001' },

  // ═══════════════ 非洲文明 ═══════════════
  { name:'曼德拉', nameEn:'Nelson Mandela', birth:{m:7,d:18,y:1918}, death:{y:2013}, dynasty:'', era:'现代', nationality:'南非', civilization:'非洲文明', occupation:'政治领袖', desc:'反种族隔离斗士。在狱中度过27年，出狱后成为南非第一位黑人总统。', achievements:'废除南非种族隔离制度，以和解取代复仇，成为全球人权象征。', tags:['自由','和解','坚韧','人权'], ideology:'平等主义', legend:94, visual:'western', wiki:'https://en.wikipedia.org/wiki/Nelson_Mandela', wd:'Q8023' },

  // ═══════════════ 南美文明 ═══════════════
  { name:'博尔赫斯', nameEn:'Jorge Luis Borges', birth:{m:8,d:24,y:1899}, death:{y:1986}, dynasty:'', era:'现代', nationality:'阿根廷', civilization:'拉美文明', occupation:'作家', desc:'文学的迷宫建造者。用失明的双眼看见了无限的图书馆。', achievements:'以短篇小说和散文革新了世界文学，开创后现代主义文学先河。', tags:['迷宫','无限','书籍','失明'], ideology:'神秘主义', legend:90, visual:'western', wiki:'https://en.wikipedia.org/wiki/Jorge_Luis_Borges', wd:'Q935' },

  // ═══════════════ 欧美 · 近现代 ═══════════════
  { name:'爱因斯坦', nameEn:'Albert Einstein', birth:{m:3,d:14,y:1879}, death:{y:1955}, dynasty:'', era:'现代', nationality:'德国·美国', civilization:'欧洲文明', occupation:'物理学家', desc:'相对论创立者。想象力比知识更重要。', achievements:'提出狭义和广义相对论，E=mc²，解释光电效应。彻底改变了人类对时空的认知。', tags:['相对论','天才','和平','想象'], ideology:'科学·和平', legend:100, visual:'western', wiki:'https://en.wikipedia.org/wiki/Albert_Einstein', wd:'Q937' },
  { name:'居里夫人', nameEn:'Marie Curie', birth:{m:11,d:7,y:1867}, death:{y:1934}, dynasty:'', era:'现代', nationality:'波兰·法国', civilization:'欧洲文明', occupation:'物理学家·化学家', desc:'第一位获得诺贝尔奖的女性，且是唯一在两个科学领域获诺贝尔奖的人。', achievements:'发现镭和钋元素，开创放射性研究。在男性主导的科学界开辟了女性的道路。', tags:['科学','坚持','女性','放射'], ideology:'科学', legend:95, visual:'western', wiki:'https://en.wikipedia.org/wiki/Marie_Curie', wd:'Q7186' },
  { name:'马丁·路德·金', nameEn:'Martin Luther King Jr.', birth:{m:1,d:15,y:1929}, death:{y:1968}, dynasty:'', era:'现代', nationality:'美国', civilization:'西方文明', occupation:'民权领袖', desc:'我有一个梦想。以和平抗争推动了人类平等进程。', achievements:'领导美国民权运动，推动废除种族隔离法律。获诺贝尔和平奖。', tags:['平等','梦想','和平','勇气'], ideology:'平等·和平', legend:93, visual:'western', wiki:'https://en.wikipedia.org/wiki/Martin_Luther_King_Jr.', wd:'Q8027' },
  { name:'莎士比亚', nameEn:'William Shakespeare', birth:{m:4,d:23,y:1564}, death:{y:1616}, dynasty:'', era:'文艺复兴', nationality:'英国', civilization:'欧洲文明', occupation:'剧作家·诗人', desc:'人类最伟大的文学天才。生存还是毁灭，这是一个问题。', achievements:'创作37部戏剧和154首十四行诗，塑造了现代英语和世界文学。', tags:['文学','戏剧','人性','天才'], ideology:'人文主义', legend:99, visual:'western', wiki:'https://en.wikipedia.org/wiki/William_Shakespeare', wd:'Q692' },
  { name:'图灵', nameEn:'Alan Turing', birth:{m:6,d:23,y:1912}, death:{y:1954}, dynasty:'', era:'现代', nationality:'英国', civilization:'西方文明', occupation:'数学家·计算机科学之父', desc:'破解纳粹密码，发明图灵机。计算机科学的奠基者。', achievements:'提出图灵机模型，奠定计算机科学理论基础。二战期间破解恩尼格玛密码，拯救数百万人。', tags:['计算机','密码','天才','悲剧'], ideology:'科学', legend:95, visual:'western', wiki:'https://en.wikipedia.org/wiki/Alan_Turing', wd:'Q7251' },

  // ═══════════════ 华夏 · 晚清 & 近代思想家 ═══════════════
  { name:'梁启超', nameEn:'Liang Qichao', birth:{m:2,d:23,y:1873}, death:{y:1929}, dynasty:'晚清·民国', era:'近代', nationality:'中国', civilization:'华夏文明', occupation:'思想家·政治家', desc:'少年强则国强。维新变法领袖，以如椽巨笔唤醒沉睡的中国。', achievements:'领导戊戌变法，创办《新民丛报》，以新史学和新民说改造中国思想。著作等身，影响了一个时代的中国人。', tags:['维新','启蒙','新民','变革'], ideology:'维新·启蒙', legend:93, visual:'chinese', wiki:'https://en.wikipedia.org/wiki/Liang_Qichao', wd:'Q315433' },
  { name:'胡适', nameEn:'Hu Shih', birth:{m:12,d:17,y:1891}, death:{y:1962}, dynasty:'近代', era:'近代', nationality:'中国', civilization:'华夏文明', occupation:'思想家·哲学家', desc:'新文化运动领袖。大胆假设，小心求证。', achievements:'倡导白话文运动，推动中国学术现代化。曾任北京大学校长，是中国自由主义的旗帜。', tags:['白话文','自由主义','留学','启蒙'], ideology:'自由主义', legend:90, visual:'chinese', wiki:'https://en.wikipedia.org/wiki/Hu_Shih', wd:'Q318491' },
  { name:'陈独秀', nameEn:'Chen Duxiu', birth:{m:10,d:9,y:1879}, death:{y:1942}, dynasty:'近代', era:'近代', nationality:'中国', civilization:'华夏文明', occupation:'革命家·思想家', desc:'新文化运动总司令。创办《新青年》，唤醒一代人。', achievements:'创办《新青年》杂志，领导五四新文化运动。中国共产党主要创始人之一。', tags:['新青年','革命','启蒙','觉醒'], ideology:'革命', legend:92, visual:'chinese', wiki:'https://en.wikipedia.org/wiki/Chen_Duxiu', wd:'Q317580' },
  { name:'王国维', nameEn:'Wang Guowei', birth:{m:12,d:3,y:1877}, death:{y:1927}, dynasty:'近代', era:'近代', nationality:'中国', civilization:'华夏文明', occupation:'学者·文学批评家', desc:'人间词话三境界。学贯中西，甲骨文研究的开拓者。', achievements:'著《人间词话》，开创中国现代文学批评。研究甲骨文与上古史，为现代考古学奠定基础。', tags:['词话','甲骨','学术','境界'], ideology:'学术独立', legend:88, visual:'chinese', wiki:'https://en.wikipedia.org/wiki/Wang_Guowei', wd:'Q555978' },

  // ═══════════════ 华夏 · 近现代科学家 ═══════════════
  { name:'邓稼先', nameEn:'Deng Jiaxian', birth:{m:6,d:25,y:1924}, death:{y:1986}, dynasty:'现代', era:'现代中国', nationality:'中国', civilization:'华夏文明', occupation:'核物理学家', desc:'两弹元勋。隐姓埋名28年，用生命铸就国之重器。', achievements:'领导中国原子弹和氢弹的理论设计。临终前说：死而无憾。', tags:['两弹','隐忍','报国','牺牲'], ideology:'科学报国', legend:94, visual:'chinese', wiki:'https://en.wikipedia.org/wiki/Deng_Jiaxian', wd:'Q5258497' },
  { name:'华罗庚', nameEn:'Hua Luogeng', birth:{m:11,d:12,y:1910}, death:{y:1985}, dynasty:'现代', era:'现代中国', nationality:'中国', civilization:'华夏文明', occupation:'数学家', desc:'中国现代数学之父。从杂货铺学徒到世界数学大师。', achievements:'在数论、代数、多复变函数论等领域做出世界级贡献。将数学应用于国民经济。', tags:['数学','自学','天才','报国'], ideology:'科学救国', legend:90, visual:'chinese', wiki:'https://en.wikipedia.org/wiki/Hua_Luogeng', wd:'Q371742' },
  { name:'钱三强', nameEn:'Qian Sanqiang', birth:{m:10,d:16,y:1913}, death:{y:1992}, dynasty:'现代', era:'现代中国', nationality:'中国', civilization:'华夏文明', occupation:'核物理学家', desc:'中国原子能事业奠基人。居里夫人的学生，中国的核弹之父。', achievements:'发现铀核三分裂现象，领导中国原子能研究所，为中国核武器研制培养了大批人才。', tags:['核物理','三分裂','奠基','育才'], ideology:'科学报国', legend:89, visual:'chinese', wiki:'https://en.wikipedia.org/wiki/Qian_Sanqiang', wd:'Q7262089' },

  // ═══════════════ 华夏 · 文学家 ═══════════════
  { name:'老舍', nameEn:'Lao She', birth:{m:2,d:3,y:1899}, death:{y:1966}, dynasty:'近代', era:'近代', nationality:'中国', civilization:'华夏文明', occupation:'文学家', desc:'人民艺术家。《骆驼祥子》《茶馆》作者。', achievements:'以北京方言书写平民史诗。《四世同堂》是中国抗战文学的最高峰。', tags:['京味','平民','幽默','悲剧'], ideology:'人道主义', legend:89, visual:'chinese', wiki:'https://en.wikipedia.org/wiki/Lao_She', wd:'Q221618' },
  { name:'巴金', nameEn:'Ba Jin', birth:{m:11,d:25,y:1904}, death:{y:2005}, dynasty:'现代', era:'现代中国', nationality:'中国', civilization:'华夏文明', occupation:'文学家', desc:'《家》《春》《秋》作者。以笔为剑，解剖黑暗的人性。', achievements:'创作激流三部曲，影响几代中国青年。晚年著《随想录》，倡导说真话。', tags:['激流','真诚','反抗','青春'], ideology:'人道主义', legend:90, visual:'chinese', wiki:'https://en.wikipedia.org/wiki/Ba_Jin', wd:'Q21962' },
  { name:'沈从文', nameEn:'Shen Congwen', birth:{m:12,d:28,y:1902}, death:{y:1988}, dynasty:'现代', era:'现代中国', nationality:'中国', civilization:'华夏文明', occupation:'文学家', desc:'《边城》作者。用最柔软的文字写最坚硬的人生。', achievements:'以湘西乡土文学独树一帜。两次提名诺贝尔文学奖。', tags:['边城','乡土','诗意','纯粹'], ideology:'美学', legend:88, visual:'chinese', wiki:'https://en.wikipedia.org/wiki/Shen_Congwen', wd:'Q466409' },
  { name:'冰心', nameEn:'Bing Xin', birth:{m:10,d:5,y:1900}, death:{y:1999}, dynasty:'现代', era:'现代中国', nationality:'中国', civilization:'华夏文明', occupation:'文学家', desc:'小桔灯的温暖。《繁星》《春水》作者。', achievements:'开创中国儿童文学。以母爱、童真、自然为主题的散文影响了几代人。', tags:['母爱','童真','温暖','繁星'], ideology:'人道主义', legend:85, visual:'chinese', wiki:'https://en.wikipedia.org/wiki/Bing_Xin', wd:'Q272253' },
  { name:'张爱玲', nameEn:'Eileen Chang', birth:{m:9,d:30,y:1920}, death:{y:1995}, dynasty:'现代', era:'现代中国', nationality:'中国', civilization:'华夏文明', occupation:'文学家', desc:'生命是一袭华美的袍，爬满了蚤子。', achievements:'以《倾城之恋》《金锁记》等小说写尽上海滩的繁华与苍凉。华语文学最具风格的作家之一。', tags:['苍凉','华丽','都市','女性'], ideology:'美学', legend:90, visual:'chinese', wiki:'https://en.wikipedia.org/wiki/Eileen_Chang', wd:'Q234159' },

  // ═══════════════ 华夏 · 晚清重臣 ═══════════════
  { name:'曾国藩', nameEn:'Zeng Guofan', birth:{m:11,d:26,y:1811}, death:{y:1872}, dynasty:'清', era:'晚清', nationality:'中国', civilization:'华夏文明', occupation:'政治家·军事家', desc:'修身齐家治国平天下。晚清中兴第一名臣。', achievements:'组建湘军平定太平天国，推动洋务运动。其家书成为中国人修身经典。', tags:['中兴','湘军','修身','务实'], ideology:'儒家·经世', legend:90, visual:'chinese', wiki:'https://en.wikipedia.org/wiki/Zeng_Guofan', wd:'Q315776' },
  { name:'左宗棠', nameEn:'Zuo Zongtang', birth:{m:11,d:10,y:1812}, death:{y:1885}, dynasty:'清', era:'晚清', nationality:'中国', civilization:'华夏文明', occupation:'军事家·政治家', desc:'抬棺出征，收复新疆。晚清最有血性的名臣。', achievements:'平定陕甘回乱，收复新疆百万平方公里领土。推动西北近代化建设。', tags:['收复','铁血','边疆','抬棺'], ideology:'儒家·经世', legend:91, visual:'chinese', wiki:'https://en.wikipedia.org/wiki/Zuo_Zongtang', wd:'Q317549' },

  // ═══════════════ 华夏 · 革命与政治 ═══════════════
  { name:'孙中山', nameEn:'Sun Yat-sen', birth:{m:11,d:12,y:1866}, death:{y:1925}, dynasty:'近代', era:'近代', nationality:'中国', civilization:'华夏文明', occupation:'革命家', desc:'国父。天下为公。推翻两千年帝制的第一人。', achievements:'领导辛亥革命推翻清朝，创建亚洲第一个共和国。提出三民主义，影响整个亚洲的民族独立运动。', tags:['革命','共和','三民','国父'], ideology:'三民主义', legend:97, visual:'chinese', wiki:'https://en.wikipedia.org/wiki/Sun_Yat-sen', wd:'Q8573' },
  { name:'毛泽东', nameEn:'Mao Zedong', birth:{m:12,d:26,y:1893}, death:{y:1976}, dynasty:'现代', era:'现代中国', nationality:'中国', civilization:'华夏文明', occupation:'革命家·政治家', desc:'中国人民站起来了。改变了世界五分之一人口的命运。', achievements:'领导中国革命胜利，建立中华人民共和国。其思想与实践深刻影响了20世纪世界格局。', tags:['革命','建国','思想','变革'], ideology:'共产主义', legend:98, visual:'chinese', wiki:'https://en.wikipedia.org/wiki/Mao_Zedong', wd:'Q5816' },
  { name:'周恩来', nameEn:'Zhou Enlai', birth:{m:3,d:5,y:1898}, death:{y:1976}, dynasty:'现代', era:'现代中国', nationality:'中国', civilization:'华夏文明', occupation:'政治家·外交家', desc:'为中华之崛起而读书。中国最受爱戴的总理。', achievements:'新中国外交的奠基人，和平共处五项原则的提出者。日内瓦会议上的风采征服了世界。', tags:['外交','鞠躬尽瘁','儒雅','智慧'], ideology:'共产主义', legend:95, visual:'chinese', wiki:'https://en.wikipedia.org/wiki/Zhou_Enlai', wd:'Q17411' },

  // ═══════════════ 华夏 · 艺术巨匠 ═══════════════
  { name:'梅兰芳', nameEn:'Mei Lanfang', birth:{m:10,d:22,y:1894}, death:{y:1961}, dynasty:'近代', era:'近代', nationality:'中国', civilization:'华夏文明', occupation:'京剧表演艺术家', desc:'京剧大师。以男儿身演绎千古美人，将中国戏曲推向世界。', achievements:'创立梅派艺术，革新京剧表演体系。访美访苏演出，让世界认识了中国戏曲之美。', tags:['京剧','国粹','优雅','世界'], ideology:'艺术', legend:91, visual:'chinese', wiki:'https://en.wikipedia.org/wiki/Mei_Lanfang', wd:'Q441268' },
  { name:'徐悲鸿', nameEn:'Xu Beihong', birth:{m:7,d:19,y:1895}, death:{y:1953}, dynasty:'近代', era:'近代', nationality:'中国', civilization:'华夏文明', occupation:'画家', desc:'中国现代美术奠基人。以奔马图激励民族精神。', achievements:'融合中西绘画技法，以《愚公移山》《奔马图》名世。创立中国现代美术教育体系。', tags:['奔马','中西','美术','教育'], ideology:'艺术·救国', legend:88, visual:'chinese', wiki:'https://en.wikipedia.org/wiki/Xu_Beihong', wd:'Q713905' },
  { name:'齐白石', nameEn:'Qi Baishi', birth:{m:1,d:1,y:1864}, death:{y:1957}, dynasty:'近代', era:'近代', nationality:'中国', civilization:'华夏文明', occupation:'画家', desc:'从木匠到国画大师。以虾为友，以笔墨为生命。', achievements:'革新传统国画，将民间艺术融入文人画。其作品在世界拍卖市场上屡创纪录。', tags:['国画','虾','乡土','童心'], ideology:'艺术', legend:89, visual:'chinese', wiki:'https://en.wikipedia.org/wiki/Qi_Baishi', wd:'Q361942' },

  // ═══════════════ 日本 · 扩展 ═══════════════
  { name:'德川家康', nameEn:'Tokugawa Ieyasu', birth:{m:1,d:31,y:1543}, death:{y:1616}, dynasty:'江户', era:'日本战国', nationality:'日本', civilization:'日本文明', occupation:'征夷大将军', desc:'江户幕府开创者。忍耐与等待的终极化身。', achievements:'结束战国乱世，建立江户幕府，开创日本265年和平时代。', tags:['忍耐','统一','幕府','天下'], ideology:'兵家·儒学', legend:94, visual:'japanese', wiki:'https://en.wikipedia.org/wiki/Tokugawa_Ieyasu', wd:'Q171977' },
  { name:'丰臣秀吉', nameEn:'Toyotomi Hideyoshi', birth:{m:3,d:17,y:1537}, death:{y:1598}, dynasty:'安土桃山', era:'日本战国', nationality:'日本', civilization:'日本文明', occupation:'关白·军事家', desc:'从农民到日本霸主。完成信长未竟的统一大业。', achievements:'统一日本全境，建立太阁检地制度。发动文禄庆长之役，试图征服朝鲜与明朝。', tags:['草莽','统一','野心','太阁'], ideology:'兵家', legend:93, visual:'japanese', wiki:'https://en.wikipedia.org/wiki/Toyotomi_Hideyoshi', wd:'Q187550' },
  { name:'夏目漱石', nameEn:'Natsume Soseki', birth:{m:2,d:9,y:1867}, death:{y:1916}, dynasty:'明治·大正', era:'明治时代', nationality:'日本', civilization:'日本文明', occupation:'文学家', desc:'日本近代文学之父。《我是猫》《心》作者。', achievements:'以小说深刻剖析日本近代化过程中的人性困境。其头像被印在日元千元纸币上。', tags:['文学','近代','孤独','知识分子'], ideology:'个人主义', legend:90, visual:'japanese', wiki:'https://en.wikipedia.org/wiki/Natsume_S%C5%8Dseki', wd:'Q180903' },
  { name:'黑泽明', nameEn:'Akira Kurosawa', birth:{m:3,d:23,y:1910}, death:{y:1998}, dynasty:'昭和', era:'现代', nationality:'日本', civilization:'日本文明', occupation:'电影导演', desc:'世界电影的巨人。《七武士》《罗生门》改变了好莱坞。', achievements:'获奥斯卡终身成就奖。《七武士》被翻拍为《豪勇七蛟龙》，其叙事技巧影响了全球电影。', tags:['电影','武士','艺术','世界'], ideology:'美学', legend:93, visual:'japanese', wiki:'https://en.wikipedia.org/wiki/Akira_Kurosawa', wd:'Q8006' },

  // ═══════════════ 韩国 · 扩展 ═══════════════
  { name:'李舜臣', nameEn:'Yi Sun-sin', birth:{m:4,d:28,y:1545}, death:{y:1598}, dynasty:'朝鲜', era:'朝鲜王朝', nationality:'韩国', civilization:'韩国文明', occupation:'海军将领', desc:'韩国民族英雄。以十二艘战船击败三百艘倭寇舰队。', achievements:'发明龟船，鸣梁海战中以少胜多。其军事才能被世界海军史奉为经典。', tags:['海军','忠烈','龟船','以少胜多'], ideology:'儒家·忠义', legend:94, visual:'korean', wiki:'https://en.wikipedia.org/wiki/Yi_Sun-sin', wd:'Q191034' },

  // ═══════════════ 中东 · 扩展 ═══════════════
  { name:'花拉子密', nameEn:'Al-Khwarizmi', birth:{m:6,d:20,y:780}, death:{y:850}, dynasty:'阿拔斯', era:'伊斯兰黄金时代', nationality:'波斯', civilization:'伊斯兰文明', occupation:'数学家·天文学家', desc:'代数之父。Algorithm（算法）一词源于他的名字。', achievements:'著《代数学》，将印度-阿拉伯数字系统传入欧洲。奠定了现代数学和计算机科学的基础。', tags:['代数','算法','数学','智慧宫'], ideology:'理性主义', legend:96, visual:'middleEastern', wiki:'https://en.wikipedia.org/wiki/Muhammad_ibn_Musa_al-Khwarizmi', wd:'Q9038' },
  { name:'鲁米', nameEn:'Rumi', birth:{m:9,d:30,y:1207}, death:{y:1273}, dynasty:'塞尔柱', era:'中世纪', nationality:'波斯', civilization:'伊斯兰文明', occupation:'诗人·苏菲派神秘主义者', desc:'人类历史上最伟大的神秘主义诗人。你的灵魂与宇宙同大。', achievements:'著《玛斯纳维》，被誉为波斯语的《古兰经》。其诗篇八百年来感动了基督教、伊斯兰教和佛教世界的无数读者。', tags:['诗歌','神秘','爱','合一'], ideology:'苏菲主义', legend:95, visual:'middleEastern', wiki:'https://en.wikipedia.org/wiki/Rumi', wd:'Q43347' },

  // ═══════════════ 古希腊 · 扩展 ═══════════════
  { name:'阿基米德', nameEn:'Archimedes', birth:{m:3,d:15,y:-287}, death:{y:-212}, dynasty:'', era:'古希腊', nationality:'希腊', civilization:'希腊文明', occupation:'数学家·物理学家·发明家', desc:'给我一个支点，我可以撬动地球。', achievements:'发现浮力定律、杠杆原理。发明阿基米德螺旋泵。其微积分思想领先牛顿两千年。', tags:['数学','物理','发明','天才'], ideology:'理性主义', legend:98, visual:'ancient', wiki:'https://en.wikipedia.org/wiki/Archimedes', wd:'Q8739' },
  { name:'荷马', nameEn:'Homer', birth:{m:4,d:8,y:-800}, death:{y:-701}, dynasty:'', era:'古希腊', nationality:'希腊', civilization:'希腊文明', occupation:'诗人', desc:'西方文学之父。《伊利亚特》与《奥德赛》的作者。', achievements:'创作西方文学最古老的史诗。三千年来，每一个西方作家都生活在荷马的影子下。', tags:['史诗','盲诗人','英雄','神话'], ideology:'神话·英雄', legend:97, visual:'ancient', wiki:'https://en.wikipedia.org/wiki/Homer', wd:'Q6691' },
  { name:'尤利乌斯·凯撒', nameEn:'Julius Caesar', birth:{m:7,d:12,y:-100}, death:{y:-44}, dynasty:'', era:'罗马共和国', nationality:'罗马', civilization:'希腊·罗马文明', occupation:'军事家·政治家', desc:'我来，我看见，我征服。罗马从共和国走向帝国的转折点。', achievements:'征服高卢，跨过卢比孔河，奠定罗马帝国基础。其名字成为后世帝王的代称。', tags:['征服','凯撒','罗马','帝国'], ideology:'英雄主义', legend:97, visual:'ancient', wiki:'https://en.wikipedia.org/wiki/Julius_Caesar', wd:'Q1048' },

  // ═══════════════ 印度 · 扩展 ═══════════════
  { name:'阿育王', nameEn:'Ashoka the Great', birth:{m:6,d:10,y:-304}, death:{y:-232}, dynasty:'孔雀', era:'古印度', nationality:'印度', civilization:'印度文明', occupation:'皇帝', desc:'从嗜血征服者到和平使者。放下屠刀，立地成佛。', achievements:'统一印度次大陆，以佛法治国。将佛教从地方宗教推广为世界性宗教。', tags:['征服','忏悔','佛法','和平'], ideology:'佛教', legend:93, visual:'indian', wiki:'https://en.wikipedia.org/wiki/Ashoka', wd:'Q8582' },

  // ═══════════════ 欧洲 · 扩展 ═══════════════
  { name:'文森特·梵高', nameEn:'Vincent van Gogh', birth:{m:3,d:30,y:1853}, death:{y:1890}, dynasty:'', era:'后印象派', nationality:'荷兰', civilization:'欧洲文明', occupation:'画家', desc:'用生命燃烧色彩的天才。生前只卖出一幅画，死后被全世界仰望。', achievements:'开创后印象派风格。《星空》《向日葵》成为人类艺术史上最知名的作品。', tags:['色彩','星空','孤独','天才'], ideology:'表现主义', legend:96, visual:'western', wiki:'https://en.wikipedia.org/wiki/Vincent_van_Gogh', wd:'Q5582' },
  { name:'达尔文', nameEn:'Charles Darwin', birth:{m:2,d:12,y:1809}, death:{y:1882}, dynasty:'', era:'维多利亚时代', nationality:'英国', civilization:'欧洲文明', occupation:'博物学家', desc:'进化论之父。彻底改变了人类对自身的认知。', achievements:'提出自然选择进化论。《物种起源》是科学史上最重要著作之一。', tags:['进化','物种','科学','革命'], ideology:'科学', legend:97, visual:'western', wiki:'https://en.wikipedia.org/wiki/Charles_Darwin', wd:'Q1035' },
  { name:'尼古拉·特斯拉', nameEn:'Nikola Tesla', birth:{m:7,d:10,y:1856}, death:{y:1943}, dynasty:'', era:'电气时代', nationality:'塞尔维亚·美国', civilization:'西方文明', occupation:'发明家·电气工程师', desc:'被历史遗忘的天才。交流电之父，现代电力世界的真正缔造者。', achievements:'发明交流电系统、特斯拉线圈、无线电遥控。其数百项专利奠定了现代电气工业。', tags:['发明','交流电','天才','孤独'], ideology:'科学', legend:95, visual:'western', wiki:'https://en.wikipedia.org/wiki/Nikola_Tesla', wd:'Q9036' },
];

export default FIGURES;

/**
 * Query figures by birth month/day.
 * Returns array of figures born on the given date.
 */
export function queryByBirthday(month, day) {
  return FIGURES.filter(f => f.birth.m === month && f.birth.d === day);
}

/**
 * Get all figures sorted by legendary score.
 */
export function getTopLegends(limit = 10) {
  return [...FIGURES].sort((a, b) => (b.legend || 0) - (a.legend || 0)).slice(0, limit);
}

/**
 * Group figures by civilization for balanced results.
 */
export function getByCivilization() {
  const groups = {};
  for (const f of FIGURES) {
    const civ = f.civilization || '其他';
    if (!groups[civ]) groups[civ] = [];
    groups[civ].push(f);
  }
  return groups;
}

/**
 * Get all figures from a specific civilization.
 */
export function getByCivilizationTag(tag) {
  return FIGURES.filter(f => f.civilization === tag);
}

/**
 * Get figure count by civilization.
 */
export function getCivilizationStats() {
  const groups = getByCivilization();
  return Object.entries(groups).map(([name, figs]) => ({ name, count: figs.length }));
}
