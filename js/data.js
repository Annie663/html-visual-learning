/*
 * data.js — 所有 Concept 的内容数据
 * 以后想增加新概念，只需在 CONCEPTS 数组里加一项即可，
 * 页面会自动展示，不需要改 app.js。
 */
const CONCEPTS = [
  // ============ Structure 结构 ============
  {
    id: "html",
    name: "HTML",
    category: "Structure",
    minutes: 2,
    shortDescription: "网页的骨架语言，浏览器靠它知道页面上有什么。",
    humanExplanation: "HTML 就是网页的骨架。它告诉浏览器：这里是标题、这里是图片、这里是按钮。",
    useCases: ["任何网页的最外层结构", "给 AI 描述页面时说「生成一个 HTML 页面」"],
    realWorld: "你让 AI 做的每一个 HTML 小工具，本质都是一个 .html 文件：结构(HTML) + 样式(CSS) + 行为(JavaScript)。",
    aiPrompt: "请生成一个单文件 HTML 页面，包含 CSS 和 JavaScript，双击浏览器即可打开。",
    keywords: ["html", "页面", "骨架"]
  },
  {
    id: "body",
    name: "Body",
    category: "Structure",
    minutes: 2,
    shortDescription: "页面上所有看得见的内容都放在 Body 里。",
    humanExplanation: "Body 就是页面的「身体」：用户在网页上看到的一切文字、图片、按钮，都在 <body> 里面。",
    useCases: ["页面可见内容的总容器", "全局字体、背景色通常设置在 body 上"],
    realWorld: "AI 说「在 body 末尾引入 script」，意思是把 JavaScript 放在页面内容之后加载。",
    aiPrompt: "在 body 上设置全局字体 16px、背景色浅灰，所有页面共用这个基础样式。",
    keywords: ["body"]
  },
  {
    id: "div",
    name: "Div",
    category: "Structure",
    minutes: 2,
    shortDescription: "一个通用的「盒子」，用来把内容分组。",
    humanExplanation: "Div 就是一个看不见的盒子。它本身没有任何外观，作用是把一堆东西包在一起，方便整体排版。",
    useCases: ["把相关内容包成一组", "配合 Flex/Grid 做布局"],
    realWorld: "AI 生成的代码里会有大量 <div>，可以理解为「这里有一块东西」。",
    aiPrompt: "把标题和按钮包在同一个 div 里，用 flex 横向排列。",
    keywords: ["div", "盒子"]
  },
  {
    id: "section",
    name: "Section",
    category: "Structure",
    minutes: 2,
    shortDescription: "语义化的「章节」，表示一块有主题的内容。",
    humanExplanation: "Section 和 Div 长得一样，但它告诉浏览器和 AI：这一块是一个独立的内容章节，比如「学习进度区」「工具列表区」。",
    useCases: ["首页的各个内容区块", "让代码更有可读性"],
    realWorld: "首页通常分成 hero section、功能 section、footer section 等多个 section。",
    aiPrompt: "首页分为三个 section：顶部简介、功能列表、页脚，各 section 之间留 48px 间距。",
    keywords: ["section", "章节"]
  },
  {
    id: "header",
    name: "Header",
    category: "Structure",
    minutes: 2,
    shortDescription: "页面或区块顶部的那一条。",
    humanExplanation: "Header 就是页面最上面那一条：放 Logo、标题、导航菜单的地方。",
    useCases: ["页面顶部 Logo + 菜单", "卡片顶部的小标题区"],
    realWorld: "让 AI 做「sticky header」，就是滚动时这条固定不动。",
    aiPrompt: "页面顶部做一个 header：左边 Logo，右边导航菜单，使用 flex space-between。",
    keywords: ["header", "页头", "顶栏"]
  },

  // ============ Layout 布局 ============
  {
    id: "container",
    name: "Container",
    category: "Layout",
    minutes: 2,
    shortDescription: "限制内容最大宽度，让页面在大屏上不至于拉太宽。",
    humanExplanation: "Container 是一个宽度受限的容器：屏幕再宽，内容也最多 1200px 左右，居中显示，两边留白。",
    useCases: ["桌面端内容居中", "控制阅读宽度"],
    realWorld: "桌面端打开一个网站，内容总是集中在中间，不会横跨整个屏幕，就是 Container 在起作用。",
    aiPrompt: "使用 max-width 1200px 的居中 container，左右 padding 24px。",
    keywords: ["container", "容器", "wrapper"]
  },
  {
    id: "flex",
    name: "Flex",
    category: "Layout",
    minutes: 3,
    shortDescription: "控制一组元素如何横向或纵向排列。",
    humanExplanation: "Flex 就是决定一排或一列东西怎么排列：靠左、居中、分散、对齐，都是 Flex 说了算。",
    useCases: ["顶部导航", "按钮组", "KPI Card 排列", "Filter Bar", "一行多个组件"],
    realWorld: "数据分析工具里的 Filter Bar：左边几个下拉筛选器、右边 Export 按钮、两端对齐、垂直居中 —— 这就是典型的 Flex。",
    aiPrompt: "Filter Bar 使用 Flex 横向布局。左侧放筛选器，右侧放 Export Button。两端使用 space-between，所有元素垂直居中。",
    keywords: ["flex", "flexbox", "排列"]
  },
  {
    id: "grid",
    name: "Grid",
    category: "Layout",
    minutes: 3,
    shortDescription: "把页面分成行和列，像表格一样摆放元素。",
    humanExplanation: "Grid 就是把一块区域划成整齐的格子，东西一个格一个格地放。一行放 3 个卡片，就是 3 列 Grid。",
    useCases: ["卡片列表", "图片墙", "仪表盘", "表单"],
    realWorld: "工具首页一排 4 个功能卡片、手机上变成一列，就是 Responsive Grid。",
    aiPrompt: "功能卡片使用 Grid 布局，桌面 4 列、平板 2 列、手机 1 列，间距 gap 16px。",
    keywords: ["grid", "格子", "网格"]
  },
  {
    id: "sidebar",
    name: "Sidebar",
    category: "Layout",
    minutes: 3,
    shortDescription: "桌面端固定在左侧的导航栏，手机上通常变成抽屉。",
    humanExplanation: "Sidebar 是贴在页面左侧的一条导航栏。屏幕窄的时候它通常藏起来，点按钮才滑出来（变成 Drawer）。",
    useCases: ["后台/Dashboard 导航", "文档站点的目录"],
    realWorld: "让 AI 做 Dashboard 时说「左侧 Sidebar + 右侧主内容区」，AI 就会搭出经典后台布局。",
    aiPrompt: "做一个 Dashboard：桌面端左侧固定 240px Sidebar，右侧是主内容区；手机端 Sidebar 变为可滑出的 Drawer。",
    keywords: ["sidebar", "侧边栏", "侧栏"]
  },
  {
    id: "responsive",
    name: "Responsive",
    category: "Layout",
    minutes: 3,
    shortDescription: "同一个页面根据屏幕宽度自动改变布局。",
    humanExplanation: "Responsive（响应式）= 电脑上 4 个一排，平板 2 个一排，手机 1 个一列 —— 页面自己适应屏幕，不需要做两个版本。",
    useCases: ["任何需要手机 + 电脑同时可用的页面"],
    realWorld: "电脑上打开是整齐的多列，手机上打开自动变单列，内容一样但布局不同。",
    aiPrompt: "页面需要 Responsive：桌面 4 列 Grid，768px 以下 2 列，480px 以下 1 列。",
    keywords: ["responsive", "响应式", "自适应"]
  },

  // ============ Style 样式 ============
  {
    id: "margin",
    name: "Margin",
    category: "Style",
    minutes: 2,
    shortDescription: "元素外面的空隙，把它和邻居隔开。",
    humanExplanation: "Margin 是盒子外面的空白：盒子之间离多远，由 Margin 决定。",
    useCases: ["卡片之间的间距", "标题和正文的间隔"],
    realWorld: "「卡片之间 margin 16px」= 卡片彼此隔开 16px 的距离。",
    aiPrompt: "每张卡片之间使用 margin-bottom 16px 隔开，不要贴在一起。",
    keywords: ["margin", "外边距", "外间距"]
  },
  {
    id: "padding",
    name: "Padding",
    category: "Style",
    minutes: 2,
    shortDescription: "元素里面的空隙，让内容不贴边。",
    humanExplanation: "Padding 是盒子内壁的填充：文字和盒子边缘之间的距离。Padding 越大，盒子显得越「胖」。",
    useCases: ["按钮内文字留白", "卡片内内容呼吸感"],
    realWorld: "「按钮 padding 12px 24px」= 按钮里的文字距离上下边 12px、左右边 24px。",
    aiPrompt: "卡片内边距 padding 24px，按钮 padding 12px 24px，保证内容不贴边。",
    keywords: ["padding", "内边距", "内间距"]
  },
  {
    id: "gap",
    name: "Gap",
    category: "Style",
    minutes: 2,
    shortDescription: "Flex/Grid 布局里子元素之间的统一间距。",
    humanExplanation: "Gap 是一组元素之间的「缝隙」：设置 gap 16px，这一排东西彼此都隔 16px，不用一个个设 Margin。",
    useCases: ["Grid 卡片间距", "按钮组间距", "替代逐个设置 margin"],
    realWorld: "「Grid gap 16px」比给每张卡片写 margin 更简洁，是现代布局的首选。",
    aiPrompt: "卡片列表使用 Grid + gap 16px 控制间距，不要用 margin。",
    keywords: ["gap", "间距"]
  },
  {
    id: "border-radius",
    name: "Border Radius",
    category: "Style",
    minutes: 2,
    shortDescription: "圆角：让方形的角变圆润。",
    humanExplanation: "Border Radius 控制角的圆润程度：0 是直角，越大越圆，到 50% 就变成圆。",
    useCases: ["卡片圆角", "圆形头像", "胶囊形按钮"],
    realWorld: "现代 App 的卡片通常有 12-16px 圆角，看起来更柔和。",
    aiPrompt: "卡片使用 border-radius 16px，头像使用 50% 变成圆形。",
    keywords: ["radius", "border-radius", "圆角"]
  },
  {
    id: "shadow",
    name: "Shadow",
    category: "Style",
    minutes: 2,
    shortDescription: "阴影：让元素看起来浮在页面上。",
    humanExplanation: "Shadow 给元素加影子，产生「浮起来」的层次感。Soft 阴影若隐若现，Strong 阴影浮得很高。",
    useCases: ["卡片浮起感", "Modal / Dropdown 的层次", "Hover 反馈"],
    realWorld: "弹出 Modal 时加明显的 shadow，让它看起来在页面「上方」。",
    aiPrompt: "卡片使用柔和的 shadow（低透明度、大模糊），hover 时轻微上浮加深阴影。",
    keywords: ["shadow", "阴影", "box-shadow"]
  },

  // ============ UI Components 组件 ============
  {
    id: "card",
    name: "Card",
    category: "UI",
    minutes: 3,
    shortDescription: "把一组相关信息装在一个圆角小盒子里。",
    humanExplanation: "Card 就是一张小卡片：一个标题、一点内容、一个按钮，装在有边框圆角阴影的盒子里。",
    useCases: ["KPI 指标", "工具入口", "Dashboard 模块", "商品", "检查结果"],
    realWorld: "数据工具里的 KPI Card：「发现异常 23，[查看详情]」—— 一个数字加一个操作，装在一张卡里。",
    aiPrompt: "做一个 KPI Card：标题「发现异常」，大数字 23，底部一个「查看详情」按钮，圆角 16px 加柔和阴影。",
    keywords: ["card", "卡片"]
  },
  {
    id: "button",
    name: "Button",
    category: "UI",
    minutes: 2,
    shortDescription: "可点击的按钮，页面的主要操作入口。",
    humanExplanation: "Button 就是按钮。主要按钮（Primary）颜色醒目，次要按钮（Secondary）朴素一些，危险操作通常用红色。",
    useCases: ["提交表单", "确认 / 取消", "导出数据"],
    realWorld: "「主按钮 + 次按钮」是 Modal 的标准搭配：Confirm 醒目、Cancel 朴素。",
    aiPrompt: "主按钮使用品牌色实心、圆角 8px；次按钮使用描边样式，hover 时轻微变色。",
    keywords: ["button", "按钮"]
  },
  {
    id: "table",
    name: "Table",
    category: "UI",
    minutes: 3,
    shortDescription: "用行和列展示结构化数据。",
    humanExplanation: "Table 就是表格：一行一条数据，一列一个字段。手机屏幕窄时，表格通常可以左右滑动。",
    useCases: ["数据列表", "检查结果", "对比信息"],
    realWorld: "「LANCOME / Category / Error」这样的数据行，用 Table 展示最清晰；手机端做成可横向滚动。",
    aiPrompt: "用 Table 展示数据：表头吸顶（sticky），手机端容器可横向滚动，不要挤爆页面。",
    keywords: ["table", "表格"]
  },
  {
    id: "modal",
    name: "Modal",
    category: "UI",
    minutes: 3,
    shortDescription: "点击按钮后，浮在当前页面上方的弹窗。",
    humanExplanation: "Modal 是弹窗：页面变暗，中间出现一个小窗口让你确认操作，关掉后回到原页面。",
    useCases: ["确认删除", "填写表单", "展示详情"],
    realWorld: "点「删除」后弹出「确认操作？Cancel / Confirm」—— 这是 Modal 最常见的用法。",
    aiPrompt: "点击删除按钮弹出确认 Modal：半透明遮罩，居中卡片，含 Cancel 和 Confirm 按钮，ESC 或点遮罩可关闭。",
    keywords: ["modal", "弹窗", "对话框", "dialog", "popup"]
  },
  {
    id: "drawer",
    name: "Drawer",
    category: "UI",
    minutes: 3,
    shortDescription: "从屏幕侧面滑出来的面板。",
    humanExplanation: "Drawer 是抽屉：从右边（或左边）滑出来一块面板，可以放菜单、筛选器或表单。",
    useCases: ["手机端导航菜单", "筛选面板", "侧边详情"],
    realWorld: "手机端点☰按钮从侧面滑出的菜单，就是 Drawer；桌面端 Sidebar 在手机上通常就变成 Drawer。",
    aiPrompt: "做一个从右侧滑出的 Drawer，手机端接近全屏宽度，含关闭按钮，点遮罩可关闭。",
    keywords: ["drawer", "抽屉", "侧滑", "slide-over"]
  }
];

/*
 * 术语翻译器：AI 常用说法 → 关键词
 * value 是 CONCEPTS 里的 id
 */
const TRANSLATE_MAP = [
  { key: "sticky", id: "header", display: "Sticky Header" },
  { key: "responsive", id: "responsive", display: "Responsive" },
  { key: "grid", id: "grid", display: "Responsive Grid" },
  { key: "modal", id: "modal", display: "Modal" },
  { key: "dialog", id: "modal", display: "Dialog (= Modal)" },
  { key: "popup", id: "modal", display: "Popup (= Modal)" },
  { key: "flex", id: "flex", display: "Flex" },
  { key: "drawer", id: "drawer", display: "Drawer" },
  { key: "slide-over", id: "drawer", display: "Slide-over (= Drawer)" },
  { key: "sidebar", id: "sidebar", display: "Sidebar" },
  { key: "card", id: "card", display: "Card" },
  { key: "padding", id: "padding", display: "Padding" },
  { key: "margin", id: "margin", display: "Margin" },
  { key: "gap", id: "gap", display: "Gap" },
  { key: "radius", id: "border-radius", display: "Border Radius" },
  { key: "shadow", id: "shadow", display: "Shadow" },
  { key: "button", id: "button", display: "Button" },
  { key: "table", id: "table", display: "Table" },
  { key: "container", id: "container", display: "Container" },
  { key: "header", id: "header", display: "Header" },
  { key: "hover", id: "shadow", display: "Hover" }
];

/* 首页四大模块 */
const MODULES = [
  { id: "Structure", num: "01", title: "Structure", subtitle: "页面有什么？", desc: "HTML · Body · Div · Section · Header" },
  { id: "Layout", num: "02", title: "Layout", subtitle: "东西放哪里？", desc: "Container · Flex · Grid · Sidebar · Responsive" },
  { id: "Style", num: "03", title: "Style", subtitle: "东西长什么样？", desc: "Margin · Padding · Gap · Radius · Shadow" },
  { id: "UI", num: "04", title: "UI Components", subtitle: "页面怎么动？", desc: "Card · Button · Table · Modal · Drawer" }
];
