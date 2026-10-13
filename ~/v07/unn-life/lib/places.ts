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
  /** only usable if this is your own allocated hostel */
  residentOnly?: boolean;
}

export interface Place {
  id: string;
  name: string;
  emoji: string;
  kind: string;
  blurb: string;
  lng: number;
  lat: number;
  /** 1 = always on the map, 2 = from closer zoom, 3 = close zoom only */
  tier: 1 | 2 | 3;
  /** all positions below come from OpenStreetMap building outlines */
  verified: boolean;
  wifi?: boolean;
  hostelId?: string;
  actions: PlaceAction[];
}

const a = (
  id: string, emoji: string, label: string, minutes: number,
  needs: Partial<Record<NeedKey, number>>, msg: string,
  extra: { cost?: number; earn?: number; residentOnly?: boolean } = {}
): PlaceAction => ({ id, emoji, label, minutes, needs, msg, ...extra });

/*
 * Places still missing a real location (not in the OpenStreetMap export yet):
 * ICT centre, SUG Building / SUB, Shuttle Park, Hilltop Gate, Container (food + textbooks + photocopy),
 * Marlima, Franco Refectory, gym, Ikenga Hotel, Pandelia Hotel, Old Carolina, Roban store, Animal Farm.
 * Add them here with real coordinates once known.
 */
export const places: Place[] = [
  {
    id: "library", name: "Nnamdi Azikiwe Library", emoji: "📚", kind: "Library and free Wi-Fi", tier: 1, verified: true, wifi: true,
    lng: 7.408339, lat: 6.864178,
    blurb: "The main library. Quiet floors, reading cubicles and a free Wi-Fi hotspot.",
    actions: [
      a("study", "📖", "Read and study", 120, { energy: -10, fun: -8 }, "Two chapters done. Brain loading."),
      a("nap", "😴", "Nap at the back", 60, { energy: 10 }, "A security man woke you up politely."),
      a("group", "👥", "Group project meeting", 90, { social: 10, energy: -8 }, "Only two of five people came.")
    ],
  },
  {
    id: "abuja", name: "Abuja Building", emoji: "🏛️", kind: "Lecture hall", tier: 1, verified: true,
    lng: 7.412115, lat: 6.867029,
    blurb: "Big lecture hall. Come early or you will be standing at the back.",
    actions: [
      a("lecture", "🎓", "Attend lecture", 120, { energy: -12, fun: -6 }, "The lecturer came late, but you took notes."),
      a("board", "📌", "Check notice board", 30, { social: 5 }, "Results, rumours and a missing phone ad.")
    ],
  },
  {
    id: "chitis", name: "Chitis", emoji: "🍲", kind: "Food spot", tier: 1, verified: true,
    lng: 7.410466, lat: 6.865502,
    blurb: "Student food joint. Jollof, rice and stew, and plenty of gist.",
    actions: [
      a("okpa", "🥜", "Buy okpa", 15, { hunger: 25 }, "Hot okpa. Simple and filling.", { cost: 300 }),
      a("jollof", "🍛", "Jollof and chicken", 30, { hunger: 45, fun: 4 }, "Proper plate. The chicken was not small.", { cost: 1500 }),
      a("gist", "💬", "Gist with friends", 45, { social: 12, fun: 6 }, "You solved all of Nigeria's problems at the table.")
    ],
  },
  {
    id: "stadium", name: "Akanu-Ibiam Stadium", emoji: "⚽", kind: "Stadium", tier: 1, verified: true,
    lng: 7.404239, lat: 6.866327,
    blurb: "The main stadium: football, athletics and a lot of trash talk.",
    actions: [
      a("football", "⚽", "Play football", 90, { fun: 22, energy: -18, social: 6, hunger: -8 }, "You scored. You will mention it for a week."),
      a("jog", "🏃", "Go jogging", 45, { fun: 8, energy: -10 }, "Two laps and your legs have opinions."),
      a("match", "📣", "Watch a match", 90, { fun: 10, social: 6 }, "Your department won on penalties.")
    ],
  },
  {
    id: "vc", name: "VC Building", emoji: "🏢", kind: "Administration and free Wi-Fi", tier: 1, verified: true, wifi: true,
    lng: 7.408062, lat: 6.86278,
    blurb: "The Vice-Chancellor's building. Queues, stamps and a free Wi-Fi hotspot.",
    actions: [
      a("clearance", "📄", "Queue for clearance", 90, { energy: -8, fun: -6 }, "You queued for hours, but you got your stamp."),
      a("board", "📌", "Check notice board", 30, { social: 5 }, "Results, rumours and a missing phone ad.")
    ],
  },
  {
    id: "paa", name: "Princess Alexandra Auditorium", emoji: "🎭", kind: "Auditorium and free Wi-Fi", tier: 1, verified: true, wifi: true,
    lng: 7.407341, lat: 6.863074,
    blurb: "The big auditorium for events and lectures, with a free Wi-Fi hotspot.",
    actions: [
      a("event", "🎭", "Attend an event", 90, { fun: 12, social: 10, energy: -6 }, "A packed hall and a very long opening prayer.")
    ],
  },
  {
    id: "alvan", name: "Alvan Ikoku Hostel", emoji: "🏠", kind: "Hostel (boys)", tier: 1, verified: true, hostelId: "alvan_ikoku",
    lng: 7.40219, lat: 6.869333,
    blurb: "Home for many. Noisy after 10pm, so earplugs are useful.",
    actions: [
      a("sleep", "🛏️", "Sleep", 480, { energy: 55, hunger: -15 }, "You slept like someone with no 8am class.", { residentOnly: true }),
      a("rest", "🛋️", "Rest a bit", 60, { energy: 10 }, "A short rest. Back to life.", { residentOnly: true }),
      a("roomgist", "💬", "Gist with roommates", 60, { social: 15, fun: 5 }, "The gist went on longer than planned.", { residentOnly: true }),
      a("visit", "🚪", "Visit a friend here", 45, { social: 8, fun: 4 }, "You went in for five minutes and left two hours later.")
    ],
  },
  {
    id: "eni_njoku", name: "Eni Njoku Hostel", emoji: "🏠", kind: "Hostel (boys)", tier: 1, verified: true, hostelId: "eni_njoku",
    lng: 7.402441, lat: 6.868682,
    blurb: "A busy boys hostel with strong opinions about generator noise.",
    actions: [
      a("sleep", "🛏️", "Sleep", 480, { energy: 55, hunger: -15 }, "You slept like someone with no 8am class.", { residentOnly: true }),
      a("rest", "🛋️", "Rest a bit", 60, { energy: 10 }, "A short rest. Back to life.", { residentOnly: true }),
      a("roomgist", "💬", "Gist with roommates", 60, { social: 15, fun: 5 }, "The gist went on longer than planned.", { residentOnly: true }),
      a("visit", "🚪", "Visit a friend here", 45, { social: 8, fun: 4 }, "You went in for five minutes and left two hours later.")
    ],
  },
  {
    id: "market", name: "Ogige Market", emoji: "🛒", kind: "Market", tier: 1, verified: true,
    lng: 7.399646, lat: 6.851114,
    blurb: "Nsukka's big market. Bargain hard and carry your own bag.",
    actions: [
      a("provisions", "🛒", "Buy provisions", 60, { hunger: 35, energy: -5 }, "Garri, beans, tomatoes. You are set for days.", { cost: 3500 }),
      a("bargain", "🗣️", "Bargain and gist", 40, { social: 6, fun: 4 }, "You saved ₦200 and lost 20 minutes. Worth it.")
    ],
  },
  {
    id: "bank", name: "First Bank (UNN Branch)", emoji: "🏦", kind: "Bank and ATM", tier: 1, verified: true,
    lng: 7.407418, lat: 6.864964,
    blurb: "The campus bank branch. ATM and counter services arrive with the Bank app.",
    actions: [],
  },
  {
    id: "mary_slessor", name: "Mary Slessor Hall", emoji: "🏠", kind: "Hostel (girls)", tier: 2, verified: true, hostelId: "mary_slessor",
    lng: 7.409799, lat: 6.8622,
    blurb: "A well-known girls hostel with lively corridors.",
    actions: [
      a("sleep", "🛏️", "Sleep", 480, { energy: 55, hunger: -15 }, "You slept like someone with no 8am class.", { residentOnly: true }),
      a("rest", "🛋️", "Rest a bit", 60, { energy: 10 }, "A short rest. Back to life.", { residentOnly: true }),
      a("roomgist", "💬", "Gist with roommates", 60, { social: 15, fun: 5 }, "The gist went on longer than planned.", { residentOnly: true }),
      a("visit", "🚪", "Visit a friend here", 45, { social: 8, fun: 4 }, "You went in for five minutes and left two hours later.")
    ],
  },
  {
    id: "presidential", name: "Presidential Hostel", emoji: "🏠", kind: "Hostel (girls)", tier: 2, verified: true, hostelId: "presidential",
    lng: 7.412304, lat: 6.861351,
    blurb: "Girls hostel with a reputation for being a bit more orderly.",
    actions: [
      a("sleep", "🛏️", "Sleep", 480, { energy: 55, hunger: -15 }, "You slept like someone with no 8am class.", { residentOnly: true }),
      a("rest", "🛋️", "Rest a bit", 60, { energy: 10 }, "A short rest. Back to life.", { residentOnly: true }),
      a("roomgist", "💬", "Gist with roommates", 60, { social: 15, fun: 5 }, "The gist went on longer than planned.", { residentOnly: true }),
      a("visit", "🚪", "Visit a friend here", 45, { social: 8, fun: 4 }, "You went in for five minutes and left two hours later.")
    ],
  },
  {
    id: "bello", name: "Eyoita and Bello Hostel", emoji: "🏠", kind: "Hostel (girls)", tier: 2, verified: true, hostelId: "bello",
    lng: 7.4096, lat: 6.863064,
    blurb: "Girls hostel close to the Pharmacy building.",
    actions: [
      a("sleep", "🛏️", "Sleep", 480, { energy: 55, hunger: -15 }, "You slept like someone with no 8am class.", { residentOnly: true }),
      a("rest", "🛋️", "Rest a bit", 60, { energy: 10 }, "A short rest. Back to life.", { residentOnly: true }),
      a("roomgist", "💬", "Gist with roommates", 60, { social: 15, fun: 5 }, "The gist went on longer than planned.", { residentOnly: true }),
      a("visit", "🚪", "Visit a friend here", 45, { social: 8, fun: 4 }, "You went in for five minutes and left two hours later.")
    ],
  },
  {
    id: "aja_awolowo", name: "Aja Nwachukwu and Awolowo Hostel", emoji: "🏠", kind: "Hostel", tier: 2, verified: true,
    lng: 7.412539, lat: 6.862992,
    blurb: "Two hostels side by side. Friendly corridors and long queues for water.",
    actions: [
      a("visit", "🚪", "Visit a friend here", 45, { social: 8, fun: 4 }, "You went in for five minutes and left two hours later.")
    ],
  },
  {
    id: "akpabio_akintola", name: "Akpabio and Akintola Hostels", emoji: "🏠", kind: "Hostel", tier: 2, verified: true,
    lng: 7.412595, lat: 6.860905,
    blurb: "Hostels near the medical area. Quiet at night, busy at breakfast.",
    actions: [
      a("visit", "🚪", "Visit a friend here", 45, { social: 8, fun: 4 }, "You went in for five minutes and left two hours later.")
    ],
  },
  {
    id: "nkrumah", name: "Nkrumah Hostel", emoji: "🏠", kind: "Hostel", tier: 2, verified: true,
    lng: 7.400577, lat: 6.869655,
    blurb: "Hostel on the west side of campus, near the stadium road.",
    actions: [
      a("visit", "🚪", "Visit a friend here", 45, { social: 8, fun: 4 }, "You went in for five minutes and left two hours later.")
    ],
  },
  {
    id: "pg", name: "PG Hostel", emoji: "🏠", kind: "Postgraduate hostel", tier: 2, verified: true,
    lng: 7.400926, lat: 6.86903,
    blurb: "Postgraduate hostel. Quiet and full of serious people.",
    actions: [
      a("visit", "🚪", "Visit a friend here", 45, { social: 8, fun: 4 }, "You went in for five minutes and left two hours later.")
    ],
  },
  {
    id: "arts", name: "Faculty of Arts", emoji: "🎨", kind: "Lectures", tier: 2, verified: true,
    lng: 7.404668, lat: 6.862964,
    blurb: "Faculty of Arts complex: lecture rooms, drama practice and loud debates.",
    actions: [
      a("lecture", "🎓", "Attend lecture", 120, { energy: -12, fun: -6 }, "The lecturer came late, but you took notes."),
      a("group", "👥", "Group project meeting", 90, { social: 10, energy: -8 }, "Only two of five people came.")
    ],
  },
  {
    id: "social_sci", name: "Faculty of Social Sciences", emoji: "🧠", kind: "Lectures", tier: 2, verified: true,
    lng: 7.407806, lat: 6.860786,
    blurb: "Faculty of Social Sciences: politics, economics and long arguments.",
    actions: [
      a("lecture", "🎓", "Attend lecture", 120, { energy: -12, fun: -6 }, "The lecturer came late, but you took notes."),
      a("group", "👥", "Group project meeting", 90, { social: 10, energy: -8 }, "Only two of five people came.")
    ],
  },
  {
    id: "education", name: "Faculty of Education", emoji: "🍎", kind: "Lectures", tier: 2, verified: true,
    lng: 7.407804, lat: 6.860131,
    blurb: "Faculty of Education: lecture halls, teaching practice and group work.",
    actions: [
      a("lecture", "🎓", "Attend lecture", 120, { energy: -12, fun: -6 }, "The lecturer came late, but you took notes."),
      a("group", "👥", "Group project meeting", 90, { social: 10, energy: -8 }, "Only two of five people came.")
    ],
  },
  {
    id: "bio_sci", name: "Faculty of Biological Sciences", emoji: "🧬", kind: "Lectures and labs", tier: 2, verified: true,
    lng: 7.408458, lat: 6.865802,
    blurb: "Biological Sciences: lecture rooms and labs, with the Jimbazz building nearby.",
    actions: [
      a("lecture", "🎓", "Attend lecture", 120, { energy: -12, fun: -6 }, "The lecturer came late, but you took notes."),
      a("lab", "🧪", "Attend lab", 120, { energy: -15, fun: -4 }, "The experiment worked on the third try.")
    ],
  },
  {
    id: "pharmacy", name: "Pharmacy Building", emoji: "💊", kind: "Lectures and labs", tier: 2, verified: true,
    lng: 7.410815, lat: 6.863105,
    blurb: "The Pharmacy building: long labs and heavy textbooks.",
    actions: [
      a("lecture", "🎓", "Attend lecture", 120, { energy: -12, fun: -6 }, "The lecturer came late, but you took notes."),
      a("lab", "🧪", "Attend lab", 120, { energy: -15, fun: -4 }, "The experiment worked on the third try.")
    ],
  },
  {
    id: "engineering", name: "Civil Engineering Building", emoji: "🛠️", kind: "Lectures and labs", tier: 2, verified: true,
    lng: 7.409637, lat: 6.866985,
    blurb: "Engineering side of campus: drawing boards, labs and little sleep.",
    actions: [
      a("lecture", "🎓", "Attend lecture", 120, { energy: -12, fun: -6 }, "The lecturer came late, but you took notes."),
      a("lab", "🧪", "Attend lab", 120, { energy: -15, fun: -4 }, "The experiment worked on the third try."),
      a("group", "👥", "Group project meeting", 90, { social: 10, energy: -8 }, "Only two of five people came.")
    ],
  },
  {
    id: "medical", name: "UNN Medical Centre", emoji: "🏥", kind: "Clinic", tier: 2, verified: true,
    lng: 7.413148, lat: 6.860438,
    blurb: "The campus clinic. Long queues, but the nurses are kind.",
    actions: [
      a("checkup", "🩺", "Quick check-up", 45, { energy: 10 }, "The nurse said: rest and drink water.", { cost: 500 })
    ],
  },
  {
    id: "ekpo", name: "Ekpo Convocation Arena", emoji: "🎓", kind: "Arena", tier: 2, verified: true,
    lng: 7.411022, lat: 6.861667,
    blurb: "Big arena for convocation and large gatherings.",
    actions: [
      a("assembly", "🎓", "Attend an assembly", 60, { social: 8, fun: 4, energy: -4 }, "Speeches, claps and one fainting student.")
    ],
  },
  {
    id: "tennis", name: "Tennis Courts", emoji: "🎾", kind: "Sports", tier: 2, verified: true,
    lng: 7.40639, lat: 6.86553,
    blurb: "A row of tennis courts beside the library.",
    actions: [
      a("tennis", "🎾", "Play tennis", 60, { fun: 15, energy: -12 }, "You lost, but with style.")
    ],
  },
  {
    id: "pool", name: "Swimming Pool", emoji: "🏊", kind: "Sports", tier: 2, verified: true,
    lng: 7.40706, lat: 6.86749,
    blurb: "The campus swimming pool.",
    actions: [
      a("swim", "🏊", "Swim", 60, { fun: 18, energy: -10 }, "Cold water, clear head.", { cost: 200 })
    ],
  },
  {
    id: "zoology", name: "Zoology Department", emoji: "🐸", kind: "Lectures", tier: 3, verified: true,
    lng: 7.411813, lat: 6.865179,
    blurb: "Zoology and Environmental Biology: specimens, field trips and early lectures.",
    actions: [
      a("lecture", "🎓", "Attend lecture", 120, { energy: -12, fun: -6 }, "The lecturer came late, but you took notes."),
      a("lab", "🧪", "Attend lab", 120, { energy: -15, fun: -4 }, "The experiment worked on the third try.")
    ],
  },
  {
    id: "vet", name: "Veterinary Department", emoji: "🐄", kind: "Lectures", tier: 3, verified: true,
    lng: 7.412611, lat: 6.865662,
    blurb: "Veterinary Medicine: farm smells and serious students.",
    actions: [
      a("lecture", "🎓", "Attend lecture", 120, { energy: -12, fun: -6 }, "The lecturer came late, but you took notes."),
      a("lab", "🧪", "Attend lab", 120, { energy: -15, fun: -4 }, "The experiment worked on the third try.")
    ],
  },
  {
    id: "economics", name: "Department of Economics", emoji: "💹", kind: "Lectures", tier: 3, verified: true,
    lng: 7.406505, lat: 6.862242,
    blurb: "Economics department: graphs, theories and arguments about naira.",
    actions: [
      a("lecture", "🎓", "Attend lecture", 120, { energy: -12, fun: -6 }, "The lecturer came late, but you took notes.")
    ],
  },
  {
    id: "pol_sci", name: "Department of Political Science", emoji: "🗳️", kind: "Lectures", tier: 3, verified: true,
    lng: 7.407639, lat: 6.860537,
    blurb: "Political Science: where future SUG presidents practise speeches.",
    actions: [
      a("lecture", "🎓", "Attend lecture", 120, { energy: -12, fun: -6 }, "The lecturer came late, but you took notes.")
    ],
  },
  {
    id: "pub_admin", name: "Public Administration", emoji: "🏛️", kind: "Lectures", tier: 3, verified: true,
    lng: 7.407238, lat: 6.861127,
    blurb: "Department of Public Administration and Local Government.",
    actions: [
      a("lecture", "🎓", "Attend lecture", 120, { energy: -12, fun: -6 }, "The lecturer came late, but you took notes.")
    ],
  },
  {
    id: "lib_sci", name: "Library Science", emoji: "📖", kind: "Lectures", tier: 3, verified: true,
    lng: 7.408092, lat: 6.860284,
    blurb: "Department of Library Science.",
    actions: [
      a("lecture", "🎓", "Attend lecture", 120, { energy: -12, fun: -6 }, "The lecturer came late, but you took notes.")
    ],
  },
  {
    id: "afrihub", name: "Afrihub", emoji: "💻", kind: "Tech hub", tier: 3, verified: true,
    lng: 7.406576, lat: 6.862748,
    blurb: "A tech hub on campus. Good for side projects and paid gigs.",
    actions: [
      a("hub", "💻", "Work from the hub", 120, { energy: -14, hunger: -6 }, "Deployed a small project. Client paid fast.", { earn: 2000 })
    ],
  },
  {
    id: "chapel", name: "Christ Church Chapel", emoji: "🙏", kind: "Fellowship", tier: 3, verified: true,
    lng: 7.404107, lat: 6.861598,
    blurb: "Fellowship, worship and people who will remember your name.",
    actions: [
      a("fellowship", "🙏", "Join fellowship", 90, { social: 12, fun: 6, energy: -4 }, "Good vibes and a free snack at the end.")
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
