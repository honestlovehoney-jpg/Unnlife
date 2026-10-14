/**
 * UNN Life map style: a toy-town look (green ground, painted roads, red-earth tracks, blue water).
 * Uses OpenFreeMap vector tiles for the ground, roads and water only. There are no text layers,
 * so no glyphs or sprites are needed. Buildings and trees are added from our own data in MapView.
 */

// Line width in metres, scaled so roads match the building scale at every zoom.
// At zoom 10 one metre is ~0.0066 px, at zoom 20 it is ~6.75 px (latitude ~6.9 degrees).
const metres = (m: number) => [
  "interpolate", ["exponential", 2], ["zoom"],
  10, m * 0.0066,
  20, m * 6.75,
];

const road = (
  id: string, classes: string[], width: number, color: string, extra: Record<string, unknown> = {}
) => ({
  id,
  type: "line",
  source: "ofm",
  "source-layer": "transportation",
  filter: ["match", ["get", "class"], classes, true, false],
  layout: { "line-cap": "round", "line-join": "round" },
  paint: { "line-color": color, "line-width": metres(width), ...extra },
});

const MAJOR = ["motorway", "trunk", "primary"];
const MID = ["secondary", "tertiary"];
const SMALL = ["minor", "service"];
const EARTH = ["track", "path"];

export const unnStyle: any = {
  version: 8,
  name: "unn-life",
  sources: {
    ofm: { type: "vector", url: "https://tiles.openfreemap.org/planet" },
  },
  layers: [
    { id: "ground", type: "background", paint: { "background-color": "#b6d79b" } },
    {
      id: "landcover", type: "fill", source: "ofm", "source-layer": "landcover",
      paint: {
        "fill-color": [
          "match", ["get", "class"],
          "wood", "#86ba70", "grass", "#a9d38d", "farmland", "#c9de98",
          "sand", "#eadfb4", "wetland", "#9fd4b8", "rock", "#c2c0b6", "#a9d38d",
        ],
      },
    },
    {
      id: "landuse", type: "fill", source: "ofm", "source-layer": "landuse",
      filter: ["match", ["get", "class"],
        ["residential", "commercial", "industrial", "retail", "school", "university", "college", "hospital", "cemetery"],
        true, false],
      paint: {
        "fill-color": [
          "match", ["get", "class"],
          "residential", "#ddd8c2", "commercial", "#d8d2c0", "industrial", "#d0cbbd", "retail", "#e0d4bc",
          "school", "#c9e0b0", "university", "#c9e0b0", "college", "#c9e0b0", "hospital", "#e3e8d3",
          "cemetery", "#a3cc92", "#ddd8c2",
        ],
        "fill-opacity": 0.85,
      },
    },
    { id: "park", type: "fill", source: "ofm", "source-layer": "park", paint: { "fill-color": "#98cf84" } },
    { id: "water", type: "fill", source: "ofm", "source-layer": "water", paint: { "fill-color": "#7cc4e8" } },
    {
      id: "waterway", type: "line", source: "ofm", "source-layer": "waterway",
      paint: { "line-color": "#7cc4e8", "line-width": metres(3) },
    },
    // road casings (kerbs) first, then road surfaces
    road("casing-major", MAJOR, 17, "#bdb7a6"),
    road("casing-mid", MID, 13, "#bdb7a6"),
    road("casing-small", SMALL, 9, "#c4bfae"),
    road("earth", EARTH, 3.5, "#c9825a"),
    road("road-small", SMALL, 6, "#aeb2b8"),
    road("road-mid", MID, 10, "#8c929a"),
    road("road-major", MAJOR, 14, "#7d838b"),
    road("lane-mid", MID, 0.5, "#f3efe2", { "line-dasharray": [6, 6] }),
    road("lane-major", MAJOR, 0.6, "#f3efe2", { "line-dasharray": [6, 6] }),
  ],
};
