import { useEffect } from "react";
import type { ICard } from "../types";

interface CardModalProps {
  card: ICard;
  listTitle?: string;
  onClose: () => void;
}

const CardModal = ({ card, listTitle = "Danh sách", onClose }: CardModalProps) => {
  // Đóng modal khi nhấn phím Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Ngăn cuộn trang (body) khi mở modal
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-4 md:p-0 bg-black/50 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()} // Ngăn việc click vào content làm đóng modal
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors z-10"
          title="Đóng (Esc)"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="p-6 md:p-8 flex flex-col gap-6">
          {/* Header: Title & List Context */}
          <div className="flex gap-4 pr-8">
            <span className="material-symbols-outlined text-slate-500 mt-1">
              video_label
            </span>
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
                {card.title}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                trong danh sách <span className="underline cursor-pointer">{listTitle}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Main Content Left Column */}
            <div className="flex-1 flex flex-col gap-8">
              {/* Meta information (Labels, Due Date) */}
              {(card.labels?.length || card.dueDate) && (
                <div className="flex flex-wrap gap-6 md:ml-10">
                  {card.labels && card.labels.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Nhãn
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {card.labels.map((label, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-primary/20 text-primary dark:text-primary-light text-sm font-medium rounded-md"
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {card.dueDate && (
                    <div>
                      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Ngày hết hạn
                      </h3>
                      <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-md">
                        <span className="material-symbols-outlined text-sm text-slate-500">
                          schedule
                        </span>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {new Date(card.dueDate).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Description Section */}
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-slate-500 mt-1">
                  description
                </span>
                <div className="flex-1 w-full">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Mô tả
                    </h3>
                    <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg transition-colors">
                      Chỉnh sửa
                    </button>
                  </div>
                  {card.description ? (
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {card.description}
                    </p>
                  ) : (
                    <div className="bg-slate-100 dark:bg-slate-800/50 rounded-lg p-4 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                      <p className="text-slate-500 text-sm">
                        Thêm mô tả chi tiết hơn...
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar Right Column */}
            <div className="w-full md:w-48 flex flex-col gap-2 shrink-0">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Thêm vào thẻ
              </h3>
              <button className="flex items-center gap-2 w-full p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium transition-colors text-left">
                <span className="material-symbols-outlined text-lg">sell</span>
                Nhãn
              </button>
              <button className="flex items-center gap-2 w-full p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium transition-colors text-left">
                <span className="material-symbols-outlined text-lg">
                  schedule
                </span>
                Ngày hết hạn
              </button>

              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 mt-4">
                Hành động
              </h3>
              <button className="flex items-center gap-2 w-full p-2 bg-slate-100 hover:bg-red-50 dark:bg-slate-800 dark:hover:bg-red-900/20 text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 rounded-lg text-sm font-medium transition-colors text-left group">
                <span className="material-symbols-outlined text-lg group-hover:text-red-600 dark:group-hover:text-red-400">
                  delete
                </span>
                Xóa thẻ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardModal;
