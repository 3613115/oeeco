"use client";

import {
  Activity,
  Atom,
  Biohazard,
  ChevronRight,
  CircleDot,
  Copy,
  Dna,
  FastForward,
  Flame,
  Gauge,
  Pause,
  Play,
  RefreshCw,
  Share2,
  Snowflake,
  Sparkles,
  Sprout,
  Sun,
  Target,
  Waves,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Genome = {
  speed: number;
  sense: number;
  size: number;
  metabolism: number;
  aggression: number;
  sociability: number;
  hue: number;
  turn: number;
};

type Agent = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  energy: number;
  age: number;
  generation: number;
  kills: number;
  children: number;
  genome: Genome;
};

type HistoryPoint = { tick: number; population: number; food: number; energy: number; diversity: number };

type Snapshot = {
  seed: number;
  tick: number;
  agents: Agent[];
  food: Array<{ x: number; y: number; toxin: boolean }>;
  climate: { temperature: number; fertility: number; toxicity: number; event: string; eventTicks: number };
  history: HistoryPoint[];
  stats: {
    population: number;
    food: number;
    maxGeneration: number;
    diversity: number;
    predators: number;
    averageEnergy: number;
  };
};

type WorkerMessage =
  | { type: "snapshot"; seed: number; tick: number; agents: Agent[]; food: Snapshot["food"]; climate: Snapshot["climate"]; history: HistoryPoint[]; stats: Snapshot["stats"] }
  | { type: "inspection"; agent: Agent | null };

type WorldEvent = "bloom" | "drought" | "freeze" | "toxin" | "predators";

const WORLD_WIDTH = 1600;
const WORLD_HEIGHT = 900;
const SPEEDS = [0.5, 1, 2, 4];
const initialSnapshot: Snapshot = {
  seed: 834721,
  tick: 0,
  agents: [],
  food: [],
  climate: { temperature: 0.64, fertility: 0.72, toxicity: 0, event: "Booting biosphere", eventTicks: 0 },
  history: [],
  stats: { population: 0, food: 0, maxGeneration: 1, diversity: 0, predators: 0, averageEnergy: 0 },
};

const eventControls: Array<{ id: WorldEvent; label: string; detail: string; icon: typeof Sprout }> = [
  { id: "bloom", label: "Bloom", detail: "Flood the world with nutrients", icon: Sprout },
  { id: "drought", label: "Drought", detail: "Collapse food production", icon: Sun },
  { id: "freeze", label: "Freeze", detail: "Slow movement and growth", icon: Snowflake },
  { id: "toxin", label: "Toxin", detail: "Poison part of the food web", icon: Biohazard },
  { id: "predators", label: "Apex", detail: "Introduce evolved hunters", icon: Target },
];

function seededNumberFromUrl() {
  if (typeof window === "undefined") return 834721;
  const querySeed = Number(new URLSearchParams(window.location.search).get("seed"));
  return Number.isFinite(querySeed) && querySeed > 0 ? Math.floor(querySeed) : 834721;
}

function compact(value: number) {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

function genePercent(value: number, min: number, max: number) {
  return Math.round(((value - min) / (max - min)) * 100);
}

function LineChart({ history }: { history: HistoryPoint[] }) {
  const width = 520;
  const height = 112;
  const series = useMemo(() => {
    const points = history.length > 1 ? history : [{ tick: 0, population: 0, food: 0, energy: 0, diversity: 0 }, { tick: 1, population: 0, food: 0, energy: 0, diversity: 0 }];
    const maxPopulation = Math.max(100, ...points.map((point) => point.population));
    const maxFood = Math.max(200, ...points.map((point) => point.food));
    const pathFor = (key: "population" | "food", maximum: number) =>
      points
        .map((point, index) => {
          const x = (index / Math.max(1, points.length - 1)) * width;
          const y = height - (point[key] / maximum) * (height - 12) - 6;
          return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
        })
        .join(" ");
    return { population: pathFor("population", maxPopulation), food: pathFor("food", maxFood) };
  }, [history]);

  return (
    <svg className="evo-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Population and food history">
      <defs>
        <linearGradient id="evo-chart-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#6cf5c2" stopOpacity="0.2" />
          <stop offset="1" stopColor="#6cf5c2" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((position) => <line key={position} x1="0" x2={width} y1={height * position} y2={height * position} />)}
      <path className="evo-chart-food" d={series.food} />
      <path className="evo-chart-population" d={series.population} />
    </svg>
  );
}

function GeneBar({ label, value, detail }: { label: string; value: number; detail: string }) {
  return (
    <div className="evo-gene">
      <div><span>{label}</span><strong>{detail}</strong></div>
      <div className="evo-gene-track"><span style={{ width: `${Math.max(3, Math.min(100, value))}%` }} /></div>
    </div>
  );
}

export function EvoColony() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const snapshotRef = useRef<Snapshot>(initialSnapshot);
  const frameRef = useRef<number | null>(null);
  const selectedRef = useRef<number | null>(null);
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [selected, setSelected] = useState<Agent | null>(null);
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [seed, setSeed] = useState(834721);
  const [copied, setCopied] = useState(false);
  const [activeEvent, setActiveEvent] = useState("Stable cycle");

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;
    const rect = stage.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const width = Math.max(320, Math.round(rect.width));
    const height = Math.max(420, Math.round(rect.height));
    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const state = snapshotRef.current;
    const scaleX = width / WORLD_WIDTH;
    const scaleY = height / WORLD_HEIGHT;
    const scale = Math.max(0.58, Math.min(scaleX, scaleY));
    const climateHue = state.climate.temperature < 0.3 ? 205 : state.climate.toxicity > 0.4 ? 292 : 164;
    const background = ctx.createRadialGradient(width * 0.52, height * 0.48, 20, width * 0.5, height * 0.5, width * 0.8);
    background.addColorStop(0, `hsla(${climateHue}, 48%, 13%, 1)`);
    background.addColorStop(0.58, "#071411");
    background.addColorStop(1, "#030908");
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "rgba(115, 255, 202, 0.055)";
    ctx.lineWidth = 1;
    const grid = Math.max(38, width / 22);
    for (let x = 0; x < width; x += grid) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
    for (let y = 0; y < height; y += grid) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }

    const vignette = ctx.createLinearGradient(0, 0, width, height);
    vignette.addColorStop(0, "rgba(66, 234, 180, 0.04)");
    vignette.addColorStop(0.5, "rgba(0,0,0,0)");
    vignette.addColorStop(1, "rgba(92, 63, 240, 0.08)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);

    for (const item of state.food) {
      const x = item.x * scaleX;
      const y = item.y * scaleY;
      ctx.fillStyle = item.toxin ? "rgba(234, 82, 255, 0.72)" : "rgba(108, 245, 194, 0.58)";
      ctx.shadowColor = item.toxin ? "#ea52ff" : "#6cf5c2";
      ctx.shadowBlur = item.toxin ? 8 : 5;
      ctx.beginPath();
      ctx.arc(x, y, item.toxin ? 2.2 : 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    for (const agent of state.agents) {
      const x = agent.x * scaleX;
      const y = agent.y * scaleY;
      const angle = Math.atan2(agent.vy, agent.vx);
      const radius = Math.max(2.8, agent.genome.size * scale * 0.68);
      const alpha = Math.max(0.38, Math.min(1, agent.energy / 84));
      const predator = agent.genome.aggression > 0.62;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = `hsl(${agent.genome.hue} 78% ${predator ? 61 : 68}%)`;
      ctx.shadowColor = `hsl(${agent.genome.hue} 90% 60%)`;
      ctx.shadowBlur = selectedRef.current === agent.id ? 18 : predator ? 9 : 5;
      ctx.beginPath();
      ctx.moveTo(radius * 1.8, 0);
      ctx.lineTo(-radius, radius * 0.82);
      ctx.lineTo(-radius * 0.52, 0);
      ctx.lineTo(-radius, -radius * 0.82);
      ctx.closePath();
      ctx.fill();
      if (predator) {
        ctx.strokeStyle = "rgba(255,255,255,0.72)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.restore();

      if (selectedRef.current === agent.id) {
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(x, y, Math.max(16, radius + 9), 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.font = "700 11px ui-monospace, monospace";
        ctx.fillText(`#${agent.id} · G${agent.generation}`, x + 19, y - 11);
      }
    }

    const scanY = ((performance.now() / 34) % (height + 140)) - 70;
    const scan = ctx.createLinearGradient(0, scanY - 40, 0, scanY + 40);
    scan.addColorStop(0, "rgba(108,245,194,0)");
    scan.addColorStop(0.5, "rgba(108,245,194,0.035)");
    scan.addColorStop(1, "rgba(108,245,194,0)");
    ctx.fillStyle = scan;
    ctx.fillRect(0, scanY - 40, width, 80);
    frameRef.current = window.requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    const initialSeed = seededNumberFromUrl();
    setSeed(initialSeed);
    const worker = new Worker("/evo-colony.worker.js");
    workerRef.current = worker;
    worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
      if (event.data.type === "snapshot") {
        const next = event.data as Snapshot;
        snapshotRef.current = next;
        setSnapshot(next);
        setActiveEvent(next.climate.event);
        if (selectedRef.current) {
          const current = next.agents.find((agent) => agent.id === selectedRef.current) || null;
          setSelected(current);
          if (!current) selectedRef.current = null;
        }
      }
      if (event.data.type === "inspection") setSelected(event.data.agent);
    };
    worker.postMessage({ type: "reset", seed: initialSeed });
    frameRef.current = window.requestAnimationFrame(draw);
    return () => {
      worker.terminate();
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
    };
  }, [draw]);

  const togglePause = () => {
    const next = !paused;
    setPaused(next);
    workerRef.current?.postMessage({ type: "pause", paused: next });
  };

  const changeSpeed = () => {
    const next = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length];
    setSpeed(next);
    workerRef.current?.postMessage({ type: "speed", speed: next });
  };

  const resetWorld = (randomize = false) => {
    const nextSeed = randomize ? Math.floor(100000 + Math.random() * 899999) : seed;
    setSeed(nextSeed);
    setSelected(null);
    selectedRef.current = null;
    workerRef.current?.postMessage({ type: "reset", seed: nextSeed });
    const url = new URL(window.location.href);
    url.searchParams.set("seed", String(nextSeed));
    window.history.replaceState({}, "", url);
  };

  const triggerEvent = (event: WorldEvent) => workerRef.current?.postMessage({ type: "event", event });

  const inspectAt = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * WORLD_WIDTH;
    const y = ((event.clientY - rect.top) / rect.height) * WORLD_HEIGHT;
    let nearest: Agent | null = null;
    let distance = 55 * 55;
    for (const agent of snapshotRef.current.agents) {
      const nextDistance = Math.pow(agent.x - x, 2) + Math.pow(agent.y - y, 2);
      if (nextDistance < distance) { nearest = agent; distance = nextDistance; }
    }
    selectedRef.current = nearest?.id || null;
    setSelected(nearest);
    if (nearest) workerRef.current?.postMessage({ type: "inspect", id: nearest.id });
  };

  const shareWorld = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set("seed", String(seed));
    try {
      if (navigator.share) await navigator.share({ title: "EVO//COLONY", text: "Evolve this biosphere with me.", url: url.toString() });
      else await navigator.clipboard.writeText(url.toString());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Native share can be dismissed without changing the simulation.
    }
  };

  const worldYears = Math.floor(snapshot.tick / 180);

  return (
    <section className="evo-shell" aria-label="EVO Colony artificial life laboratory">
      <header className="evo-header">
        <div className="evo-brand-block">
          <span className="evo-kicker"><Atom size={15} /> Artificial life system 01</span>
          <h1>EVO<span>//</span>COLONY</h1>
          <p>Evolution has no goal. Give it pressure and watch what survives.</p>
        </div>
        <div className="evo-header-actions">
          <div className="evo-seed" title="Deterministic world seed">
            <span>WORLD SEED</span><strong>{seed}</strong>
          </div>
          <button type="button" className="evo-icon-button" onClick={() => resetWorld(true)} title="Generate new world"><RefreshCw size={18} /><span className="sr-only">Generate new world</span></button>
          <button type="button" className="evo-icon-button" onClick={shareWorld} title="Share this world"><Share2 size={18} /><span className="sr-only">Share world</span></button>
        </div>
      </header>

      <div className="evo-livebar">
        <div><span className="evo-live-dot" /> SIMULATION LIVE</div>
        <div><Waves size={14} /> {activeEvent.toUpperCase()}</div>
        <div>YEAR {worldYears.toString().padStart(4, "0")}</div>
        <div>{copied ? <><Copy size={14} /> LINK COPIED</> : <>SELECT AN ORGANISM TO INSPECT</>}</div>
      </div>

      <div className="evo-layout">
        <aside className="evo-sidebar evo-sidebar-left">
          <div className="evo-panel-heading"><Activity size={16} /><span>BIOSPHERE</span></div>
          <div className="evo-primary-stat"><span>Population</span><strong>{compact(snapshot.stats.population)}</strong><small>living organisms</small></div>
          <div className="evo-stat-grid">
            <div><span>Generation</span><strong>G{snapshot.stats.maxGeneration}</strong></div>
            <div><span>Diversity</span><strong>{snapshot.stats.diversity}%</strong></div>
            <div><span>Energy</span><strong>{snapshot.stats.averageEnergy}</strong></div>
            <div><span>Predators</span><strong>{snapshot.stats.predators}</strong></div>
          </div>

          <div className="evo-chart-heading"><span>Population dynamics</span><div><i /> life <i /> food</div></div>
          <LineChart history={snapshot.history} />

          <div className="evo-climate">
            <div className="evo-panel-heading"><Gauge size={16} /><span>ENVIRONMENT</span></div>
            <GeneBar label="Temperature" value={snapshot.climate.temperature * 100} detail={`${Math.round(snapshot.climate.temperature * 52 - 8)}°C`} />
            <GeneBar label="Fertility" value={snapshot.climate.fertility * 100} detail={`${Math.round(snapshot.climate.fertility * 100)}%`} />
            <GeneBar label="Toxicity" value={snapshot.climate.toxicity * 100} detail={`${Math.round(snapshot.climate.toxicity * 100)}%`} />
          </div>
        </aside>

        <div className="evo-stage" ref={stageRef}>
          <canvas ref={canvasRef} onPointerDown={inspectAt} aria-label="Evolving ecosystem canvas" />
          <div className="evo-stage-corners" aria-hidden="true"><i /><i /><i /><i /></div>
          <div className="evo-stage-scale"><span /> 100 μm</div>
          <div className="evo-stage-hint"><CircleDot size={14} /> Click a lifeform to sequence its genome</div>
        </div>

        <aside className="evo-sidebar evo-sidebar-right">
          <div className="evo-panel-heading"><Dna size={16} /><span>SEQUENCER</span></div>
          {selected ? (
            <div className="evo-inspector">
              <div className="evo-organism-title">
                <span style={{ background: `hsl(${selected.genome.hue} 78% 62%)`, boxShadow: `0 0 20px hsl(${selected.genome.hue} 90% 55%)` }} />
                <div><small>ORGANISM</small><strong>#{selected.id.toString().padStart(4, "0")}</strong></div>
                <b>G{selected.generation}</b>
              </div>
              <div className="evo-organism-vitals">
                <div><span>Energy</span><strong>{selected.energy}</strong></div>
                <div><span>Age</span><strong>{Math.floor(selected.age / 30)}</strong></div>
                <div><span>Offspring</span><strong>{selected.children}</strong></div>
                <div><span>Kills</span><strong>{selected.kills}</strong></div>
              </div>
              <div className="evo-genome-list">
                <GeneBar label="Locomotion" value={genePercent(selected.genome.speed, 0.42, 1.85)} detail={selected.genome.speed.toFixed(2)} />
                <GeneBar label="Perception" value={genePercent(selected.genome.sense, 38, 270)} detail={Math.round(selected.genome.sense).toString()} />
                <GeneBar label="Body mass" value={genePercent(selected.genome.size, 2.8, 11.5)} detail={selected.genome.size.toFixed(1)} />
                <GeneBar label="Efficiency" value={100 - genePercent(selected.genome.metabolism, 0.45, 1.65)} detail={(2 - selected.genome.metabolism).toFixed(2)} />
                <GeneBar label="Aggression" value={selected.genome.aggression * 100} detail={`${Math.round(selected.genome.aggression * 100)}%`} />
                <GeneBar label="Social drive" value={(selected.genome.sociability + 1) * 50} detail={selected.genome.sociability > 0 ? "Flock" : "Solitary"} />
              </div>
              <div className={`evo-trait-callout ${selected.genome.aggression > 0.62 ? "is-danger" : ""}`}>
                {selected.genome.aggression > 0.62 ? <Flame size={17} /> : <Sparkles size={17} />}
                <div><small>DOMINANT TRAIT</small><strong>{selected.genome.aggression > 0.62 ? "Active hunter" : selected.genome.sociability > 0.32 ? "Collective grazer" : "Adaptive forager"}</strong></div>
              </div>
            </div>
          ) : (
            <div className="evo-empty-inspector">
              <div><Dna size={32} /></div>
              <strong>No sequence locked</strong>
              <p>Select a moving organism to inspect its inherited traits and survival record.</p>
            </div>
          )}

          <div className="evo-interventions">
            <div className="evo-panel-heading"><Zap size={16} /><span>INTERVENTIONS</span></div>
            {eventControls.map((control) => {
              const Icon = control.icon;
              return (
                <button type="button" key={control.id} onClick={() => triggerEvent(control.id)} title={control.detail}>
                  <Icon size={17} /><span><strong>{control.label}</strong><small>{control.detail}</small></span><ChevronRight size={15} />
                </button>
              );
            })}
          </div>
        </aside>
      </div>

      <footer className="evo-controls">
        <div className="evo-control-group">
          <button type="button" className="evo-control-primary" onClick={togglePause}>{paused ? <Play size={17} /> : <Pause size={17} />} {paused ? "Resume" : "Pause"}</button>
          <button type="button" onClick={changeSpeed} title="Cycle simulation speed"><FastForward size={17} /> {speed}×</button>
          <button type="button" onClick={() => resetWorld(false)} title="Restart current seed"><RefreshCw size={17} /> Reset</button>
        </div>
        <div className="evo-system-status"><span><i /> Worker online</span><span>{snapshot.agents.length} agents</span><span>{snapshot.food.length} nutrient nodes</span></div>
      </footer>
    </section>
  );
}
