import type { NeedKey } from "./playerStore";

export interface RoomAction {
  id: string;
  emoji: string;
  label: string;
  minutes: number;
  needs: Partial<Record<NeedKey, number>>;
  msg: string;
  cost?: number;
  /** needs at least one roommate in the room */
  needsPeople?: boolean;
}

export interface RoomObject {
  title: string;
  emoji: string;
  actions: RoomAction[];
}

export const ROOM_OBJECTS: Record<string, RoomObject> = {
  bed: {
    title: "Your bed", emoji: "🛏️",
    actions: [
      { id: "sleep", emoji: "😴", label: "Sleep", minutes: 480, needs: { energy: 55, hunger: -15 }, msg: "You slept like someone with no 8am class." },
      { id: "nap", emoji: "💤", label: "Take a nap", minutes: 60, needs: { energy: 12 }, msg: "A short nap. Back to life." },
    ],
  },
  desk: {
    title: "Your desk", emoji: "📚",
    actions: [
      { id: "study", emoji: "📖", label: "Study", minutes: 120, needs: { energy: -10, fun: -8 }, msg: "Two chapters done. Brain loading." },
      { id: "notes", emoji: "✍️", label: "Rewrite your notes", minutes: 60, needs: { energy: -5, fun: -3 }, msg: "Neat notes. Future you says thanks." },
    ],
  },
  bucket: {
    title: "Water buckets", emoji: "🪣",
    actions: [
      { id: "fetch", emoji: "🚰", label: "Fetch water", minutes: 30, needs: { energy: -4 }, msg: "Two buckets from the tank. Never waste water." },
      { id: "bath", emoji: "🧼", label: "Bucket bath", minutes: 20, needs: { energy: 4, fun: 2 }, msg: "Cold water, fresh mind." },
    ],
  },
  stove: {
    title: "Cooking corner", emoji: "🍳",
    actions: [
      { id: "indomie", emoji: "🍜", label: "Cook indomie and egg", minutes: 25, needs: { hunger: 28 }, cost: 400, msg: "The student classic." },
      { id: "rice", emoji: "🍚", label: "Cook rice and stew", minutes: 60, needs: { hunger: 45, fun: 2 }, cost: 900, msg: "A proper pot. You will have leftovers." },
    ],
  },
  locker: {
    title: "Your locker", emoji: "🗄️",
    actions: [
      { id: "clothes", emoji: "👕", label: "Change clothes", minutes: 10, needs: { fun: 2, social: 1 }, msg: "Fresh outfit, fresh confidence." },
    ],
  },
  roommates: {
    title: "Roommates", emoji: "👥",
    actions: [
      { id: "gist", emoji: "💬", label: "Gist with your roommates", minutes: 60, needs: { social: 15, fun: 5 }, needsPeople: true, msg: "The gist went on longer than planned." },
    ],
  },
  shower: {
    title: "Shower", emoji: "🚿",
    actions: [{ id: "shower", emoji: "🚿", label: "Take a shower", minutes: 20, needs: { energy: 6, fun: 3 }, msg: "Hot water. Luxury." }],
  },
  sofa: {
    title: "Sofa", emoji: "🛋️",
    actions: [{ id: "relax", emoji: "📺", label: "Relax on the sofa", minutes: 45, needs: { energy: 6, fun: 6 }, msg: "A little rest and a lot of scrolling." }],
  },
  window: {
    title: "Window", emoji: "🪟",
    actions: [{ id: "look", emoji: "👀", label: "Look outside", minutes: 5, needs: { fun: 1 }, msg: "Campus looks calm from here." }],
  },
  door: {
    title: "Door", emoji: "🚪",
    actions: [],
  },
};
