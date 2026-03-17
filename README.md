Ứng dụng mô phỏng một phần của Trello bằng React.

---

# 1. Tên đề tài

**Trello Mini – Kanban Task Management System**

Mô tả:

> Một ứng dụng quản lý công việc theo mô hình Kanban cho phép người dùng tạo board, list và card. Các thao tác kéo thả, cập nhật trạng thái được xử lý hoàn toàn ở phía client bằng React.

---

# 2. Bài toán hệ thống giải quyết

Trong các nhóm làm việc cần:

* quản lý task
* theo dõi tiến độ
* phân chia công việc

Mô hình Kanban phổ biến:

```
Todo → Doing → Done
```

Ứng dụng cho phép quản lý workflow này.

---

# 3. Chức năng chính của hệ thống

## 3.1 Authentication

Trang đăng nhập đơn giản.

Chức năng:

```
login
logout
protected routes
```

Không cần backend phức tạp (có thể fake auth).

---

# 3.2 Board Dashboard

Trang hiển thị danh sách board.

Ví dụ:

```
Project Web
Mobile App
Study Plan
```

Chức năng:

```
create board
delete board
open board
```

---

# 3.3 Kanban Board

Mỗi board gồm nhiều list.

Ví dụ:

```
Todo
Doing
Done
```

Chức năng:

```
create list
delete list
rename list
```

---

# 3.4 Card Management

Mỗi list chứa nhiều card.

Card đại diện cho task.

Ví dụ:

```
Design login UI
Implement API
Fix bug
```

Chức năng:

```
add card
edit card
delete card
```

---

# 3.5 Drag and Drop

User có thể kéo card giữa các list.

Ví dụ:

```
Todo → Doing
Doing → Done
```

Có thể dùng:

* dnd-kit

Hoặc thư viện tương tự.

---

# 4. Routing Architecture

Routing được xử lý bằng
React Router.

## Routes

```
/login
/boards
/boards/:boardId
/settings
```

---

## Protected Routes

Các route sau cần login:

```
/boards
/boards/:boardId
/settings
```

Component:

```
ProtectedRoute
```

Logic:

```
if (!isAuthenticated) redirect("/login")
```

---

# 5. Cấu trúc Thư mục (Feature-Sliced Design)

Dự án áp dụng mô hình Feature-Sliced Design giúp dự án cực kỳ dễ mở rộng.

```
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

---

# 6. System Architecture (đưa vào báo cáo)

```
                  React Router
                       │
          ┌────────────┴────────────┐
          │                         │
     Zustand Store             Zustand Store
     (auth state)              (board state)
          │                         │
          └────────────┬────────────┘
                       │
                  Custom Hooks
           (useAuth, useBoardStore)
                       │
                       │
                Application Pages
       ┌───────────────┼───────────────┐
       │               │               │
    LoginPage      Dashboard        BoardPage
                       │
                  Kanban Board
              ┌────────┼────────┐
              │        │        │
            List     List     List
              │
            Cards
```

---

# 7. Global State Design

State được quản lý bằng:

```
Zustand + Immer + Persist Middleware
```

---

## Auth State

```
{
  user: null,
  isAuthenticated: false,
  loading: false
}
```

Actions:

```
LOGIN_SUCCESS
LOGOUT
```

---

## Board State

```
{
  boards: [],
  currentBoard: null
}
```

Ví dụ board:

```
{
 id: "board1",
 title: "Project A",
 lists: [
   {
     id: "list1",
     title: "Todo",
     cards: []
   }
 ]
}
```

---

# 8. Zustand Actions (Slices)

Ví dụ action trong Zustand cho board (sử dụng Immer để cập nhật immutable):

```
addBoard
deleteBoard
addList
deleteList
addCard
deleteCard
```

---

# 9. State Flow (rất quan trọng cho báo cáo)

## Thêm card

```
User nhập card title
        │
        ▼
AddCardForm
        │
        ▼
useBoardStore.getState().addCard()
        │
        ▼
Zustand Store cập nhật (thông qua Immer)
        │
        ▼
state mới
        │
        ▼
React re-render List
```

---

## Drag card

```
User kéo card
      │
      ▼
Drag event
      │
      ▼
useBoardStore.getState().moveCard() (Tương lai)
      │
      ▼
Zustand Store cập nhật list
      │
      ▼
Board re-render
```

---

# 10. Custom Hooks & Store

## useAuth

Quản lý authentication.

Functions:

```
login()
logout()
checkAuth()
```

---

## useBoardStore

Quản lý toàn bộ state liên quan tới boards, lists và cards, tách biệt bằng Slice Pattern.

Functions (Actions):

```
addBoard()
deleteBoard()
addList()
deleteList()
addCard()
deleteCard()
```

---

# 11. Lazy Loading (yêu cầu của giảng viên)

Pages được lazy load:

```
LoginPage
DashboardPage
BoardPage
SettingsPage
```

Dùng:

```
React.lazy()
```

---

# 12. Vì sao React phù hợp với ứng dụng này

Ứng dụng Kanban cần:

```
UI dynamic
nested components
state management
```

React phù hợp vì:

### Component-based architecture

Kanban board:

```
Board
 └ List
     └ Card
```

---

### State-driven rendering

```
state change → UI update
```

---

### Hooks

Logic được tái sử dụng qua:

```
useBoards
useCards
```

---

# 13. Feature nâng cao giúp đạt điểm cao

## Card detail modal

Click card → mở modal.

Thông tin:

```
description
due date
labels
```

---

## Search card

Tìm task theo keyword.

---

## Local storage persistence

Lưu board vào browser.

---

Chào bạn, dự án "Trello Mini" là một lựa chọn cực kỳ xuất sắc và "chuẩn bài" cho môn học "Các công nghệ lập trình hiện đại". Mô hình Kanban bộc lộ rõ nhất sức mạnh của React: khả năng chia nhỏ Component, luồng dữ liệu một chiều (One-way data binding), và việc UI tự động phản ứng lại khi State thay đổi (Reactivity) mà không cần can thiệp trực tiếp vào DOM.

Bạn đã chọn một stack rất hiện đại: **React (TypeScript) + React Router v6.4 (Data Mode) + Dnd-Kit**. Điều này chứng tỏ bạn đang cập nhật công nghệ rất tốt.

Để giúp team của bạn thoát khỏi sự mơ hồ và có một tài liệu (Docs) chuyên nghiệp, mình sẽ giúp bạn cấu trúc lại và phân tích sâu hơn những điểm cốt lõi, đặc biệt nhấn mạnh vào **"Tại sao lại là React?"** để thuyết phục giảng viên.

Dưới đây là các phần quan trọng bạn nên đưa vào tài liệu dự án:

---

### 1. Phân tích: Tại sao lại chọn React cho bài toán Kanban? (Phần "ăn điểm" với giảng viên)

Trong phần báo cáo, bạn đừng chỉ liệt kê tính năng. Hãy chứng minh sự lựa chọn công nghệ là có cơ sở bằng cách so sánh với các lựa chọn khác.

* **Tại sao lại sử dụng Zustand thay vì Context API + useReducer?**
* Quản lý State bằng Context API và `useReducer` cho các state phức tạp (như mảng lồng mảng) thường đòi hỏi nhiều boilerplate code (định nghĩa actions, action types, switch-case trong reducer) và có rủi ro lớn về hiệu năng (khi Context thay đổi, tất cả component tiêu thụ nó đều bị re-render nếu không memoize cẩn thận).
* Zustand cực kỳ nhẹ, không cần bọc app trong nhiều Provider (như `BoardProvider` hay `AuthProvider`), tự động xử lý re-render thông minh hơn thông qua các hooks chọn lọc (selector), kết hợp cực tốt với `immer` giúp viết logic thay đổi State dễ dàng như state khả biến (mutable) nhưng bản chất vẫn là bất biến (immutable). Thêm vào đó, Zustand hỗ trợ middleware `persist` lưu trực tiếp state vào `localStorage` mà không cần viết các `useEffect` phức tạp.

* **Tại sao không dùng Vanilla JS (JS thuần) hoặc jQuery?**
* *Bài toán Kanban:* Kéo thả một Card từ List A sang List B đòi hỏi phải cập nhật lại UI của cả hai List, tính toán lại vị trí các Card còn lại, và cập nhật lại mảng dữ liệu gốc.
* *Vanilla JS/jQuery:* Bạn sẽ phải viết code trực tiếp tìm DOM node (vd: `document.getElementById`), gỡ bỏ node đó khỏi List A, chèn (append) node đó vào List B. Khi ứng dụng lớn lên, việc đồng bộ giữa UI (DOM) và Dữ liệu (JS Object) trở thành một cơn ác mộng (Spaghetti code).
* *Sức mạnh của React:* React sử dụng **Virtual DOM** và **State-Driven UI**. Bạn KHÔNG BAO GIỜ chạm vào DOM. Bạn chỉ cần cập nhật State (mảng dữ liệu chứa các Card), React sẽ tự động đối chiếu Virtual DOM và quyết định cách render lại UI một cách tối ưu nhất.


* **Tại sao dùng TypeScript thay vì JavaScript thuần?**
* Cấu trúc dữ liệu của Board rất phức tạp (Board chứa Array các List, mỗi List chứa Array các Card). TypeScript giúp định nghĩa rõ ràng các Interface (`IBoard`, `IList`, `ICard`), ngăn chặn từ trong trứng nước các lỗi như truy cập `card.title` nhưng card lại bị `undefined`.


* **Tại sao dùng React Router (Data Mode) thay vì Declarative Mode cũ?**
* Data Mode (với `createBrowserRouter`, `loader`, `action`) cho phép tách biệt hoàn toàn logic lấy dữ liệu (fetching) ra khỏi Component. Khi vào route `/boards/:boardId`, dữ liệu của board đó đã được `loader` chuẩn bị sẵn trước khi component render, loại bỏ hoàn toàn các `useEffect` lằng nhằng và hiện tượng màn hình chớp giật (waterfall) lúc tải trang.



---

### 2. Thiết kế Cấu trúc Dữ liệu (Data Modeling)

Việc thiết kế sai State từ đầu sẽ khiến logic kéo thả (Drag & Drop) trở nên cực kỳ khó code. Dưới đây là cấu trúc TypeScript chuẩn mực (bạn nên đưa vào phần Type/Interface của dự án):

```typescript
// types/index.ts

export type Id = string | number;

export interface ICard {
  id: Id;
  title: string;
  description?: string;
  createdAt: string; // ISO date string
}

export interface IList {
  id: Id;
  title: string;
  cards: ICard[]; 
}

export interface IBoard {
  id: Id;
  title: string;
  lists: IList[]; // Lưu ý: List chứa mảng Card bên trong
}

```

**Mẹo xử lý Dnd-Kit:** Khi kéo thả, bạn sẽ phải xử lý 2 trường hợp chính:

1. **Kéo Card trong cùng một List (Reorder):** Chỉ cần hoán đổi vị trí 2 phần tử trong mảng `cards` của List đó.
2. **Kéo Card từ List này sang List khác:** Phải xóa Card khỏi mảng `cards` của List nguồn và thêm (insert) Card đó vào mảng `cards` của List đích tại vị trí index mới.

---

### 3. Kiến trúc Thư mục (Folder Structure) đề xuất

Để dự án nhìn chuyên nghiệp và dễ quản lý, bạn nên chia thư mục theo hướng Feature-Sliced Design (FSD):

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

---

### 4. Luồng hoạt động của React Router (Data Mode) cho Trello Mini

Vì bạn chọn Data Mode, bạn phải chỉ rõ cách thức hoạt động này trong báo cáo.

**Ví dụ quy trình khi User vào trang chi tiết của một Board (`/boards/123`):**

1. **User click URL:** `/boards/123`
2. **Router can thiệp:** React Router chặn việc render giao diện lại. Nó nhìn vào định nghĩa route và thấy có hàm `boardLoader({ params })`.
3. **Data Fetching (Loader):** Hàm `boardLoader` chạy, lấy `params.boardId` (là "123"). Do bạn dùng Local Storage (không có backend), hàm loader sẽ đọc dữ liệu từ Local Storage: `const board = JSON.parse(localStorage.getItem('boards')).find(b => b.id === '123')`.
4. **Data Ready:** Hàm loader trả về dữ liệu `board`.
5. **Render UI:** Lúc này component `BoardPage` mới được mount. Bên trong `BoardPage`, bạn chỉ cần gọi hook `const board = useLoaderData() as IBoard;` để nhận dữ liệu nguyên vẹn và hiển thị ngay lập tức, hoàn toàn không cần `useState` hay `useEffect` để quản lý trạng thái loading.

---

### 5. Kế hoạch triển khai (Roadmap) cho Team

Để team không bị mơ hồ, hãy chia dự án thành các Sprint (giai đoạn) nhỏ:

* **Sprint 1 (Nền tảng):** Setup Vite + React + TS. Cài đặt React Router (tạo các trang cơ bản Login, Dashboard trống). Xây dựng cấu trúc TypeScript Interfaces.
* **Sprint 2 (Static UI):** Tạm thời hard-code dữ liệu (fake data). Dựng giao diện tĩnh cho Dashboard và trang Board Detail (vẽ các List và Card lên màn hình).
* **Sprint 3 (State & LocalStorage):** Tích hợp Zustand với middlewares (`immer`, `persist`). Viết các actions thêm, sửa, xóa Board/List/Card thông qua Slice Pattern và cấu hình tự động lưu xuống LocalStorage. Đảm bảo F5 trang không mất dữ liệu.
* **Sprint 4 (Sát thủ - Dnd-Kit):** Áp dụng thư viện `dnd-kit`. Đây là phần khó nhất. Tập trung làm tính năng kéo thả List (theo chiều ngang) trước, sau đó làm tính năng kéo thả Card (giữa các List) sau.
* **Sprint 5 (Hoàn thiện):** Lazy loading các trang, thêm Modal xem chi tiết Card, làm trang Login giả lập. Viết báo cáo.

---

Trang Đăng Nhập: [Form Login]

Trang Dashboard: [Navbar] -> [Tiêu đề] -> [Lưới các Board]

Trang Kanban: [Navbar] -> [Tên Board] -> [Khu vực Kéo Thả (Các cột)] -> [Popup Chi tiết Thẻ]
