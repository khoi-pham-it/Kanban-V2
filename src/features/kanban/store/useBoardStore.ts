import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { StoreState } from "./types";
import { createBoardSlice, createListSlice, createCardSlice } from "./slices/";

export const useBoardStore = create<StoreState>()(
  persist(
    immer((...a) => ({
      ...createBoardSlice(...a),
      ...createListSlice(...a),
      ...createCardSlice(...a),
    })),
    { name: "trello-storage" },
  ),
);
