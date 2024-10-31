// src/stores/profileStore.js
import { create } from 'zustand';

const useProfileStore = create((set) => ({
  profile: null,
  setProfile: (profileData) => set({ profile: profileData }),
  clearProfile: () => set({ profile: null })
}));

export default useProfileStore;
