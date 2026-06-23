"use client";

import {
  Anchor,
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
type ControlKey = "thrust" | "left" | "right" | "brake" | "boost" | "reel";
type DebrisKind = "panel" | "crate" | "hull" | "core";
type GrappleStatus = "scanning" | "locked" | "latched" | "broken";
type RecoveryStatus = "acquire" | "tow" | "recover" | "complete";
type HazardKind = "radiation" | "shrapnel" | "ion";

type FlightTelemetry = {
  speed: number;
  hull: number;
  fuel: number;
  heading: number;
  distance: number;
  collisions: number;
  status: FlightStatus;
  grappleStatus: GrappleStatus;
  grappleRange: number;
  grappleTension: number;
  cargoMass: number;
  cargoValue: number;
  cargoDistance: number;
  recoveryReadiness: number;
  recovered: number;
  contractTarget: number;
  credits: number;
  missionStatus: RecoveryStatus;
  hazardLevel: number;
  hazardRange: number;
  hazardAlert: string;
};

type Particle = { x: number; y: number; vx: number; vy: number; life: number; size: number; color: string };
type Star = { x: number; y: number; size: number; alpha: number; layer: number };
type DebrisBody = Matter.Body & { plugin: Matter.Body["plugin"] & { orbitalKind?: DebrisKind; value?: number } };
type HazardZone = { x: number; y: number; radius: number; driftX: number; driftY: number; phase: number; kind: HazardKind; label: string; intensity: number };

const WORLD_WIDTH = 3400;
const WORLD_HEIGHT = 2200;
const STATION_X = 2500;
const STATION_Y = 1080;
const START_X = 760;
const START_Y = 1100;
const MAX_HULL = 100;
const MAX_FUEL = 100;
const CONTRACT_TARGET = 3;
const RECOVERY_RADIUS = 210;
const RECOVERY_SAFE_SPEED = 3.1;
const RECOVERY_SAFE_TENSION = 82;
const HAZARD_DAMAGE_RATE = 0.0038;

const initialTelemetry: FlightTelemetry = {
  speed: 0,
  hull: MAX_HULL,
  fuel: MAX_FUEL,
  heading: 0,
  distance: 1740,
  collisions: 0,
  status: "ready",
  grappleStatus: "scanning",
  grappleRange: 0,
  grappleTension: 0,
  cargoMass: 0,
  cargoValue: 0,
  cargoDistance: 0,
  recoveryReadiness: 0,
  recovered: 0,
  contractTarget: CONTRACT_TARGET,
  credits: 0,
  missionStatus: "acquire",
  hazardLevel: 0,
  hazardRange: 0,
  hazardAlert: "clear",
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
  const grappleConstraintRef = useRef<Matter.Constraint | null>(null);
  const grappleTargetRef = useRef<DebrisBody | null>(null);
  const lockTargetRef = useRef<DebrisBody | null>(null);
  const grappleStatusRef = useRef<GrappleStatus>("scanning");
  const grappleTensionRef = useRef(0);
  const grappleCooldownRef = useRef(0);
  const hazardZonesRef = useRef<HazardZone[]>([]);
  const hazardLevelRef = useRef(0);
  const hazardRangeRef = useRef(0);
  const hazardAlertRef = useRef("clear");
  const hazardPulseRef = useRef(0);
  const starsRef = useRef<Star[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const controlsRef = useRef<Record<ControlKey, boolean>>({ thrust: false, left: false, right: false, brake: false, boost: false, reel: false });
  const cameraRef = useRef({ x: START_X, y: START_Y, shake: 0 });
  const frameRef = useRef<number | null>(null);
  const lastFrameRef = useRef(0);
  const lastTelemetryRef = useRef(0);
  const lastImpactRef = useRef(0);
  const hullRef = useRef(MAX_HULL);
  const fuelRef = useRef(MAX_FUEL);
  const collisionsRef = useRef(0);
  const recoveredRef = useRef(0);
  const creditsRef = useRef(0);
  const recoveryFlashRef = useRef(0);
  const lastRecoveryRef = useRef(0);
  const statusRef = useRef<FlightStatus>("ready");
  const [telemetry, setTelemetry] = useState(initialTelemetry);
  const [message, setMessage] = useState("Contract armed: recover 3 salvage objects");

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

  const createHazards = useCallback(() => {
    hazardZonesRef.current = [
      { x: 1320, y: 760, radius: 178, driftX: 52, driftY: 34, phase: 0.3, kind: "radiation", label: "RAD CLOUD", intensity: 0.95 },
      { x: 1850, y: 1330, radius: 225, driftX: 82, driftY: 48, phase: 1.8, kind: "shrapnel", label: "SHRAPNEL BELT", intensity: 1 },
      { x: 2240, y: 760, radius: 155, driftX: 44, driftY: 62, phase: 3.2, kind: "ion", label: "ION WAKE", intensity: 0.72 },
    ];
    hazardLevelRef.current = 0;
    hazardRangeRef.current = 0;
    hazardAlertRef.current = "clear";
    hazardPulseRef.current = 0;
  }, []);

  const createWorld = useCallback(() => {
    const engine = Matter.Engine.create({ gravity: { x: 0, y: 0 } });
    engine.positionIterations = 8;
    engine.velocityIterations = 6;
    engineRef.current = engine;
    grappleConstraintRef.current = null;
    grappleTargetRef.current = null;
    lockTargetRef.current = null;
    grappleStatusRef.current = "scanning";
    grappleTensionRef.current = 0;
    createHazards();
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
      let x = clamp(STATION_X + Math.cos(angle) * orbitRadius, 220, WORLD_WIDTH - 220);
      let y = clamp(STATION_Y + Math.sin(angle) * orbitRadius * 0.62, 180, WORLD_HEIGHT - 180);
      if (index === 0) {
        x = START_X;
        y = START_Y - 270;
      }
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
  }, [createHazards]);

  const releaseGrapple = useCallback((reason: "manual" | "broken" = "manual") => {
    const engine = engineRef.current;
    const constraint = grappleConstraintRef.current;
    if (engine && constraint) Matter.Composite.remove(engine.world, constraint);
    grappleConstraintRef.current = null;
    grappleTargetRef.current = null;
    grappleTensionRef.current = 0;
    grappleStatusRef.current = reason === "broken" ? "broken" : lockTargetRef.current ? "locked" : "scanning";
    grappleCooldownRef.current = performance.now() + (reason === "broken" ? 950 : 240);
    setMessage(reason === "broken" ? "Tether overload - line severed" : "Grapple released");
  }, []);

  const recoverCargo = useCallback((cargo: DebrisBody, quality: number) => {
    const engine = engineRef.current;
    const constraint = grappleConstraintRef.current;
    const baseValue = cargo.plugin.value || 120;
    const bonus = Math.round(baseValue * clamp(quality, 0, 100) * 0.004);
    const payout = baseValue + bonus;
    if (engine && constraint) Matter.Composite.remove(engine.world, constraint);
    if (engine) Matter.Composite.remove(engine.world, cargo);
    debrisRef.current = debrisRef.current.filter((body) => body !== cargo);
    grappleConstraintRef.current = null;
    grappleTargetRef.current = null;
    lockTargetRef.current = null;
    grappleStatusRef.current = "scanning";
    grappleTensionRef.current = 0;
    grappleCooldownRef.current = performance.now() + 360;
    recoveredRef.current += 1;
    creditsRef.current += payout;
    recoveryFlashRef.current = performance.now();
    lastRecoveryRef.current = performance.now();
    const complete = recoveredRef.current >= CONTRACT_TARGET;
    setMessage(complete ? `Contract complete +${payout} cr` : `Cargo banked +${payout} cr`);
    for (let index = 0; index < 42; index += 1) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 42 + Math.random() * 118;
      particlesRef.current.push({
        x: STATION_X + Math.cos(angle) * radius,
        y: STATION_Y + Math.sin(angle) * radius,
        vx: Math.cos(angle) * (0.6 + Math.random() * 2.4),
        vy: Math.sin(angle) * (0.6 + Math.random() * 2.4),
        life: 1,
        size: 2 + Math.random() * 4.5,
        color: complete ? "#ffd56a" : "#65e6ff",
      });
    }
  }, []);

  const toggleGrapple = useCallback(() => {
    if (grappleConstraintRef.current) {
      releaseGrapple("manual");
      return;
    }
    const engine = engineRef.current;
    const ship = shipRef.current;
    const target = lockTargetRef.current;
    if (!engine || !ship || !target || performance.now() < grappleCooldownRef.current) {
      setMessage("No salvage target in firing cone");
      return;
    }
    const range = Math.hypot(target.position.x - ship.position.x, target.position.y - ship.position.y);
    if (range > 620) {
      setMessage("Target outside grapple range");
      return;
    }
    const constraint = Matter.Constraint.create({
      bodyA: ship,
      pointA: { x: 22, y: 0 },
      bodyB: target,
      length: Math.max(80, range),
      stiffness: 0.025,
      damping: 0.12,
      label: "salvage-grapple",
    });
    Matter.Composite.add(engine.world, constraint);
    grappleConstraintRef.current = constraint;
    grappleTargetRef.current = target;
    grappleStatusRef.current = "latched";
    grappleTensionRef.current = 0;
    statusRef.current = "flying";
    setMessage(`Grapple latched - ${target.plugin.orbitalKind || "salvage"} secured`);
    const angle = Math.atan2(target.position.y - ship.position.y, target.position.x - ship.position.x);
    for (let index = 0; index < 18; index += 1) {
      particlesRef.current.push({
        x: target.position.x + (Math.random() - 0.5) * 16,
        y: target.position.y + (Math.random() - 0.5) * 16,
        vx: Math.cos(angle + Math.PI + (Math.random() - 0.5)) * (0.5 + Math.random() * 2),
        vy: Math.sin(angle + Math.PI + (Math.random() - 0.5)) * (0.5 + Math.random() * 2),
        life: 1,
        size: 1.5 + Math.random() * 2.5,
        color: "#ffd56a",
      });
    }
  }, [releaseGrapple]);

  const resetFlight = useCallback(() => {
    if (engineRef.current) {
      Matter.Events.off(engineRef.current, "collisionStart");
      Matter.Composite.clear(engineRef.current.world, false, true);
      Matter.Engine.clear(engineRef.current);
    }
    particlesRef.current = [];
    grappleConstraintRef.current = null;
    grappleTargetRef.current = null;
    lockTargetRef.current = null;
    grappleStatusRef.current = "scanning";
    grappleTensionRef.current = 0;
    hullRef.current = MAX_HULL;
    fuelRef.current = MAX_FUEL;
    collisionsRef.current = 0;
    recoveredRef.current = 0;
    creditsRef.current = 0;
    recoveryFlashRef.current = 0;
    lastRecoveryRef.current = 0;
    statusRef.current = "ready";
    cameraRef.current = { x: START_X, y: START_Y, shake: 0 };
    controlsRef.current = { thrust: false, left: false, right: false, brake: false, boost: false, reel: false };
    setTelemetry(initialTelemetry);
    setMessage("Contract armed: recover 3 salvage objects");
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

    if (!grappleConstraintRef.current) {
      let coneTarget: DebrisBody | null = null;
      let fallbackTarget: DebrisBody | null = null;
      let bestConeScore = Number.POSITIVE_INFINITY;
      let bestFallbackScore = Number.POSITIVE_INFINITY;
      const forwardX = Math.cos(ship.angle);
      const forwardY = Math.sin(ship.angle);
      for (const candidate of debrisRef.current) {
        const dx = candidate.position.x - ship.position.x;
        const dy = candidate.position.y - ship.position.y;
        const range = Math.hypot(dx, dy);
        if (range > 620 || range < 42) continue;
        if (range < bestFallbackScore) {
          bestFallbackScore = range;
          fallbackTarget = candidate;
        }
        const alignment = (dx * forwardX + dy * forwardY) / Math.max(1, range);
        if (alignment < 0.55) continue;
        const score = range + (1 - alignment) * 420;
        if (score < bestConeScore) {
          bestConeScore = score;
          coneTarget = candidate;
        }
      }
      const nextTarget = coneTarget || fallbackTarget;
      lockTargetRef.current = nextTarget;
      if (now >= grappleCooldownRef.current) grappleStatusRef.current = nextTarget ? "locked" : "scanning";
    }

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
      let hazardLevel = 0;
      let hazardTensionLoad = 0;
      let nearestHazardEdge = Number.POSITIVE_INFINITY;
      let nextHazardAlert = "clear";
      for (const zone of hazardZonesRef.current) {
        const zoneX = zone.x + Math.sin(now * 0.00023 + zone.phase) * zone.driftX;
        const zoneY = zone.y + Math.cos(now * 0.00019 + zone.phase) * zone.driftY;
        const shipDistance = Math.hypot(ship.position.x - zoneX, ship.position.y - zoneY);
        nearestHazardEdge = Math.min(nearestHazardEdge, Math.max(0, shipDistance - zone.radius));
        const shipExposure = clamp((zone.radius - shipDistance) / zone.radius, 0, 1) * zone.intensity;
        let cargoExposure = 0;
        const cargoBody = grappleTargetRef.current;
        if (cargoBody) {
          const cargoDistance = Math.hypot(cargoBody.position.x - zoneX, cargoBody.position.y - zoneY);
          nearestHazardEdge = Math.min(nearestHazardEdge, Math.max(0, cargoDistance - zone.radius));
          cargoExposure = clamp((zone.radius - cargoDistance) / zone.radius, 0, 1) * zone.intensity * 0.85;
        }
        const exposure = Math.max(shipExposure, cargoExposure);
        if (exposure <= 0) continue;
        hazardLevel = Math.max(hazardLevel, exposure);
        nextHazardAlert = zone.label;
        if (zone.kind === "ion") {
          fuelRef.current = clamp(fuelRef.current - exposure * 0.0042 * delta, 0, MAX_FUEL);
        } else {
          hullRef.current = clamp(hullRef.current - exposure * HAZARD_DAMAGE_RATE * delta, 0, MAX_HULL);
        }
        hazardTensionLoad = Math.max(hazardTensionLoad, cargoExposure * 0.19 * delta);
        if (now - hazardPulseRef.current > 620) {
          hazardPulseRef.current = now;
          cameraRef.current.shake = Math.max(cameraRef.current.shake, 4 + exposure * 7);
          setMessage(`${zone.label} exposure ${Math.round(exposure * 100)}%`);
          for (let index = 0; index < 8; index += 1) {
            particlesRef.current.push({
              x: ship.position.x + (Math.random() - 0.5) * 70,
              y: ship.position.y + (Math.random() - 0.5) * 70,
              vx: (Math.random() - 0.5) * 3.2,
              vy: (Math.random() - 0.5) * 3.2,
              life: 0.65,
              size: 1.5 + Math.random() * 2.5,
              color: zone.kind === "ion" ? "#65e6ff" : zone.kind === "radiation" ? "#ffd56a" : "#ff5f70",
            });
          }
        }
      }
      hazardLevelRef.current = clamp(hazardLevel * 100, 0, 100);
      hazardRangeRef.current = Number.isFinite(nearestHazardEdge) ? Math.round(nearestHazardEdge) : 0;
      hazardAlertRef.current = nextHazardAlert;
      if (hullRef.current <= 0) {
        statusRef.current = "disabled";
        setMessage("Hull integrity lost");
      }
      const grapple = grappleConstraintRef.current;
      const cargo = grappleTargetRef.current;
      if (grapple && cargo) {
        if (controls.reel && fuelRef.current > 0) {
          grapple.length = Math.max(72, grapple.length - 0.09 * delta);
          fuelRef.current = clamp(fuelRef.current - 0.0055 * delta, 0, MAX_FUEL);
        }
        const anchorX = ship.position.x + Math.cos(ship.angle) * 22;
        const anchorY = ship.position.y + Math.sin(ship.angle) * 22;
        const cableDistance = Math.hypot(cargo.position.x - anchorX, cargo.position.y - anchorY);
        const relativeSpeed = Math.hypot(cargo.velocity.x - ship.velocity.x, cargo.velocity.y - ship.velocity.y);
        const stretch = Math.max(0, cableDistance - grapple.length);
        grappleTensionRef.current = clamp(stretch * 2.1 + relativeSpeed * 5.5 + cargo.mass * 2.4 + hazardTensionLoad, 0, 100);
        if (grappleTensionRef.current > 97 && stretch > 12) releaseGrapple("broken");
        const cargoStationDistance = Math.hypot(cargo.position.x - STATION_X, cargo.position.y - STATION_Y);
        const cargoSpeed = Math.hypot(cargo.velocity.x, cargo.velocity.y);
        const readiness = clamp(
          (RECOVERY_RADIUS - cargoStationDistance) * 0.42 +
            (RECOVERY_SAFE_SPEED - cargoSpeed) * 22 +
            (RECOVERY_SAFE_TENSION - grappleTensionRef.current) * 0.22,
          0,
          100,
        );
        if (
          cargoStationDistance < RECOVERY_RADIUS * 0.74 &&
          cargoSpeed <= RECOVERY_SAFE_SPEED &&
          grappleTensionRef.current <= RECOVERY_SAFE_TENSION &&
          now - lastRecoveryRef.current > 720
        ) {
          recoverCargo(cargo, readiness);
        }
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

    for (const zone of hazardZonesRef.current) {
      const zoneX = zone.x + Math.sin(now * 0.00023 + zone.phase) * zone.driftX;
      const zoneY = zone.y + Math.cos(now * 0.00019 + zone.phase) * zone.driftY;
      const point = toScreen(zoneX, zoneY);
      const radius = zone.radius * zoom;
      if (point.x < -radius || point.x > width + radius || point.y < -radius || point.y > height + radius) continue;
      const color = zone.kind === "ion" ? "101, 230, 255" : zone.kind === "radiation" ? "255, 213, 106" : "255, 95, 112";
      const pulse = 0.5 + Math.sin(now * 0.003 + zone.phase) * 0.5;
      context.save();
      context.translate(point.x, point.y);
      context.fillStyle = `rgba(${color}, ${0.045 + pulse * 0.025})`;
      context.beginPath();
      context.arc(0, 0, radius, 0, Math.PI * 2);
      context.fill();
      context.strokeStyle = `rgba(${color}, ${0.32 + pulse * 0.24})`;
      context.lineWidth = 1.4;
      context.setLineDash([10, 8]);
      context.beginPath();
      context.arc(0, 0, radius, 0, Math.PI * 2);
      context.stroke();
      context.setLineDash([]);
      context.strokeStyle = `rgba(${color}, ${0.18 + pulse * 0.18})`;
      context.beginPath();
      context.arc(0, 0, radius * (0.5 + pulse * 0.18), 0, Math.PI * 2);
      context.stroke();
      context.fillStyle = `rgba(${color}, 0.95)`;
      context.font = "800 9px ui-monospace, monospace";
      context.fillText(zone.label, -radius + 10, -radius - 9);
      context.restore();
    }

    const station = toScreen(STATION_X, STATION_Y);
    context.save();
    context.translate(station.x, station.y);
    const flashAge = now - recoveryFlashRef.current;
    if (flashAge < 900) {
      context.strokeStyle = `rgba(255, 213, 106, ${1 - flashAge / 900})`;
      context.lineWidth = 4;
      context.beginPath();
      context.arc(0, 0, (RECOVERY_RADIUS + flashAge * 0.08) * zoom, 0, Math.PI * 2);
      context.stroke();
    }
    context.strokeStyle = "rgba(101, 230, 255, 0.22)";
    context.lineWidth = 2;
    context.setLineDash([12, 10]);
    context.beginPath();
    context.arc(0, 0, RECOVERY_RADIUS * zoom, 0, Math.PI * 2);
    context.stroke();
    context.setLineDash([]);
    context.fillStyle = "rgba(101, 230, 255, 0.72)";
    context.font = "800 9px ui-monospace, monospace";
    context.textAlign = "center";
    context.fillText("RECOVERY RING", 0, -RECOVERY_RADIUS * zoom - 12);
    context.textAlign = "start";
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
      if (lockTargetRef.current === body && !grappleConstraintRef.current) {
        const bracket = Math.max(25, Math.max(boundsWidth, boundsHeight) * 0.72);
        context.save();
        context.translate(point.x, point.y);
        context.strokeStyle = "rgba(255, 213, 106, 0.95)";
        context.lineWidth = 1.4;
        context.setLineDash([5, 5]);
        context.beginPath();
        context.arc(0, 0, bracket, 0, Math.PI * 2);
        context.stroke();
        context.setLineDash([]);
        context.fillStyle = "#ffd56a";
        context.font = "700 9px ui-monospace, monospace";
        context.fillText("GRAPPLE LOCK", bracket + 7, -6);
        context.fillStyle = "rgba(232,244,255,0.68)";
        context.fillText(`${Math.round(Math.hypot(body.position.x - ship.position.x, body.position.y - ship.position.y))}m`, bracket + 7, 7);
        context.restore();
      }
    }

    const grappleCargo = grappleTargetRef.current;
    if (grappleConstraintRef.current && grappleCargo) {
      const lineStart = toScreen(ship.position.x + Math.cos(ship.angle) * 22, ship.position.y + Math.sin(ship.angle) * 22);
      const lineEnd = toScreen(grappleCargo.position.x, grappleCargo.position.y);
      const gradient = context.createLinearGradient(lineStart.x, lineStart.y, lineEnd.x, lineEnd.y);
      gradient.addColorStop(0, "rgba(101,230,255,0.95)");
      gradient.addColorStop(0.72, grappleTensionRef.current > 72 ? "rgba(255,95,112,0.95)" : "rgba(255,213,106,0.9)");
      gradient.addColorStop(1, "rgba(255,255,255,0.9)");
      context.strokeStyle = gradient;
      context.lineWidth = grappleTensionRef.current > 72 ? 2.6 : 1.7;
      context.shadowColor = grappleTensionRef.current > 72 ? "#ff5f70" : "#65e6ff";
      context.shadowBlur = 9;
      context.setLineDash([7, 4]);
      context.lineDashOffset = -now * 0.03;
      context.beginPath();
      context.moveTo(lineStart.x, lineStart.y);
      context.lineTo(lineEnd.x, lineEnd.y);
      context.stroke();
      context.setLineDash([]);
      context.shadowBlur = 0;
      context.fillStyle = "rgba(3,9,19,0.84)";
      const labelX = (lineStart.x + lineEnd.x) / 2;
      const labelY = (lineStart.y + lineEnd.y) / 2;
      drawRoundedRect(context, labelX - 34, labelY - 12, 68, 21, 4);
      context.fill();
      context.fillStyle = grappleTensionRef.current > 72 ? "#ff7080" : "#b7f4ff";
      context.font = "700 9px ui-monospace, monospace";
      context.textAlign = "center";
      context.fillText(`${Math.round(grappleTensionRef.current)}% LOAD`, labelX, labelY + 2);
      context.textAlign = "start";
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
      const grappleObject = grappleTargetRef.current || lockTargetRef.current;
      const activeCargo = grappleTargetRef.current;
      const cargoDistance = activeCargo ? Math.round(Math.hypot(activeCargo.position.x - STATION_X, activeCargo.position.y - STATION_Y)) : 0;
      const cargoSpeed = activeCargo ? Math.hypot(activeCargo.velocity.x, activeCargo.velocity.y) : 0;
      const recoveryReadiness = activeCargo
        ? Math.round(clamp(
          (RECOVERY_RADIUS - cargoDistance) * 0.42 +
            (RECOVERY_SAFE_SPEED - cargoSpeed) * 22 +
            (RECOVERY_SAFE_TENSION - grappleTensionRef.current) * 0.22,
          0,
          100,
        ))
        : 0;
      const missionStatus: RecoveryStatus = recoveredRef.current >= CONTRACT_TARGET
        ? "complete"
        : activeCargo
          ? cargoDistance < RECOVERY_RADIUS
            ? "recover"
            : "tow"
          : "acquire";
      setTelemetry({
        speed: ship.speed,
        hull: Math.round(hullRef.current),
        fuel: Math.round(fuelRef.current),
        heading: formatHeading(ship.angle),
        distance: Math.round(targetDistance),
        collisions: collisionsRef.current,
        status: statusRef.current,
        grappleStatus: grappleStatusRef.current,
        grappleRange: grappleObject ? Math.round(Math.hypot(grappleObject.position.x - ship.position.x, grappleObject.position.y - ship.position.y)) : 0,
        grappleTension: Math.round(grappleTensionRef.current),
        cargoMass: grappleTargetRef.current ? Math.round(grappleTargetRef.current.mass * 10) / 10 : 0,
        cargoValue: grappleTargetRef.current?.plugin.value || 0,
        cargoDistance,
        recoveryReadiness,
        recovered: recoveredRef.current,
        contractTarget: CONTRACT_TARGET,
        credits: creditsRef.current,
        missionStatus,
        hazardLevel: Math.round(hazardLevelRef.current),
        hazardRange: hazardRangeRef.current,
        hazardAlert: hazardAlertRef.current,
      });
    }
    frameRef.current = window.requestAnimationFrame(draw);
  }, [recoverCargo, releaseGrapple, spawnThruster]);

  useEffect(() => {
    createStars();
    createWorld();
    const keyMap: Record<string, ControlKey> = {
      KeyW: "thrust", ArrowUp: "thrust", KeyA: "left", ArrowLeft: "left", KeyD: "right", ArrowRight: "right", KeyS: "brake", ArrowDown: "brake", ShiftLeft: "boost", ShiftRight: "boost", KeyR: "reel",
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.code === "KeyE" || event.code === "Space") && !event.repeat) {
        event.preventDefault();
        toggleGrapple();
        return;
      }
      if (event.code === "KeyX" && !event.repeat) {
        event.preventDefault();
        if (grappleConstraintRef.current) releaseGrapple("manual");
        return;
      }
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
  }, [createStars, createWorld, draw, releaseGrapple, setControl, toggleGrapple]);

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
          <span className="orbital-kicker"><Orbit size={15} /> Hazard route // phase D</span>
          <h1>ORBITAL<span>//</span>SALVAGE</h1>
          <p>Newtonian recovery ops with active hazard routing</p>
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
            <span>CONTRACT C-03</span>
            <strong>Recover {telemetry.contractTarget} salvage objects</strong>
            <p>Latch debris, avoid active hazard pockets, then slow the cargo inside the Helix recovery ring.</p>
            <div className="orbital-mission-progress">
              <i><b style={{ width: `${Math.min(100, (telemetry.recovered / telemetry.contractTarget) * 100)}%` }} /></i>
              <span>{telemetry.recovered}/{telemetry.contractTarget} banked</span>
            </div>
            <div className="orbital-contract-stats">
              <span><Crosshair size={14} /> {telemetry.cargoDistance ? `${telemetry.cargoDistance}m cargo` : `${telemetry.distance}m station`}</span>
              <span>{telemetry.credits} cr</span>
            </div>
          </div>
          <div className="orbital-help">
            <div className="orbital-panel-label"><Radio size={15} /> PILOT INPUT</div>
            <p><kbd>W</kbd> thrust <kbd>A</kbd><kbd>D</kbd> rotate</p>
            <p><kbd>S</kbd> brake <kbd>SHIFT</kbd> boost</p>
            <p><kbd>E</kbd> grapple <kbd>R</kbd> reel <kbd>X</kbd> release</p>
          </div>
        </aside>

        <div className="orbital-stage" ref={stageRef}>
          <canvas ref={canvasRef} onPointerDown={toggleGrapple} aria-label="Newtonian orbital flight simulation" />
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
            <div><i className="is-red" /><span><strong>{telemetry.hazardAlert === "clear" ? "HAZARD CLEAR" : telemetry.hazardAlert}</strong><small>{telemetry.hazardLevel}% exposure · {telemetry.hazardRange}m margin</small></span></div>
            <div><i className="is-white" /><span><strong>KESTREL</strong><small>{telemetry.speed.toFixed(1)}m/s · hull {telemetry.hull}%</small></span></div>
          </div>
          <div className={`orbital-hazard-panel ${telemetry.hazardLevel > 0 ? "is-hot" : ""}`}>
            <div className="orbital-panel-label"><AlertTriangle size={15} /> HAZARD SCAN</div>
            <div className="orbital-hazard-readout">
              <span>{telemetry.hazardAlert.toUpperCase()}</span>
              <strong>{telemetry.hazardLevel}%</strong>
            </div>
            <div className="orbital-hazard-meter">
              <i><b style={{ width: `${telemetry.hazardLevel}%` }} /></i>
              <span>{telemetry.hazardRange}m SAFE MARGIN</span>
            </div>
            <p>Radiation drains hull, ion wakes drain fuel, shrapnel spikes tether load.</p>
          </div>
          <div className={`orbital-grapple-panel is-${telemetry.grappleStatus}`}>
            <div className="orbital-panel-label"><Anchor size={15} /> GRAPPLE ARRAY</div>
            <div className="orbital-grapple-state">
              <span><i />{telemetry.grappleStatus.toUpperCase()}</span>
              <strong>{telemetry.grappleStatus === "latched" ? `${telemetry.grappleTension}%` : telemetry.grappleRange ? `${telemetry.grappleRange}m` : "---"}</strong>
            </div>
            <div className="orbital-tension"><i><b style={{ width: `${telemetry.grappleTension}%` }} /></i><span>LINE TENSION</span></div>
            {telemetry.grappleStatus === "latched" ? (
              <div className="orbital-cargo-data"><span>Mass <strong>{telemetry.cargoMass}t</strong></span><span>Estimate <strong>{telemetry.cargoValue} cr</strong></span></div>
            ) : <p>Point the bow toward salvage. Fire inside 620m.</p>}
            <button type="button" onClick={toggleGrapple}>{telemetry.grappleStatus === "latched" ? "Release tether" : "Fire grapple"}</button>
          </div>
          <div className={`orbital-recovery-panel is-${telemetry.missionStatus}`}>
            <div className="orbital-panel-label"><Sparkles size={15} /> RECOVERY OPS</div>
            <div className="orbital-recovery-state">
              <span>{telemetry.missionStatus.toUpperCase()}</span>
              <strong>{telemetry.recovered}/{telemetry.contractTarget}</strong>
            </div>
            <div className="orbital-recovery-meter">
              <i><b style={{ width: `${telemetry.recoveryReadiness}%` }} /></i>
              <span>{telemetry.recoveryReadiness}% DOCK HEALTH</span>
            </div>
            <div className="orbital-recovery-data">
              <span>Bank <strong>{telemetry.credits} cr</strong></span>
              <span>Cargo <strong>{telemetry.cargoDistance ? `${telemetry.cargoDistance}m` : "---"}</strong></span>
            </div>
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
          <button type="button" {...bindControl("reel")} aria-label="Reel tether"><Anchor size={20} /> REEL</button>
          <button type="button" className="is-thrust" {...bindControl("thrust")} aria-label="Thrust"><ArrowUp size={22} /> THRUST</button>
        </div>
        <button type="button" className="is-grapple" onClick={toggleGrapple} aria-label="Fire or release grapple"><Crosshair size={20} /> GRAPPLE</button>
      </div>
    </section>
  );
}
