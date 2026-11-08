# Oceanbound · Progress_show

Nơi này dùng để **show tiến trình và tài nguyên đã làm của Oceanbound**, theo dạng todo list có ngữ cảnh và bằng chứng. Nội dung/file được **copy từ game chính `Game/` ra để trình bày**, giúp nhìn lại đã có gì và việc tiếp theo là gì.

Đây là bản ghi độc lập. Game nguồn vẫn ở `Game/`; không sửa các bản sao ở đây để thay đổi game. Các file Unity copy chỉ để tham chiếu, không phải một project Unity có thể import độc lập vì thiếu dependency và `.meta`.

## Mở trang

Mở `Progress_show/main.html` bằng trình duyệt. Trang hoạt động trực tiếp, không cần npm, kết nối mạng, CDN hoặc build.

Tài liệu thiết kế nằm ở [design.html](design.html), mở từ mục **Tài liệu** trên thanh điều hướng. Có đủ các chương 01–14 và cây mục con theo ảnh mục lục bạn cung cấp. Tiêu đề dài xuống dòng đầy đủ. Mục 01 đã có tổng quan ý tưởng và nguồn YouTube; các mục còn lại chờ bổ sung trong `data/design.js` theo [định dạng dữ liệu](data/FORMAT.md#bổ-sung-tài-liệu-thiết-kế).

Nếu muốn xem qua HTTP, chạy từ root repo:

```powershell
python -m http.server 8080 --bind 127.0.0.1 --directory Progress_show
```

Mở [bản xem cục bộ](http://127.0.0.1:8080/main.html). Nhấn `Ctrl+C` ở terminal để dừng server.

## Có gì trong trang

- Khu vực hải trình để bổ sung các chặng phát triển.
- Todo có trạng thái, tìm kiếm không dấu, bộ lọc và popup bằng chứng. Phím `/` vào tìm kiếm, `Esc` đóng popup.
- Thư viện tài nguyên có hình xem trước, nguồn, mô tả và bản sao tải về.
- Luồng giải thích cách cập nhật: chọn nguồn → copy → ghi dữ liệu → kiểm tra và show.

**Hiện chỉ giữ khung, chưa có dữ liệu tiến trình.** Các danh sách chặng, công việc, tài nguyên và nguồn copy đều để trống để bạn tự bổ sung. Không tự suy luận tiến độ hoặc thêm roadmap từ cấu trúc repo. Bản đồ trang là hình trang trí, không phải ảnh gameplay.

## Cấu trúc

```text
Progress_show/
├── README.md
├── HUONG_DAN_SKILLS.md             # Cách gọi skill bằng $ và mẫu câu lệnh
├── AGENTS.md                      # Chỉ dẫn context cho agent làm trong thư mục
├── main.html                      # Khung trình bày
├── styles/main.css                # Giao diện responsive
├── scripts/
│   ├── main.js                    # Renderer, tìm kiếm, bộ lọc, popup
│   ├── snapshot.py                # Copy nhóm nguồn cụ thể + ghi SHA-256
│   └── validate.py                # Kiểm tra dữ liệu, liên kết, file và hash
├── data/
│   ├── FORMAT.md                  # Quy ước định dạng và ví dụ chỉnh
│   ├── project.js                 # Thông tin chung, ngày snapshot
│   ├── journey.js                 # Các chặng / luồng phát triển
│   ├── tasks.js                   # Todo và bằng chứng
│   └── assets.js                  # Tài nguyên, ảnh và đường dẫn bản sao
├── images/                        # Ảnh, SVG; thêm screenshot thật khi có
├── context/
│   ├── project-knowledge.md        # Hiện trạng, nguồn, giới hạn và luồng
│   ├── manifest.json              # Nguồn → bản sao → SHA-256
│   └── game/                      # Sẽ được tạo khi bạn chọn file từ Game/ để copy
└── design.html                   # Tài liệu thiết kế game

../.agents/skills/                 # Skill cấp project, Codex tự nhận diện
├── project-infographic/
├── progress-show-update/
└── oceanbound-design-update/
```

## Chỉnh nội dung mà không chỉnh HTML

Đọc [data/FORMAT.md](data/FORMAT.md). Sửa todo trong `data/tasks.js`, tài nguyên trong `data/assets.js`, luồng chặng trong `data/journey.js`; đổi ngày/giới thiệu ở `data/project.js`. Renderer tự cập nhật số đếm, bộ lọc, danh sách và popup.

Các file dữ liệu chứa JSON được bọc trong phép gán JavaScript, để mở trực tiếp không gặp giới hạn fetch JSON cục bộ. Giữ dấu nháy kép, không trailing comma, không chèn function hoặc HTML vào JSON.

Để cập nhật bản sao nguồn và kiểm tra:

```powershell
python Progress_show/scripts/snapshot.py
python Progress_show/scripts/validate.py --compare-source
```

`snapshot.py` chỉ đọc game và copy những file bạn chọn trong `SOURCES`; danh sách này hiện để trống. Nó ghi manifest, không tự đổi trạng thái task hoặc ngày snapshot trên trang. Khi có nội dung cần thêm, bổ sung đường dẫn cụ thể vào `SOURCES`; không copy Library/Temp hay toàn bộ game. Chỉnh nội dung/ngày sau khi đối chiếu và cập nhật `context/project-knowledge.md` khi hiện trạng đổi.

`validate.py` kiểm tra các file dữ liệu, ID/liên kết, đường dẫn, bằng chứng cho trạng thái done và hash bản sao. `--compare-source` còn đối chiếu với game hiện tại; bỏ cờ này khi chỉ muốn kiểm tra một snapshot lịch sử.

## Skill trong project

Đọc [Hướng dẫn sử dụng skill](HUONG_DAN_SKILLS.md) để chọn đúng skill, chuẩn bị đầu vào, dùng các mẫu câu lệnh và kiểm tra kết quả.

1. [project-infographic](../.agents/skills/project-infographic/SKILL.md), pull từ [grahama1970/agent-stack-public](https://github.com/grahama1970/agent-stack-public/blob/main/skills/project-infographic/SKILL.md); giữ nội dung hướng dẫn và các reference, chuyển metadata phụ vào trường `metadata` để đúng định dạng skill. Commit và hash upstream được ghi trong [context/skill-source.json](context/skill-source.json). Dùng để tạo luồng diễn giải/infographic có nguồn, brief và quy tắc cập nhật. Các skill khác được upstream nhắc tới không đồng nghĩa đã được cài.
2. [progress-show-update](../.agents/skills/progress-show-update/SKILL.md), dùng context trong repo để tạo/cập nhật các file dữ liệu nhập vào `main.html`, bổ sung tài nguyên và kiểm tra tính nhất quán.
3. [oceanbound-design-update](../.agents/skills/oceanbound-design-update/SKILL.md), bổ sung/chỉnh sửa GDD qua `data/design.js` và `design.html`.

Các skill nằm trong **`.agents/skills/` ở root repo** để Codex nhận diện ở cấp project; chưa cài toàn cục. Gõ `$` và chọn skill theo tên. Nếu danh sách chưa cập nhật, mở lại Codex. Có thể dùng ngay bằng lời nhắc:

> $progress-show-update — Chỉ cập nhật nội dung, trạng thái, nguồn tôi cung cấp sau đây: [nội dung].

> $project-infographic — Đọc Progress_show/context/project-knowledge.md để tạo infographic diễn giải quy trình cập nhật bản show.

> $oceanbound-design-update — Bổ sung vào mục 01. Tổng quan / Ý tưởng: [nội dung].

## Tham khảo thiết kế

Tham khảo [Linear Project Milestones](https://linear.app/changelog/project-milestones) và [Project Overview](https://linear.app/changelog/2024-05-02-the-next-generation-of-linear-projects) cho cấu trúc overview/chặng/công việc. Giao diện hải trình, SVG và mã trang được viết riêng cho Oceanbound, không copy asset của mẫu.

