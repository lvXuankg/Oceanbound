---
name: progress-show-update
description: Tạo hoặc cập nhật dữ liệu, tài nguyên và ngữ cảnh cho trang tiến trình Oceanbound trong Progress_show. Dùng khi ghi công việc, trạng thái, chặng phát triển hoặc thêm ảnh và bằng chứng vào main.html.
---

# Cập nhật Progress_show

Mục tiêu: duy trì bản trưng bày có nguồn, chỉnh được qua dữ liệu và mở trực tiếp bằng `main.html`.

## Đọc đúng context

Tìm root repo Oceanbound từ thư mục chứa skill; đọc `Progress_show/README.md`, `Progress_show/data/FORMAT.md`, bốn file `data/*.js` và `context/manifest.json`. Đọc thêm `context/project-knowledge.md` khi cần hiểu trạng thái hoặc luồng giải thích hiện tại.

Đối chiếu file trong `Game/` liên quan đến thay đổi. Không quét Library, Temp, Logs hoặc package cache để suy ra tiến trình game. Bản sao cũ chỉ chứng minh trạng thái tại lần ghi nhận đó.

## Ghi nội dung

Chỉ bổ sung nội dung theo thông tin hoặc nguồn người dùng chọn. Bản show hiện để trống theo yêu cầu; không tự suy ra tiến độ từ cấu trúc Unity, không khôi phục dữ liệu mẫu, tự thêm đề xuất hoặc roadmap.

- Thay đổi thông tin chung trong `data/project.js`, chặng trong `journey.js`, todo trong `tasks.js`, tài nguyên trong `assets.js`. Giữ JSON hợp lệ bên phải phép gán, không thêm function, trailing comma hoặc comment bên trong JSON.
- Giữ ID đã tồn tại; kiểm tra `milestone`, `assetIds` và `evidence` khớp. Không ghi các số đếm thủ công vì trang tự tính.
- `done` nghĩa là hạng mục mô tả đã có bằng chứng. File cấu hình chỉ chứng minh cấu hình tồn tại; không chứng minh runtime, hiệu năng, build hoặc gameplay. `active` cần bằng chứng đang thực hiện; `planned` là chưa làm; `blocked` ghi rõ điều kiện đang cản trở.
- Đề xuất mới phải được mô tả là đề xuất. Không biến roadmap mẫu thành quyết định đã chốt hoặc lấy % checklist làm % toàn game.
- Mỗi tài nguyên cần đường dẫn nguồn, bản sao trong thư mục show, mô tả và trạng thái. Ảnh trong `images/` phải có alt; hình minh họa được ghi rõ, không nhận là screenshot gameplay.
- Cập nhật `snapshotDate` theo ngày ghi nhận, cùng `context/project-knowledge.md` nếu có thay đổi về cơ chế hoặc bằng chứng. Không tự cập nhật ngày chỉ vì mở trang.

## Giữ bằng chứng tái kiểm tra được

Khi người dùng chọn nguồn để bổ sung, thêm đường dẫn vào `SOURCES` rồi chạy `python Progress_show/scripts/snapshot.py` từ root repo. Danh sách nguồn mặc định để trống. Script chỉ copy những nguồn đã chọn, không sửa game, và ghi hash vào manifest.

Khi có bằng chứng mới, thêm đường dẫn cụ thể vào `SOURCES` của script, chạy lại và liên kết qua manifest. Nguồn bằng chứng của todo hiện dùng đường dẫn `Game/...`; bản sao tương ứng là `context/game/...`. Không copy toàn bộ project, Library, secrets hoặc file build lớn vào trang.

Với screenshot hoặc media bổ sung trong `images/`, ghi đường dẫn nguồn/nguồn chụp ở context và alt/caption; không chạy script snapshot chỉ để tạo lại các file không thay đổi. Không tự sửa một bản sao rồi coi nó là nguồn game.

## Luồng diễn giải

Với cập nhật thông thường, giữ mạch: đã có gì → bằng chứng ở đâu → bước tiếp theo là gì. Luồng cập nhật bản show nằm trong `main.html`.

Khi người dùng yêu cầu infographic riêng hoặc giải thích cơ chế phức tạp, đọc skill kèm theo tại `../project-infographic/SKILL.md`. Đây là skill upstream; một số skill/tích hợp nó nhắc tới có thể không có trong môi trường. Không coi chúng là đã được cài. Dùng project knowledge cục bộ làm tài liệu đầu vào, ghi rõ khả năng xác minh còn thiếu; chỉ tạo artifact phù hợp yêu cầu hiện tại.

## Kiểm tra và bàn giao

Chạy `python Progress_show/scripts/validate.py`; thêm `--compare-source` khi cần xác nhận snapshot còn khớp game hiện tại. Khi sửa JS, chạy `node --check` cho file liên quan. Xem `main.html` ở desktop/mobile sau thay đổi bố cục, thử bộ lọc, tìm kiếm và mở bằng chứng khi thay đổi renderer.

Nêu nội dung đã thay đổi, file dữ liệu đã sửa và hạn chế xác minh còn lại. Không cần sửa HTML/CSS chỉ để thêm một task hoặc asset.
