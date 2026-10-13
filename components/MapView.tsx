"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { places } from "@/lib/places";

export interface TravelState {
  from: [number, number];
  to: [number, number];
  startedAt: number;
  durationMs: number;
  placeId: string;
}

interface Props {
  position: { lng: number; lat: number };
  travel: TravelState | null;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onArrive: () => void;
}

// zoom levels at which each tier of place chips appears / shows its name
const MIN_ZOOM: Record<1 | 2 | 3, number> = { 1: 14.5, 2: 16.3, 3: 17.2 };
const LABEL_ZOOM: Record<1 | 2 | 3, number> = { 1: 16.2, 2: 17.2, 3: 17.6 };

/** Replace the stock map buildings with the real UNN campus outlines (OpenStreetMap data). */
function addCampus(m: maplibregl.Map) {
  try {
    const style = m.getStyle();
    if (!style || !style.layers) return;
    for (const l of style.layers) {
      const sourceLayer = (l as any)["source-layer"] as string | undefined;
      const hideLabel = l.type === "symbol" && /poi|housenumber|shield|aerodrome|airport/i.test(l.id);
      if (sourceLayer === "building" || hideLabel) {
        m.setLayoutProperty(l.id, "visibility", "none");
      }
    }
    const before = style.layers.find((l) => l.type === "symbol")?.id;
    if (!m.getSource("campus")) {
      m.addSource("campus", { type: "geojson", data: new URL("/data/campus.geojson", window.location.origin).toString() });
    }
    m.addLayer(
      {
        id: "campus-leisure",
        type: "fill",
        source: "campus",
        filter: ["==", ["get", "t"], "l"],
        paint: {
          "fill-color": ["match", ["get", "k"], "pitch", "#9fcf9a", "stadium", "#b6d9a8", "pool", "#7cc4e8", "park", "#cfe5c0", "#cfe5c0"],
          "fill-opacity": 0.92,
        },
      } as any,
      before
    );
    m.addLayer(
      {
        id: "campus-leisure-line",
        type: "line",
        source: "campus",
        filter: ["==", ["get", "t"], "l"],
        paint: { "line-color": "#ffffff", "line-width": 1.2, "line-opacity": 0.9 },
      } as any,
      before
    );
    m.addLayer(
      {
        id: "campus-buildings",
        type: "fill-extrusion",
        source: "campus",
        filter: ["==", ["get", "t"], "b"],
        paint: {
          "fill-extrusion-color": ["get", "c"],
          "fill-extrusion-height": ["get", "h"],
          "fill-extrusion-base": 0,
          "fill-extrusion-opacity": 0.94,
        },
      } as any,
      before
    );
  } catch (err) {
    console.warn("campus layers skipped", err);
  }
}

export default function MapView({ position, travel, selectedId, onSelect, onArrive }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const chips = useRef<Record<string, HTMLDivElement>>({});
  const player = useRef<maplibregl.Marker | null>(null);
  const refresh = useRef<() => void>(() => {});
  const onSelectRef = useRef(onSelect);
  const onArriveRef = useRef(onArrive);
  onSelectRef.current = onSelect;
  onArriveRef.current = onArrive;
  const startPos = useRef(position);

  // create map, place chips and player once
  useEffect(() => {
    if (!container.current) return;
    chips.current = {};
    const m = new maplibregl.Map({
      container: container.current,
      style: "https://tiles.openfreemap.org/styles/liberty",
      center: [startPos.current.lng, startPos.current.lat],
      zoom: 16.4,
      pitch: 55,
      bearing: -20,
      minZoom: 13,
      maxPitch: 70,
    });
    map.current = m;
    m.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "top-right");

    places.forEach((p) => {
      const el = document.createElement("div");
      el.className = "chip";
      const e = document.createElement("span");
      e.className = "chip-e";
      e.textContent = p.emoji;
      const l = document.createElement("span");
      l.className = "chip-l";
      l.textContent = p.name;
      el.appendChild(e);
      el.appendChild(l);
      el.addEventListener("click", (ev) => {
        ev.stopPropagation();
        onSelectRef.current(p.id);
      });
      chips.current[p.id] = el;
      new maplibregl.Marker({ element: el, anchor: "bottom" }).setLngLat([p.lng, p.lat]).addTo(m);
    });

    const pe = document.createElement("div");
    pe.className = "player";
    pe.textContent = "🧑🏾‍🎓";
    player.current = new maplibregl.Marker({ element: pe, anchor: "center" })
      .setLngLat([startPos.current.lng, startPos.current.lat])
      .addTo(m);

    refresh.current = () => {
      const z = m.getZoom();
      for (const p of places) {
        const el = chips.current[p.id];
        if (!el) continue;
        const sel = el.classList.contains("sel");
        el.style.display = sel || z >= MIN_ZOOM[p.tier] ? "flex" : "none";
        el.classList.toggle("lab", sel || z >= LABEL_ZOOM[p.tier]);
      }
    };
    m.on("zoom", () => refresh.current());
    m.on("click", () => onSelectRef.current(null));
    m.on("load", () => {
      addCampus(m);
      refresh.current();
    });
    refresh.current();

    return () => {
      m.remove();
      map.current = null;
      player.current = null;
    };
  }, []);

  // highlight + focus the selected place
  useEffect(() => {
    Object.entries(chips.current).forEach(([id, el]) => el.classList.toggle("sel", id === selectedId));
    refresh.current();
    const m = map.current;
    if (!m) return;
    const none = { top: 0, bottom: 0, left: 0, right: 0 };
    const p = places.find((x) => x.id === selectedId);
    if (p) m.easeTo({ center: [p.lng, p.lat], padding: { ...none, bottom: 280 }, duration: 600 });
    else m.easeTo({ padding: none, duration: 400 });
  }, [selectedId]);

  // keep the avatar at the stored position when not travelling
  useEffect(() => {
    if (!travel) player.current?.setLngLat([position.lng, position.lat]);
  }, [position, travel]);

  // animate the trip
  useEffect(() => {
    if (!travel) return;
    let raf = 0;
    const step = () => {
      const t = Math.min(1, (Date.now() - travel.startedAt) / travel.durationMs);
      const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const lng = travel.from[0] + (travel.to[0] - travel.from[0]) * e;
      const lat = travel.from[1] + (travel.to[1] - travel.from[1]) * e;
      player.current?.setLngLat([lng, lat]);
      map.current?.jumpTo({ center: [lng, lat] });
      if (t < 1) raf = requestAnimationFrame(step);
      else onArriveRef.current();
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [travel]);

  return (
    <div
      ref={container}
      className="map"
      style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, width: "100%", height: "100%" }}
    />
  );
}
