import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragEndEvent,
} from "@dnd-kit/core";
import { AddListForm, List } from "../../features/kanban/components";
import { useBoardStore } from "../../features/kanban/store/useBoardStore";

const BoardDetail = () => {
  const { boardId } = useParams();

  // Lấy dữ liệu từ store bằng selectors để tối ưu re-render
  const board = useBoardStore((state) => state.boards.find((b) => b.id === boardId));
  const addList = useBoardStore((state) => state.addList);
  const updateBoard = useBoardStore((state) => state.updateBoard);
  const moveCard = useBoardStore((state) => state.moveCard);

  const [isEditingBoardTitle, setIsEditingBoardTitle] = useState(false);
  const [boardTitleDraft, setBoardTitleDraft] = useState("");
  const boardTitleInputRef = useRef<HTMLInputElement | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor),
  );

  useEffect(() => {
    setBoardTitleDraft(board?.title || "");
  }, [board?.title]);

  useEffect(() => {
    if (!isEditingBoardTitle) return;
    boardTitleInputRef.current?.focus();
    boardTitleInputRef.current?.select();
  }, [isEditingBoardTitle]);

  if (!board) {
    return <div className="p-8">Không tìm thấy bảng</div>;
  }

  const handleAddList = (title: string) => {
    if (boardId) {
      addList(boardId, title);
    }
  };

  const commitBoardTitle = () => {
    const next = boardTitleDraft.trim();
    if (next && next !== board.title) {
      updateBoard(board.id, next);
    } else {
      setBoardTitleDraft(board.title);
    }
    setIsEditingBoardTitle(false);
  };

  const cancelBoardTitle = () => {
    setBoardTitleDraft(board.title);
    setIsEditingBoardTitle(false);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (activeData?.type === "Card") {
      const activeCardId = active.id;
      const fromListId = activeData.listId;

      const toListId = overData?.type === "Card" ? overData.listId : over.id;

      const overIndex = overData?.sortable?.index;

      if (boardId && fromListId && toListId) {
        moveCard(boardId, fromListId, toListId, activeCardId, overIndex);
      }
    }

    if (activeData?.type === "List") {
      console.log("Cần viết thêm hàm moveList trong store để cập nhật vị trí List!");
    }
  };

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
      <header className="flex items-center justify-between px-6 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
        <div className="flex items-center gap-6">
          {isEditingBoardTitle ? (
            <input
              ref={boardTitleInputRef}
              type="text"
              value={boardTitleDraft}
              onChange={(e) => setBoardTitleDraft(e.target.value)}
              onBlur={commitBoardTitle}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitBoardTitle();
                if (e.key === "Escape") cancelBoardTitle();
              }}
              className="text-lg font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Tên bảng"
            />
          ) : (
            <button
              type="button"
              onClick={() => setIsEditingBoardTitle(true)}
              className="text-lg font-semibold text-left hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg px-3 py-1.5 transition-colors"
              title="Đổi tên bảng"
            >
              {board.title}
            </button>
          )}
        </div>

        <div className="flex items-center gap-6">
          <div className="relative hidden md:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
              search
            </span>
            <input
              className="pl-10 pr-4 py-1.5 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary w-64"
              placeholder="Tìm kiếm thẻ..."
              type="text"
            />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-x-auto p-6 hide-scrollbar">
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
          <div className="flex gap-6 h-full items-start">
            {board.lists.map((list) => (
              <List key={list.id} list={list} boardId={board.id} />
            ))}

            <AddListForm boardId={board.id} onAddList={handleAddList} />
          </div>
        </DndContext>
      </main>
    </div>
  );
};

export default BoardDetail;
