// store/establishmentsStore.js
import { create } from 'zustand';
import $api from '../utils/api';

const useEstablishmentsStore = create((set) => ({
  regions: [],
  cities: [],
  categories: [],
  loading: false,
  setLoading: (status) => set({ loading: status }),

  fetchRegions: async () => {
    try {
      const response = await $api.get("/regions/get");
      set({ regions: response.data });
    } catch (error) {
      console.error("Error fetching regions:", error);
    }
  },

  fetchCategories: async () => {
    try {
      const response = await $api.get("/categories/all");
      set({ categories: response.data });
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  },

  fetchCities: async (regionId) => {
    try {
      const response = await $api.get(`/cities/region/${regionId}`);
      set({ cities: response.data });
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  },

  clearCities: () => set({ cities: [] }), // Reset cities if region is cleared
}));

export default useEstablishmentsStore;
