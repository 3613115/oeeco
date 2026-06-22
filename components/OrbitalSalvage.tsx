"use client";

import {
  AlertTriangle,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Crosshair,
  Gauge,
  Orbit,
  Radio,
  RefreshCw,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import Matter from "matter-js";
import { useCallback, useEffect, useRef, useState } from "react";

type FlightStatus = "ready" | "flying" | "disabled";
type ControlKey = "thrust" | "left" | "right" | "brake" | "boost";
type DebrisKind = "panel" | "crate" | "hull" | "core";

type FlightTelemetry = {
  speed: number;
  hull: number;
  fuel: number;
  heading: number;
  distance: number;
  collisions: number;
  status: FlightStatus;
};

type Particle = { x: number; y: number; vx: number; vy: number; life: number; size: number; color: string };
type Star = { x: number; y: number; size: number; alpha: number; layer: number };
type DebrisBody = Matter.Body & { plugin: Matter.Body["plugin"] & { orbitalKind?: DebrisKind; value?: number } };

const WORLD_WIDTH = 3400;
const WORLD_HEIGHT = 2200;
const STATION_X = 2500;
const STATION_Y = 1080;
const START_X = 760;
const START_Y = 1100;
const MAX_HULL = 100;
const MAX_FUEL = 100;

const initialTelemetry: FlightTelemetry = {
  speed: 0,
  hull: MAX_HULL,
  fuel: MAX_FUEL,
  heading: 0,
  distance: 1740,
  collisions: 0,
  status: "ready",
};

function seededRandom(seed: number) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function formatHeading(angle: number) {
  const degrees = ((angle * 180) / Math.PI + 90 + 360) % 360;
  return Math.round(degrees);
}

function drawRoundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const nextRadius = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.roundRect(x, y, width, height, nextRadius);
}

export function OrbitalSalvage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const shipRef = useRef<Matter.Body | null>(null);
  const debrisRef = useRef<DebrisBody[]>([]);
  const starsRef = useRef<Star[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const controlsRef = useRef<Record<ControlKey, boolean>>({ thrust: false, left: false, right: false, brake: false, boost: false });
  const cameraRef = useRef({ x: START_X, y: START_Y, shake: 0 });
  const frameRef = useRef<number | null>(null);
  const lastFrameRef = useRef(0);
  const lastTelemetryRef = useRef(0);
  const lastImpactRef = useRef(0);
  const hullRef = useRef(MAX_HULL);
  const fuelRef = useRef(MAX_FUEL);
  const collisionsRef = useRef(0);
  const statusRef = useRef<FlightStatus>("ready");
  const [telemetry, setTelemetry] = useState(initialTelemetry);
  const [message, setMessage] = useState("Flight systems armed");

  const createStars = useCallback(() => {
    const random = seededRandom(117043);
    starsRef.current = Array.from({ length: 620 }, () => ({
      x: random() * WORLD_WIDTH,
      y: random() * WORLD_HEIGHT,
      size: 0.5 + random() * 1.8,
      alpha: 0.2 + random() * 0.75,
      layer: 0.45 + random() * 0.55,
    }));
  }, []);

  const createWorld = useCallback(() => {
    const engine = Matter.Engine.create({ gravity: { x: 0, y: 0 } });
    engine.positionIterations = 8;
    engine.velocityIterations = 6;
    engineRef.current = engine;
    const { Bodies, Body, Composite } = Matter;

    const ship = Bodies.polygon(START_X, START_Y, 3, 30, {
      friction: 0,
      frictionAir: 0.008,
      restitution: 0.3,
      density: 0.0028,
      label: "salvage-ship",
      chamfer: { radius: 3 },
    });
    Body.setAngle(ship, -Math.PI / 2);
    shipRef.current = ship;

    const walls = [
      Bodies.rectangle(WORLD_WIDTH / 2, -35, WORLD_WIDTH, 70, { isStatic: true, restitution: 0.55, label: "world-edge" }),
      Bodies.rectangle(WORLD_WIDTH / 2, WORLD_HEIGHT + 35, WORLD_WIDTH, 70, { isStatic: true, restitution: 0.55, label: "world-edge" }),
      Bodies.rectangle(-35, WORLD_HEIGHT / 2, 70, WORLD_HEIGHT, { isStatic: true, restitution: 0.55, label: "world-edge" }),
      Bodies.rectangle(WORLD_WIDTH + 35, WORLD_HEIGHT / 2, 70, WORLD_HEIGHT, { isStatic: true, restitution: 0.55, label: "world-edge" }),
    ];

    const station = Bodies.circle(STATION_X, STATION_Y, 154, {
      isStatic: true,
      restitution: 0.22,
      friction: 0.02,
      label: "station",
    });

    const random = seededRandom(802451);
    const kinds: DebrisKind[] = ["panel", "crate", "hull", "core"];
    const debris: DebrisBody[] = [];
    for (let index = 0; index < 54; index += 1) {
      const kind = kinds[index % kinds.length];
      const width = kind === "panel" ? 70 + random() * 65 : kind === "hull" ? 48 + random() * 44 : 28 + random() * 28;
      const height = kind === "panel" ? 12 + random() * 10 : kind === "hull" ? 35 + random() * 30 : width * (0.72 + random() * 0.2);
      const angle = random() * Math.PI * 2;
      const orbitRadius = 360 + random() * 920;
      const x = clamp(STATION_X + Math.cos(angle) * orbitRadius, 220, WORLD_WIDTH - 220);
      const y = clamp(STATION_Y + Math.sin(angle) * orbitRadius * 0.62, 180, WORLD_HEIGHT - 180);
      const body = Bodies.rectangle(x, y, width, height, {
        friction: 0.01,
        frictionAir: 0.0008,
        restitution: 0.38,
        density: kind === "core" ? 0.005 : kind === "hull" ? 0.0038 : 0.0018,
        label: "debris",
        chamfer: { radius: kind === "crate" ? 4 : 1 },
      }) as DebrisBody;
      body.plugin.orbitalKind = kind;
      body.plugin.value = Math.round(120 + random() * 880);
      Body.setAngle(body, random() * Math.PI * 2);
      Body.setVelocity(body, { x: (random() - 0.5) * 1.6, y: (random() - 0.5) * 1.6 });
      Body.setAngularVelocity(body, (random() - 0.5) * 0.025);
      debris.push(body);
    }
    debrisRef.current = debris;
    Composite.add(engine.world, [ship, station, ...walls, ...debris]);

    Matter.Events.on(engine, "collisionStart", (event) => {
      const currentShip = shipRef.current;
      if (!currentShip || statusRef.current === "disabled") return;
      for (const pair of event.pairs) {
        if (pair.bodyA !== currentShip && pair.bodyB !== currentShip) continue;
        const now = performance.now();
        if (now - lastImpactRef.current < 260) continue;
        lastImpactRef.current = now;
        const speed = currentShip.speed;
        if (speed < 2.2) continue;
        const damage = Math.round(clamp((speed - 1.7) * 4.8, 3, 28));
        hullRef.current = clamp(hullRef.current - damage, 0, MAX_HULL);
        collisionsRef.current += 1;
        cameraRef.current.shake = Math.min(18, speed * 2.2);
        setMessage(speed > 5 ? `Critical impact · hull -${damage}%` : `Contact · hull -${damage}%`);
        if (hullRef.current <= 0) {
          statusRef.current = "disabled";
          setMessage("Hull integrity lost");
        }
      }
    });
  }, []);

  const resetFlight = useCallback(() => {
    if (engineRef.current) {
      Matter.Events.off(engineRef.current, "collisionStart");
      Matter.Composite.clear(engineRef.current.world, false, true);
      Matter.Engine.clear(engineRef.current);
    }
    particlesRef.current = [];
    hullRef.current = MAX_HULL;
    fuelRef.current = MAX_FUEL;
    collisionsRef.current = 0;
    statusRef.current = "ready";
    cameraRef.current = { x: START_X, y: START_Y, shake: 0 };
    controlsRef.current = { thrust: false, left: false, right: false, brake: false, boost: false };
    setTelemetry(initialTelemetry);
    setMessage("Flight systems armed");
    createWorld();
  }, [createWorld]);

  const setControl = useCallback((control: ControlKey, active: boolean) => {
    controlsRef.current[control] = active;
    if (active && statusRef.current === "ready") {
      statusRef.current = "flying";
      setMessage("Free flight engaged");
    }
  }, []);

  const spawnThruster = useCallback((ship: Matter.Body, boost: boolean) => {
    const rearX = ship.position.x - Math.cos(ship.angle) * 29;
    const rearY = ship.position.y - Math.sin(ship.angle) * 29;
    for (let index = 0; index < (boost ? 3 : 1); index += 1) {
      particlesRef.current.push({
        x: rearX + (Math.random() - 0.5) * 8,
        y: rearY + (Math.random() - 0.5) * 8,
        vx: -Math.cos(ship.angle) * (2.2 + Math.random() * 2.2) + ship.velocity.x * 0.3,
        vy: -Math.sin(ship.angle) * (2.2 + Math.random() * 2.2) + ship.velocity.y * 0.3,
        life: 1,
        size: boost ? 4 + Math.random() * 4 : 2 + Math.random() * 3,
        color: boost ? "#ffd56a" : "#65e6ff",
      });
    }
  }, []);

  const draw = useCallback((now: number) => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    const engine = engineRef.current;
    const ship = shipRef.current;
    if (!canvas || !stage || !engine || !ship) return;
    const rect = stage.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const width = Math.max(320, Math.floor(rect.width));
    const height = Math.max(480, Math.floor(rect.height));
    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    }
    const context = canvas.getContext("2d");
    if (!context) return;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    const delta = lastFrameRef.current ? Math.min(34, now - lastFrameRef.current) : 16.67;
    lastFrameRef.current = now;

    if (statusRef.current !== "disabled") {
      const controls = controlsRef.current;
      const boost = controls.boost && controls.thrust && fuelRef.current > 0;
      const turnRate = 0.0021 * delta;
      if (controls.left) Matter.Body.setAngularVelocity(ship, clamp(ship.angularVelocity - turnRate, -0.115, 0.115));
      if (controls.right) Matter.Body.setAngularVelocity(ship, clamp(ship.angularVelocity + turnRate, -0.115, 0.115));
      if (!controls.left && !controls.right) Matter.Body.setAngularVelocity(ship, ship.angularVelocity * 0.94);
      if (controls.thrust && fuelRef.current > 0) {
        const force = (boost ? 0.00052 : 0.00031) * ship.mass * (delta / 16.67);
        Matter.Body.applyForce(ship, ship.position, { x: Math.cos(ship.angle) * force, y: Math.sin(ship.angle) * force });
        fuelRef.current = clamp(fuelRef.current - (boost ? 0.021 : 0.009) * delta, 0, MAX_FUEL);
        spawnThruster(ship, boost);
      }
      if (controls.brake && fuelRef.current > 0) {
        Matter.Body.setVelocity(ship, { x: ship.velocity.x * 0.965, y: ship.velocity.y * 0.965 });
        Matter.Body.setAngularVelocity(ship, ship.angularVelocity * 0.88);
        fuelRef.current = clamp(fuelRef.current - 0.004 * delta, 0, MAX_FUEL);
      }
      const maxSpeed = boost ? 15 : 10.5;
      if (ship.speed > maxSpeed) Matter.Body.setSpeed(ship, maxSpeed);
    }

    const simulationDelta = statusRef.current === "disabled" ? delta * 0.35 : delta;
    const simulationSteps = Math.max(1, Math.ceil(simulationDelta / 16.667));
    for (let step = 0; step < simulationSteps; step += 1) {
      Matter.Engine.update(engine, simulationDelta / simulationSteps);
    }

    particlesRef.current = particlesRef.current
      .map((particle) => ({ ...particle, x: particle.x + particle.vx, y: particle.y + particle.vy, vx: particle.vx * 0.985, vy: particle.vy * 0.985, life: particle.life - delta / 620 }))
      .filter((particle) => particle.life > 0);

    const camera = cameraRef.current;
    camera.x += (ship.position.x + ship.velocity.x * 14 - camera.x) * 0.065;
    camera.y += (ship.position.y + ship.velocity.y * 14 - camera.y) * 0.065;
    const shakeX = camera.shake > 0 ? (Math.random() - 0.5) * camera.shake : 0;
    const shakeY = camera.shake > 0 ? (Math.random() - 0.5) * camera.shake : 0;
    camera.shake *= 0.88;
    const zoom = width < 640 ? 0.58 : width < 1000 ? 0.72 : 0.86;
    const toScreen = (x: number, y: number) => ({ x: (x - camera.x) * zoom + width / 2 + shakeX, y: (y - camera.y) * zoom + height / 2 + shakeY });

    const background = context.createRadialGradient(width * 0.5, height * 0.48, 20, width * 0.5, height * 0.5, Math.max(width, height) * 0.76);
    background.addColorStop(0, "#0b1930");
    background.addColorStop(0.55, "#060d1b");
    background.addColorStop(1, "#02050c");
    context.fillStyle = background;
    context.fillRect(0, 0, width, height);

    for (const star of starsRef.current) {
      const parallaxX = (star.x - camera.x * star.layer) * zoom + width / 2;
      const parallaxY = (star.y - camera.y * star.layer) * zoom + height / 2;
      const x = ((parallaxX % (width + 80)) + width + 80) % (width + 80) - 40;
      const y = ((parallaxY % (height + 80)) + height + 80) % (height + 80) - 40;
      context.globalAlpha = star.alpha;
      context.fillStyle = star.size > 1.6 ? "#a7cfff" : "#ffffff";
      context.fillRect(x, y, star.size, star.size);
    }
    context.globalAlpha = 1;

    const station = toScreen(STATION_X, STATION_Y);
    context.save();
    context.translate(station.x, station.y);
    context.rotate(now * 0.000035);
    context.strokeStyle = "rgba(101, 230, 255, 0.2)";
    context.lineWidth = 1;
    context.beginPath();
    context.arc(0, 0, 218 * zoom, 0, Math.PI * 2);
    context.stroke();
    context.strokeStyle = "#7086a8";
    context.lineWidth = 17 * zoom;
    context.beginPath();
    context.arc(0, 0, 142 * zoom, 0, Math.PI * 2);
    context.stroke();
    context.strokeStyle = "#17243a";
    context.lineWidth = 33 * zoom;
    context.beginPath();
    context.arc(0, 0, 104 * zoom, 0, Math.PI * 2);
    context.stroke();
    context.fillStyle = "#65e6ff";
    for (let index = 0; index < 12; index += 1) {
      const angle = (index / 12) * Math.PI * 2;
      context.beginPath();
      context.arc(Math.cos(angle) * 142 * zoom, Math.sin(angle) * 142 * zoom, 3.3 * zoom, 0, Math.PI * 2);
      context.fill();
    }
    context.fillStyle = "#0a1220";
    context.beginPath();
    context.arc(0, 0, 67 * zoom, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = "rgba(255, 213, 106, 0.75)";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(-50 * zoom, 0);
    context.lineTo(50 * zoom, 0);
    context.moveTo(0, -50 * zoom);
    context.lineTo(0, 50 * zoom);
    context.stroke();
    context.restore();

    for (const body of debrisRef.current) {
      const point = toScreen(body.position.x, body.position.y);
      if (point.x < -120 || point.x > width + 120 || point.y < -120 || point.y > height + 120) continue;
      const kind = body.plugin.orbitalKind || "crate";
      const boundsWidth = (body.bounds.max.x - body.bounds.min.x) * zoom;
      const boundsHeight = (body.bounds.max.y - body.bounds.min.y) * zoom;
      context.save();
      context.translate(point.x, point.y);
      context.rotate(body.angle);
      context.fillStyle = kind === "core" ? "#ffd56a" : kind === "panel" ? "#285d84" : kind === "hull" ? "#71809a" : "#c76f4d";
      context.strokeStyle = kind === "core" ? "#fff1b8" : "#a9bad1";
      context.lineWidth = 1.2;
      drawRoundedRect(context, -boundsWidth / 2, -boundsHeight / 2, boundsWidth, boundsHeight, kind === "crate" ? 4 : 1);
      context.fill();
      context.stroke();
      if (kind === "panel") {
        context.strokeStyle = "rgba(101,230,255,0.5)";
        for (let line = -1; line <= 1; line += 1) {
          context.beginPath();
          context.moveTo((line * boundsWidth) / 4, -boundsHeight / 2);
          context.lineTo((line * boundsWidth) / 4, boundsHeight / 2);
          context.stroke();
        }
      }
      if (kind === "core") {
        context.shadowColor = "#ffd56a";
        context.shadowBlur = 14;
        context.fillStyle = "#fff3b0";
        context.beginPath();
        context.arc(0, 0, Math.min(boundsWidth, boundsHeight) * 0.2, 0, Math.PI * 2);
        context.fill();
      }
      context.restore();
    }

    for (const particle of particlesRef.current) {
      const point = toScreen(particle.x, particle.y);
      context.globalAlpha = particle.life;
      context.fillStyle = particle.color;
      context.shadowColor = particle.color;
      context.shadowBlur = 8;
      context.beginPath();
      context.arc(point.x, point.y, particle.size * zoom, 0, Math.PI * 2);
      context.fill();
    }
    context.globalAlpha = 1;
    context.shadowBlur = 0;

    const shipPoint = toScreen(ship.position.x, ship.position.y);
    context.save();
    context.translate(shipPoint.x, shipPoint.y);
    context.rotate(ship.angle);
    const shipScale = zoom * 1.05;
    context.shadowColor = hullRef.current < 35 ? "#ff5f70" : "#65e6ff";
    context.shadowBlur = 16;
    context.fillStyle = hullRef.current < 35 ? "#ff7080" : "#eaf7ff";
    context.strokeStyle = "#65e6ff";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(35 * shipScale, 0);
    context.lineTo(-22 * shipScale, 22 * shipScale);
    context.lineTo(-13 * shipScale, 0);
    context.lineTo(-22 * shipScale, -22 * shipScale);
    context.closePath();
    context.fill();
    context.stroke();
    context.fillStyle = "#10223a";
    context.beginPath();
    context.moveTo(14 * shipScale, 0);
    context.lineTo(-4 * shipScale, 8 * shipScale);
    context.lineTo(-4 * shipScale, -8 * shipScale);
    context.closePath();
    context.fill();
    context.restore();

    const targetDx = STATION_X - ship.position.x;
    const targetDy = STATION_Y - ship.position.y;
    const targetAngle = Math.atan2(targetDy, targetDx);
    const targetDistance = Math.hypot(targetDx, targetDy);
    const indicatorRadius = Math.min(width, height) * 0.35;
    const targetX = width / 2 + Math.cos(targetAngle) * indicatorRadius;
    const targetY = height / 2 + Math.sin(targetAngle) * indicatorRadius;
    if (targetDistance > 300) {
      context.save();
      context.translate(targetX, targetY);
      context.rotate(targetAngle);
      context.fillStyle = "rgba(101,230,255,0.88)";
      context.beginPath();
      context.moveTo(10, 0);
      context.lineTo(-7, 6);
      context.lineTo(-7, -6);
      context.closePath();
      context.fill();
      context.restore();
      context.fillStyle = "rgba(213,237,255,0.7)";
      context.font = "700 10px ui-monospace, monospace";
      context.fillText(`${Math.round(targetDistance)}m`, targetX + 12, targetY + 4);
    }

    if (now - lastTelemetryRef.current > 100) {
      lastTelemetryRef.current = now;
      setTelemetry({
        speed: ship.speed,
        hull: Math.round(hullRef.current),
        fuel: Math.round(fuelRef.current),
        heading: formatHeading(ship.angle),
        distance: Math.round(targetDistance),
        collisions: collisionsRef.current,
        status: statusRef.current,
      });
    }
    frameRef.current = window.requestAnimationFrame(draw);
  }, [spawnThruster]);

  useEffect(() => {
    createStars();
    createWorld();
    const keyMap: Record<string, ControlKey> = {
      KeyW: "thrust", ArrowUp: "thrust", KeyA: "left", ArrowLeft: "left", KeyD: "right", ArrowRight: "right", KeyS: "brake", ArrowDown: "brake", ShiftLeft: "boost", ShiftRight: "boost",
    };
    const onKeyDown = (event: KeyboardEvent) => {
      const control = keyMap[event.code];
      if (!control) return;
      event.preventDefault();
      setControl(control, true);
    };
    const onKeyUp = (event: KeyboardEvent) => {
      const control = keyMap[event.code];
      if (!control) return;
      event.preventDefault();
      setControl(control, false);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    frameRef.current = window.requestAnimationFrame(draw);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
      if (engineRef.current) {
        Matter.Events.off(engineRef.current, "collisionStart");
        Matter.Engine.clear(engineRef.current);
      }
    };
  }, [createStars, createWorld, draw, setControl]);

  const bindControl = (control: ControlKey) => ({
    onPointerDown: (event: React.PointerEvent<HTMLButtonElement>) => { event.currentTarget.setPointerCapture(event.pointerId); setControl(control, true); },
    onPointerUp: () => setControl(control, false),
    onPointerCancel: () => setControl(control, false),
    onPointerLeave: () => setControl(control, false),
  });

  return (
    <section className="orbital-shell" aria-label="Orbital Salvage flight prototype">
      <header className="orbital-header">
        <div>
          <span className="orbital-kicker"><Orbit size={15} /> Flight prototype // phase A</span>
          <h1>ORBITAL<span>//</span>SALVAGE</h1>
          <p>Newtonian flight test · Kestrel recovery vehicle</p>
        </div>
        <div className={`orbital-flight-state is-${telemetry.status}`}>
          <i />
          <span><small>FLIGHT STATE</small><strong>{telemetry.status === "ready" ? "ARMED" : telemetry.status === "disabled" ? "DISABLED" : "FREE FLIGHT"}</strong></span>
        </div>
      </header>

      <div className="orbital-grid">
        <aside className="orbital-side orbital-side-left">
          <div className="orbital-panel-label"><Gauge size={15} /> FLIGHT DATA</div>
          <div className="orbital-speed"><span>VELOCITY</span><strong>{telemetry.speed.toFixed(1)}</strong><small>m/s</small></div>
          <div className="orbital-dial" style={{ "--dial-value": `${Math.min(100, telemetry.speed * 7)}%` } as React.CSSProperties}>
            <div><strong>{telemetry.heading.toString().padStart(3, "0")}°</strong><span>HEADING</span></div>
          </div>
          <div className="orbital-bars">
            <div className={telemetry.hull < 35 ? "is-danger" : ""}><span><Shield size={13} /> Hull</span><strong>{telemetry.hull}%</strong><i><b style={{ width: `${telemetry.hull}%` }} /></i></div>
            <div><span><Zap size={13} /> Fuel</span><strong>{telemetry.fuel}%</strong><i><b style={{ width: `${telemetry.fuel}%` }} /></i></div>
          </div>
          <div className="orbital-mission-card">
            <span>TEST VECTOR 01</span>
            <strong>Reach Helix Station</strong>
            <p>Use controlled burns. Arrive under 2.0 m/s to protect the recovery vehicle.</p>
            <div><Crosshair size={14} /><span>{telemetry.distance}m</span></div>
          </div>
          <div className="orbital-help">
            <div className="orbital-panel-label"><Radio size={15} /> PILOT INPUT</div>
            <p><kbd>W</kbd> thrust <kbd>A</kbd><kbd>D</kbd> rotate</p>
            <p><kbd>S</kbd> brake <kbd>SHIFT</kbd> boost</p>
          </div>
        </aside>

        <div className="orbital-stage" ref={stageRef}>
          <canvas ref={canvasRef} aria-label="Newtonian orbital flight simulation" />
          <div className="orbital-reticle" aria-hidden="true"><i /><i /><span /></div>
          <div className="orbital-message"><i className={telemetry.hull < 35 ? "is-danger" : ""} /><span>{message}</span></div>
          <div className="orbital-stage-mark">SECTOR H-12 · LOCAL GRAVITY 0.00G</div>
        </div>

        <aside className="orbital-side orbital-side-right">
          <div className="orbital-panel-label"><Sparkles size={15} /> PROXIMITY MAP</div>
          <div className="orbital-radar">
            <i className="orbital-radar-sweep" />
            <span className="orbital-radar-ship" />
            <span className="orbital-radar-station" style={{ transform: `rotate(${Math.atan2(STATION_Y - START_Y, STATION_X - START_X)}rad) translateX(54px)` }} />
            {Array.from({ length: 12 }, (_, index) => <b key={index} style={{ transform: `rotate(${index * 31}deg) translateX(${28 + (index % 4) * 10}px)` }} />)}
          </div>
          <div className="orbital-contact-list">
            <div><i className="is-cyan" /><span><strong>HELIX STATION</strong><small>{telemetry.distance}m · bearing locked</small></span></div>
            <div><i className="is-amber" /><span><strong>54 OBJECTS</strong><small>uncontrolled debris field</small></span></div>
            <div><i className="is-white" /><span><strong>KESTREL</strong><small>{telemetry.speed.toFixed(1)}m/s · hull {telemetry.hull}%</small></span></div>
          </div>
          <div className="orbital-impact-log">
            <div className="orbital-panel-label"><AlertTriangle size={15} /> IMPACT LOG</div>
            <strong>{telemetry.collisions.toString().padStart(2, "0")}</strong>
            <span>registered contacts</span>
          </div>
          <button type="button" className="orbital-reset" onClick={resetFlight}><RefreshCw size={16} /> Reset flight</button>
        </aside>
      </div>

      <div className="orbital-touch-controls" aria-label="Touch flight controls">
        <div>
          <button type="button" {...bindControl("left")} aria-label="Rotate left"><ArrowLeft size={22} /></button>
          <button type="button" {...bindControl("right")} aria-label="Rotate right"><ArrowRight size={22} /></button>
        </div>
        <div>
          <button type="button" {...bindControl("brake")} aria-label="Brake"><ArrowDown size={22} /></button>
          <button type="button" className="is-thrust" {...bindControl("thrust")} aria-label="Thrust"><ArrowUp size={22} /> THRUST</button>
        </div>
      </div>
    </section>
  );
}
