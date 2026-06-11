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
  tryClicks: number;
  demoOpens: number;
  shares: number;
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

export const works: Work[] = [];

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
