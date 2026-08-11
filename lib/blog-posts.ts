import { fieldNotesBlogPosts } from "@/lib/blog-posts-field-notes";
import type { BlogPost } from "@/lib/blog-types";

export type { BlogPost, BlogRelatedLink, BlogSection } from "@/lib/blog-types";

export const blogAuthor = "oeeco Editorial";

export const blogAuthorSlug = "oeeco-editorial";

export const blogAuthorPath = `/authors/${blogAuthorSlug}`;

export const blogAuthorDescription =
  "The oeeco editorial team writes practical guides for AI-made web works, creator submissions, review standards, browser games, and interactive tools.";

const archiveBlogPosts: BlogPost[] = [
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
    relatedLinks: [
      {
        label: "Explore AI-made works",
        href: "/",
        description: "Browse the current oeeco gallery of games, tools, visual pages, and interactive experiments.",
      },
      {
        label: "Submission guidelines",
        href: "/guidelines",
        description: "See what makes a work safe, clear, and ready for review on oeeco.",
      },
      {
        label: "Submit a work",
        href: "/upload",
        description: "Share a browser-based project for review and possible publication.",
      },
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
    relatedLinks: [
      {
        label: "Play Orbital Salvage",
        href: "/demos/orbital-salvage",
        description: "Try a deeper AI-assisted browser game with physics, recovery objectives, and mission feedback.",
      },
      {
        label: "Browse game works",
        href: "/categories/game",
        description: "Explore more playable browser games and arcade experiments on oeeco.",
      },
      {
        label: "Latest works",
        href: "/latest",
        description: "See the newest published games, tools, and experiments.",
      },
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
    relatedLinks: [
      {
        label: "Customer Interview Signal Lab",
        href: "/demos/customer-interview-signal-lab",
        description: "Use a practical tool that turns interview notes into evidence, themes, and next questions.",
      },
      {
        label: "Micro SaaS Validation Lab",
        href: "/demos/micro-saas-validation-lab",
        description: "Try an interactive validation workflow for early product ideas.",
      },
      {
        label: "Browse tool works",
        href: "/categories/tool",
        description: "Find more useful AI-made browser tools in the oeeco gallery.",
      },
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
  {
    slug: "how-to-submit-ai-made-web-work-to-oeeco",
    title: "How to Submit an AI-Made Web Work to oeeco",
    description:
      "A practical guide to preparing a clear, safe, and useful oeeco submission with the right title, summary, tags, demo URL, and creator context.",
    date: "2026-07-16",
    readingTime: "7 min read",
    category: "Submission",
    tags: ["submission", "creator-guide", "ai-made", "publishing", "oeeco"],
    intro: [
      "A good oeeco submission should help a visitor understand what they are about to open before they click. The work can be a game, a tool, a visual experiment, or an interactive page, but the listing needs to be specific, honest, and easy to review.",
      "This guide explains how to prepare a submission so it has a better chance of being accepted and a better chance of being useful once it is public.",
    ],
    relatedLinks: [
      {
        label: "Submit to oeeco",
        href: "/upload",
        description: "Open the submission form for browser games, tools, and interactive works.",
      },
      {
        label: "Submission guidelines",
        href: "/guidelines",
        description: "Review the rules for safe links, honest metadata, and useful project descriptions.",
      },
      {
        label: "About oeeco",
        href: "/about",
        description: "Learn why oeeco is building a gallery for AI-made web works.",
      },
    ],
    sections: [
      {
        heading: "Start with a playable or usable URL",
        body: [
          "The most important part of a submission is the demo URL. It should open in a modern browser, load without special setup, and show the actual work described in the listing. If the page requires a risky download, a private login, or a confusing redirect chain, it is not ready for oeeco.",
          "Before submitting, open the URL in a clean browser session and test the first minute of use. Check desktop and mobile if possible. A work does not need to be huge, but it should not be broken at the first interaction.",
        ],
      },
      {
        heading: "Write a title that names the thing",
        body: [
          "A strong title tells people what kind of work they are seeing. Names like Orbital Salvage, Customer Interview Signal Lab, or Tiny Launch Checklist give visitors a useful mental model. Vague names like New AI Demo or Test Project make the work harder to trust.",
          "If the work is experimental, that is fine. The title can still be concrete. A clear name helps search, review, sharing, and future visitors who are scanning a crowded list.",
        ],
      },
      {
        heading: "Use the summary to set expectations",
        body: [
          "The short summary should answer three questions: what does it do, who might use it, and what happens when someone opens it. A good summary is usually one sentence, not a marketing paragraph.",
          "Avoid claims that the work cannot support. If a tool offers a heuristic score, call it a score. If a game is a prototype, say what the core loop is. Honest summaries help visitors enjoy the work on its real terms.",
        ],
      },
      {
        heading: "Choose tags that describe real context",
        body: [
          "Tags should describe the format, workflow, and audience. For example: codex, browser-game, validation, startup, canvas, product, research, interactive. Do not add unrelated tags just because they are popular.",
          "Good tags help oeeco group works into useful shelves. They also make it easier for visitors to find examples they can learn from.",
        ],
      },
      {
        heading: "Add creator notes when the process matters",
        body: [
          "Creator notes are useful when they explain what was built, why it was built, and what tools or constraints shaped the result. They are not a place for hype. They are a place for context.",
          "A short note about the AI-assisted workflow can make the work more valuable to other builders. Mention what was generated, what was edited by hand, and what you would improve next.",
        ],
      },
    ],
  },
  {
    slug: "what-makes-a-good-ai-made-browser-game",
    title: "What Makes a Good AI-Made Browser Game?",
    description:
      "A checklist for small AI-assisted browser games: clear loops, readable controls, fair feedback, mobile awareness, and enough polish to invite another run.",
    date: "2026-07-16",
    readingTime: "8 min read",
    category: "Game Design",
    tags: ["browser-games", "game-design", "codex", "canvas", "playability"],
    intro: [
      "AI tools make it easier to generate a browser game, but they do not automatically make the game feel good. A strong small game still needs a readable loop, responsive controls, clear feedback, and a reason to play again.",
      "The best AI-made browser games are usually not large. They are focused. They choose one main action, make the result visible, and help the player understand what happened after every success or failure.",
    ],
    relatedLinks: [
      {
        label: "One Button Dodge",
        href: "/demos/one-button-dodge",
        description: "Try a small browser game built around one readable action loop.",
      },
      {
        label: "EVO//COLONY",
        href: "/demos/evo-colony",
        description: "Explore a richer simulation-style AI-assisted game experiment.",
      },
      {
        label: "Game category",
        href: "/categories/game",
        description: "Browse more game works published on oeeco.",
      },
    ],
    sections: [
      {
        heading: "The loop should be obvious",
        body: [
          "A player should understand the basic loop quickly: dodge obstacles, recover cargo, match signals, survive a wave, land safely, or build a pattern. If the first thirty seconds are confusing, more features will not fix the game.",
          "A useful test is to watch someone play without explanation. If they can start, fail, retry, and improve, the loop is working. If they ask what the goal is, the interface needs more clarity.",
        ],
      },
      {
        heading: "Controls matter more than content volume",
        body: [
          "Small browser games live or die on feel. Movement should respond quickly. Buttons should be large enough on mobile. Keyboard controls should be visible before the player needs them. Touch controls should not cover the thing the player is trying to see.",
          "AI can generate content quickly, but ten more enemy types will not help if steering feels bad. Tune acceleration, friction, collision response, and restart speed before expanding the game.",
        ],
      },
      {
        heading: "Feedback should teach the player",
        body: [
          "Good feedback tells the player why something happened. A soundless web game can still use animation, color, shake, score changes, status labels, and short messages. The player should know whether they made progress, took damage, completed an objective, or lost control.",
          "Failure states are especially important. A fair loss makes the player want another run. A confusing loss makes the player close the tab.",
        ],
      },
      {
        heading: "The game should survive mobile layouts",
        body: [
          "Many visitors will open a shared link on a phone. That does not mean every game needs perfect mobile controls, but it should not collapse, overflow horizontally, or hide the primary action.",
          "If mobile play is limited, say so clearly. If the game supports mobile, test the canvas size, button spacing, and readable text at narrow widths.",
        ],
      },
      {
        heading: "Polish is mostly clarity",
        body: [
          "Polish does not require a huge art budget. It can be a strong start screen, one good visual motif, readable labels, a restart button, and a score that makes sense. Consistent spacing and a calm UI often do more than decorative effects.",
          "For oeeco, a good AI-made game is one that feels intentionally finished at its chosen size. It should invite a short session and leave the player with a specific memory of the mechanic.",
        ],
      },
    ],
  },
  {
    slug: "turn-a-prompt-into-a-playable-web-tool",
    title: "How to Turn a Prompt Into a Playable Web Tool",
    description:
      "A workflow for turning an AI prompt idea into a useful browser tool with inputs, outputs, constraints, examples, and a shareable page.",
    date: "2026-07-16",
    readingTime: "8 min read",
    category: "Workflow",
    tags: ["prompting", "web-tools", "codex", "product-design", "prototyping"],
    intro: [
      "A prompt can describe a useful workflow, but a web tool lets people use that workflow repeatedly. The difference is structure. A tool has inputs, rules, outputs, states, and a clear interface for action.",
      "This is where AI-assisted development becomes especially powerful. A creator can start with a reasoning pattern, then turn it into a small browser product that visitors can try on their own material.",
    ],
    relatedLinks: [
      {
        label: "AI Prompt Card Generator",
        href: "/demos/ai-prompt-card-generator",
        description: "See a prompt workflow packaged as a focused interactive tool.",
      },
      {
        label: "Landing Page Copy Doctor",
        href: "/demos/landing-page-copy-doctor",
        description: "Try a browser tool that diagnoses and improves landing page messaging.",
      },
      {
        label: "Submit your tool",
        href: "/upload",
        description: "Share a prompt-powered tool or browser workflow with oeeco.",
      },
    ],
    sections: [
      {
        heading: "Name the job before building the UI",
        body: [
          "Start by writing the job in one sentence. For example: turn customer interview notes into product evidence, evaluate whether a tiny SaaS idea is ready to test, or rewrite a landing page headline into clearer variants.",
          "The job should be narrow enough that a visitor knows when they are done. If the idea tries to cover an entire profession, reduce it to one decision, one diagnosis, or one useful output.",
        ],
      },
      {
        heading: "Design the inputs around real behavior",
        body: [
          "Good tools ask for information people actually have. A founder may have messy interview notes, a rough audience description, a strongest quote, and a current alternative. A creator may have a project title, a target user, and a draft prompt.",
          "Avoid asking for perfect data. The tool should help people organize imperfect material, not punish them for being early.",
        ],
      },
      {
        heading: "Make the output easy to act on",
        body: [
          "A useful output usually includes a score, a summary, a few themes, next questions, and a short action plan. The goal is not to sound impressive. The goal is to reduce the next decision.",
          "Copyable reports are valuable because they move the result out of the tool and into the user's workflow. If a visitor can paste the output into a document, task list, or team chat, the tool has more practical value.",
        ],
      },
      {
        heading: "Add constraints so the tool has taste",
        body: [
          "Without constraints, generated tools become vague. Decide what the tool will ignore, what it will emphasize, and what warning signs it should surface. These decisions give the tool a point of view.",
          "For example, a validation tool might score urgency higher than compliments. A copy tool might punish vague benefits. A game idea tool might favor a one-screen loop over a large concept.",
        ],
      },
      {
        heading: "Publish the tool with context",
        body: [
          "The page around the tool should explain who it is for, what it does, and how to interpret the output. This helps visitors and search engines understand the page as original content rather than an isolated widget.",
          "On oeeco, that context also helps reviewers decide where the work belongs and how it should be described in the gallery.",
        ],
      },
    ],
  },
  {
    slug: "why-ai-creators-need-public-portfolios",
    title: "Why AI Creators Need Public Portfolios",
    description:
      "AI-assisted creators need public, inspectable portfolios because shipped links show judgment, taste, iteration, and reliability better than prompts or screenshots.",
    date: "2026-07-16",
    readingTime: "7 min read",
    category: "Creators",
    tags: ["creator-portfolio", "ai-creators", "shipping", "web-works", "career"],
    intro: [
      "AI-assisted creation changes what a portfolio can be. Instead of only showing images, case studies, or code repositories, creators can publish small working artifacts that visitors can open immediately.",
      "That matters because the value of AI work is not just generation. The value is judgment: choosing what to build, shaping the interaction, editing the result, and making something clear enough for other people to use.",
    ],
    relatedLinks: [
      {
        label: "Explore creators",
        href: "/",
        description: "Browse the public shelf of AI-made works and the creators behind them.",
      },
      {
        label: "Submit work",
        href: "/upload",
        description: "Start building a public record of shipped AI-assisted web projects.",
      },
      {
        label: "Latest works",
        href: "/latest",
        description: "See newly published examples from the oeeco gallery.",
      },
    ],
    sections: [
      {
        heading: "A shipped link shows more than a prompt",
        body: [
          "Prompts can be copied. Screenshots can be selected. A working link reveals more. It shows whether the creator can turn an idea into a usable surface, handle edge cases, write instructions, and respect the visitor's time.",
          "For small web works, the portfolio item is not only the code. It is the full experience: title, interface, interaction, copy, performance, safety, and follow-through.",
        ],
      },
      {
        heading: "Public work creates a memory trail",
        body: [
          "Many AI experiments disappear into private folders and chat histories. A public portfolio creates a record of shipped attempts. Over time, that record becomes more persuasive than a single polished claim.",
          "Visitors can see range: games, tools, visual experiments, research helpers, product prototypes, and utilities. They can also see improvement across projects.",
        ],
      },
      {
        heading: "Portfolios help creators discover their taste",
        body: [
          "Publishing work changes how a creator thinks. It forces decisions about what is finished, what is too confusing, what should be cut, and what deserves another iteration.",
          "This is especially useful with AI tools because generation can produce too many options. A portfolio rewards selection. It asks the creator to choose the pieces that represent their direction.",
        ],
      },
      {
        heading: "A gallery makes comparison easier",
        body: [
          "A personal site is useful, but a gallery adds context. Visitors can compare formats, tags, categories, and workflows across creators. That makes discovery easier and helps new builders learn from nearby examples.",
          "oeeco is designed to be that shared shelf for AI-made web works. It gives individual creators a public link while also helping the category become easier to understand.",
        ],
      },
      {
        heading: "Start with small finished pieces",
        body: [
          "A portfolio does not need to begin with a large product. Three small but finished web works can show more reliability than one ambitious unfinished platform. Start with tools and games that have a clear loop, stable URL, and honest description.",
          "The goal is to build proof of taste and shipping rhythm. A public body of work grows one finished link at a time.",
        ],
      },
    ],
  },
  {
    slug: "difference-between-ai-demos-and-shipped-web-works",
    title: "The Difference Between AI Demos and Shipped Web Works",
    description:
      "AI demos prove a possibility, but shipped web works create a usable artifact with context, reliability, safety, and enough finish for real visitors.",
    date: "2026-07-16",
    readingTime: "7 min read",
    category: "Strategy",
    tags: ["ai-demos", "shipping", "web-works", "product-thinking", "quality"],
    intro: [
      "AI demos are useful. They show what might be possible. But a demo is not always a shipped work. A shipped web work is something a visitor can open, understand, use, and evaluate without needing the creator to stand beside it.",
      "The distinction matters because the web is full of impressive fragments. oeeco is interested in the next step: small artifacts that are finished enough to be browsed, reviewed, and shared.",
    ],
    relatedLinks: [
      {
        label: "Explore shipped works",
        href: "/",
        description: "Open real AI-made web works that are published in the oeeco gallery.",
      },
      {
        label: "Submission guidelines",
        href: "/guidelines",
        description: "Learn the difference between an unfinished demo and a review-ready work.",
      },
      {
        label: "Review process",
        href: "/blog/how-oeeco-reviews-ai-made-works",
        description: "Read how oeeco evaluates links, metadata, safety, and substance.",
      },
    ],
    sections: [
      {
        heading: "A demo highlights capability",
        body: [
          "A demo often says: look what this model, prompt, or toolchain can generate. It may be a video, a screenshot, a one-off page, or a prototype that works only in a narrow case.",
          "That is a valid stage of creation. Capability demos help people imagine new workflows. The problem comes when a demo is presented as a finished tool without the support a real visitor needs.",
        ],
      },
      {
        heading: "A shipped work supports visitors",
        body: [
          "A shipped work has enough context to stand alone. It explains what it does, handles the main interaction, gives feedback, and offers a stable path through the experience.",
          "It does not need to be large. It does need to be coherent. The visitor should not feel like they opened a private test page by accident.",
        ],
      },
      {
        heading: "Reliability is part of the work",
        body: [
          "If a page breaks on mobile, hides the main control, or fails after the first click, the idea may still be interesting, but the work is not ready. Reliability is not separate from creativity on the web. It is part of the visitor's experience.",
          "For AI-assisted projects, this means testing the generated result. Check loading, layout, interaction, copy, and obvious failure states before publishing.",
        ],
      },
      {
        heading: "Context turns output into content",
        body: [
          "A shipped work should include a title, summary, creator context, tags, and sometimes a short explanation of how it was made. This surrounding content helps people understand why the work exists and how to judge it.",
          "It also helps the page avoid feeling thin. A tool or game with no explanation may be fun for a moment, but a tool or game with context becomes easier to remember, search, and reference.",
        ],
      },
      {
        heading: "The best path is demo to artifact",
        body: [
          "Creators do not need to skip the demo stage. They should use it as a draft. First prove the capability, then shape it into a web work with clearer purpose, safer interaction, and better presentation.",
          "That transition is where AI-assisted creators can stand out. Many people can generate a prototype. Fewer people finish the last twenty percent that makes it useful to strangers.",
        ],
      },
    ],
  },
  {
    slug: "checklist-for-publishing-safe-interactive-web-projects",
    title: "A Checklist for Publishing Safe Interactive Web Projects",
    description:
      "A practical safety and quality checklist for publishing browser-based AI-assisted games, tools, and experiments that visitors can open with confidence.",
    date: "2026-07-16",
    readingTime: "8 min read",
    category: "Safety",
    tags: ["web-safety", "publishing", "interactive-projects", "review", "creator-guide"],
    intro: [
      "Interactive web projects ask visitors to trust a link. Even when the project is small, creators should think carefully about safety, clarity, and the data a page asks people to provide.",
      "This checklist is written for AI-assisted creators who want to publish browser games, tools, and experiments that are easier to review and safer to share.",
    ],
    relatedLinks: [
      {
        label: "Submission guidelines",
        href: "/guidelines",
        description: "Read oeeco's safety and quality expectations for public submissions.",
      },
      {
        label: "Privacy policy",
        href: "/privacy",
        description: "See how oeeco presents privacy information for visitors and creators.",
      },
      {
        label: "Submit safely",
        href: "/upload",
        description: "Prepare a browser-based work for review and publication.",
      },
    ],
    sections: [
      {
        heading: "Check the link behavior",
        body: [
          "The project should open directly to the work or to a clear landing page for the work. Avoid forced downloads, surprise redirects, hidden destinations, and pages that imitate login screens without a real need.",
          "If the work uses external links, label them clearly. Visitors should understand when they are leaving the project and why.",
        ],
      },
      {
        heading: "Limit data collection",
        body: [
          "Most small tools do not need personal data. If a tool asks for notes, ideas, or text inputs, explain how the input is used. Do not ask for passwords, private keys, payment details, or unnecessary contact information.",
          "If the project is only a prototype, keep the data model simple. A local-only interaction is often safer and easier to trust than a form that sends information to an unclear backend.",
        ],
      },
      {
        heading: "Make controls and outcomes clear",
        body: [
          "Visitors should know what buttons do before clicking them. Labels like Generate, Copy report, Start run, Reset, and Open demo are better than vague labels that hide the action.",
          "If an action changes state, show the result. If the tool produces a score or recommendation, explain what the score means and what it does not mean.",
        ],
      },
      {
        heading: "Test the main path",
        body: [
          "Before publishing, test the first complete path a visitor will take. For a game, start, play, fail, and restart. For a tool, enter sample data, generate output, copy the result, and refresh the page.",
          "Also test narrow screens. Layout problems are one of the easiest ways for a good idea to feel unfinished.",
        ],
      },
      {
        heading: "Describe known limits honestly",
        body: [
          "A safe project does not pretend to be more complete than it is. If the work is a prototype, say so. If it is a heuristic, say so. If it is best used for brainstorming rather than final decisions, make that visible.",
          "Honest limits build trust. They also help reviewers and visitors understand the work as a thoughtful artifact rather than a misleading claim.",
        ],
      },
    ],
  },
  {
    slug: "how-oeeco-reviews-ai-made-works",
    title: "How oeeco Reviews AI-Made Works",
    description:
      "A transparent look at how oeeco thinks about reviewing AI-made games, tools, interactive pages, and experiments before they become public.",
    date: "2026-07-16",
    readingTime: "7 min read",
    category: "Review",
    tags: ["review-process", "oeeco", "submission-guidelines", "quality", "safety"],
    intro: [
      "oeeco reviews submissions so the gallery can stay useful, safe, and clear. The review process is not meant to make every work look the same. It is meant to filter out unsafe links, misleading descriptions, broken pages, and projects that are not ready for public discovery.",
      "This article explains the review mindset so creators know what to improve before submitting.",
    ],
    relatedLinks: [
      {
        label: "Submission guidelines",
        href: "/guidelines",
        description: "Review the public rules that guide oeeco's submission decisions.",
      },
      {
        label: "Contact oeeco",
        href: "/contact",
        description: "Report a problem, ask a question, or reach the site owner.",
      },
      {
        label: "Submit a work",
        href: "/upload",
        description: "Send a browser-based AI-made work into the review flow.",
      },
    ],
    sections: [
      {
        heading: "The first question is whether the link works",
        body: [
          "A reviewer should be able to open the demo URL and see the submitted work. If the link is broken, private, misleading, or unrelated to the listing, the submission cannot be published as-is.",
          "Availability is basic, but it is also a signal of care. A creator who tests the link before submitting saves everyone time.",
        ],
      },
      {
        heading: "The second question is whether the description is honest",
        body: [
          "The title, summary, tags, and creator notes should match what the visitor actually sees. A simple prototype can be accepted if it is described honestly. An exaggerated submission creates the wrong expectation.",
          "oeeco favors plain descriptions over inflated claims. The point is to help visitors decide what to open, not to oversell every project.",
        ],
      },
      {
        heading: "Safety comes before novelty",
        body: [
          "A project can be visually interesting and still be rejected if it creates a safety problem. Phishing-like flows, hidden downloads, deceptive redirects, copied private material, or harmful content do not belong in the gallery.",
          "AI-assisted creation makes it easy to produce convincing interfaces quickly. That makes safety review more important, not less.",
        ],
      },
      {
        heading: "Substance matters",
        body: [
          "oeeco looks for works with a real interaction, useful output, playable loop, or thoughtful visual result. A page that only says coming soon, repeats generic text, or exists only for keywords is not a good fit.",
          "The standard is not perfection. The standard is whether the work gives a real visitor something meaningful to try or understand.",
        ],
      },
      {
        heading: "Review can improve the public shelf",
        body: [
          "A gallery becomes more valuable when visitors trust that public works have passed a basic quality bar. Review is part of curation. It protects visitors, helps creators present their work clearly, and makes the whole site easier to browse.",
          "As oeeco grows, the review process can become more detailed. The early goal is simple: safe links, honest metadata, and enough substance to reward a click.",
        ],
      },
    ],
  },
  {
    slug: "best-ai-made-browser-games-to-study",
    title: "Best AI-Made Browser Games to Study",
    description:
      "What creators can learn from small AI-assisted browser games: focused loops, readable feedback, tuned controls, and lightweight publishing.",
    date: "2026-07-16",
    readingTime: "8 min read",
    category: "Game Design",
    tags: ["browser-games", "ai-made-games", "game-design", "creative-coding", "playability"],
    intro: [
      "The best AI-made browser games to study are not always the biggest ones. Small games often reveal the most useful lessons because their decisions are visible: one loop, one control scheme, one failure state, one reason to retry.",
      "For creators using Codex or other AI coding tools, studying small games is a practical way to improve. You can see how a generated prototype becomes a playable artifact through tuning, interface decisions, and a few strong constraints.",
    ],
    relatedLinks: [
      {
        label: "Orbital Salvage",
        href: "/demos/orbital-salvage",
        description: "Study a deeper space recovery game with physics, objectives, hazards, and feedback systems.",
      },
      {
        label: "One Button Dodge",
        href: "/demos/one-button-dodge",
        description: "Try a compact game built around a single readable interaction.",
      },
      {
        label: "Game category",
        href: "/categories/game",
        description: "Browse more AI-made browser games and arcade experiments on oeeco.",
      },
    ],
    sections: [
      {
        heading: "Start with the loop",
        body: [
          "A game worth studying has a loop you can describe quickly. Avoid, collect, tow, match, land, survive, repair, route, or build. If the core action cannot be named, the game may be too vague to teach much.",
          "AI tools can produce many mechanics at once, but good games usually choose one dominant loop and support it with clear feedback. Study how the loop begins, how it escalates, and how the player knows they are improving.",
        ],
      },
      {
        heading: "Look at failure feedback",
        body: [
          "Failure is where design quality becomes obvious. A good browser game tells the player why they lost and makes restarting easy. A weak game simply stops or leaves the player confused.",
          "When studying examples, look for visual changes, score changes, status text, animation, or layout cues that explain the result. These details often matter more than extra content.",
        ],
      },
      {
        heading: "Study control tuning",
        body: [
          "Generated games often need human taste in controls. Movement may be too slippery, too stiff, too fast, or too slow. Small differences in acceleration, friction, hitboxes, and cooldowns can change the whole experience.",
          "A useful study habit is to ask what would happen if one value changed by twenty percent. That question teaches you how much of game feel is tuning rather than feature count.",
        ],
      },
      {
        heading: "Notice the page around the game",
        body: [
          "A browser game is not only the canvas. The start screen, instructions, restart button, status labels, and mobile layout all shape the visitor's first minute.",
          "For oeeco, a strong game page should be safe to open, easy to understand, and honest about its scope. A game can be small and still feel published if the surrounding page is thoughtful.",
        ],
      },
      {
        heading: "Build your own study list",
        body: [
          "Keep a short list of games that teach one thing well: control feel, visual clarity, onboarding, progression, or replayability. Do not only collect impressive screenshots. Collect examples that reveal decisions you can reuse.",
          "AI-assisted creators improve fastest when they study finished links, not just prompts. A playable page shows the craft that happens after generation.",
        ],
      },
    ],
  },
  {
    slug: "how-to-review-an-ai-made-web-tool",
    title: "How to Review an AI-Made Web Tool",
    description:
      "A practical review framework for AI-made browser tools: purpose, inputs, output quality, safety, repeat use, and honest limitations.",
    date: "2026-07-16",
    readingTime: "8 min read",
    category: "Review",
    tags: ["web-tools", "review", "ai-made", "product-design", "quality"],
    intro: [
      "AI-made web tools can look useful at first glance, but a good review should go deeper than whether the page has a polished interface. The real question is whether the tool helps a visitor complete a meaningful task.",
      "This framework is written for creators, reviewers, and site owners who need to judge small browser tools fairly. It works for validation labs, copy helpers, research tools, prompt generators, and other workflow-focused projects.",
    ],
    relatedLinks: [
      {
        label: "Customer Interview Signal Lab",
        href: "/demos/customer-interview-signal-lab",
        description: "Review a tool that turns messy interview notes into structured product evidence.",
      },
      {
        label: "Landing Page Copy Doctor",
        href: "/demos/landing-page-copy-doctor",
        description: "Try a focused copy diagnosis tool with concrete outputs.",
      },
      {
        label: "Review process",
        href: "/blog/how-oeeco-reviews-ai-made-works",
        description: "Read how oeeco thinks about review, safety, metadata, and substance.",
      },
    ],
    sections: [
      {
        heading: "Ask what job the tool performs",
        body: [
          "A good tool has a clear job. It might score interview evidence, generate prompt cards, diagnose a landing page, or turn a product idea into a risk map. If the job is unclear, the output will usually feel generic.",
          "Review the tool by asking whether the visitor can understand the task before entering data. A tool that needs a long explanation may need a narrower promise.",
        ],
      },
      {
        heading: "Check whether the inputs are realistic",
        body: [
          "Useful tools ask for inputs people actually have. Founders have messy notes, rough personas, quotes, alternatives, and goals. Creators have titles, prompts, drafts, and constraints.",
          "If a tool asks for perfect information, it may fail at the moment when people need it most. Strong tools help organize incomplete material.",
        ],
      },
      {
        heading: "Evaluate the output",
        body: [
          "Good output is specific, structured, and easy to act on. It should reduce the next decision. A weak output sounds fluent but does not tell the visitor what to do next.",
          "Look for scores, themes, warnings, next questions, action steps, or copyable reports. The best small tools leave the visitor with a useful artifact.",
        ],
      },
      {
        heading: "Review safety and data expectations",
        body: [
          "A small tool should not ask for unnecessary sensitive data. If it accepts notes or text, the interface should be clear about what the visitor is doing and what the tool returns.",
          "Avoid tools that imitate login flows, hide data transmission, or pressure users to submit private information. Safety is part of product quality.",
        ],
      },
      {
        heading: "Look for repeat value",
        body: [
          "The strongest AI-made tools can be used more than once. A visitor might run each new interview, headline, or product idea through the same workflow.",
          "Repeat value is a signal that the tool is more than a demo. It has become a small piece of software that fits into a real routine.",
        ],
      },
    ],
  },
  {
    slug: "ai-web-app-publishing-checklist",
    title: "AI Web App Publishing Checklist",
    description:
      "A pre-publish checklist for AI-assisted web apps covering purpose, safety, metadata, mobile layout, performance, policy pages, and post-launch review.",
    date: "2026-07-16",
    readingTime: "9 min read",
    category: "Publishing",
    tags: ["publishing", "web-apps", "checklist", "ai-coding", "launch"],
    intro: [
      "AI-assisted coding makes it easier to create a web app, but publishing still requires care. A generated page can work in a local preview and still fail as a public artifact if it lacks context, safety checks, responsive layout, or clear metadata.",
      "Use this checklist before sharing an AI-made web app on oeeco, social platforms, search, or a public portfolio.",
    ],
    relatedLinks: [
      {
        label: "Site readiness",
        href: "/site-readiness",
        description: "Use oeeco's operational checklist for content, policy, sitemap, RSS, and AdSense basics.",
      },
      {
        label: "Submission guidelines",
        href: "/guidelines",
        description: "Read the public rules for safe and useful oeeco submissions.",
      },
      {
        label: "Submit a work",
        href: "/upload",
        description: "Share a review-ready AI-made browser project with oeeco.",
      },
    ],
    sections: [
      {
        heading: "Define the public promise",
        body: [
          "Write one sentence that explains what the app does and who it helps. If the promise is too broad, reduce it before publishing. Public pages need immediate clarity.",
          "A clear promise improves titles, summaries, onboarding, and review. It also protects visitors from expecting a finished product when the page is really a prototype.",
        ],
      },
      {
        heading: "Test the first complete path",
        body: [
          "Open the app as a new visitor. Complete the main action from start to finish. For a game, start, play, fail, and restart. For a tool, enter sample data, generate output, copy or save the result, and refresh.",
          "Do this before adding more features. A broken main path is more damaging than a missing secondary feature.",
        ],
      },
      {
        heading: "Check mobile and narrow screens",
        body: [
          "Many people open shared links on phones. Text should fit, buttons should remain tappable, and important controls should not overlap. If the app is desktop-only, say so honestly.",
          "Responsive layout is not decoration. It is part of making the work accessible to real visitors.",
        ],
      },
      {
        heading: "Review metadata and policy context",
        body: [
          "Every public app should have a clear title, description, canonical URL, and any necessary policy links. If the app collects data, explain what happens. If it is a prototype, describe its limits.",
          "For a gallery submission, metadata helps reviewers and visitors understand the work without guessing.",
        ],
      },
      {
        heading: "Prepare for post-launch fixes",
        body: [
          "Publishing is not the end. Watch for broken links, confusing instructions, mobile bugs, and mismatches between the description and the actual app.",
          "A small update after launch can turn a rough AI-generated prototype into a reliable web work.",
        ],
      },
    ],
  },
  {
    slug: "examples-of-useful-ai-made-tools",
    title: "Examples of Useful AI-Made Tools",
    description:
      "Examples and patterns for useful AI-made browser tools, from interview synthesis to validation labs, prompt workflows, and copy diagnosis.",
    date: "2026-07-16",
    readingTime: "8 min read",
    category: "Examples",
    tags: ["ai-tools", "examples", "interactive-tools", "workflow", "productivity"],
    intro: [
      "Useful AI-made tools usually do one narrow job well. They accept messy input, apply a structured way of thinking, and return something the visitor can use immediately.",
      "This article outlines practical examples of tool patterns that fit well on the web and are strong candidates for oeeco submissions.",
    ],
    relatedLinks: [
      {
        label: "Micro SaaS Validation Lab",
        href: "/demos/micro-saas-validation-lab",
        description: "Explore a tool pattern for early product validation and risk thinking.",
      },
      {
        label: "AI Prompt Card Generator",
        href: "/demos/ai-prompt-card-generator",
        description: "Try a tool that packages prompt creation into reusable cards.",
      },
      {
        label: "Tool category",
        href: "/categories/tool",
        description: "Browse more useful browser tools in the oeeco gallery.",
      },
    ],
    sections: [
      {
        heading: "Interview synthesis tools",
        body: [
          "A founder or product builder often has messy interview notes and needs to know whether they contain real evidence. A useful tool can score pain, urgency, alternatives, and clarity, then suggest next questions.",
          "The value is not that the tool replaces research judgment. The value is that it makes the next review session more structured.",
        ],
      },
      {
        heading: "Validation and prioritization tools",
        body: [
          "Validation tools help creators compare ideas, risks, target users, and next experiments. They are useful when they make tradeoffs visible instead of producing vague encouragement.",
          "A good validation tool should explain its criteria. Visitors should know why an idea scored well or poorly.",
        ],
      },
      {
        heading: "Prompt workflow tools",
        body: [
          "Prompt tools are useful when they help people produce repeatable inputs for creative or technical work. A prompt card, checklist, or guided form is stronger than a page that simply says write a better prompt.",
          "The interface should help users express role, goal, context, constraints, and desired output without needing to remember a formula.",
        ],
      },
      {
        heading: "Copy and messaging tools",
        body: [
          "Copy tools can diagnose unclear headlines, weak value propositions, missing proof, or unfocused calls to action. They are especially useful when they show the reason behind each suggestion.",
          "A browser tool that improves one landing page section can be more practical than a large generic writing assistant.",
        ],
      },
      {
        heading: "What these examples have in common",
        body: [
          "The best tools are narrow, repeatable, and honest about their limits. They do not promise to replace expertise. They help the visitor move one step forward.",
          "That is the sweet spot for AI-made web tools: small enough to understand, useful enough to revisit, and clear enough to share.",
        ],
      },
    ],
  },
  {
    slug: "how-to-make-a-small-web-game-feel-finished",
    title: "How to Make a Small Web Game Feel Finished",
    description:
      "Small web games feel finished when they have a clear start, readable controls, fair failure, polish through restraint, and a smooth restart loop.",
    date: "2026-07-16",
    readingTime: "8 min read",
    category: "Game Design",
    tags: ["small-games", "browser-games", "polish", "game-feel", "ai-coding"],
    intro: [
      "A small web game does not need a huge world, a long story, or dozens of mechanics to feel finished. It needs to respect the player from the first second.",
      "For AI-assisted creators, the finishing step is where the work becomes memorable. The generated prototype may contain the idea, but polish turns the idea into a page people can actually enjoy.",
    ],
    relatedLinks: [
      {
        label: "What makes a good browser game",
        href: "/blog/what-makes-a-good-ai-made-browser-game",
        description: "Read the companion checklist for AI-made browser game quality.",
      },
      {
        label: "Mood Garden",
        href: "/demos/mood-garden",
        description: "Try a small visual interaction with a gentle, finished presentation.",
      },
      {
        label: "Browse games",
        href: "/categories/game",
        description: "Find more playable AI-made game works on oeeco.",
      },
    ],
    sections: [
      {
        heading: "Give the player a clear start",
        body: [
          "A finished-feeling game tells the player what they are doing before asking for skill. The first screen should explain the goal, the main control, and the reason to start.",
          "This does not require a long tutorial. One sentence and a visible start button can be enough if the game loop is focused.",
        ],
      },
      {
        heading: "Make controls visible",
        body: [
          "Players should not need to guess whether the game uses keyboard, mouse, touch, or buttons. If the controls change by device, the interface should make that clear.",
          "Generated games often hide controls in code comments or assumptions. Published games need visible instructions.",
        ],
      },
      {
        heading: "Use fair failure",
        body: [
          "Failure should feel connected to player action. If the player loses, they should understand why and want to try again. Sudden unexplained failure makes a small game feel unfinished.",
          "Use status messages, visible hazards, health bars, score changes, or end screens to make the result readable.",
        ],
      },
      {
        heading: "Polish through restraint",
        body: [
          "A finished small game often feels restrained. It chooses a palette, a few effects, consistent spacing, and one strong interaction. Too many generated decorations can make the game feel less deliberate.",
          "Polish is not about adding everything. It is about making the chosen parts feel intentional.",
        ],
      },
      {
        heading: "Make replay effortless",
        body: [
          "A smooth restart button can do more for a small game than an extra feature. If the player can retry quickly, they are more likely to feel the loop and improve.",
          "The best small games invite one more run. That invitation is often the final sign that the project is ready to publish.",
        ],
      },
    ],
  },
  {
    slug: "common-mistakes-in-ai-made-web-work-submissions",
    title: "Common Mistakes in AI-Made Web Work Submissions",
    description:
      "The submission mistakes that make AI-made projects harder to review: vague titles, unsafe links, thin descriptions, missing context, and broken first interactions.",
    date: "2026-07-16",
    readingTime: "8 min read",
    category: "Submission",
    tags: ["submission", "creator-guide", "metadata", "review", "publishing"],
    intro: [
      "Most weak submissions do not fail because the idea is bad. They fail because a reviewer or visitor cannot quickly understand what the work is, why it exists, or whether it is safe to open.",
      "AI-assisted development makes it easy to produce a working page quickly, but publishing requires a second kind of care. The listing, demo URL, tags, and creator notes all help turn a local experiment into a public web work.",
    ],
    relatedLinks: [
      {
        label: "How to submit to oeeco",
        href: "/blog/how-to-submit-ai-made-web-work-to-oeeco",
        description: "Read the main submission guide before sending a browser game, tool, or interactive page.",
      },
      {
        label: "Submission guidelines",
        href: "/guidelines",
        description: "Review the public rules for safe links, honest descriptions, and useful context.",
      },
      {
        label: "Submit a work",
        href: "/upload",
        description: "Open the submission form when the work is ready for review.",
      },
    ],
    sections: [
      {
        heading: "Using a vague title",
        body: [
          "A title like My AI Demo or Test App gives visitors almost no information. A better title names the format or outcome: prompt card generator, landing page copy doctor, one-button dodge game, or interview signal lab.",
          "The title does not need to explain everything, but it should create the right expectation before the visitor opens the work. Clear titles improve review, browsing, search, and sharing.",
        ],
      },
      {
        heading: "Submitting a fragile demo URL",
        body: [
          "The demo URL should open directly to the work. Reviewers should not need a private login, a local development server, a hidden password, or a long redirect chain to see the project.",
          "Before submitting, open the link in a clean browser window and complete the first interaction. If the page breaks during that first minute, the listing is not ready.",
        ],
      },
      {
        heading: "Writing a description that only repeats the title",
        body: [
          "A useful description answers what the work does, who it is for, and what happens after opening it. It should not simply restate the title with adjectives.",
          "For example, a tool description can mention the input and output. A game description can mention the core action and goal. A visual experiment can explain what the visitor controls or observes.",
        ],
      },
      {
        heading: "Hiding the AI-assisted process",
        body: [
          "Creators do not need to document every prompt, but a short note about the process helps other builders learn from the work. It can also clarify what was generated, what was edited, and what remains experimental.",
          "This context is especially useful when the project demonstrates a workflow, technique, or interface pattern other creators might reuse.",
        ],
      },
      {
        heading: "Forgetting safety and trust signals",
        body: [
          "A submission should avoid deceptive login screens, hidden downloads, unclear data collection, or misleading claims. Even a playful project needs to be safe enough for a public visitor to open.",
          "Trust signals do not have to be heavy. Clear labels, honest limitations, visible controls, and a stable public URL can make a small AI-made work feel much more review-ready.",
        ],
      },
    ],
  },
  {
    slug: "design-the-first-minute-of-an-ai-browser-game",
    title: "Design the First Minute of an AI Browser Game",
    description:
      "The first minute of a browser game should teach the goal, controls, feedback, failure, and restart loop without making the player read a manual.",
    date: "2026-07-16",
    readingTime: "8 min read",
    category: "Game Design",
    tags: ["browser-games", "onboarding", "game-design", "playability", "ai-coding"],
    intro: [
      "The first minute decides whether a small browser game feels playable. The player needs to know what to do, how to do it, what counts as success, and why failure happened.",
      "AI coding tools can generate mechanics quickly, but onboarding still needs deliberate design. A game can be technically functional and still lose visitors if the opening moments are confusing.",
    ],
    relatedLinks: [
      {
        label: "Game quality checklist",
        href: "/blog/what-makes-a-good-ai-made-browser-game",
        description: "Use the broader checklist for readable, fair, and replayable browser games.",
      },
      {
        label: "One Button Dodge",
        href: "/demos/one-button-dodge",
        description: "Study a compact example built around a simple first action.",
      },
      {
        label: "Browse games",
        href: "/categories/game",
        description: "Open more playable browser games and arcade experiments.",
      },
    ],
    sections: [
      {
        heading: "Start with one visible goal",
        body: [
          "The player should know the goal before the first action. Collect fuel, avoid hazards, land safely, survive thirty seconds, match colors, or guide a character to an exit.",
          "A small game does not need a long story to create motivation. It needs a goal that can be understood quickly and reinforced through the interface.",
        ],
      },
      {
        heading: "Teach controls through the layout",
        body: [
          "If the game uses keyboard input, show the keys. If it supports touch, make the touch area obvious. If mouse movement matters, communicate that before the player is punished for not knowing.",
          "The best first-minute design makes instructions feel like part of the game surface rather than a separate manual. Controls should be visible near the place where the player acts.",
        ],
      },
      {
        heading: "Make the first feedback unmistakable",
        body: [
          "After the first input, the game should respond clearly. Movement, soundless visual feedback, score changes, particles, status text, or object motion can all confirm that the player did something.",
          "Generated prototypes often have working logic but weak feedback. Strengthening the first response can make the same mechanic feel much more finished.",
        ],
      },
      {
        heading: "Explain failure without stopping the flow",
        body: [
          "Failure should teach. If the player hits an obstacle, runs out of energy, misses a target, or falls off the board, the game should show the cause in plain visual or textual form.",
          "A clear restart button is part of this lesson. The player should be able to try again immediately while the reason for failure is still fresh.",
        ],
      },
      {
        heading: "Use the first minute as a review tool",
        body: [
          "When reviewing an AI-made game, play only the first minute and write down every moment of confusion. Those notes usually reveal the highest-value improvements.",
          "If the first minute works, deeper content becomes more worthwhile. If it does not, adding more enemies, levels, or effects will not fix the main problem.",
        ],
      },
    ],
  },
  {
    slug: "how-to-design-inputs-for-ai-made-web-tools",
    title: "How to Design Inputs for AI-Made Web Tools",
    description:
      "Useful AI-made tools start with realistic inputs: messy notes, rough ideas, concrete constraints, and clear examples that help visitors get a better output.",
    date: "2026-07-16",
    readingTime: "8 min read",
    category: "Product Design",
    tags: ["interactive-tools", "input-design", "web-tools", "product-design", "workflow"],
    intro: [
      "The quality of an AI-made tool often depends on the inputs it asks for. If the form asks vague questions, the output will usually be vague. If it asks for realistic material, the tool can produce something useful.",
      "Input design is therefore product design. It shapes what visitors understand, what they are willing to share, and whether the result feels specific enough to act on.",
    ],
    relatedLinks: [
      {
        label: "Examples of useful tools",
        href: "/blog/examples-of-useful-ai-made-tools",
        description: "See common patterns for practical browser tools and workflow helpers.",
      },
      {
        label: "Customer Interview Signal Lab",
        href: "/demos/customer-interview-signal-lab",
        description: "Try a tool that accepts messy research notes and returns structured product signals.",
      },
      {
        label: "Tool category",
        href: "/categories/tool",
        description: "Browse more AI-made tools published on oeeco.",
      },
    ],
    sections: [
      {
        heading: "Ask for material people already have",
        body: [
          "A founder may have interview notes, rough personas, competitors, pricing guesses, or a half-written landing page. A creator may have a prompt, a project goal, a demo link, or a list of constraints.",
          "Inputs should meet visitors where they are. A tool that requires polished strategy language before it can help is often solving the wrong problem.",
        ],
      },
      {
        heading: "Separate context from the task",
        body: [
          "Good tools distinguish background context from the thing being transformed. For example, customer segment is context, while interview notes are the material being analyzed.",
          "This separation helps the output stay grounded. It also makes the interface easier to scan because each field has a clear job.",
        ],
      },
      {
        heading: "Use examples to reduce blank-page friction",
        body: [
          "Short placeholder examples can teach the visitor what kind of input works best. They should be specific enough to guide, but not so long that they look like required text.",
          "Example buttons are also useful. A sample input lets visitors see the tool's value before deciding whether to use their own material.",
        ],
      },
      {
        heading: "Avoid unnecessary sensitive data",
        body: [
          "A lightweight browser tool should not ask for private information it does not need. If a task can be completed with anonymized notes, rough summaries, or public copy, prefer those inputs.",
          "Clear input boundaries make a tool safer and easier to trust. They also reduce review risk when the project is submitted to a public gallery.",
        ],
      },
      {
        heading: "Make the output promise match the input",
        body: [
          "If the input is short, the output should be framed as a quick heuristic. If the input is detailed, the tool can reasonably return deeper structure.",
          "Visitors lose trust when a tool makes confident claims from thin material. Good input design sets honest expectations for what the result can and cannot mean.",
        ],
      },
    ],
  },
  {
    slug: "trust-signals-for-ai-made-content-sites",
    title: "Trust Signals for AI-Made Content Sites",
    description:
      "AI-made content sites need visible trust signals: author context, policy pages, review standards, safe links, contact routes, and original useful pages.",
    date: "2026-07-16",
    readingTime: "8 min read",
    category: "Trust",
    tags: ["trust", "adsense", "editorial-policy", "content-quality", "ai-made"],
    intro: [
      "A site about AI-made work has to answer a basic visitor question: can I trust what I am opening? That question matters for users, search engines, advertisers, and creators who may submit their own projects.",
      "Trust signals are not decoration. They are the public evidence that a site has an editorial owner, a purpose, safety standards, and a way to resolve mistakes.",
    ],
    relatedLinks: [
      {
        label: "Editorial policy",
        href: "/editorial-policy",
        description: "Read how oeeco approaches original content, curation, safety review, and corrections.",
      },
      {
        label: "Editorial team",
        href: "/authors/oeeco-editorial",
        description: "See the author profile for oeeco's editorial content.",
      },
      {
        label: "Site readiness",
        href: "/site-readiness",
        description: "Check core public routes, policy pages, RSS, sitemap, and AdSense basics.",
      },
    ],
    sections: [
      {
        heading: "Author context",
        body: [
          "Articles should show who is responsible for the content. For a small platform, that may be an editorial team rather than individual staff profiles, but it should still be visible and linkable.",
          "Author context helps visitors understand the perspective behind guides, reviews, and recommendations. It also makes corrections and accountability easier.",
        ],
      },
      {
        heading: "Policy pages in the footer",
        body: [
          "About, contact, privacy, terms, editorial policy, and submission guidelines should be reachable without logging in. These pages tell visitors how the site works and what standards it follows.",
          "For AdSense review, visible policy and trust pages help show that the site is more than a collection of thin pages or anonymous generated content.",
        ],
      },
      {
        heading: "Safe and honest outbound links",
        body: [
          "A gallery of web works depends on links. Each listed project should be described honestly, avoid deceptive redirects, and open in a way that matches visitor expectations.",
          "The site should also make it clear when a work is a prototype, a game, a tool, or a visual experiment. Accurate labels are a trust signal.",
        ],
      },
      {
        heading: "Original pages with a real purpose",
        body: [
          "Trust grows when pages help visitors do something: choose a project to open, prepare a submission, understand a review standard, or learn a pattern for building better work.",
          "Original content does not mean every page must be long. It means the page should have a clear job and enough substance to satisfy that job.",
        ],
      },
      {
        heading: "A route for corrections",
        body: [
          "Mistakes will happen as a site grows. A visible contact route and editorial policy give visitors and creators a way to report broken links, inaccurate descriptions, safety concerns, or outdated information.",
          "A correction process is a simple signal that the site expects to be maintained, not abandoned after launch.",
        ],
      },
    ],
  },
  {
    slug: "orbital-salvage-case-study-ai-browser-game",
    title: "Orbital Salvage Case Study: A Deeper AI-Made Browser Game",
    description:
      "An editorial case study of Orbital Salvage, focusing on physics feel, recovery goals, failure feedback, and why a small AI-made game can feel substantial.",
    date: "2026-08-11",
    readingTime: "10 min read",
    category: "Case Study",
    tags: ["case-study", "orbital-salvage", "browser-games", "physics", "game-design"],
    intro: [
      "Orbital Salvage is one of the more useful oeeco examples because it shows how an AI-assisted game can move beyond a one-screen toy. The work has a recognizable setting, a physical movement model, and a recovery objective that gives the player a reason to keep correcting their path.",
      "This case study looks at the page as a visitor would experience it: what the first minute teaches, where the interaction earns attention, and what creators can learn when turning a generated prototype into a public browser game.",
    ],
    relatedLinks: [
      {
        label: "Try Orbital Salvage",
        href: "/demos/orbital-salvage",
        description: "Open the space recovery game and inspect the physics loop directly.",
      },
      {
        label: "First-minute game design",
        href: "/blog/design-the-first-minute-of-an-ai-browser-game",
        description: "Read the companion guide for onboarding and early feedback in browser games.",
      },
      {
        label: "Browse game works",
        href: "/categories/game",
        description: "See more playable AI-made game works on oeeco.",
      },
    ],
    sections: [
      {
        heading: "What the work promises",
        body: [
          "The promise is not just space visuals. The promise is precision recovery under motion constraints. That matters because a game becomes easier to judge when the visitor can name the loop: approach, correct velocity, avoid overshooting, recover the target, and try to do it with more control.",
          "For AdSense and content quality, this distinction is important. The page is not a thin entry around a canvas. It supports an actual interactive claim that a visitor can test.",
        ],
      },
      {
        heading: "Why the physics loop creates value",
        body: [
          "Physics-driven browser games are good candidates for AI-assisted building because small tuning changes are immediately visible. Acceleration, drift, friction, collision recovery, and camera feedback all shape whether the player feels in control.",
          "Orbital Salvage gives creators something to study: the difference between code that technically moves an object and a loop that creates tension. That is a practical lesson for anyone using Codex to build small games.",
        ],
      },
      {
        heading: "What the first minute needs to do",
        body: [
          "The opening minute should teach the player that movement has inertia and that recovery is a controlled action, not a simple click. Good status text and visible objectives reduce the risk that a visitor dismisses the game as confusing.",
          "The strongest version of this work is one where the page explains just enough, then lets the player learn by overcorrecting once or twice. That kind of failure is useful because it teaches the core mechanic.",
        ],
      },
      {
        heading: "What creators can reuse",
        body: [
          "Creators can reuse the pattern: pick a small physical system, give it one objective, and make the interface explain the consequence of each action. The result does not need a large world to feel like a finished game.",
          "A case like this is also a reminder that AI-generated mechanics need editorial judgment. The creator still decides which controls matter, which feedback is readable, and which extra features would dilute the loop.",
        ],
      },
      {
        heading: "What would make it stronger",
        body: [
          "The next improvements would be clearer mission summaries, a short post-run debrief, and a compact list of what changed between attempts. Those additions would deepen the learning loop without making the game heavier.",
          "That is the main lesson: small AI-made games become more valuable when they explain their own interaction well enough for visitors to study them, not only play them once.",
        ],
      },
    ],
  },
  {
    slug: "customer-interview-signal-lab-editorial-review",
    title: "Customer Interview Signal Lab: Editorial Review of an AI-Made Research Tool",
    description:
      "A practical review of Customer Interview Signal Lab, an AI-made browser tool that turns messy interview notes into product evidence, themes, and next questions.",
    date: "2026-08-11",
    readingTime: "10 min read",
    category: "Case Study",
    tags: ["case-study", "customer-interviews", "interactive-tools", "startup", "research"],
    intro: [
      "Customer Interview Signal Lab is useful because it starts from a real founder problem: interviews are messy, and weak evidence often sounds convincing until someone forces it into a structure.",
      "This review looks at the tool as a small product rather than as a demo. The important question is whether it helps a visitor make a better next research decision.",
    ],
    relatedLinks: [
      {
        label: "Try Customer Interview Signal Lab",
        href: "/demos/customer-interview-signal-lab",
        description: "Use the tool with sample or real interview notes.",
      },
      {
        label: "Input design for AI tools",
        href: "/blog/how-to-design-inputs-for-ai-made-web-tools",
        description: "Read how realistic inputs improve AI-made tool output.",
      },
      {
        label: "Browse tool works",
        href: "/categories/tool",
        description: "Find more workflow-focused browser tools.",
      },
    ],
    sections: [
      {
        heading: "The job it performs",
        body: [
          "The tool does one focused job: it turns raw customer notes into evidence signals. That is stronger than a generic writing assistant because the visitor understands what kind of material to bring and what kind of result to expect.",
          "A useful research tool should not pretend to replace judgment. It should make judgment easier. This tool does that by separating signal strength, themes, next questions, and watchouts.",
        ],
      },
      {
        heading: "Why the inputs feel realistic",
        body: [
          "Founders rarely have perfect research data. They have fragments: quotes, objections, alternative tools, goals, and guesses about urgency. The tool asks for material that resembles that real mess.",
          "That makes the interface more credible. A tool that requires polished research language before it can help would fail at the moment when early teams actually need support.",
        ],
      },
      {
        heading: "Where the output becomes useful",
        body: [
          "The best output is not a fluent paragraph. It is a structure that changes what the user does next. Signal scores, themes, and next interview questions can help a founder decide whether to keep exploring, narrow the audience, or ask harder questions.",
          "This is why interactive tools can be stronger than static blog posts. The visitor can test the workflow on their own material instead of merely reading advice.",
        ],
      },
      {
        heading: "Trust and limitation signals",
        body: [
          "The tool should be framed as a decision aid, not an authority. The output is a heuristic review of notes, and the visitor still owns the interpretation.",
          "That limitation is a trust signal. It keeps the page honest and makes the tool more acceptable as a public web work.",
        ],
      },
      {
        heading: "What would make it stronger",
        body: [
          "The strongest next feature would be a before-and-after comparison: what the notes said, what signal was extracted, and which follow-up question came from which evidence. That would make the reasoning easier to inspect.",
          "Even without that, the tool already demonstrates a valuable pattern for oeeco: a narrow workflow, realistic inputs, structured output, and a result a visitor can act on.",
        ],
      },
    ],
  },
  {
    slug: "landing-page-copy-doctor-ai-tool-review",
    title: "Landing Page Copy Doctor Review: A Useful AI-Made Messaging Tool",
    description:
      "A case study of Landing Page Copy Doctor and what it teaches about narrow AI-made tools, practical outputs, and honest copy review.",
    date: "2026-08-11",
    readingTime: "9 min read",
    category: "Case Study",
    tags: ["case-study", "copywriting", "interactive-tools", "landing-pages", "product-design"],
    intro: [
      "Landing Page Copy Doctor is a good example of a small AI-made tool with a narrow promise. It does not try to become a complete marketing platform. It helps a visitor examine a page message and find what is unclear.",
      "That narrowness is a strength. For AdSense quality and visitor value, a focused tool that improves one decision can be better than a broad demo that produces generic advice.",
    ],
    relatedLinks: [
      {
        label: "Try Landing Page Copy Doctor",
        href: "/demos/landing-page-copy-doctor",
        description: "Run a landing page message through the diagnosis workflow.",
      },
      {
        label: "Why interactive tools beat static demos",
        href: "/blog/why-interactive-tools-beat-static-ai-demos",
        description: "Read why visitor-controlled tools are stronger than passive examples.",
      },
      {
        label: "Tool category",
        href: "/categories/tool",
        description: "Browse more useful AI-made tools.",
      },
    ],
    sections: [
      {
        heading: "The narrow promise",
        body: [
          "The tool is useful because the user knows what to bring: a headline, message, or landing page draft. The output can then focus on clarity, proof, audience fit, and action.",
          "A broad copy assistant often produces polished language without diagnosing the problem. A doctor-style tool has a better frame because it begins with what might be weak.",
        ],
      },
      {
        heading: "Why diagnosis beats generation",
        body: [
          "Many AI tools rush to rewrite. Diagnosis is often more valuable because it tells the visitor what is missing: a clear customer, a concrete outcome, a reason to believe, or a specific next step.",
          "That makes the result easier to evaluate. The visitor can disagree with a diagnosis, but at least the tool has shown its criteria.",
        ],
      },
      {
        heading: "What creators can learn",
        body: [
          "This pattern works beyond copywriting. A good AI-made tool can act as a lightweight reviewer for a specific artifact: an interview note, a launch checklist, a pitch, a prompt, or a product idea.",
          "The lesson is to build around a decision point. When a tool helps a visitor decide what to fix next, it has more value than a demo that only proves generation is possible.",
        ],
      },
      {
        heading: "What the page should make clear",
        body: [
          "The page should explain that the output is a heuristic review. It should avoid implying that a score or rewrite guarantees conversion.",
          "Clear limitations make the tool more trustworthy. They also help visitors use the result as a draft for thinking rather than as a final authority.",
        ],
      },
      {
        heading: "What would make it stronger",
        body: [
          "A stronger version would show the reason behind every recommendation and offer multiple rewrite directions: clearer, more specific, more credible, or more concise.",
          "The core value is already there: a visitor can bring real material, receive structured feedback, and leave with a more concrete next edit.",
        ],
      },
    ],
  },
  {
    slug: "one-button-dodge-first-minute-review",
    title: "One Button Dodge: A First-Minute Review of a Tiny Browser Game",
    description:
      "A close review of One Button Dodge and how a very small AI-made game can teach controls, feedback, failure, and replay in the first minute.",
    date: "2026-08-11",
    readingTime: "9 min read",
    category: "Case Study",
    tags: ["case-study", "one-button", "browser-games", "arcade", "game-feel"],
    intro: [
      "One Button Dodge is intentionally small, which makes it useful to study. There is nowhere for the design to hide. The game either teaches one action clearly or it loses the visitor.",
      "This review focuses on the first minute: the moment when a visitor decides whether a tiny game feels fair, readable, and worth another run.",
    ],
    relatedLinks: [
      {
        label: "Try One Button Dodge",
        href: "/demos/one-button-dodge",
        description: "Open the compact arcade loop and study the first interaction.",
      },
      {
        label: "Design the first minute",
        href: "/blog/design-the-first-minute-of-an-ai-browser-game",
        description: "Read the broader first-minute game design framework.",
      },
      {
        label: "Browse browser games",
        href: "/categories/game",
        description: "Find more playable AI-made games.",
      },
    ],
    sections: [
      {
        heading: "Why small games are revealing",
        body: [
          "A one-button game cannot rely on a large feature list. It has to create clarity through timing, feedback, and consequence. That makes it a strong test of whether an AI-assisted prototype has been edited by someone with taste.",
          "The advantage is focus. A visitor can understand the promise quickly and judge the feel immediately.",
        ],
      },
      {
        heading: "The first action matters",
        body: [
          "The first press should visibly change the game state. If the player cannot tell what happened, the loop fails before difficulty even matters.",
          "For one-button games, input feedback can be the whole interface. Movement, color, spacing, score, and animation all become teaching tools.",
        ],
      },
      {
        heading: "Failure should feel fair",
        body: [
          "A small dodge game needs failure that the player can read. If the hazard is unclear or the timing feels random, the player will blame the page rather than their decision.",
          "Fair failure creates replay. The player should think, I almost had that, not I do not know what happened.",
        ],
      },
      {
        heading: "The restart loop is part of the product",
        body: [
          "The restart action should be immediate. A tiny game earns attention through repeated attempts, and any friction between attempts damages the core experience.",
          "This is one of the easiest places for creators to improve AI-generated games. A clear end state and fast retry can make the same mechanic feel more polished.",
        ],
      },
      {
        heading: "What the example teaches",
        body: [
          "One Button Dodge teaches that a public game does not need to be large to be valuable. It needs to make one interaction legible enough that visitors can feel improvement.",
          "For oeeco, examples like this help define the lower bound of a good game listing: small is fine, but the loop must be readable, fair, and worth trying again.",
        ],
      },
    ],
  },
  {
    slug: "micro-saas-validation-lab-case-study",
    title: "Micro SaaS Validation Lab Case Study: Turning an Idea Into Testable Risks",
    description:
      "A case study of Micro SaaS Validation Lab and how AI-made browser tools can help founders map risk, audience, pricing, and next experiments.",
    date: "2026-08-11",
    readingTime: "10 min read",
    category: "Case Study",
    tags: ["case-study", "micro-saas", "validation", "interactive-tools", "startup"],
    intro: [
      "Micro SaaS Validation Lab is useful because it does not treat every idea as equally ready. It asks for the audience, problem, willingness to pay, and go-to-market context, then turns that input into a structured risk picture.",
      "That makes it a good example of an AI-made web tool: it compresses a messy early-stage thinking session into a repeatable browser workflow.",
    ],
    relatedLinks: [
      {
        label: "Try Micro SaaS Validation Lab",
        href: "/demos/micro-saas-validation-lab",
        description: "Run a product idea through the validation workflow.",
      },
      {
        label: "AI web app publishing checklist",
        href: "/blog/ai-web-app-publishing-checklist",
        description: "Use the pre-publish checklist for AI-assisted web apps.",
      },
      {
        label: "Interactive tools topic",
        href: "/blog/topics/interactive-tools",
        description: "Explore more articles about practical AI-made browser tools.",
      },
    ],
    sections: [
      {
        heading: "The value is in risk mapping",
        body: [
          "Early product ideas often sound better when they are vague. A validation tool is useful when it makes risk visible: unclear buyer, weak urgency, missing channel, unsupported pricing, or too many assumptions.",
          "The lab format works because it invites comparison. A founder can run several ideas through the same structure and see which one produces a more believable next experiment.",
        ],
      },
      {
        heading: "Why the workflow belongs in the browser",
        body: [
          "A browser tool reduces friction. The visitor can test an idea without installing software, opening a spreadsheet, or building a long document first.",
          "That immediacy matters for AI-made tools. The page becomes a working surface, not a static article about validation.",
        ],
      },
      {
        heading: "Good scoring needs explanation",
        body: [
          "Scores are useful only when the criteria are visible. A validation score should explain what pushed it up or down and what evidence would change the result.",
          "This is where many AI demos fail. They give a number without a reasoning structure. A stronger tool makes the score inspectable.",
        ],
      },
      {
        heading: "The output should lead to action",
        body: [
          "A good validation tool should end with the next experiment: who to interview, what landing page to test, what pricing question to ask, or what concierge version to build.",
          "That action orientation is what makes the tool valuable. It does not merely summarize the idea; it helps the visitor decide what to do next.",
        ],
      },
      {
        heading: "What creators can learn",
        body: [
          "The pattern is reusable: take an ambiguous business question, break it into criteria, ask for realistic input, and return a structured next step.",
          "For oeeco, Micro SaaS Validation Lab demonstrates that AI-made tools can provide value without pretending to be complete SaaS products. A focused browser workflow can be enough.",
        ],
      },
    ],
  },
];

export const blogPosts: BlogPost[] = [...archiveBlogPosts, ...fieldNotesBlogPosts];

export function getAllBlogPosts() {
  return [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));
}

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
