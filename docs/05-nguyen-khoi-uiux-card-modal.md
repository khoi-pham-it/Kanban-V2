# Công việc của Nguyên Khôi: UI/UX + Card Modal + Luồng thao tác Trello Mini (Playbook học & dạy)

Tài liệu này là **playbook đầy đủ** cho phần việc của Nguyên Khôi, viết theo hướng “đọc là làm lại được” để phục vụ **học** và **dạy lại**. Nội dung được cập nhật theo đúng code hiện tại của repo.

Bao gồm toàn bộ phần đã làm từ đầu tới giờ:

- Create Board bằng Modal (thay `prompt`)
- Rename Board (đổi tên board trong `BoardPage`)
- Card Detail Modal: edit **Title/Description/Due date/Labels**, xoá card
- Fix màu Labels hiển thị đúng màu đã chọn
- Rename List (đổi tên danh sách)
- Drag & Drop để đổi vị trí Card (trong list và kéo qua list khác)
- Chuẩn hoá shared UI ở `src/components/ui/`

---

## 1. Bối cảnh kiến trúc cần nắm (FSD + Store)

### 1.1. Feature-Sliced Design (FSD)

- UI dùng chung toàn app: `src/components/`
  - `layout/` (Header/Sidebar/MainLayout)
  - `guard/` (ProtectedRoute)
  - `ui/` (button/input/modal dùng lại)
- Feature Kanban: `src/features/kanban/`
  - `components/` (List, TaskCard, CardModal, …)
  - `store/` (Zustand slices + store chính)
  - `types/` (IBoard/IList/ICard)
  - `constants.ts` (hằng số dùng chung của Kanban, ví dụ labels)
- Pages (routes): `src/pages/boards/` (`DashboardPage.tsx`, `BoardPage.tsx`)

### 1.2. Zustand + Immer + Persist (luồng state)

- Store chính: `src/features/kanban/store/useBoardStore.ts`
  - `persist(...)` lưu vào `localStorage` với key `trello-storage`
  - `immer(...)` cho phép mutate “như mutable” trong actions
- Slice & trách nhiệm:
  - `boardSlice`: `addBoard`, `updateBoard`, `deleteBoard`
  - `listSlice`: `addList`, `updateList`, `deleteList`
  - `cardSlice`: `addCard`, `updateCard`, `deleteCard`, `moveCard`

Nguyên tắc: **UI chỉ gọi action**. Logic tìm board/list/card và mutate mảng lồng nhau nằm trong slice để dễ bảo trì.

---

## 2. Chạy dự án (khi vừa clone)

Trong thư mục root:

- Cài dependencies:
  - `npm install`
- Chạy dev:
  - `npm run dev`

Nếu `npm install` lỗi mạng (`ECONNRESET`), thử:

- đổi mạng/VPN rồi chạy lại
- chạy lại với `npm install --no-audit --no-fund`

---

## 3. Data model (IBoard/IList/ICard)

File: `src/features/kanban/types/index.ts`

### 3.1. Board

- `IBoard`: `{ id, title, lists }`

### 3.2. List

- `IList`: `{ id, title, cards }`

### 3.3. Card

- `ICard` (các field quan trọng cho modal/UI):
  - `id: Id`
  - `title: string`
  - `createdAt: string` (ISO)
  - `description?: string`
  - `dueDate?: string` (ISO)
  - `labels?: string[]` (tên nhãn: `"Đỏ"`, `"Vàng"`, …)

---

## 4. Việc 1 — Create Board bằng Modal (thay `prompt`)

### 4.1. Mục tiêu

Khi bấm “Tạo Bảng Mới” / “Thêm Bảng” ở Dashboard, mở modal nhập tên board thay vì `prompt`.

### 4.2. File liên quan

- `src/pages/boards/DashboardPage.tsx`
- `src/components/ui/Modal.tsx`

### 4.3. Các bước triển khai (làm lại từ đầu)

1. Trong `DashboardPage.tsx`, tạo state:
   - `isCreateBoardOpen: boolean`
   - `boardTitleDraft: string`
   - `inputRef` để focus
2. Tạo handlers:
   - `handleOpenCreateBoard()` → set open = true
   - `handleSubmitCreateBoard(e)`:
     - `e.preventDefault()`
     - `const title = boardTitleDraft.trim()`
     - nếu title không rỗng → gọi `addBoard(title)` và đóng modal
3. Render modal:
   - `<Modal open={isCreateBoardOpen} title="Tạo bảng mới" onClose={...}>`
   - bên trong là `<form>` gồm:
     - `<input>` nhập tên
     - nút “Hủy” và “Tạo bảng”
4. UX bắt buộc:
   - focus input khi mở modal (dùng `useEffect` + `requestAnimationFrame`)
   - disable nút “Tạo bảng” nếu title rỗng

---

## 5. Việc 2 — Rename Board (đổi tên Board)

### 5.1. Mục tiêu UX

Trong `BoardPage`, click vào tiêu đề board để sửa trực tiếp:

- Enter/blur → lưu
- Escape → hủy

### 5.2. Store: thêm action `updateBoard`

1. Update type: `src/features/kanban/store/types.ts`
   - thêm `updateBoard(boardId, title)`
2. Implement: `src/features/kanban/store/slices/boardSlice.ts`
   - find board theo `boardId`
   - `const next = title.trim()`; nếu rỗng thì bỏ qua
   - `board.title = next`

### 5.3. UI: edit tiêu đề trong `BoardPage`

File: `src/pages/boards/BoardPage.tsx`

1. Lấy action:
   - `const updateBoard = useBoardStore((s) => s.updateBoard)`
2. State:
   - `isEditingBoardTitle`
   - `boardTitleDraft`
   - `ref` input để focus/select
3. Render:
   - không edit: render như button (click để vào edit)
   - edit: render `<input>` với handlers:
     - `onBlur` commit
     - `onKeyDown`: Enter commit, Escape cancel
4. Focus/select text:
   - `useEffect(() => { if (isEditing...) focus & select }, [isEditing...])`

---

## 6. Việc 3 — Card Detail Modal: edit Title/Description/Due date/Labels + Delete

File chính: `src/features/kanban/components/CardModal.tsx`

### 6.1. “Wiring” bắt buộc (boardId/listId)

Để update/xoá đúng card, modal cần:

- `boardId`, `listId`, `card.id`

Luồng mở modal:

- `TaskCard.tsx` mở `CardModal`
- vì vậy `TaskCard` phải truyền thêm `boardId` và `listId` vào props `CardModal`

### 6.2. Store: `updateCard` (cập nhật nhiều field)

File: `src/features/kanban/store/slices/cardSlice.ts`

Pseudo-flow:

1. Find board theo `boardId`
2. Find list theo `listId`
3. Find card theo `cardId`
4. `Object.assign(card, updatedData)`

Điểm hay: một action update được nhiều field (`title`, `description`, `dueDate`, `labels`, …) giúp UI gọn.

### 6.3. Edit Description (textarea + auto-save)

Trong `CardModal.tsx`:

- state:
  - `isEditingDescription`
  - `descriptionDraft`
- UX:
  - click “Chỉnh sửa” → show `<textarea>`
  - blur → `commitDescription()`
  - “Lưu / Hủy” để rõ hành động
- Quy ước lưu:
  - `descriptionDraft.trim()` rỗng → lưu `undefined` (coi như xoá)

### 6.4. Due date (input date)

- UI: `<input type="date">`
- State: `dueDateDraft` dạng `YYYY-MM-DD` (phù hợp input date)
- Convert:
  - `dateInputValueToIso(value)` → ISO
  - `isoToDateInputValue(iso)` → `YYYY-MM-DD`
- Có nút “Xóa ngày” (set rỗng)

### 6.5. Labels (preset + toggle)

Preset label được chuẩn hoá ở `src/features/kanban/constants.ts` (xem mục 7).

- UI: list preset để click toggle
- Lưu:
  - labels rỗng → `undefined`
  - có labels → `string[]`

### 6.6. Delete card

- UI: nút “Xóa thẻ”
- `confirm(...)` trước khi xóa
- gọi `deleteCard(boardId, listId, card.id)` và `onClose()`

### 6.7. Edit Card Title (tên thẻ)

Vì bạn muốn “giống Trello”, title sửa được ngay trong modal:

- state:
  - `isEditingTitle`
  - `titleDraft`
- không edit: title + icon pencil (hover mới hiện)
- edit: `<input>` lớn
- commit/cancel:
  - Enter/blur → `updateCard(..., { title })`
  - Escape → cancel

### 6.8. Xử lý Escape “đúng UX”

Trong modal có nhiều chế độ edit nên Escape cần ưu tiên:

- đang edit title → Escape chỉ thoát edit title
- đang edit description → Escape chỉ thoát edit description
- nếu không edit → Escape đóng modal

---

## 7. Việc 4 — Fix hiển thị màu Labels đúng màu đã chọn

### 7.1. Vấn đề

Bạn chọn “Đỏ/Vàng/Xanh/Tím” nhưng UI hiển thị 1 màu chung → không phản ánh label.

### 7.2. Giải pháp: tách hằng số dùng chung

File: `src/features/kanban/constants.ts`

1. Tạo `LABEL_PRESETS` (key + tailwind class)
2. Tạo `getLabelClassName(labelKey)` để map key → class nền (fallback xám)

### 7.3. Áp dụng vào UI

- `CardModal.tsx`:
  - chip label hiển thị dùng `getLabelClassName(label)` → đúng màu
- `TaskCard.tsx`:
  - “thanh màu” dưới title dùng `getLabelClassName(label)` → đúng màu

---

## 8. Việc 5 — Rename List (đổi tên danh sách)

### 8.1. Store

- Thêm `updateList(boardId, listId, title)` ở:
  - `src/features/kanban/store/types.ts`
  - `src/features/kanban/store/slices/listSlice.ts`

Logic:

- find board → find list → `list.title = title.trim() || list.title`

### 8.2. UI

File: `src/features/kanban/components/List.tsx`

- icon edit đã có sẵn → thêm handler + chế độ edit:
  - state: `isEditingTitle`, `titleDraft`
  - click pencil → show `<input>`
  - Enter/blur commit, Escape cancel
  - sync `titleDraft` theo `list.title`

---

## 9. Việc 6 — Drag & Drop Card (đổi vị trí thẻ)

### 9.1. Mục tiêu

- Kéo thả đổi thứ tự card trong 1 list
- Kéo card qua list khác (thả vào list rỗng hoặc giữa list)

### 9.2. Store: thêm `moveCard`

File:

- `src/features/kanban/store/types.ts` (typing)
- `src/features/kanban/store/slices/cardSlice.ts` (implement)

Logic:

1. find board
2. find fromList/toList
3. splice lấy card ra khỏi fromList
4. splice insert vào toList (theo `overIndex` hoặc cuối)

### 9.3. UI wiring (DndContext + Sortable)

1. `src/pages/boards/BoardPage.tsx`
   - bọc lists bằng `<DndContext>`
   - sensor:
     - `PointerSensor` + `activationConstraint: { distance: 5 }`
   - viết helper `findCardLocation(cardId)` để tìm listId + index
   - `onDragEnd`:
     - nếu `over` là card → move vào index của card đó
     - nếu `over.id` là `list-drop:<listId>` → move vào cuối list
2. `src/features/kanban/components/List.tsx`
   - `useDroppable({ id: "list-drop:<listId>" })` để list rỗng vẫn thả được
   - bọc cards bằng `SortableContext` + `verticalListSortingStrategy`
3. `src/features/kanban/components/TaskCard.tsx`
   - `useSortable({ id: card.id })` + apply transform/transition
   - khi `isDragging` thì không mở modal (tránh click nhầm)

---

## 10. Việc 7 — Shared UI (`src/components/ui`)

Để dự án “đúng chuẩn” và dễ tái sử dụng, đóng gói UI dùng chung:

- `src/components/ui/Button.tsx`
- `src/components/ui/Input.tsx`
- `src/components/ui/Modal.tsx`

Nguyên tắc:

- component nhỏ, dễ dùng
- nhận `className` để override
- không nhét logic domain (kanban/auth) vào đây

---

## 11. Test plan (tự kiểm theo checklist)

### 11.1. Board

- Dashboard: bấm “Tạo Bảng Mới” → modal mở → tạo board OK
- BoardPage: click tiêu đề board → sửa → Enter/blur lưu
- Escape huỷ, tên không đổi

### 11.2. List

- Tạo list → bấm icon edit → sửa → Enter/blur lưu
- Escape huỷ

### 11.3. Card modal

- **Title**: hover → pencil hiện cạnh title → click → sửa → Enter/blur lưu; Escape huỷ edit, không đóng modal
- **Description**: edit → blur lưu; xoá hết → blur → description mất
- **Due date**: chọn ngày → persist; xoá ngày → persist
- **Labels**: toggle → persist; kiểm tra màu đúng
- **Delete**: xoá card → card biến mất khỏi list

### 11.4. Persist

- F5 → state còn (board/list/card/labels/dueDate/description)

### 11.5. Drag & Drop

- Trong 1 list: kéo 2 card đổi thứ tự OK
- Kéo qua list khác:
  - thả lên card khác → chèn đúng vị trí
  - thả vào list rỗng → vào cuối list

