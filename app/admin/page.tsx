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
  { id: "pending", label: "待审核", helper: "新提交的作品" },
  { id: "published", label: "已发布", helper: "正在广场展示" },
  { id: "rejected", label: "已拒绝", helper: "不展示给观众" },
  { id: "hidden", label: "已隐藏", helper: "暂时下架" },
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
    .split(/[,，\n]/)
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
        <span className="section-kicker">管理员后台</span>
        <h1 className="page-title">需要配置管理环境变量</h1>
        <p>在 Vercel 的 Environment Variables 里添加：</p>
        <div className="stat-list">
          <div className="stat-item">
            <span>SUPABASE_SERVICE_ROLE_KEY</span>
            <strong>Supabase secret key</strong>
          </div>
          <div className="stat-item">
            <span>ADMIN_PASSCODE</span>
            <strong>你自定义的审核密码</strong>
          </div>
        </div>
      </section>
    );
  }

  if (!authorized) {
    return (
      <section className="surface detail-body admin-login">
        <span className="section-kicker">管理员后台</span>
        <h1 className="page-title">输入审核密码</h1>
        <p>这里用于审核、编辑和上下架创作者提交的作品。</p>
        <form className="form-grid" action="/admin">
          <div className="field">
            <label htmlFor="key">审核密码</label>
            <input id="key" name="key" type="password" required />
          </div>
          <button className="solid-button" type="submit">
            <Shield size={17} aria-hidden="true" />
            进入后台
          </button>
        </form>
        {params.error ? <p>密码不对或请求无效。</p> : null}
      </section>
    );
  }

  const [works, counts] = await Promise.all([getAdminWorks(activeStatus), getAdminWorkCounts()]);
  const activeOption = statusOptions.find((status) => status.id === activeStatus) || statusOptions[0];

  return (
    <section className="surface detail-body admin-page">
      <div className="admin-heading">
        <div>
          <span className="section-kicker">管理员后台</span>
          <h1 className="page-title">作品审核台</h1>
          <p>查看提交内容、打开试玩、修改作品信息，再决定发布、拒绝或隐藏。</p>
        </div>
        <Link className="ghost-button" href="/" target="_blank">
          <ExternalLink size={17} aria-hidden="true" />
          打开广场
        </Link>
      </div>

      <nav className="admin-tabs" aria-label="审核状态">
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

      {params.updated ? <div className="admin-notice">状态已更新。</div> : null}
      {params.saved ? <div className="admin-notice">作品信息已保存。</div> : null}
      {params.error ? <div className="admin-notice is-error">操作没有成功，请检查表单内容后再试。</div> : null}

      <div className="admin-section-title">
        <div>
          <h2>{activeOption.label}</h2>
          <p>{activeOption.helper}</p>
        </div>
        <span>{works.length} 个作品</span>
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
                      打开试玩
                    </Link>
                  ) : null}
                  {work.status === "published" ? (
                    <Link className="ghost-button" href={`/works/${work.id}`} target="_blank">
                      <Eye size={17} aria-hidden="true" />
                      站内详情
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
                    <span>标题</span>
                    <input name="title" defaultValue={work.title} maxLength={80} required />
                  </label>
                  <label>
                    <span>一句话简介</span>
                    <input name="summary" defaultValue={work.summary} maxLength={160} required />
                  </label>
                  <label>
                    <span>类型</span>
                    <select name="category" defaultValue={work.category}>
                      {categoryOptions.map(([id, label]) => (
                        <option value={id} key={id}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span>标签</span>
                    <input name="tags" defaultValue={work.tags.join(", ")} placeholder="Codex, 游戏, 休闲" />
                  </label>
                  <label>
                    <span>试玩链接</span>
                    <input name="demoUrl" defaultValue={work.demoUrl || ""} placeholder="https://..." />
                  </label>
                  <label>
                    <span>封面 URL</span>
                    <input name="coverUrl" defaultValue={work.cover || ""} placeholder="/assets/cover-upload.png" />
                  </label>
                  <label>
                    <span>工具</span>
                    <input name="toolStack" defaultValue={work.tool} placeholder="Codex, Canvas, React" />
                  </label>
                  <label className="span-2">
                    <span>创作说明</span>
                    <textarea name="description" defaultValue={work.detail} rows={4} />
                  </label>
                </div>
                <button className="ghost-button" type="submit">
                  <Save size={17} aria-hidden="true" />
                  保存修改
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
                      发布
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
                      拒绝
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
                      隐藏
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
                      退回待审
                    </button>
                  </form>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <section className="empty-state">
          <h2>这里暂时没有作品</h2>
          <p>切换上方状态，或等创作者提交新作品后再回来处理。</p>
        </section>
      )}
    </section>
  );
}
