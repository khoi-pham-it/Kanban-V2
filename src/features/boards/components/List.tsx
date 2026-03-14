import type { IList } from "../../../types";
import TaskCard from "./TaskCard";
import AddCardForm from "./AddCardForm";

interface ListProps {
  list: IList;
}

const List = ({ list }: ListProps) => {
  return (
    <div className="kanban-column flex flex-col bg-slate-200/50 dark:bg-slate-800/50 rounded-xl p-3 shrink-0 w-72">
      <div className="flex items-center justify-between mb-4 px-1 group/list">
        <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
          {list.title}
          <span className="bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs px-2 py-0.5 rounded-full">
            {list.cards.length}
          </span>
        </h3>
        <div className="flex items-center gap-1 opacity-0 group-hover/list:opacity-100 transition-opacity">
          <button
            className="p-1 hover:bg-slate-300 dark:hover:bg-slate-700 rounded text-slate-500 hover:text-primary transition-colors"
            title="Đổi tên danh sách"
          >
            <span className="material-symbols-outlined text-sm">edit</span>
          </button>
          <button
            className="p-1 hover:bg-slate-300 dark:hover:bg-slate-700 rounded text-slate-500 hover:text-red-500 transition-colors"
            title="Xóa danh sách"
          >
            <span className="material-symbols-outlined text-sm">delete</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-250px)] pr-1">
        {list.cards.map((card) => (
          <TaskCard key={card.id} card={card} listTitle={list.title} />
        ))}
      </div>

      <AddCardForm listId={list.id} />
    </div>
  );
};

export default List;
