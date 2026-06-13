"use client";

import { Clipboard, RefreshCw, Sparkles, Wand2 } from "lucide-react";
import { useMemo, useState } from "react";

type GoalKey = "launch" | "game" | "visual" | "tool" | "story";
type ToneKey = "clear" | "playful" | "premium" | "bold" | "calm";
type FormatKey = "brief" | "steps" | "json" | "critique";

const goals: Array<{ key: GoalKey; label: string; helper: string; target: string }> = [
  {
    key: "launch",
    label: "Launch copy",
    helper: "Turn an idea into a public-facing post.",
    target: "write launch copy for a small web product",
  },
  {
    key: "game",
    label: "Game concept",
    helper: "Shape mechanics, loop, and first screen.",
    target: "design a tiny browser game concept",
  },
  {
    key: "visual",
    label: "Visual idea",
    helper: "Generate a style direction and scene.",
    target: "create a visual direction for an interactive canvas piece",
  },
  {
    key: "tool",
    label: "Tool spec",
    helper: "Clarify workflow, controls, and output.",
    target: "draft a compact product spec for a creator tool",
  },
  {
    key: "story",
    label: "Story seed",
    helper: "Build premise, mood, and next beat.",
    target: "develop a short interactive story seed",
  },
];

const tones: Array<{ key: ToneKey; label: string; phrase: string }> = [
  { key: "clear", label: "Clear", phrase: "plain, specific, and easy to act on" },
  { key: "playful", label: "Playful", phrase: "playful, lively, and memorable without becoming silly" },
  { key: "premium", label: "Premium", phrase: "polished, restrained, and product-grade" },
  { key: "bold", label: "Bold", phrase: "direct, high-energy, and confident" },
  { key: "calm", label: "Calm", phrase: "quiet, patient, and reassuring" },
];

const formats: Array<{ key: FormatKey; label: string; helper: string }> = [
  { key: "brief", label: "Creative brief", helper: "Best for starting work fast." },
  { key: "steps", label: "Step plan", helper: "Best for implementation." },
  { key: "json", label: "JSON schema", helper: "Best for structured output." },
  { key: "critique", label: "Critique mode", helper: "Best for improving a draft." },
];

const constraints = [
  "Keep the first version small enough to finish in one sitting.",
  "Prefer visible interaction over explanation.",
  "Include one surprising detail that makes the result feel ownable.",
  "Avoid vague adjectives unless they lead to concrete UI or copy choices.",
  "Return copy that can be pasted directly into a product card.",
];

const formatInstructions: Record<FormatKey, string> = {
  brief:
    "Return a creative brief with: one-sentence concept, target user, key interaction, visual direction, success criteria, and three launch-ready taglines.",
  steps:
    "Return a numbered implementation plan with: scope, components, states, edge cases, polish pass, and a final QA checklist.",
  json:
    'Return valid JSON with keys: "concept", "audience", "features", "visual_style", "copy", "risks", and "next_steps".',
  critique:
    "Act as a strict reviewer. Identify what is unclear, what is generic, what should be removed, and the highest-leverage improvement.",
};

function pickItem<T>(items: T[], seed: number) {
  return items[Math.abs(seed) % items.length];
}

export function AIPromptCardGenerator() {
  const [goalKey, setGoalKey] = useState<GoalKey>("tool");
  const [toneKey, setToneKey] = useState<ToneKey>("clear");
  const [formatKey, setFormatKey] = useState<FormatKey>("brief");
  const [seed, setSeed] = useState(7);
  const [topic, setTopic] = useState("a tiny useful web app for creators");
  const [status, setStatus] = useState("Prompt card ready");

  const goal = goals.find((item) => item.key === goalKey) ?? goals[0];
  const tone = tones.find((item) => item.key === toneKey) ?? tones[0];
  const format = formats.find((item) => item.key === formatKey) ?? formats[0];

  const prompt = useMemo(() => {
    const constraintA = pickItem(constraints, seed + goal.label.length);
    const constraintB = pickItem(constraints, seed + tone.label.length + 3);
    const cleanedTopic = topic.trim() || "a small web idea";

    return [
      `You are helping me ${goal.target}.`,
      `Topic: ${cleanedTopic}.`,
      `Tone: ${tone.phrase}.`,
      `Output format: ${format.label}.`,
      "",
      "Instructions:",
      formatInstructions[format.key],
      "",
      "Constraints:",
      `- ${constraintA}`,
      `- ${constraintB}`,
      "- Make the result practical enough for a solo builder to execute.",
      "- If something is uncertain, make a reasonable assumption and state it briefly.",
      "",
      "Before the final answer, silently check that the result has a clear user action, a visible first screen, and one measurable success signal.",
    ].join("\n");
  }, [format.key, format.label, goal.label.length, goal.target, seed, tone.label.length, tone.phrase, topic]);

  const promptScore = useMemo(() => {
    let score = 42;
    if (topic.trim().length >= 12) score += 16;
    if (goal.key !== "launch") score += 8;
    if (format.key === "steps" || format.key === "json") score += 10;
    if (tone.key === "clear" || tone.key === "premium") score += 8;
    score += Math.min(16, Math.round(prompt.length / 90));
    return Math.min(100, score);
  }, [format.key, goal.key, prompt.length, tone.key, topic]);

  const shufflePrompt = () => {
    setSeed((current) => current + 11);
    setStatus("Prompt angle refreshed");
  };

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setStatus("Copied to clipboard");
    } catch {
      setStatus("Copy failed. Select the prompt text manually.");
    }
  };

  return (
    <section className="prompt-card-shell" aria-label="AI Prompt Card Generator">
      <div className="prompt-card-hero">
        <div className="prompt-card-copy">
          <span className="section-kicker">
            <Wand2 size={15} aria-hidden="true" />
            Practical prompt builder
          </span>
          <h1>AI Prompt Card Generator</h1>
          <p>
            Build a reusable prompt card from a goal, tone, format, and topic. It is designed for quick creator workflows
            instead of blank-page prompting.
          </p>
        </div>

        <div className="prompt-card-score" aria-label="Prompt quality score">
          <span>Prompt strength</span>
          <strong>{promptScore}%</strong>
          <small>{status}</small>
        </div>
      </div>

      <div className="prompt-card-workbench">
        <div className="prompt-card-controls" aria-label="Prompt settings">
          <label className="prompt-topic-field">
            <span>Topic</span>
            <textarea value={topic} rows={4} onChange={(event) => setTopic(event.target.value)} maxLength={180} />
          </label>

          <div className="prompt-option-group">
            <span>Goal</span>
            <div>
              {goals.map((item) => (
                <button className={item.key === goal.key ? "is-active" : ""} key={item.key} type="button" onClick={() => setGoalKey(item.key)}>
                  <strong>{item.label}</strong>
                  <small>{item.helper}</small>
                </button>
              ))}
            </div>
          </div>

          <div className="prompt-chip-group" aria-label="Tone">
            <span>Tone</span>
            <div>
              {tones.map((item) => (
                <button className={item.key === tone.key ? "is-active" : ""} key={item.key} type="button" onClick={() => setToneKey(item.key)}>
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="prompt-chip-group" aria-label="Output format">
            <span>Format</span>
            <div>
              {formats.map((item) => (
                <button className={item.key === format.key ? "is-active" : ""} key={item.key} type="button" onClick={() => setFormatKey(item.key)}>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="prompt-card-preview" aria-label="Generated prompt">
          <div className="prompt-card-preview-heading">
            <div>
              <span className="section-kicker">
                <Sparkles size={15} aria-hidden="true" />
                Generated card
              </span>
              <h2>{goal.label}</h2>
              <p>
                {tone.label} / {format.label}
              </p>
            </div>
            <div className="prompt-card-actions">
              <button className="ghost-button" type="button" onClick={shufflePrompt}>
                <RefreshCw size={17} aria-hidden="true" />
                Refresh
              </button>
              <button className="solid-button" type="button" onClick={copyPrompt}>
                <Clipboard size={17} aria-hidden="true" />
                Copy Prompt
              </button>
            </div>
          </div>

          <pre>{prompt}</pre>

          <div className="prompt-card-footer">
            <span>{prompt.length} characters</span>
            <span>{format.helper}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
