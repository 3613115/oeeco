"use client";

import { Download, RefreshCw, Sparkles, Wand2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type PaletteKey = "cyber" | "sunset" | "mint" | "mono";
type LayoutKey = "center" | "split" | "stack";

type Spark = {
  x: number;
  y: number;
  size: number;
  color: string;
  alpha: number;
};

const palettes: Array<{
  key: PaletteKey;
  label: string;
  colors: [string, string, string, string];
  background: [string, string];
}> = [
  {
    key: "cyber",
    label: "Cyber",
    colors: ["#55d6a8", "#3577f0", "#f45d8f", "#ffffff"],
    background: ["#101819", "#17394a"],
  },
  {
    key: "sunset",
    label: "Sunset",
    colors: ["#f4b43f", "#f45d8f", "#ffffff", "#55d6a8"],
    background: ["#25151d", "#5b263b"],
  },
  {
    key: "mint",
    label: "Mint",
    colors: ["#55d6a8", "#ffffff", "#a9f5d4", "#18201d"],
    background: ["#0f241d", "#2c6b58"],
  },
  {
    key: "mono",
    label: "Mono",
    colors: ["#ffffff", "#dbe3dc", "#55d6a8", "#18201d"],
    background: ["#121514", "#303833"],
  },
];

const layouts: Array<{ key: LayoutKey; label: string; helper: string }> = [
  { key: "center", label: "Center", helper: "Large title with clean symmetry." },
  { key: "split", label: "Split", helper: "Editorial title with side code." },
  { key: "stack", label: "Stack", helper: "Dense poster with layered text." },
];

function seededRandom(seed: number) {
  let value = seed % 2147483647;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function drawRoundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  const nextRadius = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + nextRadius, y);
  ctx.lineTo(x + width - nextRadius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + nextRadius);
  ctx.lineTo(x + width, y + height - nextRadius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - nextRadius, y + height);
  ctx.lineTo(x + nextRadius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - nextRadius);
  ctx.lineTo(x, y + nextRadius);
  ctx.quadraticCurveTo(x, y, x + nextRadius, y);
  ctx.closePath();
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && current) {
      lines.push(current);
      current = word;
      return;
    }
    current = next;
  });

  if (current) lines.push(current);
  return lines.length ? lines : ["NEON POSTER"];
}

export function NeonPosterMaker() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [title, setTitle] = useState("MAKE IT GLOW");
  const [subtitle, setSubtitle] = useState("A fast poster tool for small launches, demos, and creator experiments.");
  const [paletteKey, setPaletteKey] = useState<PaletteKey>("cyber");
  const [layoutKey, setLayoutKey] = useState<LayoutKey>("center");
  const [glow, setGlow] = useState(72);
  const [seed, setSeed] = useState(418);
  const [status, setStatus] = useState("Poster ready");

  const palette = palettes.find((item) => item.key === paletteKey) ?? palettes[0];
  const layout = layouts.find((item) => item.key === layoutKey) ?? layouts[0];

  const sparks = useMemo(() => {
    const random = seededRandom(seed + palette.label.length * 37 + layout.label.length * 19);
    return Array.from({ length: 36 + Math.round(glow / 4) }, (): Spark => {
      const color = palette.colors[Math.floor(random() * palette.colors.length)];
      return {
        x: random(),
        y: random(),
        size: 1 + random() * 5,
        color,
        alpha: 0.18 + random() * 0.7,
      };
    });
  }, [glow, layout.label.length, palette.colors, palette.label.length, seed]);

  const posterSignature = useMemo(() => {
    const code = Math.abs(seed * 17 + title.length * 13 + subtitle.length * 7)
      .toString(16)
      .slice(0, 6)
      .toUpperCase();
    return `OE-${code}`;
  }, [seed, subtitle.length, title.length]);

  const drawPoster = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const [bgA, bgB] = palette.background;
    const [primary, secondary, accent, light] = palette.colors;
    const glowBlur = 8 + glow * 0.34;
    const gradient = ctx.createLinearGradient(0, 0, width, height);

    gradient.addColorStop(0, bgA);
    gradient.addColorStop(1, bgB);
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = 0.42;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
    ctx.lineWidth = 1;
    const grid = 56;
    for (let x = -grid; x < width + grid; x += grid) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + height * 0.18, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += grid) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    sparks.forEach((spark) => {
      const x = spark.x * width;
      const y = spark.y * height;
      ctx.globalAlpha = spark.alpha;
      ctx.shadowColor = spark.color;
      ctx.shadowBlur = glowBlur;
      ctx.fillStyle = spark.color;
      ctx.beginPath();
      ctx.arc(x, y, spark.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    ctx.strokeStyle = primary;
    ctx.lineWidth = 4;
    ctx.shadowColor = primary;
    ctx.shadowBlur = glowBlur;
    drawRoundRect(ctx, 34, 34, width - 68, height - 68, 28);
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
    drawRoundRect(ctx, 58, 58, width - 116, height - 116, 22);
    ctx.fill();

    const safeTitle = title.trim() || "MAKE IT GLOW";
    const safeSubtitle = subtitle.trim() || "A small poster, generated instantly.";
    const titleSize = layout.key === "stack" ? 72 : 82;
    ctx.textAlign = layout.key === "split" ? "left" : "center";
    ctx.textBaseline = "alphabetic";
    ctx.font = `900 ${titleSize}px Inter, sans-serif`;
    const maxTitleWidth = layout.key === "split" ? width * 0.58 : width * 0.78;
    const lines = wrapText(ctx, safeTitle.toUpperCase(), maxTitleWidth).slice(0, 4);
    const startX = layout.key === "split" ? 86 : width / 2;
    const startY = layout.key === "stack" ? height * 0.26 : height * 0.38;

    lines.forEach((line, index) => {
      const y = startY + index * (titleSize * 0.92);
      ctx.shadowColor = index % 2 ? secondary : primary;
      ctx.shadowBlur = glowBlur + 12;
      ctx.fillStyle = index % 2 ? secondary : light;
      ctx.fillText(line, startX, y);
      ctx.shadowBlur = 0;
      ctx.strokeStyle = index % 2 ? light : primary;
      ctx.lineWidth = 1.4;
      ctx.strokeText(line, startX, y);
    });

    ctx.textAlign = layout.key === "split" ? "left" : "center";
    ctx.font = "760 24px Inter, sans-serif";
    ctx.fillStyle = light;
    ctx.shadowColor = accent;
    ctx.shadowBlur = glowBlur * 0.5;
    const subLines = wrapText(ctx, safeSubtitle, layout.key === "split" ? width * 0.5 : width * 0.72).slice(0, 3);
    subLines.forEach((line, index) => {
      ctx.fillText(line, startX, height * 0.62 + index * 34);
    });
    ctx.shadowBlur = 0;

    if (layout.key === "split") {
      ctx.textAlign = "right";
      ctx.font = "900 38px Inter, sans-serif";
      ctx.fillStyle = primary;
      ctx.shadowColor = primary;
      ctx.shadowBlur = glowBlur;
      ctx.fillText("POSTER", width - 86, height * 0.3);
      ctx.fillText("MAKER", width - 86, height * 0.36);
      ctx.shadowBlur = 0;
      ctx.strokeStyle = secondary;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(width - 260, height * 0.44);
      ctx.lineTo(width - 86, height * 0.44);
      ctx.stroke();
    }

    if (layout.key === "stack") {
      ctx.textAlign = "center";
      ctx.font = "900 22px Inter, sans-serif";
      for (let row = 0; row < 5; row += 1) {
        ctx.globalAlpha = 0.2 + row * 0.1;
        ctx.fillStyle = row % 2 ? secondary : primary;
        ctx.fillText(safeTitle.toUpperCase().slice(0, 24), width / 2, height * 0.74 + row * 28);
      }
      ctx.globalAlpha = 1;
    }

    ctx.textAlign = "left";
    ctx.font = "900 15px Inter, sans-serif";
    ctx.fillStyle = primary;
    ctx.fillText(posterSignature, 78, height - 78);
    ctx.textAlign = "right";
    ctx.fillStyle = light;
    ctx.fillText(`${palette.label.toUpperCase()} / ${layout.label.toUpperCase()}`, width - 78, height - 78);
  }, [glow, layout, palette, posterSignature, sparks, subtitle, title]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;
    const rect = stage.getBoundingClientRect();
    canvas.width = Math.max(360, Math.floor(rect.width));
    canvas.height = Math.max(520, Math.floor(rect.height));
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    drawPoster();
  }, [drawPoster]);

  const refreshPoster = () => {
    setSeed((current) => current + 101 + Math.round(Math.random() * 600));
    setStatus("Poster remixed");
  };

  const downloadPoster = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `oeeco-neon-poster-${posterSignature.toLowerCase()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    setStatus("Poster PNG downloaded");
  };

  useEffect(() => {
    resizeCanvas();
    const handleResize = () => resizeCanvas();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [resizeCanvas]);

  useEffect(() => {
    drawPoster();
  }, [drawPoster]);

  return (
    <section className="neon-poster-shell" aria-label="Neon Poster Maker">
      <div className="neon-poster-hero">
        <div className="neon-poster-copy">
          <span className="section-kicker">
            <Wand2 size={15} aria-hidden="true" />
            Downloadable poster tool
          </span>
          <h1>Neon Poster Maker</h1>
          <p>
            Type a headline, pick a neon system, and export a glowing launch poster for demos, social posts, or tiny
            product announcements.
          </p>
        </div>

        <div className="neon-poster-status">
          <span>{posterSignature}</span>
          <strong>{status}</strong>
          <small>
            {palette.label} / {layout.label} / {glow}% glow
          </small>
        </div>
      </div>

      <div className="neon-poster-workbench">
        <div className="neon-poster-controls" aria-label="Poster controls">
          <label className="neon-field">
            <span>Headline</span>
            <input value={title} maxLength={54} onChange={(event) => setTitle(event.target.value)} />
          </label>

          <label className="neon-field">
            <span>Subtitle</span>
            <textarea value={subtitle} rows={4} maxLength={150} onChange={(event) => setSubtitle(event.target.value)} />
          </label>

          <div className="neon-option-group">
            <span>Palette</span>
            <div>
              {palettes.map((item) => (
                <button
                  className={item.key === palette.key ? "is-active" : ""}
                  key={item.key}
                  type="button"
                  onClick={() => {
                    setPaletteKey(item.key);
                    setStatus(`${item.label} palette applied`);
                  }}
                >
                  <span>{item.label}</span>
                  <i style={{ background: `linear-gradient(90deg, ${item.colors[0]}, ${item.colors[1]}, ${item.colors[2]})` }} />
                </button>
              ))}
            </div>
          </div>

          <div className="neon-option-group">
            <span>Layout</span>
            <div>
              {layouts.map((item) => (
                <button
                  className={item.key === layout.key ? "is-active" : ""}
                  key={item.key}
                  type="button"
                  onClick={() => {
                    setLayoutKey(item.key);
                    setStatus(`${item.label} layout applied`);
                  }}
                >
                  <strong>{item.label}</strong>
                  <small>{item.helper}</small>
                </button>
              ))}
            </div>
          </div>

          <label className="neon-slider">
            <span>
              Glow strength <strong>{glow}%</strong>
            </span>
            <input min="20" max="100" type="range" value={glow} onChange={(event) => setGlow(Number(event.target.value))} />
          </label>

          <div className="neon-poster-actions">
            <button className="ghost-button" type="button" onClick={refreshPoster}>
              <RefreshCw size={17} aria-hidden="true" />
              Remix
            </button>
            <button className="solid-button" type="button" onClick={downloadPoster}>
              <Download size={17} aria-hidden="true" />
              Save PNG
            </button>
          </div>
        </div>

        <div className="neon-poster-stage" ref={stageRef}>
          <canvas ref={canvasRef} aria-label="Generated neon poster preview" role="img" />
          <div className="neon-poster-hint">
            <Sparkles size={15} aria-hidden="true" />
            Live canvas preview
          </div>
        </div>
      </div>
    </section>
  );
}
