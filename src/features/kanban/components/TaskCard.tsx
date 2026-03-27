import { useState } from "react";
import type { ICard, Id } from "../types";
import CardModal from "./CardModal";
import { useBoardStore } from "../store/useBoardStore";
import { getLabelClassName } from "../constants";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TaskCardProps {
  card: ICard;
  listTitle?: string;
  listId: Id;
  boardId: Id;
}

const TaskCard = ({ card, listTitle, listId, boardId }: TaskCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const deleteCard = useBoardStore((state) => state.deleteCard);


  const { 
    setNodeRef, 
    attributes, 
    listeners, 
    transform, 
    transition, 
    isDragging 
  } = useSortable({
    id: card.id,
    data: {
      type: "Card",
      listId: listId,
      card: card,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.2 : 1,
  };

  const handleDeleteCard = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Bạn có chắc chắn muốn xóa thẻ này không?")) {
      deleteCard(boardId, listId, card.id);
    }
  };

  

  return (
    <>
      {/* Gắn ref, style và các sự kiện kéo thả vào div ngoài cùng */}
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={() => setIsModalOpen(true)}
        className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow group/card cursor-pointer relative"
      >
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-semibold leading-snug">{card.title}</h4>
          <button
            onClick={handleDeleteCard}
            className="opacity-0 group-hover/card:opacity-100 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-red-500 rounded transition-all shrink-0"
            title="Xóa thẻ"
          >
            <span className="material-symbols-outlined text-sm">delete</span>
          </button>
        </div>

        {card.labels && card.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {card.labels.map((label, idx) => (
              <span
                key={idx}
                className={`block w-8 h-1.5 rounded-full ${getLabelClassName(label)}`}
                title={label}
              />
            ))}
          </div>
        )}

        {card.description && (
          <p className="text-xs mt-2 text-slate-500 line-clamp-2">
            {card.description}
          </p>
        )}
      </div>

      {isModalOpen && (
        <CardModal
          boardId={boardId}
          listId={listId}
          card={card}
          listTitle={listTitle}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};
export default TaskCard;
