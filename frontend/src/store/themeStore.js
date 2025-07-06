import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'coffee',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'theme-storage', // key in localStorage
    }
  )
);
