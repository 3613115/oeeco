const localhostHosts = new Set(["localhost", "127.0.0.1", "::1"]);

export const externalRunnerSandbox = "allow-scripts allow-forms allow-popups allow-pointer-lock";
export const localPreviewSandbox = "allow-scripts";
export const runnerAllowPolicy = "fullscreen; gamepad";

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

export function getRunnerOriginLabel(value: string | null | undefined) {
  const playableUrl = getPlayableDemoUrl(value);
  if (!playableUrl) return "oeeco preview";

  try {
    return new URL(playableUrl).hostname;
  } catch {
    return "external work";
  }
}
