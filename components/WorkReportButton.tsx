"use client";

import { Check, Flag, Send, X } from "lucide-react";
import { useMemo, useState } from "react";
import { buildWorkReportHref, reportReasons } from "@/lib/report";

type WorkReportButtonProps = {
  className?: string;
  context: "work" | "play";
  label?: string;
  work: {
    id: string;
    title: string;
  };
};

export function WorkReportButton({ className = "ghost-button", context, label = "Report", work }: WorkReportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState<(typeof reportReasons)[number]>(reportReasons[0]);
  const [details, setDetails] = useState("");
  const [copied, setCopied] = useState(false);

  const reportHref = useMemo(
    () => buildWorkReportHref(work, context, { category: reason, details: cleanDetails(details) }),
    [context, details, reason, work],
  );

  async function copyReportLink() {
    try {
      await navigator.clipboard.writeText(reportHref);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  function closeReport() {
    setIsOpen(false);
    setCopied(false);
  }

  return (
    <>
      <button className={className} type="button" onClick={() => setIsOpen(true)}>
        <Flag size={17} aria-hidden="true" />
        {label}
      </button>
      {isOpen ? (
        <div className="report-modal-backdrop" role="presentation">
          <section className="report-modal" role="dialog" aria-modal="true" aria-labelledby={`report-title-${work.id}`}>
            <div className="report-modal-heading">
              <div>
                <span className="section-kicker">Trust & Safety</span>
                <h2 id={`report-title-${work.id}`}>Report this work</h2>
                <p>Send oeeco a structured report so the work can be checked and hidden if needed.</p>
              </div>
              <button className="icon-button" type="button" onClick={closeReport} aria-label="Close report dialog">
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="report-modal-work">
              <span>Work</span>
              <strong>{work.title}</strong>
            </div>

            <label className="field">
              <span>Issue type</span>
              <select value={reason} onChange={(event) => setReason(event.target.value as (typeof reportReasons)[number])}>
                {reportReasons.map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Details</span>
              <textarea
                maxLength={800}
                value={details}
                onChange={(event) => setDetails(event.target.value)}
                placeholder="What should oeeco check? Include steps to reproduce if the TRY page is broken."
              />
              <span className="form-hint">{details.trim().length}/800 characters</span>
            </label>

            <div className="report-modal-actions">
              <a className="solid-button" href={reportHref} onClick={() => setIsOpen(false)}>
                <Send size={17} aria-hidden="true" />
                Send Report
              </a>
              <button className="ghost-button" type="button" onClick={copyReportLink}>
                {copied ? <Check size={17} aria-hidden="true" /> : <Flag size={17} aria-hidden="true" />}
                {copied ? "Copied" : "Copy Mail Link"}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}

function cleanDetails(value: string) {
  return value.trim().replace(/\s+/g, " ").slice(0, 800);
}
