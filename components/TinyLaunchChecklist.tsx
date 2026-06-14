"use client";

import { CheckCircle2, ClipboardCheck, Copy, RefreshCw, Rocket, ShieldCheck, Sparkles, Target } from "lucide-react";
import { useMemo, useState } from "react";

type ChecklistItem = {
  id: string;
  category: "Build" | "Page" | "Trust" | "Share";
  label: string;
  helper: string;
  weight: number;
};

const checklist: ChecklistItem[] = [
  {
    id: "playable-demo",
    category: "Build",
    label: "Playable demo works from a fresh browser",
    helper: "Open it in an incognito window or another device.",
    weight: 12,
  },
  {
    id: "mobile-fit",
    category: "Build",
    label: "Mobile layout does not overlap",
    helper: "Check the first screen, core controls, and ending state.",
    weight: 8,
  },
  {
    id: "fast-start",
    category: "Build",
    label: "First interaction is obvious within five seconds",
    helper: "The user should know what to press without reading a manual.",
    weight: 10,
  },
  {
    id: "clear-title",
    category: "Page",
    label: "Title and summary say what the work does",
    helper: "Avoid vague names if the experience needs context.",
    weight: 8,
  },
  {
    id: "cover-image",
    category: "Page",
    label: "Cover image shows the real experience",
    helper: "Use a recognizable frame, not a generic decoration.",
    weight: 7,
  },
  {
    id: "tags",
    category: "Page",
    label: "Tags match how people would search for it",
    helper: "Use category, tool, interaction style, and subject tags.",
    weight: 6,
  },
  {
    id: "safe-link",
    category: "Trust",
    label: "External link is safe and expected",
    helper: "Avoid surprise redirects, login walls, or broken hosts.",
    weight: 10,
  },
  {
    id: "no-private-data",
    category: "Trust",
    label: "No private keys, personal files, or hidden drafts are exposed",
    helper: "Check source, demo text, screenshots, and console output.",
    weight: 10,
  },
  {
    id: "report-path",
    category: "Trust",
    label: "User has a way to report a problem",
    helper: "A visible report path reduces risk when the work spreads.",
    weight: 6,
  },
  {
    id: "share-copy",
    category: "Share",
    label: "One-sentence share copy is ready",
    helper: "Write the sentence before posting anywhere.",
    weight: 8,
  },
  {
    id: "try-tested",
    category: "Share",
    label: "TRY button has been tested after publish",
    helper: "Test the public URL, not only the local version.",
    weight: 9,
  },
  {
    id: "feedback-target",
    category: "Share",
    label: "First feedback target is chosen",
    helper: "Send it to a small trusted group before wider posting.",
    weight: 6,
  },
];

const defaultChecked = ["playable-demo", "clear-title", "cover-image", "safe-link", "share-copy"];

export function TinyLaunchChecklist() {
  const [checkedIds, setCheckedIds] = useState<string[]>(defaultChecked);
  const [shareCopy, setShareCopy] = useState("Try this small interactive web work on oeeco.");
  const [copied, setCopied] = useState(false);

  const checkedSet = useMemo(() => new Set(checkedIds), [checkedIds]);
  const totalWeight = checklist.reduce((sum, item) => sum + item.weight, 0);
  const earnedWeight = checklist.reduce((sum, item) => sum + (checkedSet.has(item.id) ? item.weight : 0), 0);
  const score = Math.round((earnedWeight / totalWeight) * 100);
  const readyItems = checklist.filter((item) => checkedSet.has(item.id)).length;
  const missingItems = checklist.filter((item) => !checkedSet.has(item.id)).sort((a, b) => b.weight - a.weight);
  const status = getReadinessStatus(score);
  const groupedItems = useMemo(() => {
    return checklist.reduce<Record<ChecklistItem["category"], ChecklistItem[]>>(
      (groups, item) => {
        groups[item.category].push(item);
        return groups;
      },
      { Build: [], Page: [], Trust: [], Share: [] },
    );
  }, []);

  const launchNote = useMemo(() => {
    const gaps = missingItems
      .slice(0, 3)
      .map((item) => item.label)
      .join("; ");

    return [
      `Launch readiness: ${score}% (${status.label})`,
      `Checked: ${readyItems}/${checklist.length}`,
      `Share copy: ${shareCopy.trim() || "Add a one-sentence share copy."}`,
      gaps ? `Next gaps: ${gaps}` : "Next gaps: none. Ready for a small public share test.",
    ].join("\n");
  }, [missingItems, readyItems, score, shareCopy, status.label]);

  function toggleItem(id: string) {
    setCheckedIds((current) => (current.includes(id) ? current.filter((itemId) => itemId !== id) : [...current, id]));
  }

  function resetChecklist() {
    setCheckedIds(defaultChecked);
    setShareCopy("Try this small interactive web work on oeeco.");
    setCopied(false);
  }

  async function copyLaunchNote() {
    try {
      await navigator.clipboard.writeText(launchNote);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="launch-checklist-shell" aria-label="Tiny Launch Checklist">
      <div className="launch-checklist-hero">
        <div className="launch-checklist-copy">
          <span className="section-kicker">
            <ClipboardCheck size={15} aria-hidden="true" />
            Tiny launch tool
          </span>
          <h1>Tiny Launch Checklist</h1>
          <p>
            A compact readiness board for checking a demo, public page, trust basics, and first-share preparation before
            sending a work into the world.
          </p>
        </div>

        <div className={`launch-score-card ${status.tone}`}>
          <span>{status.kicker}</span>
          <strong>{score}%</strong>
          <p>{status.helper}</p>
          <div aria-hidden="true">
            <i style={{ width: `${score}%` }} />
          </div>
        </div>
      </div>

      <div className="launch-checklist-workbench">
        <div className="launch-checklist-panel" aria-label="Launch checklist items">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div className="launch-checklist-group" key={category}>
              <div className="launch-checklist-group-heading">
                <span>{category}</span>
                <small>
                  {items.filter((item) => checkedSet.has(item.id)).length}/{items.length}
                </small>
              </div>
              <div className="launch-checklist-items">
                {items.map((item) => {
                  const checked = checkedSet.has(item.id);
                  return (
                    <button
                      className={checked ? "launch-check-item is-checked" : "launch-check-item"}
                      key={item.id}
                      type="button"
                      onClick={() => toggleItem(item.id)}
                    >
                      <span aria-hidden="true">{checked ? <CheckCircle2 size={19} /> : <Target size={19} />}</span>
                      <strong>{item.label}</strong>
                      <small>{item.helper}</small>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <aside className="launch-checklist-results" aria-label="Launch readiness result">
          <div className="launch-result-block">
            <span className="section-kicker">
              <Rocket size={15} aria-hidden="true" />
              Next action
            </span>
            <h2>{status.action}</h2>
            <p>{status.detail}</p>
          </div>

          <div className="launch-gap-list">
            <div className="launch-gap-heading">
              <ShieldCheck size={17} aria-hidden="true" />
              <strong>Highest-impact gaps</strong>
            </div>
            {missingItems.length ? (
              missingItems.slice(0, 4).map((item) => (
                <button className="launch-gap" key={item.id} type="button" onClick={() => toggleItem(item.id)}>
                  <span>{item.weight} pts</span>
                  <strong>{item.label}</strong>
                </button>
              ))
            ) : (
              <p className="launch-clear-state">No open gaps. Run one small share test and compare TRY opens.</p>
            )}
          </div>

          <label className="launch-share-field">
            <span>Share copy</span>
            <textarea value={shareCopy} rows={3} maxLength={160} onChange={(event) => setShareCopy(event.target.value)} />
          </label>

          <pre className="launch-note-preview">{launchNote}</pre>

          <div className="launch-checklist-actions">
            <button className="ghost-button" type="button" onClick={resetChecklist}>
              <RefreshCw size={17} aria-hidden="true" />
              Reset
            </button>
            <button className="solid-button" type="button" onClick={copyLaunchNote}>
              {copied ? <CheckCircle2 size={17} aria-hidden="true" /> : <Copy size={17} aria-hidden="true" />}
              {copied ? "Copied" : "Copy note"}
            </button>
          </div>

          <div className="launch-mini-metrics" aria-label="Checklist progress">
            <div>
              <Sparkles size={16} aria-hidden="true" />
              <span>{readyItems} ready</span>
            </div>
            <div>
              <Target size={16} aria-hidden="true" />
              <span>{missingItems.length} gaps</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function getReadinessStatus(score: number) {
  if (score >= 88) {
    return {
      action: "Run a small public share test",
      detail: "The basics are covered. Share with a small group and watch whether views turn into TRY opens.",
      helper: "Ready for controlled traffic.",
      kicker: "Launch-ready",
      label: "Ready",
      tone: "is-ready",
    };
  }

  if (score >= 68) {
    return {
      action: "Fix the top gaps before posting",
      detail: "This is close. Clear the highest-weight missing items before sending traffic from outside oeeco.",
      helper: "Almost there, but not for a bigger push.",
      kicker: "Nearly ready",
      label: "Almost ready",
      tone: "is-almost",
    };
  }

  return {
    action: "Keep it in review mode",
    detail: "The work still needs basic readiness checks before it should be shared outside a trusted test group.",
    helper: "Too many core checks are open.",
    kicker: "Needs work",
    label: "Needs work",
    tone: "is-low",
  };
}
