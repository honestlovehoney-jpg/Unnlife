export interface Roommate {
  id: string;
  name: string;
  gender: "boys" | "girls";
  personality: string;
  routine: string;
  department: string;
  financialSituation: "broke" | "managing" | "comfortable";
  socialPreference: "introvert" | "extrovert" | "mixed";
  goals: string[];
}

export interface Hostel {
  id: string;
  name: string;
  type: "boys" | "girls";
  location: string;
  officialCapacityPerRoom: number;
  simulatedOccupancy: number;
  totalBeds: number; // simple capacity for prototype
  occupiedBeds: number;
  shopsNearby: string[];
  rumours: string[];
  isPresidential?: boolean;
  /** has a real position on the map; hostels without one cannot be allocated yet */
  located: boolean;
}

export interface OffCampusOption {
  id: string;
  name: string;
  type: "single_room" | "self_contained" | "one_bedroom" | "two_bedroom" | "three_bedroom";
  monthlyRent: number;
  deposit: number;
  travelTimeMinutes: number;
  description: string;
  utilities: string;
  privacy: "low" | "medium" | "high";
}

/*
 * The 15 UNN hostels: 2 boys, 13 girls (campus account of the full list).
 * Bed counts and rumours are GAMEPLAY DESIGN, not campus facts.
 * Okpara and Tetfund still need a real map position, so they are not allocatable yet.
 */
export const hostels: Hostel[] = [
  {
    id: "alvan_ikoku",
    name: "Alvan Ikoku Hostel",
    type: "boys",
    location: "Nsukka Campus",
    officialCapacityPerRoom: 4,
    simulatedOccupancy: 6,
    totalBeds: 200,
    occupiedBeds: 180,
    shopsNearby: ["Provision shop", "Water seller"],
    rumours: ["Always noisy after 10pm", "Good for early morning hustle", "Sometimes power issues"],
    located: true,
  },
  {
    id: "eni_njoku",
    name: "Eni Njoku Hostel",
    type: "boys",
    location: "Nsukka Campus",
    officialCapacityPerRoom: 4,
    simulatedOccupancy: 7,
    totalBeds: 200,
    occupiedBeds: 190,
    shopsNearby: ["Provision shop", "Water seller"],
    rumours: ["Roommates sometimes share space tightly", "Serious readers live here"],
    located: true,
  },
  {
    id: "presidential",
    name: "Presidential Hostel",
    type: "girls",
    location: "Hiltop Gate Rd",
    officialCapacityPerRoom: 10,
    simulatedOccupancy: 12,
    totalBeds: 80,
    occupiedBeds: 70,
    shopsNearby: ["Green Diner", "Boutique"],
    rumours: ["Hardest to get", "More privacy", "Higher vibe"],
    located: true,
    isPresidential: true,
  },
  {
    id: "bello",
    name: "Bello Hall",
    type: "girls",
    location: "Hiltop Gate Rd",
    officialCapacityPerRoom: 4,
    simulatedOccupancy: 6,
    totalBeds: 150,
    occupiedBeds: 140,
    shopsNearby: ["Provision store"],
    rumours: ["Pharmacy students common here"],
    located: true,
  },
  {
    id: "eyo_ita",
    name: "Eyo-ita Hostel",
    type: "girls",
    location: "Hiltop Gate Rd",
    officialCapacityPerRoom: 4,
    simulatedOccupancy: 6,
    totalBeds: 140,
    occupiedBeds: 120,
    shopsNearby: ["Tech edge phone shop", "Provision store"],
    rumours: ["Joined to Bello Hall by one long block"],
    located: true,
  },
  {
    id: "mary_slessor",
    name: "Mary Slessor Hall",
    type: "girls",
    location: "Convocation Ave",
    officialCapacityPerRoom: 4,
    simulatedOccupancy: 6,
    totalBeds: 120,
    occupiedBeds: 100,
    shopsNearby: ["Provision store", "Hair shop"],
    rumours: ["Strict visitors policy in the evening", "Nice view of campus"],
    located: true,
  },
  {
    id: "awolowo",
    name: "Awolowo Hostel (Aja Nwachukwu)",
    type: "girls",
    location: "Hiltop Gate Rd",
    officialCapacityPerRoom: 6,
    simulatedOccupancy: 8,
    totalBeds: 180,
    occupiedBeds: 150,
    shopsNearby: ["OGB cool spot", "Food stalls"],
    rumours: ["Food stalls right at the door", "Long corridors, long queues for water"],
    located: true,
  },
  {
    id: "akintola",
    name: "Akintola Hall",
    type: "girls",
    location: "James Africanus Norton Rd",
    officialCapacityPerRoom: 6,
    simulatedOccupancy: 8,
    totalBeds: 110,
    occupiedBeds: 90,
    shopsNearby: ["Green Diner", "Medical Centre"],
    rumours: ["Close to the Medical Centre"],
    located: true,
  },
  {
    id: "akpabio",
    name: "Akpabio Hall",
    type: "girls",
    location: "James Africanus Norton Rd",
    officialCapacityPerRoom: 6,
    simulatedOccupancy: 8,
    totalBeds: 110,
    occupiedBeds: 95,
    shopsNearby: ["Green Diner", "Medical Centre"],
    rumours: ["Close to the Medical Centre"],
    located: true,
  },
  {
    id: "balewa",
    name: "Balewa Hostel",
    type: "girls",
    location: "Nsukka Campus",
    officialCapacityPerRoom: 4,
    simulatedOccupancy: 6,
    totalBeds: 150,
    occupiedBeds: 130,
    shopsNearby: ["Provision store"],
    rumours: ["Near the Faculty of Education"],
    located: true,
  },
  {
    id: "okeke",
    name: "Okeke Hostel",
    type: "girls",
    location: "James Africanus Norton Rd",
    officialCapacityPerRoom: 4,
    simulatedOccupancy: 6,
    totalBeds: 130,
    occupiedBeds: 110,
    shopsNearby: ["Fidelity Bank", "Fresh unisex salon"],
    rumours: ["Close to the banks"],
    located: true,
  },
  {
    id: "isa_kaita",
    name: "Isa Kaita Hostel",
    type: "girls",
    location: "James Africanus Norton Rd",
    officialCapacityPerRoom: 4,
    simulatedOccupancy: 6,
    totalBeds: 130,
    occupiedBeds: 115,
    shopsNearby: ["Fidelity Bank", "UBA Hall of Fame"],
    rumours: ["Close to the banks"],
    located: true,
  },
  {
    id: "kwame_nkrumah",
    name: "Kwame Nkrumah Hostel",
    type: "girls",
    location: "Nsukka Campus",
    officialCapacityPerRoom: 4,
    simulatedOccupancy: 7,
    totalBeds: 160,
    occupiedBeds: 140,
    shopsNearby: ["Provision store"],
    rumours: ["Wide field in front, windy evenings"],
    located: true,
  },
  {
    id: "okpara",
    name: "Okpara Hostel",
    type: "girls",
    location: "Nsukka Campus",
    officialCapacityPerRoom: 6,
    simulatedOccupancy: 8,
    totalBeds: 120,
    occupiedBeds: 100,
    shopsNearby: ["Provision store"],
    rumours: ["Position still to be confirmed"],
    located: false,
  },
  {
    id: "tetfund_girls",
    name: "Tetfund Girls Hostel",
    type: "girls",
    location: "Behind Okeke and Bello",
    officialCapacityPerRoom: 4,
    simulatedOccupancy: 5,
    totalBeds: 240,
    occupiedBeds: 160,
    shopsNearby: ["Provision store"],
    rumours: ["Newest hostel on campus"],
    located: false,
  },
];

export const roommatePool: Roommate[] = [
  { id: "m1", name: "Chidi", gender: "boys", personality: "Serious jacko", routine: "Studies till late", department: "Computer Science", financialSituation: "managing", socialPreference: "introvert", goals: ["Graduate with good GPA"] },
  { id: "m2", name: "Emeka", gender: "boys", personality: "Noisy gist partner", routine: "Out most evenings", department: "Political Science", financialSituation: "broke", socialPreference: "extrovert", goals: ["Become SUG president"] },
  { id: "m3", name: "Tunde", gender: "boys", personality: "Hustler", routine: "Always on business calls", department: "Economics", financialSituation: "managing", socialPreference: "mixed", goals: ["Start a shuttle business"] },
  { id: "m4", name: "Ike", gender: "boys", personality: "Early-morning prayer warrior", routine: "Prays at 5am", department: "Zoology and Environmental Biology", financialSituation: "managing", socialPreference: "introvert", goals: ["Join fellowship leadership"] },
  { id: "m5", name: "Kelechi", gender: "boys", personality: "Gamer who never sleeps early", routine: "Gaming till 2am", department: "Electrical Engineering", financialSituation: "comfortable", socialPreference: "mixed", goals: ["Win campus tournament"] },
  { id: "m6", name: "Obinna", gender: "boys", personality: "Always borrowing something", routine: "Social and helpful", department: "Mass Communication", financialSituation: "broke", socialPreference: "extrovert", goals: ["Save for next semester"] },
  { id: "m7", name: "Chukwudi", gender: "boys", personality: "Quiet scholari", routine: "Reads in the library until it closes", department: "Biochemistry (BCH)", financialSituation: "managing", socialPreference: "introvert", goals: ["Finish with first class"] },
  { id: "m8", name: "Somto", gender: "boys", personality: "Football fanatic", routine: "Never misses a match", department: "Public Administration and Local Government", financialSituation: "managing", socialPreference: "extrovert", goals: ["Captain the department team"] },
  { id: "m9", name: "Uche", gender: "boys", personality: "Runs-runs guy", routine: "Always has a plan before exams", department: "Sociology and Anthropology", financialSituation: "broke", socialPreference: "mixed", goals: ["Stay out of trouble"] },
  { id: "m10", name: "Ifeanyi", gender: "boys", personality: "Neat and orderly", routine: "Washes clothes every Saturday", department: "Civil Engineering", financialSituation: "comfortable", socialPreference: "introvert", goals: ["Land a good internship"] },
  { id: "m11", name: "Nonso", gender: "boys", personality: "Music head", routine: "Plays beats on his speaker", department: "Music", financialSituation: "managing", socialPreference: "extrovert", goals: ["Perform at Students' Week"] },
  { id: "m12", name: "Kosi", gender: "boys", personality: "Jokes non-stop", routine: "Wakes everyone with gist", department: "Theatre and Film Studies", financialSituation: "broke", socialPreference: "extrovert", goals: ["Act in a campus play"] },
  { id: "m13", name: "Dubem", gender: "boys", personality: "Calm and helpful", routine: "Cooks for the room on Sundays", department: "Microbiology (MCB)", financialSituation: "managing", socialPreference: "mixed", goals: ["Get an internship in a lab"] },
  { id: "m14", name: "Arinze", gender: "boys", personality: "Class rep material", routine: "Knows every timetable change", department: "Philosophy", financialSituation: "comfortable", socialPreference: "extrovert", goals: ["Become class rep"] },
  { id: "f1", name: "Ada", gender: "girls", personality: "Quiet and clean", routine: "Early to bed, early rise", department: "English and Literary Studies", financialSituation: "comfortable", socialPreference: "introvert", goals: ["Read more novels"] },
  { id: "f2", name: "Blessing", gender: "girls", personality: "Gossip queen", routine: "Knows campus news first", department: "Mass Communication", financialSituation: "broke", socialPreference: "extrovert", goals: ["Build network"] },
  { id: "f3", name: "Ngozi", gender: "girls", personality: "Always borrowing something", routine: "Social and helpful", department: "Economics", financialSituation: "broke", socialPreference: "extrovert", goals: ["Save for next semester"] },
  { id: "f4", name: "Chiamaka", gender: "girls", personality: "Serious jacko", routine: "Reads from dawn", department: "Psychology", financialSituation: "managing", socialPreference: "introvert", goals: ["Graduate with good GPA"] },
  { id: "f5", name: "Oluchi", gender: "girls", personality: "Fashion plug", routine: "Sells small things in the hostel", department: "Fine and Applied Arts", financialSituation: "managing", socialPreference: "extrovert", goals: ["Start a clothing brand"] },
  { id: "f6", name: "Amara", gender: "girls", personality: "Fellowship sister", routine: "Prays before sleeping", department: "Religion and Cultural Studies", financialSituation: "managing", socialPreference: "mixed", goals: ["Lead the choir"] },
  { id: "f7", name: "Ifunanya", gender: "girls", personality: "Neat freak", routine: "Cleans the room every morning", department: "Plant Science and Biotechnology", financialSituation: "comfortable", socialPreference: "introvert", goals: ["Win a research prize"] },
  { id: "f8", name: "Nkechi", gender: "girls", personality: "Hustler", routine: "Always on phone with customers", department: "Public Administration and Local Government", financialSituation: "managing", socialPreference: "mixed", goals: ["Open a small shop"] },
  { id: "f9", name: "Ugo", gender: "girls", personality: "Loves good food", routine: "Knows every cheap food spot", department: "Library and Information Science", financialSituation: "broke", socialPreference: "extrovert", goals: ["Eat well on a budget"] },
  { id: "f10", name: "Adaeze", gender: "girls", personality: "Night reader", routine: "Sleeps late, wakes late", department: "History and International Studies", financialSituation: "managing", socialPreference: "introvert", goals: ["Write a book"] },
  { id: "f11", name: "Chinenye", gender: "girls", personality: "Class rep energy", routine: "Organises every group", department: "Political Science", financialSituation: "comfortable", socialPreference: "extrovert", goals: ["Win a faculty post"] },
  { id: "f12", name: "Kamsi", gender: "girls", personality: "Easy-going", routine: "Joins every hostel gist", department: "Sociology and Anthropology", financialSituation: "broke", socialPreference: "extrovert", goals: ["Make lifelong friends"] },
  { id: "f13", name: "Ebere", gender: "girls", personality: "Calm and focused", routine: "Studies in the library", department: "Linguistics, Igbo and Other Nigerian Languages", financialSituation: "managing", socialPreference: "introvert", goals: ["Teach one day"] },
  { id: "f14", name: "Ogechi", gender: "girls", personality: "Dance lover", routine: "Practices steps at night", department: "Theatre and Film Studies", financialSituation: "managing", socialPreference: "extrovert", goals: ["Dance at Bonfire Night"] },
];

export const offCampusOptions: OffCampusOption[] = [
  { id: "hilltop_single", name: "Hilltop Single Room", type: "single_room", monthlyRent: 20000, deposit: 20000, travelTimeMinutes: 15, description: "One room in a shared compound near Hilltop", utilities: "Shared electricity & water", privacy: "low" },
  { id: "odim_self", name: "Odim Self-Contained", type: "self_contained", monthlyRent: 35000, deposit: 35000, travelTimeMinutes: 18, description: "Room with private toilet and small kitchenette", utilities: "Prepaid electricity", privacy: "medium" },
  { id: "behind_1bed", name: "Behind Flat 1-Bedroom", type: "one_bedroom", monthlyRent: 55000, deposit: 55000, travelTimeMinutes: 12, description: "Bedroom + living space + kitchen", utilities: "More reliable power", privacy: "high" },
  { id: "nsukka_2bed", name: "Nsukka Town 2-Bedroom", type: "two_bedroom", monthlyRent: 75000, deposit: 75000, travelTimeMinutes: 25, description: "Share with a friend or roommate", utilities: "Shared bills", privacy: "medium" },
  { id: "premium_3bed", name: "Premium 3-Bedroom Apartment", type: "three_bedroom", monthlyRent: 110000, deposit: 110000, travelTimeMinutes: 20, description: "More space, housemates optional", utilities: "Generator backup", privacy: "high" },
];

const hash = (str: string) => {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
};

export function getDeterministicHostel(
  gender: "boys" | "girls",
  departmentId: string | null,
  year: number
): string | null {
  if (!departmentId) return null;

  // Female first-year medical / health sciences go to Presidential (those courses are not offered on this campus yet)
  const femaleFirstYearMedical = [
    "medicine", "dentistry", "anatomy", "physiology", "radiography",
    "nursing", "mls", "medical_rehab",
  ];
  if (gender === "girls" && year === 1 && femaleFirstYearMedical.includes(departmentId)) {
    return "presidential";
  }

  // Female Pharmacy goes to Bello (all years for now)
  if (gender === "girls" && departmentId === "pharmacy") {
    return "bello";
  }

  // Boys (only two hostels): spread by department, and use the other one if the first is full
  if (gender === "boys") {
    const first = hash(departmentId + ":" + year) % 2 === 0 ? "alvan_ikoku" : "eni_njoku";
    const other = first === "alvan_ikoku" ? "eni_njoku" : "alvan_ikoku";
    const pick = hostels.find((h) => h.id === first);
    if (pick && pick.occupiedBeds < pick.totalBeds) return first;
    return other;
  }

  // Other girls: spread over the girls hostels that have a real map position
  const pool = hostels.filter((h) => h.type === "girls" && h.located && h.id !== "presidential");
  if (pool.length === 0) return null;
  return pool[hash(departmentId + ":" + year) % pool.length].id;
}

export function hasAvailableBed(hostelId: string): boolean {
  const h = hostels.find(x => x.id === hostelId);
  return !!h && h.occupiedBeds < h.totalBeds;
}

export const getHostelsByType = (type: "boys" | "girls") => hostels.filter((h) => h.type === type);

export const getHostelById = (id: string) => hostels.find((h) => h.id === id);

/** Roommates always match the player's gender: boys and girls are never mixed. */
export const getRandomRoommates = (count: number, gender: "boys" | "girls"): Roommate[] => {
  const pool = roommatePool.filter((r) => r.gender === gender);
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, pool.length));
};
