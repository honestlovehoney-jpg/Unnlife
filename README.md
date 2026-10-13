# UNN Life

Browser-based student life simulation set on the University of Nigeria, Nsukka campus.

## v0.6

- 3D tilted map (OpenFreeMap + extruded buildings), default POI labels hidden
- 12 named places shown as emoji chips; tap one to open its sheet
- Place actions (food, class, sleep, hustle, ...) change money, needs and the game clock
- Player avatar that travels between places by trek, keke, okada or cab, with fares
- HUD: time and weather, money, four need bars, bottom nav (Home / Buy / Map / Phone)
- Admission and hostel flows live in the Phone tab (UNN Portal); roommates are in Home
- Needs slowly decay and the game clock advances while you play

## Coordinates

Only the 4 original places (Abuja Building, Chitis, Alvan Ikoku, Shuttle Park) came from you
and even those were placeholders. The other 8 are placed around them as estimates.
Every place has `verified: false` in `lib/places.ts`. Fix `lng` / `lat` there and set it to `true`.

## Setup

```bash
npm install
npm run dev
```
