/*
 * app.js — 页面逻辑
 * 结构：
 *   1. 状态与 localStorage
 *   2. 页面渲染（home / concepts / playground / favorites）
 *   3. Concept 详情页
 *   4. 交互 Demo（Flex / Grid / Spacing / Radius / Shadow / Modal / Drawer / Sidebar / Responsive / Card / Table）
 *   5. 术语翻译器
 *   6. 事件绑定与启动
 */

/* ============ 1. 状态 ============ */
const store = {
  get(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  },
  set(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
};

let favorites = store.get("hvl-favorites", []);
let learned = store.get("hvl-learned", []);

function saveFavorites() { store.set("hvl-favorites", favorites); }
function saveLearned() { store.set("hvl-learned", learned); }

function isFav(id) { return favorites.includes(id); }
function isLearned(id) { return learned.includes(id); }

function toggleFav(id, btn) {
  favorites = isFav(id) ? favorites.filter(x => x !== id) : [...favorites, id];
  saveFavorites();
  if (btn) {
    btn.classList.toggle("active", isFav(id));
    btn.querySelector(".fav-text").textContent = isFav(id) ? "已收藏 ♥" : "收藏 ♡";
    btn.setAttribute("aria-label", isFav(id) ? "取消收藏" : "收藏");
  }
}

/* ============ 小工具 ============ */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

async function copyText(text, btn, okText = "已复制 ✓") {
  try { await navigator.clipboard.writeText(text); }
  catch {
    const ta = document.createElement("textarea");
    ta.value = text; document.body.appendChild(ta);
    ta.select(); document.execCommand("copy"); ta.remove();
  }
  const old = btn.textContent;
  btn.textContent = okText;
  setTimeout(() => btn.textContent = old, 1600);
}

/* ============ 2. 页面渲染 ============ */
const app = $("#app");
let currentTab = "home";
let activeFilter = "All";

function switchTab(tab) {
  currentTab = tab;
  $$(".nav-item").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
  renderTab();
  window.scrollTo(0, 0);
}

function renderTab() {
  if (currentTab === "home") renderHome();
  else if (currentTab === "concepts") renderConcepts();
  else if (currentTab === "playground") renderPlayground();
  else if (currentTab === "favorites") renderFavorites();
}

/* ---------- 首页 ---------- */
function renderHome() {
  const total = CONCEPTS.length;
  const learnedCount = learned.length;
  const pct = Math.round((learnedCount / total) * 100);

  app.innerHTML = `
    <section class="hero">
      <h1 class="hero-title">前端术语可视化</h1>
      <p class="hero-sub">看懂 AI 在说什么，<br/>学会描述你想要的页面。</p>
    </section>

    <section class="progress-card" aria-label="学习进度">
      <div class="progress-head">
        <span class="progress-label">学习进度</span>
        <span class="progress-num">${learnedCount} / ${total}</span>
      </div>
      <div class="progress-bar" role="progressbar" aria-valuenow="${pct}" aria-valuemax="100">
        <div class="progress-fill" style="width:${pct}%"></div>
      </div>
    </section>

    <section class="module-grid">
      ${MODULES.map(m => {
        const items = CONCEPTS.filter(c => c.category === m.id);
        const done = items.filter(c => isLearned(c.id)).length;
        return `
        <button class="module-card" data-filter="${m.id}">
          <span class="module-num">${m.num}</span>
          <span class="module-title">${m.title}</span>
          <span class="module-sub">${m.subtitle}</span>
          <span class="module-count">${done}/${items.length} 已学</span>
        </button>`;
      }).join("")}
    </section>

    <section class="translator-entry">
      <button class="translator-card" id="translator-open">
        <span class="translator-emoji">🔤</span>
        <span class="translator-body">
          <strong>AI 术语看不懂？</strong>
          <span>粘贴 AI 说的话，我来翻译</span>
        </span>
        <span class="translator-arrow">→</span>
      </button>
    </section>
  `;

  $$(".module-card", app).forEach(b =>
    b.addEventListener("click", () => { activeFilter = b.dataset.filter; switchTab("concepts"); }));
  $("#translator-open").addEventListener("click", openTranslator);
}

/* ---------- 概念列表页 ---------- */
function renderConcepts() {
  app.innerHTML = `
    <section class="page-head">
      <h2 class="page-title">概念库</h2>
      <div class="search-wrap">
        <span class="search-icon">🔍</span>
        <input id="concept-search" class="search-input" type="search"
               placeholder="搜索术语…" aria-label="搜索概念" autocomplete="off" />
        <button class="search-clear" id="search-clear" aria-label="清空" hidden>×</button>
      </div>
      <p class="search-count" id="search-count"></p>
    </section>
    <div class="filter-bar" role="tablist" aria-label="分类筛选">
      ${[
        ["All", "全部"],
        ["Structure", "结构"],
        ["Layout", "布局"],
        ["Style", "样式"],
        ["UI", "组件"]
      ].map(([f, label]) =>
        `<button class="filter-chip ${f === activeFilter ? "active" : ""}" data-filter="${f}">${label}</button>`).join("")}
    </div>
    <div id="concept-list" class="concept-grid"></div>
  `;

  const searchInput = $("#concept-search");
  const clearBtn = $("#search-clear");

  searchInput.addEventListener("input", e => {
    clearBtn.hidden = !e.target.value;
    renderConceptList(e.target.value);
  });
  clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    clearBtn.hidden = true;
    renderConceptList("");
    searchInput.focus();
  });
  $$(".filter-chip", app).forEach(b => b.addEventListener("click", () => {
    activeFilter = b.dataset.filter;
    $$(".filter-chip", app).forEach(x => x.classList.toggle("active", x === b));
    renderConceptList(searchInput.value);
  }));
  renderConceptList("");
}

function renderConceptList(query) {
  const q = query.trim().toLowerCase();
  const list = CONCEPTS.filter(c =>
    (activeFilter === "All" || c.category === activeFilter) &&
    (!q || c.name.toLowerCase().includes(q) || c.shortDescription.includes(q) || c.keywords.some(k => k.includes(q))));

  const countEl = $("#search-count");
  if (countEl) countEl.textContent = list.length ? `共 ${list.length} 个概念` : "";

  $("#concept-list").innerHTML = list.length ? list.map(c => {
    const learnedFlag = isLearned(c.id);
    const favFlag = isFav(c.id);
    return `
    <button class="concept-card ${learnedFlag ? "learned" : ""}" data-id="${c.id}">
      <div class="concept-top">
        <span class="concept-name">${c.name}</span>
        <span class="concept-badge ${learnedFlag ? "learned" : ""}">${learnedFlag ? "✓ 已学" : c.category}</span>
      </div>
      <p class="concept-desc">${c.shortDescription}</p>
      <div class="concept-meta">
        <span>${c.minutes} 分钟</span>
        <span class="concept-fav-btn ${favFlag ? "on" : ""}" data-fav="${c.id}" role="button" aria-label="${favFlag ? "取消收藏" : "收藏"}">${favFlag ? "♥" : "♡"}</span>
      </div>
    </button>`;
  }).join("")
    : `<p class="empty-tip">没有找到相关概念，换个关键词试试～</p>`;

  $$("#concept-list .concept-card").forEach(card => {
    card.addEventListener("click", (e) => {
      if (e.target.closest("[data-fav]")) {
        e.stopPropagation();
        const favEl = e.target.closest("[data-fav]");
        const fid = favEl.dataset.fav;
        favorites = isFav(fid) ? favorites.filter(x => x !== fid) : [...favorites, fid];
        saveFavorites();
        favFlag_update(favEl, fid);
        return;
      }
      openDetail(card.dataset.id);
    });
  });
}

function favFlag_update(el, id) {
  const on = isFav(id);
  el.classList.toggle("on", on);
  el.textContent = on ? "♥" : "♡";
  el.setAttribute("aria-label", on ? "取消收藏" : "收藏");
}

/* ---------- 收藏页 ---------- */
function renderFavorites() {
  const list = CONCEPTS.filter(c => isFav(c.id));
  app.innerHTML = `
    <section class="page-head"><h2 class="page-title">我的收藏</h2></section>
    <div class="concept-grid">
      ${list.length ? list.map(c => {
        const learnedFlag = isLearned(c.id);
        return `
        <button class="concept-card ${learnedFlag ? "learned" : ""}" data-id="${c.id}">
          <div class="concept-top">
            <span class="concept-name">${c.name}</span>
            <span class="concept-badge ${learnedFlag ? "learned" : ""}">${learnedFlag ? "✓ 已学" : c.category}</span>
          </div>
          <p class="concept-desc">${c.shortDescription}</p>
          <div class="concept-meta"><span>${c.minutes} 分钟</span></div>
        </button>`;
      }).join("")
        : `<p class="empty-tip">还没有收藏。去「概念库」点 ♡ 收藏喜欢的概念吧。</p>`}
    </div>`;
  $$(".concept-card", app).forEach(card =>
    card.addEventListener("click", () => openDetail(card.dataset.id)));
}

/* ============ 3. Concept 详情页 ============ */
const detailPage = $("#detail-page");

function openDetail(id) {
  const c = CONCEPTS.find(x => x.id === id);
  if (!c) return;

  detailPage.innerHTML = `
    <div class="detail-inner">
      <div class="detail-topbar">
        <button class="icon-btn" id="detail-back" aria-label="返回">←</button>
        <span class="detail-cat">${c.category} · ${c.minutes} 分钟</span>
        <button class="fav-btn ${isFav(c.id) ? "active" : ""}" id="detail-fav" aria-label="收藏">
          <span class="fav-text">${isFav(c.id) ? "已收藏 ♥" : "收藏 ♡"}</span>
        </button>
      </div>

      <h1 class="detail-title">${c.name}</h1>

      <section class="detail-section">
        <h3 class="section-label"><span class="label-num">1</span>人话解释</h3>
        <p class="human-exp">${c.humanExplanation}</p>
      </section>

      <section class="detail-section">
        <h3 class="section-label"><span class="label-num">2</span>长什么样</h3>
        <div class="demo-box" id="detail-demo"></div>
      </section>

      <section class="detail-section">
        <h3 class="section-label"><span class="label-num">3</span>什么时候用</h3>
        <ul class="usecase-list">
          ${c.useCases.map(u => `<li>${u}</li>`).join("")}
        </ul>
      </section>

      <section class="detail-section">
        <h3 class="section-label"><span class="label-num">4</span>真实工具里的场景</h3>
        <p class="real-world">${c.realWorld}</p>
        <div class="demo-box subtle" id="detail-realworld"></div>
      </section>

      <section class="detail-section">
        <h3 class="section-label"><span class="label-num">5</span>怎么跟 AI 说</h3>
        <pre class="prompt-block">${esc(c.aiPrompt)}</pre>
        <button class="primary-btn" id="copy-prompt">复制这段话发给 AI</button>
      </section>

      <section class="detail-section">
        <div class="code-collapse-toggle" id="code-toggle">
          <span class="arrow">▶</span> 查看代码（选学）
        </div>
        <div class="code-collapse-body" id="code-body">
          <pre class="code-block" id="detail-code"></pre>
        </div>
      </section>

      <button class="learned-btn ${isLearned(c.id) ? "active" : ""}" id="mark-learned">
        ${isLearned(c.id) ? "✓ 已学会（点击取消）" : "标记为已学会"}
      </button>
    </div>`;

  renderDemo(c);
  $("#detail-back").addEventListener("click", closeDetail);
  $("#detail-fav").addEventListener("click", e => toggleFav(c.id, e.currentTarget));
  $("#copy-prompt").addEventListener("click", e => copyText(c.aiPrompt, e.currentTarget, "已复制 ✓"));

  const codeToggle = $("#code-toggle");
  const codeBody = $("#code-body");
  codeToggle.addEventListener("click", () => {
    codeToggle.classList.toggle("open");
    codeBody.classList.toggle("open");
  });

  $("#mark-learned").addEventListener("click", e => {
    learned = isLearned(c.id) ? learned.filter(x => x !== c.id) : [...learned, c.id];
    saveLearned();
    const b = e.currentTarget;
    b.classList.toggle("active", isLearned(c.id));
    b.textContent = isLearned(c.id) ? "✓ 已学会（点击取消）" : "标记为已学会";
  });

  detailPage.hidden = false;
  document.body.style.overflow = "hidden";
  detailPage.scrollTop = 0;
  detailPage.addEventListener("keydown", onDetailEsc);
}

function onDetailEsc(e) { if (e.key === "Escape") closeDetail(); }
function closeDetail() {
  detailPage.hidden = true;
  detailPage.removeEventListener("keydown", onDetailEsc);
  document.body.style.overflow = "";
  renderTab();
}

/* ---------- 每个概念的静态 + 交互 Demo ---------- */
function renderDemo(c) {
  const box = $("#detail-demo");
  const code = $("#detail-code");
  const rw = $("#detail-realworld");
  const D = DEMOS[c.id];
  if (D) D(box, code, rw);
  else { box.innerHTML = `<p class="demo-placeholder">视觉示例见上方解释</p>`; code.textContent = "/* 见交互示例 */"; }
}

/* ============ 4. 交互 Demo ============ */
const DEMOS = {

  /* ---- 结构类：嵌套盒子示意 ---- */
  html(body, code) {
    body.innerHTML = `
      <div class="struct-demo">
        <div class="struct-tag">html</div>
        <div class="struct-box lv1"><span class="struct-tag">body</span>
          <div class="struct-box lv2"><span class="struct-tag">header</span></div>
          <div class="struct-box lv2"><span class="struct-tag">main</span>
            <div class="struct-box lv3"><span class="struct-tag">div / section</span></div>
          </div>
        </div>
      </div>
      <p class="demo-note">一个网页就像套娃：最外面是 html，里面是 body，body 里再放各种内容块。</p>`;
    code.textContent = `<html>\n  <body>\n    <header>…</header>\n    <main>\n      <section>…</section>\n    </main>\n  </body>\n</html>`;
  },

  body(body, code) {
    body.innerHTML = `
      <div class="struct-demo">
        <div class="struct-tag">head（看不见的设置）</div>
        <div class="struct-box lv1 dashed"><span class="struct-tag">body（看得见的一切）</span>
          <div class="struct-box lv3"><span class="struct-tag">导航</span></div>
          <div class="struct-box lv3"><span class="struct-tag">内容</span></div>
          <div class="struct-box lv3"><span class="struct-tag">页脚</span></div>
        </div>
      </div>
      <p class="demo-note">用户看到的所有东西都在 body 里；head 里放标题、字体等看不见的设置。</p>`;
    code.textContent = `body {\n  font-family: system-ui;\n  background: #f7f7f5;\n  margin: 0;\n}`;
  },

  div(body, code) {
    body.innerHTML = `
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <div class="mini-box">Div A</div><div class="mini-box">Div B</div><div class="mini-box">Div C</div>
      </div>
      <p class="demo-note">Div 本身透明，加边框只是为了让你看见它的位置。它的作用是「把东西分组」。</p>`;
    code.textContent = `<div class="row">\n  <div>A</div>\n  <div>B</div>\n  <div>C</div>\n</div>`;
  },

  section(body, code) {
    body.innerHTML = `
      <div class="struct-demo">
        <div class="struct-box lv1"><span class="struct-tag">section: 顶部简介</span></div>
        <div class="struct-box lv1"><span class="struct-tag">section: 功能列表</span></div>
        <div class="struct-box lv1"><span class="struct-tag">section: 页脚</span></div>
      </div>
      <p class="demo-note">页面通常分成多个 section，每个 section 是一块有主题的内容。</p>`;
    code.textContent = `<section id="hero">…</section>\n<section id="features">…</section>\n<section id="footer">…</section>`;
  },

  header(body, code) {
    body.innerHTML = `
      <div class="fake-page">
        <div class="fake-header">
          <strong>◆ Logo</strong><span>菜单 菜单 菜单</span>
        </div>
        <div class="fake-body"></div>
      </div>
      <p class="demo-note">Header 就是页面最上面那一条：放 Logo、标题、导航菜单。</p>`;
    code.textContent = `header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 16px 24px;\n}`;
  },

  /* ---- Container ---- */
  container(body, code) {
    body.innerHTML = `
      <div class="container-demo">
        <div class="container-screen">
          <div class="container-el"></div>
        </div>
        <div class="container-screen narrow">
          <div class="container-el"></div>
        </div>
        <p class="demo-note">灰底是整个屏幕，绿色是内容：屏幕再宽，内容也最多这么宽，两边自动留白。</p>
      </div>`;
    code.textContent = `.container {\n  max-width: 1200px;\n  margin: 0 auto;   /* 左右自动居中 */\n  padding: 0 24px;\n}`;
  },

  /* ---- Flex Playground ---- */
  flex(box, code) {
    box.innerHTML = `
      <div class="flex-stage" id="flex-stage">
        <div class="flex-item">A</div><div class="flex-item">B</div><div class="flex-item">C</div>
      </div>
      <p class="demo-note">点下面的按钮，看 A B C 怎么排列变化。</p>
      <div class="demo-controls">
        <button data-flex="row" class="ctrl active">横向排列</button>
        <button data-flex="column" class="ctrl">纵向排列</button>
        <button data-justify="flex-start" class="ctrl">靠左</button>
        <button data-justify="center" class="ctrl">居中</button>
        <button data-justify="space-between" class="ctrl">两端对齐</button>
        <button data-gap="-1" class="ctrl">间距 −</button>
        <button data-gap="1" class="ctrl">间距 +</button>
      </div>`;
    const st = { dir: "row", justify: "flex-start", gap: 8 };
    const stage = $("#flex-stage", box);
    const update = () => {
      stage.style.flexDirection = st.dir;
      stage.style.justifyContent = st.justify;
      stage.style.gap = st.gap + "px";
      code.textContent = `.容器 {\n  display: flex;\n  flex-direction: ${st.dir}; /* 排列方向 */\n  justify-content: ${st.justify}; /* 对齐方式 */\n  gap: ${st.gap}px; /* 间距 */\n}`;
    };
    $$(".ctrl", box).forEach(b => b.addEventListener("click", () => {
      if (b.dataset.flex) { st.dir = b.dataset.flex; $$("[data-flex]", box).forEach(x => x.classList.toggle("active", x === b)); }
      if (b.dataset.justify) { st.justify = b.dataset.justify; $$("[data-justify]", box).forEach(x => x.classList.toggle("active", x === b)); }
      if (b.dataset.gap) { st.gap = Math.min(64, Math.max(0, st.gap + (+b.dataset.gap) * 8)); }
      update();
    }));
    update();
  },

  /* ---- Grid Playground ---- */
  grid(box, code) {
    box.innerHTML = `
      <div class="grid-stage" id="grid-stage">
        ${"<div class='grid-item'>□</div>".repeat(12)}
      </div>
      <p class="demo-note">点下面的按钮，看格子怎么变列数。</p>
      <div class="demo-controls">
        ${[1, 2, 3, 4].map(n => `<button data-cols="${n}" class="ctrl ${n === 3 ? "active" : ""}">${n} 列</button>`).join("")}
      </div>`;
    const stage = $("#grid-stage", box);
    const update = n => {
      stage.style.gridTemplateColumns = `repeat(${n}, 1fr)`;
      code.textContent = `.网格 {\n  display: grid;\n  grid-template-columns: repeat(${n}, 1fr); /* ${n}列 */\n  gap: 12px;\n}`;
    };
    $$(".ctrl", box).forEach(b => b.addEventListener("click", () => {
      $$(".ctrl", box).forEach(x => x.classList.toggle("active", x === b));
      update(+b.dataset.cols);
    }));
    update(3);
  },

  /* ---- Sidebar / Responsive ---- */
  sidebar(box, code, rw) {
    box.innerHTML = `
      <div class="fake-page sidebar-demo">
        <div class="fake-side">Sidebar</div>
        <div class="fake-main"><div class="fake-card"></div><div class="fake-card"></div></div>
      </div>
      <p class="demo-note">左侧绿色条就是 Sidebar。手机上它通常会藏起来，变成抽屉。</p>`;
    code.textContent = `.layout {\n  display: flex;\n}\n.sidebar {\n  width: 240px;\n}\n@media (max-width: 768px) {\n  .sidebar { display: none; } /* 手机上变 Drawer */\n}`;
    if (rw) rw.innerHTML = `<div class="fake-page sidebar-demo mobile-hint"><div class="fake-main"><div class="fake-card"></div></div></div><p class="demo-note">手机端：Sidebar 隐藏，点击 ☰ 打开 Drawer（抽屉）。</p>`;
  },

  responsive(box, code) {
    box.innerHTML = `
      <div class="resp-row">
        <div class="resp-device"><span class="resp-name">电脑</span>
          <div class="resp-grid cols4">${"<div class='grid-item'>□</div>".repeat(8)}</div></div>
        <div class="resp-device"><span class="resp-name">平板</span>
          <div class="resp-grid cols2">${"<div class='grid-item'>□</div>".repeat(6)}</div></div>
        <div class="resp-device"><span class="resp-name">手机</span>
          <div class="resp-grid cols1">${"<div class='grid-item'>□</div>".repeat(4)}</div></div>
      </div>
      <p class="demo-note">同一个页面，屏幕越窄，列数越少——这就是「响应式」。</p>`;
    code.textContent = `.grid { display: grid; gap: 12px;\n  grid-template-columns: repeat(4, 1fr); }\n@media (max-width: 900px) {\n  .grid { grid-template-columns: repeat(2, 1fr); } }\n@media (max-width: 520px) {\n  .grid { grid-template-columns: 1fr; } }`;
  },

  /* ---- Spacing（Margin / Padding / Gap）---- */
  _spacingStage(box, code, which) {
    const st = { margin: 12, padding: 12 };
    box.innerHTML = `
      <div class="spacing-outer" id="sp-outer">
        <div class="spacing-label">Margin（外面的空隙）</div>
        <div class="spacing-inner" id="sp-inner">
          <div class="spacing-label inner">Padding（里面的空隙）</div>
          <div class="spacing-content">内容</div>
        </div>
      </div>
      <div class="slider-row"><label for="sp-margin">Margin（外间距） <b id="sp-mv">12px</b></label>
        <input type="range" id="sp-margin" min="0" max="48" value="${st.margin}" /></div>
      <div class="slider-row"><label for="sp-padding">Padding（内间距） <b id="sp-pv">12px</b></label>
        <input type="range" id="sp-padding" min="0" max="48" value="${st.padding}" /></div>`;
    const update = () => {
      $("#sp-outer", box).style.padding = st.margin + "px";
      $("#sp-inner", box).style.padding = st.padding + "px";
      $("#sp-mv", box).textContent = st.margin + "px";
      $("#sp-pv", box).textContent = st.padding + "px";
      code.textContent = `.盒子 {\n  margin: ${st.margin}px;   /* 外空隙 */\n  padding: ${st.padding}px; /* 内空隙 */\n}`;
    };
    $("#sp-margin", box).addEventListener("input", e => { st.margin = +e.target.value; update(); });
    $("#sp-padding", box).addEventListener("input", e => { st.padding = +e.target.value; update(); });
    update();
  },

  margin(box, code) { DEMOS._spacingStage(box, code, "margin"); },
  padding(box, code) { DEMOS._spacingStage(box, code, "padding"); },

  gap(box, code) {
    const st = { gap: 12 };
    box.innerHTML = `
      <div class="grid-stage" id="gap-stage">${"<div class='grid-item'>□</div>".repeat(6)}</div>
      <p class="demo-note">拖动滑块，看格子之间的缝隙怎么变化。</p>
      <div class="slider-row"><label for="gap-r">Gap（间距） <b id="gap-v">12px</b></label>
        <input type="range" id="gap-r" min="0" max="48" value="12" /></div>`;
    const update = () => {
      $("#gap-stage", box).style.gap = st.gap + "px";
      $("#gap-v", box).textContent = st.gap + "px";
      code.textContent = `.网格 {\n  display: grid;\n  gap: ${st.gap}px; /* 格子之间的间距 */\n}`;
    };
    $("#gap-r", box).addEventListener("input", e => { st.gap = +e.target.value; update(); });
    update();
  },

  /* ---- Border Radius ---- */
  "border-radius"(box, code) {
    const st = { r: 12 };
    box.innerHTML = `
      <div class="center-demo"><div class="radius-card" id="radius-card">12px</div></div>
      <p class="demo-note">拖动滑块，看方块的角怎么变圆。</p>
      <div class="slider-row"><label for="radius-r">圆角大小 <b id="radius-v">12px</b></label>
        <input type="range" id="radius-r" min="0" max="32" value="12" /></div>`;
    const update = () => {
      $("#radius-card", box).style.borderRadius = st.r + "px";
      $("#radius-card", box).textContent = st.r + "px";
      $("#radius-v", box).textContent = st.r + "px";
      code.textContent = `.卡片 {\n  border-radius: ${st.r}px; /* 圆角 */\n}`;
    };
    $("#radius-r", box).addEventListener("input", e => { st.r = +e.target.value; update(); });
    update();
  },

  /* ---- Shadow ---- */
  shadow(box, code) {
    const shadows = {
      "无": "none",
      "柔和": "0 2px 8px rgba(0,0,0,.08)",
      "中等": "0 6px 16px rgba(0,0,0,.12)",
      "强烈": "0 16px 32px rgba(0,0,0,.18)"
    };
    box.innerHTML = `
      <div class="center-demo"><div class="radius-card" id="shadow-card">卡片</div></div>
      <p class="demo-note">点下面的按钮，看阴影怎么变化。</p>
      <div class="demo-controls">
        ${Object.keys(shadows).map((k, i) => `<button data-shadow="${k}" class="ctrl ${i === 1 ? "active" : ""}">${k}</button>`).join("")}
      </div>`;
    const update = k => {
      $("#shadow-card", box).style.boxShadow = shadows[k];
      code.textContent = `.卡片 {\n  box-shadow: ${shadows[k]}; /* ${k}阴影 */\n}`;
    };
    $$(".ctrl", box).forEach(b => b.addEventListener("click", () => {
      $$(".ctrl", box).forEach(x => x.classList.toggle("active", x === b));
      update(b.dataset.shadow);
    }));
    update("柔和");
  },

  /* ---- Card / Button / Table ---- */
  card(box, code, rw) {
    box.innerHTML = `
      <div class="kpi-card">
        <span class="kpi-label">商品质量检查</span>
        <span class="kpi-value">23</span>
        <span class="kpi-sub">发现异常</span>
        <button class="primary-btn small">查看详情</button>
      </div>
      <p class="demo-note">这就是一张 Card：标题 + 数字 + 操作按钮，装在一个圆角盒子里。</p>`;
    code.textContent = `.card {\n  background: #fff;\n  border-radius: 16px;\n  padding: 24px;\n  box-shadow: 0 2px 8px rgba(0,0,0,.08);\n}`;
    if (rw) rw.innerHTML = `<p class="demo-note">Card 适用于：指标卡 · 工具入口 · 商品 · 检查结果</p>`;
  },

  button(box, code) {
    box.innerHTML = `
      <div class="center-demo wrap">
        <button class="primary-btn">主要按钮</button>
        <button class="ghost-btn">次要按钮</button>
        <button class="danger-btn">危险操作</button>
      </div>
      <p class="demo-note">主要按钮颜色醒目，次要按钮朴素，危险操作用红色提醒。</p>`;
    code.textContent = `.btn-primary {\n  background: var(--accent);\n  color: #fff;\n  border-radius: 8px;\n  padding: 12px 24px;\n}\n.btn-primary:hover { filter: brightness(1.05); }`;
  },

  table(box, code) {
    box.innerHTML = `
      <div class="table-scroll">
        <table class="demo-table">
          <thead><tr><th>品牌</th><th>问题</th><th>状态</th></tr></thead>
          <tbody>
            <tr><td>LANCOME</td><td>分类</td><td><span class="badge err">错误</span></td></tr>
            <tr><td>HR</td><td>重复</td><td><span class="badge rev">待审</span></td></tr>
            <tr><td>Kiehl's</td><td>标签</td><td><span class="badge ok">通过</span></td></tr>
          </tbody>
        </table>
      </div>
      <p class="demo-note">手机端表格可以左右滑动，不会挤爆页面。</p>`;
    code.textContent = `.table-wrap {\n  overflow-x: auto;  /* 窄屏时横向滚动 */\n}\nth { position: sticky; top: 0; }`;
  },

  /* ---- Modal ---- */
  modal(box, code) {
    box.innerHTML = `
      <div class="center-demo"><button class="primary-btn" id="demo-open-modal">点我弹出 Modal</button></div>
      <p class="demo-note">Modal 就是弹窗：页面变暗，中间出现一个小窗口。</p>`;
    code.textContent = `弹窗遮罩 {\n  position: fixed;\n  inset: 0;\n  background: rgba(0,0,0,.4);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}`;
    $("#demo-open-modal", box).addEventListener("click", openGlobalModal);
  },

  /* ---- Drawer ---- */
  drawer(box, code) {
    box.innerHTML = `
      <div class="center-demo"><button class="primary-btn" id="demo-open-drawer">点我滑出 Drawer</button></div>
      <p class="demo-note">Drawer 是从屏幕侧面滑出来的面板，像抽屉一样。</p>`;
    code.textContent = `.抽屉 {\n  position: fixed;\n  top: 0; right: 0; bottom: 0;\n  width: min(320px, 88vw);\n  transform: translateX(100%);\n  transition: transform .2s;\n}`;
    $("#demo-open-drawer", box).addEventListener("click", openGlobalDrawer);
  }
};

/* ---------- 全局 Modal / Drawer（可复用） ---------- */
function openGlobalModal() {
  const ov = document.createElement("div");
  ov.className = "global-overlay";
  ov.innerHTML = `
    <div class="global-modal" role="dialog" aria-modal="true" aria-label="确认操作">
      <h3>确认操作？</h3>
      <p class="modal-text">这个动作将删除选中的 3 条记录。</p>
      <div class="modal-actions">
        <button class="ghost-btn" data-close>取消</button>
        <button class="primary-btn" data-close>确认</button>
      </div>
    </div>`;
  document.body.appendChild(ov);
  requestAnimationFrame(() => ov.classList.add("show"));
  const close = () => { ov.classList.remove("show"); setTimeout(() => ov.remove(), 200); };
  ov.addEventListener("click", e => { if (e.target === ov || e.target.closest("[data-close]")) close(); });
  document.addEventListener("keydown", function esc(e) {
    if (e.key === "Escape") { close(); document.removeEventListener("keydown", esc); }
  });
}

function openGlobalDrawer() {
  const ov = document.createElement("div");
  ov.className = "global-overlay drawer-side";
  ov.innerHTML = `
    <aside class="global-drawer" role="dialog" aria-modal="true" aria-label="菜单">
      <div class="drawer-head"><strong>菜单</strong><button class="icon-btn" data-close aria-label="关闭">×</button></div>
      <nav class="drawer-menu">
        <a href="#" onclick="return false">🏠 首页</a>
        <a href="#" onclick="return false">▦ 概念库</a>
        <a href="#" onclick="return false">▶ Playground</a>
        <a href="#" onclick="return false">♡ 收藏</a>
      </nav>
    </aside>`;
  document.body.appendChild(ov);
  requestAnimationFrame(() => ov.classList.add("show"));
  const close = () => { ov.classList.remove("show"); setTimeout(() => ov.remove(), 200); };
  ov.addEventListener("click", e => { if (e.target === ov || e.target.closest("[data-close]")) close(); });
  document.addEventListener("keydown", function esc(e) {
    if (e.key === "Escape") { close(); document.removeEventListener("keydown", esc); }
  });
}

/* ============ 5. 术语翻译器 ============ */
function openTranslator() {
  const ov = document.createElement("div");
  ov.className = "global-overlay";
  ov.innerHTML = `
    <div class="global-modal translator-modal" role="dialog" aria-modal="true" aria-label="术语翻译器">
      <div class="drawer-head"><strong>🔤 AI 术语翻译器</strong><button class="icon-btn" data-close aria-label="关闭">×</button></div>
      <p class="modal-text">粘贴 AI 说的一句话，我来翻译里面的术语。<br/>比如：<em>Use a sticky header with responsive grid and modal.</em></p>
      <div class="search-wrap">
        <span class="search-icon">🔍</span>
        <input id="tr-input" class="search-input" placeholder="粘贴 AI 的话…" autocomplete="off" />
        <button class="search-clear" id="tr-clear" aria-label="清空" hidden>×</button>
      </div>
      <div id="tr-results" class="tr-results"></div>
    </div>`;
  document.body.appendChild(ov);
  requestAnimationFrame(() => ov.classList.add("show"));
  const close = () => { ov.classList.remove("show"); setTimeout(() => ov.remove(), 200); };
  ov.addEventListener("click", e => { if (e.target === ov || e.target.closest("[data-close]")) close(); });
  document.addEventListener("keydown", function esc(e) {
    if (e.key === "Escape") { close(); document.removeEventListener("keydown", esc); }
  });

  const input = $("#tr-input", ov);
  const clearBtn = $("#tr-clear", ov);
  const results = $("#tr-results", ov);
  input.focus();

  input.addEventListener("input", () => {
    clearBtn.hidden = !input.value;
    const text = input.value.toLowerCase();
    if (!text.trim()) { results.innerHTML = ""; return; }

    const hits = TRANSLATE_MAP.filter(m => text.includes(m.key));
    results.innerHTML = hits.length ? hits.map(m => {
      const c = CONCEPTS.find(x => x.id === m.id);
      return `
        <div class="tr-item">
          <div class="tr-head">
            <strong>${m.display}</strong>
            <button class="link-btn" data-learn="${c.id}">去学习 →</button>
          </div>
          <p>${c.shortDescription}</p>
        </div>`;
    }).join("") : `<p class="empty-tip">没识别到术语，试试包含 flex / grid / modal / sticky 等词。</p>`;

    $$("[data-learn]", results).forEach(b => b.addEventListener("click", () => {
      close(); openDetail(b.dataset.learn);
    }));
  });

  clearBtn.addEventListener("click", () => { input.value = ""; clearBtn.hidden = true; results.innerHTML = ""; input.focus(); });
}

/* ============ 6. Playground 页面 ============ */
function renderPlayground() {
  const state = { width: 100, padding: 24, margin: 0, radius: 16, gap: 16, fontSize: 16, shadow: 1 };

  const shadowOpts = ["none", "0 2px 8px rgba(0,0,0,.08)", "0 6px 16px rgba(0,0,0,.12)", "0 16px 32px rgba(0,0,0,.18)"];

  app.innerHTML = `
    <section class="page-head"><h2 class="page-title">CSS 实时调参</h2>
      <p class="page-sub">拖动滑块，卡片和代码实时变化。</p></section>

    <div class="pg-wrap">
      <div class="pg-preview">
        <div class="pg-card" id="pg-card">
          <strong style="display:block">示例卡片</strong>
          <span style="opacity:.6">这是实时预览的卡片</span>
        </div>
      </div>

      <div class="pg-controls">
        ${[
          ["width", "宽度", 40, 100, "%"],
          ["padding", "内间距", 0, 64, "px"],
          ["margin", "外间距", 0, 64, "px"],
          ["radius", "圆角", 0, 32, "px"],
          ["gap", "间距", 0, 48, "px"],
          ["fontSize", "字号", 12, 28, "px"]
        ].map(([k, label, min, max, unit]) => `
          <div class="slider-row">
            <label for="pg-${k}">${label} <b id="pg-${k}-v"></b></label>
            <input type="range" id="pg-${k}" min="${min}" max="${max}" value="${state[k]}" data-k="${k}" data-unit="${unit}" />
          </div>`).join("")}
        <div class="slider-row">
          <label>阴影</label>
          <div class="demo-controls">
            ${["无", "柔和", "中等", "强烈"].map((s, i) =>
              `<button data-sh="${i}" class="ctrl ${i === state.shadow ? "active" : ""}">${s}</button>`).join("")}
          </div>
        </div>
      </div>

      <pre class="code-block" id="pg-code"></pre>
      <button class="primary-btn" id="pg-copy">复制 CSS 代码</button>
    </div>`;

  const card = $("#pg-card", app);
  const codeEl = $("#pg-code", app);

  const cssText = () => `.demo-card {\n  width: ${state.width}%;\n  padding: ${state.padding}px;\n  margin: ${state.margin}px;\n  border-radius: ${state.radius}px;\n  gap: ${state.gap}px;\n  font-size: ${state.fontSize}px;\n  box-shadow: ${shadowOpts[state.shadow]};\n}`;

  const update = () => {
    card.style.width = state.width + "%";
    card.style.padding = state.padding + "px";
    card.style.margin = state.margin + "px";
    card.style.borderRadius = state.radius + "px";
    card.style.gap = state.gap + "px";
    card.style.fontSize = state.fontSize + "px";
    card.style.boxShadow = shadowOpts[state.shadow];
    $$("input[type=range]", app).forEach(r => {
      const k = r.dataset.k;
      $("#pg-" + k + "-v", app).textContent = r.value + r.dataset.unit;
    });
    codeEl.textContent = cssText();
  };

  $$("input[type=range]", app).forEach(r =>
    r.addEventListener("input", () => { state[r.dataset.k] = +r.value; update(); }));
  $$("[data-sh]", app).forEach(b => b.addEventListener("click", () => {
    state.shadow = +b.dataset.sh;
    $$("[data-sh]", app).forEach(x => x.classList.toggle("active", x === b));
    update();
  }));
  $("#pg-copy", app).addEventListener("click", e => copyText(cssText(), e.currentTarget, "CSS 已复制 ✓"));

  update();
}

/* ============ 启动 ============ */
$$(".nav-item").forEach(b => b.addEventListener("click", () => switchTab(b.dataset.tab)));
renderTab();
