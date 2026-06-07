const localhostHosts = new Set(["localhost", "127.0.0.1", "::1"]);

export const externalRunnerSandbox = "allow-scripts allow-forms allow-popups allow-pointer-lock";
export const localPreviewSandbox = "allow-scripts";
export const runnerAllowPolicy = "fullscreen; gamepad";

export type RunnerPolicyStatus = "playable" | "held" | "preview";

export type RunnerPolicy = {
  status: RunnerPolicyStatus;
  playableUrl: string | null;
  originLabel: string;
  label: string;
  title: string;
  helper: string;
  adminHelper: string;
};

export function getPlayableDemoUrl(value: string | null | undefined) {
  if (!value) return null;

  try {
    const url = new URL(value);
    if (url.protocol === "https:") return url.toString();
    if (url.protocol === "http:" && localhostHosts.has(url.hostname)) return url.toString();
    return null;
  } catch {
    return null;
  }
}

export function getRunnerPolicy(value: string | null | undefined): RunnerPolicy {
  const playableUrl = getPlayableDemoUrl(value);

  if (playableUrl) {
    const originLabel = getRunnerOriginLabel(playableUrl);

    return {
      status: "playable",
      playableUrl,
      originLabel,
      label: `Sandboxed from ${originLabel}`,
      title: "Ready in runner",
      helper: "TRY opens this work inside oeeco with a new-tab fallback available.",
      adminHelper: "Approved for iframe runner: HTTPS demos and localhost development URLs are allowed.",
    };
  }

  if (value) {
    return {
      status: "held",
      playableUrl: null,
      originLabel: "held demo",
      label: "Demo held for safety",
      title: "Safety hold",
      helper: "TRY shows a safety hold because the submitted demo cannot be embedded by policy.",
      adminHelper: "Held by runner policy. Ask the creator for an HTTPS browser demo before publishing as playable.",
    };
  }

  return {
    status: "preview",
    playableUrl: null,
    originLabel: "oeeco preview",
    label: "Sandboxed oeeco preview",
    title: "Preview ready",
    helper: "TRY opens an oeeco-generated preview while the creator demo is not available.",
    adminHelper: "No demo URL submitted. The public TRY route will use the generated oeeco preview.",
  };
}

export function getRunnerOriginLabel(value: string | null | undefined) {
  const playableUrl = getPlayableDemoUrl(value);
  if (!playableUrl) return "oeeco preview";

  try {
    return new URL(playableUrl).hostname;
  } catch {
    return "external work";
  }
}
