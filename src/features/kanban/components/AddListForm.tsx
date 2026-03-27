import { useState, useRef, useEffect } from "react";
import { useClickOutside } from "../../../hooks/useClickOutside";

interface AddListFormProps {
  boardId?: string | number;
  onAddList?: (title: string) => void;
}

const AddListForm = ({ onAddList }: AddListFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useClickOutside(formRef, () => {
    if (isEditing) {
      setIsEditing(false);
      setTitle("");
    }
  });

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      if (onAddList) {
        onAddList(title.trim());
      } else {
        console.log(`Add list: ${title}`);
      }
      setTitle("");
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsEditing(false);
      setTitle("");
    }
  };

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="kanban-column shrink-0 bg-white/20 dark:bg-slate-800/20 hover:bg-white/40 dark:hover:bg-slate-800/40 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400 font-bold transition-all h-[56px] w-72"
      >
        <span className="material-symbols-outlined">add</span>
        Thêm danh sách khác
      </button>
    );
  }

  return (
    <div ref={formRef} className="kanban-column flex flex-col bg-slate-200/50 dark:bg-slate-800/50 rounded-xl p-3 shrink-0 w-72 h-fit">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          ref={inputRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nhập tiêu đề danh sách..."
          className="w-full bg-white dark:bg-slate-900 p-2 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm font-semibold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 placeholder:font-normal"
        />
        <div className="flex items-center gap-2 mt-1">
          <button
            type="submit"
            className="px-3 py-1.5 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            Thêm danh sách
          </button>
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setTitle("");
            }}
            className="p-1.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddListForm;
