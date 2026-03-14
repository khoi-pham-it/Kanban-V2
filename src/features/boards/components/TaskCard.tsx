import { useState } from "react";
import type { ICard } from "../../../types";
import CardModal from "./CardModal";

interface TaskCardProps {
  card: ICard;
  listTitle?: string;
}

const TaskCard = ({ card, listTitle }: TaskCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow group/card cursor-pointer relative"
      >
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-semibold leading-snug">{card.title}</h4>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Tích hợp logic xóa thẻ
              console.log("Delete card", card.id);
            }}
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
                className="block w-8 h-1.5 rounded-full bg-primary/60"
                title={label}
              ></span>
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
          card={card}
          listTitle={listTitle}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default TaskCard;
