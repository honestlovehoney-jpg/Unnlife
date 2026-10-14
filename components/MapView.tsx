"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { places } from "@/lib/places";
import { unnStyle } from "@/lib/mapStyle";
import type { DayPhase } from "@/lib/travel";

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
  phase: DayPhase;
}

// zoom levels at which each tier of place chips appears / shows its name
const MIN_ZOOM: Record<1 | 2 | 3, number> = { 1: 14.5, 2: 16.3, 3: 17.2 };
const LABEL_ZOOM: Record<1 | 2 | 3, number> = { 1: 16.2, 2: 17.2, 3: 17.6 };

const KX = 110520;
const KY = 110574;
const WALL_BASE = 0;
const TREE_GREENS = ["#4f9d4a", "#5fae52", "#3f8f46", "#6bb85a"];

/** Build low-poly tree polygons (trunk + canopy) from compact [lng, lat, size, colour] points. */
function treeFeatures(pts: number[][]) {
  const ring = (lng: number, lat: number, r: number) => {
    const out: number[][] = [];
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2;
      out.push([lng + (Math.cos(a) * r) / KX, lat + (Math.sin(a) * r) / KY]);
    }
    out.push(out[0]);
    return out;
  };
  const features: any[] = [];
  for (const [lng, lat, size, col] of pts) {
    const rad = 2.2 + size * 0.8;
    const top = 8 + size * 1.5;
    features.push({
      type: "Feature",
      properties: { b: 0, h: 3.6, c: "#7a5230" },
      geometry: { type: "Polygon", coordinates: [ring(lng, lat, 0.4)] },
    });
    features.push({
      type: "Feature",
      properties: { b: 3.2, h: top, c: TREE_GREENS[col % TREE_GREENS.length] },
      geometry: { type: "Polygon", coordinates: [ring(lng, lat, rad)] },
    });
  }
  return { type: "FeatureCollection", features };
}

/** Add the real UNN campus (OpenStreetMap outlines): painted walls, coloured roofs, pitches and trees. */
function addCampus(m: maplibregl.Map) {
  try {
    const url = (p: string) => new URL(p, window.location.origin).toString();
    m.addSource("campus", { type: "geojson", data: url("/data/campus.geojson") });
    m.addLayer({
      id: "campus-leisure", type: "fill", source: "campus",
      filter: ["==", ["get", "t"], "l"],
      paint: {
        "fill-color": ["match", ["get", "k"], "pitch", "#8fcf86", "stadium", "#b6dba5", "pool", "#6dc1ea", "park", "#9fd68a", "#9fd68a"],
        "fill-opacity": 1,
      },
    } as any);
    m.addLayer({
      id: "campus-leisure-line", type: "line", source: "campus",
      filter: ["==", ["get", "t"], "l"],
      paint: { "line-color": "#ffffff", "line-width": 1.4, "line-opacity": 0.95 },
    } as any);
    m.addLayer({
      id: "campus-walls", type: "fill-extrusion", source: "campus", minzoom: 14,
      filter: ["==", ["get", "t"], "b"],
      paint: {
        "fill-extrusion-color": ["get", "c"],
        "fill-extrusion-height": ["get", "h"],
        "fill-extrusion-base": WALL_BASE,
        "fill-extrusion-opacity": 1,
      },
    } as any);
    m.addLayer({
      id: "campus-roofs", type: "fill-extrusion", source: "campus", minzoom: 15.5,
      filter: ["==", ["get", "t"], "b"],
      paint: {
        "fill-extrusion-color": ["get", "r"],
        "fill-extrusion-height": ["+", ["get", "h"], 0.7],
        "fill-extrusion-base": ["get", "h"],
        "fill-extrusion-opacity": 1,
      },
    } as any);
    fetch(url("/data/trees.json"))
      .then((r) => r.json())
      .then((pts: number[][]) => {
        if (!m.getSource("trees")) {
          m.addSource("trees", { type: "geojson", data: treeFeatures(pts) as any });
          m.addLayer({
            id: "trees", type: "fill-extrusion", source: "trees", minzoom: 16,
            paint: {
              "fill-extrusion-color": ["get", "c"],
              "fill-extrusion-height": ["get", "h"],
              "fill-extrusion-base": ["get", "b"],
              "fill-extrusion-opacity": 1,
            },
          } as any);
        }
      })
      .catch(() => {});
  } catch (err) {
    console.warn("campus layers skipped", err);
  }
}

export default function MapView({ position, travel, selectedId, onSelect, onArrive, phase }: Props) {
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
      style: unnStyle,
      center: [startPos.current.lng, startPos.current.lat],
      zoom: 16.8,
      pitch: 58,
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

  // day / dusk / night look (CSS filter on the map canvas only, so chips stay bright)
  useEffect(() => {
    const el = container.current;
    if (!el) return;
    el.classList.remove("day", "dusk", "night");
    el.classList.add(phase);
  }, [phase]);

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
