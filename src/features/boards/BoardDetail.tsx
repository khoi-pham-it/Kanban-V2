import { useLoaderData } from 'react-router-dom';
import type { IBoard } from '../../types';

const BoardDetail = () => {
  const board = useLoaderData() as IBoard | null;

  if (!board) {
    return <div className="p-8">Không tìm thấy bảng</div>;
  }

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
      <header className="flex items-center justify-between px-6 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-3xl font-bold">dashboard_customize</span>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Trello Mini</h1>
          </div>
          <div className="h-6 w-px bg-slate-300 dark:bg-slate-700"></div>
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">{board.title}</h2>
            <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
              <span className="material-symbols-outlined text-sm">star</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative hidden md:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
            <input className="pl-10 pr-4 py-1.5 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary w-64" placeholder="Tìm kiếm thẻ..." type="text" />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity">
              <span className="material-symbols-outlined text-sm">person_add</span>
              Chia sẻ
            </button>
          </div>
        </div>
      </header>

      <div className="px-6 py-3 flex items-center justify-between bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1 text-sm font-medium px-3 py-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg">
            <span className="material-symbols-outlined text-lg">filter_list</span>
            Bộ lọc
          </button>
          <button className="flex items-center gap-1 text-sm font-medium px-3 py-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg">
            <span className="material-symbols-outlined text-lg">sort</span>
            Sắp xếp
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Hiển thị:</span>
          <span className="flex items-center gap-1 text-sm bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded">
            <span className="material-symbols-outlined text-xs">public</span>
            Công khai
          </span>
        </div>
      </div>

      <main className="flex-1 overflow-x-auto p-6 hide-scrollbar">
        <div className="flex gap-6 h-full items-start">
          {board.lists.map(list => (
            <div key={list.id} className="kanban-column flex flex-col bg-slate-200/50 dark:bg-slate-800/50 rounded-xl p-3 shrink-0">
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                  {list.title}
                  <span className="bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs px-2 py-0.5 rounded-full">{list.cards.length}</span>
                </h3>
                <button className="p-1 hover:bg-slate-300 dark:hover:bg-slate-700 rounded transition-colors">
                  <span className="material-symbols-outlined text-lg">more_horiz</span>
                </button>
              </div>

              <div className="flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-250px)] pr-1">
                {list.cards.map(card => (
                  <div key={card.id} className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow group">
                    <h4 className="text-sm font-semibold leading-snug">{card.title}</h4>
                    {card.description && <p className="text-xs mt-2 text-slate-500">{card.description}</p>}
                    <div className="flex items-center justify-between mt-3 text-slate-400">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">notes</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="mt-4 flex items-center gap-2 w-full p-2 text-slate-500 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors">
                <span className="material-symbols-outlined text-lg">add</span>
                Thêm thẻ
              </button>
            </div>
          ))}

          <button className="kanban-column shrink-0 bg-white/20 dark:bg-slate-800/20 hover:bg-white/40 dark:hover:bg-slate-800/40 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400 font-bold transition-all h-[56px]">
            <span className="material-symbols-outlined">add</span>
            Thêm danh sách khác
          </button>
        </div>
      </main>

      <footer className="px-6 py-2 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 mt-auto">
        <div className="flex items-center gap-4">
          <span>Hoạt động gần nhất: 5 phút trước</span>
          <div className="h-3 w-px bg-slate-300 dark:bg-slate-700"></div>
          <button className="hover:text-primary transition-colors">Xem các mục đã lưu trữ</button>
        </div>
      </footer>
    </div>
  );
};

export default BoardDetail;
