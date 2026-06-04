const creators = {
  mika: {
    id: "mika",
    name: "Mika",
    handle: "@mika",
    avatar: "./assets/avatar-mika.png",
    bio: "喜欢把小想法做成能马上玩的网页实验。",
    followers: "12.8k",
  },
  neo: {
    id: "neo",
    name: "Neo",
    handle: "@neo",
    avatar: "./assets/avatar-neo.png",
    bio: "用 Codex 做工具、小游戏和一些看起来很认真但其实很好玩的东西。",
    followers: "8.4k",
  },
  yan: {
    id: "yan",
    name: "Yan",
    handle: "@yan",
    avatar: "./assets/avatar-yan.png",
    bio: "互动叙事、视觉页面和 AI 协作流程收藏者。",
    followers: "6.1k",
  },
  sol: {
    id: "sol",
    name: "Sol",
    handle: "@sol",
    avatar: "./assets/avatar-sol.png",
    bio: "把数据可视化做得像游戏一样。",
    followers: "4.9k",
  },
};

const seedWorks = [
  {
    id: "pixel-fishing",
    title: "像素风钓鱼小游戏",
    type: "小游戏",
    category: "game",
    creatorId: "mika",
    cover: "./assets/cover-fishing.png",
    tags: ["Codex", "像素风", "休闲"],
    views: 24800,
    likes: 3180,
    collections: 920,
    tool: "Codex + Canvas",
    createdAt: "2026-06-02",
    summary: "三分钟一局的轻量钓鱼小游戏，鱼群、天气和道具都会影响得分。",
    detail:
      "作者用 Codex 快速搭了核心循环，再一点点调整手感、节奏和视觉细节。这个作品适合作为小游戏模板，后续可以扩展排行榜、皮肤和每日任务。",
    comments: [
      ["Neo", "./assets/avatar-neo.png", "节奏挺舒服，适合做成每日挑战。"],
      ["Yan", "./assets/avatar-yan.png", "封面和游戏气质很统一，打开就想试。"],
    ],
    frame: "fishing",
  },
  {
    id: "tiny-crm",
    title: "自由职业者客户看板",
    type: "实用工具",
    category: "tool",
    creatorId: "neo",
    cover: "./assets/cover-crm.png",
    tags: ["React", "效率", "SaaS"],
    views: 16900,
    likes: 2010,
    collections: 1340,
    tool: "Codex + Supabase",
    createdAt: "2026-06-01",
    summary: "给独立开发者和设计师用的轻量客户管理界面。",
    detail:
      "它把客户、报价、任务和回款状态压缩在一个页面里，适合高频扫描，不追求大而全。oeeco 后续可以把这类作品放进工具分类。",
    comments: [
      ["Mika", "./assets/avatar-mika.png", "这种小而准的工具特别适合 oeeco。"],
      ["Sol", "./assets/avatar-sol.png", "状态颜色很清楚，移动端也能扫。"],
    ],
    frame: "crm",
  },
  {
    id: "story-room",
    title: "会呼吸的互动故事房间",
    type: "互动网页",
    category: "story",
    creatorId: "yan",
    cover: "./assets/cover-story.png",
    tags: ["叙事", "音画", "实验"],
    views: 31200,
    likes: 4870,
    collections: 1530,
    tool: "Codex + Web Audio",
    createdAt: "2026-05-30",
    summary: "点击房间里的物件，会触发不同的微型故事片段。",
    detail:
      "这个作品适合展示 AI 辅助创作不只是在写代码，也可以把脚本、交互和视觉统一到一个小体验里。",
    comments: [
      ["Neo", "./assets/avatar-neo.png", "互动节奏很像短篇小说。"],
      ["Mika", "./assets/avatar-mika.png", "如果加存档点会更完整。"],
    ],
    frame: "story",
  },
  {
    id: "signal-garden",
    title: "数据花园可视化",
    type: "数据可视化",
    category: "visual",
    creatorId: "sol",
    cover: "./assets/cover-garden.png",
    tags: ["数据", "可视化", "Three.js"],
    views: 12400,
    likes: 1760,
    collections: 690,
    tool: "Codex + Three.js",
    createdAt: "2026-05-29",
    summary: "把网站访问数据变成一片会生长的花园。",
    detail:
      "每一朵花代表一个作品，颜色代表类型，高度代表热度。后续 oeeco 自己的数据后台也可以采用这样的展示方式。",
    comments: [
      ["Yan", "./assets/avatar-yan.png", "很适合作为创作者后台的灵感来源。"],
      ["Mika", "./assets/avatar-mika.png", "数据看起来不再像报表了。"],
    ],
    frame: "garden",
  },
  {
    id: "prompt-kitchen",
    title: "Prompt Kitchen",
    type: "AI 实验",
    category: "ai",
    creatorId: "neo",
    cover: "./assets/cover-kitchen.png",
    tags: ["Prompt", "模板", "AI"],
    views: 21600,
    likes: 2930,
    collections: 1820,
    tool: "Codex + GPT",
    createdAt: "2026-05-28",
    summary: "把常用提示词做成菜谱卡片，支持组合和复制。",
    detail:
      "它把 AI 工作流变得更可视化，适合创作者沉淀自己的制作方法。oeeco 可以鼓励作者附上创作过程。",
    comments: [
      ["Sol", "./assets/avatar-sol.png", "这个可以成为作品页面的创作说明模块。"],
      ["Yan", "./assets/avatar-yan.png", "菜谱隐喻很好懂。"],
    ],
    frame: "kitchen",
  },
  {
    id: "orbit-clock",
    title: "星轨番茄钟",
    type: "实用工具",
    category: "tool",
    creatorId: "sol",
    cover: "./assets/cover-clock.png",
    tags: ["效率", "动画", "专注"],
    views: 9800,
    likes: 1220,
    collections: 510,
    tool: "Codex + CSS",
    createdAt: "2026-05-27",
    summary: "一个用星轨表达专注进度的番茄钟。",
    detail:
      "视觉足够轻，操作足够直接，很适合移动端使用。第一版 oeeco 可以把这种作品做成精选位。",
    comments: [
      ["Mika", "./assets/avatar-mika.png", "开始按钮很克制，体验不错。"],
      ["Neo", "./assets/avatar-neo.png", "建议加专注记录。"],
    ],
    frame: "clock",
  },
];

const categories = [
  ["all", "全部作品"],
  ["game", "小游戏"],
  ["tool", "实用工具"],
  ["story", "互动网页"],
  ["visual", "视觉艺术"],
  ["ai", "AI 实验"],
];

const state = {
  category: "all",
  sort: "featured",
  query: "",
  works: loadWorks(),
};

const app = document.querySelector("#app");
const searchInput = document.querySelector("#searchInput");

searchInput.addEventListener("input", (event) => {
  state.query = event.target.value.trim().toLowerCase();
  render();
});

window.addEventListener("hashchange", render);
document.addEventListener("click", handleGlobalClick);

render();

function loadWorks() {
  const saved = localStorage.getItem("oeecoWorks");
  if (!saved) return seedWorks;
  try {
    return [...JSON.parse(saved), ...seedWorks];
  } catch {
    return seedWorks;
  }
}

function saveUserWork(work) {
  const saved = localStorage.getItem("oeecoWorks");
  const works = saved ? JSON.parse(saved) : [];
  works.unshift(work);
  localStorage.setItem("oeecoWorks", JSON.stringify(works));
  state.works = loadWorks();
}

function getRoute() {
  const hash = window.location.hash.replace("#", "") || "home";
  const [view, id] = hash.split("/");
  return { view, id };
}

function render() {
  const { view, id } = getRoute();
  setActiveNav(view);

  if (view === "work") {
    const work = getWork(id);
    app.innerHTML = work ? renderWorkDetail(work) : renderEmpty("没有找到这个作品");
    return;
  }

  if (view === "play") {
    const work = getWork(id);
    app.innerHTML = work ? renderPlay(work) : renderEmpty("没有找到这个试玩");
    hydratePlayFrame(work);
    return;
  }

  if (view === "upload") {
    app.innerHTML = renderUpload();
    hydrateUploadForm();
    return;
  }

  if (view === "creator") {
    app.innerHTML = renderCreator(id);
    return;
  }

  if (view === "rank") {
    app.innerHTML = renderRank();
    return;
  }

  app.innerHTML = renderHome();
  hydrateHome();
}

function setActiveNav(view) {
  document.querySelectorAll("[data-nav]").forEach((node) => {
    const key = node.getAttribute("data-nav");
    node.classList.toggle("is-active", key === view || (view === "work" && key === "home"));
  });
}

function getWork(id) {
  return state.works.find((work) => work.id === id);
}

function getCreator(id) {
  return creators[id] || creators.neo;
}

function getFilteredWorks() {
  const query = state.query;
  let works = state.works.filter((work) => {
    const creator = getCreator(work.creatorId);
    const matchesCategory = state.category === "all" || work.category === state.category;
    const haystack = [
      work.title,
      work.type,
      work.summary,
      creator.name,
      creator.handle,
      ...work.tags,
    ]
      .join(" ")
      .toLowerCase();
    return matchesCategory && (!query || haystack.includes(query));
  });

  if (state.sort === "hot") {
    works = works.sort((a, b) => b.likes + b.views * 0.08 - (a.likes + a.views * 0.08));
  }

  if (state.sort === "new") {
    works = works.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  return works;
}

function renderHome() {
  const featured = state.works[0];
  const works = getFilteredWorks();
  return `
    <section class="feed-layout">
      <aside class="sidebar surface">
        <div class="sidebar-title">分类</div>
        <div class="category-list">
          ${categories
            .map(
              ([id, label]) =>
                `<button type="button" data-category="${id}" class="${state.category === id ? "is-active" : ""}">${label}</button>`,
            )
            .join("")}
        </div>
      </aside>

      <div>
        <section class="spotlight surface">
          <div class="spotlight-copy">
            <div>
              <span class="section-kicker">今日精选</span>
              <h1 class="headline">oeeco</h1>
              <p class="lede">AI 创作者的作品广场。上传小游戏、网页工具、互动实验，让观众直接打开、试玩、收藏和关注。</p>
            </div>
            <div>
              <div class="action-row">
                <a class="solid-button" href="#upload">上传作品</a>
                <a class="ghost-button" href="#play/${featured.id}">试玩精选</a>
              </div>
              <div class="metric-strip">
                <div class="metric-box"><strong>12.6k</strong><span>本周试玩</span></div>
                <div class="metric-box"><strong>438</strong><span>创作者</span></div>
                <div class="metric-box"><strong>86</strong><span>新作品</span></div>
              </div>
            </div>
          </div>
          <a class="spotlight-visual" href="#work/${featured.id}">
            <img src="${featured.cover}" alt="${featured.title}" />
            <div class="spotlight-caption">
              <div>
                <strong>${featured.title}</strong>
                <span>${featured.summary}</span>
              </div>
              <span class="type-pill">${featured.type}</span>
            </div>
          </a>
        </section>

        <div class="filter-row">
          <div class="segmented" aria-label="排序">
            <button type="button" data-sort="featured" class="${state.sort === "featured" ? "is-active" : ""}">推荐</button>
            <button type="button" data-sort="hot" class="${state.sort === "hot" ? "is-active" : ""}">热门</button>
            <button type="button" data-sort="new" class="${state.sort === "new" ? "is-active" : ""}">最新</button>
          </div>
          <div class="result-count">${works.length} 个作品</div>
        </div>

        ${works.length ? `<section class="grid">${works.map(renderWorkCard).join("")}</section>` : renderEmpty("暂时没有匹配的作品")}
      </div>
    </section>
  `;
}

function renderWorkCard(work) {
  const creator = getCreator(work.creatorId);
  const tags = work.tags.map((tag) => `<span class="small-pill">${tag}</span>`).join("");
  return `
    <article class="work-card">
      <a class="cover-link" href="#work/${work.id}">
        <img class="work-cover" src="${work.cover}" alt="${work.title}" loading="lazy" />
        <span class="work-type">${work.type}</span>
      </a>
      <div class="work-card-body">
        <div class="work-title-row">
          <a class="work-title" href="#work/${work.id}">${work.title}</a>
          <button class="icon-button like-button" type="button" data-like="${work.id}" aria-label="喜欢">♡</button>
        </div>
        <a class="creator-line" href="#creator/${creator.id}">
          <img src="${creator.avatar}" alt="" />
          <span>${creator.handle}</span>
        </a>
        <div class="tag-row">${tags}</div>
        <div class="metric-row">
          <span>${formatNumber(work.views)} 浏览</span>
          <span>${formatNumber(work.likes)} 喜欢</span>
          <a class="play-link" href="#play/${work.id}">试玩</a>
        </div>
      </div>
    </article>
  `;
}

function renderWorkDetail(work) {
  const creator = getCreator(work.creatorId);
  return `
    <section class="detail-grid">
      <article class="surface detail-hero">
        <img src="${work.cover}" alt="${work.title}" />
        <div class="detail-body">
          <span class="section-kicker">${work.type}</span>
          <h1>${work.title}</h1>
          <a class="author-strip" href="#creator/${creator.id}">
            <img src="${creator.avatar}" alt="" />
            <span><strong>${creator.name}</strong><span>${creator.handle} · ${creator.followers} 关注者</span></span>
          </a>
          <p>${work.detail}</p>
          <div class="tag-row">${work.tags.map((tag) => `<span class="small-pill">${tag}</span>`).join("")}</div>
          <div class="detail-actions">
            <a class="solid-button" href="#play/${work.id}">立即体验</a>
            <button class="ghost-button" type="button" data-like="${work.id}">喜欢 ${formatNumber(work.likes)}</button>
            <button class="ghost-button" type="button" data-copy="${work.id}">分享</button>
          </div>
        </div>
      </article>

      <aside class="surface side-panel">
        <div>
          <span class="section-kicker">作品数据</span>
          <div class="stat-list">
            <div class="stat-item"><span>浏览</span><strong>${formatNumber(work.views)}</strong></div>
            <div class="stat-item"><span>喜欢</span><strong>${formatNumber(work.likes)}</strong></div>
            <div class="stat-item"><span>收藏</span><strong>${formatNumber(work.collections)}</strong></div>
            <div class="stat-item"><span>工具</span><strong>${work.tool}</strong></div>
            <div class="stat-item"><span>发布</span><strong>${work.createdAt}</strong></div>
          </div>
        </div>
        <div>
          <span class="section-kicker">评论</span>
          <div class="comment-list">
            ${work.comments.map(([name, avatar, text]) => `<div class="comment"><img src="${avatar}" alt="" /><div><strong>${name}</strong><p>${text}</p></div></div>`).join("")}
          </div>
        </div>
      </aside>
    </section>
  `;
}

function renderPlay(work) {
  return `
    <section class="play-page">
      <div class="play-top">
        <div>
          <span class="section-kicker">${work.type}</span>
          <h1 class="page-title">${work.title}</h1>
        </div>
        <div class="action-row">
          <a class="ghost-button" href="#work/${work.id}">详情</a>
          <a class="solid-button" href="#upload">上传作品</a>
        </div>
      </div>
      <div class="play-window">
        <iframe class="play-frame" title="${work.title} 试玩" sandbox="allow-scripts" srcdoc=""></iframe>
      </div>
    </section>
  `;
}

function renderUpload() {
  return `
    <section class="upload-shell surface">
      <form id="uploadForm" class="form-grid">
        <div>
          <span class="section-kicker">发布作品</span>
          <h1 class="page-title">上传到 oeeco</h1>
        </div>
        <div class="field">
          <label for="title">作品标题</label>
          <input id="title" name="title" required maxlength="36" placeholder="例如：星轨番茄钟" />
        </div>
        <div class="field">
          <label for="summary">一句话简介</label>
          <input id="summary" name="summary" required maxlength="80" placeholder="让观众快速知道它好玩在哪里" />
        </div>
        <div class="field">
          <label for="link">作品链接</label>
          <input id="link" name="link" type="url" placeholder="https://..." />
        </div>
        <div class="field">
          <label for="category">类型</label>
          <select id="category" name="category">
            <option value="game">小游戏</option>
            <option value="tool">实用工具</option>
            <option value="story">互动网页</option>
            <option value="visual">视觉艺术</option>
            <option value="ai">AI 实验</option>
          </select>
        </div>
        <div class="field">
          <label for="tags">标签</label>
          <input id="tags" name="tags" placeholder="Codex, Canvas, 休闲" />
        </div>
        <div class="field">
          <label for="detail">创作说明</label>
          <textarea id="detail" name="detail" placeholder="可以写用了哪些工具、怎么做出来的、适合谁体验"></textarea>
        </div>
        <div class="form-actions">
          <button class="solid-button" type="submit">发布预览</button>
          <button class="ghost-button" type="reset">重填</button>
        </div>
      </form>

      <aside class="preview-card">
        <img src="./assets/cover-upload.png" alt="上传预览" />
        <div>
          <span class="section-kicker">预览卡片</span>
          <h2 id="previewTitle">你的作品会出现在这里</h2>
          <p id="previewSummary">封面、标题、简介、标签和试玩入口会组成 oeeco 的作品卡片。</p>
          <div id="previewTags" class="tag-row">
            <span class="small-pill">Codex</span>
            <span class="small-pill">新作品</span>
          </div>
        </div>
      </aside>
    </section>
  `;
}

function renderCreator(id) {
  const creator = getCreator(id);
  const works = state.works.filter((work) => work.creatorId === creator.id);
  return `
    <section class="creator-header surface">
      <div class="creator-card"><img src="${creator.avatar}" alt="${creator.name}" /></div>
      <div class="creator-copy">
        <span class="section-kicker">${creator.handle}</span>
        <h1>${creator.name}</h1>
        <p>${creator.bio}</p>
        <div class="metric-strip">
          <div class="metric-box"><strong>${creator.followers}</strong><span>关注者</span></div>
          <div class="metric-box"><strong>${works.length}</strong><span>作品</span></div>
          <div class="metric-box"><strong>${formatNumber(works.reduce((sum, work) => sum + work.likes, 0))}</strong><span>喜欢</span></div>
        </div>
      </div>
      <button class="solid-button" type="button" data-follow="${creator.id}">关注</button>
    </section>
    ${works.length ? `<section class="grid">${works.map(renderWorkCard).join("")}</section>` : renderEmpty("这个创作者还没有公开作品")}
  `;
}

function renderRank() {
  const topWorks = [...state.works].sort((a, b) => b.likes - a.likes).slice(0, 8);
  return `
    <section class="leaderboard surface">
      <div>
        <span class="section-kicker">热门榜单</span>
        <h1 class="page-title">本周被喜欢最多的作品</h1>
      </div>
      ${topWorks
        .map((work, index) => {
          const creator = getCreator(work.creatorId);
          return `<div class="leader-row">
            <span class="rank-number">${String(index + 1).padStart(2, "0")}</span>
            <img src="${creator.avatar}" alt="" />
            <div><strong>${work.title}</strong><span>${creator.handle} · ${formatNumber(work.likes)} 喜欢 · ${work.type}</span></div>
            <a class="play-link" href="#play/${work.id}">试玩</a>
          </div>`;
        })
        .join("")}
    </section>
  `;
}

function renderEmpty(text) {
  return `<section class="empty-state surface"><h1 class="page-title">${text}</h1><p>回到广场看看其他作品。</p><a class="solid-button" href="#home">回到广场</a></section>`;
}

function hydrateHome() {
  document.querySelectorAll("[data-category]").forEach((button) => {
    button.addEventListener("click", () => {
      state.category = button.getAttribute("data-category");
      render();
    });
  });

  document.querySelectorAll("[data-sort]").forEach((button) => {
    button.addEventListener("click", () => {
      state.sort = button.getAttribute("data-sort");
      render();
    });
  });
}

function hydrateUploadForm() {
  const form = document.querySelector("#uploadForm");
  const title = document.querySelector("#title");
  const summary = document.querySelector("#summary");
  const tags = document.querySelector("#tags");
  const previewTitle = document.querySelector("#previewTitle");
  const previewSummary = document.querySelector("#previewSummary");
  const previewTags = document.querySelector("#previewTags");

  const updatePreview = () => {
    previewTitle.textContent = title.value || "你的作品会出现在这里";
    previewSummary.textContent =
      summary.value || "封面、标题、简介、标签和试玩入口会组成 oeeco 的作品卡片。";
    const tagList = parseTags(tags.value);
    previewTags.innerHTML = (tagList.length ? tagList : ["Codex", "新作品"])
      .map((tag) => `<span class="small-pill">${tag}</span>`)
      .join("");
  };

  [title, summary, tags].forEach((input) => input.addEventListener("input", updatePreview));

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const category = data.get("category");
    const titleValue = data.get("title").toString().trim();
    const work = {
      id: `user-${Date.now()}`,
      title: titleValue,
      type: categoryLabel(category),
      category,
      creatorId: "neo",
      cover: "./assets/cover-upload.png",
      tags: parseTags(data.get("tags").toString()),
      views: 0,
      likes: 0,
      collections: 0,
      tool: "Codex",
      createdAt: new Date().toISOString().slice(0, 10),
      summary: data.get("summary").toString().trim(),
      detail: data.get("detail").toString().trim() || "这个作品刚刚发布，创作者还在补充更多说明。",
      comments: [["oeeco", "./assets/avatar-neo.png", "新作品已经进入本地预览列表。"]],
      frame: "upload",
    };
    saveUserWork(work);
    showToast("作品已加入本地预览列表");
    window.location.hash = `work/${work.id}`;
  });
}

function hydratePlayFrame(work) {
  const iframe = document.querySelector(".play-frame");
  if (!iframe || !work) return;
  iframe.setAttribute("srcdoc", getFrameHtml(work.frame, work.title));
}

function handleGlobalClick(event) {
  const likeButton = event.target.closest("[data-like]");
  if (likeButton) {
    showToast("已喜欢这个作品");
    likeButton.textContent = "♥";
  }

  const copyButton = event.target.closest("[data-copy]");
  if (copyButton) {
    const id = copyButton.getAttribute("data-copy");
    navigator.clipboard?.writeText(`${location.origin}${location.pathname}#work/${id}`);
    showToast("分享链接已复制");
  }

  const followButton = event.target.closest("[data-follow]");
  if (followButton) {
    followButton.textContent = "已关注";
    showToast("已关注创作者");
  }
}

function showToast(text) {
  document.querySelector(".toast")?.remove();
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = text;
  document.body.appendChild(toast);
  window.setTimeout(() => toast.remove(), 2200);
}

function parseTags(value) {
  return value
    .split(/[,，\s]+/)
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 5);
}

function categoryLabel(category) {
  const found = categories.find(([id]) => id === category);
  return found ? found[1] : "新作品";
}

function formatNumber(value) {
  if (value >= 10000) return `${(value / 10000).toFixed(1)}万`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return String(value);
}

function getFrameHtml(kind, title) {
  const sharedStyle = `
    <style>
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        color: #f7fff9;
        font-family: Inter, "Microsoft YaHei", system-ui, sans-serif;
        background: #101b17;
      }
      .stage {
        display: grid;
        min-height: 100vh;
        place-items: center;
        padding: 28px;
      }
      .panel {
        width: min(860px, 100%);
        border: 1px solid rgba(255,255,255,.18);
        border-radius: 8px;
        background: rgba(255,255,255,.08);
        padding: 24px;
        box-shadow: 0 24px 80px rgba(0,0,0,.28);
      }
      h1 { margin: 0 0 10px; font-size: clamp(30px, 6vw, 64px); letter-spacing: 0; }
      p { color: rgba(255,255,255,.72); line-height: 1.7; }
      button {
        min-height: 42px;
        border: 1px solid #fff;
        border-radius: 8px;
        background: #55d6a8;
        color: #101b17;
        padding: 0 16px;
        font-weight: 900;
      }
    </style>
  `;

  const frames = {
    fishing: `
      ${sharedStyle}<div class="stage"><div class="panel">
        <h1>${title}</h1><p id="score">已经钓到 0 条鱼</p>
        <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:8px;margin:22px 0;">
          ${Array.from({ length: 28 }, (_, index) => `<button onclick="catchFish(${index})" style="height:56px;background:${index % 5 === 0 ? "#f4b43f" : "#1b3b31"};color:#fff;">${index % 5 === 0 ? "鱼" : "水"}</button>`).join("")}
        </div>
        <button onclick="resetGame()">重新开始</button>
        <script>let score=0;function catchFish(i){if(i%5===0){score++;document.getElementById('score').textContent='已经钓到 '+score+' 条鱼'}}function resetGame(){score=0;document.getElementById('score').textContent='已经钓到 0 条鱼'}<\/script>
      </div></div>`,
    crm: `
      ${sharedStyle}<div class="stage"><div class="panel">
        <h1>${title}</h1><p>今日客户推进</p>
        ${["新询盘", "已报价", "设计中", "待回款"].map((item, index) => `<div style="display:flex;justify-content:space-between;align-items:center;margin:10px 0;padding:14px;border:1px solid rgba(255,255,255,.14);border-radius:8px;"><strong>${item}</strong><span>${[8, 5, 3, 2][index]} 项</span></div>`).join("")}
      </div></div>`,
    story: `
      ${sharedStyle}<div class="stage"><div class="panel">
        <h1>${title}</h1><p id="line">房间很安静。点亮一件物品。</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:22px;">
          <button onclick="line('台灯亮起，墙上出现一张旧地图。')">台灯</button>
          <button onclick="line('抽屉里有一张没有寄出的明信片。')">抽屉</button>
          <button onclick="line('窗外的雨声忽然变成了海浪。')">窗户</button>
        </div>
        <script>function line(t){document.getElementById('line').textContent=t}<\/script>
      </div></div>`,
    garden: `
      ${sharedStyle}<div class="stage"><div class="panel">
        <h1>${title}</h1><p>每一株植物代表一个作品热度。</p>
        <div style="display:flex;align-items:end;gap:12px;height:260px;margin-top:24px;">
          ${[42, 78, 124, 96, 168, 132, 210, 118, 152].map((height, index) => `<div title="作品 ${index + 1}" style="width:100%;height:${height}px;background:${index % 3 === 0 ? "#55d6a8" : index % 3 === 1 ? "#3577f0" : "#f45d8f"};border-radius:8px 8px 0 0;"></div>`).join("")}
        </div>
      </div></div>`,
    kitchen: `
      ${sharedStyle}<div class="stage"><div class="panel">
        <h1>${title}</h1><p id="prompt">选择一张菜谱卡片。</p>
        <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:22px;">
          ${["生成游戏机制", "优化上传表单", "写作品介绍"].map((item) => `<button onclick="document.getElementById('prompt').textContent='已选择：${item}'">${item}</button>`).join("")}
        </div>
      </div></div>`,
    clock: `
      ${sharedStyle}<div class="stage"><div class="panel" style="text-align:center;">
        <h1>${title}</h1><p id="timer">25:00</p>
        <div style="width:210px;height:210px;border:18px solid #55d6a8;border-top-color:#f45d8f;border-radius:50%;margin:24px auto;animation:spin 8s linear infinite;"></div>
        <button onclick="document.getElementById('timer').textContent='24:59'">开始</button>
        <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
      </div></div>`,
    upload: `
      ${sharedStyle}<div class="stage"><div class="panel">
        <h1>${title}</h1><p>这是你刚刚发布的本地预览作品。后续接入 Supabase 后，它会进入真实审核和作品流。</p>
        <button onclick="document.body.style.background='#163d33'">点亮预览</button>
      </div></div>`,
  };

  return frames[kind] || frames.upload;
}
