import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark flex flex-col h-full">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-primary rounded-lg p-1.5 flex items-center justify-center">
          <span className="material-symbols-outlined text-white text-2xl">dashboard_customize</span>
        </div>
        <div>
          <h1 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-none">Trello Mini</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Không gian làm việc</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        <NavLink
          to="/boards"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
              isActive
                ? 'active-link font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`
          }
        >
          <span className="material-symbols-outlined">home</span>
          <span className="text-sm font-semibold">Trang chủ</span>
        </NavLink>

        <NavLink
          to="/boards"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
              isActive && window.location.pathname !== '/boards'
                ? 'active-link font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`
          }
        >
          <span className="material-symbols-outlined">grid_view</span>
          <span className="text-sm font-semibold">Bảng của bạn</span>
        </NavLink>

        <a className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" href="#">
          <span className="material-symbols-outlined">auto_awesome_motion</span>
          <span className="text-sm font-semibold">Mẫu (Templates)</span>
        </a>

        <a className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" href="#">
          <span className="material-symbols-outlined">settings</span>
          <span className="text-sm font-semibold">Cài đặt</span>
        </a>
      </nav>

      <div className="p-4 mt-auto border-t border-slate-200 dark:border-slate-800">
        <div className="bg-primary/10 dark:bg-primary/5 rounded-xl p-4">
          <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Gói Chuyên Nghiệp</p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">Tạo không giới hạn bảng và tự động hóa.</p>
          <button className="w-full py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 transition-opacity">Nâng cấp ngay</button>
        </div>

        <div className="flex items-center gap-3 mt-4 px-2">
          <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-xs">
            U
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold truncate">Bạn</p>
            <p className="text-xs text-slate-500 truncate">user@trello.mini</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
