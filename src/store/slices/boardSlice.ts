import type { StateCreator } from "zustand";
import type { StoreState, BoardSlice } from "../types";
import type { IBoard } from "../../types";

const initialBoards: IBoard[] = [
  {
    id: "board-1",
    title: "Web Project",
    lists: [
      {
        id: "list-1",
        title: "Cần làm",
        cards: [
          {
            id: "card-1",
            title: "Thiết kế UI",
            createdAt: new Date().toISOString(),
          },
        ],
      },
    ],
  },
];

export const createBoardSlice: StateCreator<
  StoreState,
  [["zustand/immer", never]],
  [],
  BoardSlice
> = (set) => ({
  boards: initialBoards,
  addBoard: (title) =>
    set((state) => {
      state.boards.push({
        id: `board-${Date.now()}`,
        title,
        lists: [],
      });
    }),
  deleteBoard: (boardId) =>
    set((state) => {
      state.boards = state.boards.filter((b) => b.id !== boardId);
    }),
});
