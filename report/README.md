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

# 5. System Architecture (đưa vào báo cáo)

```
                  React Router
                       │
          ┌────────────┴────────────┐
          │                         │
      Auth Context             Board Context
      (user state)             (boards state)
          │                         │
          └────────────┬────────────┘
                       │
                  Custom Hooks
           (useAuth, useBoards, useCards)
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

# 6. Component Tree (rất tốt để đưa vào báo cáo)

```
App
 ├ Router
 │
 ├ AuthProvider
 │
 ├ BoardProvider
 │
 ├ Layout
 │
 ├ Pages
 │   ├ LoginPage
 │   ├ DashboardPage
 │   └ BoardPage
 │
 └ Components
     ├ Board
     ├ List
     ├ Card
     ├ AddCardForm
     ├ AddListForm
```

---

# 7. Global State Design

State được quản lý bằng:

```
Context API + useReducer
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

# 8. Reducer Actions

Ví dụ reducer cho board.

```
CREATE_BOARD
DELETE_BOARD
ADD_LIST
DELETE_LIST
ADD_CARD
MOVE_CARD
DELETE_CARD
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
dispatch(ADD_CARD)
        │
        ▼
boardReducer
        │
        ▼
state cập nhật
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
dispatch(MOVE_CARD)
      │
      ▼
Reducer cập nhật list
      │
      ▼
Board re-render
```

---

# 10. Custom Hooks (bắt buộc)

## useAuth

Quản lý authentication.

Functions:

```
login()
logout()
checkAuth()
```

---

## useBoards

Quản lý board.

Functions:

```
createBoard()
deleteBoard()
getBoards()
```

---

## useCards

Quản lý card.

Functions:

```
addCard()
moveCard()
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
