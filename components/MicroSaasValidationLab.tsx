"use client";

import { Clipboard, Compass, Gauge, RefreshCw, Rocket, ShieldAlert, Sparkles, Target, WalletCards } from "lucide-react";
import { useMemo, useState } from "react";

type SegmentKey = "creator" | "b2b" | "consumer" | "developer" | "local";
type StageKey = "idea" | "prototype" | "users" | "revenue";
type ChannelKey = "content" | "community" | "outbound" | "seo" | "marketplace";

type ScoreItem = {
  key: string;
  label: string;
  score: number;
  note: string;
};

type UserSegment = {
  title: string;
  trigger: string;
  pain: string;
  paySignal: string;
};

const segments: Array<{ key: SegmentKey; label: string; helper: string }> = [
  { key: "creator", label: "Creators", helper: "Makers, writers, video teams, indie builders." },
  { key: "b2b", label: "B2B teams", helper: "Operators, sales, support, managers." },
  { key: "consumer", label: "Consumers", helper: "Personal productivity or lifestyle users." },
  { key: "developer", label: "Developers", helper: "Engineers, API users, technical teams." },
  { key: "local", label: "Local services", helper: "Clinics, agencies, shops, field teams." },
];

const stages: Array<{ key: StageKey; label: string }> = [
  { key: "idea", label: "Idea" },
  { key: "prototype", label: "Prototype" },
  { key: "users", label: "Early users" },
  { key: "revenue", label: "Revenue" },
];

const channels: Array<{ key: ChannelKey; label: string; helper: string }> = [
  { key: "content", label: "Content", helper: "X, LinkedIn, newsletters, short guides." },
  { key: "community", label: "Community", helper: "Reddit, Discord, niche forums, groups." },
  { key: "outbound", label: "Outbound", helper: "Cold email, direct messages, founder-led sales." },
  { key: "seo", label: "SEO", helper: "Templates, comparison pages, search demand." },
  { key: "marketplace", label: "Marketplace", helper: "Product Hunt, app stores, plugin hubs." },
];

const defaultLab = {
  idea: "A browser tool that audits a startup landing page and rewrites the first screen for better conversion.",
  user: "solo founders, indie hackers, and small SaaS teams preparing a launch",
  problem: "they know the product but struggle to explain the value clearly enough for strangers to act",
  alternative: "asking friends for feedback, hiring a copywriter, or using generic AI prompts",
  price: "monthly subscription around $12 to $29, with a free diagnostic",
  distribution: "share teardown examples on X, founder communities, Product Hunt, and SEO pages for landing page feedback",
};

const paymentWords = ["pay", "$", "monthly", "subscription", "budget", "revenue", "client", "customer", "cost", "price", "paid"];
const urgentWords = ["daily", "weekly", "deadline", "launch", "revenue", "manual", "slow", "expensive", "miss", "risk", "urgent"];
const clearUserWords = ["founder", "team", "agency", "developer", "creator", "marketer", "sales", "support", "clinic", "shop", "student"];
const hardBuildWords = ["ai", "realtime", "video", "agent", "automation", "api", "compliance", "banking", "health", "enterprise"];
const channelWords = ["x", "twitter", "linkedin", "reddit", "seo", "product hunt", "community", "newsletter", "outbound", "email", "tiktok"];
const crowdedWords = ["crm", "todo", "chatbot", "notion", "calendar", "project management", "email", "fitness", "habit"];

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function wordCount(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function includesAny(value: string, words: string[]) {
  const lowered = value.toLowerCase();
  return words.some((word) => lowered.includes(word));
}

function countMatches(value: string, words: string[]) {
  const lowered = value.toLowerCase();
  return words.filter((word) => lowered.includes(word)).length;
}

function scoreSpecificity(value: string, minWords: number, maxWords: number) {
  const count = wordCount(value);
  if (!count) return 20;
  if (count >= minWords && count <= maxWords) return 88;
  if (count < minWords) return 38 + count * 7;
  return Math.max(56, 92 - (count - maxWords) * 2);
}

function getSegment(key: SegmentKey) {
  return segments.find((segment) => segment.key === key) ?? segments[0];
}

function getStage(key: StageKey) {
  return stages.find((stage) => stage.key === key) ?? stages[0];
}

function getChannel(key: ChannelKey) {
  return channels.find((channel) => channel.key === key) ?? channels[0];
}

function getScores(input: typeof defaultLab, segmentKey: SegmentKey, stageKey: StageKey, channelKey: ChannelKey): ScoreItem[] {
  const fullText = `${input.idea} ${input.user} ${input.problem} ${input.alternative} ${input.price} ${input.distribution}`;
  const userScore = clampScore(scoreSpecificity(input.user, 6, 18) + countMatches(input.user, clearUserWords) * 4);
  const painScore = clampScore(scoreSpecificity(input.problem, 9, 28) + countMatches(input.problem, urgentWords) * 6);
  const payScore = clampScore((input.price.trim() ? 70 : 35) + countMatches(input.price, paymentWords) * 8 + (segmentKey === "b2b" ? 8 : 0));
  const marketScore = clampScore(scoreSpecificity(input.idea, 8, 28) + (input.alternative.trim() ? 8 : -10));
  const buildPenalty = Math.min(30, countMatches(fullText, hardBuildWords) * 5);
  const mvpScore = clampScore(84 - buildPenalty + (stageKey === "prototype" ? 8 : 0) + (stageKey === "revenue" ? 10 : 0));
  const distributionScore = clampScore(
    scoreSpecificity(input.distribution, 7, 24) + countMatches(input.distribution, channelWords) * 5 + (channelKey === "outbound" ? 4 : 0),
  );
  const competitionScore = clampScore(78 - countMatches(fullText, crowdedWords) * 9 + (input.alternative.trim() ? 6 : 0));

  return [
    {
      key: "pain",
      label: "Pain intensity",
      score: painScore,
      note: painScore >= 75 ? "The problem feels active enough to test." : "The pain still needs a sharper trigger.",
    },
    {
      key: "user",
      label: "User clarity",
      score: userScore,
      note: userScore >= 75 ? "The first customer segment is visible." : "The audience is too broad for a first launch.",
    },
    {
      key: "pay",
      label: "Willingness to pay",
      score: payScore,
      note: payScore >= 75 ? "There is a plausible payment path." : "Pricing or buyer budget is still fuzzy.",
    },
    {
      key: "market",
      label: "Market focus",
      score: marketScore,
      note: marketScore >= 75 ? "The idea has a clear category." : "The category needs narrower positioning.",
    },
    {
      key: "mvp",
      label: "MVP feasibility",
      score: mvpScore,
      note: mvpScore >= 75 ? "A first version can be scoped tightly." : "The first version may be too hard or broad.",
    },
    {
      key: "distribution",
      label: "Distribution path",
      score: distributionScore,
      note: distributionScore >= 75 ? "There are usable first channels." : "The go-to-market path needs a concrete wedge.",
    },
    {
      key: "competition",
      label: "Competition pressure",
      score: competitionScore,
      note: competitionScore >= 75 ? "Competition looks manageable with a wedge." : "The space may be crowded or generic.",
    },
  ];
}

function getVerdict(score: number, scores: ScoreItem[]) {
  const lowest = [...scores].sort((a, b) => a.score - b.score)[0];
  if (score >= 78 && lowest.score >= 58) {
    return {
      label: "Build now",
      helper: "Good enough to validate with a small MVP and real users.",
      action: "Ship a narrow diagnostic or workflow and charge for the first useful result.",
    };
  }
  if (score >= 60) {
    return {
      label: "Narrow first",
      helper: `${lowest.label} is the current bottleneck.`,
      action: "Tighten the wedge before building the full product.",
    };
  }
  return {
    label: "Do not build yet",
    helper: `${lowest.label} is too weak for a serious MVP.`,
    action: "Interview users and rewrite the problem before writing code.",
  };
}

function makeUserSegments(input: typeof defaultLab, segmentKey: SegmentKey): UserSegment[] {
  const baseUser = input.user.trim() || getSegment(segmentKey).helper.toLowerCase();
  const problem = input.problem.trim() || "a recurring workflow problem";
  const alternative = input.alternative.trim() || "manual workarounds";

  const segmentMap: Record<SegmentKey, UserSegment[]> = {
    creator: [
      {
        title: "Solo operator",
        trigger: "Needs to publish something public this week.",
        pain: problem,
        paySignal: "Pays if the tool saves a visible launch or content task.",
      },
      {
        title: "Small content team",
        trigger: "Repeats the same review or production workflow.",
        pain: `Current fallback: ${alternative}.`,
        paySignal: "Pays when collaboration and reuse are included.",
      },
      {
        title: "Indie builder",
        trigger: "Has an idea but needs faster validation.",
        pain: "Low confidence before sharing publicly.",
        paySignal: "Pays for clarity, reusable assets, or proof of demand.",
      },
    ],
    b2b: [
      {
        title: "Ops owner",
        trigger: "A manual process blocks a weekly business metric.",
        pain: problem,
        paySignal: "Pays when ROI is tied to time, revenue, or error reduction.",
      },
      {
        title: "Team lead",
        trigger: "Needs a repeatable workflow for multiple teammates.",
        pain: `Current fallback: ${alternative}.`,
        paySignal: "Pays for reporting, permissions, and reliability.",
      },
      {
        title: "Founder buyer",
        trigger: "Needs a quick win before hiring or custom software.",
        pain: "Does not want another broad platform.",
        paySignal: "Pays for a narrow tool with immediate result.",
      },
    ],
    consumer: [
      {
        title: "High-intent personal user",
        trigger: "Feels the problem repeatedly enough to search for help.",
        pain: problem,
        paySignal: "Pays only if the benefit is frequent and emotionally clear.",
      },
      {
        title: "Power user",
        trigger: "Already uses spreadsheets, apps, or templates.",
        pain: `Current fallback: ${alternative}.`,
        paySignal: "Pays for convenience or a better personal system.",
      },
      {
        title: "Community-driven user",
        trigger: "Sees examples from peers.",
        pain: "Needs a result they can show or share.",
        paySignal: "Pays less, but can drive word of mouth.",
      },
    ],
    developer: [
      {
        title: "Builder with workflow pain",
        trigger: "Repeats technical setup, testing, or review tasks.",
        pain: problem,
        paySignal: "Pays for saved engineering time or avoided mistakes.",
      },
      {
        title: "Technical team lead",
        trigger: "Needs consistency across projects.",
        pain: `Current fallback: ${alternative}.`,
        paySignal: "Pays if there is documentation, API, or team control.",
      },
      {
        title: "Toolchain adopter",
        trigger: "Already pays for developer tooling.",
        pain: "Wants a focused improvement without platform lock-in.",
        paySignal: "Pays for speed, reliability, and integration.",
      },
    ],
    local: [
      {
        title: "Owner-operator",
        trigger: "A repeated admin task steals customer-facing time.",
        pain: problem,
        paySignal: "Pays when the tool saves time without training.",
      },
      {
        title: "Small agency",
        trigger: "Needs to deliver the same output for many clients.",
        pain: `Current fallback: ${alternative}.`,
        paySignal: "Pays if the product helps bill more or deliver faster.",
      },
      {
        title: "Field team",
        trigger: "Needs a mobile-friendly workflow.",
        pain: "Existing tools are too complex or desk-bound.",
        paySignal: "Pays for simplicity and reliability.",
      },
    ],
  };

  return segmentMap[segmentKey].map((item, index) => ({
    ...item,
    title: index === 0 ? `${item.title}: ${baseUser}` : item.title,
  }));
}

function makeMvp(input: typeof defaultLab, stageKey: StageKey) {
  const problem = input.problem.trim() || "the core pain";
  const idea = input.idea.trim() || "the product idea";
  const stage = getStage(stageKey).label;

  return {
    include: [
      `One narrow workflow that solves: ${problem}.`,
      "A clear before/after result users can understand in under one minute.",
      "Manual onboarding or guided sample data before building complex automation.",
      stageKey === "revenue" ? "Billing or paid pilot flow from day one." : "A waitlist or early-access capture after the first result.",
    ],
    exclude: [
      "Team permissions, dashboards, and settings unless required for payment.",
      "Multiple personas or use cases in the first version.",
      "A large template library before the first 10 user conversations.",
      "Heavy integrations until users ask for the same one repeatedly.",
    ],
    firstVersion: `${stage} version: turn "${idea}" into one guided outcome with a saved result, shareable output, and feedback request.`,
  };
}

function makePricing(input: typeof defaultLab, segmentKey: SegmentKey, score: number) {
  const stated = input.price.trim();
  const base = segmentKey === "b2b" || segmentKey === "developer" ? "$19-$49/mo" : "$8-$19/mo";
  const pro = segmentKey === "b2b" || segmentKey === "local" ? "$49-$149/mo" : "$19-$39/mo";
  return {
    direction: stated || `Start with a free diagnostic, then charge ${base}.`,
    free: "Free: one limited analysis or one saved result to prove value.",
    paid: `Paid: ${base} for repeated use, saved reports, exports, and stronger templates.`,
    team: `Higher tier: ${pro} when users need collaboration, history, or client-ready output.`,
    warning: score < 65 ? "Do not overbuild pricing yet. First confirm users care enough to ask for another run." : "Price the result, not the number of features.",
  };
}

function makeGtm(input: typeof defaultLab, channelKey: ChannelKey) {
  const channel = getChannel(channelKey);
  const distribution = input.distribution.trim() || channel.helper;
  return {
    day7: [
      "Create a one-page demo with the sample result visible before signup.",
      "Do 10 manual reviews or concierge runs for target users.",
      `Post 3 proof examples through: ${distribution}.`,
    ],
    day30: [
      "Turn the best manual outcomes into templates or before/after case studies.",
      "Collect five objections and rewrite the landing page around the strongest one.",
      "Add a paid pilot or preorder for users who ask for repeat usage.",
    ],
    day90: [
      "Double down on the channel that produced the first activated users.",
      "Build only the repeated feature requests from paying or highly active users.",
      "Publish comparison, template, or use-case pages for search and long-tail discovery.",
    ],
  };
}

function makeRisks(scores: ScoreItem[]) {
  return [...scores]
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map((score) => ({
      title: score.label,
      risk: score.note,
      mitigation:
        score.key === "distribution"
          ? "Before building more product, run channel tests with screenshots or a landing page."
          : score.key === "pay"
            ? "Ask for a payment, preorder, paid pilot, or explicit budget signal."
            : score.key === "user"
              ? "Pick one narrow buyer with one repeated job."
              : score.key === "mvp"
                ? "Replace automation with a manual or semi-manual first version."
                : "Write a sharper problem statement and test it in user interviews.",
    }));
}

export function MicroSaasValidationLab() {
  const [idea, setIdea] = useState(defaultLab.idea);
  const [user, setUser] = useState(defaultLab.user);
  const [problem, setProblem] = useState(defaultLab.problem);
  const [alternative, setAlternative] = useState(defaultLab.alternative);
  const [price, setPrice] = useState(defaultLab.price);
  const [distribution, setDistribution] = useState(defaultLab.distribution);
  const [segmentKey, setSegmentKey] = useState<SegmentKey>("creator");
  const [stageKey, setStageKey] = useState<StageKey>("idea");
  const [channelKey, setChannelKey] = useState<ChannelKey>("content");
  const [status, setStatus] = useState("Validation report ready");

  const input = useMemo(
    () => ({ idea, user, problem, alternative, price, distribution }),
    [alternative, distribution, idea, price, problem, user],
  );

  const scores = useMemo(() => getScores(input, segmentKey, stageKey, channelKey), [channelKey, input, segmentKey, stageKey]);
  const totalScore = useMemo(() => clampScore(scores.reduce((sum, score) => sum + score.score, 0) / scores.length), [scores]);
  const verdict = useMemo(() => getVerdict(totalScore, scores), [scores, totalScore]);
  const users = useMemo(() => makeUserSegments(input, segmentKey), [input, segmentKey]);
  const mvp = useMemo(() => makeMvp(input, stageKey), [input, stageKey]);
  const pricing = useMemo(() => makePricing(input, segmentKey, totalScore), [input, segmentKey, totalScore]);
  const gtm = useMemo(() => makeGtm(input, channelKey), [channelKey, input]);
  const risks = useMemo(() => makeRisks(scores), [scores]);
  const weakest = [...scores].sort((a, b) => a.score - b.score)[0];

  const reportText = [
    "Micro SaaS Validation Lab",
    "",
    `Idea: ${input.idea}`,
    `Verdict: ${verdict.label} (${totalScore}/100)`,
    `Next action: ${verdict.action}`,
    "",
    "Scores:",
    ...scores.map((score) => `- ${score.label}: ${score.score}/100 - ${score.note}`),
    "",
    "Top users:",
    ...users.map((item) => `- ${item.title}: ${item.trigger} Pain: ${item.pain} Pay signal: ${item.paySignal}`),
    "",
    "MVP include:",
    ...mvp.include.map((item) => `- ${item}`),
    "",
    "Do not build yet:",
    ...mvp.exclude.map((item) => `- ${item}`),
    "",
    "Pricing:",
    pricing.direction,
    pricing.paid,
    "",
    "First 7 days:",
    ...gtm.day7.map((item) => `- ${item}`),
    "",
    "Risks:",
    ...risks.map((item) => `- ${item.title}: ${item.mitigation}`),
  ].join("\n");

  const resetSample = () => {
    setIdea(defaultLab.idea);
    setUser(defaultLab.user);
    setProblem(defaultLab.problem);
    setAlternative(defaultLab.alternative);
    setPrice(defaultLab.price);
    setDistribution(defaultLab.distribution);
    setSegmentKey("creator");
    setStageKey("idea");
    setChannelKey("content");
    setStatus("Sample restored");
  };

  const copyReport = async () => {
    try {
      await navigator.clipboard.writeText(reportText);
      setStatus("Report copied");
    } catch {
      setStatus("Copy failed. Select the report manually.");
    }
  };

  return (
    <main className="saas-lab-shell">
      <section className="saas-lab-hero">
        <div>
          <span className="section-kicker">
            <Rocket size={15} aria-hidden="true" />
            Micro SaaS Validation Lab
          </span>
          <h1>Pressure-test a product idea before you build the wrong thing</h1>
          <p>
            Score a startup idea across pain, buyer clarity, payment, MVP scope, competition, and distribution. Then turn
            the result into a narrower MVP, pricing path, risk report, and launch plan.
          </p>
        </div>
        <aside className="saas-lab-verdict" aria-label="Validation verdict">
          <span>Verdict</span>
          <strong>{verdict.label}</strong>
          <small>{totalScore}/100 - {status}</small>
        </aside>
      </section>

      <section className="saas-lab-workbench">
        <div className="saas-lab-form" aria-label="Product idea inputs">
          <div className="saas-lab-heading">
            <span className="section-kicker">
              <Sparkles size={15} aria-hidden="true" />
              How to use
            </span>
            <button type="button" onClick={resetSample}>
              <RefreshCw size={16} aria-hidden="true" />
              Reset sample
            </button>
          </div>

          <ol className="saas-lab-instructions">
            <li>Describe one product idea, not a company vision.</li>
            <li>Name the first buyer and the painful job they repeat.</li>
            <li>Use the verdict to decide: build now, narrow first, or interview more users.</li>
          </ol>

          <label htmlFor="saas-idea">
            <span>Product idea</span>
            <textarea id="saas-idea" value={idea} rows={4} maxLength={260} onChange={(event) => setIdea(event.target.value)} />
          </label>

          <label htmlFor="saas-user">
            <span>First target user</span>
            <input id="saas-user" value={user} maxLength={150} onChange={(event) => setUser(event.target.value)} />
          </label>

          <label htmlFor="saas-problem">
            <span>Problem / job to solve</span>
            <textarea id="saas-problem" value={problem} rows={3} maxLength={220} onChange={(event) => setProblem(event.target.value)} />
          </label>

          <label htmlFor="saas-alternative">
            <span>Current alternative</span>
            <input id="saas-alternative" value={alternative} maxLength={170} onChange={(event) => setAlternative(event.target.value)} />
          </label>

          <div className="saas-lab-two">
            <label htmlFor="saas-price">
              <span>Pricing guess</span>
              <input id="saas-price" value={price} maxLength={150} onChange={(event) => setPrice(event.target.value)} />
            </label>
            <label htmlFor="saas-distribution">
              <span>Distribution wedge</span>
              <input id="saas-distribution" value={distribution} maxLength={180} onChange={(event) => setDistribution(event.target.value)} />
            </label>
          </div>

          <div className="saas-lab-options">
            <div>
              <span>Market type</span>
              <div>
                {segments.map((item) => (
                  <button
                    className={item.key === segmentKey ? "is-active" : ""}
                    key={item.key}
                    type="button"
                    onClick={() => setSegmentKey(item.key)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <small>{getSegment(segmentKey).helper}</small>
            </div>
            <div>
              <span>Current stage</span>
              <div>
                {stages.map((item) => (
                  <button
                    className={item.key === stageKey ? "is-active" : ""}
                    key={item.key}
                    type="button"
                    onClick={() => setStageKey(item.key)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <small>Use the stage to keep the MVP realistic.</small>
            </div>
            <div>
              <span>First channel</span>
              <div>
                {channels.map((item) => (
                  <button
                    className={item.key === channelKey ? "is-active" : ""}
                    key={item.key}
                    type="button"
                    onClick={() => setChannelKey(item.key)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <small>{getChannel(channelKey).helper}</small>
            </div>
          </div>
        </div>

        <div className="saas-lab-results" aria-label="Validation report">
          <section className="saas-lab-scoreboard">
            <article className="saas-lab-main-score">
              <Gauge size={18} aria-hidden="true" />
              <span>Validation score</span>
              <strong>{totalScore}</strong>
              <small>Weakest: {weakest.label}</small>
            </article>
            {scores.map((score) => (
              <article className="saas-lab-metric" key={score.key}>
                <span>{score.label}</span>
                <strong>{score.score}</strong>
                <i><b style={{ width: `${score.score}%` }} /></i>
                <small>{score.note}</small>
              </article>
            ))}
          </section>

          <section className="saas-lab-summary">
            <div className="saas-lab-heading">
              <span className="section-kicker">
                <Compass size={15} aria-hidden="true" />
                Final verdict
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

          <section className="saas-lab-users">
            <div className="saas-lab-heading">
              <span className="section-kicker">
                <Target size={15} aria-hidden="true" />
                Target user map
              </span>
            </div>
            <div>
              {users.map((item) => (
                <article key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.trigger}</p>
                  <small>{item.pain}</small>
                  <strong>{item.paySignal}</strong>
                </article>
              ))}
            </div>
          </section>

          <section className="saas-lab-mvp">
            <div className="saas-lab-heading">
              <span className="section-kicker">MVP scope</span>
            </div>
            <p>{mvp.firstVersion}</p>
            <div>
              <article>
                <h3>Build first</h3>
                <ul>
                  {mvp.include.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
              <article>
                <h3>Do not build yet</h3>
                <ul>
                  {mvp.exclude.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </div>
          </section>

          <section className="saas-lab-pricing">
            <div className="saas-lab-heading">
              <span className="section-kicker">
                <WalletCards size={15} aria-hidden="true" />
                Pricing direction
              </span>
            </div>
            <div>
              <p>{pricing.direction}</p>
              <p>{pricing.free}</p>
              <p>{pricing.paid}</p>
              <p>{pricing.team}</p>
            </div>
            <strong>{pricing.warning}</strong>
          </section>

          <section className="saas-lab-gtm">
            <div className="saas-lab-heading">
              <span className="section-kicker">Go-to-market plan</span>
            </div>
            <div>
              <article>
                <h3>First 7 days</h3>
                {gtm.day7.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </article>
              <article>
                <h3>First 30 days</h3>
                {gtm.day30.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </article>
              <article>
                <h3>First 90 days</h3>
                {gtm.day90.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </article>
            </div>
          </section>

          <section className="saas-lab-risks">
            <div className="saas-lab-heading">
              <span className="section-kicker">
                <ShieldAlert size={15} aria-hidden="true" />
                Risk report
              </span>
            </div>
            <div>
              {risks.map((item) => (
                <article key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.risk}</p>
                  <strong>{item.mitigation}</strong>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
