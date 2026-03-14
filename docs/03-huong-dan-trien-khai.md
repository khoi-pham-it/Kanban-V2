# Hướng dẫn Triển khai Logic (Roadmap cho Dev Team)

Chào mừng các bạn dev! Hiện tại giao diện (UI) tĩnh của Trello Mini đã được xây dựng hoàn thiện khoảng 80%. Nhiệm vụ tiếp theo của team là biến các giao diện vô hồn này thành một ứng dụng sống động. 

Dưới đây là kế hoạch từng bước (Step-by-step) để các bạn triển khai. Hãy làm theo đúng thứ tự này để tránh bị "ngợp".

---

## Bước 1: Khởi tạo Context và Reducer (Nền tảng dữ liệu)

Trước khi gắn dữ liệu vào UI, chúng ta cần một nơi để chứa dữ liệu.

1. **Tạo `boardReducer.ts`**:
   - Định nghĩa các hằng số Action Types: `ADD_LIST`, `ADD_CARD`, `DELETE_CARD`, v.v.
   - Viết hàm `boardReducer(state, action)` chứa logic cập nhật State (nhớ clone deep mảng dữ liệu, không mutate trực tiếp state cũ).
   
2. **Tạo `BoardContext.tsx`**:
   - Khởi tạo Context: `export const BoardContext = createContext(...)`.
   - Viết Component `BoardProvider` bọc lấy ứng dụng.
   - Bên trong `BoardProvider`, gọi `useReducer(boardReducer, initialState)`.

3. **Viết Custom Hook `useBoards` và `useCards`**:
   - Dùng `useContext(BoardContext)` bên trong các hook này.
   - Export ra các hàm tiện ích như `addCard`, `deleteList` để UI dễ dàng gọi.

---

## Bước 2: Thay thế Mock Data và Gắn Sự kiện (Wiring)

Khi Context đã sẵn sàng, hãy nối nó với giao diện:

1. **Hiển thị dữ liệu thực:**
   - Vào `Dashboard.tsx` và `BoardDetail.tsx`, thay vì dùng `useLoaderData` tĩnh, hãy lấy danh sách `boards` từ Custom Hook `useBoards()`.
   
2. **Kích hoạt Form Thêm mới:**
   - Mở `AddCardForm.tsx`, import hook `useCards()`. 
   - Trong hàm `handleSubmit`, gọi hàm `addCard(listId, title)`.
   - Làm tương tự với `AddListForm.tsx`.
   - *Kiểm tra:* Thử thêm Card/List, nếu UI tự động render ra thẻ mới là bạn đã làm đúng cơ chế State-driven!

3. **Kích hoạt tính năng Xóa/Sửa:**
   - Gắn sự kiện `onClick` vào các icon thùng rác (Delete) trong `List.tsx` và `TaskCard.tsx`.
   - Gắn logic truyền data thực vào `CardModal.tsx` để xem chi tiết.

---

## Bước 3: Đồng bộ Local Storage (Persistence)

Đừng để F5 làm mất hết công sức.

1. **Khởi tạo dữ liệu từ Local Storage:**
   - Trong `BoardProvider`, thay vì truyền `initialState` trống vào `useReducer`, hãy viết một hàm khởi tạo (Lazy initializer) để đọc từ `localStorage.getItem('trello-data')`. Nếu không có, mới dùng mảng rỗng.

2. **Lưu dữ liệu tự động:**
   - Thêm một `useEffect` vào `BoardProvider` lắng nghe sự thay đổi của biến `state`. Bất cứ khi nào `state` đổi, hãy gọi `localStorage.setItem('trello-data', JSON.stringify(state))`.

---

## Bước 4: Kéo Thả với Dnd-Kit (Trùm cuối)

Đây là phần "khó nhằn" nhất dự án. Hãy làm theo tài liệu của `@dnd-kit`.

1. **Cài đặt thư viện:**
   `npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`

2. **Thiết lập DndContext:**
   - Trong `BoardDetail.tsx`, bọc toàn bộ khu vực chứa các List bằng thẻ `<DndContext>`.
   - Định nghĩa các hàm `onDragStart`, `onDragOver`, `onDragEnd` để theo dõi hành động kéo thả.

3. **Kéo thả List (Chiều ngang):**
   - Bọc mảng chứa các `List` bằng `<SortableContext items={listIds} strategy={horizontalListSortingStrategy}>`.
   - Trong component `List.tsx`, sử dụng hook `useSortable` để biến List thành phần tử có thể cầm nắm. Gắn các thuộc tính `attributes`, `listeners`, và `transform` vào thẻ `div` gốc của List.

4. **Kéo thả Card (Chiều dọc & Xuyên List):**
   - Bọc mảng chứa các `TaskCard` bên trong mỗi List bằng `<SortableContext items={cardIds} strategy={verticalListSortingStrategy}>`.
   - Trong `TaskCard.tsx`, dùng hook `useSortable` tương tự như List.

5. **Xử lý Logic `onDragEnd` & `onDragOver`:**
   - Nếu kéo List: Chuyển đổi vị trí 2 List trong mảng `lists` (dispatch action `REORDER_LIST`).
   - Nếu kéo Card cùng một List: Chuyển đổi vị trí 2 Card (dispatch action `REORDER_CARD`).
   - Nếu kéo Card sang List khác: Bắt sự kiện `onDragOver` để gỡ Card ra khỏi List nguồn và chèn vào List đích. 

---

## Lời khuyên cuối

- **Chia để trị:** Đừng làm cả bước 4 cùng lúc. Hãy làm kéo thả List xong xuôi, đảm bảo chạy tốt, rồi mới làm kéo thả Card.
- **Dùng React DevTools:** Đây là người bạn thân nhất để kiểm tra xem Context State có đang cập nhật đúng hay không.
- **Log kỹ càng:** Khi làm kéo thả, hãy `console.log(active.id, over.id)` để hiểu chính xác phần tử nào đang được kéo và nó đang bay ngang qua phần tử nào.

Chúc team dev code vui vẻ và không bị bug hành!