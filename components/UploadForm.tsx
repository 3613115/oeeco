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
      setMessage("Supabase 还没有配置完成。");
      return;
    }

    const nextEmail = email.trim();
    if (!nextEmail) {
      setMessage("请先填写邮箱。");
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

    setMessage(error ? error.message : "登录链接已发送到你的邮箱，请打开邮件完成登录。");
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
      setMessage("本地草稿已保存。填好 Supabase 环境变量后，这里会切换为真实发布。");
      return;
    }

    if (!user) {
      setMessage("请先用邮箱登录，然后再发布作品。");
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
      setMessage(error?.message || "发布失败，请稍后再试。");
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
        setMessage(`作品已创建，但标签保存失败：${tagError.message}`);
        return;
      }
    }

    setSubmitState("sent");
    setMessage("作品已提交，当前状态为待审核。后面我们会做管理员审核后台。");
    reset(false);
  }

  async function signOut() {
    await supabase?.auth.signOut();
    setMessage("已退出登录。");
  }

  function reset(clearMessage = true) {
    setDraft({ title: "", summary: "", tags: "" });
    if (clearMessage) setMessage("");
  }

  return (
    <section className="upload-shell surface">
      <div className="form-grid">
        <div>
          <span className="section-kicker">发布作品</span>
          <h1 className="page-title">上传到 oeeco</h1>
          <p className="upload-help">
            创作者登录后可以提交作品。第一版会写入 Supabase，并进入待审核状态。
          </p>
        </div>

        {user ? (
          <div className="surface detail-body">
            <span className="section-kicker">当前账号</span>
            <p>{user.email}</p>
            <button className="ghost-button" type="button" onClick={signOut}>
              <LogOut size={17} aria-hidden="true" />
              退出登录
            </button>
          </div>
        ) : (
          <form className="form-grid surface detail-body" onSubmit={sendMagicLink}>
            <span className="section-kicker">创作者登录</span>
            <div className="field">
              <label htmlFor="email">邮箱</label>
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
              发送登录链接
            </button>
          </form>
        )}

        <form className="form-grid" onSubmit={submit}>
          <div className="field">
            <label htmlFor="title">作品标题</label>
            <input
              id="title"
              name="title"
              required
              maxLength={36}
              value={draft.title}
              onChange={(event) => updateDraft("title", event.target.value)}
              placeholder="例如：星轨番茄钟"
            />
          </div>
          <div className="field">
            <label htmlFor="summary">一句话简介</label>
            <input
              id="summary"
              name="summary"
              required
              maxLength={80}
              value={draft.summary}
              onChange={(event) => updateDraft("summary", event.target.value)}
              placeholder="让观众快速知道它好玩在哪里"
            />
          </div>
          <div className="field">
            <label htmlFor="link">作品链接</label>
            <input id="link" name="link" type="url" placeholder="https://..." />
          </div>
          <div className="field">
            <label htmlFor="category">类型</label>
            <select id="category" name="category">
              <option value="game">小游戏</option>
              <option value="tool">实用工具</option>
              <option value="story">互动网页</option>
              <option value="visual">视觉艺术</option>
              <option value="ai">AI 实验</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="tags">标签</label>
            <input
              id="tags"
              name="tags"
              value={draft.tags}
              onChange={(event) => updateDraft("tags", event.target.value)}
              placeholder="Codex, Canvas, 休闲"
            />
          </div>
          <div className="field">
            <label htmlFor="detail">创作说明</label>
            <textarea
              id="detail"
              name="detail"
              placeholder="可以写用了哪些工具、怎么做出来的、适合谁体验"
            />
          </div>
          <div className="form-actions">
            <button className="solid-button" type="submit" disabled={submitState === "loading"}>
              <Send size={17} aria-hidden="true" />
              {submitState === "loading" ? "提交中" : "提交审核"}
            </button>
            <button className="ghost-button" type="button" onClick={() => reset()}>
              <RotateCcw size={17} aria-hidden="true" />
              重填
            </button>
          </div>
          {message ? <div className="toast" role="status">{message}</div> : null}
        </form>
      </div>

      <aside className="preview-card">
        <Image src="/assets/cover-upload.png" width={640} height={400} alt="上传预览" />
        <div>
          <span className="section-kicker">预览卡片</span>
          <h2>{draft.title || "你的作品会出现在这里"}</h2>
          <p>{draft.summary || "封面、标题、简介、标签和试玩入口会组成 oeeco 的作品卡片。"}</p>
          <div className="tag-row">
            {(tags.length ? tags : ["Codex", "新作品"]).map((tag) => (
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
    .split(/[,，\s]+/)
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 5);
}
