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
  /** true when the department building shows up in OpenStreetMap data for the Nsukka campus */
  verified?: boolean;
}

/**
 * Only departments taught on the Nsukka campus are playable.
 * Law, Medicine and Surgery, Dentistry, Accountancy and Nursing are not
 * offered here (Enugu campus / Ituku-Ozalla teaching hospital), so they are removed.
 */
export const departments: Department[] = [
  // Professional / highly competitive (Nsukka)
  {
    id: "vet_medicine", name: "Veterinary Medicine", faculty: "Veterinary Medicine",
    competition: "very_high", campus: "Nsukka", isProfessional: true, verified: true,
    alternativeOffers: ["animal_science", "zoology", "microbiology", "botany"],
    transferDestinations: ["vet_medicine"],
  },
  {
    id: "pharmacy", name: "Pharmacy", faculty: "Pharmaceutical Sciences",
    competition: "very_high", campus: "Nsukka", isProfessional: true, verified: true,
    alternativeOffers: ["biochemistry", "microbiology", "botany"],
  },
  // Engineering: the 11 departments on the Faculty of Engineering signboard
  {
    id: "chemical_eng", name: "Chemical Engineering", faculty: "Engineering",
    competition: "high", campus: "Nsukka", isProfessional: true, verified: true,
    alternativeOffers: ["physics", "mathematics", "computer_science"],
    transferDestinations: ["chemical_eng"],
  },
  {
    id: "mechanical_eng", name: "Mechanical Engineering", faculty: "Engineering",
    competition: "high", campus: "Nsukka", isProfessional: true, verified: true,
    alternativeOffers: ["physics", "mathematics", "computer_science"],
    transferDestinations: ["mechanical_eng"],
  },
  {
    id: "materials_eng", name: "Materials and Metallurgical Engineering", faculty: "Engineering",
    competition: "high", campus: "Nsukka", isProfessional: true, verified: true,
    alternativeOffers: ["physics", "mathematics", "computer_science"],
    transferDestinations: ["materials_eng"],
  },
  {
    id: "electrical_eng", name: "Electrical Engineering", faculty: "Engineering",
    competition: "high", campus: "Nsukka", isProfessional: true, verified: true,
    alternativeOffers: ["physics", "mathematics", "computer_science"],
    transferDestinations: ["electrical_eng"],
  },
  {
    id: "electronic_eng", name: "Electronic and Computer Engineering", faculty: "Engineering",
    competition: "high", campus: "Nsukka", isProfessional: true, verified: true,
    alternativeOffers: ["physics", "mathematics", "computer_science"],
    transferDestinations: ["electronic_eng"],
  },
  {
    id: "biomedical_eng", name: "Biomedical Engineering", faculty: "Engineering",
    competition: "high", campus: "Nsukka", isProfessional: true, verified: true,
    alternativeOffers: ["physics", "mathematics", "computer_science"],
    transferDestinations: ["biomedical_eng"],
  },
  {
    id: "agric_eng", name: "Agricultural and Bioresources Engineering", faculty: "Engineering",
    competition: "high", campus: "Nsukka", isProfessional: true, verified: true,
    alternativeOffers: ["physics", "mathematics", "computer_science"],
    transferDestinations: ["agric_eng"],
  },
  {
    id: "nuclear_eng", name: "Nuclear Engineering", faculty: "Engineering",
    competition: "high", campus: "Nsukka", isProfessional: true, verified: true,
    alternativeOffers: ["physics", "mathematics", "computer_science"],
    transferDestinations: ["nuclear_eng"],
  },
  {
    id: "automotive_eng", name: "Automotive Engineering", faculty: "Engineering",
    competition: "high", campus: "Nsukka", isProfessional: true, verified: true,
    alternativeOffers: ["physics", "mathematics", "computer_science"],
    transferDestinations: ["automotive_eng"],
  },
  {
    id: "mechatronic_eng", name: "Mechatronic Engineering", faculty: "Engineering",
    competition: "high", campus: "Nsukka", isProfessional: true, verified: true,
    alternativeOffers: ["physics", "mathematics", "computer_science"],
    transferDestinations: ["mechatronic_eng"],
  },
  {
    id: "civil_eng", name: "Civil Engineering", faculty: "Engineering",
    competition: "high", campus: "Nsukka", isProfessional: true, verified: true,
    alternativeOffers: ["physics", "mathematics"],
    transferDestinations: ["civil_eng"],
  },

  // Biological Sciences (the "medical-side" route: nobody gets Medicine at Nsukka)
  { id: "zoology", name: "Zoology and Environmental Biology", faculty: "Biological Sciences", competition: "medium", campus: "Nsukka", verified: true, transferDestinations: ["vet_medicine"] },
  { id: "botany", name: "Plant Science and Biotechnology", faculty: "Biological Sciences", competition: "medium", campus: "Nsukka" },
  { id: "microbiology", name: "Microbiology (MCB)", faculty: "Biological Sciences", competition: "medium", campus: "Nsukka" },
  { id: "biochemistry", name: "Biochemistry (BCH)", faculty: "Biological Sciences", competition: "medium", campus: "Nsukka" },

  // Agriculture
  { id: "animal_science", name: "Animal Science", faculty: "Agriculture", competition: "low", campus: "Nsukka", transferDestinations: ["vet_medicine"] },
  { id: "crop_science", name: "Crop Science", faculty: "Agriculture", competition: "low", campus: "Nsukka" },
  { id: "agricultural_extension", name: "Agricultural Extension", faculty: "Agriculture", competition: "low", campus: "Nsukka" },

  // Education
  { id: "science_education", name: "Science Education", faculty: "Education", competition: "low", campus: "Nsukka" },
  { id: "library_science", name: "Library and Information Science", faculty: "Education", competition: "low", campus: "Nsukka", verified: true },

  // Arts
  { id: "english", name: "English and Literary Studies", faculty: "Arts", competition: "medium", campus: "Nsukka" },
  { id: "history", name: "History and International Studies", faculty: "Arts", competition: "medium", campus: "Nsukka" },
  { id: "mass_comm", name: "Mass Communication", faculty: "Arts", competition: "medium", campus: "Nsukka" },
  { id: "religion_cultural", name: "Religion and Cultural Studies", faculty: "Arts", competition: "low", campus: "Nsukka" },
  { id: "linguistics", name: "Linguistics, Igbo and Other Nigerian Languages", faculty: "Arts", competition: "low", campus: "Nsukka" },
  { id: "theatre_film", name: "Theatre and Film Studies", faculty: "Arts", competition: "medium", campus: "Nsukka" },
  { id: "fine_arts", name: "Fine and Applied Arts", faculty: "Arts", competition: "medium", campus: "Nsukka" },
  { id: "music", name: "Music", faculty: "Arts", competition: "low", campus: "Nsukka" },

  // Social Sciences
  { id: "political_science", name: "Political Science", faculty: "Social Sciences", competition: "medium", campus: "Nsukka", verified: true },
  { id: "economics", name: "Economics", faculty: "Social Sciences", competition: "medium", campus: "Nsukka", verified: true },
  { id: "philosophy", name: "Philosophy", faculty: "Social Sciences", competition: "medium", campus: "Nsukka" },
  { id: "sociology", name: "Sociology and Anthropology", faculty: "Social Sciences", competition: "medium", campus: "Nsukka" },
  { id: "psychology", name: "Psychology", faculty: "Social Sciences", competition: "high", campus: "Nsukka" },
  { id: "public_admin", name: "Public Administration and Local Government", faculty: "Social Sciences", competition: "medium", campus: "Nsukka", verified: true },
  { id: "social_work", name: "Social Work", faculty: "Social Sciences", competition: "low", campus: "Nsukka" },
  { id: "geography", name: "Geography", faculty: "Social Sciences", competition: "low", campus: "Nsukka" },

  // Physical Sciences
  { id: "physics", name: "Physics and Astronomy", faculty: "Physical Sciences", competition: "medium", campus: "Nsukka", transferDestinations: ["mechanical_eng", "civil_eng", "electrical_eng"] },
  { id: "mathematics", name: "Mathematics", faculty: "Physical Sciences", competition: "medium", campus: "Nsukka", transferDestinations: ["mechanical_eng", "civil_eng"] },
  { id: "computer_science", name: "Computer Science", faculty: "Physical Sciences", competition: "high", campus: "Nsukka", transferDestinations: ["electrical_eng"] },
];

export const FACULTY_ORDER = [
  "Arts", "Social Sciences", "Biological Sciences", "Physical Sciences", "Engineering",
  "Agriculture", "Education", "Pharmaceutical Sciences", "Veterinary Medicine",
];

export const getDepartmentById = (id: string) => departments.find((d) => d.id === id);

export const getAlternativesFor = (preferredId: string): Department[] => {
  const preferred = getDepartmentById(preferredId);
  if (!preferred?.alternativeOffers) return [];
  return preferred.alternativeOffers
    .map((id) => getDepartmentById(id))
    .filter((d): d is Department => !!d);
};
