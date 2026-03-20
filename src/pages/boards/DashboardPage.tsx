import { useState, useRef, useEffect } from "react";
import BoardCard from "../../features/kanban/components/BoardCard";
import { useBoardStore } from "../../features/kanban/store/useBoardStore";
import Modal from "../../components/ui/Modal";

const Dashboard = () => {
  const boards = useBoardStore((state) => state.boards);
  const addBoard = useBoardStore((state) => state.addBoard);
  const deleteBoard = useBoardStore((state) => state.deleteBoard);

  const [isCreateBoardOpen, setIsCreateBoardOpen] = useState(false);
  const [boardTitleDraft, setBoardTitleDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCreateBoardOpen) {
      setBoardTitleDraft("");
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isCreateBoardOpen]);

  const handleDeleteBoard = (e: React.MouseEvent, boardId: string | number) => {
    e.stopPropagation();
    if (confirm("Bạn có chắc chắn muốn xóa bảng này không?")) {
      deleteBoard(boardId);
    }
  };

  const handleOpenCreateBoard = () => {
    setIsCreateBoardOpen(true);
  };

  const handleSubmitCreateBoard = (e: React.FormEvent) => {
    e.preventDefault();
    const title = boardTitleDraft.trim();
    if (title) {
      addBoard(title);
      setIsCreateBoardOpen(false);
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
        <button
          onClick={handleOpenCreateBoard}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
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

        <button
          onClick={handleOpenCreateBoard}
          className="group relative bg-slate-100 dark:bg-slate-800/40 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center justify-center h-48 gap-3"
        >
          <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-3xl">add</span>
          </div>
          <span className="text-sm font-bold text-slate-500 group-hover:text-primary transition-colors">
            Thêm Bảng
          </span>
        </button>
      </div>

      <Modal
        open={isCreateBoardOpen}
        title="Tạo bảng mới"
        onClose={() => setIsCreateBoardOpen(false)}
      >
        <form onSubmit={handleSubmitCreateBoard} className="flex flex-col gap-4">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Tên bảng
          </label>
          <input
            ref={inputRef}
            type="text"
            value={boardTitleDraft}
            onChange={(e) => setBoardTitleDraft(e.target.value)}
            placeholder="Nhập tên bảng..."
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40"
            autoFocus
          />
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreateBoardOpen(false)}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={!boardTitleDraft.trim()}
              className="px-4 py-2 rounded-lg bg-primary text-white font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              Tạo bảng
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Dashboard;
