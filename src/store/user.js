import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserStore = create(
  persist(
    (set) => ({
      token: "",
      setToken: (token) => set({ token }),
      username: "",
      setUsername: (username) => set({ username }),
    }),
    {
      name: "user",
    }
  )
);