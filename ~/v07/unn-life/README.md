# UNN Life

Browser-based student life simulation set on the University of Nigeria, Nsukka campus.

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
