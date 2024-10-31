import { create } from "zustand";

export const useRenderStore = create((set) => ({
  cityRender: 0,
  cityRenderStore: () => set((state) => ({ cityRender: state.cityRender + 1 })),

  // Add a new state variable for category render
  categoryRender: 0,
  categoryRenderStore: () => set((state) => ({ categoryRender: state.categoryRender + 1 })),
}));
