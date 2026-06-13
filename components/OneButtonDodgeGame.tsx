"use client";

import { RotateCcw, Zap } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type Obstacle = {
  x: number;
  lane: 0 | 1;
  width: number;
  passed: boolean;
};

type GameStatus = "ready" | "playing" | "ended";

const gameDuration = 30;
const playerX = 86;
const playerSize = 34;
const obstacleHeight = 54;
const obstacleGap = 510;

export function OneButtonDodgeGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const laneRef = useRef<0 | 1>(1);
  const scoreRef = useRef(0);
  const bestRef = useRef(0);
  const statusRef = useRef<GameStatus>("ready");
  const startRef = useRef(0);
  const lastRef = useRef(0);
  const spawnRef = useRef(0);
  const obstaclesRef = useRef<Obstacle[]>([]);
  const [lane, setLane] = useState<0 | 1>(1);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [timeLeft, setTimeLeft] = useState(gameDuration);
  const [status, setStatus] = useState<GameStatus>("ready");

  const syncStats = useCallback(() => {
    setLane(laneRef.current);
    setScore(scoreRef.current);
    setBest(bestRef.current);
    setStatus(statusRef.current);
  }, []);

  const stopLoop = useCallback(() => {
    if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
  }, []);

  const setGameStatus = useCallback(
    (next: GameStatus) => {
      statusRef.current = next;
      setStatus(next);
    },
    [],
  );

  const endGame = useCallback(() => {
    setGameStatus("ended");
    bestRef.current = Math.max(bestRef.current, scoreRef.current);
    setBest(bestRef.current);
  }, [setGameStatus]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const upperY = height * 0.36;
    const lowerY = height * 0.66;
    const lanes = [upperY, lowerY] as const;
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#e9fff6");
    gradient.addColorStop(0.48, "#9cf0d0");
    gradient.addColorStop(1, "#3577f0");

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = 0.58;
    for (let i = 0; i < 14; i += 1) {
      const x = (i * 87 + scoreRef.current * 7) % (width + 120) - 60;
      const y = 32 + ((i * 41) % Math.max(80, height - 70));
      ctx.strokeStyle = i % 2 ? "#f45d8f" : "#ffffff";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, 44 + (i % 3) * 18, 18 + (i % 4) * 8);
    }
    ctx.globalAlpha = 1;

    ctx.strokeStyle = "rgba(24, 32, 29, 0.18)";
    ctx.lineWidth = 3;
    lanes.forEach((y) => {
      ctx.beginPath();
      ctx.moveTo(34, y);
      ctx.lineTo(width - 34, y);
      ctx.stroke();
    });

    const playerY = lanes[laneRef.current];
    ctx.shadowColor = "rgba(24, 32, 29, 0.28)";
    ctx.shadowBlur = 18;
    ctx.fillStyle = "#18201d";
    ctx.fillRect(playerX - playerSize / 2 + 5, playerY - playerSize / 2 + 5, playerSize, playerSize);
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#55d6a8";
    ctx.fillRect(playerX - playerSize / 2, playerY - playerSize / 2, playerSize, playerSize);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(playerX - 5, playerY - 5, 10, 10);

    obstaclesRef.current.forEach((obstacle, index) => {
      const y = lanes[obstacle.lane] - obstacleHeight / 2;
      ctx.fillStyle = index % 2 ? "#f45d8f" : "#f4b43f";
      ctx.fillRect(obstacle.x, y, obstacle.width, obstacleHeight);
      ctx.strokeStyle = "#18201d";
      ctx.lineWidth = 3;
      ctx.strokeRect(obstacle.x, y, obstacle.width, obstacleHeight);
    });

    if (statusRef.current !== "playing") {
      ctx.fillStyle = "rgba(255, 255, 255, 0.82)";
      ctx.fillRect(28, 28, width - 56, height - 56);
      ctx.fillStyle = "#18201d";
      ctx.font = "900 28px Inter, sans-serif";
      ctx.fillText(statusRef.current === "ready" ? "Click or press Space" : "Run complete", 56, height / 2 - 20);
      ctx.font = "760 16px Inter, sans-serif";
      ctx.fillText(statusRef.current === "ready" ? "Switch lanes. Dodge every block for 30 seconds." : "Restart and beat your best score.", 56, height / 2 + 16);
    }
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const rect = wrap.getBoundingClientRect();
    canvas.width = Math.max(320, Math.floor(rect.width));
    canvas.height = Math.max(260, Math.floor(rect.height));
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    draw();
  }, [draw]);

  const spawnObstacle = useCallback((width: number) => {
    const nextLane = Math.random() > 0.5 ? 1 : 0;
    const nextWidth = 42 + Math.round(Math.random() * 22);
    obstaclesRef.current.push({
      x: width + 24,
      lane: nextLane,
      width: nextWidth,
      passed: false,
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
      const speed = 4.4 + Math.min(4.2, elapsed * 0.11);

      setTimeLeft(Math.ceil(nextTime));
      spawnRef.current += delta * speed;
      if (spawnRef.current >= obstacleGap) {
        spawnRef.current = 0;
        spawnObstacle(canvas.width);
      }

      const lanes = [canvas.height * 0.36, canvas.height * 0.66] as const;
      const playerY = lanes[laneRef.current];
      obstaclesRef.current = obstaclesRef.current
        .map((obstacle) => ({ ...obstacle, x: obstacle.x - delta * speed }))
        .filter((obstacle) => obstacle.x + obstacle.width > -40);

      for (const obstacle of obstaclesRef.current) {
        if (!obstacle.passed && obstacle.x + obstacle.width < playerX - playerSize / 2) {
          obstacle.passed = true;
          scoreRef.current += 1;
          setScore(scoreRef.current);
        }

        const obstacleY = lanes[obstacle.lane];
        const hitX = obstacle.x < playerX + playerSize / 2 && obstacle.x + obstacle.width > playerX - playerSize / 2;
        const hitY = Math.abs(obstacleY - playerY) < (obstacleHeight + playerSize) / 2;
        if (hitX && hitY) {
          endGame();
          draw();
          return;
        }
      }

      if (nextTime <= 0) {
        endGame();
        draw();
        return;
      }

      draw();
      frameRef.current = window.requestAnimationFrame(loop);
    },
    [draw, endGame, spawnObstacle],
  );

  const startGame = useCallback(() => {
    stopLoop();
    laneRef.current = 1;
    scoreRef.current = 0;
    obstaclesRef.current = [];
    spawnRef.current = 0;
    lastRef.current = 0;
    startRef.current = performance.now();
    setLane(1);
    setScore(0);
    setTimeLeft(gameDuration);
    setGameStatus("playing");
    frameRef.current = window.requestAnimationFrame(loop);
  }, [loop, setGameStatus, stopLoop]);

  const switchLane = useCallback(() => {
    if (statusRef.current !== "playing") {
      startGame();
      return;
    }

    laneRef.current = laneRef.current === 0 ? 1 : 0;
    setLane(laneRef.current);
    draw();
  }, [draw, startGame]);

  useEffect(() => {
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
      <div className="dodge-copy">
        <span className="section-kicker">
          <Zap size={15} aria-hidden="true" />
          30-second reflex game
        </span>
        <h1>One Button Dodge</h1>
        <p>Switch lanes with one tap. Dodge the blocks, keep your rhythm, and survive the full 30 seconds.</p>
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
          <span>Time</span>
          <strong>{timeLeft}s</strong>
        </div>
        <div>
          <span>Lane</span>
          <strong>{lane === 0 ? "High" : "Low"}</strong>
        </div>
      </div>

      <div className="dodge-stage" ref={wrapRef}>
        <canvas ref={canvasRef} onPointerDown={switchLane} aria-label="One Button Dodge play field" role="img" />
      </div>

      <div className="dodge-controls">
        <button className="solid-button" type="button" onClick={switchLane}>
          {status === "playing" ? "Switch Lane" : "Start Game"}
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
