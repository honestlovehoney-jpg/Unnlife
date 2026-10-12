import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Roommate } from "./hostels";

interface Needs {
  hunger: number;
  energy: number;
  fun: number;
  social: number;
}

interface PlayerState {
  money: number;
  needs: Needs;
  position: { lng: number; lat: number };
  preferredDepartment: string | null;
  offeredDepartment: string | null;
  enrolledDepartment: string | null;
  admissionStatus: "none" | "applied" | "offered" | "accepted" | "declined" | "no_offer";
  declinedAt: number | null;
  nextApplicationAt: number | null;
  year: number;

  // Hostel / Accommodation
  preferredHostel: string | null;
  allocatedHostel: string | null;
  hostelStatus: "none" | "applied" | "allocated" | "missed" | "off_campus";
  roomNumber: string | null;
  roommates: Roommate[];
  accommodationType: "hostel" | "off_campus" | null;
  offCampusId: string | null;

  setPosition: (lng: number, lat: number) => void;
  spend: (amount: number) => void;
  updateNeed: (key: keyof Needs, delta: number) => void;
  setPreferredDepartment: (id: string) => void;
  receiveOffer: (id: string | null) => void;
  setNoOffer: () => void;
  acceptOffer: () => void;
  declineOffer: () => void;
  canApply: () => boolean;
  getCooldownRemaining: () => number;

  applyForHostel: (hostelId: string) => void;
  allocateHostel: (hostelId: string | null, room: string | null, mates: Roommate[]) => void;
  chooseOffCampus: (optionId: string) => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      money: 25000,
      needs: { hunger: 80, energy: 70, fun: 60, social: 50 },
      position: { lng: 7.4085, lat: 6.8673 },
      preferredDepartment: null,
      offeredDepartment: null,
      enrolledDepartment: null,
      admissionStatus: "none",
      declinedAt: null,
      nextApplicationAt: null,
      year: 1,

      preferredHostel: null,
      allocatedHostel: null,
      hostelStatus: "none",
      roomNumber: null,
      roommates: [],
      accommodationType: null,
      offCampusId: null,

      setPosition: (lng, lat) => set({ position: { lng, lat } }),
      spend: (amount) => set((s) => ({ money: Math.max(0, s.money - amount) })),
      updateNeed: (key, delta) =>
        set((s) => ({
          needs: { ...s.needs, [key]: Math.max(0, Math.min(100, s.needs[key] + delta)) },
        })),
      setPreferredDepartment: (id) => set({ preferredDepartment: id, admissionStatus: "applied" }),
      receiveOffer: (id) => set({ offeredDepartment: id, admissionStatus: id ? "offered" : "none" }),
      setNoOffer: () => set({ admissionStatus: "no_offer", offeredDepartment: null }),
      acceptOffer: () => set((s) => ({ 
        enrolledDepartment: s.offeredDepartment, 
        admissionStatus: "accepted",
        declinedAt: null,
        nextApplicationAt: null,
      })),
      declineOffer: () => {
        const now = Date.now();
        const cooldownMs = 30 * 60 * 1000;
        set({ 
          offeredDepartment: null, 
          admissionStatus: "declined",
          declinedAt: now,
          nextApplicationAt: now + cooldownMs,
        });
      },
      canApply: () => {
        const { nextApplicationAt, admissionStatus } = get();
        if (admissionStatus === "accepted") return false;
        if (!nextApplicationAt) return true;
        return Date.now() >= nextApplicationAt;
      },
      getCooldownRemaining: () => {
        const { nextApplicationAt } = get();
        if (!nextApplicationAt) return 0;
        return Math.max(0, Math.ceil((nextApplicationAt - Date.now()) / 1000));
      },

      applyForHostel: (hostelId) => set({ preferredHostel: hostelId, hostelStatus: "applied" }),
      allocateHostel: (hostelId, room, mates) => set({ 
        allocatedHostel: hostelId, 
        roomNumber: room, 
        roommates: mates,
        hostelStatus: hostelId ? "allocated" : "missed",
        accommodationType: hostelId ? "hostel" : null,
      }),
      chooseOffCampus: (optionId) => set({
        offCampusId: optionId,
        hostelStatus: "off_campus",
        accommodationType: "off_campus",
        allocatedHostel: null,
        roomNumber: null,
        roommates: [],
      }),
    }),
    {
      name: "unn-life-player",
    }
  )
);
