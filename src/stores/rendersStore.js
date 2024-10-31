import { create } from "zustand";

export const useRenderStore = create((set) => ({
  cityRender: 0,
  cityRenderStore: () => set((state) => ({ cityRender: state.cityRender + 1 })),
}));
