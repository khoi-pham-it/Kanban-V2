import { useNavigate } from "react-router-dom";
import type { IBoard } from "../../../types";

interface BoardCardProps {
  board: IBoard;
  idx: number;
  onDelete: (e: React.MouseEvent, boardId: string | number) => void;
}

const BoardCard = ({ board, idx, onDelete }: BoardCardProps) => {
  const navigate = useNavigate();

  const gradients = [
    "from-blue-500 to-indigo-600",
    "from-rose-500 to-orange-500",
    "from-emerald-500 to-teal-700",
  ];
  const bgGradient = gradients[idx % gradients.length];

  return (
    <div
      onClick={() => navigate(`/boards/${board.id}`)}
      className="group relative bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-200 dark:border-slate-700 flex flex-col h-48 cursor-pointer"
    >
      <div
        className={`h-2/3 w-full bg-gradient-to-br ${bgGradient} relative overflow-hidden`}
      >
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.8),transparent)]"></div>
      </div>
      <div className="p-4 flex-1 flex flex-col justify-center">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors">
          {board.title}
        </h3>
      </div>
      <button
        onClick={(e) => onDelete(e, board.id)}
        className="absolute top-3 right-3 p-1.5 bg-black/20 hover:bg-red-500/80 text-white rounded-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all"
        title="Xóa bảng"
      >
        <span className="material-symbols-outlined text-lg">delete</span>
      </button>
    </div>
  );
};

export default BoardCard;
