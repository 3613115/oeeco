"use client";

import { ExternalLink, RefreshCw, Shield } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { externalRunnerSandbox, localPreviewSandbox, runnerAllowPolicy } from "@/lib/play-runner";

type PlayRunnerProps = {
  title: string;
  playableDemoUrl: string | null;
  originLabel: string;
  previewHtml: string;
};

export function PlayRunner({ title, playableDemoUrl, originLabel, previewHtml }: PlayRunnerProps) {
  const [frameKey, setFrameKey] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSlow, setIsSlow] = useState(false);
  const isExternal = Boolean(playableDemoUrl);

  useEffect(() => {
    setIsLoaded(false);
    setIsSlow(false);

    const timeout = window.setTimeout(() => {
      setIsSlow(true);
    }, 8000);

    return () => window.clearTimeout(timeout);
  }, [frameKey, playableDemoUrl]);

  function reloadFrame() {
    setFrameKey((value) => value + 1);
  }

  return (
    <div className="play-runner-shell">
      <div className="play-runner-status" aria-label="Runner safety status">
        <span>
          <Shield size={16} aria-hidden="true" />
          Isolated iframe
        </span>
        <span>No referrer shared</span>
        <span>{isExternal ? "External demo" : "oeeco preview"}</span>
      </div>

      <div className="play-window">
        {!isLoaded ? (
          <div className="play-loading" aria-live="polite">
            <Shield size={24} aria-hidden="true" />
            <strong>{isSlow ? "Still loading" : "Preparing sandbox"}</strong>
            <p>
              {isSlow
                ? "Some creator demos block iframe loading. You can retry here or open the work in a new tab."
                : `Loading ${isExternal ? originLabel : "oeeco preview"} in a restricted runner.`}
            </p>
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
