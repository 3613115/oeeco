import type { Work } from "@/lib/data";

export function getPlayPreviewHtml(work: Work) {
  const sharedStyle = `
    <style>
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        color: #f7fff9;
        font-family: Inter, system-ui, sans-serif;
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
        <h1>${work.title}</h1><p id="score">Caught 0 fish</p>
        <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:8px;margin:22px 0;">
          ${Array.from({ length: 28 }, (_, index) => `<button onclick="catchFish(${index})" style="height:56px;background:${index % 5 === 0 ? "#f4b43f" : "#1b3b31"};color:#fff;">${index % 5 === 0 ? "Fish" : "Water"}</button>`).join("")}
        </div>
        <button onclick="resetGame()">Restart</button>
        <script>let score=0;function catchFish(i){if(i%5===0){score++;document.getElementById('score').textContent='Caught '+score+' fish'}}function resetGame(){score=0;document.getElementById('score').textContent='Caught 0 fish'}<\/script>
      </div></div>`,
    crm: `
      ${sharedStyle}<div class="stage"><div class="panel">
        <h1>${work.title}</h1><p>Today&apos;s client pipeline</p>
        ${["New leads", "Quoted", "In design", "Awaiting payment"].map((item, index) => `<div style="display:flex;justify-content:space-between;align-items:center;margin:10px 0;padding:14px;border:1px solid rgba(255,255,255,.14);border-radius:8px;"><strong>${item}</strong><span>${[8, 5, 3, 2][index]} items</span></div>`).join("")}
      </div></div>`,
    story: `
      ${sharedStyle}<div class="stage"><div class="panel">
        <h1>${work.title}</h1><p id="line">The room is quiet. Light up an object.</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:22px;">
          <button onclick="line('The lamp turns on and an old map appears on the wall.')">Lamp</button>
          <button onclick="line('Inside the drawer is a postcard that was never sent.')">Drawer</button>
          <button onclick="line('The rain outside suddenly begins to sound like waves.')">Window</button>
        </div>
        <script>function line(t){document.getElementById('line').textContent=t}<\/script>
      </div></div>`,
    garden: `
      ${sharedStyle}<div class="stage"><div class="panel">
        <h1>${work.title}</h1><p>Each plant represents the momentum of a work.</p>
        <div style="display:flex;align-items:end;gap:12px;height:260px;margin-top:24px;">
          ${[42, 78, 124, 96, 168, 132, 210, 118, 152].map((height, index) => `<div title="Work ${index + 1}" style="width:100%;height:${height}px;background:${index % 3 === 0 ? "#55d6a8" : index % 3 === 1 ? "#3577f0" : "#f45d8f"};border-radius:8px 8px 0 0;"></div>`).join("")}
        </div>
      </div></div>`,
    kitchen: `
      ${sharedStyle}<div class="stage"><div class="panel">
        <h1>${work.title}</h1><p id="prompt">Choose a recipe card.</p>
        <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:22px;">
          ${["Generate game mechanics", "Improve upload flow", "Write work copy"].map((item) => `<button onclick="document.getElementById('prompt').textContent='Selected: ${item}'">${item}</button>`).join("")}
        </div>
      </div></div>`,
    clock: `
      ${sharedStyle}<div class="stage"><div class="panel" style="text-align:center;">
        <h1>${work.title}</h1><p id="timer">25:00</p>
        <div style="width:210px;height:210px;border:18px solid #55d6a8;border-top-color:#f45d8f;border-radius:50%;margin:24px auto;animation:spin 8s linear infinite;"></div>
        <button onclick="document.getElementById('timer').textContent='24:59'">Start</button>
        <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
      </div></div>`,
    upload: `
      ${sharedStyle}<div class="stage"><div class="panel">
        <h1>${work.title}</h1><p>${work.summary}</p>
        <p>This work is published on oeeco. A real creator page, game, or tool can be embedded here.</p>
        <button onclick="document.body.style.background='#163d33'">Light up oeeco preview</button>
      </div></div>`,
  };

  return frames[work.frame];
}
