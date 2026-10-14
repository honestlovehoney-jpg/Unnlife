import { create } from "zustand";
import { persist } from "zustand/middleware";
import { departments } from "./departments";
import { Roommate, hostels } from "./hostels";

export interface Needs {
  hunger: number;
  energy: number;
  fun: number;
  social: number;
}

export type NeedKey = keyof Needs;

export interface Effect {
  cost?: number;
  earn?: number;
  minutes?: number;
  needs?: Partial<Needs>;
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

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
  gameMinutes: number; // minutes since Day 1, 00:00
  gender: "boys" | "girls" | null;

  // Hostel / Accommodation
  preferredHostel: string | null;
  allocatedHostel: string | null;
  hostelStatus: "none" | "applied" | "allocated" | "missed" | "off_campus";
  roomNumber: string | null;
  roommates: Roommate[];
  accommodationType: "hostel" | "off_campus" | null;
  offCampusId: string | null;

  setPosition: (lng: number, lat: number) => void;
  setGender: (g: "boys" | "girls") => void;
  applyEffect: (e: Effect) => boolean;
  tick: () => void;
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
      position: { lng: 7.408339, lat: 6.864178 }, // starts at the Nnamdi Azikiwe Library
      preferredDepartment: null,
      offeredDepartment: null,
      enrolledDepartment: null,
      admissionStatus: "none",
      declinedAt: null,
      nextApplicationAt: null,
      year: 1,
      gameMinutes: 8 * 60,
      gender: null,

      preferredHostel: null,
      allocatedHostel: null,
      hostelStatus: "none",
      roomNumber: null,
      roommates: [],
      accommodationType: null,
      offCampusId: null,

      setPosition: (lng, lat) => set({ position: { lng, lat } }),
      setGender: (g) => set({ gender: g }),
      applyEffect: (e) => {
        const s = get();
        const cost = e.cost ?? 0;
        if (cost > s.money) return false;
        const needs = { ...s.needs };
        (Object.keys(e.needs ?? {}) as NeedKey[]).forEach((k) => {
          needs[k] = clamp(needs[k] + (e.needs?.[k] ?? 0));
        });
        set({
          money: s.money - cost + (e.earn ?? 0),
          needs,
          gameMinutes: s.gameMinutes + (e.minutes ?? 0),
        });
        return true;
      },
      tick: () =>
        set((s) => ({
          needs: {
            hunger: clamp(s.needs.hunger - 1),
            energy: clamp(s.needs.energy - 1),
            fun: clamp(s.needs.fun - 1),
            social: clamp(s.needs.social - 1),
          },
          gameMinutes: s.gameMinutes + 10,
        })),
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
      version: 3,
      // v2: gender added, courses limited to Nsukka, roommates gender-matched, real campus coordinates
      // v3: the real 15 hostels; an allocation to a hostel that no longer exists or is not on the map is cleared
      migrate: (persisted: unknown, version: number) => {
        const st = (persisted ?? {}) as Record<string, unknown>;
        const next: Record<string, unknown> = { ...st };
        if (version < 2) {
          const valid = new Set(departments.map((d) => d.id));
          const ids = [st.enrolledDepartment, st.preferredDepartment, st.offeredDepartment].filter(
            (x): x is string => typeof x === "string"
          );
          const badCourse = ids.some((id) => !valid.has(id));
          Object.assign(next, { gender: null, roommates: [], position: { lng: 7.408339, lat: 6.864178 } });
          if (badCourse) {
            Object.assign(next, {
              admissionStatus: "none", enrolledDepartment: null, preferredDepartment: null,
              offeredDepartment: null, declinedAt: null, nextApplicationAt: null,
            });
          }
          if (badCourse || st.hostelStatus !== "off_campus") {
            Object.assign(next, {
              allocatedHostel: null, roomNumber: null, hostelStatus: "none", accommodationType: null,
              preferredHostel: null,
            });
          }
        }
        // any version: drop an allocation that points at a hostel that is missing or has no map position
        const hid = next.allocatedHostel;
        const ok = typeof hid === "string" && hostels.some((h) => h.id === hid && h.located);
        if (typeof hid === "string" && !ok) {
          Object.assign(next, {
            allocatedHostel: null, roomNumber: null, roommates: [], hostelStatus: "none",
            accommodationType: null, preferredHostel: null,
          });
        }
        // courses that no longer exist (engineering ids were extended, others unchanged)
        const valid2 = new Set(departments.map((d) => d.id));
        const dep = next.enrolledDepartment;
        if (typeof dep === "string" && !valid2.has(dep)) {
          Object.assign(next, {
            admissionStatus: "none", enrolledDepartment: null, preferredDepartment: null,
            offeredDepartment: null, declinedAt: null, nextApplicationAt: null,
          });
        }
        return next as never;
      },
    }
  )
);
