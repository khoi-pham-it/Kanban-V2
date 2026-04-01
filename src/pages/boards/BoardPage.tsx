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
import { useAuthStore } from "../../features/auth/store/useAuthStore";
import { Button } from "../../components/ui";
import  Alert  from "../../components/ui/Alert";

type MemberAlert = {
  variant: "success" | "error" | "warning" | "info";
  message: string;
};

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

  const [memberEmail, setMemberEmail] = useState("");
  const [memberAlert, setMemberAlert] = useState<MemberAlert | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const mainRef = useRef<HTMLElement | null>(null);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);

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
    if (isDragging) {
      document.body.classList.add('dragging');
      
      // Theo dõi mouse move để auto-scroll
      const handleMouseMove = (e: MouseEvent) => {
        if (!mainRef.current) return;
        
        const main = mainRef.current;
        const threshold = 50; // khoảng cách từ edge để trigger scroll
        const scrollSpeed = 10;
        
        const rect = main.getBoundingClientRect();
        const distFromRight = rect.right - e.clientX;
        const distFromLeft = e.clientX - rect.left;
        
        // Clear timeout trước
        if (autoScrollRef.current) clearTimeout(autoScrollRef.current);
        
        // Scroll right nếu mouse gần cạnh phải
        if (distFromRight < threshold && distFromRight > 0) {
          main.scrollLeft += scrollSpeed;
        }
        // Scroll left nếu mouse gần cạnh trái  
        else if (distFromLeft < threshold && distFromLeft > 0) {
          main.scrollLeft -= scrollSpeed;
        }
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        if (autoScrollRef.current) clearTimeout(autoScrollRef.current);
      };
    } else {
      document.body.classList.remove('dragging');
    }
  }, [isDragging]);

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

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setIsDragging(false);
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

  const isOwner = useAuthStore((s) => s.user?.id === board.ownerId);
  const handleAddMember = () => {
    const email = memberEmail.trim();
    const user = useAuthStore.getState().user;

    if (!email) {
      setMemberAlert({
        variant: "warning",
        message: "Vui lòng nhập email hợp lệ",
      });
      return;
    }

    if (!isOwner) {
      setMemberAlert({
        variant: "error",
        message: "Chỉ chủ sở hữu mới có thể thêm thành viên",
      });
      return;
    }

    if (board.memberIds.includes(email) || board.ownerId === email || user?.email === email) {
      setMemberAlert({
        variant: "warning",
        message: "Email này đã là thành viên của board",
      });
      return;
    }

    const addMemberToBoard = useBoardStore.getState().addMemberToBoard;
    addMemberToBoard(board.id, email);
    setMemberEmail("");
    setMemberAlert({
      variant: "success",
      message: "Đã thêm thành viên thành công",
    });
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

      <main ref={mainRef} className={isDragging ? "flex-1 p-6 overflow-y-auto overflow-x-hidden" : "flex-1 p-6 overflow-x-auto hide-scrollbar"}>
        {
          memberAlert && (
            <Alert
              variant={memberAlert.variant}
              onClose={() => setMemberAlert(null)}
              className="mb-6"
            >
              {memberAlert.message}
            </Alert>
          )
        }

        <div className="flex items-center justify-end gap-6 mb-6 px-2 ">
          <h3>Thêm thành viên vào Board hiện tại</h3>
          <input
            onChange={(e) => setMemberEmail(e.target.value)}
            type="text"
            placeholder="Nhập email thành viên..."
            className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
            value={memberEmail}
          />
          <Button variant="primary" className="px-4 py-2" onClick={handleAddMember}>
            Thêm Thành Viên
          </Button>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
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
