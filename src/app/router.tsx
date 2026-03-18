import { createBrowserRouter, redirect } from 'react-router-dom';
import Login from '../pages/auth/LoginPage';
import Dashboard from '../pages/boards/DashboardPage';
import BoardDetail from '../pages/boards/BoardPage';
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from '../components/guard/ProtectedRoute';
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
    element: <ProtectedRoute />, // Bảo vệ toàn bộ route /boards
    children: [
      {
        path: '',
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
    ]
  }
]);
