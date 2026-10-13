"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePlayerStore } from "@/lib/playerStore";
import { getPlace, streetItems } from "@/lib/places";
import { AT_PLACE_M, MODES, clockLabel, distanceM, quote, type ModeId } from "@/lib/travel";
import type { TravelState } from "@/components/MapView";
import PlaceSheet from "@/components/PlaceSheet";
import PhonePanel from "@/components/PhonePanel";
import HomePanel from "@/components/HomePanel";
import BuyPanel from "@/components/BuyPanel";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

type Tab = "map" | "home" | "buy" | "phone";

const BARS = [
  { key: "hunger", emoji: "🍲", color: "#f59e0b" },
  { key: "energy", emoji: "⚡", color: "#22c55e" },
  { key: "fun", emoji: "🎉", color: "#ec4899" },
  { key: "social", emoji: "💬", color: "#3b82f6" },
] as const;

export default function Home() {
  const s = usePlayerStore();
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<Tab>("map");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mode, setMode] = useState<ModeId>("trek");
  const [travel, setTravel] = useState<TravelState | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const travelRef = useRef<TravelState | null>(null);
  travelRef.current = travel;

  useEffect(() => setMounted(true), []);

  // slow decay + game clock
  useEffect(() => {
    const t = setInterval(() => usePlayerStore.getState().tick(), 30000);
    return () => clearInterval(t);
  }, []);

  // first visit: nudge to the portal
  const nudged = useRef(false);
  useEffect(() => {
    if (mounted && !nudged.current && s.admissionStatus === "none") {
      nudged.current = true;
      setTab("phone");
    }
  }, [mounted, s.admissionStatus]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const onArrive = useCallback(() => {
    const t = travelRef.current;
    if (!t) return;
    usePlayerStore.getState().setPosition(t.to[0], t.to[1]);
    setTravel(null);
    setSelectedId(t.placeId);
    setToast(`Arrived at ${getPlace(t.placeId)?.name}`);
  }, []);

  if (!mounted) return <main className="app" />;

  const here: [number, number] = [s.position.lng, s.position.lat];
  const place = selectedId ? getPlace(selectedId) : undefined;
  const dist = place ? distanceM(here, [place.lng, place.lat]) : 0;
  const atPlace = !!place && dist <= AT_PLACE_M;
  const clock = clockLabel(s.gameMinutes);

  const select = (id: string | null) => {
    if (travel) return;
    setSelectedId(id);
    if (id) setTab("map");
  };

  const go = () => {
    if (!place || travel) return;
    const m = MODES.find((x) => x.id === mode)!;
    const q = quote(dist, m);
    const ok = usePlayerStore.getState().applyEffect({
      cost: q.fare, minutes: q.minutes, needs: q.energy ? { energy: -q.energy } : undefined,
    });
    if (!ok) { setToast("Not enough money for that ride"); return; }
    setTravel({ from: here, to: [place.lng, place.lat], startedAt: Date.now(), durationMs: q.durationMs, placeId: place.id });
    setSelectedId(null);
    setToast(`${m.emoji} Heading to ${place.name}…`);
  };

  const act = (actionId: string) => {
    const a = place?.actions.find((x) => x.id === actionId);
    if (!a) return;
    const ok = usePlayerStore.getState().applyEffect({ cost: a.cost, earn: a.earn, minutes: a.minutes, needs: a.needs });
    setToast(ok ? a.msg : "Not enough money");
  };

  const buy = (id: string) => {
    const i = streetItems.find((x) => x.id === id);
    if (!i) return;
    const ok = usePlayerStore.getState().applyEffect({ cost: i.cost, minutes: i.minutes, needs: i.needs });
    setToast(ok ? `${i.emoji} ${i.label}` : "Not enough money");
  };

  const needsPortal = s.admissionStatus !== "accepted";
  const needsHostel = s.admissionStatus === "accepted" && s.hostelStatus !== "allocated" && s.hostelStatus !== "off_campus";

  return (
    <main className="app">
      <MapView position={s.position} travel={travel} selectedId={selectedId} onSelect={select} onArrive={onArrive} />

      <div className="topbar">
        <span>☀️ {clock.time}</span>
        <span className="dot" />
        <span>{clock.weather} • Day {clock.day}</span>
        <span className="money">₦{s.money.toLocaleString()}</span>
      </div>

      {tab === "map" && !place && !travel && (needsPortal || needsHostel) && (
        <button className="banner" onClick={() => setTab("phone")}>
          {needsPortal ? "🎓 Get your admission on the Portal →" : "🏠 Apply for a hostel on the Portal →"}
        </button>
      )}

      {tab === "map" && place && (
        <PlaceSheet
          place={place} distance={dist} atPlace={atPlace} travelling={!!travel}
          money={s.money} needs={s.needs} mode={mode} setMode={setMode}
          onGo={go} onAction={act} onClose={() => setSelectedId(null)}
        />
      )}
      {tab === "phone" && <PhonePanel onClose={() => setTab("map")} />}
      {tab === "home" && <HomePanel onClose={() => setTab("map")} onPhone={() => setTab("phone")} />}
      {tab === "buy" && <BuyPanel money={s.money} needs={s.needs} onBuy={buy} onClose={() => setTab("map")} />}

      <div className="needs">
        <div className="avatar">🧑🏾‍🎓</div>
        <div className="bars">
          {BARS.map((b) => (
            <div key={b.key} className="bar">
              <span>{b.emoji}</span>
              <div className="track"><div className="fill" style={{ width: `${s.needs[b.key]}%`, background: b.color }} /></div>
            </div>
          ))}
        </div>
      </div>

      {toast && <div className="toast">{toast}</div>}

      <nav className="nav">
        {([
          ["home", "🏠", "Home"], ["buy", "🛍️", "Buy"], ["map", "🗺️", "Map"], ["phone", "📱", "Phone"],
        ] as const).map(([id, e, l]) => (
          <button key={id} className={tab === id ? "on" : ""} onClick={() => { setTab(id); if (id !== "map") setSelectedId(null); }}>
            <span>{e}</span>{l}
            {id === "phone" && (needsPortal || needsHostel) && <i className="ping" />}
          </button>
        ))}
      </nav>
    </main>
  );
}
