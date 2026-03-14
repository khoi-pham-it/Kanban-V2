import { useLoaderData, useNavigate } from "react-router-dom";
import type { IBoard } from "../../types";
import BoardCard from "./components/BoardCard";

const Dashboard = () => {
  const boards = useLoaderData() as IBoard[];

  const handleDeleteBoard = (e: React.MouseEvent, boardId: string | number) => {
    e.stopPropagation();
    // TODO: Bổ sung logic xóa board qua Context hoặc Action của React Router
    if (confirm("Bạn có chắc chắn muốn xóa bảng này không?")) {
      console.log("Delete board:", boardId);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Các Bảng Của Bạn
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Quản lý các dự án và quy trình làm việc đang hoạt động.
          </p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
          <span className="material-symbols-outlined">add_circle</span>
          <span>Tạo Bảng Mới</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {boards.map((board, idx) => (
          <BoardCard
            key={board.id}
            board={board}
            idx={idx}
            onDelete={handleDeleteBoard}
          />
        ))}

        <button className="group relative bg-slate-100 dark:bg-slate-800/40 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center justify-center h-48 gap-3">
          <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-3xl">add</span>
          </div>
          <span className="text-sm font-bold text-slate-500 group-hover:text-primary transition-colors">
            Thêm Bảng
          </span>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
