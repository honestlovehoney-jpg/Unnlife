export type ModeId = "trek" | "keke" | "okada" | "cab";

export interface Mode {
  id: ModeId;
  emoji: string;
  label: string;
  base: number;    // naira
  perM: number;    // naira per metre
  mPerMin: number; // game metres per game-minute
  animMps: number; // on-screen metres per real second
}

export const MODES: Mode[] = [
  { id: "trek", emoji: "🚶", label: "Trek", base: 0, perM: 0, mPerMin: 80, animMps: 70 },
  { id: "keke", emoji: "🛺", label: "Keke", base: 50, perM: 0.1, mPerMin: 350, animMps: 130 },
  { id: "okada", emoji: "🏍️", label: "Okada", base: 100, perM: 0.2, mPerMin: 550, animMps: 190 },
  { id: "cab", emoji: "🚕", label: "Cab", base: 300, perM: 0.4, mPerMin: 650, animMps: 240 },
];

export function distanceM(a: [number, number], b: [number, number]): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b[1] - a[1]);
  const dLng = toRad(b[0] - a[0]);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a[1])) * Math.cos(toRad(b[1])) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export interface Quote { fare: number; minutes: number; durationMs: number; energy: number }

export function quote(distM: number, m: Mode): Quote {
  const fare = m.id === "trek" ? 0 : Math.round((m.base + distM * m.perM) / 10) * 10;
  return {
    fare,
    minutes: Math.max(1, Math.round(distM / m.mPerMin)),
    durationMs: Math.min(14000, Math.max(1500, (distM / m.animMps) * 1000)),
    energy: m.id === "trek" ? Math.round(distM / 150) : 0,
  };
}

export const AT_PLACE_M = 80;

export function clockLabel(gameMinutes: number) {
  const day = Math.floor(gameMinutes / 1440) + 1;
  const mins = gameMinutes % 1440;
  const h24 = Math.floor(mins / 60);
  const mm = String(mins % 60).padStart(2, "0");
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  const night = h24 < 6 || h24 >= 19;
  return {
    day,
    time: `${h12}:${mm} ${h24 < 12 ? "AM" : "PM"}`,
    weather: night ? "🌙 Night" : h24 < 11 ? "🌤️ Morning" : h24 < 16 ? "☀️ Sunny" : "🌇 Evening",
  };
}
