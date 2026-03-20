import { useEffect, useMemo, useRef, useState } from "react";
import type { ICard, Id } from "../types";
import { useBoardStore } from "../store/useBoardStore";
import { LABEL_PRESETS, getLabelClassName } from "../constants";

interface CardModalProps {
  boardId: Id;
  listId: Id;
  card: ICard;
  listTitle?: string;
  onClose: () => void;
}

function isoToDateInputValue(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function dateInputValueToIso(value: string) {
  if (!value) return undefined;
  // Store as ISO string at local midnight to keep UI date stable
  const [yyyy, mm, dd] = value.split("-").map((x) => Number(x));
  if (!yyyy || !mm || !dd) return undefined;
  const d = new Date(yyyy, mm - 1, dd, 0, 0, 0, 0);
  return d.toISOString();
}

const CardModal = ({
  boardId,
  listId,
  card,
  listTitle = "Danh sách",
  onClose,
}: CardModalProps) => {
  const updateCard = useBoardStore((state) => state.updateCard);
  const deleteCard = useBoardStore((state) => state.deleteCard);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(card.title);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [descriptionDraft, setDescriptionDraft] = useState(card.description ?? "");
  const [dueDateDraft, setDueDateDraft] = useState<string>(isoToDateInputValue(card.dueDate));
  const [labelsDraft, setLabelsDraft] = useState<string[]>(card.labels ?? []);

  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const hasMeta = useMemo(() => (labelsDraft.length > 0 ? true : Boolean(dueDateDraft)), [
    labelsDraft.length,
    dueDateDraft,
  ]);

  // Escape: thoát chế độ sửa trước, không thì đóng modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (isEditingTitle) {
        setTitleDraft(card.title);
        setIsEditingTitle(false);
        return;
      }
      if (isEditingDescription) {
        setDescriptionDraft(card.description ?? "");
        setIsEditingDescription(false);
        return;
      }
      onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, isEditingTitle, isEditingDescription, card.title, card.description]);

  // Ngăn cuộn trang (body) khi mở modal
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    setTitleDraft(card.title);
    setDescriptionDraft(card.description ?? "");
    setDueDateDraft(isoToDateInputValue(card.dueDate));
    setLabelsDraft(card.labels ?? []);
  }, [card.id, card.title, card.description, card.dueDate, card.labels]);

  useEffect(() => {
    if (!isEditingTitle) return;
    titleInputRef.current?.focus();
    titleInputRef.current?.select();
  }, [isEditingTitle]);

  useEffect(() => {
    if (!isEditingDescription) return;
    const el = textareaRef.current;
    if (!el) return;
    el.focus();
    const len = el.value.length;
    el.setSelectionRange(len, len);
  }, [isEditingDescription]);

  const commitTitle = () => {
    const next = titleDraft.trim();
    if (next && next !== card.title) {
      updateCard(boardId, listId, card.id, { title: next });
    } else {
      setTitleDraft(card.title);
    }
    setIsEditingTitle(false);
  };

  const cancelEditTitle = () => {
    setTitleDraft(card.title);
    setIsEditingTitle(false);
  };

  const commitDescription = () => {
    const next = descriptionDraft.trim();
    updateCard(boardId, listId, card.id, { description: next ? next : undefined });
    setIsEditingDescription(false);
  };

  const toggleLabel = (labelKey: string) => {
    const next = labelsDraft.includes(labelKey)
      ? labelsDraft.filter((x) => x !== labelKey)
      : [...labelsDraft, labelKey];
    setLabelsDraft(next);
    updateCard(boardId, listId, card.id, { labels: next.length ? next : undefined });
  };

  const commitDueDate = (value: string) => {
    setDueDateDraft(value);
    updateCard(boardId, listId, card.id, { dueDate: dateInputValueToIso(value) });
  };

  const handleDelete = () => {
    if (confirm("Bạn có chắc chắn muốn xóa thẻ này không?")) {
      deleteCard(boardId, listId, card.id);
      onClose();
    }
  };

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
            <span className="material-symbols-outlined text-slate-500 mt-1 shrink-0">
              video_label
            </span>
            <div className="flex-1 min-w-0">
              {isEditingTitle ? (
                <input
                  ref={titleInputRef}
                  type="text"
                  value={titleDraft}
                  onChange={(e) => setTitleDraft(e.target.value)}
                  onBlur={commitTitle}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitTitle();
                    if (e.key === "Escape") cancelEditTitle();
                  }}
                  className="w-full text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Tên thẻ"
                />
              ) : (
                <div className="group/title inline-flex items-start gap-2 max-w-full">
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 leading-tight break-words max-w-full">
                    {card.title}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setIsEditingTitle(true)}
                    className="mt-0 flex align-center p-1.5 rounded-lg text-slate-400 opacity-0 hover:text-slate-600 bg-slate-200 dark:hover:text-slate-300 dark:hover:bg-slate-700 group-hover/title:opacity-100 transition-all shrink-0"
                    title="Chỉnh sửa tên thẻ"
                  >
                    <span className="material-symbols-outlined !text-md">edit</span>
                  </button>
                </div>
              )}
              <p className="text-sm text-slate-500 mt-1">
                trong danh sách <span className="underline cursor-pointer">{listTitle}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Main Content Left Column */}
            <div className="flex-1 flex flex-col gap-8">
              {/* Meta information (Labels, Due Date) */}
              {hasMeta && (
                <div className="flex flex-wrap gap-6 md:ml-10">
                  {labelsDraft.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Nhãn
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {labelsDraft.map((label, idx) => (
                          <span
                            key={idx}
                            className={`px-3 py-1 text-white text-sm font-medium rounded-md ${getLabelClassName(label)}`}
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {dueDateDraft && (
                    <div>
                      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Ngày hết hạn
                      </h3>
                      <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-md">
                        <span className="material-symbols-outlined text-sm text-slate-500">
                          schedule
                        </span>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {new Date(dateInputValueToIso(dueDateDraft) ?? "").toLocaleDateString(
                            "vi-VN",
                          )}
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
                    {!isEditingDescription ? (
                      <button
                        onClick={() => setIsEditingDescription(true)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg transition-colors"
                      >
                        Chỉnh sửa
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setDescriptionDraft(card.description ?? "");
                            setIsEditingDescription(false);
                          }}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg transition-colors"
                        >
                          Hủy
                        </button>
                        <button
                          onClick={commitDescription}
                          className="px-3 py-1.5 bg-primary text-white hover:opacity-90 text-sm font-medium rounded-lg transition-colors"
                        >
                          Lưu
                        </button>
                      </div>
                    )}
                  </div>
                  {!isEditingDescription ? (
                    descriptionDraft.trim() ? (
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {descriptionDraft}
                      </p>
                    ) : (
                      <button
                        onClick={() => setIsEditingDescription(true)}
                        className="w-full text-left bg-slate-100 dark:bg-slate-800/50 rounded-lg p-4 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                      >
                        <p className="text-slate-500 text-sm">Thêm mô tả chi tiết hơn...</p>
                      </button>
                    )
                  ) : (
                    <textarea
                      ref={textareaRef}
                      value={descriptionDraft}
                      onChange={(e) => setDescriptionDraft(e.target.value)}
                      onBlur={commitDescription}
                      rows={4}
                      className="w-full resize-y min-h-[120px] rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
                      placeholder="Nhập mô tả..."
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar Right Column */}
            <div className="w-full md:w-48 flex flex-col gap-2 shrink-0">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Thêm vào thẻ
              </h3>
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-sm font-medium">
                  <span className="material-symbols-outlined text-lg">sell</span>
                  Nhãn
                </div>
                <div className="mt-2 flex flex-col gap-2">
                  {LABEL_PRESETS.map((p) => {
                    const active = labelsDraft.includes(p.key);
                    return (
                      <button
                        key={p.key}
                        onClick={() => toggleLabel(p.key)}
                        className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-white/60 dark:hover:bg-slate-700/60 transition-colors text-left"
                        title={p.key}
                      >
                        <span
                          className={`inline-block w-4 h-4 rounded ${p.className} ${
                            active ? "ring-2 ring-primary ring-offset-2 ring-offset-slate-100 dark:ring-offset-slate-800" : ""
                          }`}
                        />
                        <span className="text-sm">{p.key}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-sm font-medium">
                  <span className="material-symbols-outlined text-lg">schedule</span>
                  Ngày hết hạn
                </div>
                <input
                  type="date"
                  value={dueDateDraft}
                  onChange={(e) => commitDueDate(e.target.value)}
                  className="mt-2 w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1 text-sm text-slate-800 dark:text-slate-200"
                />
                {dueDateDraft && (
                  <button
                    onClick={() => commitDueDate("")}
                    className="mt-2 w-full px-2 py-1 rounded-md text-sm bg-white/70 hover:bg-white dark:bg-slate-900/60 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    Xóa ngày
                  </button>
                )}
              </div>

              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 mt-4">
                Hành động
              </h3>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 w-full p-2 bg-slate-100 hover:bg-red-50 dark:bg-slate-800 dark:hover:bg-red-900/20 text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 rounded-lg text-sm font-medium transition-colors text-left group"
              >
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
