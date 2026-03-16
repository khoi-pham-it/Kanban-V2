import { StateCreator } from "zustand";
import { StoreState, ListSlice } from "../types";
import { IList } from "../../types";

export const createListSlice: StateCreator<
  StoreState,
  [["zustand/immer", never]],
  [],
  ListSlice
> = (set) => ({
  addList: (boardId, title) =>
    set((state) => {
      const board = state.boards.find((b) => b.id === boardId);
      if (board) {
        const newList: IList = {
          id: `list-${Date.now()}`,
          title,
          cards: [],
        };
        board.lists.push(newList);
      }
    }),
  deleteList: (boardId, listId) =>
    set((state) => {
      const board = state.boards.find((b) => b.id === boardId);
      if (board) {
        board.lists = board.lists.filter((l) => l.id !== listId);
      }
    }),
});
