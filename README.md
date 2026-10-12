# UNN Life

Browser-based student life simulation set on the University of Nigeria, Nsukka campus.

## Current Prototype (v0.1)

- MapLibre map centered on UNN Nsukka
- Placeholder POIs (Abuja Building, Chitis, Alvan Ikoku, Shuttle Park)
- Basic player HUD (money + needs)
- Zustand state store
- Click-to-move prototype

## Setup

```bash
cd unn-life
npm install
npm run dev
```

## Next Steps (from GDD)

1. Replace demo map style with proper OSM vector tiles
2. Accurate POI coordinates from research
3. Admission flow (pre-campus)
4. Hostel room system
5. Basic interactions (buy okpa, attend class)

## Architecture Notes

- Frontend: Next.js App Router
- State: Zustand
- Map: MapLibre GL JS
- Future backend: Node + PostgreSQL + Socket.IO (Railway)
- Multiplayer-ready design, single-player first
