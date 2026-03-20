import type { StateCreator } from "zustand";
import type { StoreState, ListSlice } from "../types";
import type { IList } from "../../types";

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
  updateList: (boardId, listId, title) =>
    set((state) => {
      const board = state.boards.find((b) => b.id === boardId);
      if (!board) return;
      const list = board.lists.find((l) => l.id === listId);
      if (list) list.title = title.trim() || list.title;
    }),
  deleteList: (boardId, listId) =>
    set((state) => {
      const board = state.boards.find((b) => b.id === boardId);
      if (board) {
        board.lists = board.lists.filter((l) => l.id !== listId);
      }
    }),
});
