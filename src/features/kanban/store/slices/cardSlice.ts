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
  updateCard: (boardId, listId, cardId, updatedData) =>
    set((state) => {
      const board = state.boards.find((b) => b.id === boardId);
      if (!board) return;

      const list = board.lists.find((l) => l.id === listId);
      if (!list) return;

      const card = list.cards.find((c) => c.id === cardId);
      if (!card) return;

      Object.assign(card, updatedData);
    }),
  moveCard: (boardId, fromListId, toListId, activeCardId, overIndex) =>
    set((state) => {
      const board = state.boards.find((b) => b.id === boardId);
      if (!board) return;

      const fromList = board.lists.find((l) => l.id === fromListId);
      const toList = board.lists.find((l) => l.id === toListId);
      if (!fromList || !toList) return;

      const fromIndex = fromList.cards.findIndex((c) => c.id === activeCardId);
      if (fromIndex < 0) return;

      const [moving] = fromList.cards.splice(fromIndex, 1);

      const targetIndexRaw =
        typeof overIndex === "number" && Number.isFinite(overIndex) ? overIndex : toList.cards.length;
      const targetIndex = Math.max(0, Math.min(toList.cards.length, targetIndexRaw));

      toList.cards.splice(targetIndex, 0, moving);
    }),
});
