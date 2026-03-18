# Phân công nhiệm vụ chi tiết (Cập nhật Giai đoạn 2)

Hiện tại, **Mai Trần Tuấn Kiệt** đã hoàn thành xuất sắc 100% nhiệm vụ của mình ở Giai đoạn 1. Kiến trúc ứng dụng đã được nâng cấp lên **Feature-Sliced Design (FSD)** kết hợp với **Zustand Store**, **Immer**, **Persist** và tính năng **Authentication (Fake Login/Protected Routes)** đã hoạt động hoàn hảo.

Dưới đây là bảng phân công công việc cụ thể cho 2 thành viên còn lại: **Vũ Lê Đức Anh** và **Phạm Nguyễn Nguyên Khôi** để tiếp tục hoàn thiện dự án.

---

## 1. Mai Trần Tuấn Kiệt - Kiến trúc và Xác thực (Đã Hoàn Thành ✅)

**Trạng thái:** 100% (Hoàn thành)
**Thành quả đạt được:**
- Khởi tạo dự án, cấu trúc thư mục FSD (`app`, `pages`, `components`, `features`).
- Cài đặt React Router (Data Mode) và Protected Routes (`src/components/guard/ProtectedRoute.tsx`).
- Tích hợp Zustand Store với Immer và Persist middleware.
- Hoàn thiện luồng Đăng nhập (Authentication) và hiển thị thông tin User (Avatar/Email) trên Header & Sidebar.

---

## 2. Vũ Lê Đức Anh - Trải nghiệm Người dùng (UI/UX) và Card Detail Modal

**Trạng thái:** Đang tiến hành (In Progress)
**Trọng tâm:** Hoàn thiện trải nghiệm hiển thị (UI/UX) và các form tương tác phức tạp, đặc biệt là Modal xem chi tiết Thẻ (Card Detail Modal).

**Nhiệm vụ chi tiết:**
1. **Hoàn thiện CardModal (`src/features/kanban/components/CardModal.tsx`):**
   - Hiện tại Modal chỉ đang hiển thị tĩnh. Bạn cần bổ sung các trường thông tin quan trọng cho một thẻ Kanban thực thụ:
     - **Mô tả (Description):** Cho phép người dùng click vào để edit (sử dụng `<textarea>` tự động dãn dòng).
     - **Ngày hết hạn (Due Date):** Tích hợp thư viện chọn ngày (ví dụ `react-datepicker`) hoặc dùng thẻ `<input type="date">` mặc định để người dùng set deadline.
     - **Nhãn dán (Labels):** Tạo một danh sách các màu sắc (Đỏ, Vàng, Xanh...) để người dùng gắn nhãn cảnh báo cho Card.
2. **Cập nhật Zustand Store:**
   - Để lưu được Mô tả, Ngày hết hạn và Nhãn dán, bạn cần vào file `src/features/kanban/store/slices/cardSlice.ts`.
   - Bổ sung thêm hàm `updateCard(boardId, listId, cardId, updatedData)`. Hàm này sẽ dùng thư viện `Immer` để tìm đúng Card đang mở và update các field mới.
3. **Tối ưu hóa UI Component (Shared UI):**
   - Đóng gói các thành phần dùng chung vào `src/components/ui/` (ví dụ: `Button.tsx`, `Input.tsx`, `Modal.tsx`) để tái sử dụng, giúp code gọn gàng hơn. Có thể tham khảo code snippet từ [shadcn/ui](https://ui.shadcn.com/) kết hợp với Tailwind CSS để làm cho giao diện trông chuyên nghiệp và hiện đại nhất.

---

## 3. Phạm Nguyễn Nguyên Khôi - Xử lý Kéo Thả (Drag & Drop Logic)

**Trạng thái:** Đang tiến hành (In Progress)
**Trọng tâm:** Tích hợp thư viện `@dnd-kit` để xử lý tính năng cốt lõi và phức tạp nhất của Kanban: Kéo thả List và Card.

**Nhiệm vụ chi tiết:**
1. **Cấu hình DndContext (Bắt đầu từ `BoardPage.tsx`):**
   - Bạn cần import và bọc toàn bộ khu vực hiển thị các Cột (Lists) bằng thẻ `<DndContext>` của `@dnd-kit/core`.
   - Cấu hình các Sensors (MouseSensor, TouchSensor, KeyboardSensor) với thuộc tính `activationConstraint: { distance: 5 }` để tránh việc người dùng chỉ click chuột (để mở Modal) mà hệ thống lại nhầm tưởng là đang kéo thả.
2. **Xử lý Kéo Thả Cột (Horizontal Sorting):**
   - Import `<SortableContext>` với `horizontalListSortingStrategy` bao bọc mảng các List.
   - Bên trong component `src/features/kanban/components/List.tsx`, dùng hook `useSortable({ id: list.id })` để lấy ra `setNodeRef`, `attributes`, `listeners`, `transform`. Gắn chúng vào thẻ `<div className="kanban-column">` ngoài cùng.
3. **Xử lý Kéo Thả Thẻ (Vertical Sorting - Khó nhất):**
   - Làm tương tự bước 2 cho component `TaskCard.tsx` (bọc bằng `verticalListSortingStrategy`).
   - Cực kỳ chú ý: Thẻ có thể bị kéo từ Cột A sang Cột B. Bạn phải bắt sự kiện `onDragOver` trong `DndContext` để phát hiện thẻ đang bay lơ lửng trên cột nào và thay đổi State tạm thời để giao diện cập nhật ngay lập tức.
4. **Cập nhật Zustand Store (Chốt vị trí):**
   - Viết các action mới trong `boardSlice.ts` và `listSlice.ts`:
     - `moveList(boardId, activeListId, overListId)`: Đảo vị trí 2 cột.
     - `moveCard(boardId, activeListId, overListId, activeCardId, overCardIndex)`: Chốt hạ vị trí của thẻ khi người dùng nhả chuột (`onDragEnd`).

---

## Quy trình làm việc nhóm (Git Workflow)

1. Cả Đức Anh và Nguyên Khôi hãy kéo (pull) code mới nhất từ nhánh `main` (chứa toàn bộ nền tảng FSD và Zustand mà Tuấn Kiệt đã setup).
2. Tạo nhánh riêng để làm việc:
   - Đức Anh: `git checkout -b feature/card-modal-ui`
   - Nguyên Khôi: `git checkout -b feature/drag-and-drop`
3. Tuyệt đối tuân thủ nguyên tắc **Feature-Sliced Design**. Mọi file code thuộc về Kanban phải nằm trong `src/features/kanban/`.
4. Nếu có conflict xảy ra tại các file Store dùng chung (ví dụ `useBoardStore.ts`), hãy họp nhóm để resolve conflict thủ công, không dùng cờ `--force`.