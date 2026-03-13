import { useLoaderData, useNavigate } from 'react-router-dom';
import type { IBoard } from '../../types';

const Dashboard = () => {
  const boards = useLoaderData() as IBoard[];
  const navigate = useNavigate();

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Các Bảng Của Bạn</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Quản lý các dự án và quy trình làm việc đang hoạt động.</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
          <span className="material-symbols-outlined">add_circle</span>
          <span>Tạo Bảng Mới</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {boards.map((board, idx) => {
          // Add some fake gradients for variety based on index
          const gradients = [
            "from-blue-500 to-indigo-600",
            "from-rose-500 to-orange-500",
            "from-emerald-500 to-teal-700"
          ];
          const bgGradient = gradients[idx % gradients.length];

          return (
            <div
              key={board.id}
              onClick={() => navigate(`/boards/${board.id}`)}
              className="group relative bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-200 dark:border-slate-700 flex flex-col h-48 cursor-pointer"
            >
              <div className={`h-2/3 w-full bg-gradient-to-br ${bgGradient} relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.8),transparent)]"></div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-center">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors">{board.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Hoạt động</span>
                </div>
              </div>
              <button className="absolute top-3 right-3 p-1.5 bg-black/20 hover:bg-black/40 text-white rounded-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-lg">star</span>
              </button>
            </div>
          );
        })}

        <button className="group relative bg-slate-100 dark:bg-slate-800/40 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center justify-center h-48 gap-3">
          <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-3xl">add</span>
          </div>
          <span className="text-sm font-bold text-slate-500 group-hover:text-primary transition-colors">Thêm Bảng</span>
        </button>
      </div>

      <div className="mt-12">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">history</span>
          Hoạt động gần đây
        </h3>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700">
          <div className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
              <span className="material-symbols-outlined">edit</span>
            </div>
            <div className="flex-1">
              <p className="text-sm"><span className="font-bold">Bạn</span> đã chuyển <span className="font-medium text-primary">Design Feedback</span> sang <span className="font-medium text-primary">Hoàn thành</span></p>
              <p className="text-xs text-slate-500 mt-1">2 giờ trước • Dự án Web</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
