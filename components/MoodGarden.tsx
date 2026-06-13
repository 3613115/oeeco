"use client";

import { Download, Flower2, RefreshCw, Sparkles } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type MoodKey = "calm" | "bright" | "focus" | "brave" | "dream";

type Plant = {
  x: number;
  y: number;
  height: number;
  sway: number;
  petals: number;
  size: number;
  delay: number;
  colorIndex: number;
};

type Firefly = {
  x: number;
  y: number;
  radius: number;
  speed: number;
  delay: number;
};

type Mood = {
  key: MoodKey;
  label: string;
  helper: string;
  soil: string;
  sky: [string, string, string];
  colors: string[];
  accent: string;
  ink: string;
};

const moods: Mood[] = [
  {
    key: "calm",
    label: "Calm",
    helper: "Soft greens, slow motion, quiet breathing.",
    soil: "#dff4e7",
    sky: ["#effff8", "#b9efd8", "#76d8b2"],
    colors: ["#55d6a8", "#ffffff", "#8bd9ff", "#b6f2ce"],
    accent: "#0c7a55",
    ink: "#18201d",
  },
  {
    key: "bright",
    label: "Bright",
    helper: "Warm petals, cheerful pace, morning light.",
    soil: "#fff1c5",
    sky: ["#fff9df", "#ffd987", "#f45d8f"],
    colors: ["#f4b43f", "#f45d8f", "#ffffff", "#55d6a8"],
    accent: "#b05b00",
    ink: "#251a12",
  },
  {
    key: "focus",
    label: "Focus",
    helper: "Clean blue lanes, fewer distractions.",
    soil: "#e7eefc",
    sky: ["#f4f9ff", "#b8d4ff", "#3577f0"],
    colors: ["#3577f0", "#ffffff", "#55d6a8", "#9bbcff"],
    accent: "#1f54b8",
    ink: "#162033",
  },
  {
    key: "brave",
    label: "Brave",
    helper: "High contrast blooms with sharper movement.",
    soil: "#f7e3e8",
    sky: ["#fff6f7", "#ffb5c9", "#18201d"],
    colors: ["#f45d8f", "#f4b43f", "#ffffff", "#18201d"],
    accent: "#b52254",
    ink: "#18201d",
  },
  {
    key: "dream",
    label: "Dream",
    helper: "Floating light, layered petals, late-night glow.",
    soil: "#e9e8ff",
    sky: ["#f6f5ff", "#c9c3ff", "#6b7dff"],
    colors: ["#8d7dff", "#ffffff", "#55d6a8", "#f45d8f"],
    accent: "#5746bd",
    ink: "#1e1b32",
  },
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

export function MoodGarden() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const [moodKey, setMoodKey] = useState<MoodKey>("calm");
  const [density, setDensity] = useState(64);
  const [bloom, setBloom] = useState(58);
  const [seed, setSeed] = useState(1327);
  const [status, setStatus] = useState("Calm garden ready");

  const mood = useMemo(() => moods.find((item) => item.key === moodKey) ?? moods[0], [moodKey]);

  const garden = useMemo(() => {
    const random = seededRandom(seed + density * 17 + bloom * 29 + mood.key.length * 101);
    const plantCount = Math.round(18 + density * 0.54);
    const fireflyCount = Math.round(4 + bloom * 0.12);
    const plants: Plant[] = Array.from({ length: plantCount }, (_, index) => ({
      x: 0.05 + random() * 0.9,
      y: 0.46 + random() * 0.44,
      height: 48 + random() * (98 + density * 0.45),
      sway: 0.4 + random() * 1.8,
      petals: 5 + Math.floor(random() * 4),
      size: 8 + random() * (18 + bloom * 0.16),
      delay: random() * Math.PI * 2,
      colorIndex: index % mood.colors.length,
    }));
    const fireflies: Firefly[] = Array.from({ length: fireflyCount }, () => ({
      x: random(),
      y: 0.08 + random() * 0.48,
      radius: 2 + random() * 4,
      speed: 0.18 + random() * 0.38,
      delay: random() * Math.PI * 2,
    }));
    return { fireflies, plants };
  }, [bloom, density, mood.colors.length, mood.key.length, seed]);

  const drawGarden = useCallback(
    (time = 0) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      const groundY = height * 0.78;
      const breath = Math.sin(time / 1300) * 0.5 + 0.5;
      const wind = 0.8 + density / 140;
      const gradient = ctx.createLinearGradient(0, 0, 0, height);

      gradient.addColorStop(0, mood.sky[0]);
      gradient.addColorStop(0.58, mood.sky[1]);
      gradient.addColorStop(1, mood.sky[2]);
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      ctx.globalAlpha = 0.2 + bloom / 260;
      ctx.fillStyle = "#ffffff";
      for (let index = 0; index < 10; index += 1) {
        const cloudX = ((index * 143 + time * 0.012) % (width + 180)) - 90;
        const cloudY = 42 + ((index * 53) % Math.max(70, height * 0.34));
        drawRoundRect(ctx, cloudX, cloudY, 86 + (index % 3) * 34, 20 + (index % 2) * 12, 14);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      const sunX = width * (0.16 + bloom / 280);
      const sunY = height * 0.18;
      const sunRadius = 34 + bloom * 0.32;
      const sunGradient = ctx.createRadialGradient(sunX, sunY, 5, sunX, sunY, sunRadius);
      sunGradient.addColorStop(0, "rgba(255, 255, 255, 0.95)");
      sunGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = sunGradient;
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = mood.soil;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.bezierCurveTo(width * 0.24, groundY - 38, width * 0.48, groundY + 42, width, groundY - 20);
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = "rgba(24, 32, 29, 0.12)";
      ctx.lineWidth = 2;
      for (let index = 0; index < 9; index += 1) {
        const y = groundY + 16 + index * 19;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.bezierCurveTo(width * 0.32, y - 18, width * 0.62, y + 18, width, y - 8);
        ctx.stroke();
      }

      garden.plants
        .slice()
        .sort((first, second) => first.y - second.y)
        .forEach((plant) => {
          const baseX = plant.x * width;
          const baseY = plant.y * height;
          const sway = Math.sin(time / 820 + plant.delay) * plant.sway * wind;
          const tipX = baseX + sway * 13;
          const tipY = baseY - plant.height * (0.74 + bloom / 500);
          const color = mood.colors[plant.colorIndex];

          ctx.strokeStyle = mood.accent;
          ctx.lineWidth = Math.max(2, plant.size / 7);
          ctx.beginPath();
          ctx.moveTo(baseX, baseY);
          ctx.bezierCurveTo(baseX + sway * 7, baseY - plant.height * 0.34, tipX - 10, baseY - plant.height * 0.62, tipX, tipY);
          ctx.stroke();

          ctx.fillStyle = "rgba(255, 255, 255, 0.38)";
          ctx.beginPath();
          ctx.ellipse(baseX - 10 - sway, baseY - plant.height * 0.34, plant.size * 0.72, plant.size * 0.28, -0.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.ellipse(baseX + 12 + sway, baseY - plant.height * 0.48, plant.size * 0.68, plant.size * 0.26, 0.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.save();
          ctx.translate(tipX, tipY);
          ctx.rotate(Math.sin(time / 950 + plant.delay) * 0.13);
          for (let petal = 0; petal < plant.petals; petal += 1) {
            const angle = (Math.PI * 2 * petal) / plant.petals;
            ctx.rotate(angle);
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.ellipse(0, -plant.size * (0.74 + breath * 0.12), plant.size * 0.42, plant.size * 0.82, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.rotate(-angle);
          }
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(0, 0, plant.size * 0.38, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });

      garden.fireflies.forEach((firefly) => {
        const x = ((firefly.x * width + time * firefly.speed * 0.06) % (width + 20)) - 10;
        const y = firefly.y * height + Math.sin(time / 760 + firefly.delay) * 14;
        ctx.globalAlpha = 0.34 + breath * 0.45;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(x, y, firefly.radius + bloom / 70, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      ctx.fillStyle = "rgba(255, 255, 255, 0.82)";
      drawRoundRect(ctx, 24, 24, Math.min(330, width - 48), 88, 16);
      ctx.fill();
      ctx.fillStyle = mood.ink;
      ctx.font = "900 24px Inter, sans-serif";
      ctx.fillText(`${mood.label} Garden`, 46, 62);
      ctx.font = "760 13px Inter, sans-serif";
      ctx.fillText(`${garden.plants.length} blooms · ${garden.fireflies.length} lights · seed ${seed}`, 46, 88);
    },
    [bloom, density, garden.fireflies, garden.plants, mood, seed],
  );

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;
    const rect = stage.getBoundingClientRect();
    canvas.width = Math.max(340, Math.floor(rect.width));
    canvas.height = Math.max(360, Math.floor(rect.height));
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    drawGarden();
  }, [drawGarden]);

  const animate = useCallback(
    (time: number) => {
      drawGarden(time);
      frameRef.current = window.requestAnimationFrame(animate);
    },
    [drawGarden],
  );

  const reseedGarden = useCallback(() => {
    setSeed((current) => current + 97 + Math.round(Math.random() * 900));
    setStatus("A new garden grew from the same mood.");
  }, []);

  const downloadGarden = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `oeeco-${mood.key}-mood-garden.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    setStatus("Garden image downloaded.");
  }, [mood.key]);

  useEffect(() => {
    resizeCanvas();
    if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
    frameRef.current = window.requestAnimationFrame(animate);

    const handleResize = () => resizeCanvas();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
    };
  }, [animate, resizeCanvas]);

  useEffect(() => {
    setStatus(`${mood.label} garden ready`);
  }, [mood.label]);

  return (
    <section className="mood-garden-shell" aria-label="Mood Garden generator">
      <div className="mood-garden-hero">
        <div className="mood-garden-copy">
          <span className="section-kicker">
            <Flower2 size={15} aria-hidden="true" />
            Interactive mood generator
          </span>
          <h1>Mood Garden</h1>
          <p>
            Pick a feeling, tune the density and bloom, then grow a small animated garden that can be refreshed or saved
            as an image.
          </p>
        </div>

        <div className="mood-garden-panel" aria-label="Garden controls">
          <div className="mood-garden-panel-heading">
            <Sparkles size={18} aria-hidden="true" />
            <strong>Grow settings</strong>
          </div>

          <div className="mood-choice-grid" role="group" aria-label="Choose garden mood">
            {moods.map((item) => (
              <button
                className={item.key === mood.key ? "is-active" : ""}
                key={item.key}
                type="button"
                onClick={() => setMoodKey(item.key)}
              >
                <span>{item.label}</span>
                <small>{item.helper}</small>
              </button>
            ))}
          </div>

          <label className="mood-slider">
            <span>
              Garden density <strong>{density}%</strong>
            </span>
            <input min="20" max="100" type="range" value={density} onChange={(event) => setDensity(Number(event.target.value))} />
          </label>

          <label className="mood-slider">
            <span>
              Bloom light <strong>{bloom}%</strong>
            </span>
            <input min="10" max="100" type="range" value={bloom} onChange={(event) => setBloom(Number(event.target.value))} />
          </label>
        </div>
      </div>

      <div className="mood-garden-stage" ref={stageRef}>
        <canvas ref={canvasRef} aria-label={`${mood.label} animated mood garden`} role="img" />
      </div>

      <div className="mood-garden-actions">
        <div className="mood-garden-status">
          <span>{mood.label}</span>
          <strong>{status}</strong>
        </div>
        <button className="ghost-button" type="button" onClick={reseedGarden}>
          <RefreshCw size={17} aria-hidden="true" />
          New Seed
        </button>
        <button className="solid-button" type="button" onClick={downloadGarden}>
          <Download size={17} aria-hidden="true" />
          Save PNG
        </button>
      </div>
    </section>
  );
}
