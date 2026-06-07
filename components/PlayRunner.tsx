"use client";

import { ExternalLink, Flag, Info, Maximize2, Minimize2, RefreshCw, Shield } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { externalRunnerSandbox, localPreviewSandbox, runnerAllowPolicy } from "@/lib/play-runner";

type PlayRunnerProps = {
  title: string;
  playableDemoUrl: string | null;
  originLabel: string;
  previewHtml: string;
  detailsHref: string;
  reportHref: string;
};

export function PlayRunner({ title, playableDemoUrl, originLabel, previewHtml, detailsHref, reportHref }: PlayRunnerProps) {
  const [frameKey, setFrameKey] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSlow, setIsSlow] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isExternal = Boolean(playableDemoUrl);

  useEffect(() => {
    setIsLoaded(false);
    setIsSlow(false);
    setIsBlocked(false);

    const slowTimeout = window.setTimeout(() => {
      setIsSlow(true);
    }, 8000);

    const blockedTimeout = window.setTimeout(() => {
      setIsBlocked(true);
    }, 18000);

    return () => {
      window.clearTimeout(slowTimeout);
      window.clearTimeout(blockedTimeout);
    };
  }, [frameKey, playableDemoUrl]);

  useEffect(() => {
    if (!isFocused) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsFocused(false);
    }

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isFocused]);

  function reloadFrame() {
    setFrameKey((value) => value + 1);
  }

  return (
    <div className={isFocused ? "play-runner-shell is-focused" : "play-runner-shell"}>
      <div className="play-runner-status" aria-label="Runner safety status">
        <span>
          <Shield size={16} aria-hidden="true" />
          Isolated iframe
        </span>
        <span>No referrer shared</span>
        <span>{isExternal ? "External demo" : "oeeco preview"}</span>
      </div>

      <div className="play-runner-controls">
        <span>{isExternal ? originLabel : "oeeco generated preview"}</span>
        <div>
          <button className="ghost-button" type="button" onClick={reloadFrame}>
            <RefreshCw size={17} aria-hidden="true" />
            Reload
          </button>
          <button
            aria-pressed={isFocused}
            className="ghost-button"
            type="button"
            onClick={() => setIsFocused((value) => !value)}
          >
            {isFocused ? <Minimize2 size={17} aria-hidden="true" /> : <Maximize2 size={17} aria-hidden="true" />}
            {isFocused ? "Exit Focus" : "Focus"}
          </button>
          <Link className="ghost-button" href={reportHref}>
            <Flag size={17} aria-hidden="true" />
            Report
          </Link>
          {playableDemoUrl ? (
            <Link className="solid-button" href={playableDemoUrl} target="_blank" rel="noreferrer">
              <ExternalLink size={17} aria-hidden="true" />
              Open New Tab
            </Link>
          ) : null}
        </div>
      </div>

      <div className="play-window">
        {!isLoaded ? (
          <div className={isBlocked ? "play-loading is-blocked" : "play-loading"} aria-live="polite">
            <Shield size={24} aria-hidden="true" />
            <strong>{isBlocked ? "Runner could not confirm loading" : isSlow ? "Still loading" : "Preparing sandbox"}</strong>
            <p>
              {isBlocked
                ? "This usually means the creator demo blocks iframe embedding, is offline, or needs more time than the runner can confirm."
                : isSlow
                ? "Some creator demos block iframe loading. You can retry here or open the work in a new tab."
                : `Loading ${isExternal ? originLabel : "oeeco preview"} in a restricted runner.`}
            </p>
            {isBlocked ? (
              <div className="play-recovery-card">
                <span>Recovery options</span>
                <ul>
                  <li>Retry the sandbox if the site is slow.</li>
                  <li>Open the creator demo in a new tab when available.</li>
                  <li>Return to details if the demo keeps blocking the runner.</li>
                </ul>
              </div>
            ) : null}
            {isSlow ? (
              <div className="play-loading-actions">
                <button className="ghost-button" type="button" onClick={reloadFrame}>
                  <RefreshCw size={17} aria-hidden="true" />
                  Retry
                </button>
                {playableDemoUrl ? (
                  <Link className="solid-button" href={playableDemoUrl} target="_blank" rel="noreferrer">
                    <ExternalLink size={17} aria-hidden="true" />
                    Open New Tab
                  </Link>
                ) : null}
                {isBlocked ? (
                  <Link className="ghost-button" href={detailsHref}>
                    <Info size={17} aria-hidden="true" />
                    Details
                  </Link>
                ) : null}
                {isBlocked ? (
                  <Link className="ghost-button" href={reportHref}>
                    <Flag size={17} aria-hidden="true" />
                    Report Issue
                  </Link>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}

        {playableDemoUrl ? (
          <iframe
            allow={runnerAllowPolicy}
            allowFullScreen
            className="play-frame"
            key={frameKey}
            onLoad={() => setIsLoaded(true)}
            referrerPolicy="no-referrer"
            sandbox={externalRunnerSandbox}
            src={playableDemoUrl}
            title={`${title} preview`}
          />
        ) : (
          <iframe
            className="play-frame"
            key={frameKey}
            onLoad={() => setIsLoaded(true)}
            referrerPolicy="no-referrer"
            sandbox={localPreviewSandbox}
            srcDoc={previewHtml}
            title={`${title} preview`}
          />
        )}
      </div>
    </div>
  );
}
