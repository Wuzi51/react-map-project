import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUseStore = create(
  persist(
    (set) => ({
      token: "",
      setToken: (token) => set({ token }),
    }),
    {
      name: "user",
    }
  )
);