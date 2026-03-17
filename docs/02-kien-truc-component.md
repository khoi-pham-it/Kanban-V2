# Kiến trúc Component & Quản lý Trạng thái (Dành cho Dev Team)

Tài liệu này đóng vai trò là "bản đồ" giúp các lập trình viên mới nắm bắt nhanh chóng cách mã nguồn Trello Mini được tổ chức. Hiện tại, chúng ta đã hoàn thành 80% UI tĩnh. Nhiệm vụ tiếp theo của team là "thổi hồn" vào UI đó thông qua Logic Layer.

---

## 1. Cấu trúc Folder và Component (Feature-Sliced Design)

Trello Mini sử dụng kiến trúc Feature-Sliced Design (FSD) mở rộng. Kiến trúc này giúp dự án cực kỳ dễ mở rộng (scalable) bằng cách tách bạch các lớp và đóng gói theo từng domain (lĩnh vực) nghiệp vụ.

```text
src/
├── app/               # Tầng khởi tạo ứng dụng (Router, Global styles)
│   ├── App.tsx
│   └── router.tsx
│
├── components/        # Tầng UI dùng chung toàn ứng dụng (Dumb components)
│   ├── layout/        # Layouts như Header, Sidebar, MainLayout
│   └── ui/            # UI Components (Buttons, Modals...)
│
├── features/          # Tầng tính năng cốt lõi (Domain logic)
│   ├── auth/          # Tính năng đăng nhập
│   └── kanban/        # Tính năng Kanban chính
│       ├── components/  # List, TaskCard, BoardCard, AddCardForm...
│       ├── store/       # Zustand slices chuyên biệt (boardSlice, listSlice...)
│       └── types/       # Interfaces cho IBoard, IList, ICard
│
└── pages/             # Tầng Route hiển thị màn hình (gọi các features lại với nhau)
    ├── auth/
    │   └── LoginPage.tsx
    └── boards/
        ├── DashboardPage.tsx
        └── BoardPage.tsx
```

**Nguyên tắc cốt lõi:** UI Component CHỈ làm nhiệm vụ hiển thị (Presentational). Tuyệt đối không viết logic xử lý dữ liệu phức tạp (như biến đổi mảng, cấu hình local storage) trực tiếp bên trong các file UI (`List.tsx`, `TaskCard.tsx`). Tất cả logic nghiệp vụ phải được đẩy ra ngoài tầng `store` của feature đó.

---

## 2. Quản lý Trạng thái Toàn cục (Global State với Zustand)

Thay vì truyền dữ liệu qua lại giữa hàng chục component (Prop Drilling), Trello Mini sử dụng **Zustand** kết hợp với **Immer**.

### 2.1. Tại sao lại là `Zustand` thay vì `Context API`?
Quản lý State bằng Context API và `useReducer` cho các state phức tạp (như mảng lồng mảng) thường đòi hỏi nhiều boilerplate code và có rủi ro lớn về hiệu năng do re-render dây chuyền.
Zustand cực kỳ nhẹ, không cần bọc app trong nhiều Provider, kết hợp cực tốt với `immer` giúp viết logic thay đổi State dễ dàng như state khả biến (mutable) nhưng bản chất vẫn là bất biến (immutable). Thêm vào đó, Zustand hỗ trợ middleware `persist` tự động lưu state vào `localStorage`.

### 2.2. Slice Pattern (`store/slices/`)
- Mảng dữ liệu Kanban được chia thành các file slice nhỏ: `boardSlice`, `listSlice`, `cardSlice`.
- **Nhiệm vụ:** Các actions (hàm xử lý) chỉ tập trung vào một nhóm chức năng cụ thể:
  - `boardSlice`: `addBoard`, `deleteBoard`
  - `listSlice`: `addList`, `deleteList`
  - `cardSlice`: `addCard`, `deleteCard`

---

## 3. Custom Hooks (Lớp Giao Tiếp - Interface)

Để các file UI dễ dàng truy xuất dữ liệu từ store, chúng ta sử dụng custom hook tạo ra từ Zustand.

**Ví dụ thực tế trong file `AddCardForm.tsx`:**
```tsx
// Lấy duy nhất hàm addCard từ store (tránh re-render không cần thiết)
const addCard = useBoardStore((state) => state.addCard);

const handleSubmit = () => {
    addCard(boardId, listId, title); // Code UI cực kỳ sạch sẽ!
}
```

---

## 4. Luồng Dữ Liệu (State Flow)

Hãy tưởng tượng luồng đi của dữ liệu như một dòng sông một chiều (One-way data flow). Để người mới dễ hình dung, đây là những gì xảy ra khi user tạo một Card mới:

1. **User Action:** Người dùng gõ "Học React" vào `AddCardForm` và nhấn Enter.
2. **Hook Execution:** Component lấy action `addCard` từ store thông qua selector `useBoardStore(state => state.addCard)`.
3. **State Mutation (Immer):** Hàm `addCard` chạy, Immer cho phép sửa trực tiếp mảng `list.cards.push(newCard)` nhưng tự động tạo ra một bản sao immutable ở phía dưới.
4. **Zustand Store cập nhật:** State mới được lưu vào bộ nhớ trung tâm.
5. **Re-render:** Chỉ các component nào subscribe đúng vào phần state bị thay đổi (nhờ selector) mới tiến hành re-render lại Virtual DOM.

---

## 5. Tương tác với Local Storage (Persistence)

Vì chúng ta không có Backend Server, mọi thay đổi phải được lưu lại trình duyệt để F5 không bị mất dữ liệu.

**Cách triển khai chuẩn:**
Nhóm không tự viết `useEffect` để bắt sự kiện vì kém hiệu quả. Thay vào đó, chúng ta cấu hình **Persist Middleware** của Zustand khi khởi tạo store.

```tsx
// Bên trong store/useBoardStore.ts
export const useBoardStore = create<StoreState>()(
  persist(
    immer((...a) => ({
      ...createBoardSlice(...a),
      ...createListSlice(...a),
      ...createCardSlice(...a),
    })),
    { name: "trello-storage" }, // Tự động lưu và load từ LocalStorage với key này!
  ),
);
```

Nhờ cơ chế này, quá trình lưu trữ trở nên "vô hình" (transparent) đối với UI. Mọi thao tác đều tự động đồng bộ siêu tốc và an toàn.