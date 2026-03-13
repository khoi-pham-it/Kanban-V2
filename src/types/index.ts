export type Id = string | number;

export interface ICard {
  id: Id;
  title: string;
  description?: string;
  createdAt: string; // ISO date string
}

export interface IList {
  id: Id;
  title: string;
  cards: ICard[];
}

export interface IBoard {
  id: Id;
  title: string;
  lists: IList[]; // Lưu ý: List chứa mảng Card bên trong
}
