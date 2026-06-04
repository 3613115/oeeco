"use client";

import type { User } from "@supabase/supabase-js";
import { LogOut, RotateCcw, Send } from "lucide-react";
import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase";

type Draft = {
  title: string;
  summary: string;
  tags: string;
};

type SubmitState = "idle" | "loading" | "sent";

export function UploadForm() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [draft, setDraft] = useState<Draft>({
    title: "",
    summary: "",
    tags: "",
  });
  const [email, setEmail] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  const tags = useMemo(() => parseTags(draft.tags), [draft.tags]);

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

  function updateDraft(key: keyof Draft, value: string) {
    setDraft((current) => ({ ...current, [key]: value }));
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

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    if (!supabase || !isSupabaseConfigured) {
      localStorage.setItem(
        "oeeco-upload-draft",
        JSON.stringify({ ...draft, submittedAt: new Date().toISOString() }),
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
        title: draft.title.trim(),
        summary: draft.summary.trim(),
        description: String(formData.get("detail") || "").trim(),
        category: String(formData.get("category") || "game"),
        demo_url: String(formData.get("link") || "").trim() || null,
        cover_url: "/assets/cover-upload.png",
        tool_stack: "Codex",
        status: "pending",
      })
      .select("id")
      .single();

    if (error || !work) {
      setSubmitState("idle");
      setMessage(error?.message || "Submission failed. Please try again later.");
      return;
    }

    if (tags.length) {
      const { error: tagError } = await supabase.from("work_tags").insert(
        tags.map((tag) => ({
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

    setSubmitState("sent");
    setMessage("Work submitted. It is now waiting for review.");
    reset(false);
  }

  async function signOut() {
    await supabase?.auth.signOut();
    setMessage("Signed out.");
  }

  function reset(clearMessage = true) {
    setDraft({ title: "", summary: "", tags: "" });
    if (clearMessage) setMessage("");
  }

  return (
    <section className="upload-shell surface">
      <div className="form-grid">
        <div>
          <span className="section-kicker">Submit Work</span>
          <h1 className="page-title">Submit to oeeco</h1>
          <p className="upload-help">
            Sign in, submit your AI-made game, web tool, or interactive experiment, and send it into review.
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

        <form className="form-grid" onSubmit={submit}>
          <div className="field">
            <label htmlFor="title">Work title</label>
            <input
              id="title"
              name="title"
              required
              maxLength={36}
              value={draft.title}
              onChange={(event) => updateDraft("title", event.target.value)}
              placeholder="Example: Orbit Focus Clock"
            />
          </div>
          <div className="field">
            <label htmlFor="summary">Short summary</label>
            <input
              id="summary"
              name="summary"
              required
              maxLength={80}
              value={draft.summary}
              onChange={(event) => updateDraft("summary", event.target.value)}
              placeholder="Tell viewers why it is worth opening"
            />
          </div>
          <div className="field">
            <label htmlFor="link">Work URL</label>
            <input id="link" name="link" type="url" placeholder="https://..." />
          </div>
          <div className="field">
            <label htmlFor="category">Category</label>
            <select id="category" name="category">
              <option value="game">Game</option>
              <option value="tool">Tool</option>
              <option value="story">Interactive</option>
              <option value="visual">Visual</option>
              <option value="ai">AI Experiment</option>
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
          </div>
          <div className="field">
            <label htmlFor="detail">Creator notes</label>
            <textarea
              id="detail"
              name="detail"
              placeholder="Share what you used, how you built it, and who should try it"
            />
          </div>
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
        <Image src="/assets/cover-upload.png" width={640} height={400} alt="Submission preview" />
        <div>
          <span className="section-kicker">Preview Card</span>
          <h2>{draft.title || "Your work will appear here"}</h2>
          <p>{draft.summary || "Cover, title, summary, tags, and a playable link form your oeeco card."}</p>
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
  return value
    .split(/[,\s]+/)
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 5);
}
