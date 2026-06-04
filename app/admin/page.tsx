import { Check, ExternalLink, Eye, RotateCcw, Save, Shield, X } from "lucide-react";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { categories, isCategoryId, type CategoryId } from "@/lib/data";
import {
  getAdminWorkCounts,
  getAdminWorks,
  updateAdminWorkDetails,
  updateAdminWorkStatus,
  type AdminWorkStatus,
} from "@/lib/work-service";

export const dynamic = "force-dynamic";

const statusOptions: Array<{ id: AdminWorkStatus; label: string; helper: string }> = [
  { id: "pending", label: "Pending", helper: "New submissions waiting for review" },
  { id: "published", label: "Published", helper: "Visible on Explore" },
  { id: "rejected", label: "Rejected", helper: "Not visible to viewers" },
  { id: "hidden", label: "Hidden", helper: "Temporarily removed from Explore" },
];

const categoryOptions = categories.filter(
  (category): category is [Exclude<CategoryId, "all">, string] => category[0] !== "all",
);

function parseStatus(value: FormDataEntryValue | string | undefined | null): AdminWorkStatus {
  const next = String(value || "");
  return statusOptions.some((status) => status.id === next) ? (next as AdminWorkStatus) : "pending";
}

function parseCategory(value: FormDataEntryValue | null): Exclude<CategoryId, "all"> {
  const category = String(value || "game");
  return isCategoryId(category) ? category : "game";
}

function cleanText(value: FormDataEntryValue | null, maxLength: number) {
  return String(value || "").trim().slice(0, maxLength);
}

function optionalText(value: FormDataEntryValue | null, maxLength: number) {
  const next = cleanText(value, maxLength);
  return next || null;
}

function parseTags(value: FormDataEntryValue | null) {
  const seen = new Set<string>();
  return String(value || "")
    .split(/[,\n]/)
    .map((tag) => tag.trim())
    .filter(Boolean)
    .map((tag) => tag.slice(0, 32))
    .filter((tag) => {
      if (seen.has(tag)) return false;
      seen.add(tag);
      return true;
    })
    .slice(0, 8);
}

function adminUrl(key: string, status: AdminWorkStatus, params: Record<string, string> = {}) {
  const query = new URLSearchParams({ key, status, ...params });
  return `/admin?${query.toString()}`;
}

async function updateStatus(formData: FormData) {
  "use server";

  const key = String(formData.get("key") || "");
  const id = String(formData.get("id") || "");
  const currentStatus = parseStatus(formData.get("currentStatus"));
  const nextStatus = parseStatus(formData.get("status"));

  if (!process.env.ADMIN_PASSCODE || key !== process.env.ADMIN_PASSCODE) {
    redirect("/admin?error=bad-key");
  }

  if (!id) {
    redirect(adminUrl(key, currentStatus, { error: "bad-request" }));
  }

  const result = await updateAdminWorkStatus(id, nextStatus);
  revalidatePath("/");
  revalidatePath("/admin");

  redirect(adminUrl(key, nextStatus, result.ok ? { updated: "1" } : { error: "update-failed" }));
}

async function saveDetails(formData: FormData) {
  "use server";

  const key = String(formData.get("key") || "");
  const id = String(formData.get("id") || "");
  const currentStatus = parseStatus(formData.get("currentStatus"));
  const title = cleanText(formData.get("title"), 80);
  const summary = cleanText(formData.get("summary"), 160);

  if (!process.env.ADMIN_PASSCODE || key !== process.env.ADMIN_PASSCODE) {
    redirect("/admin?error=bad-key");
  }

  if (!id || title.length < 2 || summary.length < 2) {
    redirect(adminUrl(key, currentStatus, { error: "bad-request" }));
  }

  const result = await updateAdminWorkDetails(id, {
    title,
    summary,
    description: cleanText(formData.get("description"), 1200),
    category: parseCategory(formData.get("category")),
    coverUrl: optionalText(formData.get("coverUrl"), 500),
    demoUrl: optionalText(formData.get("demoUrl"), 500),
    toolStack: cleanText(formData.get("toolStack"), 120),
    tags: parseTags(formData.get("tags")),
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/works/${id}`);
  revalidatePath(`/play/${id}`);

  redirect(adminUrl(key, currentStatus, result.ok ? { saved: "1" } : { error: "save-failed" }));
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string; status?: string; error?: string; updated?: string; saved?: string }>;
}) {
  const params = await searchParams;
  const key = params.key || "";
  const activeStatus = parseStatus(params.status);
  const adminReady = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.ADMIN_PASSCODE);
  const authorized = adminReady && key === process.env.ADMIN_PASSCODE;

  if (!adminReady) {
    return (
      <section className="surface detail-body">
        <span className="section-kicker">Admin</span>
        <h1 className="page-title">Admin environment variables required</h1>
        <p>Add these variables in Vercel Environment Variables:</p>
        <div className="stat-list">
          <div className="stat-item">
            <span>SUPABASE_SERVICE_ROLE_KEY</span>
            <strong>Supabase secret key</strong>
          </div>
          <div className="stat-item">
            <span>ADMIN_PASSCODE</span>
            <strong>Your private admin password</strong>
          </div>
        </div>
      </section>
    );
  }

  if (!authorized) {
    return (
      <section className="surface detail-body admin-login">
        <span className="section-kicker">Admin</span>
        <h1 className="page-title">Enter admin passcode</h1>
        <p>Review, edit, publish, reject, and hide submitted works.</p>
        <form className="form-grid" action="/admin">
          <div className="field">
            <label htmlFor="key">Passcode</label>
            <input id="key" name="key" type="password" required />
          </div>
          <button className="solid-button" type="submit">
            <Shield size={17} aria-hidden="true" />
            Enter Admin
          </button>
        </form>
        {params.error ? <p>Wrong passcode or invalid request.</p> : null}
      </section>
    );
  }

  const [works, counts] = await Promise.all([getAdminWorks(activeStatus), getAdminWorkCounts()]);
  const activeOption = statusOptions.find((status) => status.id === activeStatus) || statusOptions[0];

  return (
    <section className="surface detail-body admin-page">
      <div className="admin-heading">
        <div>
          <span className="section-kicker">Admin</span>
          <h1 className="page-title">Review Dashboard</h1>
          <p>Inspect submissions, open demos, edit metadata, then publish, reject, or hide works.</p>
        </div>
        <Link className="ghost-button" href="/" target="_blank">
          <ExternalLink size={17} aria-hidden="true" />
          Open Explore
        </Link>
      </div>

      <nav className="admin-tabs" aria-label="Review status">
        {statusOptions.map((status) => (
          <Link
            className={status.id === activeStatus ? "admin-tab is-active" : "admin-tab"}
            href={adminUrl(key, status.id)}
            key={status.id}
          >
            <span>{status.label}</span>
            <strong>{counts[status.id]}</strong>
          </Link>
        ))}
      </nav>

      {params.updated ? <div className="admin-notice">Status updated.</div> : null}
      {params.saved ? <div className="admin-notice">Work details saved.</div> : null}
      {params.error ? <div className="admin-notice is-error">Action failed. Check the form and try again.</div> : null}

      <div className="admin-section-title">
        <div>
          <h2>{activeOption.label}</h2>
          <p>{activeOption.helper}</p>
        </div>
        <span>{works.length} works</span>
      </div>

      {works.length ? (
        <div className="admin-list">
          {works.map((work) => (
            <article className="admin-row" key={work.id}>
              <div className="admin-card-header">
                <div>
                  <strong>{work.title}</strong>
                  <p>{work.summary}</p>
                  <div className="admin-meta">
                    <span>{work.creator?.handle || "@creator"}</span>
                    <span>{work.createdAt}</span>
                    <span>{work.type}</span>
                  </div>
                </div>
                <div className="admin-actions">
                  {work.demoUrl ? (
                    <Link className="ghost-button" href={work.demoUrl} target="_blank" rel="noreferrer">
                      <ExternalLink size={17} aria-hidden="true" />
                      Open Demo
                    </Link>
                  ) : null}
                  {work.status === "published" ? (
                    <Link className="ghost-button" href={`/works/${work.id}`} target="_blank">
                      <Eye size={17} aria-hidden="true" />
                      Public Page
                    </Link>
                  ) : null}
                </div>
              </div>

              <form className="admin-edit-form" action={saveDetails}>
                <input type="hidden" name="key" value={key} />
                <input type="hidden" name="id" value={work.id} />
                <input type="hidden" name="currentStatus" value={activeStatus} />
                <div className="admin-fields">
                  <label>
                    <span>Title</span>
                    <input name="title" defaultValue={work.title} maxLength={80} required />
                  </label>
                  <label>
                    <span>Short summary</span>
                    <input name="summary" defaultValue={work.summary} maxLength={160} required />
                  </label>
                  <label>
                    <span>Category</span>
                    <select name="category" defaultValue={work.category}>
                      {categoryOptions.map(([id, label]) => (
                        <option value={id} key={id}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span>Tags</span>
                    <input name="tags" defaultValue={work.tags.join(", ")} placeholder="Codex, Game, Casual" />
                  </label>
                  <label>
                    <span>Demo URL</span>
                    <input name="demoUrl" defaultValue={work.demoUrl || ""} placeholder="https://..." />
                  </label>
                  <label>
                    <span>Cover URL</span>
                    <input name="coverUrl" defaultValue={work.cover || ""} placeholder="/assets/cover-upload.png" />
                  </label>
                  <label>
                    <span>Tools</span>
                    <input name="toolStack" defaultValue={work.tool} placeholder="Codex, Canvas, React" />
                  </label>
                  <label className="span-2">
                    <span>Creator notes</span>
                    <textarea name="description" defaultValue={work.detail} rows={4} />
                  </label>
                </div>
                <button className="ghost-button" type="submit">
                  <Save size={17} aria-hidden="true" />
                  Save Changes
                </button>
              </form>

              <div className="admin-action-bar">
                {work.status !== "published" ? (
                  <form action={updateStatus}>
                    <input type="hidden" name="key" value={key} />
                    <input type="hidden" name="id" value={work.id} />
                    <input type="hidden" name="currentStatus" value={activeStatus} />
                    <button className="solid-button" name="status" value="published" type="submit">
                      <Check size={17} aria-hidden="true" />
                      Publish
                    </button>
                  </form>
                ) : null}
                {work.status !== "rejected" ? (
                  <form action={updateStatus}>
                    <input type="hidden" name="key" value={key} />
                    <input type="hidden" name="id" value={work.id} />
                    <input type="hidden" name="currentStatus" value={activeStatus} />
                    <button className="ghost-button" name="status" value="rejected" type="submit">
                      <X size={17} aria-hidden="true" />
                      Reject
                    </button>
                  </form>
                ) : null}
                {work.status !== "hidden" && work.status === "published" ? (
                  <form action={updateStatus}>
                    <input type="hidden" name="key" value={key} />
                    <input type="hidden" name="id" value={work.id} />
                    <input type="hidden" name="currentStatus" value={activeStatus} />
                    <button className="ghost-button" name="status" value="hidden" type="submit">
                      <X size={17} aria-hidden="true" />
                      Hide
                    </button>
                  </form>
                ) : null}
                {work.status !== "pending" ? (
                  <form action={updateStatus}>
                    <input type="hidden" name="key" value={key} />
                    <input type="hidden" name="id" value={work.id} />
                    <input type="hidden" name="currentStatus" value={activeStatus} />
                    <button className="ghost-button" name="status" value="pending" type="submit">
                      <RotateCcw size={17} aria-hidden="true" />
                      Move to Pending
                    </button>
                  </form>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <section className="empty-state">
          <h2>No works in this status</h2>
          <p>Switch tabs above, or come back when creators submit new works.</p>
        </section>
      )}
    </section>
  );
}
