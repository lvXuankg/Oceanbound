# Progress_show context

Đây là bản trưng bày cục bộ của Oceanbound. Đọc `README.md` trước khi sửa nội dung.

Dữ liệu tiến trình hiện để trống theo yêu cầu người dùng. GDD đã có tổng quan ý tưởng ở mục 01; các mục còn lại chờ thông tin họ bổ sung. Không tự điền thiết kế, tiến độ, todo, roadmap hoặc tài nguyên từ suy luận về repo.

- Khi tạo/cập nhật bản ghi, dùng skill tại `../.agents/skills/progress-show-update/SKILL.md` (gọi `$progress-show-update`) và đọc `data/FORMAT.md`. Chỉnh nội dung trong `data/`, giữ renderer dùng chung.
- Khi bổ sung/chỉnh sửa tài liệu thiết kế trong `design.html`, dùng skill `../.agents/skills/oceanbound-design-update/SKILL.md`. Nội dung nằm trong `data/design.js`; không coi nội dung thiết kế là bằng chứng tiến độ triển khai game.
- Khi cần một infographic giải thích luồng, đọc `../.agents/skills/project-infographic/SKILL.md` (gọi `$project-infographic`) và các reference mà skill yêu cầu. Skill này phục vụ infographic, không ép toàn bộ trang todo thành poster.
- Chỉ đánh dấu `done` theo bằng chứng. Phân biệt template, bản minh họa, đề xuất và tính năng thực sự đã chạy.
- `context/game/` chứa bản sao tham chiếu, không phải game nguồn. Sửa game tại `Game/` chỉ khi yêu cầu hiện tại có phạm vi đó.
- Chạy `python Progress_show/scripts/validate.py` từ root repo sau khi cập nhật; xem trang trong trình duyệt khi thay đổi giao diện.
