import type { StateCreator } from "zustand";
import type { StoreState, CardSlice } from "../types";
import type { ICard } from "../../types";

export const createCardSlice: StateCreator<
  StoreState,
  [["zustand/immer", never]],
  [],
  CardSlice
> = (set) => ({
  addCard: (boardId, listId, title) =>
    set((state) => {
      const board = state.boards.find((b) => b.id === boardId);
      if (board) {
        const list = board.lists.find((l) => l.id === listId);
        if (list) {
          const newCard: ICard = {
            id: `card-${Date.now()}`,
            title,
            createdAt: new Date().toISOString(),
          };
          list.cards.push(newCard);
        }
      }
    }),
  deleteCard: (boardId, listId, cardId) =>
    set((state) => {
      const board = state.boards.find((b) => b.id === boardId);
      if (board) {
        const list = board.lists.find((l) => l.id === listId);
        if (list) {
          list.cards = list.cards.filter((c) => c.id !== cardId);
        }
      }
    }),
});
