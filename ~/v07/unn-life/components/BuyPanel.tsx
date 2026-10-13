"use client";

import { streetItems } from "@/lib/places";
import type { Needs } from "@/lib/playerStore";

export default function BuyPanel({ money, needs, onBuy, onClose }: {
  money: number; needs: Needs; onBuy: (id: string) => void; onClose: () => void;
}) {
  return (
    <div className="sheet">
      <button className="x" onClick={onClose} aria-label="Close">✕</button>
      <div className="sheet-head">
        <div className="badge">🛍️</div>
        <div><h2>Street buys</h2><div className="sub">Quick things, anywhere on campus</div></div>
      </div>
      {streetItems.map((i) => (
        <button key={i.id} className="opt" disabled={i.cost > money} onClick={() => onBuy(i.id)}>
          {i.emoji} {i.label} — ₦{i.cost.toLocaleString()}
          <small>{Object.entries(i.needs).map(([k, v]) => `${k} ${v! > 0 ? "+" : ""}${v}`).join(" • ")}</small>
        </button>
      ))}
      <div className="hint">Hunger {needs.hunger} • Energy {needs.energy}</div>
    </div>
  );
}
