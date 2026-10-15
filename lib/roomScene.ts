/**
 * Isometric room scene (low-poly toy look), drawn as an SVG string.
 * Pure function: no React, so it can be tested and previewed on its own.
 * Objects carry data-obj="..." so the Home screen can react to taps.
 */

export type RoomTheme = "girls" | "boys" | "flat";

export interface RoomOptions {
  theme: RoomTheme;
  /** number of bunk beds (hostel) - ignored for flats */
  bunks: number;
  /** number of roommates standing in the room */
  people: number;
  night: boolean;
  selected: string | null;
}

const TW = 32; // half tile width
const TH = 16; // half tile height
const TZ = 34; // pixels per unit of height
const OX = 270;
const OY = 132;
const N = 8; // room is N x N units
const WALL_H = 3;

const px = (x: number, y: number, z: number): [number, number] => [OX + (x - y) * TW, OY + (x + y) * TH - z * TZ];
const pts = (list: [number, number, number][]) =>
  list.map(([x, y, z]) => px(x, y, z).map((n) => n.toFixed(1)).join(",")).join(" ");

function shade(hex: string, f: number): string {
  const n = parseInt(hex.slice(1), 16);
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v * f)));
  const r = c((n >> 16) & 255), g = c((n >> 8) & 255), b = c(n & 255);
  return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

/** an isometric box; returns svg for the top, left-front and right-front faces */
function box(x: number, y: number, z: number, w: number, d: number, h: number, color: string, line = 0.35): string {
  const top = pts([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]]);
  const left = pts([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]]);
  const right = pts([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]]);
  const st = `stroke="${shade(color, 0.55)}" stroke-width="${line}" stroke-linejoin="round"`;
  return (
    `<polygon points="${left}" fill="${shade(color, 0.86)}" ${st}/>` +
    `<polygon points="${right}" fill="${shade(color, 0.68)}" ${st}/>` +
    `<polygon points="${top}" fill="${shade(color, 1.08)}" ${st}/>`
  );
}

interface Item { depth: number; svg: string }

function obj(id: string, depth: number, svg: string, selected: string | null): Item {
  const sel = selected === id ? ' style="filter:drop-shadow(0 0 5px #ffffff) drop-shadow(0 0 2px #fde047) brightness(1.12)"' : "";
  return { depth, svg: `<g data-obj="${id}" class="rm-obj"${sel}>${svg}</g>` };
}

function person(x: number, y: number, shirt: string, skin: string, hair: string): string {
  const legs = box(x + 0.12, y + 0.12, 0, 0.26, 0.26, 0.85, "#2d3340");
  const torso = box(x + 0.05, y + 0.08, 0.85, 0.4, 0.34, 0.8, shirt);
  const [hx, hy] = px(x + 0.25, y + 0.25, 2.05);
  return (
    legs + torso +
    `<circle cx="${hx.toFixed(1)}" cy="${hy.toFixed(1)}" r="9" fill="${skin}" stroke="${shade(skin, 0.6)}" stroke-width=".6"/>` +
    `<path d="M${(hx - 9).toFixed(1)} ${(hy - 1).toFixed(1)} a9 9 0 0 1 18 0 q-9 -4 -18 0z" fill="${hair}"/>`
  );
}

function bunk(x: number, y: number, tint: string): string {
  const metal = "#6b7683";
  let s = "";
  // head against the wall (x small), feet toward the room
  s += box(x, y, 0.45, 2.1, 1.05, 0.18, "#cfcac0");
  s += box(x + 0.7, y + 0.05, 0.63, 1.4, 0.95, 0.08, tint);
  s += box(x + 0.08, y + 0.1, 0.63, 0.45, 0.85, 0.1, "#f4f1ea");
  s += box(x, y, 1.55, 2.1, 1.05, 0.18, "#d6d1c7");
  s += box(x + 0.7, y + 0.05, 1.73, 1.4, 0.95, 0.08, shade(tint, 0.85));
  s += box(x + 0.08, y + 0.1, 1.73, 0.45, 0.85, 0.1, "#f4f1ea");
  for (const [dx, dy] of [[-0.06, -0.06], [2.08, -0.06], [-0.06, 1.04], [2.08, 1.04]]) {
    s += box(x + dx, y + dy, 0, 0.08, 0.08, 2.35, metal, 0.2);
  }
  return s;
}

function bed(x: number, y: number, tint: string): string {
  return (
    box(x, y, 0, 1.7, 2.3, 0.35, "#9a6a3a") +
    box(x + 0.06, y + 0.06, 0.35, 1.58, 2.18, 0.22, "#e9e4da") +
    box(x + 0.1, y + 0.9, 0.57, 1.5, 1.4, 0.1, tint) +
    box(x + 0.2, y + 0.12, 0.57, 1.3, 0.55, 0.16, "#ffffff") +
    box(x + 1.5, y - 0.05, 0, 0.2, 2.4, 0.85, "#7d522b")
  );
}

function chair(x: number, y: number): string {
  return (
    box(x + 0.08, y + 0.08, 0, 0.08, 0.08, 0.5, "#9aa1a9", 0.2) +
    box(x + 0.54, y + 0.08, 0, 0.08, 0.08, 0.5, "#9aa1a9", 0.2) +
    box(x + 0.08, y + 0.54, 0, 0.08, 0.08, 0.5, "#9aa1a9", 0.2) +
    box(x + 0.54, y + 0.54, 0, 0.08, 0.08, 0.5, "#9aa1a9", 0.2) +
    box(x, y, 0.5, 0.7, 0.7, 0.1, "#ea6a3a") +
    box(x, y + 0.6, 0.6, 0.7, 0.1, 0.65, "#ea6a3a")
  );
}

function desk(x: number, y: number): string {
  return (
    box(x, y, 0.82, 2.1, 0.95, 0.12, "#c89a63") +
    box(x + 0.05, y + 0.05, 0, 0.1, 0.1, 0.82, "#8a6b43", 0.2) +
    box(x + 1.95, y + 0.05, 0, 0.1, 0.1, 0.82, "#8a6b43", 0.2) +
    box(x + 0.05, y + 0.8, 0, 0.1, 0.1, 0.82, "#8a6b43", 0.2) +
    box(x + 1.95, y + 0.8, 0, 0.1, 0.1, 0.82, "#8a6b43", 0.2) +
    // books and a lamp
    box(x + 0.2, y + 0.25, 0.94, 0.5, 0.38, 0.12, "#3b6fb6") +
    box(x + 0.22, y + 0.27, 1.06, 0.46, 0.34, 0.1, "#d95a4a") +
    box(x + 1.3, y + 0.3, 0.94, 0.5, 0.36, 0.05, "#2f343d") +
    box(x + 1.4, y + 0.28, 0.99, 0.3, 0.04, 0.26, "#3d434d")
  );
}

function locker(x: number, y: number): string {
  return (
    box(x, y, 0, 1.0, 0.8, 1.9, "#8aa0ad") +
    box(x + 0.85, y + 0.8, 0.9, 0.08, 0.02, 0.18, "#e7edf1", 0.1)
  );
}

function bucket(x: number, y: number, c = "#3b78c4"): string {
  return box(x, y, 0, 0.46, 0.46, 0.55, c) + box(x + 0.04, y + 0.04, 0.55, 0.38, 0.38, 0.03, "#9fd4f2", 0.1);
}

function stove(x: number, y: number): string {
  return (
    box(x, y, 0, 1.1, 0.8, 0.85, "#aab1b8") +
    box(x + 0.12, y + 0.14, 0.85, 0.42, 0.42, 0.32, "#3a3f47") +
    box(x + 0.16, y + 0.18, 1.17, 0.34, 0.34, 0.05, "#757d87") +
    box(x + 0.7, y + 0.12, 0.85, 0.3, 0.3, 0.06, "#2b2f36")
  );
}

function shower(x: number, y: number): string {
  return box(x, y, 0, 1.1, 1.1, 2.2, "#dbe9f1") + box(x + 0.08, y + 0.08, 0.1, 0.94, 0.94, 2.0, "#bfd7e4");
}

function sofa(x: number, y: number): string {
  return box(x, y, 0, 1.0, 1.8, 0.55, "#c9b8a6") + box(x - 0.18, y, 0.2, 0.2, 1.8, 0.8, "#b4a28e");
}

export function roomSvg(o: RoomOptions): string {
  const girls = o.theme === "girls", flat = o.theme === "flat";
  const wallB = flat ? "#f2c95a" : girls ? "#f2d4cd" : "#f1e2a6";
  const wallA = shade(wallB, 0.88);
  const floorA = flat ? "#d19b5b" : "#cdc8be";
  const floorB = flat ? "#bf8946" : "#bdb8ad";
  const items: Item[] = [];
  const sel = o.selected;

  // ---- furniture ----
  if (flat) {
    items.push(obj("bed", 1.2 + 1.5, bed(0.3, 1.2, "#d6453d"), sel));
    items.push(obj("desk", 2.4 + 2.2, desk(2.4, 0.2), sel));
    items.push(obj("desk", 3.5 + 2.2, chair(3.0, 1.35), sel));
    items.push(obj("stove", 6.5 + 1.2, stove(6.2, 0.4), sel));
    items.push(obj("shower", 0.4 + 6.0 + 1.0, shower(0.4, 6.0), sel));
    items.push(obj("sofa", 4.3 + 4.4 + 0.9, sofa(4.3, 4.4), sel));
    items.push(obj("bucket", 5 + 5.1, bucket(5.2, 5.2), sel));
  } else {
    const n = Math.max(1, Math.min(4, o.bunks));
    const tints = ["#4f7fbf", "#c85a4b", "#4f9a6b", "#8a62b8"];
    for (let i = 0; i < n; i++) {
      const y = 0.55 + i * 1.3;
      items.push(obj("bed", 1.3 + y + 0.5, bunk(0.2, y, tints[i % 4]), sel));
    }
    items.push(obj("desk", 3.1 + 0.6, desk(3.0, 0.15), sel));
    items.push(obj("desk", 4.1 + 1.6, chair(3.6, 1.2), sel));
    items.push(obj("locker", 6.8 + 0.4, locker(6.0, 0.2) + locker(7.0, 0.2), sel));
    items.push(obj("stove", 3.9 + 6.0, stove(3.6, 5.8), sel));
    items.push(obj("bucket", 5.3 + 6.4, bucket(5.2, 6.2) + bucket(5.8, 6.55, "#d25040"), sel));
  }

  // ---- people ----
  const shirts = ["#e0a02f", "#4a8f6e", "#b94a6b", "#4f6fb8"];
  const spots: [number, number][] = [[3.3, 3.3], [4.5, 3.9], [5.4, 2.6], [4.2, 5.0]];
  const present = Math.max(0, Math.min(4, o.people));
  for (let i = 0; i < present; i++) {
    const [x, y] = spots[i];
    items.push(obj("roommates", x + y, person(x, y, shirts[i % 4], i % 2 ? "#8a5a3b" : "#5e3b26", "#1a1410"), sel));
  }
  items.push({ depth: 5.8 + 4.3, svg: person(5.8, 4.3, "#f1d27b", "#7a4a2f", "#120c08") });

  items.sort((a, b) => a.depth - b.depth);

  // ---- walls and floor ----
  const floor: string[] = [];
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      floor.push(`<polygon points="${pts([[i, j, 0], [i + 1, j, 0], [i + 1, j + 1, 0], [i, j + 1, 0]])}" fill="${(i + j) % 2 ? floorA : floorB}"/>`);
    }
  }
  const wallAPoly = pts([[0, 0, 0], [0, N, 0], [0, N, WALL_H], [0, 0, WALL_H]]);
  const wallBPoly = pts([[0, 0, 0], [N, 0, 0], [N, 0, WALL_H], [0, 0, WALL_H]]);
  const baseA = pts([[0, 0, 0], [0, N, 0], [0, N, 0.22], [0, 0, 0.22]]);
  const baseB = pts([[0, 0, 0], [N, 0, 0], [N, 0, 0.22], [0, 0, 0.22]]);
  const trimA = pts([[0, 0, WALL_H - 0.08], [0, N, WALL_H - 0.08], [0, N, WALL_H], [0, 0, WALL_H]]);
  const trimB = pts([[0, 0, WALL_H - 0.08], [N, 0, WALL_H - 0.08], [N, 0, WALL_H], [0, 0, WALL_H]]);

  const skyDay = "#8ec9ee", skyNight = "#16224a";
  const sky = o.night ? skyNight : skyDay;
  // window on the back-right wall, door on the back-left wall
  const win = pts([[6.2, 0, 1.15], [7.7, 0, 1.15], [7.7, 0, 2.5], [6.2, 0, 2.5]]);
  let louvre = "";
  for (let k = 0; k < 6; k++) {
    const z = 1.25 + k * 0.2;
    louvre += `<polyline points="${pts([[6.2, 0, z], [7.7, 0, z]])}" stroke="#ffffff" stroke-opacity=".8" stroke-width="1.4"/>`;
  }
  const door = pts([[0, 6.1, 0], [0, 7.4, 0], [0, 7.4, 2.25], [0, 6.1, 2.25]]);
  const [dkx, dky] = px(0, 6.45, 1.05);
  const poster1 = pts([[0, 2.0, 1.5], [0, 2.9, 1.5], [0, 2.9, 2.5], [0, 2.0, 2.5]]);
  const poster2 = pts([[1.3, 0, 1.4], [2.2, 0, 1.4], [2.2, 0, 2.4], [1.3, 0, 2.4]]);

  const bulbs = [[3.4, 0], [5.4, 0]].map(([x, y]) => px(x, y, 2.55));
  const glow = bulbs
    .map(([bx, by]) => `<circle cx="${bx.toFixed(1)}" cy="${(by + 8).toFixed(1)}" r="${o.night ? 80 : 26}" fill="url(#rmglow)" opacity="${o.night ? 0.85 : 0.35}"/>`)
    .join("");
  const bulbShapes = bulbs
    .map(([bx, by]) => `<circle cx="${bx.toFixed(1)}" cy="${(by + 8).toFixed(1)}" r="5" fill="#fff6c2" stroke="#d9b64a" stroke-width=".8"/><rect x="${(bx - 3).toFixed(1)}" y="${(by - 6).toFixed(1)}" width="6" height="8" fill="#6b7683"/>`)
    .join("");

  const night = o.night
    ? `<rect x="0" y="0" width="540" height="400" fill="#0b1234" opacity=".5" pointer-events="none"/>`
    : "";

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 400" width="100%" role="img" aria-label="Your room">` +
    `<defs><radialGradient id="rmglow"><stop offset="0" stop-color="#fff2b0" stop-opacity="1"/><stop offset="1" stop-color="#fff2b0" stop-opacity="0"/></radialGradient></defs>` +
    // wall and floor structure
    `<polygon points="${wallAPoly}" fill="${wallA}" stroke="${shade(wallA, 0.7)}" stroke-width=".6"/>` +
    `<polygon points="${wallBPoly}" fill="${wallB}" stroke="${shade(wallB, 0.7)}" stroke-width=".6"/>` +
    `<polygon points="${trimA}" fill="${shade(wallA, 0.8)}"/><polygon points="${trimB}" fill="${shade(wallB, 0.8)}"/>` +
    floor.join("") +
    `<polygon points="${baseA}" fill="${shade(wallA, 0.72)}"/><polygon points="${baseB}" fill="${shade(wallB, 0.72)}"/>` +
    // decorations
    `<polygon points="${poster1}" fill="#e85d75"/><polygon points="${poster2}" fill="#4a90d9"/>` +
    `<g data-obj="window" class="rm-obj"><polygon points="${win}" fill="${sky}" stroke="#7a828c" stroke-width="2"/>${louvre}</g>` +
    `<g data-obj="door" class="rm-obj"><polygon points="${door}" fill="#8a5a35" stroke="#5a3a20" stroke-width="1.4"/><circle cx="${dkx.toFixed(1)}" cy="${dky.toFixed(1)}" r="2.6" fill="#e9c46a"/></g>` +
    bulbShapes +
    // furniture and people, far to near
    items.map((i) => i.svg).join("") +
    glow +
    night +
    `</svg>`
  );
}
