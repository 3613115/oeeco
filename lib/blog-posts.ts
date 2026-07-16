export type BlogSection = {
  heading: string;
  body: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: string;
  category: string;
  tags: string[];
  intro: string[];
  sections: BlogSection[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "what-are-ai-made-web-works",
    title: "What Are AI-Made Web Works?",
    description:
      "A practical definition of AI-made web works: playable browser games, useful tools, interactive experiments, and small shipped products made with AI-assisted workflows.",
    date: "2026-07-16",
    readingTime: "7 min read",
    category: "Guide",
    tags: ["ai-made", "web-works", "codex", "creative-coding", "interactive-tools"],
    intro: [
      "AI-made web works are small, complete browser experiences created with help from AI systems. They can be games, calculators, visual experiments, educational toys, product demos, research tools, or tiny utilities that solve one focused problem.",
      "The important part is not that an AI wrote every line. The important part is that the final result is a real web object people can open, inspect, use, and share. A prompt alone is not a work. A screenshot is not a work. A link that lets someone play, test, learn, or produce a result is much closer to the new format.",
    ],
    sections: [
      {
        heading: "A web work is more than generated code",
        body: [
          "AI coding tools make it faster to produce a first version, but a strong web work still needs intent. Someone has to decide what the visitor should understand in the first few seconds, what interaction matters, what should be removed, and what makes the result worth returning to.",
          "That is why oeeco treats AI-made work as a creative and product discipline, not as a novelty category. The best examples feel finished enough to respect the visitor's time. They load in the browser, explain themselves through the interface, and give the user something to do.",
        ],
      },
      {
        heading: "The main types of AI-made web works",
        body: [
          "Games are the easiest to recognize. They have a loop, a goal, constraints, and feedback. A tiny arcade game, a physics toy, or a simulation can show more craft than a much larger unfinished app.",
          "Tools are often more useful. They might turn messy notes into a launch checklist, help a founder evaluate customer interview signals, generate prompt cards, or audit landing page copy. These works have value because they compress a workflow into a clear browser surface.",
          "Visual and interactive experiments sit between art and utility. They may not solve a business problem, but they can teach a concept, demonstrate a mechanic, or create a memorable first impression.",
        ],
      },
      {
        heading: "Why browser-first matters",
        body: [
          "A browser link lowers the cost of trying something. Visitors do not need to install a package, clone a repository, or trust an unknown executable. They can open the work, decide whether it is useful, and leave with a clear impression.",
          "That matters for AI creators because a lot of impressive work is currently trapped inside private chats, local folders, and social posts that disappear quickly. Browser-first publishing turns those experiments into durable public artifacts.",
        ],
      },
      {
        heading: "What makes a work worth listing",
        body: [
          "A good listing has a clear title, a truthful summary, a stable demo URL, useful tags, and enough context to help a visitor decide whether to open it. The work itself should have a real interaction, a useful output, a playable loop, or a visual result that could not be replaced by a static paragraph.",
          "The threshold does not need to be corporate polish. Many valuable works are small. The threshold is that the work should be legible, safe to open, and honest about what it does.",
        ],
      },
      {
        heading: "Why this category will keep growing",
        body: [
          "As AI coding agents become more capable, more people will ship small software objects instead of only writing posts about ideas. A designer can make a prototype. A researcher can make a scoring tool. A teacher can make an explainer. A founder can make a validation lab.",
          "oeeco exists to give those web works a shelf: a place where AI-assisted games, tools, and experiments can be discovered as finished artifacts rather than lost as one-off links.",
        ],
      },
    ],
  },
  {
    slug: "how-codex-changes-small-web-games",
    title: "How Codex Changes the Way Small Web Games Are Built",
    description:
      "Small browser games are a natural fit for AI coding agents because the loop is visible, testable, and easy to improve through quick iteration.",
    date: "2026-07-16",
    readingTime: "8 min read",
    category: "Workflow",
    tags: ["codex", "browser-games", "game-design", "ai-coding", "prototyping"],
    intro: [
      "Small web games are one of the clearest ways to see what AI-assisted development changes. The scope is compact, the feedback is immediate, and every improvement can be felt directly by the player.",
      "A coding agent can help with rendering, input handling, physics, UI, state, scoring, and responsive layout. But the difference is not just speed. The bigger shift is that creators can iterate on feel, pacing, and clarity without treating every change as a major engineering task.",
    ],
    sections: [
      {
        heading: "The first playable version arrives faster",
        body: [
          "Before AI coding agents, many small game ideas died before they became playable. The creator had to set up the project, wire the canvas, build input handling, create entities, draw the scene, add collision logic, and only then start asking whether the game was fun.",
          "Codex-style workflows compress that early scaffolding. A creator can describe the loop, constraints, and desired feel, then quickly reach a version that can be played in the browser. That first version is rarely final, but it gives the creator something concrete to judge.",
        ],
      },
      {
        heading: "Iteration becomes the main craft",
        body: [
          "Once a game exists, the hard questions become more specific. Is the ship too slippery? Is the obstacle pattern readable? Does the player understand why they failed? Is the scoring generous enough to encourage another run?",
          "AI assistance is useful here because many of these changes are small but technical. Tuning acceleration, collision recovery, camera shake, particle density, or enemy timing can happen while the creator stays focused on the experience.",
        ],
      },
      {
        heading: "The creator still owns the taste",
        body: [
          "A game generated from a prompt can feel generic if nobody pushes on the details. The creator still needs to decide what the game is about, what it rewards, what it refuses to include, and what makes it distinct from a toy demo.",
          "That taste shows up in small places: the wording on a start screen, the way failure is explained, the decision to add a recovery mechanic, or the restraint to keep a game narrow instead of piling on unrelated features.",
        ],
      },
      {
        heading: "Browser games are easy to share and review",
        body: [
          "A small browser game is a strong publishing format because it is self-contained. Reviewers can open it, play one run, check whether it works on mobile, and understand the core idea without a long setup.",
          "For a gallery like oeeco, this makes games useful seed content. They create dwell time, they show interactive craft, and they give visitors a reason to remember the site. The strongest examples also teach creators how much polish can fit inside a tiny web page.",
        ],
      },
      {
        heading: "What to build first",
        body: [
          "The best first AI-made game is usually not a massive role-playing system. It is a focused loop: dodge, collect, balance, land, match, aim, survive, repair, or route. One mechanic should carry the first version.",
          "After that, add clarity. Good instructions, visible status, fair failure states, and a clean restart button often matter more than another layer of content. A small game that explains itself well feels more complete than a larger game that leaves players guessing.",
        ],
      },
    ],
  },
  {
    slug: "why-interactive-tools-beat-static-ai-demos",
    title: "Why Interactive Tools Are Better Than Static AI Demos",
    description:
      "Interactive tools turn AI-assisted ideas into useful workflows that visitors can test, repeat, and share instead of passively reading about them.",
    date: "2026-07-16",
    readingTime: "8 min read",
    category: "Strategy",
    tags: ["interactive-tools", "ai-demos", "productivity", "creator-tools", "web-tools"],
    intro: [
      "A static AI demo can be impressive for a moment. It shows that something is possible. An interactive tool goes further: it gives the visitor a way to use the idea on their own material.",
      "That difference matters for creators, founders, educators, and product builders. When a visitor can paste notes, change inputs, run a score, generate a plan, or compare outcomes, the page becomes more than a showcase. It becomes a small piece of software.",
    ],
    sections: [
      {
        heading: "Static demos ask for belief",
        body: [
          "A static demo usually says, here is what the system can do. The visitor has to trust that the result was not cherry-picked, that the method generalizes, and that it would work for their own situation.",
          "That can be enough for a launch post, but it is a weak long-term format. Visitors remember what they used more than what they saw. If the page never responds to them, it is easy to close and forget.",
        ],
      },
      {
        heading: "Interactive tools create evidence",
        body: [
          "An interactive tool lets the visitor test the claim. A customer interview analyzer can score real notes. A landing page copy doctor can diagnose an actual headline. A validation lab can turn a vague idea into a sharper risk map.",
          "The output does not have to be perfect to be useful. It only has to help the visitor think better, move faster, or notice something they might have missed. That is a much stronger value exchange than a passive screenshot.",
        ],
      },
      {
        heading: "Good tools have a narrow promise",
        body: [
          "The most useful small tools do not try to replace an entire job. They handle one moment in a workflow: sorting signals, generating next questions, checking readiness, comparing options, or translating messy input into a clearer next step.",
          "A narrow promise also makes the interface easier to judge. Visitors can quickly understand what to enter, what they will get back, and whether the tool helped.",
        ],
      },
      {
        heading: "Repeat use is the hidden advantage",
        body: [
          "Static demos are usually consumed once. Tools can be reused. A founder might run every new interview through the same signal lab. A marketer might test multiple headlines. A creator might generate different prompt cards for different projects.",
          "Repeat use is one reason interactive tools are important for oeeco. They give the site more than novelty traffic. They create practical reasons for visitors to return, bookmark, and share.",
        ],
      },
      {
        heading: "How to make an AI-assisted tool feel trustworthy",
        body: [
          "A trustworthy tool explains its inputs, shows its reasoning structure, avoids exaggerated claims, and gives visitors a result they can copy or act on. It should be clear when the output is a heuristic, a score, a draft, or a recommendation.",
          "For AdSense and search quality, this matters too. Original, useful pages with clear purpose and enough supporting context are much stronger than thin pages built only around a widget. The surrounding explanation should help real people, not just search crawlers.",
        ],
      },
    ],
  },
];

export function getAllBlogPosts() {
  return [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));
}

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
