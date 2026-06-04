import { Check, ExternalLink, Shield, X } from "lucide-react";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminWorks, updateAdminWorkStatus } from "@/lib/work-service";

export const dynamic = "force-dynamic";

async function updateStatus(formData: FormData) {
  "use server";

  const key = String(formData.get("key") || "");
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");

  if (!process.env.ADMIN_PASSCODE || key !== process.env.ADMIN_PASSCODE) {
    redirect("/admin?error=bad-key");
  }

  if (!id || !["published", "rejected", "hidden"].includes(status)) {
    redirect(`/admin?key=${encodeURIComponent(key)}&error=bad-request`);
  }

  await updateAdminWorkStatus(id, status as "published" | "rejected" | "hidden");
  revalidatePath("/");
  revalidatePath("/admin");
  redirect(`/admin?key=${encodeURIComponent(key)}&updated=1`);
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string; error?: string; updated?: string }>;
}) {
  const params = await searchParams;
  const key = params.key || "";
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
        <p>这是早期临时后台，用来把待审核作品发布到首页。</p>
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

  const pendingWorks = await getAdminWorks("pending");

  return (
    <section className="surface detail-body admin-page">
      <span className="section-kicker">管理员后台</span>
      <h1 className="page-title">待审核作品</h1>
      {params.updated ? <p>作品状态已更新。</p> : null}

      {pendingWorks.length ? (
        <div className="admin-list">
          {pendingWorks.map((work) => (
            <article className="admin-row" key={work.id}>
              <div>
                <strong>{work.title}</strong>
                <p>{work.summary}</p>
                <div className="tag-row">
                  <span className="small-pill">{work.type}</span>
                  {work.tags.map((tag) => (
                    <span className="small-pill" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="admin-actions">
                {work.demoUrl ? (
                  <Link className="ghost-button" href={work.demoUrl} target="_blank">
                    <ExternalLink size={17} aria-hidden="true" />
                    打开链接
                  </Link>
                ) : null}
                <form action={updateStatus}>
                  <input type="hidden" name="key" value={key} />
                  <input type="hidden" name="id" value={work.id} />
                  <button className="solid-button" name="status" value="published" type="submit">
                    <Check size={17} aria-hidden="true" />
                    发布
                  </button>
                </form>
                <form action={updateStatus}>
                  <input type="hidden" name="key" value={key} />
                  <input type="hidden" name="id" value={work.id} />
                  <button className="ghost-button" name="status" value="rejected" type="submit">
                    <X size={17} aria-hidden="true" />
                    拒绝
                  </button>
                </form>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <section className="empty-state">
          <h2>没有待审核作品</h2>
          <p>新提交的作品会出现在这里。</p>
        </section>
      )}
    </section>
  );
}
