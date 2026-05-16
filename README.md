# 历史人格档案 | Historical Resonance Archive

输入你的出生日期，在时间长河中寻找与你共享同一天诞生的历史传奇人物。

## 技术栈
- **React 18** + Vite
- **TailwindCSS 3** — 黑金深空UI
- **Framer Motion 11** — 全站动画
- **Wikipedia REST API** — 真实历史人物数据
- **Wikidata SPARQL** — 备用数据源

## 快速开始

```bash
npm install
npm run dev
```

浏览器打开 `http://localhost:3000`

## 功能

1. 输入出生日期 → 扫描时间长河
2. 自动查询 Wikipedia: 同一天出生的历史人物
3. AI 人格分析: 生成共鸣报告、时代气质、人格关键词
4. 历史时间轴: 按年代展示人物卡片
5. 点击展开详情 + Wikipedia 链接
6. 分享功能: 一键复制 "我与XXX同一天生日"

## 项目结构

```
birthday-epic/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx
    ├── App.jsx              # 状态机: INPUT → SCANNING → RESULT
    ├── index.css
    ├── api/
    │   └── wikipedia.js     # Wikipedia + Wikidata API
    ├── utils/
    │   └── personality.js   # AI人格分析引擎
    └── components/
        ├── StarBackground.jsx   # Canvas星空
        ├── ParticleField.jsx    # 粒子漂浮
        ├── BirthdayInput.jsx    # 日期输入UI
        ├── ScanningScreen.jsx   # 扫描动画
        └── ResultView.jsx       # 结果展示(报告+时间轴+卡片)
```

## API说明

- `fetchBornOnDate(month, day)` — 查询指定日期出生的历史人物
- Wikipedia API 失败时自动回退到 Wikidata SPARQL
- 所有API公开免费，无需密钥
