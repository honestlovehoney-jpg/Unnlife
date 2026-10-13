"use client";

import type { Needs } from "@/lib/playerStore";
import type { Place } from "@/lib/places";
import { MODES, quote, type ModeId } from "@/lib/travel";

interface Props {
  place: Place;
  distance: number;
  atPlace: boolean;
  travelling: boolean;
  money: number;
  needs: Needs;
  mode: ModeId;
  setMode: (m: ModeId) => void;
  onGo: () => void;
  onAction: (actionId: string) => void;
  onClose: () => void;
}

export default function PlaceSheet(p: Props) {
  const m = MODES.find((x) => x.id === p.mode)!;
  const q = quote(p.distance, m);
  const broke = q.fare > p.money;

  return (
    <div className="sheet">
      <button className="x" onClick={p.onClose} aria-label="Close">✕</button>
      <div className="sheet-head">
        <div className="badge">{p.place.emoji}</div>
        <div>
          <h2>{p.place.name}</h2>
          <div className="sub">{p.place.kind}{p.atPlace ? " • You are here" : ` • ${Math.round(p.distance)} m away`}</div>
        </div>
      </div>
      <p className="blurb">{p.place.blurb}</p>

      <div className="pills">
        {p.place.actions.map((a) => {
          const tooTired = (a.needs.energy ?? 0) < 0 && p.needs.energy < -(a.needs.energy ?? 0);
          const noCash = (a.cost ?? 0) > p.money;
          const off = !p.atPlace || tooTired || noCash;
          return (
            <button key={a.id} className="pill" disabled={off} onClick={() => p.onAction(a.id)}>
              {a.emoji} {a.label}
              {a.cost ? ` • ₦${a.cost.toLocaleString()}` : a.earn ? ` • +₦${a.earn.toLocaleString()}` : ""}
              {tooTired ? " • too tired" : noCash ? " • no cash" : ""}
            </button>
          );
        })}
      </div>
      {!p.atPlace && <div className="hint">Go there first to do things.</div>}

      {!p.atPlace && (
        <>
          <div className="modes">
            {MODES.map((x) => {
              const qq = quote(p.distance, x);
              return (
                <button key={x.id} className={`mode${x.id === p.mode ? " on" : ""}`} onClick={() => p.setMode(x.id)}>
                  <div className="mode-e">{x.emoji}</div>
                  <div className="mode-l">{x.label}</div>
                  <div className="mode-p">{qq.fare ? `₦${qq.fare}` : "Free"}</div>
                </button>
              );
            })}
          </div>
          <button className="go" disabled={p.travelling || broke} onClick={p.onGo}>
            {p.travelling ? "Travelling…" : broke ? "Not enough money" : `Go · ${q.fare ? `₦${q.fare}` : "Free"} · ${q.minutes} min`}
          </button>
        </>
      )}
    </div>
  );
}
