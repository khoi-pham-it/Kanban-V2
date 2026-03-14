# Kiến trúc Component & Quản lý Trạng thái (Dành cho Dev Team)

Tài liệu này đóng vai trò là "bản đồ" giúp các lập trình viên mới nắm bắt nhanh chóng cách mã nguồn Trello Mini được tổ chức. Hiện tại, chúng ta đã hoàn thành 80% UI tĩnh. Nhiệm vụ tiếp theo của team là "thổi hồn" vào UI đó thông qua Logic Layer.

---

## 1. Cấu trúc Component (Component Tree)

Trello Mini sử dụng kiến trúc Component-Based của React. Mọi thứ được chia nhỏ và lồng vào nhau theo nguyên tắc **từ tổng quát đến chi tiết (Top-Down)**:

```text
App (Root)
 ├─ RouterProvider (React Router v6 Data Mode)
 │   └─ AuthProvider (Quản lý User State)
 │       └─ BoardProvider (Quản lý Trello Data State)
 │           └─ MainLayout (Bao gồm Sidebar & Header)
 │               └─ Outlet (Nơi render các Pages)
 │
 ├─ Pages
 │   ├─ LoginPage
 │   ├─ Dashboard (Hiển thị các BoardCard)
 │   └─ BoardDetail (Hiển thị chi tiết một Bảng)
 │
 └─ Features/Boards/Components (Domain UI)
     ├─ BoardCard (Thẻ đại diện cho 1 dự án ngoài Dashboard)
     ├─ List (Cột trạng thái: Todo, Doing, Done...)
     │   ├─ TaskCard (Thẻ công việc thực tế)
     │   └─ AddCardForm (Form nhập thẻ mới)
     ├─ AddListForm (Form thêm cột mới)
     └─ CardModal (Popup xem chi tiết thẻ)
```

**Nguyên tắc cốt lõi:** UI Component CHỈ làm nhiệm vụ hiển thị (Presentational). Tuyệt đối không viết logic xử lý dữ liệu phức tạp (như biến đổi mảng, gọi API, lưu local storage) trực tiếp bên trong các file UI (`List.tsx`, `TaskCard.tsx`). Tất cả logic phải được đẩy ra ngoài (Custom Hooks & Reducers).

---

## 2. Quản lý Trạng thái Toàn cục (Global State)

Thay vì truyền dữ liệu qua lại giữa hàng chục component (Prop Drilling), Trello Mini sử dụng **Context API** kết hợp với **useReducer** của React.

### 2.1. Tại sao lại là `useReducer`?
Dữ liệu của Board rất phức tạp (Mảng chứa Mảng: Bảng -> Cột -> Thẻ). Nếu dùng `useState`, việc cập nhật sâu (deep update) sẽ rất dễ gây lỗi và khó tái sử dụng.
`useReducer` cung cấp một hàm `dispatch(action)`. Bạn chỉ cần ném ra một "Chỉ thị" (Ví dụ: `ADD_CARD`), Reducer sẽ tự biết cách tìm đến đúng Cột và nhét Thẻ vào.

### 2.2. Auth Context (`AuthContext.tsx`)
- **State:** `{ user: User | null, isAuthenticated: boolean }`
- **Nhiệm vụ:** Bao bọc toàn bộ ứng dụng. Cung cấp thông tin xem người dùng hiện tại là ai. Nếu `isAuthenticated` là `false`, React Router sẽ tự động đá người dùng về trang `/login` (Protected Route).
- **Actions:** `LOGIN_SUCCESS`, `LOGOUT`.

### 2.3. Board Context (`BoardContext.tsx`)
- **State:** `{ boards: IBoard[], currentBoard: IBoard | null }`
- **Nhiệm vụ:** Lưu trữ toàn bộ dữ liệu Trello của người dùng.
- **Actions cần team implement:** 
  - `SET_BOARDS` (Load lần đầu từ Local Storage)
  - `CREATE_BOARD`, `DELETE_BOARD`
  - `ADD_LIST`, `RENAME_LIST`, `DELETE_LIST`
  - `ADD_CARD`, `UPDATE_CARD`, `DELETE_CARD`
  - `MOVE_CARD` (Quan trọng nhất: Dùng cho Drag & Drop)

---

## 3. Custom Hooks (Lớp Giao Tiếp - Interface)

Để các file UI không phải gọi `dispatch({ type: 'ADD_CARD', payload: ... })` một cách lằng nhằng và thô kệch, chúng ta tạo ra các Custom Hooks. Các hooks này đóng vai trò như một API nội bộ.

1. **`useAuth()`**: Cung cấp hàm `login(email, pass)`, `logout()`, `user`.
2. **`useBoards()`**: Cung cấp hàm `createBoard(title)`, `deleteBoard(id)`.
3. **`useCards()`**: Cung cấp hàm `addCard(listId, title)`, `deleteCard(cardId)`, `moveCard(activeId, overId)`.

**Ví dụ thực tế trong file `AddCardForm.tsx`:**
```tsx
// Team dev thay vì viết logic phức tạp, chỉ cần gọi hook:
const { addCard } = useCards();

const handleSubmit = () => {
    addCard(listId, title); // Code UI cực kỳ sạch sẽ!
}
```

---

## 4. Luồng Dữ Liệu (State Flow)

Hãy tưởng tượng luồng đi của dữ liệu như một dòng sông một chiều (One-way data flow). Để người mới dễ hình dung, đây là những gì xảy ra khi user tạo một Card mới:

1. **User Action:** Người dùng gõ "Học React" vào `AddCardForm` và nhấn Enter.
2. **Hook Execution:** `AddCardForm` gọi hàm `addCard(listId, "Học React")` từ `useCards()`.
3. **Dispatch Action:** Hàm `addCard` tạo ra một object `{ type: 'ADD_CARD', payload: { listId, card: mới } }` và truyền nó vào `dispatch()`.
4. **Reducer Process:** `boardReducer` nhận được Action. Nó clone lại State cũ, tìm đến đúng `listId`, nhét Card mới vào mảng `cards`, và trả về State mới.
5. **Re-render:** Context nhận thấy State mới thay đổi. React tự động cập nhật lại UI của component `List` tương ứng. Người dùng nhìn thấy thẻ xuất hiện ngay lập tức.

---

## 5. Tương tác với Local Storage (Persistence)

Vì chúng ta không có Backend Server, mọi thay đổi phải được lưu lại trình duyệt để F5 không bị mất dữ liệu.

**Cách triển khai chuẩn (Team cần lưu ý khi code):**
Tuyệt đối KHÔNG gọi `localStorage.setItem` rải rác khắp nơi trong UI hay Hooks. Hãy đặt nó ở một nơi duy nhất: **Bên trong `BoardProvider`**.

Sử dụng `useEffect` để lắng nghe sự thay đổi của State:

```tsx
// Bên trong BoardProvider.tsx
const [state, dispatch] = useReducer(boardReducer, initialState);

// Bất cứ khi nào 'state.boards' thay đổi (thêm thẻ, xóa cột, kéo thả...)
// Effect này sẽ tự động chạy và ghi đè xuống Local Storage
useEffect(() => {
    localStorage.setItem('trello_boards', JSON.stringify(state.boards));
}, [state.boards]);
```

Nhờ cơ chế này, quá trình lưu trữ trở nên "vô hình" (transparent) đối với UI. Dev team chỉ cần tập trung vào việc Dispatch Action thay đổi State, chuyện lưu trữ đã có Provider lo!