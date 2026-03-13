import type { IBoard } from '../types';

export const boardsLoader = async () => {
  const boardsStr = localStorage.getItem('boards');
  if (boardsStr) {
    try {
      return JSON.parse(boardsStr) as IBoard[];
    } catch (e) {
      console.error('Failed to parse boards from localStorage', e);
    }
  }

  // Return some initial mocked boards if nothing in localStorage
  const initialBoards: IBoard[] = [
    {
      id: 'board-1',
      title: 'Web Project',
      lists: [
        {
          id: 'list-1',
          title: 'Cần làm',
          cards: [
            {
              id: 'card-1',
              title: 'Thiết kế giao diện Đăng nhập',
              createdAt: new Date().toISOString()
            }
          ]
        },
        {
          id: 'list-2',
          title: 'Đang làm',
          cards: [
            {
              id: 'card-2',
              title: 'Sửa lỗi Menu trên Mobile',
              createdAt: new Date().toISOString()
            }
          ]
        },
        {
          id: 'list-3',
          title: 'Hoàn thành',
          cards: [
            {
              id: 'card-3',
              title: 'Khởi tạo Repository',
              createdAt: new Date().toISOString()
            }
          ]
        }
      ]
    },
    {
      id: 'board-2',
      title: 'Mobile App',
      lists: []
    },
    {
      id: 'board-3',
      title: 'Study Plan',
      lists: []
    }
  ];

  localStorage.setItem('boards', JSON.stringify(initialBoards));
  return initialBoards;
};

import type { LoaderFunctionArgs } from 'react-router-dom';

export const boardDetailLoader = async ({ params }: LoaderFunctionArgs) => {
  const { boardId } = params;
  const boardsStr = localStorage.getItem('boards');
  if (boardsStr) {
    try {
      const boards = JSON.parse(boardsStr) as IBoard[];
      const board = boards.find(b => b.id === boardId);
      if (board) {
        return board;
      }
    } catch (e) {
      console.error('Failed to parse boards from localStorage', e);
    }
  }

  // If not found, we could throw a 404 or redirect, but for simplicity we just return null
  return null;
};
