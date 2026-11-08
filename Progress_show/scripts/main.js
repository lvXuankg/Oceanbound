/* Renderer chung. Nội dung dự án nằm trong data/, không chỉnh trực tiếp ở đây. */
(() => {
  "use strict";
  const data = window.OCEANBOUND;
  const $ = (id) => document.getElementById(id);
  const labels = { done: "Đã có", active: "Đang làm", planned: "Chờ làm", blocked: "Bị chặn" };
  if (!data?.project || !Array.isArray(data.tasks) || !Array.isArray(data.assets) || !Array.isArray(data.journey)) {
    $("load-error").hidden = false;
    return;
  }
  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const normalize = (text) => String(text).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLocaleLowerCase("vi");
  const matches = (item, query) => normalize([item.title, item.description, item.category, item.type, ...(item.tags || []), ...(item.evidence || [])].join(" ")).includes(query);
  const badge = (status) => element("span", `status ${status}`, labels[status] || status);
  const safePath = (path) => typeof path === "string" && !path.startsWith("/") && !path.includes("\\") && !path.split("/").includes("..") && !/[?:#\u0000-\u001f]/.test(path);
  const done = data.tasks.filter((task) => task.status === "done").length;
  const date = data.project.snapshotDate ? new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Asia/Bangkok" }).format(new Date(`${data.project.snapshotDate}T12:00:00+07:00`)) : "Chưa cập nhật";
  $("snapshot-date").textContent = date;
  $("project-description").textContent = data.project.description;
  $("engine-label").textContent = data.project.engine;
  $("phase-label").textContent = data.project.phase;
  $("scope-note").textContent = data.project.scopeNote;
  $("done-count").textContent = String(done).padStart(2, "0");
  $("planned-count").textContent = String(data.tasks.filter((task) => task.status === "planned").length).padStart(2, "0");
  $("asset-count").textContent = String(data.assets.length).padStart(2, "0");
  $("footer-date").textContent = data.project.snapshotDate ? `Bản ghi ${date} · Được cập nhật thủ công` : "Chờ bổ sung nội dung";
  $("checklist-caption").textContent = data.tasks.length ? `${done}/${data.tasks.length} hạng mục đã có trong checklist · Chưa biểu thị tiến độ toàn bộ game` : "Chưa có dữ liệu tiến trình";
  $("checklist-progress").max = Math.max(data.tasks.length, 1);
  $("checklist-progress").value = done;
  $("journey-empty").hidden = data.journey.length > 0;
  for (const [index, stage] of data.journey.entries()) {
    const item = element("li", stage.status);
    item.append(element("span", "journey-number", String(index + 1).padStart(2, "0")), badge(stage.status), element("h3", "", stage.title), element("p", "", stage.description));
    $("journey-list").append(item);
  }
  const dialog = $("detail-dialog");
  let opener;
  const fileList = (files) => {
    const list = element("ul", "detail-files");
    for (const file of files) {
      const row = element("li");
      if (safePath(file.copy)) {
        const link = element("a", "", `↓ ${file.copy.split("/").pop()}`);
        link.href = file.copy;
        link.setAttribute("download", "");
        row.append(link);
      }
      row.append(element("span", "detail-source", `Nguồn: ${file.source}`));
      list.append(row);
    }
    return list;
  };
  const showDetail = (item, type, trigger) => {
    opener = trigger;
    $("detail-category").textContent = type === "task" ? `${item.category} / ${labels[item.status]}` : `${item.type} / ${labels[item.status]}`;
    $("detail-title").textContent = item.title;
    $("detail-description").textContent = item.description;
    const content = $("detail-content");
    content.replaceChildren();
    if (type === "asset") {
      if (safePath(item.preview)) {
        const img = element("img", "detail-image");
        img.src = item.preview;
        img.alt = item.previewAlt;
        content.append(img);
      }
      content.append(element("p", "", item.note), element("div", "detail-label", "Bản sao tài nguyên"), fileList(item.files));
    } else {
      const stage = data.journey.find((entry) => entry.id === item.milestone);
      if (stage) content.append(element("p", "", `Chặng: ${stage.title}`));
      if (item.evidence.length) {
        content.append(element("div", "detail-label", "Bằng chứng từ dự án"), fileList(item.evidence.map((source) => ({ source, copy: source.replace(/^Game\//, "context/game/") }))));
      } else {
        content.append(element("p", "", "Chưa có bằng chứng đính kèm. Đây là việc đề xuất, cần cập nhật khi bắt đầu thực hiện."));
      }
      for (const id of item.assetIds) {
        const asset = data.assets.find((entry) => entry.id === id);
        if (asset) content.append(element("p", "", `Tài nguyên liên quan: ${asset.title}`));
      }
    }
    dialog.showModal();
    document.body.classList.add("no-scroll");
  };
  dialog.querySelector(".close-dialog").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("no-scroll");
    opener?.focus();
  });
  let status = "all";
  const render = () => {
    const query = normalize($("search").value.trim());
    const tasks = data.tasks.filter((task) => (status === "all" || task.status === status) && matches(task, query));
    const assets = data.assets.filter((asset) => matches(asset, query));
    $("task-list").replaceChildren();
    $("asset-grid").replaceChildren();
    $("task-summary").textContent = `${tasks.length} / ${data.tasks.length} hạng mục`;
    for (const task of tasks) {
      const row = element("button", "task-row");
      row.type = "button";
      row.setAttribute("aria-label", `${task.title} — ${labels[task.status]}. Xem chi tiết`);
      const title = element("span");
      title.append(element("span", "task-title", task.title), element("span", "task-subtitle", task.evidence.length ? `${task.evidence.length} file bằng chứng · ${task.tags.slice(0, 2).join(" / ")}` : "Đề xuất · Chưa có bằng chứng"));
      row.append(element("span", `task-icon ${task.status}`, task.status === "done" ? "✓" : task.status === "blocked" ? "!" : "·"), title, element("span", "task-category", task.category), badge(task.status), element("span", "task-arrow", "↗"));
      row.addEventListener("click", () => showDetail(task, "task", row));
      $("task-list").append(row);
    }
    if (!tasks.length) $("task-list").append(element("p", "empty", data.tasks.length ? "Không có công việc phù hợp. Thử từ khóa hoặc trạng thái khác." : "Chưa bổ sung công việc."));
    for (const asset of assets) {
      const card = element("article", "asset-card");
      const preview = element("div", "asset-preview");
      const image = element("img");
      if (safePath(asset.preview)) image.src = asset.preview;
      image.alt = asset.previewAlt;
      image.loading = "lazy";
      preview.append(image, element("span", "asset-type", asset.type));
      const content = element("div", "asset-content");
      content.append(badge(asset.status), element("h3", "", asset.title), element("p", "", asset.description));
      const bottom = element("div", "asset-bottom");
      const button = element("button", "asset-open", "Xem tài nguyên ↗");
      button.type = "button";
      button.setAttribute("aria-label", `Xem tài nguyên: ${asset.title}`);
      button.addEventListener("click", () => showDetail(asset, "asset", button));
      bottom.append(element("span", "", `${String(asset.files.length).padStart(2, "0")} FILE · BẢN SAO`), button);
      content.append(bottom);
      card.append(preview, content);
      $("asset-grid").append(card);
    }
    if (!assets.length) $("asset-grid").append(element("p", "empty", data.assets.length ? "Không có tài nguyên phù hợp với từ khóa này." : "Chưa bổ sung tài nguyên."));
  };
  for (const button of document.querySelectorAll(".filter")) {
    button.addEventListener("click", () => {
      status = button.dataset.status;
      for (const sibling of document.querySelectorAll(".filter")) {
        const selected = sibling === button;
        sibling.classList.toggle("active", selected);
        sibling.setAttribute("aria-pressed", String(selected));
      }
      render();
    });
  }
  $("search").addEventListener("input", render);
  document.addEventListener("keydown", (event) => {
    if (event.key === "/" && !dialog.open && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) && !document.activeElement.isContentEditable) {
      event.preventDefault();
      $("search").focus();
    }
  });
  render();
})();
