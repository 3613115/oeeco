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

export const blogAuthor = "oeeco Editorial";

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
];

export function getAllBlogPosts() {
  return [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));
}

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
