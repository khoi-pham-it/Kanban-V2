import { useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
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
      </div>
    </header>
  );
};

export default Header;
