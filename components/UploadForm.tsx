"use client";

import type { User } from "@supabase/supabase-js";
import { CheckCircle, CircleUserRound, LogOut, RotateCcw, Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { categoryLabels, isCategoryId, type CategoryId } from "@/lib/data";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase";

type Draft = {
  title: string;
  summary: string;
  detail: string;
  category: Exclude<CategoryId, "all">;
  tags: string;
  demoUrl: string;
  coverUrl: string;
  toolStack: string;
};

type SubmitState = "idle" | "loading" | "sent";
type OAuthState = "idle" | "google";

type SubmittedWork = {
  id: string;
  title: string;
  category: Exclude<CategoryId, "all">;
  tags: string[];
};

type PreparedSubmission = {
  title: string;
  summary: string;
  detail: string;
  category: Exclude<CategoryId, "all">;
  tags: string[];
  demoUrl: string;
  coverUrl: string | null;
  toolStack: string;
};

const defaultDraft: Draft = {
  title: "",
  summary: "",
  detail: "",
  category: "game",
  tags: "",
  demoUrl: "",
  coverUrl: "",
  toolStack: "Codex",
};

const categoryOptions: Array<[Exclude<CategoryId, "all">, string]> = [
  ["game", "Game"],
  ["tool", "Tool"],
  ["story", "Interactive"],
  ["visual", "Visual"],
  ["ai", "AI Experiment"],
];

export function UploadForm() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [draft, setDraft] = useState<Draft>(defaultDraft);
  const [email, setEmail] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [oauthState, setOauthState] = useState<OAuthState>("idle");
  const [submittedWork, setSubmittedWork] = useState<SubmittedWork | null>(null);

  const tags = useMemo(() => parseTags(draft.tags), [draft.tags]);
  const previewCover = getPreviewCover(draft.coverUrl);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => data.subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    const savedDraft = localStorage.getItem("oeeco-upload-draft");
    if (!savedDraft) return;

    try {
      const parsed = JSON.parse(savedDraft) as Partial<Draft>;
      setDraft({
        ...defaultDraft,
        ...parsed,
        category: parsed.category && isCategoryId(parsed.category) ? parsed.category : defaultDraft.category,
      });
    } catch {
      localStorage.removeItem("oeeco-upload-draft");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("oeeco-upload-draft", JSON.stringify(draft));
  }, [draft]);

  function updateDraft(key: keyof Draft, value: string) {
    if (submitState === "sent") {
      setSubmitState("idle");
      setSubmittedWork(null);
      setMessage("");
    }

    setDraft((current) => {
      if (key === "category") {
        return {
          ...current,
          category: isCategoryId(value) ? value : current.category,
        };
      }

      return {
        ...current,
        [key]: value,
      };
    });
    setErrors([]);
  }

  async function sendMagicLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      setMessage("Supabase is not configured yet.");
      return;
    }

    const nextEmail = email.trim();
    if (!nextEmail) {
      setMessage("Enter your email first.");
      return;
    }

    setSubmitState("loading");
    const { error } = await supabase.auth.signInWithOtp({
      email: nextEmail,
      options: {
        emailRedirectTo: `${window.location.origin}/upload`,
      },
    });
    setSubmitState("idle");

    setMessage(error ? error.message : "Magic link sent. Open your email to finish signing in.");
  }

  async function signInWithGoogle() {
    if (!supabase || !isSupabaseConfigured) {
      setMessage("Supabase is not configured yet.");
      return;
    }

    setOauthState("google");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/upload`,
      },
    });

    if (error) {
      setOauthState("idle");
      setMessage(error.message);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const prepared = prepareSubmission(draft);
    if (prepared.errors.length) {
      setErrors(prepared.errors);
      setMessage("");
      return;
    }

    if (!supabase || !isSupabaseConfigured) {
      localStorage.setItem(
        "oeeco-upload-draft",
        JSON.stringify({ ...draft, validatedAt: new Date().toISOString() }),
      );
      setMessage("Draft saved locally. Add Supabase environment variables to enable real submissions.");
      return;
    }

    if (!user) {
      setMessage("Sign in with email before submitting a work.");
      return;
    }

    setSubmitState("loading");
    const { data: work, error } = await supabase
      .from("works")
      .insert({
        creator_id: user.id,
        title: prepared.data.title,
        summary: prepared.data.summary,
        description: prepared.data.detail,
        category: prepared.data.category,
        demo_url: prepared.data.demoUrl,
        cover_url: prepared.data.coverUrl || "/assets/cover-upload.png",
        tool_stack: prepared.data.toolStack,
        status: "pending",
      })
      .select("id")
      .single();

    if (error || !work) {
      setSubmitState("idle");
      setMessage(error?.message || "Submission failed. Please try again later.");
      return;
    }

    if (prepared.data.tags.length) {
      const { error: tagError } = await supabase.from("work_tags").insert(
        prepared.data.tags.map((tag) => ({
          work_id: work.id,
          tag,
        })),
      );

      if (tagError) {
        setSubmitState("idle");
        setMessage(`Work created, but tags were not saved: ${tagError.message}`);
        return;
      }
    }

    setSubmittedWork({
      id: work.id,
      title: prepared.data.title,
      category: prepared.data.category,
      tags: prepared.data.tags,
    });
    setSubmitState("sent");
    setMessage("Work submitted. It is now waiting for review.");
    localStorage.removeItem("oeeco-upload-draft");
    reset(false);
  }

  async function signOut() {
    await supabase?.auth.signOut();
    setMessage("Signed out.");
  }

  function reset(clearMessage = true) {
    setDraft(defaultDraft);
    setErrors([]);
    localStorage.removeItem("oeeco-upload-draft");
    if (clearMessage) {
      setMessage("");
      setSubmitState("idle");
      setSubmittedWork(null);
    }
  }

  function startAnotherSubmission() {
    reset();
  }

  return (
    <section className="upload-shell surface">
      <div className="form-grid">
        <div>
          <span className="section-kicker">Submit Work</span>
          <h1 className="page-title">Submit to oeeco</h1>
          <p className="upload-help">
            Sign in, describe your AI-made game, web tool, interactive page, or experiment, and send it into review.
          </p>
        </div>

        {user ? (
          <div className="surface detail-body">
            <span className="section-kicker">Current account</span>
            <p>{user.email}</p>
            <button className="ghost-button" type="button" onClick={signOut}>
              <LogOut size={17} aria-hidden="true" />
              Sign out
            </button>
          </div>
        ) : (
          <form className="form-grid surface detail-body" onSubmit={sendMagicLink}>
            <span className="section-kicker">Creator Login</span>
            <button className="solid-button" type="button" onClick={signInWithGoogle} disabled={oauthState === "google"}>
              <CircleUserRound size={17} aria-hidden="true" />
              {oauthState === "google" ? "Connecting" : "Continue with Google"}
            </button>
            <div className="auth-divider">
              <span>Email sign-in</span>
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <button className="solid-button" type="submit" disabled={submitState === "loading"}>
              Send magic link
            </button>
          </form>
        )}

        {submitState === "sent" && submittedWork ? (
          <div className="submission-success-panel" role="status">
            <div className="submission-success-heading">
              <CheckCircle size={28} aria-hidden="true" />
              <div>
                <span className="section-kicker">Submitted</span>
                <h2>Submission received</h2>
                <p>Your work is now in review. You can track its status from Creator Account.</p>
              </div>
            </div>
            <div className="submission-success-meta">
              <span>{submittedWork.title}</span>
              <span>{categoryLabels[submittedWork.category]}</span>
              <span>{submittedWork.tags.join(", ")}</span>
            </div>
            <div className="submission-success-steps" aria-label="Submission review steps">
              <span className="submission-success-step is-done">Submitted</span>
              <span className="submission-success-step">Admin review</span>
              <span className="submission-success-step">Published or feedback</span>
            </div>
            <div className="submission-success-actions">
              <Link className="solid-button" href="/account">
                <CheckCircle size={17} aria-hidden="true" />
                Track in Account
              </Link>
              {user ? (
                <Link className="ghost-button" href={`/creators/${user.id}`}>
                  <CircleUserRound size={17} aria-hidden="true" />
                  Public profile
                </Link>
              ) : null}
              <button className="ghost-button" type="button" onClick={startAnotherSubmission}>
                <RotateCcw size={17} aria-hidden="true" />
                Submit another
              </button>
            </div>
          </div>
        ) : null}

        <form className="form-grid" onSubmit={submit} noValidate>
          <div className="field">
            <label htmlFor="title">Work title</label>
            <input
              id="title"
              name="title"
              required
              minLength={3}
              maxLength={80}
              value={draft.title}
              onChange={(event) => updateDraft("title", event.target.value)}
              placeholder="Example: Neon Puzzle Run"
            />
            <span className="form-hint">{draft.title.trim().length}/80 characters</span>
          </div>
          <div className="field">
            <label htmlFor="summary">Short summary</label>
            <input
              id="summary"
              name="summary"
              required
              minLength={20}
              maxLength={160}
              value={draft.summary}
              onChange={(event) => updateDraft("summary", event.target.value)}
              placeholder="Tell viewers why it is worth opening"
            />
            <span className="form-hint">{draft.summary.trim().length}/160 characters</span>
          </div>
          <div className="field">
            <label htmlFor="demoUrl">Demo URL</label>
            <input
              id="demoUrl"
              name="demoUrl"
              type="url"
              value={draft.demoUrl}
              onChange={(event) => updateDraft("demoUrl", event.target.value)}
              placeholder="https://..."
              required
            />
            <span className="form-hint">Use a public, inspectable page. Private links may be rejected.</span>
          </div>
          <div className="field">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={draft.category}
              onChange={(event) => updateDraft("category", event.target.value)}
            >
              {categoryOptions.map(([id, label]) => (
                <option value={id} key={id}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="tags">Tags</label>
            <input
              id="tags"
              name="tags"
              value={draft.tags}
              onChange={(event) => updateDraft("tags", event.target.value)}
              placeholder="Codex, Canvas, Casual"
            />
            <span className="form-hint">{tags.length}/8 tags. Separate with commas.</span>
          </div>
          <div className="field">
            <label htmlFor="toolStack">Tool stack</label>
            <input
              id="toolStack"
              name="toolStack"
              required
              maxLength={120}
              value={draft.toolStack}
              onChange={(event) => updateDraft("toolStack", event.target.value)}
              placeholder="Codex, Canvas, Supabase"
            />
          </div>
          <div className="field">
            <label htmlFor="coverUrl">Cover image URL</label>
            <input
              id="coverUrl"
              name="coverUrl"
              value={draft.coverUrl}
              onChange={(event) => updateDraft("coverUrl", event.target.value)}
              placeholder="https://... or leave blank"
            />
            <span className="form-hint">Optional. If empty, oeeco uses a default review cover.</span>
          </div>
          <div className="field">
            <label htmlFor="detail">Creator notes</label>
            <textarea
              id="detail"
              name="detail"
              required
              minLength={30}
              maxLength={1200}
              value={draft.detail}
              onChange={(event) => updateDraft("detail", event.target.value)}
              placeholder="Share what you used, how you built it, and who should try it"
            />
            <span className="form-hint">{draft.detail.trim().length}/1200 characters</span>
          </div>
          {errors.length ? (
            <div className="validation-list" role="alert">
              <strong>Before submitting</strong>
              <ul>
                {errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          ) : null}
          <div className="form-actions">
            <button className="solid-button" type="submit" disabled={submitState === "loading"}>
              <Send size={17} aria-hidden="true" />
              {submitState === "loading" ? "Submitting" : "Submit for review"}
            </button>
            <button className="ghost-button" type="button" onClick={() => reset()}>
              <RotateCcw size={17} aria-hidden="true" />
              Reset
            </button>
          </div>
          {message ? <div className="toast" role="status">{message}</div> : null}
        </form>
      </div>

      <aside className="preview-card">
        <Image src={previewCover} width={640} height={400} alt="Submission preview" />
        <div>
          <span className="section-kicker">Preview Card</span>
          <h2>{draft.title || "Your work will appear here"}</h2>
          <p>{draft.summary || "Cover, title, summary, tags, and a playable link form your oeeco card."}</p>
          <div className="submission-checklist">
            <span>{categoryLabels[draft.category]}</span>
            <span>{draft.toolStack.trim() || "Tool stack"}</span>
          </div>
          <div className="tag-row">
            {(tags.length ? tags : ["Codex", "New Work"]).map((tag) => (
              <span className="small-pill" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </aside>
    </section>
  );
}

function parseTags(value: string) {
  const seen = new Set<string>();
  return value
    .split(/[,\n]/)
    .map((tag) => tag.trim().replace(/\s+/g, " "))
    .filter(Boolean)
    .map((tag) => tag.slice(0, 32))
    .filter((tag) => {
      const key = tag.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 8);
}

function prepareSubmission(draft: Draft): { data: PreparedSubmission; errors: string[] } {
  const title = draft.title.trim();
  const summary = draft.summary.trim();
  const detail = draft.detail.trim();
  const tags = parseTags(draft.tags);
  const demoUrl = draft.demoUrl.trim();
  const coverUrl = draft.coverUrl.trim();
  const toolStack = draft.toolStack.trim();
  const errors: string[] = [];

  if (title.length < 3) errors.push("Add a title with at least 3 characters.");
  if (summary.length < 20) errors.push("Add a short summary with at least 20 characters.");
  if (detail.length < 30) errors.push("Add creator notes with at least 30 characters.");
  if (!isHttpUrl(demoUrl)) errors.push("Add a valid public Demo URL starting with http or https.");
  if (coverUrl && !isHttpUrl(coverUrl) && !coverUrl.startsWith("/")) {
    errors.push("Use a valid cover image URL, a local path starting with /, or leave it blank.");
  }
  if (!toolStack) errors.push("Add the tools used to build the work.");
  if (!tags.length) errors.push("Add at least one tag.");

  return {
    data: {
      title: title.slice(0, 80),
      summary: summary.slice(0, 160),
      detail: detail.slice(0, 1200),
      category: draft.category,
      tags,
      demoUrl,
      coverUrl: coverUrl || null,
      toolStack: toolStack.slice(0, 120),
    },
    errors,
  };
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function getPreviewCover(value: string) {
  const cover = value.trim();
  if (!cover) return "/assets/cover-upload.png";
  if (cover.startsWith("/") || isHttpUrl(cover)) return cover;
  return "/assets/cover-upload.png";
}
