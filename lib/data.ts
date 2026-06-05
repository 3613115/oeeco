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
  curation?: WorkCuration;
  comments: Array<[string, string, string]>;
  frame: "fishing" | "crm" | "story" | "garden" | "kitchen" | "clock" | "upload";
};

export type WorkCuration = {
  featured: boolean;
  rank: number | null;
  label: string | null;
};

export const categories: Array<[CategoryId, string]> = [
  ["all", "All Works"],
  ["game", "Games"],
  ["tool", "Tools"],
  ["story", "Interactive"],
  ["visual", "Visual"],
  ["ai", "AI Experiments"],
];

export const categoryLabels: Record<Exclude<CategoryId, "all">, string> = {
  game: "Game",
  tool: "Tool",
  story: "Interactive",
  visual: "Visual",
  ai: "AI Experiment",
};

export const creators: Record<string, Creator> = {
  mika: {
    id: "mika",
    name: "Mika",
    handle: "@mika",
    avatar: "/assets/avatar-mika.png",
    bio: "Turns tiny ideas into web experiments people can play with right away.",
    followers: "12.8k",
  },
  neo: {
    id: "neo",
    name: "Neo",
    handle: "@neo",
    avatar: "/assets/avatar-neo.png",
    bio: "Builds useful tools, small games, and playful systems with Codex.",
    followers: "8.4k",
  },
  yan: {
    id: "yan",
    name: "Yan",
    handle: "@yan",
    avatar: "/assets/avatar-yan.png",
    bio: "Collects interactive stories, visual pages, and AI-assisted workflows.",
    followers: "6.1k",
  },
  sol: {
    id: "sol",
    name: "Sol",
    handle: "@sol",
    avatar: "/assets/avatar-sol.png",
    bio: "Makes data visualization feel as direct and playful as a game.",
    followers: "4.9k",
  },
};

export const works: Work[] = [
  {
    id: "pixel-fishing",
    title: "Pixel Fishing",
    type: "Game",
    category: "game",
    creatorId: "mika",
    cover: "/assets/cover-fishing.png",
    tags: ["Codex", "Pixel Art", "Casual"],
    views: 24800,
    likes: 3180,
    collections: 920,
    tool: "Codex + Canvas",
    createdAt: "2026-06-02",
    summary: "A lightweight three-minute fishing game shaped by weather, fish behavior, and gear.",
    detail:
      "The creator used Codex to sketch the core loop, then tuned the controls, pacing, and visual details. It works well as a small game template that could later grow into leaderboards, skins, and daily quests.",
    comments: [
      ["Neo", "/assets/avatar-neo.png", "The pacing feels easy to return to every day."],
      ["Yan", "/assets/avatar-yan.png", "The cover and the game mood match beautifully."],
    ],
    frame: "fishing",
  },
  {
    id: "tiny-crm",
    title: "Tiny Client Board",
    type: "Tool",
    category: "tool",
    creatorId: "neo",
    cover: "/assets/cover-crm.png",
    tags: ["React", "Productivity", "SaaS"],
    views: 16900,
    likes: 2010,
    collections: 1340,
    tool: "Codex + Supabase",
    createdAt: "2026-06-01",
    summary: "A focused client-management board for freelancers, designers, and indie builders.",
    detail:
      "It compresses clients, quotes, tasks, and payment status into one scan-friendly surface. It does not try to become a giant CRM; it stays compact, fast, and useful.",
    comments: [
      ["Mika", "/assets/avatar-mika.png", "This is exactly the kind of sharp little tool oeeco should surface."],
      ["Sol", "/assets/avatar-sol.png", "The status colors are clear, even on mobile."],
    ],
    frame: "crm",
  },
  {
    id: "story-room",
    title: "Breathing Story Room",
    type: "Interactive",
    category: "story",
    creatorId: "yan",
    cover: "/assets/cover-story.png",
    tags: ["Narrative", "Audio", "Experiment"],
    views: 31200,
    likes: 4870,
    collections: 1530,
    tool: "Codex + Web Audio",
    createdAt: "2026-05-30",
    summary: "Click objects in a quiet room to reveal small story fragments.",
    detail:
      "This piece shows that AI-assisted creation is not only about code. It brings script, interaction, sound, and visual rhythm into one small experience.",
    comments: [
      ["Neo", "/assets/avatar-neo.png", "The interaction rhythm feels like a short story."],
      ["Mika", "/assets/avatar-mika.png", "A few save points would make it feel even more complete."],
    ],
    frame: "story",
  },
  {
    id: "signal-garden",
    title: "Signal Garden",
    type: "Visual",
    category: "visual",
    creatorId: "sol",
    cover: "/assets/cover-garden.png",
    tags: ["Data", "Visualization", "Three.js"],
    views: 12400,
    likes: 1760,
    collections: 690,
    tool: "Codex + Three.js",
    createdAt: "2026-05-29",
    summary: "A web analytics garden where each plant represents a creative work.",
    detail:
      "Each flower maps to a work, while color, height, and growth show category and momentum. The same idea could later power oeeco creator analytics.",
    comments: [
      ["Yan", "/assets/avatar-yan.png", "This would be a lovely direction for a creator dashboard."],
      ["Mika", "/assets/avatar-mika.png", "The data stops feeling like a report."],
    ],
    frame: "garden",
  },
  {
    id: "prompt-kitchen",
    title: "Prompt Kitchen",
    type: "AI Experiment",
    category: "ai",
    creatorId: "neo",
    cover: "/assets/cover-kitchen.png",
    tags: ["Prompt", "Templates", "AI"],
    views: 21600,
    likes: 2930,
    collections: 1820,
    tool: "Codex + GPT",
    createdAt: "2026-05-28",
    summary: "Reusable prompt recipes that can be mixed, copied, and adapted.",
    detail:
      "It makes AI workflows more visual, helping creators document and reuse how they make things. oeeco can encourage authors to share this kind of process alongside finished works.",
    comments: [
      ["Sol", "/assets/avatar-sol.png", "This could become the process section of every work page."],
      ["Yan", "/assets/avatar-yan.png", "The recipe metaphor is immediately understandable."],
    ],
    frame: "kitchen",
  },
  {
    id: "orbit-clock",
    title: "Orbit Focus Clock",
    type: "Tool",
    category: "tool",
    creatorId: "sol",
    cover: "/assets/cover-clock.png",
    tags: ["Productivity", "Animation", "Focus"],
    views: 9800,
    likes: 1220,
    collections: 510,
    tool: "Codex + CSS",
    createdAt: "2026-05-27",
    summary: "A focus timer that turns progress into a slow-moving orbital trail.",
    detail:
      "The visual layer is calm and the controls are direct, which makes it a good fit for mobile use. It is the kind of polished micro-tool that can become an early oeeco featured pick.",
    comments: [
      ["Mika", "/assets/avatar-mika.png", "The start button is restrained in a good way."],
      ["Neo", "/assets/avatar-neo.png", "Focus history would make this even more useful."],
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

export function getWorkCuration(work: Work): WorkCuration {
  return work.curation || { featured: false, rank: null, label: null };
}

export function getWork(id: string) {
  return works.find((work) => work.id === id);
}

export function isCategoryId(value: string): value is Exclude<CategoryId, "all"> {
  return ["game", "tool", "story", "visual", "ai"].includes(value);
}

export function formatNumber(value: number) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}m`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return String(value);
}
