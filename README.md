# UNN Life

Browser-based student life simulation set on the University of Nigeria, Nsukka campus.

## v1.0: your room

- **Room view** in the Home tab (`lib/roomScene.ts`, `components/RoomView.tsx`): an isometric room in the same toy style as the map.
  Hostel rooms show bunk beds (one per two roommates, up to four), a study desk, a locker, buckets, a cooking corner, a window and a door.
  Off-campus rooms show a proper bed, sofa, shower and cooker.
- Tap anything in the room for actions: sleep or nap, study, fetch water or bath, cook indomie or rice (costs money), gist with roommates, look outside, go outside.
- Roommates stand in the room: all of them at night, about half in the daytime. The room gets a night tint and lit bulbs from the in-game clock.
- You can only enter your room when you are at your hostel on the map; otherwise Home shows a "Show my hostel on the map" button.
- Room art uses reference photos of real hostel rooms (metal bunks, orange plastic chairs, buckets, pots, lockers) from `UNN_campus_notes.md`.

## v0.9: real hostels, courses and places

- **15 real hostels** (2 boys: Alvan Ikoku, Eni Njoku; 13 girls: Akintola, Akpabio, Awolowo, Balewa, Bello, Eyo-ita, Isa Kaita, Kwame Nkrumah,
  Mary Slessor, Okeke, Okpara, Presidential, Tetfund). Okpara and Tetfund have no map position yet, so nobody is allocated there.
  Bed counts and rumours are game design, not campus facts. Girls are spread across the hostels by department; pharmacy girls go to Bello.
- **11 Engineering departments** from the faculty signboard.
- **63 places**, up from 35: Container (food, textbooks, photocopy), SUB, Marlima, Student Affairs, CEDR, Bookshop, Bursary, Zenith ICT Centre,
  Fidelity / Zenith / Access / First Bank, Freedom Square, UNN Fountain, Lion FM, Innovation Centre and more.
  Places marked `approx: true` are estimates (30-60 m) from map screenshots. Positions come from `UNN_campus_notes_part2.md`.
- Old saves are migrated: a hostel allocation to a hostel that no longer exists is cleared.
- Left out on purpose: low-confidence spots (Main Gate, 2nd Gate, Roban, GT Bank, town hotels, sports pitches) until checked.

## v0.8: the toy-town look

- **Own map style** (`lib/mapStyle.ts`): green ground, painted grey roads with kerbs and lane lines, red-earth tracks, blue water.
  Road widths are drawn in real metres so they match the buildings. No street-name labels; the game draws its own chips.
- **Colourful buildings:** wall colours follow the real photos where known (library blue, Abuja yellow, GS green, Arts maroon...), pastel variety elsewhere,
  plus coloured roofs (red, green, grey, blue). Colours are set in the data build, not guessed at runtime.
- **3,300 trees** (`public/data/trees.json`), scattered beside buildings. These are generated, not mapped: they are scenery.
- **Day / dusk / night:** the map tint follows the in-game clock.
- Still open from the photos: lion monuments, gates, hostel names and the other fixes planned for the data pass.

## v0.7: the real campus

- **Real buildings.** `public/data/campus.geojson` holds about 8,300 building outlines and 13 sports/leisure shapes
  exported from OpenStreetMap. They are drawn as 3D blocks with colours by type (hostel, academic, admin, worship, food, medical).
  Heights come from `building:levels` when OSM has it (very few buildings), otherwise they are estimates. Replace them as you learn real heights.
- **35 real places** (`lib/places.ts`), all placed on their real OSM building: library, Abuja Building, Chitis, Akanu-Ibiam Stadium,
  VC Building, Princess Alexandra Auditorium, hostels, faculties, the medical centre, First Bank, Ogige Market and more.
  Chips appear by zoom level (tier 1 always, tier 2 closer, tier 3 closest).
- **Free Wi-Fi spots** are tagged: library, VC building, Princess Alexandra Auditorium (ICT is waiting for a real location).
- **Gender** is chosen at the start. Hostels and roommates always match it: boys and girls are never roommates.
- **Courses:** only Nsukka-campus departments are playable (no Law, Medicine, Dentistry, Accountancy or Nursing).
  Added Botany (Plant Science and Biotechnology), Microbiology (MCB), Biochemistry (BCH), and more Arts and Social Sciences courses.
  Check the full course names in `lib/departments.ts` and fix any that are wrong.
- Old saved games are migrated: gender is asked again, roommates are re-rolled, and courses that no longer exist reset admission.

## Still needs a real location

ICT centre, SUG Building / SUB, Shuttle Park, Hilltop Gate, Container (food, textbooks, photocopy), Marlima, Franco Refectory,
gym, Ikenga Hotel, Pandelia Hotel, Old Carolina, Roban store, Animal Farm. Add them to `lib/places.ts` with coordinates.

## Coming next

Room view, phone apps (Bank, Timetable, Chats, Rides), data/airtime and Wi-Fi, parties, SUG elections.

## Setup

```bash
npm install
npm run dev
```
