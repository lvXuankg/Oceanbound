/* Renderer khung GDD. Bổ sung nội dung tại data/design.js. */
(() => {
  "use strict";
  const sections = window.OCEANBOUND?.design;
  if (!Array.isArray(sections)) {
    document.getElementById("design-error").hidden = false;
    return;
  }
  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const outline = document.getElementById("document-outline");
  const content = document.getElementById("document-sections");
  const links = new Map();
  const sourceURL = (value) => {
    if (typeof value !== "string" || /[\s\\]/.test(value)) return null;
    try {
      const url = new URL(value);
      return url.protocol === "https:" && !url.username && !url.password ? url.href : null;
    } catch {
      return null;
    }
  };
  const render = (parent, depth, container) => {
    const list = make("ul");
    for (const item of sections.filter((section) => section.parent === parent)) {
      const title = `${item.number ? `${item.number}. ` : ""}${item.title}`;
      const row = make("li");
      const link = make("a", "", title);
      link.href = `#${item.id}`;
      links.set(item.id, link);
      row.append(link);
      const section = make("section", `doc-section ${depth === 0 ? "chapter" : "subsection"}`);
      section.id = item.id;
      section.setAttribute("aria-labelledby", `${item.id}-title`);
      const heading = make("div", "section-heading");
      if (item.number) heading.append(make("span", "section-number", item.number));
      const label = make(`h${Math.min(depth + 2, 6)}`, "", item.title);
      label.id = `${item.id}-title`;
      heading.append(label);
      section.append(heading);
      if (item.content.length) {
        const body = make("div", "section-content");
        for (const paragraph of item.content) body.append(make("p", "", paragraph));
        section.append(body);
      } else if (!sections.some((child) => child.parent === item.id)) {
        const placeholder = make("div", "section-empty", "Chưa bổ sung nội dung.");
        placeholder.append(make("span", "", "Phần này dành cho nội dung bạn sẽ thêm."));
        section.append(placeholder);
      }
      const sources = make("div", "section-sources");
      for (const source of item.sources || []) {
        const href = sourceURL(source.url);
        if (!href) continue;
        const reference = make("p");
        const link = make("a", "", `${source.label} ↗`);
        link.href = href;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        reference.append(link);
        sources.append(reference);
      }
      if (sources.childElementCount) section.append(sources);
      const children = render(item.id, depth + 1, section);
      if (children.childElementCount) row.append(children);
      container.append(section);
      list.append(row);
    }
    return list;
  };
  outline.append(render(null, 0, content));
  const updateCurrent = () => {
    for (const [id, link] of links) {
      if (`#${id}` === location.hash) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    }
  };
  window.addEventListener("hashchange", updateCurrent);
  updateCurrent();
  const panel = document.getElementById("outline-panel");
  const mobile = window.matchMedia("(max-width: 800px)");
  const setOutline = () => { panel.open = !mobile.matches; };
  setOutline();
  mobile.addEventListener("change", setOutline);
  outline.addEventListener("click", (event) => {
    if (event.target.closest("a") && mobile.matches) panel.open = false;
  });
  // Resolve deep links after the data-driven sections have been inserted.
  const target = document.getElementById(location.hash.slice(1));
  if (target) requestAnimationFrame(() => target.scrollIntoView());
})();
