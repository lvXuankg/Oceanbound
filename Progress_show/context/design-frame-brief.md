# Khung tài liệu Oceanbound

## Mục đích và nguồn

Tạo khung GDD để chủ dự án bổ sung nội dung. Nguồn duy nhất cho cây mục là ảnh mục lục người dùng gửi và tám tên đầy đủ trong yêu cầu; người dùng xác nhận lấy toàn bộ 01–14. `context/project-knowledge.md` xác nhận chưa có dữ liệu game để điền.

## Hợp đồng nội dung và bố cục

- Artifact chính: `design.html`, dữ liệu `data/design.js`, renderer `scripts/design.js`, CSS `styles/design.css`.
- Đây là khung tài liệu theo yêu cầu, không phải infographic về gameplay. Áp dụng project-infographic ở nguyên tắc nguồn, phân cấp, chữ chọn được và xác minh trình duyệt; không áp bố cục poster hoặc bịa mũi tên khi chưa có cơ chế.
- 14 chương gốc theo thứ tự ảnh. Nhóm 05 có Vật phẩm → 05_01. Tài nguyên → bốn nhóm tài nguyên; 05_02 và 05_03 là hai mục ngang hàng với 05_01 trong Vật phẩm. Kẻ địch ngang hàng với Vật phẩm.
- 04 dùng tên đầy đủ “Progression & Economy” từ nhãn “Progression & Econo…” trong ảnh; 05_03 giữ nguyên “Công cụ” theo ảnh.
- Tất cả nội dung thiết kế là `missing`, mảng `content` để trống. Cây mục là `artifact-derived` từ yêu cầu, không phải bằng chứng triển khai game.
- Desktop: mục lục 300px bên trái, bài đọc bên phải; mobile: mục lục thu gọn phía trên. Tiêu đề được xuống dòng, không ellipsis. Mỗi chương có số và mốc liên kết bền vững.
- Màu xanh đậm/mint kế thừa bản show; bề mặt tài liệu sáng, chữ tối. Không thêm KPI, tiến độ, dữ liệu minh họa hoặc cơ chế chưa xác nhận.
- Không cần ảnh sinh, SVG connector, PNG xuất bản hoặc skill project-knowledge bên ngoài cho khung rỗng này.

## Tiêu chí kiểm tra

Đủ 14 chương và toàn bộ nhóm con; tên đầy đủ khớp yêu cầu; liên kết mục lục đúng; không cắt chữ/tràn ngang desktop và mobile; dữ liệu UTF-8 hợp lệ; nội dung vẫn trống; trang chạy trực tiếp bằng file URL; trang tiến trình vẫn hoạt động.
