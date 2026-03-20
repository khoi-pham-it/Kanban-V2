import { useState, useRef, useEffect } from "react";
import type { IList, Id } from "../types";
import TaskCard from "./TaskCard";
import AddCardForm from "./AddCardForm";
import { useBoardStore } from "../store/useBoardStore";

interface ListProps {
  list: IList;
  boardId: Id;
}

const List = ({ list, boardId }: ListProps) => {
  const updateList = useBoardStore((state) => state.updateList);
  const deleteList = useBoardStore((state) => state.deleteList);
  const addCard = useBoardStore((state) => state.addCard);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(list.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitleDraft(list.title);
  }, [list.title]);

  useEffect(() => {
    if (isEditingTitle) inputRef.current?.focus();
  }, [isEditingTitle]);

  const handleDeleteList = () => {
    if (confirm("Bạn có chắc chắn muốn xóa danh sách này không?")) {
      deleteList(boardId, list.id);
    }
  };

  const handleAddCard = (listId: string | number, title: string) => {
    addCard(boardId, listId, title);
  };

  const startEditTitle = () => {
    setTitleDraft(list.title);
    setIsEditingTitle(true);
  };

  const commitTitle = () => {
    const next = titleDraft.trim();
    if (next && next !== list.title) {
      updateList(boardId, list.id, next);
    } else {
      setTitleDraft(list.title);
    }
    setIsEditingTitle(false);
  };

  const cancelEditTitle = () => {
    setTitleDraft(list.title);
    setIsEditingTitle(false);
  };

  return (
    <div className="kanban-column flex flex-col bg-slate-200/50 dark:bg-slate-800/50 rounded-xl p-3 shrink-0 w-72">
      <div className="flex items-center justify-between mb-4 px-1 group/list">
        {isEditingTitle ? (
          <input
            ref={inputRef}
            type="text"
            value={titleDraft}
            onChange={(e) => setTitleDraft(e.target.value)}
            onBlur={commitTitle}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitTitle();
              if (e.key === "Escape") cancelEditTitle();
            }}
            className="flex-1 min-w-0 font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Tên danh sách"
          />
        ) : (
          <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 min-w-0">
            <span className="truncate">{list.title}</span>
            <span className="bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs px-2 py-0.5 rounded-full shrink-0">
              {list.cards.length}
            </span>
          </h3>
        )}
        <div className="flex ml-2 items-center gap-1 opacity-0 group-hover/list:opacity-100 transition-opacity shrink-0">
          <button
            onClick={startEditTitle}
            type="button"
            className="p-1 flex align-center hover:bg-slate-300 dark:hover:bg-slate-700 rounded text-slate-500 hover:text-primary transition-colors"
            title="Đổi tên danh sách"
          >
            <span className="material-symbols-outlined text-sm">edit</span>
          </button>
          <button
            onClick={handleDeleteList}
            className="p-1 flex align-center hover:bg-slate-300 dark:hover:bg-slate-700 rounded text-slate-500 hover:text-red-500 transition-colors"
            title="Xóa danh sách"
          >
            <span className="material-symbols-outlined text-sm">delete</span>
          </button>
        </div>
      </div>

      <div
        className="flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-250px)] pr-1"
      >
        {list.cards.map((card) => (
          <TaskCard
            key={card.id}
            card={card}
            listTitle={list.title}
            listId={list.id}
            boardId={boardId}
          />
        ))}
      </div>

      <AddCardForm listId={list.id} onAddCard={handleAddCard} />
    </div>
  );
};

export default List;
