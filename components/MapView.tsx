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

function styleUp(m: maplibregl.Map) {
  try {
    const style = m.getStyle();
    if (!style || !style.layers) return;
    // Declutter: hide the default POI / house-number / shield labels
    for (const l of style.layers) {
      if (l.type === "symbol" && /poi|housenumber|shield|aerodrome|airport/i.test(l.id)) {
        m.setLayoutProperty(l.id, "visibility", "none");
      }
    }
    const color: any = [
      "interpolate", ["linear"], ["coalesce", ["get", "render_height"], 6],
      0, "#efe6d6", 40, "#d9cdb6", 120, "#c4b69b",
    ];
    if (m.getLayer("building-3d")) {
      m.setPaintProperty("building-3d", "fill-extrusion-color", color);
      m.setPaintProperty("building-3d", "fill-extrusion-opacity", 0.95);
    } else {
      const src = Object.entries(style.sources).find(([, s]) => s.type === "vector")?.[0];
      if (src) {
        m.addLayer({
          id: "unn-buildings-3d",
          type: "fill-extrusion",
          source: src,
          "source-layer": "building",
          minzoom: 14,
          paint: {
            "fill-extrusion-color": color,
            "fill-extrusion-height": ["coalesce", ["get", "render_height"], 6],
            "fill-extrusion-base": ["coalesce", ["get", "render_min_height"], 0],
            "fill-extrusion-opacity": 0.95,
          },
        } as any);
      }
    }
  } catch (err) {
    console.warn("map styling skipped", err);
  }
}

export default function MapView({ position, travel, selectedId, onSelect, onArrive }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const chips = useRef<Record<string, HTMLDivElement>>({});
  const player = useRef<maplibregl.Marker | null>(null);
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
      zoom: 16.2,
      pitch: 55,
      bearing: -20,
      maxPitch: 70,
    });
    map.current = m;
    m.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "top-right");

    places.forEach((p) => {
      const el = document.createElement("div");
      el.className = "chip";
      el.innerHTML = `<span class="chip-e">${p.emoji}</span><span>${p.name}</span>`;
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

    m.on("click", () => onSelectRef.current(null));
    m.on("load", () => styleUp(m));

    return () => {
      m.remove();
      map.current = null;
      player.current = null;
    };
  }, []);

  // highlight + focus the selected place
  useEffect(() => {
    Object.entries(chips.current).forEach(([id, el]) => el.classList.toggle("sel", id === selectedId));
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

  return <div ref={container} className="map" />;
}
