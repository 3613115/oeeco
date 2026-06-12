"use client";

import { Check, Share2 } from "lucide-react";
import { useState } from "react";

type CreatorShareButtonProps = {
  className?: string;
  creatorName: string;
  summary: string;
  url: string;
};

export function CreatorShareButton({
  className = "ghost-button",
  creatorName,
  summary,
  url,
}: CreatorShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function shareCreator() {
    const shareUrl = getShareUrl(url);

    if (navigator.share) {
      try {
        await navigator.share({ title: `${creatorName} on oeeco`, text: summary, url: shareUrl });
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
    <button className={className} type="button" onClick={shareCreator}>
      {copied ? <Check size={17} aria-hidden="true" /> : <Share2 size={17} aria-hidden="true" />}
      {copied ? "Copied" : "Share Profile"}
    </button>
  );
}

function getShareUrl(url: string) {
  if (/^https?:\/\//i.test(url)) return url;
  return new URL(url, window.location.origin).toString();
}
