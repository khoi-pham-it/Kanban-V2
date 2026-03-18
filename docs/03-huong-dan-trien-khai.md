# Hướng dẫn Triển khai Logic (Roadmap cho Dev Team)

Chào mừng các bạn dev! Hiện tại hệ thống nền tảng kiến trúc **Feature-Sliced Design (FSD)** và quản lý dữ liệu toàn cục với **Zustand** đã được thiết lập 100%. Nhiệm vụ tiếp theo của team (cụ thể là Đức Anh và Nguyên Khôi) là kết hợp UI với Logic và kích hoạt Kéo Thả (Drag & Drop).

Dưới đây là lộ trình triển khai chi tiết cho 2 tính năng trọng tâm còn lại.

---

## 1. Hoàn thiện Component và Kết nối Store (UI Wiring)

Mọi dữ liệu tĩnh (mock data) ở các form nhập liệu đều đã được thay bằng Zustand Store (`useBoardStore`). Giờ là lúc đi sâu vào các Modal.

1. **Hiển thị Form Thêm mới linh hoạt:**
   - Trong `src/features/kanban/components/AddCardForm.tsx`, khi nhấn "Thêm thẻ", hãy dùng thư viện `Immer` của Zustand để chèn một đối tượng `Card` vào mảng `list.cards`.
   - Form cần có trạng thái `isEditing` để khi người dùng click ra ngoài (onBlur) hoặc ấn Esc, form sẽ tự động thu nhỏ lại.

2. **Cập nhật Modal Chi tiết (CardModal):**
   - Modal cần hiển thị toàn bộ thuộc tính của Thẻ: `title`, `description`, `dueDate` (Ngày hết hạn), `labels` (Nhãn dán).
   - Hãy thiết kế giao diện bằng Tailwind CSS sao cho giống hệt Trello: có các ô màu nhỏ đại diện cho nhãn dán, click vào ô mô tả để biến nó thành một ô `textarea` có thể chỉnh sửa trực tiếp.
   - Gọi hàm `updateCard(boardId, listId, cardId, newData)` từ `useBoardStore` để ghi nhận các thay đổi này xuống Local Storage tự động (nhờ middleware Persist).

---

## 2. Kéo Thả với Dnd-Kit (Trọng tâm kỹ thuật)

Tính năng Kéo thả (Drag & Drop) đòi hỏi sự phối hợp rất chặt chẽ giữa `dnd-kit/core` và `Zustand Store`. Khôi sẽ làm theo các bước này:

1. **Cài đặt thư viện:**
   Dự án đã sử dụng bộ thư viện chính thức của `@dnd-kit`:
   `npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`

2. **Thiết lập `<DndContext>`:**
   - Mở `src/pages/boards/BoardPage.tsx`. Bọc toàn bộ container chứa các cột (Lists) bằng component `<DndContext>`.
   - Để tránh việc "click nhầm thành kéo", hãy cấu hình các `Sensors`:
     ```tsx
     const sensors = useSensors(
       useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
       useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
     );
     // ... <DndContext sensors={sensors} onDragEnd={handleDragEnd} onDragOver={handleDragOver} onDragStart={handleDragStart}>
     ```

3. **Kéo thả Cột (Horizontal Sorting):**
   - Bọc mảng các List (trong hàm map của BoardPage) bằng `<SortableContext items={listIds} strategy={horizontalListSortingStrategy}>`.
   - Trong component `List.tsx`, dùng hook `useSortable({ id: list.id })`. Hook này trả về `attributes`, `listeners`, `setNodeRef`, và `transform`. Bạn phải gán chúng vào thẻ `div` gốc của List để biến nó thành vật thể kéo được.
   - Khi sự kiện `onDragEnd` xảy ra, gọi hàm `moveList` của Zustand để hoán đổi vị trí 2 phần tử trong mảng `board.lists`.

4. **Kéo thả Thẻ (Vertical Sorting & Cross-List):**
   - Tương tự, bọc mảng các `TaskCard` trong mỗi Cột bằng `<SortableContext items={cardIds} strategy={verticalListSortingStrategy}>`.
   - Trong `TaskCard.tsx`, gắn `useSortable({ id: card.id })`.
   - Đây là phần khó nhất: Sự kiện **`onDragOver`**. Khi bạn nhấc thẻ A từ Cột 1 sang lơ lửng trên Cột 2, bạn phải phát hiện sự kiện này, lấy dữ liệu tạm thời ra và di chuyển Thẻ A sang Cột 2 ở mặt giao diện để người dùng có thể "nhìn trước" vị trí rơi.
   - Khi nhả chuột (**`onDragEnd`**), gọi action `moveCard` từ `useBoardStore` để chốt hạ vị trí mới (Index) và Cột mới (targetListId) vào Global State.

---

## 3. Quản lý Rủi ro (Performance & Renders)

Khi cấu hình Kéo thả, rất dễ gặp tình trạng re-render toàn bộ giao diện khiến thao tác bị giật lag (Drop FPS).

**Giải pháp bắt buộc:**
- Sử dụng **Atomic Selectors** của Zustand khi lấy dữ liệu:
  Thay vì `const { boards } = useBoardStore()`, hãy dùng `const list = useBoardStore((state) => state.boards.find(b => b.id === boardId).lists.find(l => l.id === listId))`.
- Trong `TaskCard.tsx`, chỉ truyền dữ liệu cơ bản (primitive types như string, id) nếu có thể, hạn chế truyền cả một object khổng lồ xuống dưới để `React.memo` có thể hoạt động hiệu quả.

Chúc team dev code vui vẻ và gặt hái thành công!