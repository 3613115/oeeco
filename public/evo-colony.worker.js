/* EVO//COLONY deterministic artificial-life simulation. Runs away from the UI thread. */
const WORLD = { width: 1600, height: 900 };
const TICK_MS = 32;
const MAX_AGENTS = 420;
const MAX_FOOD = 760;

let agents = [];
let food = [];
let seed = 834721;
let randomState = seed;
let tick = 0;
let paused = false;
let speed = 1;
let climate = { temperature: 0.64, fertility: 0.72, toxicity: 0, event: "Stable cycle", eventTicks: 0 };
let history = [];
let nextId = 1;

function random() {
  randomState |= 0;
  randomState = (randomState + 0x6d2b79f5) | 0;
  let value = randomState;
  value = Math.imul(value ^ (value >>> 15), value | 1);
  value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
  return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
}

function between(min, max) {
  return min + random() * (max - min);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function wrap(value, limit) {
  if (value < 0) return value + limit;
  if (value >= limit) return value - limit;
  return value;
}

function deltaWrapped(a, b, limit) {
  let delta = b - a;
  if (delta > limit / 2) delta -= limit;
  if (delta < -limit / 2) delta += limit;
  return delta;
}

function makeGenome(parent) {
  if (!parent) {
    return {
      speed: between(0.65, 1.35),
      sense: between(70, 190),
      size: between(3.8, 8.6),
      metabolism: between(0.68, 1.25),
      aggression: between(0.02, 0.88),
      sociability: between(-0.7, 0.8),
      hue: between(150, 330),
      turn: between(0.055, 0.14),
    };
  }
  const rate = 0.12;
  const mutate = (value, amount, min, max) => clamp(value + between(-amount, amount) * (random() < rate ? 2.4 : 0.45), min, max);
  return {
    speed: mutate(parent.speed, 0.16, 0.42, 1.85),
    sense: mutate(parent.sense, 22, 38, 270),
    size: mutate(parent.size, 0.8, 2.8, 11.5),
    metabolism: mutate(parent.metabolism, 0.13, 0.45, 1.65),
    aggression: mutate(parent.aggression, 0.14, 0, 1),
    sociability: mutate(parent.sociability, 0.18, -1, 1),
    hue: (parent.hue + between(-13, 13) + 360) % 360,
    turn: mutate(parent.turn, 0.018, 0.025, 0.22),
  };
}

function makeAgent(x, y, genome, generation = 1, energy = 72) {
  const angle = between(0, Math.PI * 2);
  return {
    id: nextId++,
    x: x ?? between(0, WORLD.width),
    y: y ?? between(0, WORLD.height),
    vx: Math.cos(angle),
    vy: Math.sin(angle),
    energy,
    age: 0,
    generation,
    genome: makeGenome(genome),
    kills: 0,
    children: 0,
  };
}

function spawnFood(amount, clustered = false) {
  for (let index = 0; index < amount && food.length < MAX_FOOD; index += 1) {
    const cx = clustered ? between(120, WORLD.width - 120) : between(0, WORLD.width);
    const cy = clustered ? between(100, WORLD.height - 100) : between(0, WORLD.height);
    food.push({
      x: wrap(cx + (clustered ? between(-120, 120) : 0), WORLD.width),
      y: wrap(cy + (clustered ? between(-90, 90) : 0), WORLD.height),
      value: between(13, 24),
      toxin: climate.toxicity > 0.25 && random() < climate.toxicity * 0.45,
    });
  }
}

function reset(nextSeed) {
  seed = Number.isFinite(nextSeed) ? Math.abs(Math.floor(nextSeed)) || 1 : 834721;
  randomState = seed;
  tick = 0;
  nextId = 1;
  climate = { temperature: 0.64, fertility: 0.72, toxicity: 0, event: "Stable cycle", eventTicks: 0 };
  agents = Array.from({ length: 126 }, () => makeAgent());
  food = [];
  history = [];
  spawnFood(390, true);
  emit(true);
}

function nearestTarget(agent) {
  let target = null;
  let bestDistance = agent.genome.sense * agent.genome.sense;
  let kind = "food";

  for (let index = 0; index < food.length; index += 1) {
    const item = food[index];
    const dx = deltaWrapped(agent.x, item.x, WORLD.width);
    const dy = deltaWrapped(agent.y, item.y, WORLD.height);
    const distance = dx * dx + dy * dy;
    if (distance < bestDistance) {
      target = item;
      bestDistance = distance;
      kind = "food";
    }
  }

  if (agent.genome.aggression > 0.46) {
    for (let index = 0; index < agents.length; index += 1) {
      const other = agents[index];
      if (other.id === agent.id || other.genome.size > agent.genome.size * 0.9) continue;
      const dx = deltaWrapped(agent.x, other.x, WORLD.width);
      const dy = deltaWrapped(agent.y, other.y, WORLD.height);
      const distance = dx * dx + dy * dy;
      if (distance < bestDistance * agent.genome.aggression) {
        target = other;
        bestDistance = distance;
        kind = "prey";
      }
    }
  }

  return target ? { target, distance: Math.sqrt(bestDistance), kind } : null;
}

function simulateStep() {
  tick += 1;
  if (climate.eventTicks > 0) climate.eventTicks -= 1;
  if (climate.eventTicks === 0 && climate.event !== "Stable cycle") {
    climate = { temperature: 0.64, fertility: 0.72, toxicity: 0, event: "Stable cycle", eventTicks: 0 };
  }

  const births = [];
  const dead = new Set();
  const crowdSample = agents.length > 280 ? 8 : 14;

  for (let index = 0; index < agents.length; index += 1) {
    const agent = agents[index];
    agent.age += 1;
    const targetInfo = nearestTarget(agent);
    let desiredX = agent.vx;
    let desiredY = agent.vy;

    if (targetInfo) {
      desiredX = deltaWrapped(agent.x, targetInfo.target.x, WORLD.width) / Math.max(1, targetInfo.distance);
      desiredY = deltaWrapped(agent.y, targetInfo.target.y, WORLD.height) / Math.max(1, targetInfo.distance);
    } else {
      const wander = Math.sin((tick + agent.id * 13) * 0.018) * 0.55;
      desiredX = agent.vx * Math.cos(wander) - agent.vy * Math.sin(wander);
      desiredY = agent.vx * Math.sin(wander) + agent.vy * Math.cos(wander);
    }

    if (Math.abs(agent.genome.sociability) > 0.12 && agents.length > 1) {
      let socialX = 0;
      let socialY = 0;
      for (let sample = 0; sample < crowdSample; sample += 1) {
        const other = agents[(index + 1 + sample * 7) % agents.length];
        if (!other || other.id === agent.id) continue;
        const dx = deltaWrapped(agent.x, other.x, WORLD.width);
        const dy = deltaWrapped(agent.y, other.y, WORLD.height);
        const distance = Math.hypot(dx, dy);
        if (distance < 110 && distance > 0) {
          socialX += dx / distance;
          socialY += dy / distance;
        }
      }
      desiredX += socialX * agent.genome.sociability * 0.07;
      desiredY += socialY * agent.genome.sociability * 0.07;
    }

    const turn = agent.genome.turn;
    agent.vx += (desiredX - agent.vx) * turn;
    agent.vy += (desiredY - agent.vy) * turn;
    const velocity = Math.max(0.001, Math.hypot(agent.vx, agent.vy));
    const coldPenalty = climate.temperature < 0.35 ? 0.72 : 1;
    const pace = agent.genome.speed * coldPenalty * (0.72 + agent.energy / 180);
    agent.vx = (agent.vx / velocity) * pace;
    agent.vy = (agent.vy / velocity) * pace;
    agent.x = wrap(agent.x + agent.vx, WORLD.width);
    agent.y = wrap(agent.y + agent.vy, WORLD.height);

    const cost = (0.021 + agent.genome.speed * 0.012 + agent.genome.size * 0.0022) * agent.genome.metabolism;
    agent.energy -= cost + climate.toxicity * 0.008;

    if (targetInfo && targetInfo.distance < agent.genome.size + 5) {
      if (targetInfo.kind === "food") {
        const foodIndex = food.indexOf(targetInfo.target);
        if (foodIndex >= 0) {
          agent.energy += targetInfo.target.toxin ? -18 : targetInfo.target.value;
          food.splice(foodIndex, 1);
        }
      } else {
        const prey = targetInfo.target;
        if (!dead.has(prey.id) && agent.energy > prey.energy * 0.45) {
          dead.add(prey.id);
          agent.energy += Math.max(8, prey.energy * 0.42);
          agent.kills += 1;
        }
      }
    }

    const maturity = 500 + agent.genome.size * 28;
    if (agent.energy > 122 && agent.age > maturity && agents.length + births.length < MAX_AGENTS && random() < 0.012) {
      agent.energy *= 0.53;
      agent.children += 1;
      births.push(makeAgent(agent.x + between(-9, 9), agent.y + between(-9, 9), agent.genome, agent.generation + 1, agent.energy * 0.82));
    }

    if (agent.energy <= 0 || agent.age > 7600 + agent.genome.metabolism * 1300) dead.add(agent.id);
  }

  agents = agents.filter((agent) => !dead.has(agent.id)).concat(births);

  const foodRate = climate.fertility * (climate.temperature > 0.3 ? 1 : 0.45);
  if (random() < foodRate * 0.92) spawnFood(agents.length < 80 ? 3 : 1, random() < 0.09);
  if (agents.length < 24) {
    const survivors = agents.slice().sort((a, b) => b.energy - a.energy);
    while (agents.length < 42) {
      const parent = survivors[Math.floor(random() * Math.max(1, survivors.length))];
      agents.push(makeAgent(undefined, undefined, parent?.genome, (parent?.generation || 0) + 1, 70));
    }
  }

  if (tick % 90 === 0) recordHistory();
}

function diversity() {
  if (!agents.length) return 0;
  const average = agents.reduce((sum, agent) => sum + agent.genome.hue, 0) / agents.length;
  const variance = agents.reduce((sum, agent) => sum + Math.pow(agent.genome.hue - average, 2), 0) / agents.length;
  return clamp(Math.sqrt(variance) / 1.8, 0, 100);
}

function recordHistory() {
  const averageEnergy = agents.reduce((sum, agent) => sum + agent.energy, 0) / Math.max(1, agents.length);
  history.push({
    tick,
    population: agents.length,
    food: food.length,
    energy: Math.round(averageEnergy),
    diversity: Math.round(diversity()),
  });
  if (history.length > 72) history.shift();
}

function emit(force = false) {
  if (!force && tick % 2 !== 0) return;
  const oldest = agents.reduce((best, agent) => (!best || agent.generation > best.generation ? agent : best), null);
  postMessage({
    type: "snapshot",
    seed,
    tick,
    agents: agents.map((agent) => ({
      id: agent.id,
      x: agent.x,
      y: agent.y,
      vx: agent.vx,
      vy: agent.vy,
      energy: Math.round(agent.energy),
      age: agent.age,
      generation: agent.generation,
      kills: agent.kills,
      children: agent.children,
      genome: agent.genome,
    })),
    food: food.map((item) => ({ x: item.x, y: item.y, toxin: item.toxin })),
    climate,
    history,
    stats: {
      population: agents.length,
      food: food.length,
      maxGeneration: oldest?.generation || 1,
      diversity: Math.round(diversity()),
      predators: agents.filter((agent) => agent.genome.aggression > 0.62).length,
      averageEnergy: Math.round(agents.reduce((sum, agent) => sum + agent.energy, 0) / Math.max(1, agents.length)),
    },
  });
}

function triggerEvent(event) {
  if (event === "bloom") {
    climate = { temperature: 0.7, fertility: 1, toxicity: 0, event: "Nutrient bloom", eventTicks: 650 };
    spawnFood(230, true);
  }
  if (event === "drought") {
    climate = { temperature: 0.9, fertility: 0.08, toxicity: 0, event: "Deep drought", eventTicks: 760 };
    food = food.slice(0, Math.floor(food.length * 0.34));
  }
  if (event === "freeze") {
    climate = { temperature: 0.16, fertility: 0.2, toxicity: 0, event: "Cryo winter", eventTicks: 720 };
  }
  if (event === "toxin") {
    climate = { temperature: 0.62, fertility: 0.58, toxicity: 0.9, event: "Toxic bloom", eventTicks: 690 };
    food.forEach((item) => { if (random() < 0.48) item.toxin = true; });
  }
  if (event === "predators") {
    climate.event = "Apex emergence";
    climate.eventTicks = 680;
    for (let index = 0; index < 15; index += 1) {
      const genome = makeGenome();
      genome.aggression = between(0.82, 1);
      genome.size = between(8.4, 11.2);
      genome.speed = between(1.12, 1.58);
      genome.hue = between(342, 359);
      agents.push(makeAgent(undefined, undefined, genome, 1, 96));
    }
  }
  emit(true);
}

onmessage = (event) => {
  const message = event.data || {};
  if (message.type === "reset") reset(Number(message.seed));
  if (message.type === "pause") paused = Boolean(message.paused);
  if (message.type === "speed") speed = clamp(Number(message.speed) || 1, 0.5, 4);
  if (message.type === "event") triggerEvent(message.event);
  if (message.type === "inspect") {
    const agent = agents.find((item) => item.id === message.id);
    postMessage({ type: "inspection", agent: agent || null });
  }
};

setInterval(() => {
  if (paused) return;
  const steps = Math.max(1, Math.round(speed * 2));
  for (let index = 0; index < steps; index += 1) simulateStep();
  emit();
}, TICK_MS);

reset(seed);
