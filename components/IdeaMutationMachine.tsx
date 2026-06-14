"use client";

import { Check, Copy, Dices, FlaskConical, RefreshCw, Sparkles, Wand2 } from "lucide-react";
import { useMemo, useState } from "react";

type ModeKey = "game" | "tool" | "social" | "weird";
type IntensityKey = "small" | "medium" | "wild";

type Mutation = {
  angle: string;
  hook: string;
  build: string;
  audience: string;
  signal: string;
};

const modes: Array<{ key: ModeKey; label: string; helper: string }> = [
  { key: "game", label: "Game", helper: "Turn it into a playable loop." },
  { key: "tool", label: "Tool", helper: "Make it useful in one sitting." },
  { key: "social", label: "Social", helper: "Shape it for sharing and remixing." },
  { key: "weird", label: "Weird", helper: "Push it into stranger territory." },
];

const intensities: Array<{ key: IntensityKey; label: string; helper: string }> = [
  { key: "small", label: "Small", helper: "Keep the core idea intact." },
  { key: "medium", label: "Medium", helper: "Change the format and audience." },
  { key: "wild", label: "Wild", helper: "Make a sharper leap." },
];

const mutationBanks: Record<ModeKey, Record<IntensityKey, Array<Omit<Mutation, "signal">>>> = {
  game: {
    small: [
      {
        angle: "One-button challenge",
        hook: "Reduce the idea to a single satisfying action.",
        build: "Add a score, timer, three difficulty beats, and a restart loop.",
        audience: "People who want a quick browser break.",
      },
      {
        angle: "Daily micro mission",
        hook: "Make the idea playable once per day with a tiny goal.",
        build: "Generate a new constraint each session and show a shareable result.",
        audience: "Visitors who like repeatable rituals.",
      },
      {
        angle: "Reflex trainer",
        hook: "Turn the idea into timing, reaction, and pattern reading.",
        build: "Use escalating waves, near-miss feedback, and compact mobile controls.",
        audience: "Players who enjoy short arcade loops.",
      },
    ],
    medium: [
      {
        angle: "Boss-rush metaphor",
        hook: "Represent the idea as a sequence of mini opponents.",
        build: "Give each round a different rule and show progress as a run history.",
        audience: "Players who want a fast sense of mastery.",
      },
      {
        angle: "Puzzle sandbox",
        hook: "Let users rearrange the idea into a solvable system.",
        build: "Create draggable pieces, validation states, and a final reveal.",
        audience: "People who like experimenting before committing.",
      },
      {
        angle: "Cozy score chase",
        hook: "Make improvement feel calm instead of competitive.",
        build: "Pair soft visual rewards with tiny risk and visible streaks.",
        audience: "Casual players who dislike pressure.",
      },
    ],
    wild: [
      {
        angle: "Reverse game",
        hook: "Make the player protect the problem instead of solving it.",
        build: "Invert win conditions and reward surprising restraint.",
        audience: "Players drawn to strange rules and novelty.",
      },
      {
        angle: "Living rulebook",
        hook: "The game rewrites one rule after each success.",
        build: "Show mutation history and let players lock one favorite rule.",
        audience: "Curious players who like emergent systems.",
      },
      {
        angle: "Invisible interface",
        hook: "Remove direct controls and make users infer the system.",
        build: "Use sound, color, or delayed effects as the primary feedback.",
        audience: "Experimental game fans.",
      },
    ],
  },
  tool: {
    small: [
      {
        angle: "Checklist companion",
        hook: "Turn the idea into a lightweight decision aid.",
        build: "Add five checks, a readiness score, and a copyable next step.",
        audience: "Creators who need clarity before acting.",
      },
      {
        angle: "Input-to-output helper",
        hook: "Ask for one sentence and return a structured result.",
        build: "Use three templates, editable fields, and copy buttons.",
        audience: "People who want practical output fast.",
      },
      {
        angle: "Personal calculator",
        hook: "Make the idea measurable with a simple score.",
        build: "Use sliders, visible weights, and a plain-English interpretation.",
        audience: "Users comparing options quickly.",
      },
    ],
    medium: [
      {
        angle: "Workflow mapper",
        hook: "Transform the idea into a step-by-step operating system.",
        build: "Show stages, blockers, owners, and a generated action list.",
        audience: "Small teams or solo builders.",
      },
      {
        angle: "Quality inspector",
        hook: "Audit the idea against a known standard.",
        build: "Create pass/fail criteria, severity tags, and exportable notes.",
        audience: "Users preparing something public.",
      },
      {
        angle: "Tiny planner",
        hook: "Convert a vague idea into a one-week plan.",
        build: "Generate daily tasks, time estimates, and fallback scope.",
        audience: "People who stall at planning.",
      },
    ],
    wild: [
      {
        angle: "Negotiation simulator",
        hook: "Make the idea argue with the user until it becomes clearer.",
        build: "Use personas, objections, and a final decision memo.",
        audience: "Builders testing whether an idea survives pressure.",
      },
      {
        angle: "Constraint engine",
        hook: "Force the idea through unusual limits.",
        build: "Generate constraints by budget, time, audience, and medium.",
        audience: "Creators who need sharper differentiation.",
      },
      {
        angle: "Autopsy tool",
        hook: "Pretend the idea failed and identify why before launch.",
        build: "List likely failure modes, warning signs, and prevention steps.",
        audience: "People making higher-stakes decisions.",
      },
    ],
  },
  social: {
    small: [
      {
        angle: "Shareable prompt",
        hook: "Make the idea invite a personal answer.",
        build: "Add a result card and a short copyable caption.",
        audience: "People who like comparing outcomes.",
      },
      {
        angle: "Before-and-after maker",
        hook: "Show transformation in one screen.",
        build: "Let users enter a starting point and generate an improved version.",
        audience: "Users who want something they can post.",
      },
      {
        angle: "Tiny challenge",
        hook: "Frame the idea as a one-minute public challenge.",
        build: "Include a timer, completion state, and share text.",
        audience: "Friends, followers, and small communities.",
      },
    ],
    medium: [
      {
        angle: "Remix chain",
        hook: "Each user changes one part of the idea.",
        build: "Show the previous version, the mutation, and a share link.",
        audience: "Communities that like collaborative making.",
      },
      {
        angle: "Opinion splitter",
        hook: "Turn the idea into a tasteful this-or-that decision.",
        build: "Generate two positions, let users vote, and show the split.",
        audience: "People who enjoy light debate.",
      },
      {
        angle: "Public scoreboard",
        hook: "Make outcomes visible without needing accounts.",
        build: "Show anonymous totals, streaks, and featured responses.",
        audience: "Visitors who need social proof.",
      },
    ],
    wild: [
      {
        angle: "Chain reaction page",
        hook: "One share unlocks a new version of the idea.",
        build: "Use milestones, hidden variants, and a public progress meter.",
        audience: "Early fans who enjoy discovery.",
      },
      {
        angle: "Collective creature",
        hook: "Every visitor changes a shared visual organism.",
        build: "Map choices to shape, mood, motion, and a public history.",
        audience: "People who enjoy low-friction participation.",
      },
      {
        angle: "Argument arena",
        hook: "Let two interpretations of the idea compete.",
        build: "Generate rounds, let users pick winners, and evolve the next prompt.",
        audience: "People who like performative reasoning.",
      },
    ],
  },
  weird: {
    small: [
      {
        angle: "Object POV",
        hook: "Tell the idea from the perspective of a surprising object.",
        build: "Use a first-person interface and reveal the practical takeaway.",
        audience: "Visitors who like playful reframing.",
      },
      {
        angle: "Wrong medium",
        hook: "Translate the idea into a format it should not fit.",
        build: "Make it a receipt, weather report, recipe, or inspection form.",
        audience: "People who enjoy novelty but still want clarity.",
      },
      {
        angle: "Tiny ritual",
        hook: "Make the idea feel like a ceremonial action.",
        build: "Use three deliberate steps, soundless feedback, and a result token.",
        audience: "Users drawn to calm interactive objects.",
      },
    ],
    medium: [
      {
        angle: "Constraint theatre",
        hook: "The idea performs under absurd restrictions.",
        build: "Let users pick restrictions and watch the output change.",
        audience: "Creative builders hunting for angles.",
      },
      {
        angle: "Time-travel version",
        hook: "Ask how the idea works in the past, present, and future.",
        build: "Show three panels with different mechanics and user needs.",
        audience: "People exploring product positioning.",
      },
      {
        angle: "Emotion machine",
        hook: "Make the idea mutate by mood instead of feature.",
        build: "Map emotions to color, copy, pace, and interaction rules.",
        audience: "Designers and writers.",
      },
    ],
    wild: [
      {
        angle: "Dream logic tool",
        hook: "Keep the result useful while the interface behaves oddly.",
        build: "Use surreal labels, consistent rules, and a grounded export.",
        audience: "People who remember unusual web experiences.",
      },
      {
        angle: "Anti-product",
        hook: "Make the idea deliberately resist normal usage.",
        build: "Reward patience, misclicks, hesitation, or unexpected pauses.",
        audience: "Experimental interaction fans.",
      },
      {
        angle: "Mutation oracle",
        hook: "The tool answers with symbolic constraints instead of direct advice.",
        build: "Generate a symbol, interpretation, and practical next build step.",
        audience: "Creators who want provocation, not instructions.",
      },
    ],
  },
};

const ideaSeeds = [
  "A browser game that helps people practice focus for two minutes.",
  "A tiny tool that turns messy project notes into a launch plan.",
  "An interactive page where visitors grow a shared digital garden.",
  "A playful calculator for deciding what to build next.",
];

export function IdeaMutationMachine() {
  const [idea, setIdea] = useState(ideaSeeds[0]);
  const [modeKey, setModeKey] = useState<ModeKey>("tool");
  const [intensityKey, setIntensityKey] = useState<IntensityKey>("medium");
  const [seed, setSeed] = useState(7);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const mode = modes.find((item) => item.key === modeKey) ?? modes[1];
  const intensity = intensities.find((item) => item.key === intensityKey) ?? intensities[1];

  const mutations = useMemo(() => {
    const base = mutationBanks[modeKey][intensityKey];
    return base.map((item, index) => ({
      ...item,
      signal: getSignal({ idea, index, modeKey, intensityKey, seed }),
    }));
  }, [idea, intensityKey, modeKey, seed]);

  const ideaScore = useMemo(() => {
    const wordCount = idea.trim().split(/\s+/).filter(Boolean).length;
    const clarity = Math.min(100, 34 + wordCount * 5 + (idea.includes(" for ") ? 14 : 0) + (idea.includes("that") ? 8 : 0));
    return Math.max(20, clarity);
  }, [idea]);

  const machineSummary = `${mode.label} / ${intensity.label} / ${mutations.length} mutations`;

  function remix() {
    setSeed((current) => current + 19);
  }

  function loadSeedIdea() {
    const index = Math.abs(seed + idea.length) % ideaSeeds.length;
    setIdea(ideaSeeds[index]);
    setSeed((current) => current + 11);
  }

  async function copyMutation(mutation: Mutation, index: number) {
    const output = [
      `Idea Mutation ${index + 1}: ${mutation.angle}`,
      `Original idea: ${idea}`,
      `Hook: ${mutation.hook}`,
      `Build: ${mutation.build}`,
      `Audience: ${mutation.audience}`,
      `Signal: ${mutation.signal}`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(output);
      setCopiedId(`${mutation.angle}-${index}`);
      window.setTimeout(() => setCopiedId(null), 1500);
    } catch {
      setCopiedId(null);
    }
  }

  return (
    <section className="idea-machine-shell" aria-label="Idea Mutation Machine">
      <div className="idea-machine-hero">
        <div className="idea-machine-copy">
          <span className="section-kicker">
            <FlaskConical size={15} aria-hidden="true" />
            Creative mutation lab
          </span>
          <h1>Idea Mutation Machine</h1>
          <p>
            Paste one rough concept, choose a direction, and generate sharper alternate versions with hooks, build
            notes, audiences, and validation signals.
          </p>
        </div>

        <div className="idea-machine-meter">
          <span>Idea clarity</span>
          <strong>{ideaScore}%</strong>
          <small>{machineSummary}</small>
          <div aria-hidden="true">
            <i style={{ width: `${ideaScore}%` }} />
          </div>
        </div>
      </div>

      <div className="idea-machine-workbench">
        <div className="idea-machine-controls" aria-label="Mutation controls">
          <label className="idea-field">
            <span>Original idea</span>
            <textarea value={idea} rows={5} maxLength={220} onChange={(event) => setIdea(event.target.value)} />
          </label>

          <div className="idea-option-group">
            <span>Mutation direction</span>
            <div>
              {modes.map((item) => (
                <button
                  className={item.key === mode.key ? "is-active" : ""}
                  key={item.key}
                  type="button"
                  onClick={() => setModeKey(item.key)}
                >
                  <strong>{item.label}</strong>
                  <small>{item.helper}</small>
                </button>
              ))}
            </div>
          </div>

          <div className="idea-option-group">
            <span>Mutation strength</span>
            <div>
              {intensities.map((item) => (
                <button
                  className={item.key === intensity.key ? "is-active" : ""}
                  key={item.key}
                  type="button"
                  onClick={() => setIntensityKey(item.key)}
                >
                  <strong>{item.label}</strong>
                  <small>{item.helper}</small>
                </button>
              ))}
            </div>
          </div>

          <div className="idea-machine-actions">
            <button className="ghost-button" type="button" onClick={loadSeedIdea}>
              <Dices size={17} aria-hidden="true" />
              Seed idea
            </button>
            <button className="solid-button" type="button" onClick={remix}>
              <RefreshCw size={17} aria-hidden="true" />
              Remix
            </button>
          </div>
        </div>

        <div className="idea-machine-results" aria-label="Generated idea mutations">
          <div className="idea-machine-results-heading">
            <div>
              <span className="section-kicker">
                <Wand2 size={15} aria-hidden="true" />
                Mutation output
              </span>
              <h2>{mode.label} mutations</h2>
            </div>
            <small>{intensity.helper}</small>
          </div>

          <div className="idea-mutation-grid">
            {mutations.map((mutation, index) => {
              const copied = copiedId === `${mutation.angle}-${index}`;
              return (
                <article className="idea-mutation-card" key={`${mutation.angle}-${index}`}>
                  <div className="idea-mutation-card-heading">
                    <span>0{index + 1}</span>
                    <strong>{mutation.angle}</strong>
                  </div>
                  <p>{mutation.hook}</p>
                  <div className="idea-mutation-detail">
                    <span>Build</span>
                    <strong>{mutation.build}</strong>
                  </div>
                  <div className="idea-mutation-detail">
                    <span>Audience</span>
                    <strong>{mutation.audience}</strong>
                  </div>
                  <div className="idea-mutation-signal">
                    <Sparkles size={15} aria-hidden="true" />
                    {mutation.signal}
                  </div>
                  <button className="ghost-button" type="button" onClick={() => copyMutation(mutation, index)}>
                    {copied ? <Check size={17} aria-hidden="true" /> : <Copy size={17} aria-hidden="true" />}
                    {copied ? "Copied" : "Copy mutation"}
                  </button>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function getSignal({
  idea,
  index,
  modeKey,
  intensityKey,
  seed,
}: {
  idea: string;
  index: number;
  modeKey: ModeKey;
  intensityKey: IntensityKey;
  seed: number;
}) {
  const signals = [
    "Ask five users which version they would open first.",
    "Track whether the first click happens within ten seconds.",
    "Compare TRY opens against views after one small share.",
    "Watch whether people can describe the value in one sentence.",
    "Save the simplest version and cut one feature before building.",
    "Ship a static prototype before adding accounts or storage.",
  ];
  const score = idea.length + seed * 3 + index * 7 + modeKey.length * 5 + intensityKey.length * 11;
  return signals[Math.abs(score) % signals.length];
}
