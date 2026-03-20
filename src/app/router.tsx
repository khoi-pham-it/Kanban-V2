import { lazy, Suspense } from "react";
import { createBrowserRouter, redirect } from "react-router-dom";
import ProtectedRoute from "../components/guard/ProtectedRoute";
import { boardsLoader, boardDetailLoader } from "./loaders";

// Kỹ thuật Lazy Loading: Chỉ tải component khi route được truy cập
const Login = lazy(() => import("../pages/auth/LoginPage"));
const Dashboard = lazy(() => import("../pages/boards/DashboardPage"));
const BoardDetail = lazy(() => import("../pages/boards/BoardPage"));
const MainLayout = lazy(() => import("../components/layout/MainLayout"));

// Custom Wrapper để hiển thị Loading Spinner trong lúc chờ file JS tải về
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense
    fallback={
      <div className="flex h-screen items-center justify-center text-slate-500">
        Đang tải giao diện...
      </div>
    }
  >
    {children}
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/",
    loader: () => redirect("/boards"),
  },
  {
    path: "/login",
    element: (
      <SuspenseWrapper>
        <Login />
      </SuspenseWrapper>
    ),
  },
  {
    path: "/boards",
    element: <ProtectedRoute />, // Bảo vệ toàn bộ route /boards
    children: [
      {
        path: "",
        element: (
          <SuspenseWrapper>
            <MainLayout />
          </SuspenseWrapper>
        ),
        children: [
          {
            index: true,
            element: (
              <SuspenseWrapper>
                <Dashboard />
              </SuspenseWrapper>
            ),
            loader: boardsLoader,
          },
          {
            path: ":boardId",
            element: (
              <SuspenseWrapper>
                <BoardDetail />
              </SuspenseWrapper>
            ),
            loader: boardDetailLoader,
          },
        ],
      },
    ],
  },
]);
