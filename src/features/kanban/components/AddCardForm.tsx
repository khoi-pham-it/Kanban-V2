import { useState, useRef, useEffect } from "react";
import { useClickOutside } from "../../../hooks/useClickOutside";

interface AddCardFormProps {
  listId: string | number;
  onAddCard?: (listId: string | number, title: string) => void;
}

const AddCardForm = ({ listId, onAddCard }: AddCardFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

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
      // Gọi callback để lưu card (sẽ kết nối với Global State sau)
      if (onAddCard) {
        onAddCard(listId, title.trim());
      } else {
        console.log(`Add card to list ${listId}: ${title}`);
      }
      setTitle("");
      // Không tắt form ngay để user có thể nhập liên tục nhiều thẻ
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
    if (e.key === "Escape") {
      setIsEditing(false);
      setTitle("");
    }
  };

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="mt-4 flex items-center gap-2 w-full p-2 text-slate-500 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors"
      >
        <span className="material-symbols-outlined text-lg">add</span>
        Thêm thẻ
      </button>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="mt-3 flex flex-col gap-2">
      <textarea
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Nhập tiêu đề cho thẻ này..."
        className="w-full bg-white dark:bg-slate-900 p-3 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
        rows={3}
      />
      <div className="flex items-center gap-2">
        <button
          type="submit"
          className="px-3 py-1.5 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          Thêm thẻ
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
  );
};

export default AddCardForm;
