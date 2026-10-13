"use client";

import { ExternalLink, Maximize2, Minimize2, RefreshCw, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { TrackedExternalLink } from "@/components/TrackedExternalLink";
import { WorkReportButton } from "@/components/WorkReportButton";
import { externalRunnerSandbox, localPreviewSandbox, runnerAllowPolicy } from "@/lib/play-runner";

type PlayRunnerProps = {
  title: string;
  playableDemoUrl: string | null;
  originLabel: string;
  previewHtml: string;
  workId: string;
};

export function PlayRunner({ title, playableDemoUrl, originLabel, previewHtml, workId }: PlayRunnerProps) {
  const [frameKey, setFrameKey] = useState(0);
  const [hasFrameLoaded, setHasFrameLoaded] = useState(false);
  const [isSlow, setIsSlow] = useState(false);
  const [isUnconfirmed, setIsUnconfirmed] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isExternal = Boolean(playableDemoUrl);

  useEffect(() => {
    if (hasFrameLoaded) return;

    const slowTimeout = window.setTimeout(() => {
      setIsSlow(true);
    }, 8000);

    const unconfirmedTimeout = window.setTimeout(() => {
      setIsUnconfirmed(true);
    }, 18000);

    return () => {
      window.clearTimeout(slowTimeout);
      window.clearTimeout(unconfirmedTimeout);
    };
  }, [frameKey, playableDemoUrl, hasFrameLoaded]);

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
    setHasFrameLoaded(false);
    setIsSlow(false);
    setIsUnconfirmed(false);
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
          <WorkReportButton context="play" work={{ id: workId, title }} />
          {playableDemoUrl ? (
            <TrackedExternalLink className="solid-button" href={playableDemoUrl} metric="demo_open" workId={workId}>
              <ExternalLink size={17} aria-hidden="true" />
              Open in New Tab
            </TrackedExternalLink>
          ) : null}
        </div>
        {playableDemoUrl ? (
          <p className="play-runner-hint">
            Blank or unresponsive preview? Downloads (including PNG) may be restricted here.
            Try Open in New Tab above; some browser limitations may still apply.
          </p>
        ) : null}
      </div>

      <div className="play-window">
        {!hasFrameLoaded ? (
          <div className={isUnconfirmed ? "play-loading is-blocked" : "play-loading"} aria-live="polite">
            <Shield size={24} aria-hidden="true" />
            <strong>{isUnconfirmed ? "Preview loading is unconfirmed" : isSlow ? "Still loading" : "Loading preview"}</strong>
            <p>
              {isUnconfirmed
                ? "The frame has not finished loading. It may be slow, unavailable, or unable to embed. This does not confirm whether the app is running."
                : isSlow
                ? "The frame is taking longer than expected. Use Reload above, or Open in New Tab when available."
                : `Loading ${isExternal ? originLabel : "oeeco preview"} in a restricted runner.`}
            </p>
            {isUnconfirmed ? <p>Use Reload above, or Open in New Tab when available.</p> : null}
          </div>
        ) : null}

        {playableDemoUrl ? (
          <iframe
            allow={runnerAllowPolicy}
            allowFullScreen
            className="play-frame"
            key={frameKey}
            // A frame load event does not verify that the embedded app is working.
            onLoad={() => setHasFrameLoaded(true)}
            referrerPolicy="no-referrer"
            sandbox={externalRunnerSandbox}
            src={playableDemoUrl}
            title={`${title} preview`}
          />
        ) : (
          <iframe
            className="play-frame"
            key={frameKey}
            // A frame load event does not verify that the embedded app is working.
            onLoad={() => setHasFrameLoaded(true)}
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
