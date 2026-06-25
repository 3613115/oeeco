"use client";

import { CheckCircle2, Clipboard, Gauge, RefreshCw, Sparkles, Wand2 } from "lucide-react";
import { useMemo, useState } from "react";

type ToneKey = "direct" | "premium" | "friendly" | "technical";
type GoalKey = "signup" | "demo" | "waitlist" | "purchase";

type Diagnosis = {
  label: string;
  score: number;
  note: string;
  fix: string;
};

const tones: Array<{ key: ToneKey; label: string; helper: string }> = [
  { key: "direct", label: "Direct", helper: "Short, concrete, conversion-focused." },
  { key: "premium", label: "Premium", helper: "Polished, calm, higher-trust." },
  { key: "friendly", label: "Friendly", helper: "Warm, human, low-friction." },
  { key: "technical", label: "Technical", helper: "Precise, feature-aware, credible." },
];

const goals: Array<{ key: GoalKey; label: string; cta: string; secondary: string }> = [
  { key: "signup", label: "Signups", cta: "Start free", secondary: "See how it works" },
  { key: "demo", label: "Demo calls", cta: "Book a demo", secondary: "View product tour" },
  { key: "waitlist", label: "Waitlist", cta: "Join the waitlist", secondary: "Read the roadmap" },
  { key: "purchase", label: "Purchases", cta: "Get started", secondary: "Compare plans" },
];

const vagueWords = [
  "innovative",
  "powerful",
  "seamless",
  "revolutionary",
  "next-gen",
  "all-in-one",
  "easy",
  "simple",
  "smart",
  "better",
  "fast",
  "efficient",
];

const outcomeWords = ["save", "reduce", "increase", "launch", "ship", "convert", "automate", "track", "find", "build", "publish"];

const defaultDraft = {
  headline: "AI workspace for small teams",
  subhead: "Plan, write, and launch marketing pages faster with reusable AI workflows.",
  audience: "solo founders and small SaaS teams",
  problem: "turning rough product ideas into clear launch pages",
  offer: "a guided workspace that scores copy, rewrites weak sections, and creates launch-ready variants",
  proof: "built from 200+ launch page reviews",
  cta: "Improve my page",
};

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function words(value: string) {
  return value.trim().split(/\s+/).filter(Boolean);
}

function includesAny(value: string, terms: string[]) {
  const lowered = value.toLowerCase();
  return terms.some((term) => lowered.includes(term));
}

function countVagueTerms(value: string) {
  const lowered = value.toLowerCase();
  return vagueWords.filter((word) => lowered.includes(word)).length;
}

function hasNumber(value: string) {
  return /\d/.test(value);
}

function getGoal(key: GoalKey) {
  return goals.find((goal) => goal.key === key) ?? goals[0];
}

function getTone(key: ToneKey) {
  return tones.find((tone) => tone.key === key) ?? tones[0];
}

function scoreLength(value: string, min: number, max: number) {
  const count = words(value).length;
  if (!count) return 18;
  if (count >= min && count <= max) return 100;
  if (count < min) return 48 + count * 8;
  return Math.max(35, 100 - (count - max) * 8);
}

function makeDiagnosis(input: typeof defaultDraft): Diagnosis[] {
  const headlineLength = scoreLength(input.headline, 5, 12);
  const subheadLength = scoreLength(input.subhead, 12, 28);
  const audienceScore = input.audience.trim().length > 8 ? 92 : 38;
  const problemScore = input.problem.trim().length > 12 ? 88 : 34;
  const proofScore = input.proof.trim()
    ? hasNumber(input.proof) || includesAny(input.proof, ["customer", "user", "case", "built", "used", "trusted"])
      ? 92
      : 66
    : 26;
  const ctaScore = input.cta.trim().length > 4 && words(input.cta).length <= 5 ? 88 : 52;
  const vaguePenalty = Math.min(28, countVagueTerms(`${input.headline} ${input.subhead} ${input.offer}`) * 7);
  const outcomeScore = includesAny(`${input.headline} ${input.subhead} ${input.offer}`, outcomeWords) ? 88 : 48;

  return [
    {
      label: "Headline clarity",
      score: clampScore(headlineLength - vaguePenalty),
      note: headlineLength > 85 ? "The headline is scannable." : "The headline needs a clearer promise.",
      fix: "Name the user and the outcome in one line.",
    },
    {
      label: "Audience fit",
      score: clampScore(audienceScore),
      note: audienceScore > 80 ? "The target user is visible." : "The page sounds too broad.",
      fix: "Use a concrete audience such as founders, agencies, analysts, or teachers.",
    },
    {
      label: "Problem pressure",
      score: clampScore(problemScore),
      note: problemScore > 80 ? "The pain point gives the offer context." : "The pain point is still implied.",
      fix: "Say what the user struggles with before introducing the product.",
    },
    {
      label: "Outcome strength",
      score: clampScore((subheadLength + outcomeScore) / 2 - vaguePenalty / 2),
      note: outcomeScore > 80 ? "The copy points toward a real result." : "The result is not concrete enough.",
      fix: "Use a verb like launch, reduce, convert, automate, or publish.",
    },
    {
      label: "Proof",
      score: clampScore(proofScore),
      note: proofScore > 80 ? "There is a usable trust signal." : "The trust signal is weak or missing.",
      fix: "Add a metric, customer type, usage count, case study, or credible process.",
    },
    {
      label: "CTA",
      score: clampScore(ctaScore),
      note: ctaScore > 80 ? "The CTA is short and actionable." : "The CTA needs a stronger action.",
      fix: "Start with a verb and keep it under five words.",
    },
  ];
}

function getGrade(score: number) {
  if (score >= 88) return "A";
  if (score >= 76) return "B";
  if (score >= 64) return "C";
  if (score >= 52) return "D";
  return "F";
}

function makeRewrite(input: typeof defaultDraft, toneKey: ToneKey, goalKey: GoalKey) {
  const goal = getGoal(goalKey);
  const audience = input.audience.trim() || "busy teams";
  const problem = input.problem.trim() || "unclear launch copy";
  const offer = input.offer.trim() || input.subhead.trim() || "a guided workflow that improves your page";
  const proof = input.proof.trim();
  const cta = input.cta.trim() || goal.cta;
  const outcomePromise = problem.toLowerCase().startsWith("turning ")
    ? `Turn ${problem.slice(8)}`
    : `Fix ${problem}`;

  const toneOpeners: Record<ToneKey, string> = {
    direct: `${outcomePromise} without the guesswork`,
    premium: `A clearer launch page for ${audience}`,
    friendly: `Help ${audience} say yes with less friction`,
    technical: `Diagnose and improve landing page conversion signals`,
  };

  const subheads: Record<ToneKey, string> = {
    direct: `For ${audience}, ${offer}. Sharpen the promise, remove vague claims, and make the next step obvious.`,
    premium: `${offer}. Built to help ${audience} explain the offer, earn trust, and guide visitors toward one confident action.`,
    friendly: `${offer}. Give visitors a clear reason to care, a useful proof point, and a next step that feels easy.`,
    technical: `${offer}. Scores clarity, audience fit, proof, and CTA strength so ${audience} can improve the page systematically.`,
  };

  return {
    eyebrow: proof ? proof : `For ${audience}`,
    headline: toneOpeners[toneKey],
    subhead: subheads[toneKey],
    primaryCta: cta,
    secondaryCta: goal.secondary,
    bullets: [
      `Clarify the promise for ${audience}.`,
      `Connect the offer to ${problem}.`,
      proof ? `Use proof: ${proof}.` : "Add one metric, customer example, or credibility signal.",
    ],
  };
}

function makeTestIdeas(input: typeof defaultDraft, score: number) {
  const audience = input.audience.trim() || "your target users";
  const problem = input.problem.trim() || "the main pain point";
  const offer = input.offer.trim() || "your offer";
  const first = score >= 76 ? "Test a sharper CTA against the current one." : "Test a headline that names the audience and result.";

  return [
    first,
    `Ask five ${audience} to explain what the product does after five seconds.`,
    `Create one variant focused on ${problem} and one variant focused on ${offer}.`,
  ];
}

export function LandingPageCopyDoctor() {
  const [headline, setHeadline] = useState(defaultDraft.headline);
  const [subhead, setSubhead] = useState(defaultDraft.subhead);
  const [audience, setAudience] = useState(defaultDraft.audience);
  const [problem, setProblem] = useState(defaultDraft.problem);
  const [offer, setOffer] = useState(defaultDraft.offer);
  const [proof, setProof] = useState(defaultDraft.proof);
  const [cta, setCta] = useState(defaultDraft.cta);
  const [toneKey, setToneKey] = useState<ToneKey>("direct");
  const [goalKey, setGoalKey] = useState<GoalKey>("signup");
  const [status, setStatus] = useState("Diagnosis ready");

  const input = useMemo(
    () => ({ headline, subhead, audience, problem, offer, proof, cta }),
    [audience, cta, headline, offer, problem, proof, subhead],
  );

  const diagnosis = useMemo(() => makeDiagnosis(input), [input]);
  const overallScore = useMemo(
    () => clampScore(diagnosis.reduce((sum, item) => sum + item.score, 0) / diagnosis.length),
    [diagnosis],
  );
  const rewrite = useMemo(() => makeRewrite(input, toneKey, goalKey), [goalKey, input, toneKey]);
  const testIdeas = useMemo(() => makeTestIdeas(input, overallScore), [input, overallScore]);
  const grade = getGrade(overallScore);
  const tone = getTone(toneKey);
  const goal = getGoal(goalKey);
  const topFixes = [...diagnosis].sort((a, b) => a.score - b.score).slice(0, 3);

  const rewrittenCopy = [
    rewrite.eyebrow,
    rewrite.headline,
    rewrite.subhead,
    "",
    `Primary CTA: ${rewrite.primaryCta}`,
    `Secondary CTA: ${rewrite.secondaryCta}`,
    "",
    "Support bullets:",
    ...rewrite.bullets.map((bullet) => `- ${bullet}`),
  ].join("\n");

  const copyRewrite = async () => {
    try {
      await navigator.clipboard.writeText(rewrittenCopy);
      setStatus("Rewrite copied");
    } catch {
      setStatus("Copy failed. Select the text manually.");
    }
  };

  const resetDraft = () => {
    setHeadline(defaultDraft.headline);
    setSubhead(defaultDraft.subhead);
    setAudience(defaultDraft.audience);
    setProblem(defaultDraft.problem);
    setOffer(defaultDraft.offer);
    setProof(defaultDraft.proof);
    setCta(defaultDraft.cta);
    setToneKey("direct");
    setGoalKey("signup");
    setStatus("Sample restored");
  };

  return (
    <main className="copy-doctor-shell">
      <section className="copy-doctor-hero">
        <div>
          <span className="section-kicker">
            <Wand2 size={15} aria-hidden="true" />
            Landing page copy doctor
          </span>
          <h1>Diagnose the first screen before visitors bounce</h1>
          <p>
            Paste the core pieces of a landing page and get a practical score, weak spots, a rewritten hero, and test
            ideas for the next version.
          </p>
        </div>
        <div className="copy-doctor-score" aria-label="Landing page score">
          <span>Page grade</span>
          <strong>{grade}</strong>
          <small>{overallScore}/100 - {status}</small>
        </div>
      </section>

      <section className="copy-doctor-workbench">
        <div className="copy-doctor-form" aria-label="Landing page inputs">
          <div className="copy-doctor-panel-heading">
            <span className="section-kicker">
              <Sparkles size={15} aria-hidden="true" />
              Draft inputs
            </span>
            <button type="button" onClick={resetDraft}>
              <RefreshCw size={16} aria-hidden="true" />
              Reset sample
            </button>
          </div>

          <label>
            <span>Headline</span>
            <input value={headline} maxLength={100} onChange={(event) => setHeadline(event.target.value)} />
          </label>

          <label>
            <span>Subhead</span>
            <textarea value={subhead} rows={3} maxLength={220} onChange={(event) => setSubhead(event.target.value)} />
          </label>

          <div className="copy-doctor-two">
            <label>
              <span>Target user</span>
              <input value={audience} maxLength={90} onChange={(event) => setAudience(event.target.value)} />
            </label>
            <label>
              <span>CTA</span>
              <input value={cta} maxLength={40} onChange={(event) => setCta(event.target.value)} />
            </label>
          </div>

          <label>
            <span>Main problem</span>
            <input value={problem} maxLength={140} onChange={(event) => setProblem(event.target.value)} />
          </label>

          <label>
            <span>Offer</span>
            <textarea value={offer} rows={3} maxLength={240} onChange={(event) => setOffer(event.target.value)} />
          </label>

          <label>
            <span>Proof</span>
            <input value={proof} maxLength={120} onChange={(event) => setProof(event.target.value)} />
          </label>

          <div className="copy-doctor-options">
            <div>
              <span>Tone</span>
              <div>
                {tones.map((item) => (
                  <button
                    className={item.key === tone.key ? "is-active" : ""}
                    key={item.key}
                    type="button"
                    onClick={() => setToneKey(item.key)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <small>{tone.helper}</small>
            </div>
            <div>
              <span>Goal</span>
              <div>
                {goals.map((item) => (
                  <button
                    className={item.key === goal.key ? "is-active" : ""}
                    key={item.key}
                    type="button"
                    onClick={() => setGoalKey(item.key)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <small>Optimized for {goal.cta.toLowerCase()}.</small>
            </div>
          </div>
        </div>

        <div className="copy-doctor-results" aria-label="Landing page diagnosis">
          <div className="copy-doctor-score-grid">
            <article className="copy-doctor-main-score">
              <Gauge size={18} aria-hidden="true" />
              <span>Conversion readiness</span>
              <strong>{overallScore}</strong>
              <small>{overallScore >= 76 ? "Ready to test" : "Needs sharper positioning"}</small>
            </article>
            {diagnosis.map((item) => (
              <article className="copy-doctor-metric" key={item.label}>
                <span>{item.label}</span>
                <strong>{item.score}</strong>
                <i><b style={{ width: `${item.score}%` }} /></i>
              </article>
            ))}
          </div>

          <div className="copy-doctor-diagnosis">
            <div className="copy-doctor-panel-heading">
              <span className="section-kicker">
                <CheckCircle2 size={15} aria-hidden="true" />
                Priority fixes
              </span>
            </div>
            {topFixes.map((item) => (
              <article key={item.label}>
                <div>
                  <strong>{item.label}</strong>
                  <span>{item.score}/100</span>
                </div>
                <p>{item.note}</p>
                <small>{item.fix}</small>
              </article>
            ))}
          </div>

          <div className="copy-doctor-rewrite">
            <div className="copy-doctor-panel-heading">
              <span className="section-kicker">
                <Wand2 size={15} aria-hidden="true" />
                Rewritten hero
              </span>
              <button type="button" onClick={copyRewrite}>
                <Clipboard size={16} aria-hidden="true" />
                Copy
              </button>
            </div>
            <div className="copy-doctor-hero-card">
              <span>{rewrite.eyebrow}</span>
              <h2>{rewrite.headline}</h2>
              <p>{rewrite.subhead}</p>
              <div>
                <span>{rewrite.primaryCta}</span>
                <span>{rewrite.secondaryCta}</span>
              </div>
            </div>
            <ul>
              {rewrite.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </div>

          <div className="copy-doctor-tests">
            <span className="section-kicker">Next tests</span>
            {testIdeas.map((idea) => (
              <p key={idea}>{idea}</p>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
