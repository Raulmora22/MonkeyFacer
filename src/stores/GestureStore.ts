import { create } from "zustand";

type GestureType = "smile" | "serious" | "eureca";

type GestureStore = {
  currentGesture: GestureType | null;
  setGesture: (gesture: GestureType | null) => void;
};

export const useGestureStore = create<GestureStore>((set) => ({
  currentGesture: null,
  setGesture: (gesture) => set({ currentGesture: gesture }),
}));
