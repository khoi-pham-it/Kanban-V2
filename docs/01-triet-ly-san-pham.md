# Triết lý sản phẩm - Trello Mini

## 1. Trello Mini là gì?

**Trello Mini** là một ứng dụng quản lý công việc (Task Management) được xây dựng dựa trên mô hình bảng Kanban. Ứng dụng giúp người dùng, đội nhóm dễ dàng trực quan hóa quy trình làm việc, từ lúc bắt đầu ý tưởng cho đến khi hoàn thành, thông qua các thao tác kéo thả (Drag & Drop) trực quan.

## 2. Đối tượng mục tiêu

Trello Mini nhắm đến:
- **Cá nhân:** Những người muốn có một công cụ đơn giản để ghi chú công việc hàng ngày, lập kế hoạch học tập (Study Plan).
- **Nhóm nhỏ (Small Teams):** Các nhóm dự án sinh viên, các startup cần một nơi tập trung để phân chia nhiệm vụ và theo dõi tiến độ (Todo → Doing → Done) mà không cần cấu hình phức tạp.

## 3. Triết lý thiết kế (Design Philosophy)

Trello Mini được phát triển dựa trên 3 trụ cột chính:

### 3.1. Trực quan (Visual)
Mọi thông tin đều được bày ra trước mắt. Thay vì đọc những danh sách công việc dài dòng, người dùng nhìn thấy các "Thẻ" (Cards) nằm trong các "Cột" (Lists). Vị trí của thẻ phản ánh chính xác trạng thái hiện tại của công việc đó.

### 3.2. Linh hoạt (Flexible)
Hệ thống không ép buộc người dùng phải tuân theo một quy trình cố định. 
- Người dùng có thể tạo một bảng `Todo > Doing > Done` truyền thống.
- Hoặc tạo một bảng `Ideas > To Write > Editing > Published` cho việc viết lách.
Mọi thứ đều do người dùng tự định nghĩa.

### 3.3. Tương tác tức thì (Reactivity)
Khi một thành viên trong đội di chuyển một thẻ công việc, hoặc chỉnh sửa mô tả, giao diện phải phản hồi lại ngay lập tức (Instant Feedback) mà không cần phải tải lại trang (No page reloads). Đây là lý do ứng dụng được xây dựng theo kiến trúc **Single Page Application (SPA)** với **React**.

## 4. Mô hình dữ liệu cốt lõi

Hiểu về Trello Mini là hiểu về mô hình phân cấp 3 tầng sau:

1. **Board (Bảng):** Đại diện cho một dự án lớn hoặc một mục tiêu tổng thể (VD: "Phát triển Website Trello Mini").
2. **List (Danh sách/Cột):** Nằm trong Board, đại diện cho một trạng thái của quy trình làm việc hoặc một hạng mục phân loại (VD: "Đang làm", "Hoàn thành").
3. **Card (Thẻ):** Nằm trong List, là đơn vị công việc nhỏ nhất. Mỗi Card chứa tiêu đề nhiệm vụ, mô tả chi tiết, nhãn (labels), và có thể di chuyển tự do giữa các List.

## 5. Tại sao không có Backend? (Giai đoạn hiện tại)

Ở phiên bản hiện tại, Trello Mini ưu tiên sự độc lập và tốc độ triển khai. Chúng ta mô phỏng (fake) quá trình xác thực và lưu trữ toàn bộ dữ liệu vào **Local Storage** của trình duyệt. Điều này giúp:
- Triển khai ứng dụng ở bất kỳ đâu (Github Pages, Vercel) chỉ với các file tĩnh.
- Đảm bảo ứng dụng chạy cực nhanh vì không có độ trễ mạng (Network Latency) khi giao tiếp với Server.
- Buộc đội ngũ phát triển (Dev Team) phải tập trung tối đa vào việc tối ưu hóa luồng State (State Flow) và trải nghiệm UI/UX ở phía Client-side trước khi tính đến việc scale lên Backend thực tế.