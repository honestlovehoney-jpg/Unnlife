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
  /** position is an estimate (about 30-60 m) from map screenshots */
  approx?: boolean;
  hostelId?: string;
  actions: PlaceAction[];
}

const a = (
  id: string, emoji: string, label: string, minutes: number,
  needs: Partial<Record<NeedKey, number>>, msg: string,
  extra: { cost?: number; earn?: number; residentOnly?: boolean } = {}
): PlaceAction => ({ id, emoji, label, minutes, needs, msg, ...extra });

/*
 * Still missing a real location: Shuttle Park, Hilltop Gate, Okpara and Tetfund hostels, Access ICT Centre,
 * Franco Refectory, Ikenga Hotel, Pandelia Hotel, Old Carolina, Roban store, Animal Farm.
 * Low-confidence spots (Main Gate, 2nd Gate, town hotels, sports pitches) are kept out until checked.
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
    id: "chitis", name: "Chitis (Akenzua Refectory)", emoji: "🍲", kind: "Food spot", tier: 1, verified: true,
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
    id: "vc", name: "VC Building and Administration", emoji: "🏢", kind: "Administration and free Wi-Fi", tier: 1, verified: true, wifi: true,
    lng: 7.408062, lat: 6.86278,
    blurb: "The Vice-Chancellor's office and the Administration Building. Queues, stamps and a free Wi-Fi hotspot.",
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
    blurb: "The campus First Bank branch. ATM and counter services arrive with the Bank app.",
    actions: [],
  },
  {
    id: "sub", name: "SUB (Students' Union Building)", emoji: "📢", kind: "Student union and food", tier: 1, verified: true,
    lng: 7.412232, lat: 6.862178,
    blurb: "The Students' Union Building with Green Diner, Barbecuza, CYPHER HUB and a pharmacy around it.",
    actions: [
      a("sugmeet", "📢", "Sit in on a union meeting", 90, { social: 12, fun: 4, energy: -6 }, "Motions, points of order and one long argument."),
      a("greendiner", "🥗", "Eat at Green Diner", 30, { hunger: 35, fun: 3 }, "A light plate. Healthier than you expected.", { cost: 1800 }),
      a("bbq", "🍖", "Grill at Barbecuza", 30, { hunger: 30, social: 4, fun: 4 }, "Smoky and loud.", { cost: 1500 })
    ],
  },
  {
    id: "container", name: "Container", emoji: "📎", kind: "Cheap food, books and printing", tier: 1, verified: true, approx: true,
    lng: 7.407825, lat: 6.864887,
    blurb: "The Container beside First Bank: UNN Admission, Wisdom Cafe, cyber cafes and photocopy shops under one roof.",
    actions: [
      a("cheapmeal", "🍚", "Cheap rice and stew", 20, { hunger: 35 }, "Plain plate, big portion.", { cost: 900 }),
      a("textbook", "📘", "Buy a textbook", 20, { fun: -2 }, "Textbook in your bag. It will boost your studying later.", { cost: 3500 }),
      a("photocopy", "🖨️", "Photocopy lecture notes", 15, { fun: -1 }, "Fresh notes, warm paper.", { cost: 150 })
    ],
  },
  {
    id: "marlima", name: "Marlima", emoji: "🍽️", kind: "Food and shops", tier: 1, verified: true,
    lng: 7.411565, lat: 6.862975,
    blurb: "The long building on Hiltop Gate Rd with Marlima Restaurant and Benima Mall, across from the Pharmacy building.",
    actions: [
      a("marlima", "🍽️", "Eat at Marlima Restaurant", 35, { hunger: 40, fun: 4 }, "West African plate, proper portion.", { cost: 2000 }),
      a("mall", "🛍️", "Browse Benima Mall", 40, { fun: 8 }, "Window-shopping and gist."),
      a("fruit", "🍉", "Fruit therapy", 15, { hunger: 12, energy: 4 }, "Fresh fruit. Feels healthy.", { cost: 800 })
    ],
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
    id: "eyo_ita", name: "Eyo-ita Hostel", emoji: "🏠", kind: "Hostel (girls)", tier: 2, verified: true, hostelId: "eyo_ita",
    lng: 7.409198, lat: 6.86303,
    blurb: "Girls hostel on Hiltop Gate Rd, joined to Bello Hall.",
    actions: [
      a("sleep", "🛏️", "Sleep", 480, { energy: 55, hunger: -15 }, "You slept like someone with no 8am class.", { residentOnly: true }),
      a("rest", "🛋️", "Rest a bit", 60, { energy: 10 }, "A short rest. Back to life.", { residentOnly: true }),
      a("roomgist", "💬", "Gist with roommates", 60, { social: 15, fun: 5 }, "The gist went on longer than planned.", { residentOnly: true }),
      a("visit", "🚪", "Visit a friend here", 45, { social: 8, fun: 4 }, "You went in for five minutes and left two hours later.")
    ],
  },
  {
    id: "bello", name: "Bello Hall", emoji: "🏠", kind: "Hostel (girls)", tier: 2, verified: true, hostelId: "bello",
    lng: 7.409961, lat: 6.863192,
    blurb: "Girls hostel, the eastern wing beside Eyo-ita, close to the Pharmacy building.",
    actions: [
      a("sleep", "🛏️", "Sleep", 480, { energy: 55, hunger: -15 }, "You slept like someone with no 8am class.", { residentOnly: true }),
      a("rest", "🛋️", "Rest a bit", 60, { energy: 10 }, "A short rest. Back to life.", { residentOnly: true }),
      a("roomgist", "💬", "Gist with roommates", 60, { social: 15, fun: 5 }, "The gist went on longer than planned.", { residentOnly: true }),
      a("visit", "🚪", "Visit a friend here", 45, { social: 8, fun: 4 }, "You went in for five minutes and left two hours later.")
    ],
  },
  {
    id: "awolowo", name: "Awolowo Hostel (Aja Nwachukwu)", emoji: "🏠", kind: "Hostel (girls)", tier: 2, verified: true, hostelId: "awolowo",
    lng: 7.412539, lat: 6.862992,
    blurb: "Long girls hostel on Hiltop Gate Rd with food stalls on its doorstep.",
    actions: [
      a("sleep", "🛏️", "Sleep", 480, { energy: 55, hunger: -15 }, "You slept like someone with no 8am class.", { residentOnly: true }),
      a("rest", "🛋️", "Rest a bit", 60, { energy: 10 }, "A short rest. Back to life.", { residentOnly: true }),
      a("roomgist", "💬", "Gist with roommates", 60, { social: 15, fun: 5 }, "The gist went on longer than planned.", { residentOnly: true }),
      a("visit", "🚪", "Visit a friend here", 45, { social: 8, fun: 4 }, "You went in for five minutes and left two hours later.")
    ],
  },
  {
    id: "akintola", name: "Akintola Hall", emoji: "🏠", kind: "Hostel (girls)", tier: 2, verified: true, approx: true, hostelId: "akintola",
    lng: 7.412415, lat: 6.860905,
    blurb: "West wing of the zigzag hostel block near the Medical Centre.",
    actions: [
      a("sleep", "🛏️", "Sleep", 480, { energy: 55, hunger: -15 }, "You slept like someone with no 8am class.", { residentOnly: true }),
      a("rest", "🛋️", "Rest a bit", 60, { energy: 10 }, "A short rest. Back to life.", { residentOnly: true }),
      a("roomgist", "💬", "Gist with roommates", 60, { social: 15, fun: 5 }, "The gist went on longer than planned.", { residentOnly: true }),
      a("visit", "🚪", "Visit a friend here", 45, { social: 8, fun: 4 }, "You went in for five minutes and left two hours later.")
    ],
  },
  {
    id: "akpabio", name: "Akpabio Hall", emoji: "🏠", kind: "Hostel (girls)", tier: 2, verified: true, approx: true, hostelId: "akpabio",
    lng: 7.412775, lat: 6.860905,
    blurb: "East wing of the zigzag hostel block near the Medical Centre.",
    actions: [
      a("sleep", "🛏️", "Sleep", 480, { energy: 55, hunger: -15 }, "You slept like someone with no 8am class.", { residentOnly: true }),
      a("rest", "🛋️", "Rest a bit", 60, { energy: 10 }, "A short rest. Back to life.", { residentOnly: true }),
      a("roomgist", "💬", "Gist with roommates", 60, { social: 15, fun: 5 }, "The gist went on longer than planned.", { residentOnly: true }),
      a("visit", "🚪", "Visit a friend here", 45, { social: 8, fun: 4 }, "You went in for five minutes and left two hours later.")
    ],
  },
  {
    id: "balewa", name: "Balewa Hostel", emoji: "🏠", kind: "Hostel (girls)", tier: 2, verified: true, hostelId: "balewa",
    lng: 7.409297, lat: 6.860221,
    blurb: "Long girls hostel near the Faculty of Education.",
    actions: [
      a("sleep", "🛏️", "Sleep", 480, { energy: 55, hunger: -15 }, "You slept like someone with no 8am class.", { residentOnly: true }),
      a("rest", "🛋️", "Rest a bit", 60, { energy: 10 }, "A short rest. Back to life.", { residentOnly: true }),
      a("roomgist", "💬", "Gist with roommates", 60, { social: 15, fun: 5 }, "The gist went on longer than planned.", { residentOnly: true }),
      a("visit", "🚪", "Visit a friend here", 45, { social: 8, fun: 4 }, "You went in for five minutes and left two hours later.")
    ],
  },
  {
    id: "okeke", name: "Okeke Hostel", emoji: "🏠", kind: "Hostel (girls)", tier: 2, verified: true, hostelId: "okeke",
    lng: 7.414071, lat: 6.862098,
    blurb: "Girls hostel on James Africanus Norton Rd, close to the banks.",
    actions: [
      a("sleep", "🛏️", "Sleep", 480, { energy: 55, hunger: -15 }, "You slept like someone with no 8am class.", { residentOnly: true }),
      a("rest", "🛋️", "Rest a bit", 60, { energy: 10 }, "A short rest. Back to life.", { residentOnly: true }),
      a("roomgist", "💬", "Gist with roommates", 60, { social: 15, fun: 5 }, "The gist went on longer than planned.", { residentOnly: true }),
      a("visit", "🚪", "Visit a friend here", 45, { social: 8, fun: 4 }, "You went in for five minutes and left two hours later.")
    ],
  },
  {
    id: "isa_kaita", name: "Isa Kaita Hostel", emoji: "🏠", kind: "Hostel (girls)", tier: 2, verified: true, hostelId: "isa_kaita",
    lng: 7.41466, lat: 6.862048,
    blurb: "The eastern wing of the Okeke block, close to Fidelity Bank.",
    actions: [
      a("sleep", "🛏️", "Sleep", 480, { energy: 55, hunger: -15 }, "You slept like someone with no 8am class.", { residentOnly: true }),
      a("rest", "🛋️", "Rest a bit", 60, { energy: 10 }, "A short rest. Back to life.", { residentOnly: true }),
      a("roomgist", "💬", "Gist with roommates", 60, { social: 15, fun: 5 }, "The gist went on longer than planned.", { residentOnly: true }),
      a("visit", "🚪", "Visit a friend here", 45, { social: 8, fun: 4 }, "You went in for five minutes and left two hours later.")
    ],
  },
  {
    id: "nkrumah", name: "Kwame Nkrumah Hostel", emoji: "🏠", kind: "Hostel (girls)", tier: 2, verified: true, hostelId: "kwame_nkrumah",
    lng: 7.400577, lat: 6.869655,
    blurb: "Girls hostel on the west side of campus, near the stadium road.",
    actions: [
      a("sleep", "🛏️", "Sleep", 480, { energy: 55, hunger: -15 }, "You slept like someone with no 8am class.", { residentOnly: true }),
      a("rest", "🛋️", "Rest a bit", 60, { energy: 10 }, "A short rest. Back to life.", { residentOnly: true }),
      a("roomgist", "💬", "Gist with roommates", 60, { social: 15, fun: 5 }, "The gist went on longer than planned.", { residentOnly: true }),
      a("visit", "🚪", "Visit a friend here", 45, { social: 8, fun: 4 }, "You went in for five minutes and left two hours later.")
    ],
  },
  {
    id: "pg", name: "PG Hostel", emoji: "🏠", kind: "Postgraduate hostel", tier: 3, verified: true,
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
    id: "vte", name: "Faculty of Vocational and Technical Education", emoji: "🔧", kind: "Lectures", tier: 3, verified: true,
    lng: 7.411359, lat: 6.860713,
    blurb: "Vocational and Technical Education: workshops and practical classes.",
    actions: [
      a("lecture", "🎓", "Attend lecture", 120, { energy: -12, fun: -6 }, "The lecturer came late, but you took notes."),
      a("lab", "🧪", "Attend lab", 120, { energy: -15, fun: -4 }, "The experiment worked on the third try.")
    ],
  },
  {
    id: "bio_sci", name: "Faculty of Biological Sciences", emoji: "🧬", kind: "Lectures and labs", tier: 2, verified: true,
    lng: 7.408458, lat: 6.865802,
    blurb: "Biological Sciences: lecture rooms and labs.",
    actions: [
      a("lecture", "🎓", "Attend lecture", 120, { energy: -12, fun: -6 }, "The lecturer came late, but you took notes."),
      a("lab", "🧪", "Attend lab", 120, { energy: -15, fun: -4 }, "The experiment worked on the third try.")
    ],
  },
  {
    id: "pharmacy", name: "Pharmacy Building", emoji: "💊", kind: "Lectures and labs", tier: 2, verified: true,
    lng: 7.410815, lat: 6.863105,
    blurb: "The Pharmacy building on Hiltop Gate Rd: long labs and heavy textbooks.",
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
    id: "ekpo", name: "Ekpo Convocation Arena (Ekpo Ref)", emoji: "🎓", kind: "Arena and refectory", tier: 2, verified: true,
    lng: 7.411022, lat: 6.861667,
    blurb: "Big arena for convocation and large gatherings, with the Ekpo Ref canteen.",
    actions: [
      a("assembly", "🎓", "Attend an assembly", 60, { social: 8, fun: 4, energy: -4 }, "Speeches, claps and one fainting student."),
      a("eatekpo", "🍛", "Eat at Ekpo Ref", 30, { hunger: 40, fun: 2 }, "Cafeteria food: plain but filling.", { cost: 700 })
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
    id: "student_affairs", name: "Student Affairs Building", emoji: "🗂️", kind: "Administration", tier: 2, verified: true,
    lng: 7.411939, lat: 6.862977,
    blurb: "Student Affairs, with 120 Fruit Therapy next door on Hiltop Gate Rd.",
    actions: [
      a("queue", "📄", "Queue for a stamp", 60, { energy: -6, fun: -5 }, "Queued, stamped, repeated."),
      a("fruit", "🍉", "Fruit therapy", 15, { hunger: 12, energy: 4 }, "Fresh fruit. Feels healthy.", { cost: 800 })
    ],
  },
  {
    id: "cedr", name: "CEDR (Entrepreneurship Centre)", emoji: "💼", kind: "Workshops", tier: 3, verified: true,
    lng: 7.411853, lat: 6.863547,
    blurb: "Centre for Entrepreneurship and Development Research, across Hiltop Gate Rd.",
    actions: [
      a("cedrwork", "💼", "Attend an entrepreneurship workshop", 90, { energy: -8, social: 8, fun: 2 }, "Ideas, business plans and free snacks.")
    ],
  },
  {
    id: "carver", name: "Carver Building", emoji: "🎓", kind: "Lectures", tier: 3, verified: true,
    lng: 7.411366, lat: 6.863784,
    blurb: "Carver Building, tucked behind the entrepreneurship centre.",
    actions: [
      a("lecture", "🎓", "Attend lecture", 120, { energy: -12, fun: -6 }, "The lecturer came late, but you took notes.")
    ],
  },
  {
    id: "bookshop", name: "University Bookshop", emoji: "📘", kind: "Bookshop", tier: 2, verified: true,
    lng: 7.406793, lat: 6.862814,
    blurb: "The university bookshop, beside the Centre for Distance and E-learning.",
    actions: [
      a("textbook", "📘", "Buy a textbook", 20, { fun: -2 }, "Textbook in your bag. It will boost your studying later.", { cost: 3500 }),
      a("stationery", "✏️", "Buy stationery", 10, {}, "Pens, a notebook and a ruler.", { cost: 800 }),
      a("photocopy", "🖨️", "Photocopy lecture notes", 15, { fun: -1 }, "Fresh notes, warm paper.", { cost: 150 })
    ],
  },
  {
    id: "bursary", name: "Bursary Office", emoji: "💳", kind: "Administration", tier: 3, verified: true,
    lng: 7.407033, lat: 6.862813,
    blurb: "Fees, receipts and long queues.",
    actions: [
      a("queue", "📄", "Queue for a stamp", 60, { energy: -6, fun: -5 }, "Queued, stamped, repeated.")
    ],
  },
  {
    id: "cdel", name: "Centre for Distance and E-learning", emoji: "🖥️", kind: "E-learning", tier: 3, verified: true,
    lng: 7.406395, lat: 6.863098,
    blurb: "Online classes and registration support.",
    actions: [
      a("ictwork", "💻", "Register and browse", 45, { energy: -4, fun: 2 }, "Registration done. Wi-Fi was slow but it worked.")
    ],
  },
  {
    id: "lion_fm", name: "Lion FM", emoji: "📻", kind: "Campus radio", tier: 3, verified: true,
    lng: 7.406291, lat: 6.862655,
    blurb: "The campus radio station.",
    actions: [
      a("radio", "📻", "Visit the radio studio", 45, { fun: 8, social: 6 }, "You got a shout-out on air.")
    ],
  },
  {
    id: "arts_theatre", name: "Arts Theatre", emoji: "🎭", kind: "Theatre", tier: 2, verified: true,
    lng: 7.40835, lat: 6.861663,
    blurb: "Student plays, rehearsals and big events.",
    actions: [
      a("event", "🎭", "Attend an event", 90, { fun: 12, social: 10, energy: -6 }, "A packed hall and a very long opening prayer.")
    ],
  },
  {
    id: "fountain", name: "UNN Fountain", emoji: "⛲", kind: "Hangout", tier: 3, verified: true,
    lng: 7.407976, lat: 6.863323,
    blurb: "The campus fountain, a good place to sit and gist.",
    actions: [
      a("sit", "⛲", "Sit by the fountain", 30, { fun: 6, social: 8, energy: 3 }, "Cool breeze, free gist.")
    ],
  },
  {
    id: "freedom_sq", name: "Freedom Square", emoji: "🧑‍🤝‍🧑", kind: "Hangout", tier: 2, verified: true,
    lng: 7.409385, lat: 6.861396,
    blurb: "Open square where rallies, debates and football all happen.",
    actions: [
      a("square", "🧑‍🤝‍🧑", "Hang out at Freedom Square", 45, { social: 10, fun: 6 }, "A speech, a debate and a football on the side.")
    ],
  },
  {
    id: "gracious", name: "Gracious Foodie", emoji: "🍛", kind: "Food spot", tier: 3, verified: true,
    lng: 7.40808, lat: 6.863139,
    blurb: "Small food spot near the fountain.",
    actions: [
      a("gracious", "🍛", "Eat at Gracious Foodie", 25, { hunger: 32 }, "Hot plate, polite service.", { cost: 1200 })
    ],
  },
  {
    id: "zenith_ict", name: "Zenith ICT Centre", emoji: "💻", kind: "ICT centre and free Wi-Fi", tier: 2, verified: true, approx: true, wifi: true,
    lng: 7.408603, lat: 6.867692,
    blurb: "The Zenith ICT Centre: registration, browsing and a free Wi-Fi hotspot.",
    actions: [
      a("ictwork", "💻", "Register and browse", 45, { energy: -4, fun: 2 }, "Registration done. Wi-Fi was slow but it worked.")
    ],
  },
  {
    id: "zenith_bank", name: "Zenith Bank (ICT, ATM and Cash Centre)", emoji: "🏦", kind: "Bank and ATM", tier: 3, verified: true, approx: true,
    lng: 7.40817, lat: 6.867792,
    blurb: "Zenith Bank cash centre and ATM beside the ICT centre.",
    actions: [],
  },
  {
    id: "access_atm", name: "Access Bank ATM Gallery", emoji: "🏧", kind: "ATM", tier: 3, verified: true, approx: true,
    lng: 7.408091, lat: 6.868131,
    blurb: "Access Bank ATM gallery near the Innovation Centre.",
    actions: [],
  },
  {
    id: "fidelity", name: "Fidelity Bank (UNN)", emoji: "🏦", kind: "Bank and ATM", tier: 2, verified: true,
    lng: 7.415021, lat: 6.86188,
    blurb: "Fidelity Bank at the Hiltop Gate Rd junction, beside the Okeke hostel.",
    actions: [],
  },
  {
    id: "uba_hall", name: "UBA Hall of Fame", emoji: "🎵", kind: "Event hall", tier: 3, verified: true,
    lng: 7.415156, lat: 6.862477,
    blurb: "Event hall near the Okeke block, at the Fidelity Bank junction.",
    actions: [
      a("event", "🎭", "Attend an event", 90, { fun: 12, social: 10, energy: -6 }, "A packed hall and a very long opening prayer.")
    ],
  },
  {
    id: "lion_water", name: "Lion Table Water Factory", emoji: "💧", kind: "Water factory", tier: 3, verified: true,
    lng: 7.408103, lat: 6.866466,
    blurb: "The UNN water factory (Lion table water).",
    actions: [
      a("tablewater", "💧", "Buy table water", 5, { hunger: 3 }, "Cold sachet of pure water.", { cost: 150 })
    ],
  },
  {
    id: "innovation", name: "Innovation Centre", emoji: "💡", kind: "Innovation hub", tier: 3, verified: true, approx: true,
    lng: 7.408438, lat: 6.867725,
    blurb: "University Innovation Centre: workshops, start-ups and demo days.",
    actions: [
      a("workshop", "💡", "Attend a workshop", 60, { energy: -6, fun: 4, social: 6 }, "A short talk and a long demo.")
    ],
  },
  {
    id: "st_peters", name: "St Peter's Catholic Chaplaincy", emoji: "⛪", kind: "Fellowship", tier: 3, verified: true,
    lng: 7.410496, lat: 6.858738,
    blurb: "Catholic chaplaincy beside Seat of Wisdom Hall.",
    actions: [
      a("fellowship", "🙏", "Join fellowship", 90, { social: 12, fun: 6, energy: -4 }, "Good vibes and a free snack at the end.")
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
    id: "afrihub", name: "Afrihub (ACB Building)", emoji: "💻", kind: "Tech hub", tier: 3, verified: true,
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
