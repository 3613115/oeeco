"use client";

import type { User } from "@supabase/supabase-js";
import {
  BarChart3,
  CheckCircle2,
  CircleUserRound,
  Clock3,
  ExternalLink,
  Heart,
  Inbox,
  LogOut,
  Mail,
  Pencil,
  Play,
  RefreshCw,
  Save,
  Send,
  Share2,
  Undo2,
  Upload,
  UserRound,
  X,
} from "lucide-react";
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
  description: string | null;
  category: string;
  status: WorkStatus;
  demo_url: string | null;
  cover_url: string | null;
  tool_stack: string | null;
  review_note: string | null;
  views_count: number | null;
  likes_count: number | null;
  try_clicks_count: number | null;
  demo_opens_count: number | null;
  share_clicks_count: number | null;
  review_cycle?: number | null;
  resubmitted_at?: string | null;
  last_reviewed_at?: string | null;
  created_at: string;
  updated_at: string;
  tags: string[];
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

type WorkForm = {
  title: string;
  summary: string;
  detail: string;
  category: Exclude<CategoryId, "all">;
  tags: string;
  demoUrl: string;
  coverUrl: string;
  toolStack: string;
};

type LoadState = "idle" | "loading" | "ready";
type SubmitState = "idle" | "loading";
type SaveState = "idle" | "saving";
type WorkSaveState = "idle" | "saving";
type OAuthState = "idle" | "google";
type AccountStatusFilter = "all" | WorkStatus;
type WorkStatusAction = "withdraw" | "hide";

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
const allStatusFilters: AccountStatusFilter[] = ["all", ...statusOrder];

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
  const [workSaveState, setWorkSaveState] = useState<WorkSaveState>("idle");
  const [editingWorkId, setEditingWorkId] = useState<string | null>(null);
  const [workForm, setWorkForm] = useState<WorkForm | null>(null);
  const [workErrors, setWorkErrors] = useState<string[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [statusFilter, setStatusFilter] = useState<AccountStatusFilter>("all");
  const [statusActionId, setStatusActionId] = useState<string | null>(null);
  const [handoffWorkId, setHandoffWorkId] = useState<string | null>(null);
  const [handoffDismissed, setHandoffDismissed] = useState(false);

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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const submitted = params.get("submitted");
    if (submitted) {
      setHandoffWorkId(submitted);
      setHandoffDismissed(false);
      setStatusFilter("pending");
    }
  }, []);

  useEffect(() => {
    if (!handoffWorkId || !works.length) return;
    const handoffWork = works.find((work) => work.id === handoffWorkId);
    if (!handoffWork) return;

    setStatusFilter(handoffWork.status);
    window.setTimeout(() => {
      document.getElementById(`work-${handoffWork.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);
  }, [handoffWorkId, works]);

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
    const baseSelect =
      "id, title, summary, description, category, status, demo_url, cover_url, tool_stack, review_note, views_count, likes_count, try_clicks_count, demo_opens_count, share_clicks_count, created_at, updated_at";
    const query = supabase
      .from("works")
      .select(`${baseSelect}, review_cycle, resubmitted_at, last_reviewed_at`)
      .eq("creator_id", userId)
      .order("created_at", { ascending: false });
    let { data, error } = await query;
    let rowsData = data as Array<Omit<AccountWorkRow, "tags">> | null;

    if (error && isMissingAccountWorkColumnError(error.message)) {
      const fallback = await supabase
        .from("works")
        .select(baseSelect)
        .eq("creator_id", userId)
        .order("created_at", { ascending: false });
      rowsData = fallback.data as Array<Omit<AccountWorkRow, "tags">> | null;
      error = fallback.error;
    }

    if (error) {
      setMessage(error.message);
      setWorks([]);
      setLoadState("ready");
      return;
    }

    const rows = rowsData || [];
    const ids = rows.map((work) => work.id);

    if (!ids.length) {
      setWorks([]);
      setLoadState("ready");
      return;
    }

    const { data: tagRows, error: tagError } = await supabase.from("work_tags").select("work_id, tag").in("work_id", ids);
    if (tagError) {
      setMessage(tagError.message);
    }

    const tagsByWork = new Map<string, string[]>();
    for (const row of (tagRows as Array<{ work_id: string; tag: string }> | null) || []) {
      if (isInternalTag(row.tag)) continue;
      tagsByWork.set(row.work_id, [...(tagsByWork.get(row.work_id) || []), row.tag]);
    }

    setWorks(rows.map((work) => ({ ...work, tags: tagsByWork.get(work.id) || [] })));
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

  function startEditingWork(work: AccountWorkRow) {
    const category = isCategoryId(work.category) ? work.category : "ai";
    setEditingWorkId(work.id);
    setWorkErrors([]);
    setWorkForm({
      title: work.title,
      summary: work.summary,
      detail: work.description || "",
      category,
      tags: work.tags.join(", "),
      demoUrl: work.demo_url || "",
      coverUrl: work.cover_url || "",
      toolStack: work.tool_stack || "Codex",
    });
  }

  function stopEditingWork() {
    setEditingWorkId(null);
    setWorkForm(null);
    setWorkErrors([]);
  }

  function updateWorkForm(key: keyof WorkForm, value: string) {
    setWorkForm((current) => {
      if (!current) return current;
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
    setWorkErrors([]);
  }

  async function saveWork(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase || !user || !editingWorkId || !workForm) return;

    const prepared = prepareWorkForm(workForm);
    if (prepared.errors.length) {
      setWorkErrors(prepared.errors);
      setMessage("");
      return;
    }

    const originalWork = works.find((work) => work.id === editingWorkId);
    const isResubmission = Boolean(originalWork && originalWork.status !== "pending");
    setWorkSaveState("saving");
    const baseWorkUpdate = {
      title: prepared.data.title,
      summary: prepared.data.summary,
      description: prepared.data.detail,
      category: prepared.data.category,
      demo_url: prepared.data.demoUrl,
      cover_url: prepared.data.coverUrl || "/assets/cover-upload.png",
      tool_stack: prepared.data.toolStack,
      review_note: "",
      status: "pending",
    };
    const workUpdate = {
      ...baseWorkUpdate,
      ...(isResubmission
        ? {
            review_cycle: (originalWork?.review_cycle || 0) + 1,
            resubmitted_at: new Date().toISOString(),
          }
        : {}),
    };
    let { data: updatedWork, error } = await supabase
      .from("works")
      .update(workUpdate)
      .eq("id", editingWorkId)
      .eq("creator_id", user.id)
      .in("status", ["draft", "pending", "rejected", "hidden"])
      .select("id")
      .maybeSingle();

    if (error && isMissingAccountWorkColumnError(error.message)) {
      const fallback = await supabase
        .from("works")
        .update(baseWorkUpdate)
        .eq("id", editingWorkId)
        .eq("creator_id", user.id)
        .in("status", ["draft", "pending", "rejected", "hidden"])
        .select("id")
        .maybeSingle();
      updatedWork = fallback.data;
      error = fallback.error;
    }

    if (error) {
      setWorkSaveState("idle");
      setMessage(error.message);
      return;
    }

    if (!updatedWork) {
      setWorkSaveState("idle");
      setMessage("This work can no longer be edited. Refresh your submissions to see the latest status.");
      return;
    }

    const { error: deleteError } = await supabase
      .from("work_tags")
      .delete()
      .eq("work_id", editingWorkId)
      .not("tag", "like", "oeeco:%");
    if (deleteError) {
      setWorkSaveState("idle");
      setMessage(`Work saved, but old tags were not removed: ${deleteError.message}`);
      return;
    }

    const nextTags = prepared.data.tags;
    if (nextTags.length) {
      const { error: insertError } = await supabase.from("work_tags").insert(
        nextTags.map((tag) => ({
          work_id: editingWorkId,
          tag,
        })),
      );

      if (insertError) {
        setWorkSaveState("idle");
        setMessage(`Work saved, but tags were not updated: ${insertError.message}`);
        return;
      }
    }

    await loadWorks(user.id);
    setWorkSaveState("idle");
    stopEditingWork();
    setMessage(isResubmission ? "Work resubmitted for review." : "Work saved and returned to review.");
  }

  async function updateWorkVisibility(work: AccountWorkRow, action: WorkStatusAction) {
    if (!supabase || !user) return;

    const transition = getWorkStatusTransition(work, action);
    if (!transition) return;

    if (!window.confirm(transition.confirm)) return;

    setStatusActionId(`${work.id}:${action}`);
    const { data, error } = await supabase
      .from("works")
      .update({ status: transition.nextStatus })
      .eq("id", work.id)
      .eq("creator_id", user.id)
      .eq("status", transition.fromStatus)
      .select("id")
      .maybeSingle();
    setStatusActionId(null);

    if (error) {
      setMessage(getVisibilityUpdateError(error.message));
      return;
    }

    if (!data) {
      setMessage("This work status changed before the action completed. Refresh and try again.");
      return;
    }

    await loadWorks(user.id);
    setEditingWorkId(null);
    setWorkForm(null);
    setMessage(transition.success);
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
  const actionSummary = useMemo(() => getActionSummary(works), [works]);
  const sortedWorks = useMemo(() => sortAccountWorks(works), [works]);
  const visibleWorks = useMemo(
    () => (statusFilter === "all" ? sortedWorks : sortedWorks.filter((work) => work.status === statusFilter)),
    [sortedWorks, statusFilter],
  );
  const priorityActions = useMemo(() => getPriorityActions(works), [works]);
  const handoffWork = handoffWorkId ? works.find((work) => work.id === handoffWorkId) || null : null;

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

      <section className={actionSummary.urgentCount ? "account-inbox is-urgent" : "account-inbox"}>
        <div>
          <span className="section-kicker">Creator Inbox</span>
          <h2>{actionSummary.title}</h2>
          <p>{actionSummary.helper}</p>
        </div>
        <div className="account-inbox-counts">
          <span>
            <strong>{actionSummary.urgentCount}</strong>
            needs revision
          </span>
          <span>
            <strong>{actionSummary.pendingCount}</strong>
            in review
          </span>
          <span>
            <strong>{actionSummary.publishedCount}</strong>
            live
          </span>
        </div>
      </section>

      {handoffWorkId && !handoffDismissed ? (
        <section className="account-handoff-panel" aria-live="polite">
          <div>
            <span className="section-kicker">Submission received</span>
            <h2>{handoffWork ? handoffWork.title : "Your latest submission"}</h2>
            <p>
              {handoffWork
                ? getHandoffMessage(handoffWork)
                : "The new work is being loaded into your account. Refresh if it does not appear in a moment."}
            </p>
          </div>
          <div className="account-handoff-actions">
            {handoffWork ? (
              <a className="ghost-button" href={`#work-${handoffWork.id}`}>
                <Inbox size={17} aria-hidden="true" />
                View status
              </a>
            ) : null}
            <button className="ghost-button" type="button" onClick={() => setHandoffDismissed(true)}>
              <X size={17} aria-hidden="true" />
              Dismiss
            </button>
          </div>
        </section>
      ) : null}

      <section className="account-management-panel" aria-label="Work management">
        <div className="account-management-heading">
          <div>
            <span className="section-kicker">Work Manager</span>
            <h2>Submission command center</h2>
            <p>Filter your works by status, follow the next recommended action, and open the live or playable route.</p>
          </div>
          <Link className="solid-button" href="/upload">
            <Upload size={17} aria-hidden="true" />
            New Work
          </Link>
        </div>

        <div className="account-priority-grid">
          {priorityActions.map((item) => (
            <div className={`account-priority-card is-${item.tone}`} key={item.label}>
              {item.icon === "live" ? (
                <CheckCircle2 size={18} aria-hidden="true" />
              ) : item.icon === "review" ? (
                <Clock3 size={18} aria-hidden="true" />
              ) : (
                <Inbox size={18} aria-hidden="true" />
              )}
              <div>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
                <small>{item.helper}</small>
              </div>
            </div>
          ))}
        </div>

        <div className="account-status-tabs" aria-label="Filter works by status">
          {allStatusFilters.map((status) => (
            <button
              className={statusFilter === status ? "account-status-tab is-active" : "account-status-tab"}
              type="button"
              onClick={() => setStatusFilter(status)}
              key={status}
            >
              <span>{status === "all" ? "All" : statusMeta[status].label}</span>
              <strong>{status === "all" ? works.length : counts[status]}</strong>
            </button>
          ))}
        </div>
      </section>

      {loadState === "loading" ? (
        <div className="account-empty">
          <strong>Loading submissions</strong>
          <p>Checking your latest review status.</p>
        </div>
      ) : works.length ? (
        <div className="account-list">
          {visibleWorks.length ? null : (
            <div className="account-empty">
              <strong>No works in this status</strong>
              <p>Choose another status tab or submit a new work when you are ready.</p>
            </div>
          )}
          {visibleWorks.map((work) => {
            const action = getWorkAction(work);
            const progressSteps = getWorkProgressSteps(work);

            return (
              <article
                className={work.id === handoffWorkId && !handoffDismissed ? "account-work is-highlighted" : "account-work"}
                id={`work-${work.id}`}
                key={work.id}
              >
                {editingWorkId === work.id && workForm ? (
                  <form className="account-work-editor" onSubmit={saveWork} noValidate>
                    <div className="account-editor-heading">
                      <div>
                        <span className={`status-badge is-${work.status}`}>{statusMeta[work.status]?.label || work.status}</span>
                        <h2>Edit submission</h2>
                        <p>Saving sends this work back to review as pending.</p>
                      </div>
                      <button className="ghost-button" type="button" onClick={stopEditingWork}>
                        <X size={17} aria-hidden="true" />
                        Cancel
                      </button>
                    </div>
                    <div className="account-editor-grid">
                      <div className="field">
                        <label htmlFor={`work-title-${work.id}`}>Title</label>
                        <input
                          id={`work-title-${work.id}`}
                          value={workForm.title}
                          maxLength={80}
                          onChange={(event) => updateWorkForm("title", event.target.value)}
                          required
                        />
                      </div>
                      <div className="field">
                        <label htmlFor={`work-category-${work.id}`}>Category</label>
                        <select
                          id={`work-category-${work.id}`}
                          value={workForm.category}
                          onChange={(event) => updateWorkForm("category", event.target.value)}
                        >
                          {categoryOptions.map(([id, label]) => (
                            <option value={id} key={id}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="field span-2">
                        <label htmlFor={`work-summary-${work.id}`}>Short summary</label>
                        <input
                          id={`work-summary-${work.id}`}
                          value={workForm.summary}
                          maxLength={160}
                          onChange={(event) => updateWorkForm("summary", event.target.value)}
                          required
                        />
                      </div>
                      <div className="field">
                        <label htmlFor={`work-demo-${work.id}`}>Demo URL</label>
                        <input
                          id={`work-demo-${work.id}`}
                          value={workForm.demoUrl}
                          onChange={(event) => updateWorkForm("demoUrl", event.target.value)}
                          required
                        />
                      </div>
                      <div className="field">
                        <label htmlFor={`work-cover-${work.id}`}>Cover image URL</label>
                        <input
                          id={`work-cover-${work.id}`}
                          value={workForm.coverUrl}
                          onChange={(event) => updateWorkForm("coverUrl", event.target.value)}
                          placeholder="https://... or leave blank"
                        />
                      </div>
                      <div className="field">
                        <label htmlFor={`work-tags-${work.id}`}>Tags</label>
                        <input
                          id={`work-tags-${work.id}`}
                          value={workForm.tags}
                          onChange={(event) => updateWorkForm("tags", event.target.value)}
                          placeholder="Codex, Canvas, Casual"
                        />
                      </div>
                      <div className="field">
                        <label htmlFor={`work-tools-${work.id}`}>Tool stack</label>
                        <input
                          id={`work-tools-${work.id}`}
                          value={workForm.toolStack}
                          maxLength={120}
                          onChange={(event) => updateWorkForm("toolStack", event.target.value)}
                          required
                        />
                      </div>
                      <div className="field span-2">
                        <label htmlFor={`work-detail-${work.id}`}>Creator notes</label>
                        <textarea
                          id={`work-detail-${work.id}`}
                          value={workForm.detail}
                          maxLength={1200}
                          onChange={(event) => updateWorkForm("detail", event.target.value)}
                          required
                        />
                      </div>
                    </div>
                    {workErrors.length ? (
                      <div className="validation-list" role="alert">
                        <strong>Before saving</strong>
                        <ul>
                          {workErrors.map((error) => (
                            <li key={error}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    <div className="account-editor-actions">
                      <button className="solid-button" type="submit" disabled={workSaveState === "saving"}>
                        <Save size={17} aria-hidden="true" />
                        {workSaveState === "saving" ? "Saving" : "Save and Resubmit"}
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="account-work-main">
                      <div className="account-work-status-row">
                        <span className={`status-badge is-${work.status}`}>{statusMeta[work.status]?.label || work.status}</span>
                        <span className={`account-action-pill is-${action.tone}`}>
                          <Inbox size={14} aria-hidden="true" />
                          {action.label}
                        </span>
                      </div>
                      <h2>{work.title}</h2>
                      <p>{work.summary}</p>
                      <div className="account-meta">
                        <span>{labelCategory(work.category)}</span>
                        <span>Submitted {formatDate(work.created_at)}</span>
                        <span>Updated {formatDate(work.updated_at || work.created_at)}</span>
                        {work.review_cycle ? <span>Review round {work.review_cycle + 1}</span> : null}
                        {work.resubmitted_at ? <span>Resubmitted {formatDate(work.resubmitted_at)}</span> : null}
                        {work.last_reviewed_at ? <span>Reviewed {formatDate(work.last_reviewed_at)}</span> : null}
                        <span>{statusMeta[work.status]?.helper || "Status updated."}</span>
                      </div>
                      <div className="account-work-progress" aria-label={`${work.title} progress`}>
                        {progressSteps.map((step) => (
                          <span className={step.ok ? "is-done" : step.current ? "is-current" : ""} key={step.label}>
                            {step.ok ? <CheckCircle2 size={14} aria-hidden="true" /> : <Clock3 size={14} aria-hidden="true" />}
                            {step.label}
                          </span>
                        ))}
                      </div>
                      {work.review_note ? (
                        <div className="account-review-note">
                          <strong>Review feedback</strong>
                          <p>{work.review_note}</p>
                        </div>
                      ) : null}
                      <div className={`account-next-step is-${action.tone}`}>
                        <span className="account-next-kicker">{action.next}</span>
                        <strong>{action.title}</strong>
                        <p>{action.helper}</p>
                        <ul className="account-action-list">
                          {action.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="account-work-details">
                        <span>{work.tool_stack || "Tool stack not set"}</span>
                        {work.tags.length ? work.tags.slice(0, 4).map((tag) => <span key={tag}>#{tag}</span>) : <span>No tags yet</span>}
                      </div>
                      {work.status === "published" ? (
                        <div className="account-work-stats" aria-label={`${work.title} public signals`}>
                          <span>
                            <BarChart3 size={14} aria-hidden="true" />
                            {formatNumber(work.views_count || 0)} views
                          </span>
                          <span>
                            <Play size={14} aria-hidden="true" />
                            {formatNumber((work.try_clicks_count || 0) + (work.demo_opens_count || 0))} opens
                          </span>
                          <span>
                            <Heart size={14} aria-hidden="true" />
                            {formatNumber(work.likes_count || 0)} likes
                          </span>
                          <span>
                            <Share2 size={14} aria-hidden="true" />
                            {formatNumber(work.share_clicks_count || 0)} shares
                          </span>
                        </div>
                      ) : null}
                    </div>
                    <div className="account-work-actions">
                      {canEditWork(work.status) ? (
                        <button className="ghost-button" type="button" onClick={() => startEditingWork(work)}>
                          <Pencil size={17} aria-hidden="true" />
                          {work.status === "rejected" || work.status === "hidden" || work.review_note ? "Edit and Resubmit" : "Edit"}
                        </button>
                      ) : null}
                      {work.status === "pending" ? (
                        <button
                          className="ghost-button"
                          type="button"
                          onClick={() => updateWorkVisibility(work, "withdraw")}
                          disabled={statusActionId === `${work.id}:withdraw`}
                        >
                          <Undo2 size={17} aria-hidden="true" />
                          {statusActionId === `${work.id}:withdraw` ? "Withdrawing" : "Withdraw"}
                        </button>
                      ) : null}
                      {work.status === "published" ? (
                        <button
                          className="ghost-button is-warning"
                          type="button"
                          onClick={() => updateWorkVisibility(work, "hide")}
                          disabled={statusActionId === `${work.id}:hide`}
                        >
                          <X size={17} aria-hidden="true" />
                          {statusActionId === `${work.id}:hide` ? "Hiding" : "Hide from Public"}
                        </button>
                      ) : null}
                      {work.status === "published" ? (
                        <>
                          <Link className="ghost-button" href={`/works/${work.id}`}>
                            <ExternalLink size={17} aria-hidden="true" />
                            Public Page
                          </Link>
                          <Link className="solid-button" href={`/play/${work.id}`}>
                            <Play size={17} aria-hidden="true" />
                            TRY
                          </Link>
                        </>
                      ) : work.demo_url ? (
                        <Link className="ghost-button" href={work.demo_url} target="_blank" rel="noreferrer">
                          <ExternalLink size={17} aria-hidden="true" />
                          Open Demo
                        </Link>
                      ) : null}
                    </div>
                  </>
                )}
              </article>
            );
          })}
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

function formatNumber(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}m`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
  return String(value);
}

const categoryOptions: Array<[Exclude<CategoryId, "all">, string]> = [
  ["game", "Game"],
  ["tool", "Tool"],
  ["story", "Interactive"],
  ["visual", "Visual"],
  ["ai", "AI Experiment"],
];

function canEditWork(status: WorkStatus) {
  return status === "draft" || status === "pending" || status === "rejected" || status === "hidden";
}

function getPriorityActions(works: AccountWorkRow[]) {
  const revisionCount = works.filter(needsCreatorRevision).length;
  const pendingCount = works.filter((work) => work.status === "pending").length;
  const liveCount = works.filter((work) => work.status === "published").length;

  return [
    {
      label: "Needs action",
      value: String(revisionCount),
      helper: revisionCount ? "Revise these first so they can return to review." : "No review feedback is blocking you.",
      tone: revisionCount ? "urgent" : "good",
      icon: "action",
    },
    {
      label: "In review",
      value: String(pendingCount),
      helper: pendingCount ? "Keep demos available while admin reviews them." : "No work is waiting for review right now.",
      tone: pendingCount ? "pending" : "muted",
      icon: "review",
    },
    {
      label: "Live portfolio",
      value: String(liveCount),
      helper: liveCount ? "Open public pages, test TRY, and share the strongest work." : "Published works will appear here after approval.",
      tone: liveCount ? "good" : "muted",
      icon: "live",
    },
  ];
}

function getActionSummary(works: AccountWorkRow[]) {
  const urgentCount = works.filter(needsCreatorRevision).length;
  const pendingCount = works.filter((work) => work.status === "pending").length;
  const publishedCount = works.filter((work) => work.status === "published").length;

  if (urgentCount) {
    return {
      title: urgentCount === 1 ? "1 work needs revision" : `${urgentCount} works need revision`,
      helper: "Review feedback is waiting. Update the submission and send it back to the review queue.",
      urgentCount,
      pendingCount,
      publishedCount,
    };
  }

  if (pendingCount) {
    return {
      title: pendingCount === 1 ? "1 work is in review" : `${pendingCount} works are in review`,
      helper: "Your latest submissions are waiting for admin review. Published works will appear here when approved.",
      urgentCount,
      pendingCount,
      publishedCount,
    };
  }

  if (publishedCount) {
    return {
      title: publishedCount === 1 ? "1 work is live" : `${publishedCount} works are live`,
      helper: "Your published works are visible on oeeco and ready to share.",
      urgentCount,
      pendingCount,
      publishedCount,
    };
  }

  return {
    title: "No active review items",
    helper: "Submit a new work when you are ready to build your oeeco profile.",
    urgentCount,
    pendingCount,
    publishedCount,
  };
}

function getHandoffMessage(work: AccountWorkRow) {
  if (work.status === "pending") {
    return "It is now in the review queue. No action is needed unless the demo URL changes before review.";
  }

  if (work.status === "published") {
    return "It has already been approved and published. Open the public page or TRY route when you are ready to share it.";
  }

  if (work.status === "rejected") {
    return "Review feedback is ready. Edit the submission, address the note, and resubmit it for another review.";
  }

  if (work.status === "hidden") {
    return "It is hidden from public pages. Edit and resubmit it when you want it reviewed again.";
  }

  return "It is saved as a draft. Complete the required fields and submit it when ready.";
}

function sortAccountWorks(works: AccountWorkRow[]) {
  const priority: Record<WorkStatus, number> = {
    rejected: 0,
    hidden: 1,
    pending: 2,
    draft: 3,
    published: 4,
  };

  return [...works].sort((a, b) => {
    const aPriority = needsCreatorRevision(a) ? -1 : priority[a.status] ?? 9;
    const bPriority = needsCreatorRevision(b) ? -1 : priority[b.status] ?? 9;
    if (aPriority !== bPriority) return aPriority - bPriority;

    return new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime();
  });
}

function needsCreatorRevision(work: AccountWorkRow) {
  return work.status === "rejected" || Boolean(work.review_note && work.status !== "published");
}

function isResubmittedWork(work: AccountWorkRow) {
  return Boolean((work.review_cycle || 0) > 0 || work.resubmitted_at);
}

function getWorkProgressSteps(work: AccountWorkRow) {
  const submitted = work.status !== "draft";
  const reviewed = work.status === "published" || work.status === "rejected" || work.status === "hidden";
  const live = work.status === "published";

  return [
    {
      label: "Submitted",
      ok: submitted,
      current: work.status === "draft",
    },
    {
      label: "Reviewed",
      ok: reviewed,
      current: work.status === "pending",
    },
    {
      label: "Public",
      ok: live,
      current: work.status === "published",
    },
  ];
}

function getWorkAction(work: AccountWorkRow) {
  if (needsCreatorRevision(work)) {
    return {
      label: "Action needed",
      next: "Next: revise submission",
      title: "Revise and resubmit",
      helper: "Use the review feedback above, update the submission, and send it back to pending review.",
      items: ["Open the editor", "Address the review feedback", "Save and resubmit for review"],
      tone: "urgent" as const,
    };
  }

  if (work.status === "pending") {
    if (isResubmittedWork(work)) {
      return {
        label: "Resubmitted",
        next: "Next: follow-up review",
        title: `Review round ${(work.review_cycle || 0) + 1}`,
        helper: "Your changes are back in the review queue. Keep the demo live while the update is checked.",
        items: ["Wait for follow-up review", "Keep the updated demo reachable", "Watch for approval or new feedback"],
        tone: "pending" as const,
      };
    }

    return {
      label: "In review",
      next: "Next: wait for review",
      title: "Waiting for review",
      helper: "No action is needed right now. You can still edit details while it is pending.",
      items: ["Keep the demo link live", "Edit only if something important changed", "Watch this page for approval or feedback"],
      tone: "pending" as const,
    };
  }

  if (work.status === "published") {
    return {
      label: "Live",
      next: "Next: share or inspect",
      title: "Published on oeeco",
      helper: "Open the public page or TRY route to share and inspect the live listing.",
      items: ["Check the public page", "Open the TRY route", "Submit another work when ready"],
      tone: "good" as const,
    };
  }

  if (work.status === "hidden") {
    return {
      label: "Hidden",
      next: "Next: revise or resubmit",
      title: "Currently hidden",
      helper: "This work is not visible publicly. Edit it and resubmit when it is ready for review again.",
      items: ["Review the current demo", "Edit details if needed", "Save and resubmit for review"],
      tone: "muted" as const,
    };
  }

  return {
    label: "Draft",
    next: "Next: finish and submit",
    title: "Finish the draft",
    helper: "Complete the missing fields and submit it for review when ready.",
    items: ["Fill in the required fields", "Confirm the public demo URL works", "Save and send it to review"],
    tone: "pending" as const,
  };
}

function getWorkStatusTransition(work: AccountWorkRow, action: WorkStatusAction) {
  if (action === "withdraw" && work.status === "pending") {
    return {
      fromStatus: "pending" as const,
      nextStatus: "draft" as const,
      confirm: "Withdraw this work from review and move it back to Draft?",
      success: "Work withdrawn from review and moved to Draft.",
    };
  }

  if (action === "hide" && work.status === "published") {
    return {
      fromStatus: "published" as const,
      nextStatus: "hidden" as const,
      confirm: "Hide this published work from public pages? You can edit and resubmit it later.",
      success: "Work hidden from public pages.",
    };
  }

  return null;
}

function getVisibilityUpdateError(message: string) {
  if (message.toLowerCase().includes("row-level security")) {
    return "Status change was blocked by Supabase permissions. Run the creator withdraw/hide policy SQL, then try again.";
  }

  return message;
}

function isMissingAccountWorkColumnError(message: string) {
  const normalized = message.toLowerCase();
  return (
    normalized.includes("review_note") ||
    normalized.includes("review_cycle") ||
    normalized.includes("resubmitted_at") ||
    normalized.includes("last_reviewed_at")
  );
}

function parseTags(value: string) {
  return dedupeTags(value.split(/[,\n]/));
}

function dedupeTags(tags: string[]) {
  const seen = new Set<string>();
  return tags
    .map((tag) => tag.trim().replace(/\s+/g, " "))
    .filter(Boolean)
    .map((tag) => tag.slice(0, 32))
    .filter((tag) => !isInternalTag(tag))
    .filter((tag) => {
      const key = tag.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 8);
}

function prepareWorkForm(form: WorkForm) {
  const title = form.title.trim();
  const summary = form.summary.trim();
  const detail = form.detail.trim();
  const demoUrl = form.demoUrl.trim();
  const coverUrl = form.coverUrl.trim();
  const toolStack = form.toolStack.trim();
  const tags = parseTags(form.tags);
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
      category: form.category,
      tags,
      demoUrl,
      coverUrl: coverUrl || null,
      toolStack: toolStack.slice(0, 120),
    },
    errors,
  };
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

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isInternalTag(tag: string) {
  return tag.toLowerCase().startsWith("oeeco:");
}

function getProfileSaveError(message: string) {
  if (message.toLowerCase().includes("duplicate")) return "That username is already taken.";
  if (message.toLowerCase().includes("violates check constraint")) {
    return "Check your username, display name, avatar URL, and bio length.";
  }
  return message;
}
