import type { NeedKey } from "./playerStore";

export interface PlaceAction {
  id: string;
  emoji: string;
  label: string;
  cost?: number;
  earn?: number;
  minutes: number;
  needs: Partial<Record<NeedKey, number>>;
  msg: string;
}

export interface Place {
  id: string;
  name: string;
  emoji: string;
  kind: string;
  blurb: string;
  lng: number;
  lat: number;
  /** false = placeholder coordinate, move it to the real spot */
  verified: boolean;
  actions: PlaceAction[];
}

const a = (
  id: string, emoji: string, label: string, minutes: number,
  needs: Partial<Record<NeedKey, number>>, msg: string,
  extra: { cost?: number; earn?: number } = {}
): PlaceAction => ({ id, emoji, label, minutes, needs, msg, ...extra });

export const places: Place[] = [
  {
    id: "abuja", name: "Abuja Building", emoji: "🏛️", kind: "Lecture hall", lng: 7.405, lat: 6.868, verified: false,
    blurb: "Big lecture hall. Come early or you will be standing at the back.",
    actions: [
      a("lecture", "🎓", "Attend lecture", 120, { energy: -12, fun: -6 }, "The lecturer came late, but you took notes."),
      a("board", "📌", "Check notice board", 30, { social: 5 }, "Results, rumours and a missing phone ad."),
    ],
  },
  {
    id: "eng", name: "Faculty of Engineering", emoji: "🛠️", kind: "Lab & lectures", lng: 7.4023, lat: 6.8661, verified: false,
    blurb: "Drawing boards, labs and people who have not slept since Tuesday.",
    actions: [
      a("lab", "🧪", "Attend lab", 120, { energy: -15, fun: -4 }, "The experiment worked on the third try."),
      a("group", "👥", "Group project meeting", 90, { social: 10, energy: -8 }, "Only two of five people came."),
    ],
  },
  {
    id: "library", name: "Nnamdi Azikiwe Library", emoji: "📚", kind: "Study", lng: 7.4072, lat: 6.8655, verified: false,
    blurb: "Quiet floors, reading cubicles and strong competition for sockets.",
    actions: [
      a("study", "📖", "Read and study", 120, { energy: -10, fun: -8 }, "Two chapters done. Brain loading."),
      a("nap", "😴", "Nap at the back", 60, { energy: 10 }, "A security man woke you up politely."),
    ],
  },
  {
    id: "chitis", name: "Chitis", emoji: "🍲", kind: "Food spot", lng: 7.41, lat: 6.866, verified: false,
    blurb: "Student food joint. Jollof, rice and stew, and plenty of gist.",
    actions: [
      a("okpa", "🥜", "Buy okpa", 15, { hunger: 25 }, "Hot okpa. Simple and filling.", { cost: 300 }),
      a("jollof", "🍛", "Jollof and chicken", 30, { hunger: 45, fun: 4 }, "Proper plate. The chicken was not small.", { cost: 1500 }),
      a("gist", "💬", "Gist with friends", 45, { social: 12, fun: 6 }, "You solved all of Nigeria's problems at the table."),
    ],
  },
  {
    id: "alvan", name: "Alvan Ikoku Hostel", emoji: "🏠", kind: "Hostel", lng: 7.412, lat: 6.865, verified: false,
    blurb: "Home for many. Noisy after 10pm, so earplugs are useful.",
    actions: [
      a("sleep", "🛏️", "Sleep", 480, { energy: 55, hunger: -15 }, "You slept like someone with no 8am class."),
      a("rest", "🛋️", "Rest a bit", 60, { energy: 10 }, "A short rest. Back to life."),
      a("roomgist", "💬", "Gist with roommates", 60, { social: 15, fun: 5 }, "The gist went on longer than planned."),
    ],
  },
  {
    id: "container", name: "Okpa Container", emoji: "🥫", kind: "Street food", lng: 7.414, lat: 6.867, verified: false,
    blurb: "Container shop near the hostels. Cheap food, open late.",
    actions: [
      a("indomie", "🍜", "Indomie and egg", 20, { hunger: 30 }, "The student classic.", { cost: 700 }),
      a("okpa2", "🥜", "Buy okpa", 15, { hunger: 25 }, "Hot okpa from the container.", { cost: 300 }),
    ],
  },
  {
    id: "sug", name: "SUG Building", emoji: "📢", kind: "Student union", lng: 7.409, lat: 6.8695, verified: false,
    blurb: "Campaign posters everywhere. Somebody is always about to make a speech.",
    actions: [
      a("rally", "📢", "Attend SUG rally", 90, { social: 15, fun: 8, energy: -6 }, "Big promises and free handbills."),
    ],
  },
  {
    id: "chapel", name: "Campus Chapel", emoji: "🙏", kind: "Fellowship", lng: 7.4027, lat: 6.8708, verified: false,
    blurb: "Fellowship, worship and people who will remember your name.",
    actions: [
      a("fellowship", "🙏", "Join fellowship", 90, { social: 12, fun: 6, energy: -4 }, "Good vibes and a free snack at the end."),
    ],
  },
  {
    id: "sports", name: "Sports Complex", emoji: "⚽", kind: "Sports", lng: 7.4127, lat: 6.8691, verified: false,
    blurb: "Football pitch, track and a lot of trash talk.",
    actions: [
      a("football", "⚽", "Play football", 90, { fun: 22, energy: -18, social: 6, hunger: -8 }, "You scored. You will mention it for a week."),
      a("jog", "🏃", "Go jogging", 45, { fun: 8, energy: -10 }, "Two laps and your legs have opinions."),
    ],
  },
  {
    id: "gate", name: "Hilltop Gate", emoji: "🚪", kind: "Gate & suya", lng: 7.4115, lat: 6.8615, verified: false,
    blurb: "The gate everybody uses. Suya smoke, okada riders and noise.",
    actions: [
      a("suya", "🍢", "Buy suya", 20, { hunger: 22, fun: 4 }, "Spicy. Worth it.", { cost: 800 }),
      a("water", "💧", "Buy water", 5, { hunger: 3 }, "Cold water, small relief.", { cost: 100 }),
    ],
  },
  {
    id: "shuttle", name: "Shuttle Park", emoji: "🚌", kind: "Transport & hustle", lng: 7.407, lat: 6.87, verified: false,
    blurb: "Where the campus shuttles load. There is always a small hustle here.",
    actions: [
      a("hustle", "💼", "Hustle: sell shuttle tickets", 120, { energy: -18, hunger: -8, social: 4 }, "Long hours, but the money came.", { earn: 2000 }),
    ],
  },
  {
    id: "market", name: "Ogige Market", emoji: "🛒", kind: "Market", lng: 7.416, lat: 6.8621, verified: false,
    blurb: "Nsukka's big market. Bargain hard and carry your own bag.",
    actions: [
      a("provisions", "🛒", "Buy provisions", 60, { hunger: 35, energy: -5 }, "Garri, beans, tomatoes. You are set for days.", { cost: 3500 }),
      a("bargain", "🗣️", "Bargain and gist", 40, { social: 6, fun: 4 }, "You saved ₦200 and lost 20 minutes. Worth it."),
    ],
  },
];

export const getPlace = (id: string) => places.find((p) => p.id === id);

export interface StreetItem { id: string; emoji: string; label: string; cost: number; needs: Partial<Record<NeedKey, number>>; minutes: number }
export const streetItems: StreetItem[] = [
  { id: "water", emoji: "💧", label: "Sachet water", cost: 50, needs: { hunger: 3 }, minutes: 2 },
  { id: "okpa", emoji: "🥜", label: "Okpa from a hawker", cost: 300, needs: { hunger: 22 }, minutes: 10 },
  { id: "gala", emoji: "🥤", label: "Gala and soft drink", cost: 600, needs: { hunger: 18, fun: 3 }, minutes: 10 },
  { id: "data", emoji: "📶", label: "Data bundle", cost: 1000, needs: { social: 10, fun: 6 }, minutes: 5 },
];
