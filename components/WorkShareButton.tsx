"use client";

import { Check, Share2 } from "lucide-react";
import { useState } from "react";
import { trackWorkEngagement } from "@/components/TrackedExternalLink";

type WorkShareButtonProps = {
  summary: string;
  title: string;
  url: string;
  workId: string;
};

export function WorkShareButton({ summary, title, url, workId }: WorkShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function shareWork() {
    trackWorkEngagement(workId, "share");

    if (navigator.share) {
      try {
        await navigator.share({ title, text: summary, url });
        return;
      } catch {
        return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button className="ghost-button" type="button" onClick={shareWork}>
      {copied ? <Check size={17} aria-hidden="true" /> : <Share2 size={17} aria-hidden="true" />}
      {copied ? "Copied" : "Share"}
    </button>
  );
}
