export interface Department {
  id: string;
  name: string;
  faculty: string;
  competition: "very_high" | "high" | "medium" | "low";
  campus: "Nsukka" | "Enugu" | "Ituku-Ozalla";
  isProfessional?: boolean;
  alternativeOffers?: string[]; // department ids that can be offered if preferred is missed
  transferDestinations?: string[]; // possible transfers after first year
  isNew2026?: boolean;
}

export const departments: Department[] = [
  // Professional / highly competitive
  { 
    id: "medicine", 
    name: "Medicine and Surgery", 
    faculty: "Medical Sciences", 
    competition: "very_high", 
    campus: "Ituku-Ozalla",
    isProfessional: true,
    alternativeOffers: ["zoology", "science_education", "agricultural_extension", "crop_science", "animal_science"],
    transferDestinations: ["medicine"]
  },
  { 
    id: "law", 
    name: "Law", 
    faculty: "Law", 
    competition: "very_high", 
    campus: "Enugu",
    isProfessional: true,
    alternativeOffers: ["english", "history", "philosophy", "political_science"],
    transferDestinations: ["law"]
  },
  { 
    id: "dentistry", 
    name: "Dentistry", 
    faculty: "Dentistry", 
    competition: "very_high", 
    campus: "Ituku-Ozalla",
    isProfessional: true,
    alternativeOffers: ["biochemistry", "zoology"],
    transferDestinations: ["dentistry"]
  },
  { 
    id: "vet_medicine", 
    name: "Veterinary Medicine", 
    faculty: "Veterinary Medicine", 
    competition: "very_high", 
    campus: "Nsukka",
    isProfessional: true,
    alternativeOffers: ["animal_science", "zoology"],
    transferDestinations: ["vet_medicine"]
  },
  { 
    id: "mechanical_eng", 
    name: "Mechanical Engineering", 
    faculty: "Engineering", 
    competition: "high", 
    campus: "Nsukka",
    isProfessional: true,
    alternativeOffers: ["physics", "mathematics", "computer_science"],
    transferDestinations: ["mechanical_eng"]
  },
  { 
    id: "civil_eng", 
    name: "Civil Engineering", 
    faculty: "Engineering", 
    competition: "high", 
    campus: "Nsukka",
    isProfessional: true,
    alternativeOffers: ["physics", "mathematics"],
    transferDestinations: ["civil_eng"]
  },
  { 
    id: "electrical_eng", 
    name: "Electrical Engineering", 
    faculty: "Engineering", 
    competition: "high", 
    campus: "Nsukka",
    isProfessional: true,
    alternativeOffers: ["physics", "computer_science"],
    transferDestinations: ["electrical_eng"]
  },

  // Common alternatives
  { id: "zoology", name: "Zoology and Environmental Biology", faculty: "Biological Sciences", competition: "medium", campus: "Nsukka", transferDestinations: ["medicine", "dentistry", "vet_medicine"] },
  { id: "biochemistry", name: "Biochemistry", faculty: "Biological Sciences", competition: "medium", campus: "Nsukka" },
  { id: "animal_science", name: "Animal Science", faculty: "Agriculture", competition: "low", campus: "Nsukka", transferDestinations: ["vet_medicine"] },
  { id: "crop_science", name: "Crop Science", faculty: "Agriculture", competition: "low", campus: "Nsukka" },
  { id: "agricultural_extension", name: "Agricultural Extension", faculty: "Agriculture", competition: "low", campus: "Nsukka" },
  { id: "science_education", name: "Science Education", faculty: "Education", competition: "low", campus: "Nsukka" },
  { id: "english", name: "English and Literary Studies", faculty: "Arts", competition: "medium", campus: "Nsukka", transferDestinations: ["law"] },
  { id: "history", name: "History and International Studies", faculty: "Arts", competition: "medium", campus: "Nsukka", transferDestinations: ["law"] },
  { id: "philosophy", name: "Philosophy", faculty: "Social Sciences", competition: "medium", campus: "Nsukka", transferDestinations: ["law"] },
  { id: "political_science", name: "Political Science", faculty: "Social Sciences", competition: "medium", campus: "Nsukka", transferDestinations: ["law"] },
  { id: "physics", name: "Physics and Astronomy", faculty: "Physical Sciences", competition: "medium", campus: "Nsukka", transferDestinations: ["mechanical_eng", "civil_eng", "electrical_eng"] },
  { id: "mathematics", name: "Mathematics", faculty: "Physical Sciences", competition: "medium", campus: "Nsukka", transferDestinations: ["mechanical_eng", "civil_eng"] },
  { id: "computer_science", name: "Computer Science", faculty: "Physical Sciences", competition: "high", campus: "Nsukka", transferDestinations: ["electrical_eng"] },

  // Others
  { id: "pharmacy", name: "Pharmacy", faculty: "Pharmaceutical Sciences", competition: "very_high", campus: "Nsukka", isProfessional: true },
  { id: "nursing", name: "Nursing Science", faculty: "Health Sciences", competition: "high", campus: "Nsukka" },
  { id: "economics", name: "Economics", faculty: "Social Sciences", competition: "medium", campus: "Nsukka" },
  { id: "accounting", name: "Accountancy", faculty: "Business Administration", competition: "medium", campus: "Enugu" },
  { id: "mass_comm", name: "Mass Communication", faculty: "Arts", competition: "medium", campus: "Nsukka" },
];

export const getDepartmentById = (id: string) => departments.find(d => d.id === id);

export const getAlternativesFor = (preferredId: string): Department[] => {
  const preferred = getDepartmentById(preferredId);
  if (!preferred?.alternativeOffers) return [];
  return preferred.alternativeOffers
    .map(id => getDepartmentById(id))
    .filter((d): d is Department => !!d);
};
