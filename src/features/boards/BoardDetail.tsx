import { useLoaderData } from "react-router-dom";
import type { IBoard } from "../../types";
import List from "./components/List";

const BoardDetail = () => {
  const board = useLoaderData() as IBoard | null;

  if (!board) {
    return <div className="p-8">Không tìm thấy bảng</div>;
  }

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
      <header className="flex items-center justify-between px-6 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
        <div className="flex items-center gap-6">
          <h2 className="text-lg font-semibold">{board.title}</h2>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative hidden md:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
              search
            </span>
            <input
              className="pl-10 pr-4 py-1.5 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary w-64"
              placeholder="Tìm kiếm thẻ..."
              type="text"
            />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-x-auto p-6 hide-scrollbar">
        <div className="flex gap-6 h-full items-start">
          {board.lists.map((list) => (
            <List key={list.id} list={list} />
          ))}

          <button className="kanban-column shrink-0 bg-white/20 dark:bg-slate-800/20 hover:bg-white/40 dark:hover:bg-slate-800/40 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400 font-bold transition-all h-[56px] w-72">
            <span className="material-symbols-outlined">add</span>
            Thêm danh sách khác
          </button>
        </div>
      </main>
    </div>
  );
};

export default BoardDetail;
