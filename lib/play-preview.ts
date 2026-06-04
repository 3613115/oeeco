import type { Work } from "@/lib/data";

export function getPlayPreviewHtml(work: Work) {
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

  const frames: Record<Work["frame"], string> = {
    fishing: `
      ${sharedStyle}<div class="stage"><div class="panel">
        <h1>${work.title}</h1><p id="score">已经钓到 0 条鱼</p>
        <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:8px;margin:22px 0;">
          ${Array.from({ length: 28 }, (_, index) => `<button onclick="catchFish(${index})" style="height:56px;background:${index % 5 === 0 ? "#f4b43f" : "#1b3b31"};color:#fff;">${index % 5 === 0 ? "鱼" : "水"}</button>`).join("")}
        </div>
        <button onclick="resetGame()">重新开始</button>
        <script>let score=0;function catchFish(i){if(i%5===0){score++;document.getElementById('score').textContent='已经钓到 '+score+' 条鱼'}}function resetGame(){score=0;document.getElementById('score').textContent='已经钓到 0 条鱼'}<\/script>
      </div></div>`,
    crm: `
      ${sharedStyle}<div class="stage"><div class="panel">
        <h1>${work.title}</h1><p>今日客户推进</p>
        ${["新询盘", "已报价", "设计中", "待回款"].map((item, index) => `<div style="display:flex;justify-content:space-between;align-items:center;margin:10px 0;padding:14px;border:1px solid rgba(255,255,255,.14);border-radius:8px;"><strong>${item}</strong><span>${[8, 5, 3, 2][index]} 项</span></div>`).join("")}
      </div></div>`,
    story: `
      ${sharedStyle}<div class="stage"><div class="panel">
        <h1>${work.title}</h1><p id="line">房间很安静。点亮一件物品。</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:22px;">
          <button onclick="line('台灯亮起，墙上出现一张旧地图。')">台灯</button>
          <button onclick="line('抽屉里有一张没有寄出的明信片。')">抽屉</button>
          <button onclick="line('窗外的雨声忽然变成了海浪。')">窗户</button>
        </div>
        <script>function line(t){document.getElementById('line').textContent=t}<\/script>
      </div></div>`,
    garden: `
      ${sharedStyle}<div class="stage"><div class="panel">
        <h1>${work.title}</h1><p>每一株植物代表一个作品热度。</p>
        <div style="display:flex;align-items:end;gap:12px;height:260px;margin-top:24px;">
          ${[42, 78, 124, 96, 168, 132, 210, 118, 152].map((height, index) => `<div title="作品 ${index + 1}" style="width:100%;height:${height}px;background:${index % 3 === 0 ? "#55d6a8" : index % 3 === 1 ? "#3577f0" : "#f45d8f"};border-radius:8px 8px 0 0;"></div>`).join("")}
        </div>
      </div></div>`,
    kitchen: `
      ${sharedStyle}<div class="stage"><div class="panel">
        <h1>${work.title}</h1><p id="prompt">选择一张菜谱卡片。</p>
        <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:22px;">
          ${["生成游戏机制", "优化上传表单", "写作品介绍"].map((item) => `<button onclick="document.getElementById('prompt').textContent='已选择：${item}'">${item}</button>`).join("")}
        </div>
      </div></div>`,
    clock: `
      ${sharedStyle}<div class="stage"><div class="panel" style="text-align:center;">
        <h1>${work.title}</h1><p id="timer">25:00</p>
        <div style="width:210px;height:210px;border:18px solid #55d6a8;border-top-color:#f45d8f;border-radius:50%;margin:24px auto;animation:spin 8s linear infinite;"></div>
        <button onclick="document.getElementById('timer').textContent='24:59'">开始</button>
        <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
      </div></div>`,
  };

  return frames[work.frame];
}
