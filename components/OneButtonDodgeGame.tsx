"use client";

import { Gauge, RotateCcw, Sparkles, Zap } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type Lane = 0 | 1;

type ObstacleKind = "block" | "wide" | "signal";

type Obstacle = {
  x: number;
  lane: Lane;
  width: number;
  height: number;
  kind: ObstacleKind;
  passed: boolean;
  nearMissed: boolean;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
};

type GameStatus = "ready" | "playing" | "ended";

const gameDuration = 30;
const playerX = 94;
const playerSize = 34;
const obstacleGap = 480;
const bestStorageKey = "oeeco-one-button-dodge-best";

const obstacleColors: Record<ObstacleKind, string> = {
  block: "#f45d8f",
  wide: "#f4b43f",
  signal: "#3577f0",
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

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

export function OneButtonDodgeGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const laneRef = useRef<Lane>(1);
  const scoreRef = useRef(0);
  const comboRef = useRef(1);
  const bestRef = useRef(0);
  const nearMissRef = useRef(0);
  const statusRef = useRef<GameStatus>("ready");
  const startRef = useRef(0);
  const lastRef = useRef(0);
  const spawnRef = useRef(0);
  const switchPulseRef = useRef(0);
  const messageRef = useRef("Tap to start");
  const obstaclesRef = useRef<Obstacle[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const lastLaneRef = useRef<Lane>(0);
  const [lane, setLane] = useState<Lane>(1);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [best, setBest] = useState(0);
  const [nearMisses, setNearMisses] = useState(0);
  const [timeLeft, setTimeLeft] = useState(gameDuration);
  const [status, setStatus] = useState<GameStatus>("ready");
  const [message, setMessage] = useState("Tap to start");

  const syncStats = useCallback(() => {
    setLane(laneRef.current);
    setScore(scoreRef.current);
    setCombo(comboRef.current);
    setBest(bestRef.current);
    setNearMisses(nearMissRef.current);
    setStatus(statusRef.current);
    setMessage(messageRef.current);
  }, []);

  const stopLoop = useCallback(() => {
    if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
  }, []);

  const setGameStatus = useCallback((next: GameStatus) => {
    statusRef.current = next;
    setStatus(next);
  }, []);

  const setGameMessage = useCallback((next: string) => {
    messageRef.current = next;
    setMessage(next);
  }, []);

  const addParticles = useCallback((x: number, y: number, color: string, amount = 8) => {
    for (let index = 0; index < amount; index += 1) {
      const angle = (Math.PI * 2 * index) / amount + Math.random() * 0.35;
      const force = 1.2 + Math.random() * 2.2;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * force,
        vy: Math.sin(angle) * force,
        life: 1,
        color,
        size: 3 + Math.random() * 4,
      });
    }
  }, []);

  const endGame = useCallback(
    (result: "crash" | "clear") => {
      setGameStatus("ended");
      setGameMessage(result === "clear" ? "Perfect run. Play it cleaner." : "Crash. Reset the rhythm.");
      bestRef.current = Math.max(bestRef.current, scoreRef.current);
      setBest(bestRef.current);

      try {
        window.localStorage.setItem(bestStorageKey, String(bestRef.current));
      } catch {
        // Local storage can be unavailable in hardened browser modes.
      }
    },
    [setGameMessage, setGameStatus],
  );

  const drawLabel = useCallback(
    (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, width: number) => {
      const words = text.split(" ");
      let line = "";
      let nextY = y;
      words.forEach((word) => {
        const testLine = line ? `${line} ${word}` : word;
        if (ctx.measureText(testLine).width > width && line) {
          ctx.fillText(line, x, nextY);
          line = word;
          nextY += 22;
          return;
        }
        line = testLine;
      });
      if (line) ctx.fillText(line, x, nextY);
    },
    [],
  );

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const lanes = [height * 0.35, height * 0.67] as const;
    const elapsed = statusRef.current === "playing" ? (performance.now() - startRef.current) / 1000 : 0;
    const progress = statusRef.current === "playing" ? clamp(elapsed / gameDuration, 0, 1) : 0;
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#effff8");
    gradient.addColorStop(0.42, "#8ce9c7");
    gradient.addColorStop(1, "#1d65e1");

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = 0.44;
    for (let i = 0; i < 22; i += 1) {
      const drift = statusRef.current === "playing" ? elapsed * (18 + i * 1.7) : 0;
      const x = (i * 83 - drift) % (width + 120);
      const y = 28 + ((i * 47) % Math.max(90, height - 80));
      ctx.strokeStyle = i % 3 === 0 ? "#ffffff" : i % 3 === 1 ? "#f45d8f" : "#f4b43f";
      ctx.lineWidth = i % 4 === 0 ? 3 : 2;
      drawRoundRect(ctx, x - 70, y, 38 + (i % 4) * 18, 15 + (i % 5) * 7, 7);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    ctx.fillStyle = "rgba(255, 255, 255, 0.38)";
    drawRoundRect(ctx, 22, 24, width - 44, height - 48, 20);
    ctx.fill();

    ctx.strokeStyle = "rgba(24, 32, 29, 0.14)";
    ctx.lineWidth = 2;
    lanes.forEach((y, index) => {
      ctx.setLineDash([14, 12]);
      ctx.beginPath();
      ctx.moveTo(36, y);
      ctx.lineTo(width - 36, y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "rgba(24, 32, 29, 0.62)";
      ctx.font = "850 12px Inter, sans-serif";
      ctx.fillText(index === 0 ? "HIGH LANE" : "LOW LANE", 42, y - 18);
    });

    ctx.fillStyle = "#18201d";
    drawRoundRect(ctx, 36, 36, Math.max(60, (width - 72) * (1 - progress)), 9, 8);
    ctx.fill();
    ctx.fillStyle = "rgba(24, 32, 29, 0.16)";
    drawRoundRect(ctx, 36, 36, width - 72, 9, 8);
    ctx.strokeStyle = "rgba(24, 32, 29, 0.5)";
    ctx.stroke();

    obstaclesRef.current.forEach((obstacle) => {
      const y = lanes[obstacle.lane] - obstacle.height / 2;
      const color = obstacleColors[obstacle.kind];
      ctx.shadowColor = "rgba(24, 32, 29, 0.22)";
      ctx.shadowBlur = 12;
      ctx.fillStyle = "#18201d";
      drawRoundRect(ctx, obstacle.x + 5, y + 5, obstacle.width, obstacle.height, 10);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = color;
      drawRoundRect(ctx, obstacle.x, y, obstacle.width, obstacle.height, 10);
      ctx.fill();
      ctx.strokeStyle = "#18201d";
      ctx.lineWidth = 3;
      ctx.stroke();

      if (obstacle.kind === "signal") {
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        for (let line = 0; line < 3; line += 1) {
          drawRoundRect(ctx, obstacle.x + 10 + line * 18, y + 10, 7, obstacle.height - 20, 4);
          ctx.fill();
        }
      }

      if (obstacle.kind === "wide") {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.72)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(obstacle.x + 12, y + 13);
        ctx.lineTo(obstacle.x + obstacle.width - 12, y + obstacle.height - 13);
        ctx.moveTo(obstacle.x + 12, y + obstacle.height - 13);
        ctx.lineTo(obstacle.x + obstacle.width - 12, y + 13);
        ctx.stroke();
      }
    });

    const playerY = lanes[laneRef.current];
    const pulse = Math.max(0, switchPulseRef.current);
    ctx.globalAlpha = 0.16 + pulse * 0.22;
    ctx.fillStyle = "#18201d";
    ctx.beginPath();
    ctx.arc(playerX, playerY, 38 + pulse * 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.shadowColor = "rgba(24, 32, 29, 0.3)";
    ctx.shadowBlur = 18;
    ctx.fillStyle = "#18201d";
    drawRoundRect(ctx, playerX - playerSize / 2 + 5, playerY - playerSize / 2 + 5, playerSize, playerSize, 9);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#55d6a8";
    drawRoundRect(ctx, playerX - playerSize / 2, playerY - playerSize / 2, playerSize, playerSize, 9);
    ctx.fill();
    ctx.strokeStyle = "#18201d";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = "#ffffff";
    drawRoundRect(ctx, playerX - 6, playerY - 6, 12, 12, 3);
    ctx.fill();

    particlesRef.current.forEach((particle) => {
      ctx.globalAlpha = clamp(particle.life, 0, 1);
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    ctx.fillStyle = "rgba(255, 255, 255, 0.86)";
    drawRoundRect(ctx, width - 180, 56, 130, 44, 10);
    ctx.fill();
    ctx.fillStyle = "#18201d";
    ctx.font = "900 18px Inter, sans-serif";
    ctx.fillText(`${scoreRef.current} pts`, width - 162, 84);

    if (statusRef.current !== "playing") {
      ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
      drawRoundRect(ctx, 34, 62, Math.min(520, width - 68), 178, 18);
      ctx.fill();
      ctx.strokeStyle = "rgba(24, 32, 29, 0.22)";
      ctx.stroke();
      ctx.fillStyle = "#18201d";
      ctx.font = "900 30px Inter, sans-serif";
      ctx.fillText(statusRef.current === "ready" ? "Ready to dodge" : "Run complete", 58, 114);
      ctx.font = "760 16px Inter, sans-serif";
      drawLabel(
        ctx,
        statusRef.current === "ready"
          ? "Tap, click, or press Space to switch lanes. Chain close dodges for bonus points."
          : "Restart, tighten the timing, and push the best score higher.",
        58,
        150,
        Math.min(440, width - 110),
      );
      ctx.font = "850 13px Inter, sans-serif";
      ctx.fillStyle = "#0c7a55";
      ctx.fillText("One button. Two lanes. Thirty seconds.", 58, 213);
    }
  }, [drawLabel]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const rect = wrap.getBoundingClientRect();
    canvas.width = Math.max(320, Math.floor(rect.width));
    canvas.height = Math.max(320, Math.floor(rect.height));
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    draw();
  }, [draw]);

  const spawnObstacle = useCallback((width: number, elapsed: number) => {
    const roll = Math.random();
    const kind: ObstacleKind = roll > 0.78 ? "wide" : roll > 0.58 ? "signal" : "block";
    const lane = Math.random() > 0.5 ? 1 : 0;
    const widthByKind = kind === "wide" ? 86 : kind === "signal" ? 58 : 48;
    const heightByKind = kind === "wide" ? 62 : kind === "signal" ? 50 : 54;
    const jitter = Math.round(Math.random() * 18);
    const recentSameLane = lane === lastLaneRef.current;
    const nextLane: Lane = recentSameLane && Math.random() > 0.45 ? (lane === 0 ? 1 : 0) : lane;

    lastLaneRef.current = nextLane;
    obstaclesRef.current.push({
      x: width + 24 + Math.min(80, elapsed * 2),
      lane: nextLane,
      width: widthByKind + jitter,
      height: heightByKind,
      kind,
      passed: false,
      nearMissed: false,
    });
  }, []);

  const loop = useCallback(
    (now: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      if (!lastRef.current) lastRef.current = now;
      const delta = Math.min(40, now - lastRef.current);
      lastRef.current = now;
      const elapsed = (now - startRef.current) / 1000;
      const nextTime = Math.max(0, gameDuration - elapsed);
      const speed = 0.42 + Math.min(0.48, elapsed * 0.016) + Math.min(0.12, comboRef.current * 0.008);

      switchPulseRef.current = Math.max(0, switchPulseRef.current - delta / 180);
      setTimeLeft(Math.ceil(nextTime));
      spawnRef.current += delta * speed;
      if (spawnRef.current >= Math.max(360, obstacleGap - elapsed * 3.5)) {
        spawnRef.current = 0;
        spawnObstacle(canvas.width, elapsed);
      }

      particlesRef.current = particlesRef.current
        .map((particle) => ({
          ...particle,
          x: particle.x + particle.vx * (delta / 16),
          y: particle.y + particle.vy * (delta / 16),
          vy: particle.vy + 0.03,
          life: particle.life - delta / 520,
        }))
        .filter((particle) => particle.life > 0);

      const lanes = [canvas.height * 0.35, canvas.height * 0.67] as const;
      const playerY = lanes[laneRef.current];
      obstaclesRef.current = obstaclesRef.current
        .map((obstacle) => ({ ...obstacle, x: obstacle.x - delta * speed }))
        .filter((obstacle) => obstacle.x + obstacle.width > -40);

      for (const obstacle of obstaclesRef.current) {
        if (!obstacle.passed && obstacle.x + obstacle.width < playerX - playerSize / 2) {
          obstacle.passed = true;
          comboRef.current = clamp(comboRef.current + 1, 1, 9);
          scoreRef.current += obstacle.kind === "wide" ? 2 : 1;
          setCombo(comboRef.current);
          setScore(scoreRef.current);
          setGameMessage(comboRef.current >= 5 ? `Combo x${comboRef.current}` : "Clean dodge");
        }

        const obstacleY = lanes[obstacle.lane];
        const hitX = obstacle.x < playerX + playerSize / 2 && obstacle.x + obstacle.width > playerX - playerSize / 2;
        const hitY = Math.abs(obstacleY - playerY) < (obstacle.height + playerSize) / 2;
        const closeX =
          obstacle.x < playerX + playerSize * 1.4 && obstacle.x + obstacle.width > playerX - playerSize * 1.8;

        if (closeX && obstacle.lane !== laneRef.current && !obstacle.nearMissed && statusRef.current === "playing") {
          obstacle.nearMissed = true;
          nearMissRef.current += 1;
          comboRef.current = clamp(comboRef.current + 1, 1, 9);
          scoreRef.current += 2;
          setNearMisses(nearMissRef.current);
          setCombo(comboRef.current);
          setScore(scoreRef.current);
          setGameMessage("Near dodge +2");
          addParticles(playerX + 8, playerY, "#ffffff", 7);
        }

        if (hitX && hitY) {
          comboRef.current = 1;
          setCombo(1);
          addParticles(playerX, playerY, "#f45d8f", 14);
          endGame("crash");
          draw();
          return;
        }
      }

      if (nextTime <= 0) {
        scoreRef.current += 10;
        setScore(scoreRef.current);
        addParticles(playerX, playerY, "#55d6a8", 18);
        endGame("clear");
        draw();
        return;
      }

      draw();
      frameRef.current = window.requestAnimationFrame(loop);
    },
    [addParticles, draw, endGame, setGameMessage, spawnObstacle],
  );

  const startGame = useCallback(() => {
    stopLoop();
    laneRef.current = 1;
    scoreRef.current = 0;
    comboRef.current = 1;
    nearMissRef.current = 0;
    obstaclesRef.current = [];
    particlesRef.current = [];
    spawnRef.current = 0;
    lastRef.current = 0;
    switchPulseRef.current = 0;
    startRef.current = performance.now();
    setLane(1);
    setScore(0);
    setCombo(1);
    setNearMisses(0);
    setTimeLeft(gameDuration);
    setGameMessage("Find the rhythm");
    setGameStatus("playing");
    frameRef.current = window.requestAnimationFrame(loop);
  }, [loop, setGameMessage, setGameStatus, stopLoop]);

  const switchLane = useCallback(() => {
    if (statusRef.current !== "playing") {
      startGame();
      return;
    }

    laneRef.current = laneRef.current === 0 ? 1 : 0;
    switchPulseRef.current = 1;
    setLane(laneRef.current);
    setGameMessage(laneRef.current === 0 ? "High lane" : "Low lane");
    addParticles(playerX, laneRef.current === 0 ? 120 : 220, "#55d6a8", 5);
    draw();
  }, [addParticles, draw, setGameMessage, startGame]);

  useEffect(() => {
    try {
      const storedBest = Number(window.localStorage.getItem(bestStorageKey) || 0);
      if (Number.isFinite(storedBest)) {
        bestRef.current = storedBest;
        setBest(storedBest);
      }
    } catch {
      // Local storage can be unavailable in hardened browser modes.
    }

    resizeCanvas();
    syncStats();

    const handleResize = () => resizeCanvas();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code !== "Space" && event.code !== "ArrowUp" && event.code !== "ArrowDown") return;
      event.preventDefault();
      switchLane();
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
      stopLoop();
    };
  }, [resizeCanvas, switchLane, stopLoop, syncStats]);

  return (
    <section className="dodge-shell" aria-label="One Button Dodge game">
      <div className="dodge-intro">
        <div className="dodge-copy">
          <span className="section-kicker">
            <Zap size={15} aria-hidden="true" />
            30-second reflex game
          </span>
          <h1>One Button Dodge</h1>
          <p>
            Switch lanes with one input, read the incoming blocks, and chain close dodges for bonus points. It is simple
            on the surface, but the score comes from timing.
          </p>
        </div>

        <aside className="dodge-brief" aria-label="How to play">
          <div>
            <Gauge size={18} aria-hidden="true" />
            <strong>Arcade rules</strong>
          </div>
          <ul>
            <li>Tap, click, Space, or arrow keys switch lanes.</li>
            <li>Wide blocks are worth more when cleared.</li>
            <li>Close calls add near-dodge bonus points.</li>
          </ul>
        </aside>
      </div>

      <div className="dodge-stats" aria-label="Game stats">
        <div>
          <span>Score</span>
          <strong>{score}</strong>
        </div>
        <div>
          <span>Best</span>
          <strong>{best}</strong>
        </div>
        <div>
          <span>Combo</span>
          <strong>x{combo}</strong>
        </div>
        <div>
          <span>Near</span>
          <strong>{nearMisses}</strong>
        </div>
        <div>
          <span>Time</span>
          <strong>{timeLeft}s</strong>
        </div>
      </div>

      <div className="dodge-stage" ref={wrapRef}>
        <canvas ref={canvasRef} onPointerDown={switchLane} aria-label="One Button Dodge play field" role="img" />
      </div>

      <div className={`dodge-status is-${status}`}>
        <Sparkles size={17} aria-hidden="true" />
        <strong>{message}</strong>
        <span>{lane === 0 ? "High lane" : "Low lane"}</span>
      </div>

      <div className="dodge-controls">
        <button className="solid-button" type="button" onClick={switchLane}>
          {status === "playing" ? "Switch Lane" : "Start Run"}
        </button>
        <button className="ghost-button" type="button" onClick={startGame}>
          <RotateCcw size={17} aria-hidden="true" />
          Restart
        </button>
        <span>Desktop: Space / arrows. Mobile: tap anywhere in the game.</span>
      </div>
    </section>
  );
}
