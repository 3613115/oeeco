export type CategoryId = "all" | "game" | "tool" | "story" | "visual" | "ai";

export type Creator = {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  followers: string;
};

export type Work = {
  id: string;
  title: string;
  type: string;
  category: Exclude<CategoryId, "all">;
  creatorId: string;
  creator?: Creator;
  cover: string;
  tags: string[];
  views: number;
  likes: number;
  collections: number;
  tool: string;
  createdAt: string;
  summary: string;
  detail: string;
  demoUrl?: string | null;
  comments: Array<[string, string, string]>;
  frame: "fishing" | "crm" | "story" | "garden" | "kitchen" | "clock" | "upload";
};

export const categories: Array<[CategoryId, string]> = [
  ["all", "全部作品"],
  ["game", "小游戏"],
  ["tool", "实用工具"],
  ["story", "互动网页"],
  ["visual", "视觉艺术"],
  ["ai", "AI 实验"],
];

export const categoryLabels: Record<Exclude<CategoryId, "all">, string> = {
  game: "小游戏",
  tool: "实用工具",
  story: "互动网页",
  visual: "视觉艺术",
  ai: "AI 实验",
};

export const creators: Record<string, Creator> = {
  mika: {
    id: "mika",
    name: "Mika",
    handle: "@mika",
    avatar: "/assets/avatar-mika.png",
    bio: "喜欢把小想法做成能马上玩的网页实验。",
    followers: "12.8k",
  },
  neo: {
    id: "neo",
    name: "Neo",
    handle: "@neo",
    avatar: "/assets/avatar-neo.png",
    bio: "用 Codex 做工具、小游戏和一些看起来很认真但其实很好玩的东西。",
    followers: "8.4k",
  },
  yan: {
    id: "yan",
    name: "Yan",
    handle: "@yan",
    avatar: "/assets/avatar-yan.png",
    bio: "互动叙事、视觉页面和 AI 协作流程收藏者。",
    followers: "6.1k",
  },
  sol: {
    id: "sol",
    name: "Sol",
    handle: "@sol",
    avatar: "/assets/avatar-sol.png",
    bio: "把数据可视化做得像游戏一样。",
    followers: "4.9k",
  },
};

export const works: Work[] = [
  {
    id: "pixel-fishing",
    title: "像素风钓鱼小游戏",
    type: "小游戏",
    category: "game",
    creatorId: "mika",
    cover: "/assets/cover-fishing.png",
    tags: ["Codex", "像素风", "休闲"],
    views: 24800,
    likes: 3180,
    collections: 920,
    tool: "Codex + Canvas",
    createdAt: "2026-06-02",
    summary: "三分钟一局的轻量钓鱼小游戏，鱼群、天气和道具都会影响得分。",
    detail:
      "作者用 Codex 快速搭了核心循环，再一点点调整手感、节奏和视觉细节。这个作品适合作为小游戏模板，后续可以扩展排行榜、皮肤和每日任务。",
    comments: [
      ["Neo", "/assets/avatar-neo.png", "节奏挺舒服，适合做成每日挑战。"],
      ["Yan", "/assets/avatar-yan.png", "封面和游戏气质很统一，打开就想试。"],
    ],
    frame: "fishing",
  },
  {
    id: "tiny-crm",
    title: "自由职业者客户看板",
    type: "实用工具",
    category: "tool",
    creatorId: "neo",
    cover: "/assets/cover-crm.png",
    tags: ["React", "效率", "SaaS"],
    views: 16900,
    likes: 2010,
    collections: 1340,
    tool: "Codex + Supabase",
    createdAt: "2026-06-01",
    summary: "给独立开发者和设计师用的轻量客户管理界面。",
    detail:
      "它把客户、报价、任务和回款状态压缩在一个页面里，适合高频扫描，不追求大而全。oeeco 后续可以把这类作品放进工具分类。",
    comments: [
      ["Mika", "/assets/avatar-mika.png", "这种小而准的工具特别适合 oeeco。"],
      ["Sol", "/assets/avatar-sol.png", "状态颜色很清楚，移动端也能扫。"],
    ],
    frame: "crm",
  },
  {
    id: "story-room",
    title: "会呼吸的互动故事房间",
    type: "互动网页",
    category: "story",
    creatorId: "yan",
    cover: "/assets/cover-story.png",
    tags: ["叙事", "音画", "实验"],
    views: 31200,
    likes: 4870,
    collections: 1530,
    tool: "Codex + Web Audio",
    createdAt: "2026-05-30",
    summary: "点击房间里的物件，会触发不同的微型故事片段。",
    detail:
      "这个作品适合展示 AI 辅助创作不只是在写代码，也可以把脚本、交互和视觉统一到一个小体验里。",
    comments: [
      ["Neo", "/assets/avatar-neo.png", "互动节奏很像短篇小说。"],
      ["Mika", "/assets/avatar-mika.png", "如果加存档点会更完整。"],
    ],
    frame: "story",
  },
  {
    id: "signal-garden",
    title: "数据花园可视化",
    type: "数据可视化",
    category: "visual",
    creatorId: "sol",
    cover: "/assets/cover-garden.png",
    tags: ["数据", "可视化", "Three.js"],
    views: 12400,
    likes: 1760,
    collections: 690,
    tool: "Codex + Three.js",
    createdAt: "2026-05-29",
    summary: "把网站访问数据变成一片会生长的花园。",
    detail:
      "每一朵花代表一个作品，颜色代表类型，高度代表热度。后续 oeeco 自己的数据后台也可以采用这样的展示方式。",
    comments: [
      ["Yan", "/assets/avatar-yan.png", "很适合作为创作者后台的灵感来源。"],
      ["Mika", "/assets/avatar-mika.png", "数据看起来不再像报表了。"],
    ],
    frame: "garden",
  },
  {
    id: "prompt-kitchen",
    title: "Prompt Kitchen",
    type: "AI 实验",
    category: "ai",
    creatorId: "neo",
    cover: "/assets/cover-kitchen.png",
    tags: ["Prompt", "模板", "AI"],
    views: 21600,
    likes: 2930,
    collections: 1820,
    tool: "Codex + GPT",
    createdAt: "2026-05-28",
    summary: "把常用提示词做成菜谱卡片，支持组合和复制。",
    detail:
      "它把 AI 工作流变得更可视化，适合创作者沉淀自己的制作方法。oeeco 可以鼓励作者附上创作过程。",
    comments: [
      ["Sol", "/assets/avatar-sol.png", "这个可以成为作品页面的创作说明模块。"],
      ["Yan", "/assets/avatar-yan.png", "菜谱隐喻很好懂。"],
    ],
    frame: "kitchen",
  },
  {
    id: "orbit-clock",
    title: "星轨番茄钟",
    type: "实用工具",
    category: "tool",
    creatorId: "sol",
    cover: "/assets/cover-clock.png",
    tags: ["效率", "动画", "专注"],
    views: 9800,
    likes: 1220,
    collections: 510,
    tool: "Codex + CSS",
    createdAt: "2026-05-27",
    summary: "一个用星轨表达专注进度的番茄钟。",
    detail:
      "视觉足够轻，操作足够直接，很适合移动端使用。第一版 oeeco 可以把这种作品做成精选位。",
    comments: [
      ["Mika", "/assets/avatar-mika.png", "开始按钮很克制，体验不错。"],
      ["Neo", "/assets/avatar-neo.png", "建议加专注记录。"],
    ],
    frame: "clock",
  },
];

export function getCreator(id: string) {
  return creators[id] || creators.neo;
}

export function getWorkCreator(work: Work) {
  return work.creator || getCreator(work.creatorId);
}

export function getWork(id: string) {
  return works.find((work) => work.id === id);
}

export function isCategoryId(value: string): value is Exclude<CategoryId, "all"> {
  return ["game", "tool", "story", "visual", "ai"].includes(value);
}

export function formatNumber(value: number) {
  if (value >= 10000) return `${(value / 10000).toFixed(1)}万`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return String(value);
}
