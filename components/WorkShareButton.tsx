"use client";

import { Check, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
  const [feedback, setFeedback] = useState<"idle" | "copied" | "shared" | "failed">("idle");
  const resetTimer = useRef<number | null>(null);

  function showFeedback(nextFeedback: "copied" | "shared" | "failed") {
    setFeedback(nextFeedback);

    if (resetTimer.current) {
      window.clearTimeout(resetTimer.current);
    }

    resetTimer.current = window.setTimeout(() => {
      setFeedback("idle");
      resetTimer.current = null;
    }, 1800);
  }

  async function shareWork() {
    trackWorkEngagement(workId, "share");
    const shareUrl = getShareUrl(url);

    if (shouldUseNativeShare({ title, text: summary, url: shareUrl })) {
      try {
        await navigator.share({ title, text: summary, url: shareUrl });
        showFeedback("shared");
        return;
      } catch {
        // Fall through to copying so the button still does something useful.
      }
    }

    const copied = await copyShareUrl(shareUrl);
    showFeedback(copied ? "copied" : "failed");
  }

  useEffect(() => {
    return () => {
      if (resetTimer.current) {
        window.clearTimeout(resetTimer.current);
      }
    };
  }, []);

  const label = getButtonLabel(feedback);
  const isDone = feedback === "copied" || feedback === "shared";

  return (
    <button
      className={className}
      type="button"
      onClick={shareWork}
      aria-label={iconOnly ? `${label} ${title}` : undefined}
      title={iconOnly ? label : undefined}
    >
      {isDone ? <Check size={17} aria-hidden="true" /> : <Share2 size={17} aria-hidden="true" />}
      {iconOnly ? (
        <span className={feedback === "idle" ? "share-button-status" : "share-button-status is-visible"}>
          {label}
        </span>
      ) : (
        label
      )}
    </button>
  );
}

function getShareUrl(url: string) {
  if (/^https?:\/\//i.test(url)) return url;
  return new URL(url, window.location.origin).toString();
}

function shouldUseNativeShare(data: ShareData) {
  if (typeof navigator.share !== "function") return false;

  const mobileUserAgent = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (!mobileUserAgent) return false;

  const coarsePointer = typeof window.matchMedia === "function" && window.matchMedia("(pointer: coarse)").matches;
  const likelyMobile = navigator.maxTouchPoints > 0 || coarsePointer;
  if (!likelyMobile) return false;

  if (typeof navigator.canShare === "function" && !navigator.canShare(data)) return false;
  return true;
}

async function copyShareUrl(shareUrl: string) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(shareUrl);
      return true;
    } catch {
      // Use the textarea fallback below.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = shareUrl;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "0";
  document.body.appendChild(textarea);
  textarea.select();

  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    document.body.removeChild(textarea);
  }
}

function getButtonLabel(feedback: "idle" | "copied" | "shared" | "failed") {
  if (feedback === "copied") return "Copied";
  if (feedback === "shared") return "Shared";
  if (feedback === "failed") return "Copy failed";
  return "Share";
}
