import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthState, User } from "./types";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      // Fake Authentication for Demo Purposes
      login: (email: string) => {
        // Here you would normally make an API call
        // For the sake of the project, we mock a successful login
        const mockUser: User = {
          id: email,
          email,
          name: email.split("@")[0] || "User",
          avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${email}`,
        };

        set({
          user: mockUser,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    { name: "trello-auth-storage" }
  )
);
