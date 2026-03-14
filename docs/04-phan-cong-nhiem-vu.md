# Phân công nhiệm vụ chi tiết (Giai đoạn Tích hợp Logic)

Mục tiêu của giai đoạn này là biến giao diện tĩnh hiện tại thành một ứng dụng hoạt động hoàn chỉnh với dữ liệu thực, có khả năng lưu trữ và kéo thả mượt mà. 

Dựa trên thế mạnh và các module mà từng thành viên đã đảm nhận ở các tuần trước, dưới đây là bảng phân công công việc cụ thể cho 3 thành viên: **Nguyên Khôi, Tuấn Kiệt, và Đức Anh**.

---

## 1. Phạm Nguyễn Nguyên Khôi - Đảm nhận Nền tảng Dữ liệu (Data Layer & Storage)

**Trọng tâm:** Xây dựng "bộ não" lưu trữ và xử lý dữ liệu cho toàn bộ ứng dụng.

**Các file cần thao tác chính:**
- `src/context/boardReducer.ts` (Tạo mới)
- `src/context/BoardContext.tsx` (Tạo mới)
- `src/hooks/useBoards.ts`, `src/hooks/useCards.ts`

**Nhiệm vụ chi tiết:**
1. **Viết Reducer (`boardReducer.ts`):** 
   - Định nghĩa tất cả các Action Types: `ADD_BOARD`, `DELETE_BOARD`, `ADD_LIST`, `RENAME_LIST`, `DELETE_LIST`, `ADD_CARD`, `DELETE_CARD`.
   - Cẩn thận khi viết logic clone State (Deep Clone) để không mutate trực tiếp state cũ khi thêm/xóa phần tử lồng sâu.
2. **Thiết lập Provider và Local Storage:**
   - Hoàn thiện `BoardProvider` bọc lấy ứng dụng.
   - Viết logic "Lazy Init" để khi ứng dụng load lên sẽ tự động lấy chuỗi JSON từ `localStorage.getItem('trello-data')` nạp vào Initial State.
   - Viết `useEffect` lắng nghe State. Khi State thay đổi thì tự động `localStorage.setItem`.
3. **Hoàn thiện Custom Hooks:**
   - Cung cấp các hàm trung gian trong `useBoards` và `useCards` để 2 Dev còn lại gọi dễ dàng (VD: gọi `addCard(listId, title)` thay vì phải gọi `dispatch`).

---

## 2. Vũ Lê Đức Anh - Đảm nhận Gắn kết Giao diện & Fake Auth (UI Wiring & Auth)

**Trọng tâm:** Kết nối các Form nhập liệu vào Context và hoàn thiện cơ chế Đăng nhập giả lập.

**Các file cần thao tác chính:**
- `src/features/auth/AuthContext.tsx` (Tạo mới)
- Các file UI: `AddCardForm.tsx`, `AddListForm.tsx`, `TaskCard.tsx`, `CardModal.tsx`, `Dashboard.tsx`.

**Nhiệm vụ chi tiết:**
1. **Nối Logic cho các Form (Wiring):**
   - Import hook `useCards` vào `AddCardForm` và gọi hàm thêm thẻ khi người dùng nhấn Enter.
   - Import hook `useBoards` vào `AddListForm` và gọi hàm thêm cột.
   - Gắn sự kiện Xóa (Delete) vào các icon thùng rác trên \`TaskCard\` và \`BoardCard\`.
2. **Xử lý Modal Chi tiết:**
   - Kết nối `CardModal` để hiển thị dữ liệu động (Ngày hết hạn, Nhãn).
   - *Tùy chọn nâng cao:* Thêm tính năng cập nhật Description (Mô tả) ngay trong Modal.
3. **Hoàn thiện Fake Authentication:**
   - Xây dựng `AuthContext` quản lý `user` và `isAuthenticated` lưu vào Local Storage (vd: `trello-auth`).
   - Cập nhật trang `Login.tsx` để khi click Đăng nhập thì set state thành `true` và redirect vào `/boards`.

---

## 3. Mai Trần Tuấn Kiệt - Đảm nhận Kéo Thả (Drag & Drop Core)

**Trọng tâm:** Tích hợp thư viện `@dnd-kit` để xử lý tính năng phức tạp và quan trọng nhất của Kanban. 

**Các file cần thao tác chính:**
- `src/features/boards/BoardDetail.tsx`
- `src/features/boards/components/List.tsx`
- `src/features/boards/components/TaskCard.tsx`
- `boardReducer.ts` (Phối hợp với Khôi để thêm Action `MOVE_CARD` và `MOVE_LIST`).

**Nhiệm vụ chi tiết:**
1. **Cấu hình DndContext:**
   - Bọc `<DndContext>` xung quanh khu vực render các List trong `BoardDetail.tsx`.
   - Cấu hình các Sensors (chuột, phím, cảm ứng) để nhận diện thao tác kéo.
2. **Xử lý Kéo List (Chiều ngang):**
   - Dùng `<SortableContext>` với `horizontalListSortingStrategy` cho các List.
   - Biến Component `List` thành một Sortable Item (thêm `attributes`, `listeners`, `transform`).
3. **Xử lý Kéo Card (Chiều dọc & Xuyên List):**
   - Tương tự, cấu hình Sortable cho từng `TaskCard`.
   - Viết các hàm `onDragOver` (khi thẻ bay ngang qua một list khác -> di chuyển tạm thời thẻ sang list mới).
   - Viết hàm `onDragEnd` (khi thả chuột ra -> chốt vị trí mới, gọi Action gửi lên Context để lưu lại dữ liệu).

---

## Quy trình làm việc nhóm (Git Workflow)

Vì cả 3 thành viên sẽ cùng thao tác trên nhiều file liên quan đến nhau, để tránh **Conflict** (xung đột code) gây mất dữ liệu, nhóm thống nhất quy trình sau:

1. **Không code trực tiếp trên nhánh `main`.**
2. Mỗi người tự tạo nhánh riêng cho tính năng của mình:
   - Khôi: `git checkout -b feature/data-layer`
   - Đức Anh: `git checkout -b feature/ui-wiring`
   - Kiệt: `git checkout -b feature/dnd-kit`
3. Nguyên Khôi (Data Layer) cần hoàn thành bộ khung Reducer và Context đẩy lên trước, sau đó Kiệt và Đức Anh `git pull origin main` về nhánh của mình để có cái mà dùng (gọi Hook).
4. Khi có lỗi, báo ngay cho nhóm trên kênh chat để cùng review, KHÔNG tự ý force push (`-f`) ghi đè code của người khác.