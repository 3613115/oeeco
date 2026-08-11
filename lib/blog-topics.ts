export type BlogTopic = {
  slug: string;
  title: string;
  description: string;
  summary: string;
  links: [string, string][];
  postSlugs: string[];
};

export const blogTopics: BlogTopic[] = [
  {
    slug: "creator-submissions",
    title: "Creator submissions",
    description: "Prepare safer, clearer AI-made web works for review and publication.",
    summary:
      "Guides for creators who want to submit AI-made games, tools, and interactive pages with clear metadata, safe links, and useful context.",
    links: [
      ["Submission guide", "/blog/how-to-submit-ai-made-web-work-to-oeeco"],
      ["Submission guidelines", "/guidelines"],
      ["Submit a work", "/upload"],
    ],
    postSlugs: [
      "common-mistakes-in-ai-made-web-work-submissions",
      "how-to-submit-ai-made-web-work-to-oeeco",
      "ai-web-app-publishing-checklist",
      "checklist-for-publishing-safe-interactive-web-projects",
      "difference-between-ai-demos-and-shipped-web-works",
    ],
  },
  {
    slug: "browser-games",
    title: "Browser games",
    description: "Learn what makes small AI-assisted games playable, readable, and worth replaying.",
    summary:
      "Game design notes for AI-assisted browser games, from focused loops and control feel to failure feedback and finished presentation.",
    links: [
      ["Game quality checklist", "/blog/what-makes-a-good-ai-made-browser-game"],
      ["Game category", "/categories/game"],
      ["Orbital Salvage", "/demos/orbital-salvage"],
    ],
    postSlugs: [
      "orbital-salvage-case-study-ai-browser-game",
      "one-button-dodge-first-minute-review",
      "design-the-first-minute-of-an-ai-browser-game",
      "best-ai-made-browser-games-to-study",
      "what-makes-a-good-ai-made-browser-game",
      "how-to-make-a-small-web-game-feel-finished",
      "how-codex-changes-small-web-games",
    ],
  },
  {
    slug: "interactive-tools",
    title: "Interactive tools",
    description: "Turn prompts and workflows into useful browser tools people can test on their own material.",
    summary:
      "Practical articles about AI-made tools, prompt workflows, validation labs, research helpers, and repeatable browser-based utilities.",
    links: [
      ["Prompt to web tool", "/blog/turn-a-prompt-into-a-playable-web-tool"],
      ["Tool category", "/categories/tool"],
      ["Customer Interview Signal Lab", "/demos/customer-interview-signal-lab"],
    ],
    postSlugs: [
      "customer-interview-signal-lab-editorial-review",
      "landing-page-copy-doctor-ai-tool-review",
      "micro-saas-validation-lab-case-study",
      "how-to-design-inputs-for-ai-made-web-tools",
      "why-interactive-tools-beat-static-ai-demos",
      "turn-a-prompt-into-a-playable-web-tool",
      "how-to-review-an-ai-made-web-tool",
      "examples-of-useful-ai-made-tools",
    ],
  },
  {
    slug: "review-and-trust",
    title: "Review and trust",
    description: "Understand oeeco's publishing standards, safety expectations, and editorial approach.",
    summary:
      "Trust, review, safety, and editorial context for visitors, creators, and search engines evaluating oeeco as a content platform.",
    links: [
      ["Review process", "/blog/how-oeeco-reviews-ai-made-works"],
      ["Editorial policy", "/editorial-policy"],
      ["Safety checklist", "/blog/checklist-for-publishing-safe-interactive-web-projects"],
    ],
    postSlugs: [
      "customer-interview-signal-lab-editorial-review",
      "trust-signals-for-ai-made-content-sites",
      "how-oeeco-reviews-ai-made-works",
      "checklist-for-publishing-safe-interactive-web-projects",
      "why-ai-creators-need-public-portfolios",
      "what-are-ai-made-web-works",
    ],
  },
  {
    slug: "case-studies",
    title: "Case studies",
    description: "Detailed editorial reviews of specific AI-made games, tools, and browser experiments on oeeco.",
    summary:
      "Real examples from the oeeco gallery, reviewed for first-minute experience, input design, safety signals, usefulness, and what other creators can learn.",
    links: [
      ["Orbital Salvage review", "/blog/orbital-salvage-case-study-ai-browser-game"],
      ["Customer Interview Signal Lab review", "/blog/customer-interview-signal-lab-editorial-review"],
      ["Browse latest works", "/latest"],
    ],
    postSlugs: [
      "orbital-salvage-case-study-ai-browser-game",
      "customer-interview-signal-lab-editorial-review",
      "landing-page-copy-doctor-ai-tool-review",
      "one-button-dodge-first-minute-review",
      "micro-saas-validation-lab-case-study",
    ],
  },
];

export function getAllBlogTopics() {
  return blogTopics;
}

export function getBlogTopic(slug: string) {
  return blogTopics.find((topic) => topic.slug === slug);
}
