import { IBoard, Id } from "../types";

export interface BoardSlice {
  boards: IBoard[];
  addBoard: (title: string) => void;
  deleteBoard: (boardId: Id) => void;
}

export interface ListSlice {
  addList: (boardId: Id, title: string) => void;
  deleteList: (boardId: Id, listId: Id) => void;
}

export interface CardSlice {
  addCard: (boardId: Id, listId: Id, title: string) => void;
  deleteCard: (boardId: Id, listId: Id, cardId: Id) => void;
}

export type StoreState = BoardSlice & ListSlice & CardSlice;
