import type { StateCreator } from "zustand";
import type { StoreState, BoardSlice } from "../types";
import type { IBoard } from "../../types";
import { useAuthStore } from "../../../auth/store/useAuthStore";

const initialBoards: IBoard[] = [
  {
    id: "board-1",
    title: "Web Project",
    ownerId: "user-1",
    memberIds: ["user-1"],
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
> = (set, get) => ({
  boards: initialBoards,
  addBoard: (title) =>
    set((state) => {
      const user = useAuthStore.getState().user;
      if (!user) return;

    state.boards.push({
      id: `board-${Date.now()}`,
      title,
      ownerId: user.id,
      memberIds: [user.id], // ban đầu chưa có ai
      lists: [],
    });
  }),
  updateBoard: (boardId, title) =>
    set((state) => {
      const board = state.boards.find((b) => b.id === boardId);
      if (!board) return;
      const next = title.trim();
      if (!next) return;
      board.title = next;
    }),
  deleteBoard: (boardId) =>
    set((state) => {
      state.boards = state.boards.filter((b) => b.id !== boardId);
    }),
  addMemberToBoard: (boardId: string, userId: string) =>
    set((state) => {
      const board = state.boards.find((b) => b.id === boardId);
      const user = useAuthStore.getState().user;

      if (!board || !user) return;
      if (board.ownerId !== user.id) {
        alert("Chỉ chủ sở hữu mới có thể thêm thành viên");
        return;
      }

      if (!board) return;

      // tránh add trùng
      if (!board.memberIds.includes(userId)) {
        board.memberIds.push(userId);
      }
    }),
  removeMemberFromBoard: (boardId: string, userId: string) =>
      set((state) => {
        const board = state.boards.find((b) => b.id === boardId);
        if (!board) return;

        board.memberIds = board.memberIds.filter((id) => id !== userId);
      }),
  isBoardMember: (board: IBoard, userId: string) => {
        return (
          board.ownerId === userId ||
          board.memberIds.includes(userId)
        );
      },
  findBoardsByOwnerOrMember: (userId: string) => {
          return get().boards.filter(
            (b) =>
              b.ownerId === userId ||
              b.memberIds.includes(userId)
          );
        }
});

