import { create } from "zustand";

export const useRenderStore = create((set) => ({
  cityRender: 0,
  cityRenderStore: () => set((state) => ({ cityRender: state.cityRender + 1 })),

  // Add a new state variable for category render
  categoryRender: 0,
  categoryRenderStore: () => set((state) => ({ categoryRender: state.categoryRender + 1 })),

  // add a new state variable for food_establishment 
  foodEstablishmentRender: 0,
  foodEstablishmentRenderStore: () => set((state) => ({ foodEstablishmentRender: state.foodEstablishmentRender + 1 })),

  // Add a new state variable for menuCategory render
  menuCategoryRender: 0,
  menuCategoryRenderStore: () => set((state) => ({ menuCategoryRender: state.menuCategoryRender + 1 })),

  // Add a new state variable for promotion render
  promotionRender: 0,
  promotionRenderStore: () => set((state) => ({ promotionRender: state.promotionRender + 1 })),

  // Add a new state variable for foods render
  foodsRender: 0,
  foodsRenderStore: () => set((state) => ({ foodsRender: state.foodsRender + 1 })),

  // Add a new state variable for users render
  usersRender: 0,
  usersRenderStore: () => set((state) => ({ usersRender: state.usersRender + 1 })),
}));
