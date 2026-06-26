"use client";

import { Clipboard, Lightbulb, MessageSquareText, RefreshCw, SearchCheck, ShieldAlert, Sparkles, Users } from "lucide-react";
import { useMemo, useState } from "react";

type InterviewStage = "discovery" | "prototype" | "pilot" | "churn";
type BuyerType = "founder" | "operator" | "creator" | "developer" | "consumer";

type ScoreItem = {
  key: string;
  label: string;
  score: number;
  note: string;
};

type Theme = {
  label: string;
  strength: number;
  evidence: string;
  nextQuestion: string;
};

const stages: Array<{ key: InterviewStage; label: string; helper: string }> = [
  { key: "discovery", label: "Discovery", helper: "Problem interviews before building." },
  { key: "prototype", label: "Prototype", helper: "Testing a clickable or manual demo." },
  { key: "pilot", label: "Pilot", helper: "Users are trying a paid or serious workflow." },
  { key: "churn", label: "Churn", helper: "Learning why users did not continue." },
];

const buyers: Array<{ key: BuyerType; label: string; helper: string }> = [
  { key: "founder", label: "Founder", helper: "Speed, clarity, revenue, focus." },
  { key: "operator", label: "Operator", helper: "Manual work, handoffs, reporting." },
  { key: "creator", label: "Creator", helper: "Publishing, workflow, audience growth." },
  { key: "developer", label: "Developer", helper: "Tooling, reliability, integration." },
  { key: "consumer", label: "Consumer", helper: "Personal habit, convenience, emotion." },
];

const sample = {
  persona: "solo founders preparing a product launch",
  goal: "learn whether landing page feedback is painful enough to pay for",
  notes:
    "Founder A said they spend every launch rewriting the headline several times and still feel unsure. They currently ask friends for feedback but the comments are vague. They would pay $19/month if the tool showed concrete before/after fixes and saved examples. Founder B said they need this before Product Hunt because unclear copy hurt their last launch. Founder C worried generic AI output would sound bland and asked for proof from real teardown examples.",
  quote: "I know what my product does, but strangers do not get it fast enough.",
  currentAlternative: "asking friends, posting in founder groups, and using generic AI prompts",
  desiredOutcome: "clearer first-screen copy before launch day",
};

const painWords = ["frustrating", "slow", "manual", "hard", "expensive", "unsure", "unclear", "missed", "wasted", "blocked", "risk", "hurt"];
const urgencyWords = ["today", "weekly", "every", "launch", "deadline", "before", "again", "last", "next", "urgent", "now"];
const paymentWords = ["pay", "$", "budget", "pricing", "month", "paid", "purchase", "subscribe", "client", "revenue"];
const alternativeWords = ["currently", "instead", "using", "ask", "spreadsheet", "manual", "friends", "agency", "consultant", "prompt"];
const objectionWords = ["worried", "concern", "but", "however", "too", "generic", "trust", "privacy", "expensive", "hard", "bland"];
const outcomeWords = ["save", "clearer", "faster", "before", "reduce", "increase", "ship", "launch", "convert", "confidence"];

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function countMatches(value: string, words: string[]) {
  const lowered = value.toLowerCase();
  return words.filter((word) => lowered.includes(word)).length;
}

function wordCount(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function sentenceWith(value: string, words: string[]) {
  const sentences = value
    .split(/[.!?。！？]/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
  const found = sentences.find((sentence) => words.some((word) => sentence.toLowerCase().includes(word)));
  return found || sentences[0] || "No direct evidence captured yet.";
}

function getStage(key: InterviewStage) {
  return stages.find((stage) => stage.key === key) ?? stages[0];
}

function getBuyer(key: BuyerType) {
  return buyers.find((buyer) => buyer.key === key) ?? buyers[0];
}

function scoreSpecificity(value: string, minWords: number, maxWords: number) {
  const count = wordCount(value);
  if (!count) return 18;
  if (count >= minWords && count <= maxWords) return 88;
  if (count < minWords) return 40 + count * 7;
  return Math.max(58, 92 - (count - maxWords) * 2);
}

function makeScores(input: typeof sample, stage: InterviewStage, buyer: BuyerType): ScoreItem[] {
  const text = `${input.persona} ${input.goal} ${input.notes} ${input.quote} ${input.currentAlternative} ${input.desiredOutcome}`;
  const noteDepth = scoreSpecificity(input.notes, 35, 120);
  const pain = clampScore(48 + countMatches(text, painWords) * 8 + countMatches(text, urgencyWords) * 5);
  const willingness = clampScore(35 + countMatches(text, paymentWords) * 12 + (buyer === "operator" || buyer === "founder" ? 8 : 0));
  const urgency = clampScore(42 + countMatches(text, urgencyWords) * 9 + (stage === "pilot" ? 10 : 0));
  const alternative = clampScore(42 + countMatches(text, alternativeWords) * 8 + (input.currentAlternative.trim() ? 14 : 0));
  const objection = clampScore(38 + countMatches(text, objectionWords) * 8);
  const outcome = clampScore(42 + countMatches(text, outcomeWords) * 8 + scoreSpecificity(input.desiredOutcome, 4, 14) / 4);
  const persona = clampScore(scoreSpecificity(input.persona, 4, 16) + (buyer === "consumer" ? 0 : 8));

  return [
    {
      key: "depth",
      label: "Interview depth",
      score: clampScore(noteDepth),
      note: noteDepth >= 75 ? "The notes include enough detail to extract signals." : "The notes need more concrete language from the user.",
    },
    {
      key: "pain",
      label: "Pain signal",
      score: pain,
      note: pain >= 75 ? "Users describe a real painful job." : "Pain is present but not sharp enough yet.",
    },
    {
      key: "pay",
      label: "Payment signal",
      score: willingness,
      note: willingness >= 75 ? "There is direct or implied willingness to pay." : "Budget language is weak or missing.",
    },
    {
      key: "urgency",
      label: "Urgency",
      score: urgency,
      note: urgency >= 75 ? "The timing pressure is useful." : "The user may not need this soon.",
    },
    {
      key: "alternative",
      label: "Current alternative",
      score: alternative,
      note: alternative >= 75 ? "You can compare against a real workaround." : "The current workaround needs to be clearer.",
    },
    {
      key: "objection",
      label: "Objection clarity",
      score: objection,
      note: objection >= 70 ? "Objections are visible enough to handle." : "Ask what would stop them from using it.",
    },
    {
      key: "outcome",
      label: "Desired outcome",
      score: outcome,
      note: outcome >= 75 ? "The user wants a concrete after-state." : "The desired result needs more precision.",
    },
    {
      key: "persona",
      label: "Persona clarity",
      score: persona,
      note: persona >= 75 ? "The target segment is usable." : "The persona is too broad for confident conclusions.",
    },
  ];
}

function getVerdict(score: number, scores: ScoreItem[]) {
  const weakest = [...scores].sort((a, b) => a.score - b.score)[0];
  if (score >= 78 && weakest.score >= 55) {
    return {
      label: "Strong signal",
      helper: "The feedback is good enough to run a narrow validation experiment.",
      action: "Build or fake the smallest result users asked for, then ask for payment or repeated use.",
    };
  }
  if (score >= 62) {
    return {
      label: "Promising but narrow",
      helper: `${weakest.label} is the biggest gap.`,
      action: "Interview 5 more people in the same segment before expanding the product.",
    };
  }
  return {
    label: "Weak signal",
    helper: `${weakest.label} is too low for a confident product decision.`,
    action: "Do not build yet. Rewrite the hypothesis and ask more concrete problem questions.",
  };
}

function makeThemes(input: typeof sample): Theme[] {
  const text = `${input.notes} ${input.quote} ${input.currentAlternative} ${input.desiredOutcome}`;
  return [
    {
      label: "Pain",
      strength: clampScore(42 + countMatches(text, painWords) * 10),
      evidence: sentenceWith(text, painWords),
      nextQuestion: "When did this last happen, and what did it cost you?",
    },
    {
      label: "Urgency",
      strength: clampScore(38 + countMatches(text, urgencyWords) * 10),
      evidence: sentenceWith(text, urgencyWords),
      nextQuestion: "Why solve this now instead of later?",
    },
    {
      label: "Payment",
      strength: clampScore(35 + countMatches(text, paymentWords) * 14),
      evidence: sentenceWith(text, paymentWords),
      nextQuestion: "What would make this worth paying for this month?",
    },
    {
      label: "Objection",
      strength: clampScore(36 + countMatches(text, objectionWords) * 12),
      evidence: sentenceWith(text, objectionWords),
      nextQuestion: "What would make you reject this even if it worked?",
    },
  ];
}

function makeNextInterviewQuestions(scores: ScoreItem[], stage: InterviewStage) {
  const weak = [...scores].sort((a, b) => a.score - b.score).slice(0, 3);
  const stageQuestion: Record<InterviewStage, string> = {
    discovery: "Before showing any solution, ask them to walk through the last time the problem happened.",
    prototype: "Show the smallest demo and ask what they expected before explaining anything.",
    pilot: "Ask what would make this part of their weekly workflow.",
    churn: "Ask what they used instead after leaving.",
  };

  return [
    stageQuestion[stage],
    ...weak.map((item) =>
      item.key === "pay"
        ? "What have you paid for to solve this, and what budget would feel obvious?"
        : item.key === "alternative"
          ? "What are you doing today instead, step by step?"
          : item.key === "urgency"
            ? "What deadline, event, or repeated trigger makes this urgent?"
            : item.key === "persona"
              ? "Who feels this problem most painfully, and who can ignore it?"
              : `What specific example proves the ${item.label.toLowerCase()} signal?`,
    ),
  ];
}

function makeActionPlan(score: number, verdict: ReturnType<typeof getVerdict>, input: typeof sample) {
  const persona = input.persona.trim() || "the same target segment";
  if (score >= 78) {
    return [
      `Create a concierge version for ${persona}.`,
      "Ask for a paid pilot, preorder, or repeat-use commitment.",
      "Turn the strongest quote into landing page copy and test it publicly.",
      "Do not add features until three users ask for the same missing piece.",
    ];
  }
  if (score >= 62) {
    return [
      `Interview 5 more people who match: ${persona}.`,
      "Use the same question script so patterns are comparable.",
      "Look for one repeated trigger, one repeated workaround, and one payment phrase.",
      "Delay product scope decisions until the weakest signal improves.",
    ];
  }
  return [
    "Pause building and rewrite the user/problem hypothesis.",
    "Recruit narrower interviewees from one visible channel.",
    "Ask for recent behavior, not opinions about the idea.",
    `Current verdict: ${verdict.label}. Treat this as research, not validation.`,
  ];
}

function makeReport(input: typeof sample, score: number, verdict: ReturnType<typeof getVerdict>, scores: ScoreItem[], themes: Theme[], questions: string[], actions: string[]) {
  return [
    "Customer Interview Signal Lab",
    "",
    `Persona: ${input.persona}`,
    `Goal: ${input.goal}`,
    `Signal verdict: ${verdict.label} (${score}/100)`,
    `Recommended action: ${verdict.action}`,
    "",
    "Scores:",
    ...scores.map((item) => `- ${item.label}: ${item.score}/100 - ${item.note}`),
    "",
    "Themes:",
    ...themes.map((theme) => `- ${theme.label}: ${theme.strength}/100. Evidence: ${theme.evidence}`),
    "",
    "Next interview questions:",
    ...questions.map((question) => `- ${question}`),
    "",
    "Action plan:",
    ...actions.map((action) => `- ${action}`),
  ].join("\n");
}

export function CustomerInterviewSignalLab() {
  const [persona, setPersona] = useState(sample.persona);
  const [goal, setGoal] = useState(sample.goal);
  const [notes, setNotes] = useState(sample.notes);
  const [quote, setQuote] = useState(sample.quote);
  const [currentAlternative, setCurrentAlternative] = useState(sample.currentAlternative);
  const [desiredOutcome, setDesiredOutcome] = useState(sample.desiredOutcome);
  const [stage, setStage] = useState<InterviewStage>("discovery");
  const [buyer, setBuyer] = useState<BuyerType>("founder");
  const [status, setStatus] = useState("Signal report ready");

  const input = useMemo(
    () => ({ persona, goal, notes, quote, currentAlternative, desiredOutcome }),
    [currentAlternative, desiredOutcome, goal, notes, persona, quote],
  );
  const scores = useMemo(() => makeScores(input, stage, buyer), [buyer, input, stage]);
  const signalScore = useMemo(() => clampScore(scores.reduce((sum, item) => sum + item.score, 0) / scores.length), [scores]);
  const verdict = useMemo(() => getVerdict(signalScore, scores), [scores, signalScore]);
  const themes = useMemo(() => makeThemes(input), [input]);
  const questions = useMemo(() => makeNextInterviewQuestions(scores, stage), [scores, stage]);
  const actions = useMemo(() => makeActionPlan(signalScore, verdict, input), [input, signalScore, verdict]);
  const report = useMemo(() => makeReport(input, signalScore, verdict, scores, themes, questions, actions), [actions, input, questions, scores, signalScore, themes, verdict]);
  const weakest = [...scores].sort((a, b) => a.score - b.score)[0];

  const resetSample = () => {
    setPersona(sample.persona);
    setGoal(sample.goal);
    setNotes(sample.notes);
    setQuote(sample.quote);
    setCurrentAlternative(sample.currentAlternative);
    setDesiredOutcome(sample.desiredOutcome);
    setStage("discovery");
    setBuyer("founder");
    setStatus("Sample restored");
  };

  const copyReport = async () => {
    try {
      await navigator.clipboard.writeText(report);
      setStatus("Report copied");
    } catch {
      setStatus("Copy failed. Select the report manually.");
    }
  };

  return (
    <main className="interview-lab-shell">
      <section className="interview-lab-hero">
        <div>
          <span className="section-kicker">
            <MessageSquareText size={15} aria-hidden="true" />
            Customer Interview Signal Lab
          </span>
          <h1>Turn messy user interviews into product evidence</h1>
          <p>
            Paste interview notes, quotes, alternatives, and desired outcomes. The lab scores the signal, extracts themes,
            highlights weak evidence, and produces the next interview script.
          </p>
        </div>
        <aside className="interview-lab-verdict" aria-label="Interview signal verdict">
          <span>Signal</span>
          <strong>{verdict.label}</strong>
          <small>{signalScore}/100 - {status}</small>
        </aside>
      </section>

      <section className="interview-lab-workbench">
        <div className="interview-lab-form" aria-label="Interview notes input">
          <div className="interview-lab-heading">
            <span className="section-kicker">
              <Sparkles size={15} aria-hidden="true" />
              How to use
            </span>
            <button type="button" onClick={resetSample}>
              <RefreshCw size={16} aria-hidden="true" />
              Reset sample
            </button>
          </div>
          <ol className="interview-lab-instructions">
            <li>Paste raw notes from 1-5 similar users.</li>
            <li>Keep direct quotes and current workarounds.</li>
            <li>Use the weakest score to decide the next interview question.</li>
          </ol>

          <label htmlFor="interview-persona">
            <span>Who did you interview?</span>
            <input id="interview-persona" value={persona} maxLength={150} onChange={(event) => setPersona(event.target.value)} />
          </label>

          <label htmlFor="interview-goal">
            <span>Research goal</span>
            <input id="interview-goal" value={goal} maxLength={180} onChange={(event) => setGoal(event.target.value)} />
          </label>

          <label htmlFor="interview-notes">
            <span>Interview notes</span>
            <textarea id="interview-notes" value={notes} rows={7} maxLength={900} onChange={(event) => setNotes(event.target.value)} />
          </label>

          <label htmlFor="interview-quote">
            <span>Strongest quote</span>
            <input id="interview-quote" value={quote} maxLength={220} onChange={(event) => setQuote(event.target.value)} />
          </label>

          <div className="interview-lab-two">
            <label htmlFor="interview-alternative">
              <span>Current alternative</span>
              <textarea id="interview-alternative" value={currentAlternative} rows={3} maxLength={260} onChange={(event) => setCurrentAlternative(event.target.value)} />
            </label>
            <label htmlFor="interview-outcome">
              <span>Desired outcome</span>
              <textarea id="interview-outcome" value={desiredOutcome} rows={3} maxLength={240} onChange={(event) => setDesiredOutcome(event.target.value)} />
            </label>
          </div>

          <div className="interview-lab-options">
            <div>
              <span>Interview stage</span>
              <div>
                {stages.map((item) => (
                  <button className={item.key === stage ? "is-active" : ""} key={item.key} type="button" onClick={() => setStage(item.key)}>
                    {item.label}
                  </button>
                ))}
              </div>
              <small>{getStage(stage).helper}</small>
            </div>
            <div>
              <span>Buyer type</span>
              <div>
                {buyers.map((item) => (
                  <button className={item.key === buyer ? "is-active" : ""} key={item.key} type="button" onClick={() => setBuyer(item.key)}>
                    {item.label}
                  </button>
                ))}
              </div>
              <small>{getBuyer(buyer).helper}</small>
            </div>
          </div>
        </div>

        <div className="interview-lab-results" aria-label="Interview signal report">
          <section className="interview-lab-scoreboard">
            <article className="interview-lab-main-score">
              <SearchCheck size={18} aria-hidden="true" />
              <span>Evidence score</span>
              <strong>{signalScore}</strong>
              <small>Weakest: {weakest.label}</small>
            </article>
            {scores.map((item) => (
              <article className="interview-lab-metric" key={item.key}>
                <span>{item.label}</span>
                <strong>{item.score}</strong>
                <i><b style={{ width: `${item.score}%` }} /></i>
                <small>{item.note}</small>
              </article>
            ))}
          </section>

          <section className="interview-lab-summary">
            <div className="interview-lab-heading">
              <span className="section-kicker">
                <Lightbulb size={15} aria-hidden="true" />
                Verdict
              </span>
              <button type="button" onClick={copyReport}>
                <Clipboard size={16} aria-hidden="true" />
                Copy report
              </button>
            </div>
            <h2>{verdict.label}</h2>
            <p>{verdict.helper}</p>
            <strong>{verdict.action}</strong>
          </section>

          <section className="interview-lab-themes">
            <div className="interview-lab-heading">
              <span className="section-kicker">
                <Users size={15} aria-hidden="true" />
                Signal themes
              </span>
            </div>
            <div>
              {themes.map((theme) => (
                <article key={theme.label}>
                  <div>
                    <h3>{theme.label}</h3>
                    <strong>{theme.strength}</strong>
                  </div>
                  <p>{theme.evidence}</p>
                  <small>{theme.nextQuestion}</small>
                </article>
              ))}
            </div>
          </section>

          <section className="interview-lab-script">
            <div className="interview-lab-heading">
              <span className="section-kicker">Next interview script</span>
            </div>
            {questions.map((question) => (
              <p key={question}>{question}</p>
            ))}
          </section>

          <section className="interview-lab-actions">
            <div className="interview-lab-heading">
              <span className="section-kicker">Action plan</span>
            </div>
            <div>
              {actions.map((action) => (
                <article key={action}>{action}</article>
              ))}
            </div>
          </section>

          <section className="interview-lab-risks">
            <div className="interview-lab-heading">
              <span className="section-kicker">
                <ShieldAlert size={15} aria-hidden="true" />
                Watchouts
              </span>
            </div>
            <p>Do not count compliments as validation unless they connect to recent behavior, a painful workaround, or budget.</p>
            <p>One loud user is not a market. Look for the same trigger repeated by at least three similar users.</p>
            <p>If payment signal is weak, ask for a paid pilot before building more features.</p>
          </section>
        </div>
      </section>
    </main>
  );
}
