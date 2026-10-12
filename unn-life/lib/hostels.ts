export interface Roommate {
  id: string;
  name: string;
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
  shopsNearby: string[];
  rumours: string[];
  isPresidential?: boolean;
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

export const hostels: Hostel[] = [
  {
    id: "alvan_ikoku",
    name: "Alvan Ikoku Hostel",
    type: "boys",
    location: "Nsukka Campus",
    officialCapacityPerRoom: 4,
    simulatedOccupancy: 6,
    shopsNearby: ["Okpa container", "Suya spot", "Water seller"],
    rumours: ["Always noisy after 10pm", "Good for early morning hustle", "Sometimes power issues"],
  },
  {
    id: "eni_njoku",
    name: "Eni Njoku Hostel",
    type: "boys",
    location: "Nsukka Campus",
    officialCapacityPerRoom: 4,
    simulatedOccupancy: 7,
    shopsNearby: ["Container", "Provision shop"],
    rumours: ["Roommates sometimes share space tightly", "Serious readers live here"],
  },
  {
    id: "akpabio",
    name: "Akpabio Hostel",
    type: "boys",
    location: "Nsukka Campus",
    officialCapacityPerRoom: 4,
    simulatedOccupancy: 5,
    shopsNearby: ["Snack stand"],
    rumours: ["Quieter", "Harder to get allocation"],
  },
  {
    id: "mary_slessor",
    name: "Mary Slessor Hall",
    type: "girls",
    location: "Nsukka Campus",
    officialCapacityPerRoom: 4,
    simulatedOccupancy: 6,
    shopsNearby: ["Provision store", "Hair shop"],
    rumours: ["Strict visitors policy in the evening", "Nice view of campus"],
  },
  {
    id: "presidential",
    name: "Presidential Hostel",
    type: "girls",
    location: "Nsukka Campus",
    officialCapacityPerRoom: 2,
    simulatedOccupancy: 3,
    shopsNearby: ["Boutique", "Food spot"],
    rumours: ["Hardest to get", "More privacy", "Higher vibe"],
    isPresidential: true,
  },
];

export const roommatePool: Roommate[] = [
  { id: "r1", name: "Chidi", personality: "Serious jacko", routine: "Studies till late", department: "Computer Science", financialSituation: "managing", socialPreference: "introvert", goals: ["Graduate with good GPA"] },
  { id: "r2", name: "Emeka", personality: "Noisy gist partner", routine: "Out most evenings", department: "Political Science", financialSituation: "broke", socialPreference: "extrovert", goals: ["Become SUG president"] },
  { id: "r3", name: "Ada", personality: "Quiet and clean", routine: "Early to bed, early rise", department: "English", financialSituation: "comfortable", socialPreference: "introvert", goals: ["Read more novels"] },
  { id: "r4", name: "Tunde", personality: "Hustler", routine: "Always on business calls", department: "Economics", financialSituation: "managing", socialPreference: "mixed", goals: ["Start a shuttle business"] },
  { id: "r5", name: "Blessing", personality: "Gossip queen", routine: "Knows campus news first", department: "Mass Communication", financialSituation: "broke", socialPreference: "extrovert", goals: ["Build network"] },
  { id: "r6", name: "Ike", personality: "Early-morning prayer warrior", routine: "Prays at 5am", department: "Zoology", financialSituation: "managing", socialPreference: "introvert", goals: ["Join fellowship leadership"] },
  { id: "r7", name: "Kelechi", personality: "Gamer who never sleeps early", routine: "Gaming till 2am", department: "Electrical Engineering", financialSituation: "comfortable", socialPreference: "mixed", goals: ["Win campus tournament"] },
  { id: "r8", name: "Ngozi", personality: "Always borrowing something", routine: "Social and helpful", department: "Accounting", financialSituation: "broke", socialPreference: "extrovert", goals: ["Save for next semester"] },
];

export const offCampusOptions: OffCampusOption[] = [
  { id: "hilltop_single", name: "Hilltop Single Room", type: "single_room", monthlyRent: 20000, deposit: 20000, travelTimeMinutes: 15, description: "One room in a shared compound near Hilltop", utilities: "Shared electricity & water", privacy: "low" },
  { id: "odim_self", name: "Odim Self-Contained", type: "self_contained", monthlyRent: 35000, deposit: 35000, travelTimeMinutes: 18, description: "Room with private toilet and small kitchenette", utilities: "Prepaid electricity", privacy: "medium" },
  { id: "behind_1bed", name: "Behind Flat 1-Bedroom", type: "one_bedroom", monthlyRent: 55000, deposit: 55000, travelTimeMinutes: 12, description: "Bedroom + living space + kitchen", utilities: "More reliable power", privacy: "high" },
  { id: "nsukka_2bed", name: "Nsukka Town 2-Bedroom", type: "two_bedroom", monthlyRent: 75000, deposit: 75000, travelTimeMinutes: 25, description: "Share with a friend or roommate", utilities: "Shared bills", privacy: "medium" },
  { id: "premium_3bed", name: "Premium 3-Bedroom Apartment", type: "three_bedroom", monthlyRent: 110000, deposit: 110000, travelTimeMinutes: 20, description: "More space, housemates optional", utilities: "Generator backup", privacy: "high" },
];

export const getHostelsByType = (type: "boys" | "girls") => hostels.filter(h => h.type === type);
export const getHostelById = (id: string) => hostels.find(h => h.id === id);
export const getRandomRoommates = (count: number): Roommate[] => {
  const shuffled = [...roommatePool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
