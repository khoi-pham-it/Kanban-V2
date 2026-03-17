import { useBoardStore } from '../features/kanban/store/useBoardStore';
import type { LoaderFunctionArgs } from 'react-router-dom';

export const boardsLoader = async () => {
  // Trích xuất dữ liệu trực tiếp từ store của Zustand
  const { boards } = useBoardStore.getState();
  return boards;
};

export const boardDetailLoader = async ({ params }: LoaderFunctionArgs) => {
  const { boardId } = params;
  const { boards } = useBoardStore.getState();
  const board = boards.find(b => b.id === boardId);

  // Trả về board nếu có, ngược lại trả về null
  return board || null;
};
