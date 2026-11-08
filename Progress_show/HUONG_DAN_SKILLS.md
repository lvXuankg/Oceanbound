# Hướng dẫn sử dụng hai skill

Tài liệu này hướng dẫn cách yêu cầu AI sử dụng hai skill đi kèm `Progress_show/`. Các mẫu câu lệnh dưới đây chỉ là hướng dẫn; chúng không tự thêm dữ liệu vào trang.

**Bản show hiện để trống.** Chỉ bổ sung nội dung, nguồn và trạng thái do bạn cung cấp hoặc chọn để đối chiếu. Không tự tạo tiến trình, todo hay roadmap từ cấu trúc game.

## 1. Chọn đúng skill

| Bạn muốn làm gì? | Skill sử dụng | Kết quả |
| --- | --- | --- |
| Giải thích một quá trình: đầu vào, từng bước xử lý, kết quả và nhánh lỗi | [project-infographic](skills/project-infographic/SKILL.md) | Brief và infographic HTML/CSS/SVG có thể chỉnh sửa |
| Thêm hoặc sửa công việc, trạng thái, chặng và tài nguyên trên trang | [progress-show-update](skills/progress-show-update/SKILL.md) | Cập nhật các file `data/` và context liên quan |
| Vừa giải thích luồng, vừa cập nhật bản show | Dùng cả hai, với cùng nguồn và phạm vi | Infographic và dữ liệu trình bày nhất quán |

`project-infographic` tập trung diễn giải cơ chế hoặc quy trình. `progress-show-update` đưa thông tin đã được xác định vào trang tiến trình. Chỉ cập nhật một task thì dùng skill thứ hai là đủ.

## 2. Cách gọi skill trong repo này

Hai skill đang được lưu cục bộ trong `Progress_show/skills/`. Bạn có thể yêu cầu AI đọc đúng file `SKILL.md` bằng đường dẫn; không cần cài thêm để sử dụng theo cách này.

Mở chat với workspace Oceanbound rồi gửi một trong các mẫu bên dưới. Thay các phần trong dấu `[...]` bằng thông tin của bạn. Các đường dẫn trong mẫu tính từ root repo Oceanbound.

## 3. Dùng project-infographic để tạo luồng diễn giải

### Chuẩn bị

Cung cấp quá trình cần giải thích, người xem và nguồn được phép sử dụng. Nếu có, ghi thêm đầu vào, các bước xử lý, điểm quyết định, kết quả và điều xảy ra khi thất bại. Phần chưa rõ có thể để trống và nói rõ cần hỏi lại.

### Mẫu tạo mới

```text
Đọc và áp dụng Progress_show/skills/project-infographic/SKILL.md.

Tạo infographic giải thích: [tên quá trình].
Người xem: [đối tượng].
Nguồn được dùng: [đường dẫn file hoặc nội dung tôi cung cấp].
Luồng đã xác nhận: [đầu vào → các bước → kết quả].
Điểm quyết định/nhánh lỗi: [mô tả nếu có].
Phần chưa rõ: [liệt kê nếu có].

Lưu brief, bản HTML/CSS/SVG và spec trong Progress_show/diagrams/.
Đọc các reference mà skill yêu cầu. Phân biệt phần đã triển khai,
phần dự định và phần còn thiếu; không tự bịa cơ chế.
Nếu thiếu thông tin cốt lõi thì hỏi tôi trước khi vẽ.
Chỉ tạo infographic, giữ nguyên dữ liệu tiến trình và khung main.html.
```

### Mẫu cập nhật luồng đã có

```text
Đọc Progress_show/skills/project-infographic/SKILL.md.
Cập nhật infographic tại [đường dẫn HTML và brief/spec hiện có].
Thay đổi lần này: [mô tả].
Nguồn xác nhận: [file hoặc nội dung mới].
Giữ các phần ngoài phạm vi thay đổi, cập nhật brief/spec trước,
rồi kiểm tra lại bản HTML trong trình duyệt.
```

### Nhận lại những gì?

- **Brief:** giải thích mục đích, nguồn, nội dung và bố cục của luồng.
- **HTML/CSS/SVG:** bản diễn giải chính, đọc và chỉnh được trong trình duyệt.
- **Spec:** ghi các thành phần, liên kết và quy tắc để cập nhật lần sau.
- **Kết quả kiểm tra:** phần nào đã xác minh, phần nào vẫn thiếu dữ liệu. PNG chỉ cần khi bạn yêu cầu hoặc cần ảnh xem trước.

Skill upstream có nhắc đến các skill/tích hợp khác; chúng chưa được cài chỉ vì được nhắc tên. Nếu môi trường thiếu khả năng cần thiết, AI cần nêu rõ giới hạn và dùng tài liệu context cục bộ khi phù hợp.

Infographic được tạo riêng sẽ **chưa tự xuất hiện trong `main.html`**. Khi muốn hiển thị tại trang chính, yêu cầu thêm liên kết hoặc khung nhúng ở vị trí cụ thể. Khung hiện tại không có bộ nhập infographic tự động.

## 4. Dùng progress-show-update để cập nhật trang

### Chuẩn bị

Cung cấp tên nội dung, mô tả thực tế, trạng thái và nguồn được phép copy. Với công việc, chỉ rõ chặng muốn đặt vào; với tài nguyên, cung cấp thêm ảnh xem trước nếu có. Nếu chưa có chặng, bạn có thể yêu cầu tạo chặng theo tên bạn chọn.

| Trạng thái | Ý nghĩa |
| --- | --- |
| `done` | Đã có bằng chứng cho nội dung được mô tả |
| `active` | Đang thực hiện |
| `planned` | Chưa thực hiện |
| `blocked` | Đang bị cản trở; cần mô tả nguyên nhân |

### Mẫu thêm nội dung

```text
Đọc và áp dụng Progress_show/skills/progress-show-update/SKILL.md.

Chỉ bổ sung nội dung sau vào bản show:
- Tên công việc/tài nguyên: [tên].
- Mô tả thực tế: [nội dung].
- Trạng thái: [done / active / planned / blocked].
- Chặng: [tên hoặc ID; tạo mới theo tên này nếu tôi yêu cầu].
- Nguồn được phép đối chiếu/copy: [đường dẫn cụ thể trong Game/].
- Ảnh xem trước: [đường dẫn nếu có].
- Ngày ghi nhận: [YYYY-MM-DD].

Chỉ dùng thông tin trên, không thêm task, chặng hoặc roadmap khác.
Giữ khung giao diện. Cập nhật dữ liệu/context cần thiết và chạy validator.
Nếu thiếu dữ liệu bắt buộc, hỏi tôi; không tự điền nội dung suy đoán.
```

Với việc `planned`, bằng chứng có thể chưa có. Với `done`, cần nguồn phù hợp; file cấu hình tồn tại chỉ chứng minh cấu hình đó tồn tại, không đủ để khẳng định gameplay đã chạy.

### Mẫu sửa nội dung đã có

```text
Đọc Progress_show/skills/progress-show-update/SKILL.md.
Sửa mục có ID [ID] trong [tasks.js / journey.js / assets.js].
Thay đổi: [mô tả hoặc trạng thái mới].
Nguồn xác nhận: [đường dẫn hoặc thông tin bổ sung].
Giữ ID và các nội dung ngoài phạm vi; cập nhật liên kết/context nếu cần.
```

### File nào được cập nhật?

| File/thư mục | Nội dung |
| --- | --- |
| `data/project.js` | Giới thiệu, ngày ghi nhận và thông tin chung |
| `data/journey.js` | Các chặng theo thứ tự hiển thị |
| `data/tasks.js` | Công việc, trạng thái và bằng chứng |
| `data/assets.js` | Thẻ tài nguyên, ảnh xem trước và bản sao |
| `images/` | Ảnh được chọn bổ sung |
| `context/` | Ngữ cảnh, bản sao nguồn và manifest |

Định dạng chi tiết nằm trong [data/FORMAT.md](data/FORMAT.md). Trang tự dựng danh sách và số đếm từ dữ liệu; thêm một task không cần viết lại HTML.

## 5. Dùng cả hai skill trong một yêu cầu

Nếu bạn đã có luồng cần giải thích và nội dung cần show, có thể gửi:

```text
Đọc hai skill trong Progress_show/skills/:
- project-infographic/SKILL.md
- progress-show-update/SKILL.md

Chỉ dùng nội dung và nguồn sau: [nội dung/đường dẫn].
1. Tạo hoặc cập nhật luồng diễn giải [tên luồng].
2. Cập nhật các mục trên bản show: [danh sách chính xác, trạng thái, chặng].
3. [Nếu muốn] Thêm liên kết mở infographic tại [vị trí trên main.html].

Giữ nguyên các phần khác. Không tự bổ sung tiến trình hoặc roadmap.
Kiểm tra dữ liệu và phần giao diện đã thay đổi; báo lại các file đã sửa.
```

Nếu chỉ muốn thảo luận trước, thêm câu: **“Chỉ đề xuất nội dung để tôi xem, chưa sửa file.”**

## 6. Kiểm tra sau khi cập nhật

Từ root repo, chạy:

```powershell
python Progress_show/scripts/validate.py
```

Để đối chiếu bản sao với nguồn game hiện tại, dùng thêm `--compare-source`. Khi cần copy nguồn mới, chọn đường dẫn trong `SOURCES` của `scripts/snapshot.py` rồi chạy script; danh sách nguồn hiện để trống và sẽ không tự chọn file.

Mở `main.html`, tải lại trang và kiểm tra các mục vừa bổ sung. Nếu không thấy nội dung, xóa từ khóa tìm kiếm và chọn bộ lọc **Tất cả**. Lỗi dữ liệu, đường dẫn hoặc liên kết ID được kiểm tra theo [data/FORMAT.md](data/FORMAT.md); đổi bố cục infographic cần kiểm tra thêm nhãn và mũi tên trong trình duyệt.
