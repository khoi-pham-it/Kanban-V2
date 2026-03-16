# Phân công nhiệm vụ chi tiết (Giai đoạn Tích hợp Logic)

Mục tiêu của giai đoạn này là biến giao diện tĩnh hiện tại thành một ứng dụng hoạt động hoàn chỉnh với dữ liệu thực, có khả năng lưu trữ và kéo thả mượt mà. 

**CẬP NHẬT QUAN TRỌNG:** Nhóm đã quyết định chuyển sang sử dụng **Zustand** kết hợp với **Immer** thay cho `Context API` và `useReducer` ban đầu. Zustand giúp giảm thiểu boilerplate code (code lặp lại), tối ưu hóa re-render và tích hợp sẵn middleware để lưu Local Storage cực kỳ tiện lợi.

Dưới đây là bảng phân công công việc cụ thể cho 3 thành viên: **Nguyên Khôi, Tuấn Kiệt, và Đức Anh**.

---

## 1. Mai Trần Tuấn Kiệt - Đảm nhận Nền tảng Dữ liệu (Zustand Store)

**Trọng tâm:** Xây dựng "bộ não" lưu trữ và xử lý dữ liệu cho toàn bộ ứng dụng bằng Zustand.

**Các file cần thao tác chính:**
- `src/store/useBoardStore.ts` (Đã khởi tạo cơ bản)
- `src/types/index.ts` (Cập nhật nếu cần)

**Nhiệm vụ chi tiết:**
1. **Hoàn thiện Store:** 
   - Kiểm tra và test kỹ các actions đã viết: `addBoard`, `deleteBoard`, `addList`, `deleteList`, `addCard`, `deleteCard`.
   - Đảm bảo middleware `immer` hoạt động đúng để tránh lỗi mutate state lồng sâu (mutate mảng trong mảng).
2. **Chuẩn bị Action cho Kéo Thả:**
   - Phối hợp với Đức Anh để định nghĩa các hàm cực kỳ quan trọng cho `dnd-kit`:
     - `moveList(boardId, activeListId, overListId)`: Đổi vị trí 2 List.
     - `moveCardInSameList(boardId, listId, activeCardId, overCardId)`: Đổi vị trí 2 Card trong cùng 1 Cột.
     - `moveCardToDifferentList(boardId, sourceListId, targetListId, cardId, newIndex)`: Di chuyển Card sang Cột khác.

---

## 2. Phạm Nguyễn Nguyên Khôi - Đảm nhận Gắn kết Giao diện (UI Wiring & Forms)

**Trọng tâm:** Kết nối các Form nhập liệu tĩnh với các Action thực tế từ Zustand Store.

**Các file cần thao tác chính:**
- `src/features/boards/Dashboard.tsx`
- `src/features/boards/BoardDetail.tsx`
- Các file UI: `AddCardForm.tsx`, `AddListForm.tsx`, `TaskCard.tsx`, `CardModal.tsx`.

**Nhiệm vụ chi tiết:**
1. **Nối Logic cho các Form (Wiring):**
   - Xóa bỏ dữ liệu mock từ `useLoaderData` (nếu có) và thay bằng `useBoardStore((state) => state.boards)`.
   - Trong `AddCardForm`, import `addCard` từ `useBoardStore` và gọi hàm khi người dùng nhấn Enter.
   - Trong `AddListForm`, import `addList` và gọi hàm tương tự.
2. **Gắn sự kiện Xóa:**
   - Gọi hàm `deleteCard` khi bấm icon thùng rác trên thẻ.
   - Gọi hàm `deleteList` khi bấm icon thùng rác trên Cột.
   - Gọi hàm `deleteBoard` khi ở ngoài trang Dashboard.
3. **Xử lý Modal Chi tiết:**
   - Đảm bảo `CardModal` hiển thị đúng dữ liệu lấy từ store và đồng bộ mượt mà khi dữ liệu được update.

---

## 3. Vũ Lê Đức Anh - Đảm nhận Kéo Thả (Drag & Drop Core)

**Trọng tâm:** Tích hợp thư viện `@dnd-kit` để xử lý tính năng phức tạp và quan trọng nhất của Kanban. 

**Các file cần thao tác chính:**
- `src/features/boards/BoardDetail.tsx`
- `src/features/boards/components/List.tsx`
- `src/features/boards/components/TaskCard.tsx`

**Nhiệm vụ chi tiết:**
1. **Cấu hình DndContext:**
   - Cài đặt: `npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`.
   - Bọc `<DndContext>` xung quanh khu vực render các List trong `BoardDetail.tsx`.
   - Cấu hình các Sensors (chuột, phím, cảm ứng) để nhận diện thao tác kéo (chú ý cấu hình khoảng cách bắt đầu kéo để không bị nhầm với click mở Modal).
2. **Xử lý Kéo List (Chiều ngang):**
   - Dùng `<SortableContext>` với `horizontalListSortingStrategy` cho các List.
   - Biến Component `List` thành một Sortable Item (dùng hook `useSortable`, thêm `attributes`, `listeners`, `transform`).
3. **Xử lý Kéo Card (Chiều dọc & Xuyên List):**
   - Tương tự, cấu hình Sortable cho từng `TaskCard`.
   - Bắt sự kiện `onDragOver` (để update UI tạm thời khi thẻ bay sang Cột khác) và `onDragEnd` (khi thả chuột ra để chốt vị trí mới, gọi các Action do Kiệt viết trong Zustand Store).

---

## Quy trình làm việc nhóm (Git Workflow)

Vì cả 3 thành viên sẽ cùng thao tác trên nhiều file liên quan đến nhau, để tránh **Conflict** (xung đột code) gây mất dữ liệu, nhóm thống nhất quy trình sau:

1. **Không code trực tiếp trên nhánh `main`.**
2. Mỗi người tự tạo nhánh riêng cho tính năng của mình:
   - Kiệt: `git checkout -b feature/zustand-store`
   - Khôi: `git checkout -b feature/ui-wiring`
   - Đức Anh: `git checkout -b feature/dnd-kit`
3. Tuấn Kiệt (Store) cần hoàn thành bộ khung Store cơ bản và đẩy lên (Push) lên nhánh của mình trước. Sau đó Khôi và Đức Anh hợp nhất nhánh của Kiệt vào nhánh của mình để có Store mà gọi hàm.
4. Khi có lỗi, báo ngay cho nhóm trên kênh chat để cùng review, KHÔNG tự ý force push (`-f`) ghi đè code của người khác.