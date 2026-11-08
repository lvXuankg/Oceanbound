# Định dạng nội dung

Các file `.js` chỉ bọc dữ liệu JSON trong phép gán để `main.html` chạy cả khi mở trực tiếp bằng `file://`, tránh giới hạn fetch JSON cục bộ. Không cần bundler hoặc server. Dùng UTF-8.

Giữ hai dòng khởi tạo và phép gán theo mẫu:

```js
window.OCEANBOUND = window.OCEANBOUND || {};
window.OCEANBOUND.tasks = [
  {
    "id": "ma-cong-viec",
    "title": "Tên công việc do bạn bổ sung",
    "description": "Mô tả nội dung và trạng thái thực tế.",
    "category": "Nhóm công việc",
    "status": "planned",
    "milestone": "ma-chang-da-tao",
    "tags": [],
    "evidence": [],
    "assetIds": []
  }
];
```

## Các file

| File | Trường bắt buộc | Vai trò |
| --- | --- | --- |
| `project.js` | `name`, `snapshotDate` (YYYY-MM-DD hoặc chuỗi rỗng khi chưa ghi nhận), `engine` (có thể để trống), `phase`, `description`, `scopeNote` | Ngày snapshot và thông tin chung |
| `journey.js` | Mảng gồm `id`, `title`, `status`, `description`, `evidence` | Luồng các chặng; thứ tự mảng là thứ tự hiển thị |
| `tasks.js` | Mảng gồm `id`, `title`, `description`, `category`, `status`, `milestone`, `tags`, `evidence`, `assetIds` | Todo; `milestone` trỏ tới ID của chặng |
| `assets.js` | Mảng gồm `id`, `title`, `type`, `status`, `description`, `preview`, `previewAlt`, `note`, `tags`, `files` | Thẻ tài nguyên; `files` chứa `{ "source": "Game/...", "copy": "context/game/..." }` |
| `design.js` | Mảng gồm `id`, `number`, `title`, `parent`, `content`; tùy chọn `sources` | Cây tài liệu thiết kế trong `design.html`; không tính vào tiến độ |

ID dùng chữ thường, số và dấu `-`, duy nhất trong mỗi mảng. `assetIds` trỏ tới các ID trong `assets.js`. `evidence` là mảng đường dẫn từ root repo và phải có bản sao được khai báo trong `context/manifest.json`. `done` bắt buộc có bằng chứng.

## Trạng thái

| Giá trị | Hiển thị | Cách dùng |
| --- | --- | --- |
| `done` | Đã có | Mô tả đã được xác minh từ bằng chứng; có thể chỉ là template hoặc cấu hình |
| `active` | Đang làm | Đang thực hiện, mô tả kết quả tạm và phần còn thiếu |
| `planned` | Chờ làm | Chưa thực hiện; ghi rõ nếu mới là đề xuất |
| `blocked` | Bị chặn | Ghi điều kiện cần giải quyết trong description |

## Thêm tài nguyên

1. Copy ảnh vào `images/` hoặc bản sao file game vào `context/game/`. Với nguồn game mới, thêm đường dẫn vào `SOURCES` của `scripts/snapshot.py`, chạy script để copy và ghi hash.
2. Thêm object vào `assets.js`; `preview` trỏ tương đối từ `main.html`. Dùng ảnh thật khi có; không nhận hình minh họa là ảnh gameplay.
3. Liên kết task qua `assetIds`, thêm nguồn vào `evidence` nếu chứng minh cho trạng thái.
4. Cập nhật ngày, project knowledge và chạy validator. Số đếm, danh sách, bộ lọc và popup được dựng tự động.

Tìm kiếm bỏ dấu tiếng Việt, áp dụng cho cả task và tài nguyên. Bộ lọc trạng thái chỉ áp dụng cho todo. Click dòng todo hoặc nút tài nguyên để mở chi tiết; file trong popup là bản sao tải về để tham chiếu.

Không dùng đường dẫn tuyệt đối, URL ngoài, `..` hay mã HTML trong nội dung. Ngoại lệ cho nguồn tham khảo GDD: khai báo URL ngoài qua trường `sources` bên dưới. Renderer chèn text an toàn bằng `textContent`. Nếu cần mở rộng định dạng, cập nhật renderer, validator và tài liệu này cùng nhau.

## Bổ sung tài liệu thiết kế

Mở `design.html` để đọc khung đủ 14 chương và các mục con. Sửa `data/design.js` để thêm nội dung; mỗi chuỗi trong `content` là một đoạn văn bản thuần. Ví dụ cấu trúc (không phải nội dung game đã xác nhận):

```json
{
  "id": "food",
  "number": "05_01_01",
  "title": "Thức ăn",
  "parent": "resources",
  "content": []
}
```

Thay `[]` bằng `["Đoạn nội dung của bạn", "Đoạn tiếp theo"]` rồi tải lại trang. Không có trình sửa/lưu trực tiếp trên trang. Giữ `id` để các bookmark còn hoạt động; `parent: null` là chương gốc, còn lại trỏ tới ID mục cha. Mục cha phải nằm trước mục con. Mảng xác định thứ tự trong cùng nhóm. Không có nội dung thì giữ `content: []`; khung chờ bổ sung không phải task, roadmap hoặc bằng chứng tính năng đã làm. Khi chỉ sửa khung tài liệu, không đổi ngày snapshot tiến trình.

Mỗi mục có thể thêm `sources: [{ "label": "Nguồn YouTube", "url": "https://www.youtube.com/watch?v=i0gJ8he9opA" }]`. Chỉ dùng URL HTTPS không chứa thông tin đăng nhập, khoảng trắng hoặc dấu gạch chéo ngược. Renderer mở nguồn trong tab mới; không nhúng video hoặc tải nguồn tự động. `sources` có thể bỏ qua hoặc để `[]`; nguồn do người dùng chọn không tự chứng minh nội dung video đã được đối chiếu. Các đoạn `content` vẫn là văn bản thuần; dùng `\n` khi cần xuống dòng.
