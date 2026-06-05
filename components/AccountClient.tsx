"use client";

import type { User } from "@supabase/supabase-js";
import { CircleUserRound, ExternalLink, LogOut, Mail, Play, RefreshCw, Save, Send, Upload, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { categoryLabels, isCategoryId, type CategoryId } from "@/lib/data";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase";

type WorkStatus = "pending" | "published" | "rejected" | "hidden" | "draft";

type AccountWorkRow = {
  id: string;
  title: string;
  summary: string;
  category: string;
  status: WorkStatus;
  demo_url: string | null;
  created_at: string;
  updated_at: string;
};

type ProfileRow = {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
};

type ProfileForm = {
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
};

type LoadState = "idle" | "loading" | "ready";
type SubmitState = "idle" | "loading";
type SaveState = "idle" | "saving";
type OAuthState = "idle" | "google";

const statusMeta: Record<WorkStatus, { label: string; helper: string }> = {
  pending: {
    label: "Pending",
    helper: "Waiting for review before it appears publicly.",
  },
  published: {
    label: "Published",
    helper: "Live on oeeco and visible to viewers.",
  },
  rejected: {
    label: "Rejected",
    helper: "Not approved for publication in its current form.",
  },
  hidden: {
    label: "Hidden",
    helper: "Temporarily removed from public pages.",
  },
  draft: {
    label: "Draft",
    helper: "Saved but not submitted for review.",
  },
};

const statusOrder: WorkStatus[] = ["pending", "published", "rejected", "hidden", "draft"];

export function AccountClient() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [email, setEmail] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [profileForm, setProfileForm] = useState<ProfileForm>({
    username: "",
    displayName: "",
    avatarUrl: "",
    bio: "",
  });
  const [works, setWorks] = useState<AccountWorkRow[]>([]);
  const [message, setMessage] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [oauthState, setOauthState] = useState<OAuthState>("idle");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [loadState, setLoadState] = useState<LoadState>("idle");

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
    if (!supabase || !user) {
      setWorks([]);
      setProfile(null);
      return;
    }

    loadProfile(user.id);
    loadWorks(user.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase, user]);

  async function sendMagicLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase || !isSupabaseConfigured) {
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
        emailRedirectTo: `${window.location.origin}/account`,
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
        redirectTo: `${window.location.origin}/account`,
      },
    });

    if (error) {
      setOauthState("idle");
      setMessage(error.message);
    }
  }

  async function loadProfile(userId: string) {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("id, username, display_name, avatar_url, bio")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      setMessage(error.message);
      return;
    }

    if (!data) {
      setMessage("Profile is still being created. Refresh in a moment.");
      return;
    }

    const nextProfile = data as ProfileRow;
    setProfile(nextProfile);
    setProfileForm({
      username: nextProfile.username || "",
      displayName: nextProfile.display_name || "",
      avatarUrl: nextProfile.avatar_url || "",
      bio: nextProfile.bio || "",
    });
  }

  async function loadWorks(userId: string) {
    if (!supabase) return;

    setLoadState("loading");
    const { data, error } = await supabase
      .from("works")
      .select("id, title, summary, category, status, demo_url, created_at, updated_at")
      .eq("creator_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      setMessage(error.message);
      setWorks([]);
      setLoadState("ready");
      return;
    }

    setWorks((data as AccountWorkRow[] | null) || []);
    setLoadState("ready");
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase || !user) return;

    const prepared = prepareProfileForm(profileForm);
    if (!prepared.ok) {
      setMessage(prepared.message);
      return;
    }

    setSaveState("saving");
    const { data, error } = await supabase
      .from("profiles")
      .update({
        username: prepared.data.username,
        display_name: prepared.data.displayName,
        avatar_url: prepared.data.avatarUrl || null,
        bio: prepared.data.bio,
      })
      .eq("id", user.id)
      .select("id, username, display_name, avatar_url, bio")
      .maybeSingle();
    setSaveState("idle");

    if (error) {
      setMessage(getProfileSaveError(error.message));
      return;
    }

    if (!data) {
      setMessage("Profile was not found. Refresh your account and try again.");
      return;
    }

    const nextProfile = data as ProfileRow;
    setProfile(nextProfile);
    setProfileForm({
      username: nextProfile.username || "",
      displayName: nextProfile.display_name || "",
      avatarUrl: nextProfile.avatar_url || "",
      bio: nextProfile.bio || "",
    });
    setMessage("Profile saved.");
  }

  async function signOut() {
    await supabase?.auth.signOut();
    setMessage("Signed out.");
  }

  const counts = useMemo(() => {
    const next = Object.fromEntries(statusOrder.map((status) => [status, 0])) as Record<WorkStatus, number>;
    for (const work of works) {
      next[work.status] = (next[work.status] || 0) + 1;
    }
    return next;
  }, [works]);

  if (!supabase || !isSupabaseConfigured) {
    return (
      <section className="account-shell surface">
        <span className="section-kicker">Creator Account</span>
        <h1 className="page-title">Account environment required</h1>
        <p>Add Supabase public environment variables to enable creator login and submission tracking.</p>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="account-shell surface">
        <div className="account-heading">
          <div>
            <span className="section-kicker">Creator Account</span>
            <h1 className="page-title">Sign in to track your work</h1>
            <p>Use the same email you submit with to see review status, public links, and playable demos.</p>
          </div>
        </div>

        <div className="account-login auth-provider-stack">
          <button className="solid-button" type="button" onClick={signInWithGoogle} disabled={oauthState === "google"}>
            <CircleUserRound size={17} aria-hidden="true" />
            {oauthState === "google" ? "Connecting" : "Continue with Google"}
          </button>
          <div className="auth-divider">
            <span>Email sign-in</span>
          </div>
        </div>

        <form className="account-login form-grid" onSubmit={sendMagicLink}>
          <div className="field">
            <label htmlFor="account-email">Email</label>
            <input
              id="account-email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <button className="solid-button" type="submit" disabled={submitState === "loading"}>
            <Mail size={17} aria-hidden="true" />
            {submitState === "loading" ? "Sending" : "Send magic link"}
          </button>
        </form>

        <div className="account-empty">
          <strong>No account password needed.</strong>
          <p>oeeco sends a secure sign-in link to your email. After signing in, you can review your submissions.</p>
        </div>
        {message ? <div className="toast" role="status">{message}</div> : null}
      </section>
    );
  }

  return (
    <section className="account-shell surface">
      <div className="account-heading">
        <div>
          <span className="section-kicker">Creator Account</span>
          <h1 className="page-title">My submissions</h1>
          <p>{user.email}</p>
        </div>
        <div className="account-actions">
          <button className="ghost-button" type="button" onClick={() => loadWorks(user.id)} disabled={loadState === "loading"}>
            <RefreshCw size={17} aria-hidden="true" />
            Refresh
          </button>
          <Link className="ghost-button" href={`/creators/${user.id}`}>
            <UserRound size={17} aria-hidden="true" />
            Public profile
          </Link>
          <button className="ghost-button" type="button" onClick={signOut}>
            <LogOut size={17} aria-hidden="true" />
            Sign out
          </button>
          <Link className="solid-button" href="/upload">
            <Upload size={17} aria-hidden="true" />
            Submit Work
          </Link>
        </div>
      </div>

      <section className="account-profile-panel">
        <div className="account-profile-preview">
          <Image src={getProfileAvatar(profileForm.avatarUrl)} width={84} height={84} alt="" />
          <div>
            <span className="section-kicker">Creator Profile</span>
            <h2>{profileForm.displayName.trim() || profile?.display_name || "oeeco creator"}</h2>
            <p>{profileForm.username.trim() ? `@${profileForm.username.trim()}` : "Choose a creator handle"}</p>
          </div>
        </div>
        <form className="account-profile-form" onSubmit={saveProfile}>
          <div className="field">
            <label htmlFor="profile-display-name">Display name</label>
            <input
              id="profile-display-name"
              maxLength={60}
              value={profileForm.displayName}
              onChange={(event) => setProfileForm((value) => ({ ...value, displayName: event.target.value }))}
              placeholder="Your creator name"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="profile-username">Username</label>
            <input
              id="profile-username"
              maxLength={24}
              value={profileForm.username}
              onChange={(event) => setProfileForm((value) => ({ ...value, username: event.target.value }))}
              placeholder="creator_123"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="profile-avatar">Avatar URL</label>
            <input
              id="profile-avatar"
              value={profileForm.avatarUrl}
              onChange={(event) => setProfileForm((value) => ({ ...value, avatarUrl: event.target.value }))}
              placeholder="https://..."
            />
          </div>
          <div className="field span-2">
            <label htmlFor="profile-bio">Bio</label>
            <textarea
              id="profile-bio"
              maxLength={240}
              rows={4}
              value={profileForm.bio}
              onChange={(event) => setProfileForm((value) => ({ ...value, bio: event.target.value }))}
              placeholder="What do you make with AI?"
            />
          </div>
          <div className="account-profile-actions">
            <span>{profileForm.bio.length}/240 bio characters</span>
            <button className="solid-button" type="submit" disabled={saveState === "saving"}>
              <Save size={17} aria-hidden="true" />
              {saveState === "saving" ? "Saving" : "Save Profile"}
            </button>
          </div>
        </form>
      </section>

      <div className="account-status-grid" aria-label="Submission status counts">
        {statusOrder.map((status) => (
          <div className="account-status-box" key={status}>
            <strong>{counts[status]}</strong>
            <span>{statusMeta[status].label}</span>
          </div>
        ))}
      </div>

      {loadState === "loading" ? (
        <div className="account-empty">
          <strong>Loading submissions</strong>
          <p>Checking your latest review status.</p>
        </div>
      ) : works.length ? (
        <div className="account-list">
          {works.map((work) => (
            <article className="account-work" key={work.id}>
              <div className="account-work-main">
                <span className={`status-badge is-${work.status}`}>{statusMeta[work.status]?.label || work.status}</span>
                <h2>{work.title}</h2>
                <p>{work.summary}</p>
                <div className="account-meta">
                  <span>{labelCategory(work.category)}</span>
                  <span>Submitted {formatDate(work.created_at)}</span>
                  <span>{statusMeta[work.status]?.helper || "Status updated."}</span>
                </div>
              </div>
              <div className="account-work-actions">
                {work.status === "published" ? (
                  <>
                    <Link className="ghost-button" href={`/works/${work.id}`}>
                      <ExternalLink size={17} aria-hidden="true" />
                      Public Page
                    </Link>
                    <Link className="solid-button" href={`/play/${work.id}`}>
                      <Play size={17} aria-hidden="true" />
                      Play
                    </Link>
                  </>
                ) : work.demo_url ? (
                  <Link className="ghost-button" href={work.demo_url} target="_blank" rel="noreferrer">
                    <ExternalLink size={17} aria-hidden="true" />
                    Open Demo
                  </Link>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="account-empty">
          <strong>No submissions yet</strong>
          <p>Submit your first AI-made game, tool, interactive page, or experiment to start building your oeeco profile.</p>
          <Link className="solid-button" href="/upload">
            <Send size={17} aria-hidden="true" />
            Submit Work
          </Link>
        </div>
      )}

      {message ? <div className="toast" role="status">{message}</div> : null}
    </section>
  );
}

function labelCategory(value: string) {
  if (isCategoryId(value)) {
    return categoryLabels[value as Exclude<CategoryId, "all">];
  }

  return "Work";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function prepareProfileForm(form: ProfileForm) {
  const username = form.username.trim().replace(/^@+/, "");
  const displayName = form.displayName.trim().replace(/\s+/g, " ");
  const avatarUrl = form.avatarUrl.trim();
  const bio = form.bio.trim().replace(/\s+/g, " ");

  if (!/^[a-zA-Z0-9_]{3,24}$/.test(username)) {
    return {
      ok: false as const,
      message: "Username must be 3-24 characters using letters, numbers, or underscores.",
    };
  }

  if (displayName.length < 2 || displayName.length > 60) {
    return {
      ok: false as const,
      message: "Display name must be 2-60 characters.",
    };
  }

  if (avatarUrl && !isHttpsUrl(avatarUrl)) {
    return {
      ok: false as const,
      message: "Avatar URL must use https.",
    };
  }

  if (bio.length > 240) {
    return {
      ok: false as const,
      message: "Bio must be 240 characters or fewer.",
    };
  }

  return {
    ok: true as const,
    data: {
      username,
      displayName,
      avatarUrl,
      bio,
    },
  };
}

function getProfileAvatar(value: string) {
  return isHttpsUrl(value.trim()) ? value.trim() : "/assets/avatar-neo.png";
}

function isHttpsUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

function getProfileSaveError(message: string) {
  if (message.toLowerCase().includes("duplicate")) return "That username is already taken.";
  if (message.toLowerCase().includes("violates check constraint")) {
    return "Check your username, display name, avatar URL, and bio length.";
  }
  return message;
}
