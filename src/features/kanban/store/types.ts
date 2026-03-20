import type { IBoard, Id } from "../types";

export interface BoardSlice {
  boards: IBoard[];
  addBoard: (title: string) => void;
  updateBoard: (boardId: Id, title: string) => void;
  deleteBoard: (boardId: Id) => void;
}

export interface ListSlice {
  addList: (boardId: Id, title: string) => void;
  updateList: (boardId: Id, listId: Id, title: string) => void;
  deleteList: (boardId: Id, listId: Id) => void;
}

export interface CardSlice {
  addCard: (boardId: Id, listId: Id, title: string) => void;
  deleteCard: (boardId: Id, listId: Id, cardId: Id) => void;
  updateCard: (
    boardId: Id,
    listId: Id,
    cardId: Id,
    updatedData: Partial<import("../types").ICard>,
  ) => void;
  moveCard: (
    boardId: Id,
    fromListId: Id,
    toListId: Id,
    activeCardId: Id,
    overIndex?: number,
  ) => void;
}

export type StoreState = BoardSlice & ListSlice & CardSlice;
