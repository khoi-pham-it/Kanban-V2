import type { ICard } from "../../../types";

interface TaskCardProps {
  card: ICard;
}

const TaskCard = ({ card }: TaskCardProps) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow group/card cursor-pointer relative">
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold leading-snug">{card.title}</h4>
        <button
          className="opacity-0 group-hover/card:opacity-100 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-red-500 rounded transition-all shrink-0"
          title="Xóa thẻ"
        >
          <span className="material-symbols-outlined text-sm">delete</span>
        </button>
      </div>
      {card.description && (
        <p className="text-xs mt-2 text-slate-500 line-clamp-2">
          {card.description}
        </p>
      )}
    </div>
  );
};

export default TaskCard;
