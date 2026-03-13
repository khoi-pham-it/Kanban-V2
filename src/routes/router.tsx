import { createBrowserRouter, redirect } from 'react-router-dom';
import Login from '../features/auth/Login';
import Dashboard from '../features/boards/Dashboard';
import BoardDetail from '../features/boards/BoardDetail';
import MainLayout from '../layouts/MainLayout';
import { boardsLoader, boardDetailLoader } from './loaders';

export const router = createBrowserRouter([
  {
    path: '/',
    loader: () => redirect('/boards')
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/boards',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
        loader: boardsLoader
      },
      {
        path: ':boardId',
        element: <BoardDetail />,
        loader: boardDetailLoader
      }
    ]
  }
]);
