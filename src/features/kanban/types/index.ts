export type Id = string | number;

export interface ICard {
  id: Id;
  title: string;
  description?: string;
  createdAt: string; // ISO date string
  dueDate?: string; // ISO date string for modal detail
  labels?: string[]; // Array of label names/colors for modal detail
}

export interface IList {
  id: Id;
  title: string;
  cards: ICard[];
}

export interface IBoard {
  id: Id;
  title: string;
  ownerId: string;
  memberIds: string[];
  lists: IList[]; // Lưu ý: List chứa mảng Card bên trong
}
