"use client";

import { useState } from "react";
import { roomSvg, type RoomTheme } from "@/lib/roomScene";
import { ROOM_OBJECTS, type RoomAction } from "@/lib/roomActions";
import type { Needs } from "@/lib/playerStore";

interface Props {
  theme: RoomTheme;
  bunks: number;
  people: number;
  night: boolean;
  money: number;
  needs: Needs;
  onAct: (a: RoomAction) => void;
  onOutside: () => void;
}

export default function RoomView({ theme, bunks, people, night, money, needs, onAct, onOutside }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const svg = roomSvg({ theme, bunks, people, night, selected });
  const obj = selected ? ROOM_OBJECTS[selected] : null;

  const tap = (e: React.MouseEvent<HTMLDivElement>) => {
    const t = (e.target as Element).closest("[data-obj]");
    setSelected(t ? t.getAttribute("data-obj") : null);
  };

  return (
    <div>
      <div className="room" onClick={tap} dangerouslySetInnerHTML={{ __html: svg }} />
      {!obj && <div className="hint">Tap something in your room: your bed, desk, buckets, cooker or the door.</div>}
      {obj && (
        <div className="room-actions">
          <div className="room-title">{obj.emoji} {obj.title}</div>
          <div className="pills">
            {selected === "door" && (
              <button className="pill" onClick={onOutside}>🚶 Go outside</button>
            )}
            {obj.actions.map((a) => {
              const noCash = (a.cost ?? 0) > money;
              const tired = (a.needs.energy ?? 0) < 0 && needs.energy < -(a.needs.energy ?? 0);
              const alone = !!a.needsPeople && people === 0;
              const off = noCash || tired || alone;
              return (
                <button key={a.id} className="pill" disabled={off} onClick={() => onAct(a)}>
                  {a.emoji} {a.label}
                  {a.cost ? ` • ₦${a.cost.toLocaleString()}` : ""}
                  {alone ? " • nobody here" : tired ? " • too tired" : noCash ? " • no cash" : ""}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
