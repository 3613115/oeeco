"use client";

import { Send, RotateCcw } from "lucide-react";
import Image from "next/image";
import { FormEvent, useMemo, useState } from "react";
import { isSupabaseConfigured } from "@/lib/supabase";

type Draft = {
  title: string;
  summary: string;
  tags: string;
};

export function UploadForm() {
  const [draft, setDraft] = useState<Draft>({
    title: "",
    summary: "",
    tags: "",
  });
  const [message, setMessage] = useState("");

  const tags = useMemo(() => parseTags(draft.tags), [draft.tags]);

  function updateDraft(key: keyof Draft, value: string) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    localStorage.setItem(
      "oeeco-upload-draft",
      JSON.stringify({ ...draft, submittedAt: new Date().toISOString() }),
    );
    setMessage(
      isSupabaseConfigured
        ? "草稿已保存。下一步会把这里接入 Supabase 发布接口。"
        : "本地草稿已保存。填好 Supabase 环境变量后，这里会切换为真实发布。",
    );
  }

  function reset() {
    setDraft({ title: "", summary: "", tags: "" });
    setMessage("");
  }

  return (
    <section className="upload-shell surface">
      <form className="form-grid" onSubmit={submit}>
        <div>
          <span className="section-kicker">发布作品</span>
          <h1 className="page-title">上传到 oeeco</h1>
          <p className="upload-help">
            第一版先保存为本地草稿。接入 Supabase 后，同一个表单会写入作品表，并进入审核队列。
          </p>
        </div>
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
          <textarea id="detail" name="detail" placeholder="可以写用了哪些工具、怎么做出来的、适合谁体验" />
        </div>
        <div className="form-actions">
          <button className="solid-button" type="submit">
            <Send size={17} aria-hidden="true" />
            发布预览
          </button>
          <button className="ghost-button" type="button" onClick={reset}>
            <RotateCcw size={17} aria-hidden="true" />
            重填
          </button>
        </div>
        {message ? <div className="toast" role="status">{message}</div> : null}
      </form>

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
