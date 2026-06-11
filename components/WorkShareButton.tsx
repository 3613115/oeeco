"use client";

import { Check, Share2 } from "lucide-react";
import { useState } from "react";
import { trackWorkEngagement } from "@/components/TrackedExternalLink";

type WorkShareButtonProps = {
  className?: string;
  iconOnly?: boolean;
  summary: string;
  title: string;
  url: string;
  workId: string;
};

export function WorkShareButton({
  className = "ghost-button",
  iconOnly = false,
  summary,
  title,
  url,
  workId,
}: WorkShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function shareWork() {
    trackWorkEngagement(workId, "share");
    const shareUrl = getShareUrl(url);

    if (navigator.share) {
      try {
        await navigator.share({ title, text: summary, url: shareUrl });
        return;
      } catch {
        return;
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      className={className}
      type="button"
      onClick={shareWork}
      aria-label={iconOnly ? `Share ${title}` : undefined}
    >
      {copied ? <Check size={17} aria-hidden="true" /> : <Share2 size={17} aria-hidden="true" />}
      {iconOnly ? null : copied ? "Copied" : "Share"}
    </button>
  );
}

function getShareUrl(url: string) {
  if (/^https?:\/\//i.test(url)) return url;
  return new URL(url, window.location.origin).toString();
}
