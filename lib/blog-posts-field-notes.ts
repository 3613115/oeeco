import type { BlogPost } from "@/lib/blog-types";

export const fieldNotesBlogPosts: BlogPost[] = [
  {
    slug: "ai-prompt-card-generator-three-prompt-test",
    title: "Three Topics Through the AI Prompt Card Generator",
    description:
      "A hands-on test of the AI Prompt Card Generator with a game, a tool, and a visual experiment, including what its template clarifies and what it cannot decide.",
    date: "2026-08-11",
    readingTime: "9 min read",
    category: "Field Test",
    tags: ["prompt-design", "field-test", "interactive-tools", "creative-coding", "briefs"],
    intro: [
      "Prompt generators are easy to demo and surprisingly hard to make useful. A prompt can look organized while leaving the user with the same fuzzy idea they started with. We put three deliberately different topics into oeeco's AI Prompt Card Generator to see what its template clarifies before the prompt is taken to a model.",
      "The page does not call an AI service or generate a finished brief. It assembles a copyable prompt from the selected goal, tone, output format, topic, and two rotating constraints. That boundary is important when judging what the tool actually does.",
    ],
    testedWith: [
      "A vague game idea: a calm game about repairing satellites",
      "A narrow tool: turn interview notes into follow-up questions",
      "A visual experiment: a poster that changes with local weather",
    ],
    verdict:
      "The generator is best at turning a blank page into a structured request. It cannot tell whether the request contains a good product decision, so the creator still has to replace vague language with testable constraints.",
    keyTakeaways: [
      "Use the card to define behavior, not to decorate the original idea.",
      "Rewrite any phrase that could describe a hundred unrelated products.",
      "A useful card ends with a first-session build target.",
    ],
    relatedLinks: [
      {
        label: "Try the Prompt Card Generator",
        href: "/demos/ai-prompt-card-generator",
        description: "Run your own idea through the card workflow and compare the result with these notes.",
      },
      {
        label: "Prompt to playable tool",
        href: "/blog/turn-a-prompt-into-a-playable-web-tool",
        description: "Move from a written brief to a browser interaction someone can test.",
      },
      {
        label: "Interactive tools",
        href: "/blog/topics/interactive-tools",
        description: "Browse practical notes on focused browser tools.",
      },
    ],
    sections: [
      {
        heading: "What the generated card contains",
        body: [
          "Every card names the model's role, repeats the topic, describes a tone, requests one of four output formats, adds two rotating constraints, and finishes with a silent quality check. The structure is visible in a plain-text preview and can be copied without creating an account.",
          "Because the card is deterministic, its value is easy to inspect. Changing from Creative brief to Step plan changes the requested sections; pressing Refresh changes the constraint pair. The page does not pretend those controls have already produced the final answer.",
        ],
        note: {
          label: "Boundary we verified",
          text: "The score measures properties of the assembled prompt, such as topic length and selected format. It is not a prediction of output quality.",
        },
      },
      {
        heading: "Topic one: the satellite-repair game",
        body: [
          "Selecting Game concept and Step plan asks for scope, components, states, edge cases, polish, and QA. That is a sensible starting structure, but the topic still carries most of the design burden. A calm game about repairing satellites does not say how the ship moves or how a run ends.",
          "We strengthened the topic before copying it: a three-minute satellite-recovery game with visible inertia, short thrust bursts, and no combat. The tool preserved those constraints and wrapped them in an implementation request. The quality came from the edit, not from pressing Refresh.",
        ],
      },
      {
        heading: "Topic two: the interview tool",
        body: [
          "The tool topic was already concrete: turn interview notes into follow-up questions and cite the phrase that triggered each question. With Tool spec and JSON schema selected, the card asked for predictable keys and practical next steps. The mismatch was useful: the generic JSON keys did not include evidence citations.",
          "We added citation requirements directly to the topic. This is a good example of what the generator cannot infer. The format control supplies a skeleton; domain-specific trust requirements still belong to the person preparing the prompt.",
        ],
      },
      {
        heading: "Topic three: the weather poster",
        body: [
          "Visual idea plus Creative brief produced the most natural template for a poster that changes with local weather. It requested visual direction, interaction, and success criteria. It did not add location permission, API failure, or an offline mode, because none of those requirements existed in our topic.",
          "Our final topic specified manual weather controls for the first version and live data only as a later enhancement. If the visual mappings are not interesting under manual rain, wind, and clear states, an API will not rescue them.",
        ],
        bullets: [
          "Use goal and format to choose the shape of the request.",
          "Use the topic field to carry real product constraints.",
          "Read the preview before copying; Refresh only changes the constraint angle.",
        ],
      },
      {
        heading: "What the generator is actually good for",
        body: [
          "The card is not a substitute for a product brief and it does not execute the prompt. It is a way to see whether a request names a user action, an output shape, and a measurable signal before sending it elsewhere.",
          "Used that way, the page earns its place between an exciting thought and a coding session. The most productive interaction is often editing the topic, not chasing a higher prompt-strength score.",
        ],
      },
    ],
  },
  {
    slug: "idea-mutation-machine-workshop-notes",
    title: "We Compared 12 Mutations of One Product Idea",
    description:
      "Workshop notes from running a meeting-notes product through four Idea Mutation Machine settings and comparing the 12 resulting directions.",
    date: "2026-08-11",
    readingTime: "10 min read",
    category: "Workshop Notes",
    tags: ["idea-generation", "product-strategy", "workshop", "interactive-tools", "constraints"],
    intro: [
      "More ideas are not automatically more choice. After several variations, people often stop comparing substance and start reacting to names. We wanted to see whether Idea Mutation Machine could help with the harder job: changing the shape of an idea without losing the problem underneath it.",
      "Our starting point was intentionally ordinary: a tool that turns meeting notes into tasks. The page returns three cards for each direction-and-strength pair. We reviewed Tool / Small, Tool / Medium, Tool / Wild, and Weird / Small: twelve visible mutations in total.",
    ],
    testedWith: [
      "Seed: a tool that turns meeting notes into tasks",
      "Four setting pairs, three cards each",
      "A keep / adapt / discard review pass",
    ],
    verdict:
      "Mutation works when it changes an assumption. Variations that only swap tone, audience labels, or product names create motion without progress.",
    keyTakeaways: [
      "Judge mutations by changed assumptions, not novelty of wording.",
      "Keep a discard pile and write one reason for every rejection.",
      "Combine two partial ideas only when their workflows genuinely reinforce each other.",
    ],
    relatedLinks: [
      {
        label: "Try Idea Mutation Machine",
        href: "/demos/idea-mutation-machine",
        description: "Generate controlled variations from one seed idea.",
      },
      {
        label: "Micro SaaS validation case study",
        href: "/blog/micro-saas-validation-lab-case-study",
        description: "Take a surviving idea into a more structured risk review.",
      },
      {
        label: "Tool gallery",
        href: "/categories/tool",
        description: "See other browser tools built around narrow decisions.",
      },
    ],
    sections: [
      {
        heading: "The four directions we kept for a second pass",
        body: [
          "Input-to-output helper kept the original narrowness. Quality inspector introduced review criteria before task creation. Workflow mapper made blockers and owners explicit. Autopsy tool inverted the sequence by asking why the workflow might fail before proposing a build.",
          "These were not finished product concepts. They were the four cards whose build notes would cause meaningfully different interfaces. The other cards were still readable, but they either widened the product too quickly or moved it into a different genre.",
        ],
        table: {
          columns: ["Mutation", "What changed", "Why it survived"],
          rows: [
            ["Input-to-output helper", "Scope", "Keeps one input and structured output"],
            ["Quality inspector", "Decision rule", "Adds criteria and severity"],
            ["Workflow mapper", "Output", "Adds stages, blockers, and owners"],
            ["Autopsy tool", "Sequence", "Starts with failure modes"],
          ],
        },
      },
      {
        heading: "What we discarded",
        body: [
          "Personal calculator imposed a score without identifying a meaningful quantity. Negotiation simulator added personas and objections that pulled attention away from the meeting record. The three Weird / Small cards were entertaining reframes, but receipt, ritual, and object-point-of-view interfaces did not improve the underlying accountability job.",
          "Writing down these reasons was useful. The machine always returns polished cards; it does not mark a direction as unsuitable for the seed. A discard pile turns generation into an editorial process.",
        ],
        bullets: [
          "Discarded: a score without a defensible measure.",
          "Discarded: a social mechanic before the private workflow worked.",
          "Discarded: a playful format that obscured owners and dates.",
          "Adapt later: constraint engine, once the core output is stable.",
        ],
      },
      {
        heading: "A better mutation prompt",
        body: [
          "The page does not accept a custom mutation instruction; it offers four directions and three strengths. We treated those controls as lenses, then compared the card fields: hook, build, audience, and validation signal. Keeping the original seed visible on every copied card made comparison easier.",
          "For a second pass, we would take one surviving card into a separate brief and make it smaller. The machine is good at proposing directions, not reconciling them into a build plan.",
        ],
      },
      {
        heading: "How we would run the workshop again",
        body: [
          "Twelve mutations were enough. We would also invite one person to defend the original idea, because mutation sessions can reward novelty even when the simple version is better.",
          "The machine is most useful in the middle of a process: after a problem is understood, before a solution is treated as inevitable. Used too early, it multiplies vague ideas. Used too late, it becomes decoration around a plan nobody wants to revisit.",
        ],
      },
    ],
  },
  {
    slug: "evo-colony-system-design-teardown",
    title: "Evo Colony and the Difference Between Activity and a System",
    description:
      "A design teardown of Evo Colony: how visible rules, delayed consequences, and readable state turn a moving simulation into something a visitor can reason about.",
    date: "2026-08-11",
    readingTime: "11 min read",
    category: "Design Teardown",
    tags: ["simulation", "systems-design", "evo-colony", "game-design", "feedback"],
    intro: [
      "A simulation can stay busy while saying almost nothing. Dots move, counters change, and the screen looks alive, but the visitor cannot form a theory about why one colony survives and another collapses. Evo Colony is worth examining because it sits directly on that line between animation and system.",
      "We approached it with a pencil beside the keyboard. After each run, we wrote one prediction before changing a control. If the next state could not confirm or challenge that prediction, the interface was producing activity rather than legible cause and effect.",
    ],
    testedWith: ["Three short runs", "One variable changed per run", "Predictions written before each change"],
    verdict:
      "The colony becomes interesting when visitors can tell a causal story after a run. Motion attracts attention; inspectable rules are what give the experiment lasting value.",
    keyTakeaways: [
      "Change one variable at a time when evaluating a simulation.",
      "Show consequences at the same visual level as controls.",
      "A post-run explanation is more valuable than another decorative effect.",
    ],
    relatedLinks: [
      {
        label: "Try Evo Colony",
        href: "/demos/evo-colony",
        description: "Run the colony and test your own predictions.",
      },
      {
        label: "Browser games topic",
        href: "/blog/topics/browser-games",
        description: "Read more notes on loops, feedback, and replay.",
      },
      {
        label: "How small games feel finished",
        href: "/blog/how-to-make-a-small-web-game-feel-finished",
        description: "A practical polish guide for compact interactive systems.",
      },
    ],
    sections: [
      {
        heading: "Run one: watching without a hypothesis",
        body: [
          "Our first run was the least useful. We watched population numbers and movement but did not know what to look for. The colony changed, yet the result felt arbitrary because we had not connected a rule to an expected consequence.",
          "This is how many visitors encounter simulations. The page may explain the controls, but it rarely gives them a question. A small prompt such as can a dense colony survive with low resources? would create a reason to observe.",
        ],
      },
      {
        heading: "Run two: one changed condition",
        body: [
          "For the second run we held the starting population steady and changed resource pressure. That made slower growth meaningful. We could compare what we saw with the previous run instead of simply noticing that numbers were different.",
          "The interface would benefit from preserving the prior result. Even a compact previous run line, with peak population and survival time, would turn experimentation into comparison. The visitor should not need to remember a moving counter.",
        ],
        table: {
          columns: ["Observed signal", "Possible reading", "What would verify it"],
          rows: [
            ["Fast early growth", "Resources are initially abundant", "Repeat with lower supply"],
            ["Sharp late decline", "Consumption outruns renewal", "Show resource trend beside population"],
            ["Stable small group", "A sustainable range exists", "Run longer with the same settings"],
          ],
        },
      },
      {
        heading: "Readable systems need a memory",
        body: [
          "A system has relationships over time. If the page shows only the current frame, the visitor has to infer those relationships from motion. A tiny history chart, event log, or before-and-after summary can carry more explanatory weight than richer animation.",
          "This does not mean turning the work into analytics software. Three traces are enough: population, available resources, and one pressure variable. The goal is to help the visitor test a story, not to expose every internal value.",
        ],
        note: {
          label: "Most valuable next feature",
          text: "Keep the previous run visible and explain the largest turning point in one sentence.",
        },
      },
      {
        heading: "Where AI assistance helps and where it does not",
        body: [
          "A coding agent can build agents, timers, random variation, and controls quickly. It can also add complexity faster than a visitor can understand it. The editorial task is to decide which rule deserves to be visible and which can stay underneath the surface.",
          "Evo Colony is strongest as a small thinking object. It does not need scientific authority or endless configuration. It needs rules that are consistent enough for a visitor to make a prediction, be wrong for an intelligible reason, and try once more.",
        ],
      },
    ],
  },
  {
    slug: "mood-garden-interaction-critique",
    title: "Mood Garden: Can a Gentle Visual Tool Still Have Clear Controls?",
    description:
      "An interaction critique of Mood Garden, looking at emotional labels, sliders, animation, export, and the risk of confusing atmosphere with usability.",
    date: "2026-08-11",
    readingTime: "8 min read",
    category: "Interaction Critique",
    tags: ["mood-garden", "visual-tools", "interaction-design", "canvas", "accessibility"],
    intro: [
      "Mood Garden is not trying to optimize a business decision. It offers a quieter kind of utility: choose a feeling, adjust the scene, and save a small visual object. That makes conventional product language a poor fit for reviewing it.",
      "The relevant questions are closer to instrument design. Do the controls produce changes a person can notice? Does the animation support the feeling or merely fill the screen? Can someone make a deliberate result, or are they only pressing remix until something pleasant appears?",
    ],
    testedWith: ["Four mood presets", "Minimum and maximum slider positions", "Reseed and PNG export", "Keyboard-only pass"],
    verdict:
      "Mood Garden succeeds when each control has a visible signature. Its softness is part of the work, but the relationship between choice and result still needs to be crisp.",
    keyTakeaways: [
      "Emotional labels need concrete visual behavior behind them.",
      "Randomness feels better when one or two properties remain stable.",
      "Export turns a passing animation into an artifact the visitor owns.",
    ],
    relatedLinks: [
      {
        label: "Grow a Mood Garden",
        href: "/demos/mood-garden",
        description: "Try the visual generator and save a result.",
      },
      {
        label: "Browse visual works",
        href: "/categories/visual",
        description: "Explore more AI-assisted visual experiments.",
      },
      {
        label: "What are AI-made web works?",
        href: "/blog/what-are-ai-made-web-works",
        description: "See where visual instruments fit in the broader category.",
      },
    ],
    sections: [
      {
        heading: "The presets need to behave, not just sound, different",
        body: [
          "Labels such as calm or electric create an expectation before the canvas changes. If presets only swap colors, the emotional vocabulary is doing more work than the system. A stronger mapping changes density, movement speed, contrast, and the balance between stable plants and drifting lights.",
          "We found the presets easiest to distinguish when switching directly between two extremes. That suggests the individual states are pleasant, but their signatures could be stronger. A user should be able to recognize a preset from motion with the label hidden.",
        ],
      },
      {
        heading: "Sliders should answer a visible question",
        body: [
          "Density is understandable because more objects appear. Bloom light is subtler: it affects glow and atmosphere, but its effect competes with the animation. The label could be more literal, or the preview could briefly emphasize what changed when the control moves.",
          "This is a common issue in generative tools. A technically real parameter is not automatically a useful control. The best controls correspond to differences ordinary visitors can name without reading implementation notes.",
        ],
        table: {
          columns: ["Control", "Change we noticed", "Clarity"],
          rows: [
            ["Mood", "Palette and scene character", "Clear at the extremes"],
            ["Density", "Number of plants and lights", "Immediate"],
            ["Bloom light", "Glow and softness", "Subtle while moving"],
            ["New Seed", "Composition changes, mood remains", "Clear and useful"],
          ],
        },
      },
      {
        heading: "Randomness needs continuity",
        body: [
          "The reseed action works because it changes the composition without discarding the selected mood. That continuity matters. Pure randomness can make a tool feel like a slot machine; constrained randomness lets the visitor explore a visual family.",
          "The status message also helps. It confirms that a new garden grew from the same mood, which is a small but precise explanation of what remained stable.",
        ],
      },
      {
        heading: "Export changes the meaning of the page",
        body: [
          "Without export, Mood Garden would be a short-lived animation. Saving a PNG makes the result usable as a background, moodboard fragment, or personal record. The download does not need to promise more than that.",
          "The next improvement we would test is a still preview before download, especially on small screens. It would let the visitor check the exact frame they are about to keep and make the export feel intentional rather than incidental.",
        ],
      },
    ],
  },
  {
    slug: "neon-poster-maker-real-briefs-test",
    title: "Neon Poster Maker Under Three Real Briefs",
    description:
      "A test of Neon Poster Maker with a game launch, a community event, and a product update, including where typography becomes fragile.",
    date: "2026-08-11",
    readingTime: "10 min read",
    category: "Field Test",
    tags: ["neon-poster", "canvas", "visual-design", "export", "field-test"],
    intro: [
      "A poster maker should be tested with awkward copy, not only the sample phrase it was designed around. We gave Neon Poster Maker three small but plausible briefs: announce a browser game, promote a late-night creator meetup, and share a product changelog. Each had a different title length and information hierarchy.",
      "We did not judge the tool against professional layout software. We judged whether a creator could produce a legible, distinctive image in five minutes and whether the exported PNG matched the preview.",
    ],
    testedWith: [
      "Short title: ORBITAL SALVAGE",
      "Long title: BUILDING SMALL TOOLS AFTER DARK",
      "Mixed hierarchy: OEeCO UPDATE / 42 EDITORIAL NOTES",
    ],
    verdict:
      "The maker is quick and expressive with short copy. Its real design boundary appears when headlines wrap, which is exactly where a useful generator should become more opinionated.",
    keyTakeaways: [
      "Test visual generators with the longest realistic copy.",
      "Presets should protect hierarchy, not only offer variety.",
      "An export feature is part of the core workflow and deserves its own QA pass.",
    ],
    relatedLinks: [
      {
        label: "Make a neon poster",
        href: "/demos/neon-poster-maker",
        description: "Enter your own headline, choose a layout, and export a PNG.",
      },
      {
        label: "Mood Garden critique",
        href: "/blog/mood-garden-interaction-critique",
        description: "Compare a second canvas-based visual tool.",
      },
      {
        label: "Visual gallery",
        href: "/categories/visual",
        description: "Browse visual and generative web works.",
      },
    ],
    sections: [
      {
        heading: "Brief one: a game launch",
        body: [
          "ORBITAL SALVAGE fit the tool naturally. It is short, contains two balanced words, and tolerates uppercase. The split layout gave the poster a useful sense of direction without requiring manual positioning. We could move between palettes without losing the hierarchy.",
          "This is the easy case, but it still revealed a strength: the system preserves a recognizable frame while changing the surface style. A creator can generate variants without accidentally producing three unrelated campaigns.",
        ],
      },
      {
        heading: "Brief two: the long event title",
        body: [
          "BUILDING SMALL TOOLS AFTER DARK pushed the wrapping logic. The center layout remained readable, while the split layout left less room and made the line breaks feel accidental. Reducing the title would solve it, but the tool should help the user discover that constraint.",
          "A live line count or a gentle warning would be more useful than silently shrinking type. Poster tools need boundaries. The user is usually better served by rewrite this headline to 32 characters than by text that technically fits but no longer carries the design.",
        ],
        note: {
          label: "Copy edit",
          text: "We shortened the event title to SMALL TOOLS AFTER DARK. The poster improved more from that edit than from any palette change.",
        },
      },
      {
        heading: "Brief three: an update with a number",
        body: [
          "Numbers introduce a different rhythm. OEeCO UPDATE / 42 EDITORIAL NOTES worked best in the stack layout, where repetition felt intentional. The mixed capitalization was normalized visually by the canvas treatment, although the input field itself gave little guidance about what the export would emphasize.",
          "This brief suggested a missing feature: optional eyebrow text. Many real posters need a small label, a main title, and one supporting line. Forcing all three into headline and subtitle fields limits the hierarchy before the visual system even begins.",
        ],
        table: {
          columns: ["Brief", "Best layout", "Main issue"],
          rows: [
            ["Game launch", "Split", "None at short length"],
            ["Creator meetup", "Center", "Long headline wraps poorly"],
            ["Product update", "Stack", "Needs a third text level"],
          ],
        },
      },
      {
        heading: "The export check",
        body: [
          "A release pass should download one image from each brief and open the files outside the browser. The check is not merely that a file exists: look for clipped edges, changed line breaks, missing glow, and filenames that can be recognized later.",
          "That last step is easy to skip when reviewing interactive works. A tool with an export button has two products: the live editor and the artifact it creates. Both need to survive on their own.",
        ],
      },
    ],
  },
  {
    slug: "tiny-launch-checklist-used-before-release",
    title: "A Launch Checklist Is Only Useful Before You Feel Ready",
    description:
      "A candid walkthrough of using Tiny Launch Checklist on a nearly finished browser demo, including the high-scoring gaps that were easy to postpone.",
    date: "2026-08-11",
    readingTime: "9 min read",
    category: "Release Diary",
    tags: ["launch", "quality-assurance", "checklist", "publishing", "release-diary"],
    intro: [
      "Checklists are comforting after a launch because every item becomes a story about what you already did. Their real value appears earlier, when the work feels finished and the list insists that the public experience begins somewhere outside your laptop.",
      "Tiny Launch Checklist opens with five sensible defaults already checked: playable demo, clear title, cover image, safe link, and share copy. Those weights produce a 45 percent starting score. The remaining 55 points are a useful reminder that plausible metadata is not the same as a verified public release.",
    ],
    testedWith: ["Fresh private-browser session", "Phone-sized viewport", "Downloaded artifact", "One-sentence share draft"],
    verdict:
      "The checklist works best as a conversation about launch risk, not as a certificate. A high score cannot prove the work is good; a low score can still reveal preventable friction.",
    keyTakeaways: [
      "Run the checklist on the public URL, not the local build.",
      "Treat the highest-weight unchecked item as the next task.",
      "Write share copy before launch; it exposes a vague product promise quickly.",
    ],
    relatedLinks: [
      {
        label: "Open Tiny Launch Checklist",
        href: "/demos/tiny-launch-checklist",
        description: "Score a browser work and copy a short launch note.",
      },
      {
        label: "Publishing checklist",
        href: "/blog/ai-web-app-publishing-checklist",
        description: "Use the longer editorial checklist for AI-assisted apps.",
      },
      {
        label: "Submission guidelines",
        href: "/guidelines",
        description: "Review oeeco's public submission requirements.",
      },
    ],
    sections: [
      {
        heading: "The demo worked, but the launch path did not",
        body: [
          "The default state assumes the core interaction, title, cover, link, and basic share sentence exist. The unchecked items sit around them: mobile fit, fast start, tags, private-data review, report path, public TRY test, and a first feedback target. These are exactly the tasks that disappear when the builder keeps looking only at the feature.",
          "The weighted score was useful because a missing safe public link mattered more than a missing tag. Equal-weight checklists invite cosmetic progress. Risk-weighted lists make the next action harder to avoid.",
        ],
      },
      {
        heading: "The private-browser pass",
        body: [
          "Opening the public link in a private window revealed a stale asset request and a layout jump while the main font loaded. Neither blocked the tool, but together they made the first five seconds feel less settled than the local version.",
          "A private session is a cheap approximation of a new visitor. It removes cached assets and signed-in assumptions. It will not replace device testing, but it catches a surprising number of creator-only blind spots.",
        ],
        bullets: [
          "Open the exact URL you plan to share.",
          "Complete the main action once without developer tools.",
          "Refresh on the result state, not only the homepage.",
          "Follow every outbound link and use the browser Back button.",
        ],
      },
      {
        heading: "Share copy exposed the real problem",
        body: [
          "Our first sentence was try this AI-made interactive demo. It described provenance and format but gave nobody a reason to click. Rewriting it forced a more honest promise: turn one rough product idea into a list of assumptions you can test this week.",
          "That sentence also became a product test. If the demo did not produce testable assumptions, either the copy was inflated or the workflow needed another pass. Launch language is useful when it can be checked against the interaction.",
        ],
        note: {
          label: "Before / after",
          text: "Before: 'Try this AI-made demo.' After: 'Find the riskiest assumption in your product idea before you build it.'",
        },
      },
      {
        heading: "What the score cannot tell you",
        body: [
          "A complete checklist cannot tell whether the work is memorable, whether the output is insightful, or whether anyone needs it. It can tell you that obvious operational failures are less likely to get in the way of learning those things.",
          "Checking mobile fit, fast start, private-data review, report path, and public TRY testing raises the example to 88 percent while leaving tags and the first feedback target visible. The exact path will vary, and boxes should stay open until the public behavior has actually been verified.",
        ],
      },
    ],
  },
  {
    slug: "twelve-minute-review-method-for-web-works",
    title: "The 12-Minute Review: How We Read a Small Web Work",
    description:
      "oeeco's time-boxed method for reviewing a small browser work, from first impression and core action to failure, trust, and the listing decision.",
    date: "2026-08-11",
    readingTime: "8 min read",
    category: "Editorial Method",
    tags: ["editorial-review", "rubric", "web-works", "quality", "curation"],
    intro: [
      "A small web work should not require an archaeological expedition before its central idea becomes visible. At the same time, a reviewer who spends only ten seconds will reward familiar interfaces and miss slower, stranger work. We use a twelve-minute first pass to hold both truths at once.",
      "Twelve minutes is not the total review. It is the structured pass that tells us what deserves deeper inspection, what needs clarification, and what is not ready. The clock prevents a polished screenshot from consuming all the attention while broken states remain untouched.",
    ],
    testedWith: ["Desktop first pass", "Narrow viewport", "One failure or empty state", "Public link and creator context"],
    verdict:
      "A time box makes review more consistent, but the final decision stays editorial. The method records what happened; it does not replace judgment with arithmetic.",
    keyTakeaways: [
      "Record the first promise before learning how the work was built.",
      "Complete one real action and deliberately trigger one imperfect state.",
      "Separate fixable presentation gaps from a missing reason to exist.",
    ],
    relatedLinks: [
      {
        label: "How oeeco reviews works",
        href: "/blog/how-oeeco-reviews-ai-made-works",
        description: "Read the broader publishing and review policy.",
      },
      {
        label: "Editorial policy",
        href: "/editorial-policy",
        description: "See how descriptions, corrections, and safety decisions are handled.",
      },
      {
        label: "Latest works",
        href: "/latest",
        description: "Use the method while browsing recently published work.",
      },
    ],
    sections: [
      {
        heading: "Minute 0-2: write down the promise",
        body: [
          "Before clicking, we write one sentence about what the page appears to offer. This captures whether the title, cover, and summary agree. If our sentence is wrong, the problem may be the listing rather than the work itself.",
          "We also note the first visible action. A visitor should not need to decode three competing buttons. For unconventional work, mystery is allowed; accidental ambiguity is not.",
        ],
      },
      {
        heading: "Minute 2-6: complete the core action",
        body: [
          "This is the longest uninterrupted block. We play one run, generate one artifact, finish one analysis, or move through one complete interaction. We avoid judging from the opening screen because many thin demos are strongest before anything is pressed.",
          "During this pass we note latency, feedback, and whether the output reflects the input. A fluent paragraph is not evidence of a working tool if the same paragraph could appear for every user.",
        ],
        table: {
          columns: ["Time", "Question", "Evidence recorded"],
          rows: [
            ["0-2 min", "What is promised?", "Title, summary, first action"],
            ["2-6 min", "Does the core loop work?", "Input, response, result"],
            ["6-9 min", "What happens off the happy path?", "Empty, error, retry"],
            ["9-12 min", "Can we publish it honestly?", "Trust, context, decision"],
          ],
        },
      },
      {
        heading: "Minute 6-9: leave the happy path",
        body: [
          "We submit an empty field, use unusually long text, resize the page, restart a game, or follow an external link. The exact test depends on the work. The purpose is to see whether the creator anticipated a visitor who does not behave like the demo script.",
          "A rough edge is not an automatic rejection. A silent failure, misleading result, surprise login, or unsafe redirect is more serious because it changes the visitor's ability to understand what happened.",
        ],
      },
      {
        heading: "Minute 9-12: make a publishable claim",
        body: [
          "The final task is to draft a truthful two-sentence description. If we cannot explain the input, action, and result without inflated language, the work may still be too vague. If the description is clear but the page needs small fixes, we record those separately.",
          "The outcome is one of four notes: ready, ready with an editorial caveat, return for a fix, or outside scope. Keeping those categories plain helps creators understand what can change the decision.",
        ],
        bullets: [
          "Ready: the public experience supports the listing claim.",
          "Ready with context: useful work with a limitation visitors should know.",
          "Return for a fix: a concrete issue blocks fair review.",
          "Outside scope: the link is not an interactive browser work oeeco can meaningfully present.",
        ],
      },
    ],
  },
  {
    slug: "sample-data-is-part-of-product-design",
    title: "Sample Data Is Part of the Product, Not Placeholder Copy",
    description:
      "Why good sample inputs teach an AI-made tool's scope, expose its reasoning, and let a visitor judge value without handing over private material.",
    date: "2026-08-11",
    readingTime: "9 min read",
    category: "Product Design",
    tags: ["sample-data", "onboarding", "privacy", "interactive-tools", "product-design"],
    intro: [
      "An empty text area asks the visitor to do product strategy on behalf of the interface. What kind of input works? How long should it be? Is personal information expected? Will a sentence produce the same result as a page of notes? A well-made sample answers those questions before the first click.",
      "Sample data is especially important for AI-assisted tools because the output can look plausible even when the input is unsuitable. A realistic example gives the visitor a reference case and gives the creator a repeatable regression test.",
    ],
    verdict:
      "The best sample is small enough to read, messy enough to be believable, and rich enough that the output can point back to specific evidence.",
    keyTakeaways: [
      "Use invented but realistic material, never disguised private data.",
      "Include one ambiguity so the tool can demonstrate restraint.",
      "Keep the same sample available after launch for regression testing.",
    ],
    relatedLinks: [
      {
        label: "Customer Interview Signal Lab",
        href: "/demos/customer-interview-signal-lab",
        description: "See a tool where realistic notes shape the entire interaction.",
      },
      {
        label: "Designing useful inputs",
        href: "/blog/how-to-design-inputs-for-ai-made-web-tools",
        description: "A broader guide to fields, examples, and constraints.",
      },
      {
        label: "Interactive tools topic",
        href: "/blog/topics/interactive-tools",
        description: "More product notes for focused browser tools.",
      },
    ],
    sections: [
      {
        heading: "A sample quietly defines the contract",
        body: [
          "Consider a tool that evaluates customer interview notes. A sample with one polished paragraph suggests the product wants summaries. A sample with fragments, quotes, objections, and uncertain claims suggests the product can work with research as it actually exists.",
          "That distinction matters more than placeholder style. The sample tells users what the tool considers evidence. It also sets expectations for length, tone, and the kind of output they can reasonably inspect.",
        ],
      },
      {
        heading: "The four ingredients of a useful example",
        body: [
          "We look for a named situation, concrete details, one piece of noise, and an outcome that can be traced back to the input. Removing all noise makes the tool seem more capable than it is. Adding too much turns the sample into homework.",
        ],
        bullets: [
          "Situation: who is doing what, and why now?",
          "Details: numbers, phrases, or constraints the result can reuse.",
          "Noise: one incomplete or conflicting statement.",
          "Traceability: at least one output should cite something visible in the sample.",
        ],
      },
      {
        heading: "Samples reduce privacy pressure",
        body: [
          "A visitor should be able to understand a tool before pasting client notes, company plans, or personal writing. A load sample button creates a no-risk trial path. This is not a privacy policy by itself, but it reduces the immediate pressure to disclose material just to see the interface work.",
          "The page should still explain whether data leaves the browser and what is retained. Sample data complements that explanation by making a first run possible without trust being granted in advance.",
        ],
        note: {
          label: "Editorial check",
          text: "We flag examples that look copied from a real customer record, even when names have been removed. Synthetic examples should be written as examples from the start.",
        },
      },
      {
        heading: "Keep the sample after launch",
        body: [
          "Creators often delete sample content once real users arrive. That removes a valuable test fixture. The same input can be run after a model change, prompt edit, or interface refactor to reveal whether the output has drifted.",
          "A stable sample also makes editorial reviews reproducible. We can describe what we entered and what the page returned without exposing anyone's private material. That is a small piece of infrastructure with unusually high value.",
        ],
      },
    ],
  },
  {
    slug: "let-people-try-before-login",
    title: "Let People Try the Smallest Useful Thing Before Login",
    description:
      "A practical argument for guest trials in AI-made web tools, with boundaries for saving, exporting, rate limits, and account creation.",
    date: "2026-08-11",
    readingTime: "8 min read",
    category: "Product Strategy",
    tags: ["guest-mode", "onboarding", "conversion", "interactive-tools", "accounts"],
    intro: [
      "A login wall asks for identity before the product has supplied evidence. That trade can make sense for private dashboards or collaborative work, but it is usually backwards for a small public tool whose main advantage is that it can be tried in a browser.",
      "Guest access does not mean giving away every feature. It means letting the visitor complete the smallest useful loop: provide safe sample input, see a real result, and understand what an account would preserve or extend.",
    ],
    verdict:
      "Ask for an account at the moment continuity becomes valuable, not at the moment curiosity begins.",
    keyTakeaways: [
      "A guest result must be real, not a blurred preview.",
      "Explain what signing in saves before displaying the form.",
      "Rate limits and local state can protect a trial without pretending friction is value.",
    ],
    relatedLinks: [
      {
        label: "Browse playable works",
        href: "/latest",
        description: "See browser works that can be understood from a public page.",
      },
      {
        label: "Trust signals",
        href: "/blog/trust-signals-for-ai-made-content-sites",
        description: "Review the surrounding context that makes a trial feel safer.",
      },
      {
        label: "Publishing checklist",
        href: "/blog/ai-web-app-publishing-checklist",
        description: "Check the rest of the public experience before launch.",
      },
    ],
    sections: [
      {
        heading: "Define the smallest useful loop",
        body: [
          "For a copy-review tool, the loop might be paste a headline, receive three diagnoses, and export nothing. For a poster maker, it might be build and download one image. For a research tool, sample data may be required in guest mode while private uploads remain behind an account.",
          "The loop should be complete enough to support a judgment. A disabled button or blurred answer is advertising, not a trial. It teaches the visitor that the page can withhold value, not that the tool can create it.",
        ],
        table: {
          columns: ["Guest can", "Account adds", "Reasonable boundary"],
          rows: [
            ["Run one analysis", "Save history", "Continuity"],
            ["Create one artifact", "Manage a library", "Organization"],
            ["Use sample data", "Use private sources", "Security and consent"],
            ["Export locally", "Collaborate", "Identity and permissions"],
          ],
        },
      },
      {
        heading: "Move the account request downstream",
        body: [
          "A useful sign-up moment often appears after the result: save this version, compare with another run, share with a teammate. At that point the account solves a problem the visitor has just encountered.",
          "The copy should name that benefit. Continue with Google is an action without a reason. Save this analysis to compare later explains the exchange in ordinary language.",
        ],
      },
      {
        heading: "Protect the service without punishing the visitor",
        body: [
          "Guest access can be bounded by request limits, shorter inputs, sample-only mode, local storage, or a cooldown. The limit should be visible before the visitor invests time. Silent throttling feels like a broken tool.",
          "For local tools that do not call an expensive service, a mandatory account is even harder to justify. The page can keep settings in the browser and offer sign-in only when synchronization or sharing becomes relevant.",
        ],
      },
      {
        heading: "When login first is justified",
        body: [
          "Some interactions cannot be anonymous: team workspaces, private records, paid resources, or actions that affect other people. In those cases, the public page should still show a concrete example, explain the data boundary, and let the visitor understand the workflow before creating an account.",
          "The principle is not no login. It is no unexplained login. A public browser work earns trust by making the sequence of value and commitment legible.",
        ],
      },
    ],
  },
  {
    slug: "designing-failure-states-for-ai-tools",
    title: "The Output Is Empty. Now What? Designing Failure States for AI Tools",
    description:
      "A failure-state field guide for AI-made tools: empty input, weak evidence, timeouts, partial results, unsafe requests, and recovery without blame.",
    date: "2026-08-11",
    readingTime: "11 min read",
    category: "Interaction Design",
    tags: ["error-design", "ai-tools", "recovery", "product-design", "trust"],
    intro: [
      "The happy path makes an AI tool look intelligent. The failure path shows whether the product understands its job. When a result is empty, delayed, or uncertain, a generic something went wrong message throws away the context the user already supplied.",
      "Useful failure states do three things in order: say what happened in language the visitor can recognize, preserve as much work as possible, and offer a next action whose outcome is different from pressing the same button again.",
    ],
    verdict:
      "A good recovery state narrows uncertainty. It does not need to explain the entire system, but it must tell the visitor whether to edit, wait, retry, or stop.",
    keyTakeaways: [
      "Never erase the user's input because generation failed.",
      "Distinguish weak material from a technical outage.",
      "Retry is useful only when the underlying condition may have changed.",
    ],
    relatedLinks: [
      {
        label: "Landing Page Copy Doctor",
        href: "/demos/landing-page-copy-doctor",
        description: "Try a narrow analysis workflow where diagnosis needs clear recovery.",
      },
      {
        label: "Safe interactive projects",
        href: "/blog/checklist-for-publishing-safe-interactive-web-projects",
        description: "Review public safety and trust checks around the core interaction.",
      },
      {
        label: "Input design",
        href: "/blog/how-to-design-inputs-for-ai-made-web-tools",
        description: "Prevent avoidable failures through clearer input design.",
      },
    ],
    sections: [
      {
        heading: "Empty input is instruction, not an error",
        body: [
          "If a required field is empty, the interface already knows the remedy. Say what belongs there and give a short example near the field. A toast at the opposite edge of the screen makes the visitor search for a problem the product can identify precisely.",
          "Validation should happen before an expensive request. It is faster for the visitor and avoids consuming service capacity on input the interface knew was incomplete.",
        ],
      },
      {
        heading: "Weak evidence needs a different response",
        body: [
          "A research tool may receive valid text that cannot support a confident conclusion. Returning a polished answer anyway is more dangerous than returning nothing. The right state is not error; it is insufficient evidence, followed by the specific details that would improve the analysis.",
          "This is where trust becomes visible. A tool that can say the notes contain preferences but no purchase behavior is more useful than one that assigns a confident score to every paragraph.",
        ],
        note: {
          label: "Preferred wording",
          text: "'There is not enough evidence to rate urgency yet. Add a direct quote about timing, cost, or what happened when the problem occurred.'",
        },
      },
      {
        heading: "Timeouts and partial results",
        body: [
          "A timeout is a technical condition, so the page should preserve input and say whether a request may still be processing. If some sections are available, show them as partial rather than discarding everything. Mark missing sections clearly; do not let the visitor mistake an incomplete result for a complete one.",
        ],
        table: {
          columns: ["State", "Preserve", "Offer"],
          rows: [
            ["Empty required field", "Other completed fields", "Focus and example"],
            ["Weak evidence", "Input and cautious findings", "Specific evidence request"],
            ["Timeout", "All input", "Retry with status"],
            ["Partial result", "Completed sections", "Resume or retry missing section"],
            ["Unsafe request", "Non-sensitive draft when appropriate", "Boundary and safer alternative"],
          ],
        },
      },
      {
        heading: "Do not blame the visitor",
        body: [
          "Invalid prompt, bad request, and user error describe the system's perspective. The visitor needs to know which part can be changed. Plain language is not cosmetic here; it is the shortest route back into the workflow.",
          "A final check is to read the error after imagining twenty minutes of lost work. If the message sounds cheerful, vague, or evasive in that context, revise it. Recovery copy should be calm enough to carry frustration without pretending nothing happened.",
        ],
      },
    ],
  },
  {
    slug: "mobile-qa-for-interactive-web-works",
    title: "A Phone Is Not a Smaller Desktop: Mobile QA for Interactive Works",
    description:
      "A hands-on mobile QA routine for browser games, canvas experiments, and AI-made tools, focused on controls, keyboards, safe areas, orientation, and recovery.",
    date: "2026-08-11",
    readingTime: "10 min read",
    category: "QA Field Guide",
    tags: ["mobile", "quality-assurance", "responsive-design", "browser-games", "interactive-tools"],
    intro: [
      "A responsive screenshot can prove that boxes fit. It cannot prove that a thumb can reach a control, that the keyboard leaves enough room to read the result, or that a canvas recovers after the phone rotates. Interactive pages fail on mobile through behavior as often as layout.",
      "Our mobile pass uses a real phone for the final check, but most problems can be found earlier with a narrow browser window and deliberate stress cases. The important part is to complete the actual workflow, not admire the first screen.",
    ],
    testedWith: ["390 px portrait viewport", "Landscape rotation", "On-screen keyboard open", "Slow reload", "Touch-only controls"],
    verdict:
      "Mobile QA is complete only after the core action, failure state, and restart or export all work with touch and the on-screen keyboard.",
    keyTakeaways: [
      "Test the smallest supported width with the longest real text.",
      "Keep primary controls away from browser chrome and safe-area edges.",
      "Rotate during the interaction, not only before it starts.",
    ],
    relatedLinks: [
      {
        label: "One Button Dodge",
        href: "/demos/one-button-dodge",
        description: "A compact game where touch clarity and restart speed matter.",
      },
      {
        label: "First-minute game review",
        href: "/blog/one-button-dodge-first-minute-review",
        description: "See how early input feedback shapes a tiny game.",
      },
      {
        label: "Launch checklist",
        href: "/demos/tiny-launch-checklist",
        description: "Track mobile fit alongside public link and trust checks.",
      },
    ],
    sections: [
      {
        heading: "Start with reach, not breakpoints",
        body: [
          "A control can fit perfectly and still be awkward under a thumb. We check whether the main action can be reached while holding the phone naturally, whether nearby destructive actions are separated, and whether pressed states are visible under a finger.",
          "For games, keyboard instructions should disappear or adapt when touch is the only input. For tools, the submit action should remain findable after a long field expands and the keyboard shifts the viewport.",
        ],
      },
      {
        heading: "Open the keyboard early",
        body: [
          "The on-screen keyboard is a layout event. It reduces the viewport, can cover fixed buttons, and often scrolls the focused field into an unexpected position. We type the maximum realistic input, move between fields, dismiss the keyboard, and submit without manually repairing the scroll position.",
          "A sticky action bar needs particular care. If it sits above the keyboard, it can consume half the remaining screen. If it stays behind the keyboard, the visitor may think the page has no next step.",
        ],
        bullets: [
          "Focus the first and last fields.",
          "Paste text longer than the default sample.",
          "Dismiss the keyboard using the device control.",
          "Confirm the result heading is visible after submit.",
        ],
      },
      {
        heading: "Canvas and orientation",
        body: [
          "Canvas works should be rotated during motion. We look for stretched drawing, lost state, duplicated animation loops, and controls that move away from the visible scene. A redraw after resize should use the new dimensions without resetting the user's choices unless that reset is explained.",
          "Landscape does not need to be the primary mode, but it should fail deliberately. A short rotate back message is better than controls overlapping the scene or an invisible canvas consuming touch events.",
        ],
      },
      {
        heading: "The slow reload test",
        body: [
          "On a slower connection, text and controls may appear before a large script or font. We reload from the public URL and watch whether the page shifts under a finger, whether an eager tap is ignored, and whether the loading state resembles the final layout.",
          "The pass ends after retry, restart, or export. Those secondary actions are often placed last in the desktop design and become the first casualties of a narrow screen. A visitor who completes the work deserves a clean way to continue.",
        ],
        table: {
          columns: ["Moment", "Common failure", "Pass condition"],
          rows: [
            ["Input", "Keyboard covers action", "Submit remains reachable"],
            ["Rotate", "Canvas stretches or resets", "State survives or reset is explained"],
            ["Load", "Layout shifts under touch", "Stable controls and visible progress"],
            ["Finish", "Retry or export is off-screen", "Next action is obvious"],
          ],
        },
      },
    ],
  },
  {
    slug: "local-first-by-default-for-small-tools",
    title: "Before You Add a Database, Ask Whether the Browser Is Enough",
    description:
      "A guide to local-first design for small tools: what can stay in the browser, when a backend earns its complexity, and how to explain the boundary.",
    date: "2026-08-11",
    readingTime: "9 min read",
    category: "Architecture Note",
    tags: ["local-first", "privacy", "architecture", "browser-storage", "interactive-tools"],
    intro: [
      "A database can make a prototype feel like a product before it has earned repeat use. It introduces accounts, retention, deletion, authorization, and a new class of failure. For a single-purpose browser tool, the strongest first architecture may be no server state at all.",
      "Local-first is not a slogan and it is not suitable for every AI workflow. It is a default question: can the useful result be produced and kept on this device, and if not, which exact capability requires data to leave it?",
    ],
    verdict:
      "Use the browser for temporary state, drafts, and downloadable artifacts when possible. Add a backend for a named capability, not for the feeling of completeness.",
    keyTakeaways: [
      "Separate computation needs from storage needs.",
      "Tell visitors what leaves the device in the interface, not only the privacy page.",
      "Design export before sync; portable files reduce lock-in and implementation pressure.",
    ],
    relatedLinks: [
      {
        label: "Neon Poster Maker",
        href: "/demos/neon-poster-maker",
        description: "See a browser tool that creates and exports an artifact locally.",
      },
      {
        label: "Privacy policy",
        href: "/privacy",
        description: "Read oeeco's current public data practices.",
      },
      {
        label: "Safe publishing checklist",
        href: "/blog/checklist-for-publishing-safe-interactive-web-projects",
        description: "Review data, links, permissions, and public behavior before launch.",
      },
    ],
    sections: [
      {
        heading: "Three kinds of state",
        body: [
          "We separate session state, personal continuity, and collaboration. Session state disappears when the tab closes. Personal continuity keeps a draft or settings on one device. Collaboration requires identity, permissions, and shared storage. Many small tools need only the first two.",
          "Naming the state prevents an architecture from expanding by reflex. A poster generator may need a downloadable image and remembered palette, not an online gallery. A checklist may need local progress and copied text, not an account system.",
        ],
        table: {
          columns: ["Need", "Simplest home", "Backend trigger"],
          rows: [
            ["Current form", "Component state", "None"],
            ["Remember settings", "Local storage", "Cross-device sync"],
            ["Keep an artifact", "Download", "Shared library"],
            ["Work with a team", "Not local-only", "Identity and permissions"],
          ],
        },
      },
      {
        heading: "AI calls complicate the boundary",
        body: [
          "A tool may store nothing and still send text to a model service. The interface should distinguish processing from storage. Saying no account required does not tell the visitor whether their input leaves the browser.",
          "A concise note near the action can do real work: your text is sent for this analysis and is not saved by oeeco. That claim must match the implementation and the service terms, but when it is true, placing it at the decision point is more useful than burying it.",
        ],
      },
      {
        heading: "What a backend must earn",
        body: [
          "Cross-device history, collaboration, paid usage, queued jobs, and server-only integrations are legitimate reasons. A dashboard nobody requested is not. Every backend feature should arrive with a retention decision, a deletion path, and authorization tests.",
          "This is not an argument against Supabase or any other platform. It is an argument for using infrastructure when the product has a job for it. Simpler state makes a young tool easier to inspect, explain, and maintain.",
        ],
      },
      {
        heading: "Export is an underrated middle path",
        body: [
          "A text file, JSON export, PNG, or copied report gives the visitor continuity without requiring the creator to hold their data. It also lets the artifact move into workflows the small tool does not need to rebuild.",
          "If users repeatedly import those files on another device or ask to collaborate, the need for a backend becomes evidence-based. Until then, the browser may be enough, and enough is a healthy architecture for a small work.",
        ],
      },
    ],
  },
  {
    slug: "rewrite-a-web-work-description-before-after",
    title: "We Rewrote Six Web-Work Descriptions. Here Is What Changed.",
    description:
      "Six before-and-after edits showing how to replace vague AI language with concrete inputs, actions, outputs, constraints, and honest reasons to try a web work.",
    date: "2026-08-11",
    readingTime: "10 min read",
    category: "Editing Desk",
    tags: ["editing", "descriptions", "metadata", "submission", "copywriting"],
    intro: [
      "The weakest sentence on many project pages is the one asked to explain the project. It often begins with an adjective, mentions AI twice, and ends without saying what the visitor can do. That is not a vocabulary problem. It is a missing-information problem.",
      "We took six common description patterns from our review notes and edited them in public. The examples are composites, not quotes from individual submissions. Each edit follows the same rule: make the visitor's material, action, and result visible before adding ambition.",
    ],
    verdict:
      "A strong description is a compact usage scene. It should help the right visitor recognize the work and give the wrong visitor permission to skip it.",
    keyTakeaways: [
      "Lead with what the visitor does, not how the project was generated.",
      "Replace quality adjectives with observable behavior.",
      "State one meaningful limitation when it changes the decision to try.",
    ],
    relatedLinks: [
      {
        label: "Submit a work",
        href: "/upload",
        description: "Use the editing patterns while preparing a public submission.",
      },
      {
        label: "Common submission mistakes",
        href: "/blog/common-mistakes-in-ai-made-web-work-submissions",
        description: "Check links, context, screenshots, and claims before review.",
      },
      {
        label: "Submission guidelines",
        href: "/guidelines",
        description: "See the current information required for oeeco review.",
      },
    ],
    sections: [
      {
        heading: "1. The adjective stack",
        body: [
          "Before: an innovative, powerful, intuitive AI platform that transforms creativity. This sentence has no object. We do not know whether the page makes music, reviews code, or changes an image.",
          "After: enter a product idea and receive five variations that each change the audience, constraint, or output. The revision is narrower and therefore more credible. It also lets the visitor imagine the first minute.",
        ],
      },
      {
        heading: "2. The technology biography",
        body: [
          "Before: built with Next.js, TypeScript, Canvas, and AI in a weekend. That information may belong in build notes, but it does not explain why someone should open the page.",
          "After: steer a drifting repair ship, recover three satellites, and learn to manage inertia across short runs. The stack can follow in a secondary line for creators who want implementation context.",
        ],
      },
      {
        heading: "3-4. The empty promise and the hidden input",
        body: [
          "Before: get better customer insights instantly. After: paste interview notes and sort the claims into strong signals, weak signals, and questions for the next call. Better is replaced by a visible structure; instantly is removed because speed is not the main value.",
          "Before: a smart copy assistant for landing pages. After: enter a headline, audience, and proof point to find unclear claims before rewriting the page. Naming the input makes the tool easier to self-select and easier to test.",
        ],
        table: {
          columns: ["Weak pattern", "Missing information", "Edit toward"],
          rows: [
            ["Powerful AI tool", "Job", "Specific action"],
            ["Built with...", "Visitor value", "Interaction first"],
            ["Improve instantly", "Output", "Visible result"],
            ["For everyone", "Audience", "Recognizable situation"],
          ],
        },
      },
      {
        heading: "5. The universal audience",
        body: [
          "Before: for creators, founders, teams, students, and anyone with ideas. A list this broad usually means the interaction has not chosen a moment of use.",
          "After: for solo builders deciding which product assumption to test before a one-week prototype. Other people may still use it, but the named situation gives the page shape.",
        ],
      },
      {
        heading: "6. The missing limitation",
        body: [
          "Before: analyze your idea and discover whether it will succeed. After: map the riskiest assumptions in an idea; the result is a planning aid, not a prediction of demand. The second sentence loses a dramatic claim and gains a trustworthy boundary.",
          "That boundary does not weaken the page. It tells visitors how to use the output. Honest copy is often more persuasive because it removes the need to defend an impossible promise.",
        ],
        note: {
          label: "Final edit test",
          text: "Underline every phrase a visitor can verify during one session. Rewrite or remove the rest.",
        },
      },
    ],
  },
  {
    slug: "choosing-cover-image-for-interactive-work",
    title: "Choose the Frame That Explains the Work",
    description:
      "An editorial guide to cover images for games, tools, and visual experiments, with a five-frame contact-sheet method and common misleading choices.",
    date: "2026-08-11",
    readingTime: "8 min read",
    category: "Visual Editing",
    tags: ["cover-images", "screenshots", "visual-editing", "submissions", "discovery"],
    intro: [
      "A cover image is not a reward for reaching the prettiest state. It is a promise about what opens after the click. When the promise and the work disagree, even an attractive image creates a poor first impression.",
      "We choose covers by making a contact sheet of five moments: arrival, input, action, result, and distinctive detail. Seeing the frames together makes it easier to separate an explanatory image from a decorative one.",
    ],
    verdict:
      "Choose the frame that makes the interaction legible at card size. Beauty helps, but correspondence between cover and experience comes first.",
    keyTakeaways: [
      "Capture the real public build at a representative state.",
      "Prefer one clear focal point over a collage of features.",
      "Check the image at the exact crop and size used by the gallery.",
    ],
    relatedLinks: [
      {
        label: "Explore the gallery",
        href: "/",
        description: "Compare how current work covers communicate different interaction types.",
      },
      {
        label: "Submission guide",
        href: "/blog/how-to-submit-ai-made-web-work-to-oeeco",
        description: "Prepare the rest of the listing alongside the cover.",
      },
      {
        label: "Latest works",
        href: "/latest",
        description: "Inspect covers in the context where visitors encounter them.",
      },
    ],
    sections: [
      {
        heading: "Make a five-frame contact sheet",
        body: [
          "The arrival frame shows visual identity but may contain little evidence. The input frame explains tools but can look like a form. The action frame carries energy. The result frame proves an outcome. The distinctive detail can make a familiar interface memorable.",
          "We capture all five before choosing. The extra four are not wasted; they can support a case study, social post, or future update note.",
        ],
        bullets: [
          "Arrival: what the visitor sees before acting.",
          "Input: the material or controls the work expects.",
          "Action: the central interaction in progress.",
          "Result: the artifact, score, scene, or decision produced.",
          "Detail: one element that belongs specifically to this work.",
        ],
      },
      {
        heading: "Different works need different evidence",
        body: [
          "For a game, a readable moment of play is usually stronger than a title screen. For a tool, a populated result can communicate more than empty fields, provided the cover does not imply that the result appears without input. For a visual generator, show the output and enough of the controls to suggest authorship.",
          "A screenshot of source code is rarely the best primary cover. It may interest builders, but it asks general visitors to infer the experience from implementation.",
        ],
        table: {
          columns: ["Work type", "Strong cover candidate", "Common mistake"],
          rows: [
            ["Game", "Action with visible objective", "Title screen only"],
            ["Tool", "Populated result plus context", "Empty form"],
            ["Visual", "Distinct output with a control cue", "Atmospheric crop with no interaction"],
            ["Simulation", "State with readable variables", "Busy scene with no explanation"],
          ],
        },
      },
      {
        heading: "Test the crop, not the full screenshot",
        body: [
          "Gallery cards crop and shrink. Fine labels disappear, edge controls are cut, and a balanced desktop composition can become empty space. We preview the actual card ratio and reduce the image until it is roughly the size a visitor will scan.",
          "If the focal point disappears, capture a different state rather than adding arrows and labels. The cover should come from the work's visual language whenever possible.",
        ],
      },
      {
        heading: "Do not stage a capability that is not there",
        body: [
          "Mocked results, composited device frames, and generated marketing scenes can make a project look larger than the public build. Supplemental images may use them with clear context; the primary cover should show the experience a visitor can actually reach.",
          "This is an editorial trust issue as much as a visual one. A modest accurate frame produces better clicks than a dramatic image followed by disappointment.",
        ],
      },
    ],
  },
  {
    slug: "what-pauses-an-oeeco-review",
    title: "Seven Things That Pause an oeeco Review",
    description:
      "Concrete editorial red flags that stop a work from moving forward, why each one matters, and the evidence that lets review resume.",
    date: "2026-08-11",
    readingTime: "9 min read",
    category: "Editorial Policy",
    tags: ["review", "editorial-policy", "safety", "submissions", "trust"],
    intro: [
      "A paused review is not always a rejection. Often it means the editor cannot make a truthful public claim from the evidence available. The fastest resolution is not a longer pitch; it is a working link, clearer boundary, or corrected page.",
      "These seven conditions come from the practical questions our review process has to answer. Publishing them helps creators fix the right thing and keeps editorial decisions from feeling mysterious.",
    ],
    verdict:
      "Review resumes when the blocking condition can be tested again. We care more about clear evidence of a fix than an explanation of why the issue happened.",
    keyTakeaways: [
      "Send the exact public URL and test it signed out.",
      "Describe current behavior, not a roadmap.",
      "Make data, ownership, and external-link boundaries visible.",
    ],
    relatedLinks: [
      {
        label: "Editorial policy",
        href: "/editorial-policy",
        description: "Read the policy behind review, corrections, and removal.",
      },
      {
        label: "Submission guidelines",
        href: "/guidelines",
        description: "Check the complete requirements before sending a work.",
      },
      {
        label: "Contact oeeco",
        href: "/contact",
        description: "Report a correction, broken link, or review question.",
      },
    ],
    sections: [
      {
        heading: "1-2. The link does not prove the claim",
        body: [
          "The first pause is a broken, private, or permission-gated link. The second is subtler: the link works, but the submitted description refers to features a visitor cannot reach. A roadmap is not evidence for a current listing.",
          "Review can resume with a signed-out public URL and a description limited to what that URL supports. A short screen recording may help diagnose a regional issue, but it does not replace a web work visitors can open.",
        ],
      },
      {
        heading: "3-4. Ownership or data handling is unclear",
        body: [
          "We pause when a submission appears to reuse copyrighted assets without context, impersonates another product, or makes authorship impossible to understand. We also pause when a tool requests sensitive material without explaining where it goes or why it is needed.",
          "The remedy depends on the issue: replace the asset, add a license or attribution, clarify the creator relationship, remove the field, or provide an accurate data note. More legal-sounding language is not a substitute for changing the underlying behavior.",
        ],
      },
      {
        heading: "5-6. The work surprises the visitor",
        body: [
          "Unexpected downloads, redirects, wallet prompts, loud media, or account requests can change the risk of opening a link. These behaviors need to be removed or explained before the visitor triggers them. We also pause pages where ads, fake controls, or lookalike buttons could be mistaken for the main interaction.",
          "A public work should let the visitor anticipate the consequence of an action. Surprise can be part of art or game design, but it should not conceal a commercial, privacy, or security boundary.",
        ],
        table: {
          columns: ["Pause condition", "Evidence needed to resume"],
          rows: [
            ["Private or broken URL", "Signed-out public link"],
            ["Description exceeds build", "Corrected copy or published feature"],
            ["Asset ownership unclear", "Replacement, license, or attribution"],
            ["Sensitive input unexplained", "Removed field or accurate data note"],
            ["Unexpected external action", "Advance explanation or removal"],
            ["Deceptive control", "Clear visual and behavioral separation"],
            ["No meaningful interaction", "A public action or output to review"],
          ],
        },
      },
      {
        heading: "7. There is no work to review yet",
        body: [
          "A concept page, waitlist, screenshot gallery, repository, or prompt can document a project, but it is not the same as a working browser artifact. oeeco may link to build notes around a published work; it cannot turn those notes into the interaction itself.",
          "This pause is resolved by shipping the smallest real loop. One playable round, one useful transformation, or one controllable visual system is enough to begin a meaningful review.",
        ],
        note: {
          label: "What helps most",
          text: "Reply with the changed public URL and one sentence naming the fix. The editor will retest the blocking condition first.",
        },
      },
    ],
  },
  {
    slug: "seven-day-polish-sprint-for-small-web-work",
    title: "A Seven-Day Polish Sprint for a Small Web Work",
    description:
      "A day-by-day release plan that improves one core loop, tests real states, tightens the listing, and ships without turning a small work into a platform.",
    date: "2026-08-11",
    readingTime: "10 min read",
    category: "Release Plan",
    tags: ["polish", "release-plan", "scope", "quality-assurance", "shipping"],
    intro: [
      "The final week is where small projects acquire large feature lists. A creator notices roughness, mistakes roughness for missing scope, and starts adding accounts, settings, and dashboards. The original loop receives less attention precisely when it needs the most.",
      "This sprint keeps the work small. Every day has one question and one artifact. New features are allowed only when a test shows that the core interaction cannot be understood without them.",
    ],
    verdict:
      "A polish sprint should reduce uncertainty and surface area. If the work has more screens on day seven than day one, the burden of proof belongs to every new screen.",
    keyTakeaways: [
      "Freeze the product promise before changing the interface.",
      "Fix the core loop and recovery before metadata and promotion.",
      "Launch to a small audience with a written list of known limitations.",
    ],
    relatedLinks: [
      {
        label: "Tiny Launch Checklist",
        href: "/demos/tiny-launch-checklist",
        description: "Track the final public checks during the sprint.",
      },
      {
        label: "Make a small game feel finished",
        href: "/blog/how-to-make-a-small-web-game-feel-finished",
        description: "Apply the plan specifically to a compact game loop.",
      },
      {
        label: "Submit to oeeco",
        href: "/upload",
        description: "Send the public work after the release pass.",
      },
    ],
    sections: [
      {
        heading: "Days 1-2: freeze the promise, repair the loop",
        body: [
          "On day one, write the promise in one sentence and list every visible element that does not support it. Remove or postpone at least one. Record a complete run before editing so later polish can be compared with the starting experience.",
          "Day two belongs to the core action. Tune controls, input constraints, waiting states, result hierarchy, or restart speed. Do not work on the landing copy while the central interaction still feels uncertain.",
        ],
      },
      {
        heading: "Days 3-4: recovery and small screens",
        body: [
          "On day three, trigger empty, invalid, long, slow, and repeated states. Preserve the visitor's work and make every recovery action specific. On day four, complete the same pass with touch and an on-screen keyboard or game controls.",
          "These days often produce fewer screenshots than visual polish, but they are where a demo becomes dependable. Keep a short before-and-after note for each fix so regressions are easier to spot.",
        ],
        table: {
          columns: ["Day", "Question", "Artifact"],
          rows: [
            ["1", "What is the one promise?", "Scope note and baseline recording"],
            ["2", "Does the core loop feel clear?", "One complete improved run"],
            ["3", "Can the visitor recover?", "Failure-state checklist"],
            ["4", "Does it work with touch?", "Mobile pass"],
            ["5", "Can the page explain itself?", "Final listing copy and cover"],
            ["6", "Does the public build match local?", "Signed-out release check"],
            ["7", "What do real visitors misunderstand?", "Small-launch notes"],
          ],
        },
      },
      {
        heading: "Days 5-6: edit the public evidence",
        body: [
          "Day five produces the title, description, cover, sample data, limitation note, and creator context. Every claim should point to something visible in the public work. Day six is deployment: use a fresh session, follow the exact shared URL, and test output or download outside the page.",
          "Do not spend day six adding features because deployment revealed unused time. Keep it available for host differences, caching, environment configuration, and links that worked only on the development machine.",
        ],
      },
      {
        heading: "Day 7: launch small and listen literally",
        body: [
          "Send the work to a handful of people who were not present during the build. Ask what they thought would happen, where they hesitated, and what they believed the result meant. Do not begin by explaining the design.",
          "End the sprint with three lists: fix now, observe, and later. The first list should be short enough to complete without reopening the scope. A launch is a measurement point, not permission for the project to expand indefinitely.",
        ],
      },
    ],
  },
  {
    slug: "maintenance-ledger-for-public-web-works",
    title: "The Quiet Page Every Web Work Needs: A Maintenance Ledger",
    description:
      "How to keep a small public work trustworthy with a lightweight ledger for deployments, dependencies, links, known issues, corrections, and ownership.",
    date: "2026-08-11",
    readingTime: "9 min read",
    category: "Operations",
    tags: ["maintenance", "operations", "broken-links", "dependencies", "trust"],
    intro: [
      "Publishing creates a promise that lasts longer than the launch post. Hosts change behavior, APIs expire, packages age, and the person who remembers why a setting exists moves on. Small web works rarely need a full operations platform, but they do need a memory.",
      "We call that memory a maintenance ledger: one plain record of what is live, what it depends on, when it was checked, and which known issues are being tolerated. It can live in the repository. Its value comes from being current and boring enough to use.",
    ],
    verdict:
      "A maintenance ledger turns care from an intention into a repeatable check. The document should be shorter than the confusion it prevents.",
    keyTakeaways: [
      "Record ownership and the exact public URL first.",
      "Track external dependencies by consequence, not by package count.",
      "A known issue needs a date, impact, and next review point.",
    ],
    relatedLinks: [
      {
        label: "Editorial policy",
        href: "/editorial-policy",
        description: "See how oeeco handles corrections and public accuracy.",
      },
      {
        label: "Contact oeeco",
        href: "/contact",
        description: "Report a broken work, inaccurate description, or safety concern.",
      },
      {
        label: "Site readiness",
        href: "/site-readiness",
        description: "Review oeeco's public operational checklist.",
      },
    ],
    sections: [
      {
        heading: "What belongs in the ledger",
        body: [
          "Start with the public URL, repository, hosting owner, current maintainer, last successful check, and a one-sentence definition of healthy. For a game, healthy may mean one complete run on desktop and mobile. For a generator, it includes opening the downloaded artifact.",
          "Then list external services and what failure looks like. API name alone is not useful six months later. Write weather data: poster still opens, manual controls remain available, live mode shows an explanation.",
        ],
        bullets: [
          "Identity: title, public URL, repository, maintainer.",
          "Health check: the smallest complete test and last pass date.",
          "Dependencies: host, APIs, authentication, storage, external assets.",
          "Known issues: impact, workaround, owner, review date.",
          "Change note: what changed in the public experience and why.",
        ],
      },
      {
        heading: "Check consequences, not dashboards",
        body: [
          "A green deployment status does not prove the main interaction works. The useful check follows the public route, supplies representative input, and confirms the output. Automated checks can cover status, expected text, sitemap presence, and broken links; an occasional human pass covers meaning and feel.",
          "The ledger should link to both. This keeps maintenance proportional: automation watches frequent predictable failures, while a person checks the parts that require judgment.",
        ],
      },
      {
        heading: "Known issues are not a shame list",
        body: [
          "Every maintained product has limitations. Recording them prevents duplicate investigation and helps editors describe the work honestly. A useful entry says who is affected and whether there is a workaround.",
          "For example: PNG export on very narrow screens uses a fixed minimum canvas; preview remains visible and desktop export is unaffected; retest after the next canvas resize change. That is actionable. Mobile sometimes weird is not.",
        ],
        table: {
          columns: ["Weak note", "Maintained note"],
          rows: [
            ["API flaky", "Live data may time out; manual mode remains; next check Aug 18"],
            ["Mobile issue", "Submit hidden when keyboard opens below 360 px; owner assigned"],
            ["Needs update", "Dependency reaches support end Sep 30; upgrade tested on branch"],
          ],
        },
      },
      {
        heading: "The retirement decision belongs here too",
        body: [
          "Maintenance includes knowing when to stop. If a core service disappears, the owner is unavailable, or the work can no longer be presented safely, record the decision and remove or archive the listing deliberately. A dead link should not be the way visitors learn that a project ended.",
          "A small work does not need permanent operation to be valuable. It needs an honest lifecycle: published, checked, corrected when practical, and retired with context when the promise can no longer be kept.",
        ],
      },
    ],
  },
  {
    slug: "how-to-remove-ai-sounding-copy",
    title: "The Sentence Sounded Fine. That Was the Problem.",
    featured: true,
    description:
      "An editing notebook on replacing generic AI cadence with observations, uncertainty, concrete nouns, and accountable editorial judgment.",
    date: "2026-08-11",
    readingTime: "10 min read",
    category: "Editing Notebook",
    tags: ["editing", "writing", "ai-cadence", "editorial", "voice"],
    intro: [
      "Generic writing is not always clumsy. Often it is frictionless: every paragraph arrives at the expected conclusion, every heading balances neatly, and no sentence contains a detail that could be challenged. It sounds fine because nothing in it belongs to a particular encounter.",
      "Our editing pass for oeeco does not begin with a detector. It begins by asking what the writer saw, changed, kept, rejected, or could not verify. Those answers create texture that style instructions alone cannot supply.",
    ],
    verdict:
      "The goal is not to perform humanness. It is to publish accountable writing: observations have a source, judgments have an owner, and uncertainty remains visible where the evidence ends.",
    keyTakeaways: [
      "Replace summary rhythm with a concrete sequence of events.",
      "Keep one real disagreement or limitation instead of resolving every tension.",
      "Delete claims that become meaningless when moved to another product page.",
    ],
    relatedLinks: [
      {
        label: "Case studies",
        href: "/blog/topics/case-studies",
        description: "Read editorial reviews anchored to specific oeeco works.",
      },
      {
        label: "Description rewrites",
        href: "/blog/rewrite-a-web-work-description-before-after",
        description: "See before-and-after product copy edits.",
      },
      {
        label: "oeeco Editorial",
        href: "/authors/oeeco-editorial",
        description: "Read about the team and the scope of this publication.",
      },
    ],
    sections: [
      {
        heading: "Start with the sentence that could go anywhere",
        body: [
          "We search for lines such as this demonstrates the power of AI, the possibilities are endless, or a thoughtful experience for creators. The problem is not that these claims are always false. It is that they survive unchanged when the subject changes from a game to a spreadsheet.",
          "Our rule is simple: if a sentence can move to another article without needing an edit, it must earn its place again. Often the replacement is shorter because the specific observation carries more information.",
        ],
        note: {
          label: "Example",
          text: "Generic: 'The tool offers a seamless and intuitive experience.' Observed: 'After export, the PNG opened with the same line breaks as the canvas preview.'",
        },
      },
      {
        heading: "Put time back into the paragraph",
        body: [
          "Generated-sounding prose often presents conclusions without a sequence. Real evaluation has a before, an action, and an after. We entered a long title; the split layout wrapped it poorly; shortening the title improved the poster more than changing the palette. That sentence has a path someone else can repeat.",
          "Time also permits surprise. If the result contradicted the initial expectation, keep that turn. A review where every test confirms the opening thesis feels arranged because actual tools are rarely that obedient.",
        ],
      },
      {
        heading: "Uneven structure can be honest structure",
        body: [
          "Not every subject deserves five equally sized lessons. A field test may need a table and a short verdict. A policy article may need a direct list. A release diary may spend half its length on one failure because that failure changed the launch.",
          "We vary structure when the material calls for it, not as decoration. Uniformity is useful for navigation and metadata; inside the article, the evidence should choose the shape.",
        ],
        table: {
          columns: ["Material", "Useful form"],
          rows: [
            ["Repeated trials", "Test log or comparison table"],
            ["Editorial decision", "Criteria plus a named verdict"],
            ["Hands-on failure", "Chronology and recovery note"],
            ["Practical method", "Steps with pass conditions"],
            ["Uncertain observation", "Caveat and next test"],
          ],
        },
      },
      {
        heading: "Leave judgment in the writing",
        body: [
          "Neutral-sounding language can hide responsibility. Instead of it could be argued that the output is generic, write we would not publish the score without showing its criteria. The second sentence tells readers who made the judgment and what would change it.",
          "Judgment should not become swagger. It needs evidence and room for revision. We can prefer a narrower tool, note why, and still acknowledge that a different audience may value breadth. A real editorial voice is not certainty; it is accountable preference.",
        ],
      },
      {
        heading: "The final read is out loud",
        body: [
          "We read the draft aloud once. Repeated transitions, matched paragraph lengths, and abstract noun chains become easier to hear. Then we remove the throat-clearing at the start of sections and check that the last sentence does more than repeat the heading.",
          "The article is finished when its strongest details would be inconvenient to invent. Dates, test conditions, discarded options, exact limitations, and modest conclusions are not cosmetic signals of humanity. They are the substance readers came for.",
        ],
      },
    ],
  },
];
