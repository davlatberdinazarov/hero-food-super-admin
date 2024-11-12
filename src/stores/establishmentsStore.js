import { create } from 'zustand';
import $api from '../utils/api';

const useEstablishmentsStore = create((set) => ({
  regions: [],
  cities: [],
  categories: [],
  loading: false,
  
  setLoading: (status) => set({ loading: status }),

  // Existing fetch functions for regions, categories, and cities
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
      console.log("Fetched cities:", response.data); // Debugging line
      set({ cities: response.data });
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  },
  

  clearCities: () => set({ cities: [] }),

  // Add new establishment and refresh regions and cities
  addFoodEstablishment: async (data) => {
    set({ loading: true });
    try {
      await $api.post('/establishments/add', data);
      console.log("Food establishment added successfully");

      // Re-fetch regions, cities, and categories to update the store with the latest data
      await Promise.all([
        useEstablishmentsStore.getState().fetchRegions(),
        useEstablishmentsStore.getState().fetchCategories(),
        useEstablishmentsStore.getState().fetchCities(data.regionId),
      ]);
      
    } catch (error) {
      console.error("Error adding food establishment:", error);
    } finally {
      set({ loading: false });
    }
  },
}));

export default useEstablishmentsStore;
