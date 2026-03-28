import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export type ModalProps = {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
};

export default function Modal({ open, title, onClose, children, className = "" }: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-4 md:p-0 bg-black/50 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl overflow-hidden my-auto ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors z-10"
          title="Đóng (Esc)"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {title && (
          <div className="px-6 md:px-8 pt-6 md:pt-8">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
              {title}
            </h2>
          </div>
        )}

        <div className={title ? "p-6 md:p-8 pt-4 md:pt-6" : "p-6 md:p-8"}>{children}</div>
      </div>
    </div>,
    document.body
  );
}

