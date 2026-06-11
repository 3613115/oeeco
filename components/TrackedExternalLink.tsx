"use client";

import type { ReactNode } from "react";

type TrackedExternalLinkProps = {
  children: ReactNode;
  className?: string;
  href: string;
  metric: "demo_open";
  workId: string;
};

export function TrackedExternalLink({ children, className, href, metric, workId }: TrackedExternalLinkProps) {
  function trackClick() {
    trackWorkEngagement(workId, metric);
  }

  return (
    <a className={className} href={href} target="_blank" rel="noreferrer" onClick={trackClick}>
      {children}
    </a>
  );
}

export function trackWorkEngagement(workId: string, metric: "try" | "demo_open" | "share") {
  const url = `/api/works/${workId}/engagement`;
  const body = JSON.stringify({ metric });

  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon(url, blob);
    return;
  }

  fetch(url, {
    method: "POST",
    body,
    headers: { "content-type": "application/json" },
    keepalive: true,
  }).catch(() => undefined);
}
