import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../features/auth/store/useAuthStore";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const isBoardDetail = location.pathname.split("/").length > 2;

  // Don't show header if we're on the board detail page, as it has its own header
  if (isBoardDetail) {
    return null;
  }

  return (
    <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 py-4 w-full">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="relative w-96">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
            search
          </span>
          <input
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            placeholder="Tìm kiếm bảng, công việc..."
            type="text"
          />
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {user.name}
              </span>
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="Avatar"
                  className="w-9 h-9 rounded-full bg-slate-200 cursor-pointer shadow-sm ring-2 ring-white dark:ring-slate-900"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-indigo-500 text-white flex items-center justify-center font-bold text-sm cursor-pointer shadow-sm ring-2 ring-white dark:ring-slate-900">
                  {user.name?.[0]?.toUpperCase() || "U"}
                </div>
              )}
            </div>
          )}
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            title="Đăng xuất"
            className="p-2 text-slate-500 hover:bg-red-50 hover:text-red-500 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
