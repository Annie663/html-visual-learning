# 微信小程序迁移指南

> 本文档说明：如果未来要把当前 H5 版本的「HTML Visual Learning」正式迁移为微信小程序，需要做什么。
>
> **当前阶段原则：H5 已满足需求，不要为了小程序而重构。** 本文档仅为未来准备。

---

## 1. 注册 / 准备什么

| 项目 | 说明 |
|------|------|
| 微信小程序账号 | 到 [mp.weixin.qq.com](https://mp.weixin.qq.com/) 注册「小程序」类型账号（个人主体免费，但不能做支付类目） |
| AppID | 注册后在「开发 → 开发管理 → 开发设置」拿到 AppID，开发时必填 |
| 服务器域名 | 小程序如果要请求外部接口需在后台配置 `request 合法域名`；本项目纯本地数据，**暂时不需要** |
| 业务域名（可选） | 如果将来要在公众号菜单 / 微信外打开 H5，需要配置业务域名并校验文件；当前 CloudStudio 托管链接无需此步 |

个人主体限制：不能做支付、不能做直播、类目有限。学习类工具完全够用。

---

## 2. 微信开发者工具需要什么

1. 下载 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)（稳定版）
2. 用注册的 AppID 登录
3. 新建项目 → 选「小程序」→ 填 AppID → 选「不使用云开发」（本项目不需要后端）
4. 项目结构会自动生成：
   ```
   ├── app.js          小程序入口逻辑
   ├── app.json        全局配置（页面路由、tabBar、窗口样式）
   ├── app.wxss        全局样式
   ├── pages/
   │   ├── home/
   │   │   ├── home.wxml
   │   │   ├── home.wxss
   │   │   ├── home.js
   │   │   └── home.json
   │   └── ...
   └── ...
   ```

---

## 3. 当前文件 → 小程序文件 对应关系

| H5 当前文件 | 小程序对应 | 说明 |
|-------------|-----------|------|
| `index.html`（页面结构） | `*.wxml` | 每个页面一个 wxml。HTML 标签要换成小程序组件 |
| `css/style.css` | `app.wxss` + 各页面的 `*.wxss` | 全局样式放 app.wxss，页面特有样式放页面 wxss |
| `js/app.js`（渲染逻辑） | 各页面 `*.js` + `app.js` | 渲染逻辑要拆到每个页面的 js，用 `setData` 驱动视图 |
| `js/data.js`（数据） | `utils/data.js`（`module.exports`） | 数据可基本原样保留，改成 CommonJS 导出 |
| `assets/` | 同名目录 | 静态资源直接搬，路径照旧 |
| `localStorage` | `wx.setStorageSync` / `wx.getStorageSync` | API 换名，逻辑不变 |
| `navigator.clipboard` / `execCommand` | `wx.setClipboardData` | 复制功能换 API |
| 底部 `<nav>` | `app.json` 里的 `tabBar` 配置 | 小程序原生 tabBar，不用自己写 |

### HTML 标签 → 小程序组件 映射

| HTML | 小程序 | 备注 |
|------|--------|------|
| `<div>` | `<view>` | 最常用替换 |
| `<span>` / `<p>` / `<strong>` / `<em>` | `<text>` | 小程序里文本节点必须用 `<text>` 才能选中 |
| `<img>` | `<image>` | 注意 mode 属性 |
| `<button>` | `<button>` | 保留，但样式系统不同 |
| `<input type="search">` | `<input>` | 搜索框，事件名换 `bindinput` |
| `<input type="range">` | `<slider>` | **注意：滑块要换成 slider 组件**，原生 range 不支持 |
| `<table>` | 自己用 `<view>` 拼，或用扩展组件 | 小程序没有原生 table |
| `<nav>` | tabBar 或 `<view>` | 看场景 |
| `<a href>` | `<navigator>` | 跳页用 navigator |
| `<ul><li>` | `<view>` 循环 | 用 `wx:for` |

---

## 4. 哪些组件需要改写

按工作量从大到小排序：

### 🔴 重写（工作量大）

| 组件 | 原因 |
|------|------|
| **Playground 调参页** | 用了大量 `<input type="range">`，要全部换成 `<slider>` 组件，事件绑定方式不同 |
| **Concept 详情页** | 现在是单页 + innerHTML 动态渲染；小程序不允许 innerHTML，要拆成独立页面 + wxml 模板 + setData |
| **交互 Demo（Flex/Grid/Spacing/Radius/Shadow）** | 现在靠 `box.innerHTML = ...` 动态注入；小程序要改成 wxml 静态结构 + 数据驱动 |
| **全局 Modal / Drawer** | 现在用 `document.createElement` 动态创建；小程序要用 wxml + `hidden`/`wx:if` 控制，或用原生 `wx.showModal`（功能有限） |

### 🟡 改造（工作量中等）

| 组件 | 原因 |
|------|------|
| **术语翻译器** | 输入框、结果列表要改成 wxml + bindinput；识别逻辑（关键词匹配）可原样复用 |
| **搜索 + 筛选** | 事件名从 `addEventListener('input')` 换成 `bindinput`；筛选逻辑复用 |
| **收藏 / 学习进度** | localStorage → wx.setStorageSync，逻辑几乎不变 |

### 🟢 基本原样（工作量小）

| 组件 | 原因 |
|------|------|
| **数据层 `data.js`** | CONCEPTS / TRANSLATE_MAP / MODULES 数组结构原样保留，只改导出方式 |
| **概念数据内容** | 文字、Prompt、useCases 全部复用，零改动 |
| **样式变量** | CSS Variables → WXSS 不完全支持 `:root` 变量，但可以改成 `page{}` 选择器或用 SCSS 预处理；变量值原样保留 |

---

## 5. 哪些代码可以复用

几乎所有的**业务逻辑**都可以复用，要换的只是**视图层 API**：

| 可直接复用 | 要改的 |
|-----------|--------|
| CONCEPTS 数据结构 | innerHTML → setData + wxml |
| TRANSLATE_MAP 翻译逻辑 | addEventListener → bind 事件 |
| 收藏 / 已学的数组操作 | localStorage → wx.setStorageSync |
| 搜索 / 筛选的 filter 逻辑 | DOM 操作 → 数据驱动 |
| isFav / isLearned 判断函数 | copyText → wx.setClipboardData |
| 关键词匹配算法 | document.createElement → wxml + wx:if |

**复用率预估：业务逻辑 80% 可复用，视图层 100% 要重写。**

---

## 6. 哪些功能风险最大

按风险等级排序：

### ⛔ 高风险

1. **Playground 的实时样式预览**
   - H5 靠 `element.style.xxx = ...` 直接改 DOM 样式，所见即所得
   - 小程序不能直接操作 DOM 样式，要通过 setData 改数据，再在 wxml 用 `style="{{...}}"` 绑定
   - 滑块拖动时频繁 setData 可能卡顿，要考虑节流

2. **innerHTML 动态渲染**
   - 现在所有 Demo 都用 `box.innerHTML = \`...\`` 注入
   - 小程序**完全不支持** innerHTML，每个 Demo 要写成静态 wxml + 数据绑定
   - 这是工作量最大的一块

3. **动态创建 Modal/Drawer**
   - `document.createElement('div')` 在小程序里不存在
   - 要改成全局 wxml + 状态控制，或用小程序原生组件

### ⚠️ 中风险

4. **CSS Variables**
   - 小程序 WXSS 对 CSS 变量支持有限（部分基础库版本不支持 `:root`）
   - 可能要降级为静态值或用 SCSS

5. **backdrop-filter（毛玻璃）**
   - 小程序支持率不稳定，可能要降级为半透明背景

6. **sticky 定位**
   - 小程序对 `position: sticky` 支持有限，顶栏吸顶可能要用 `scroll-view` + 监听滚动

### ✅ 低风险

7. **localStorage** → `wx.setStorageSync`（几乎无痛）
8. **clipboard** → `wx.setClipboardData`（API 更简单）
9. **数据内容** → 零改动

---

## 7. 预计迁移顺序

推荐分 5 个阶段，每个阶段都能独立跑起来：

### 阶段 1：骨架与数据（1 天）
- 新建小程序项目
- 搬 `data.js` → `utils/data.js`（改 module.exports）
- 配 `app.json`：4 个 tabBar（首页 / 概念库 / 调参 / 收藏）
- 写 `app.wxss`：把 `:root` 变量改成 `page{}`
- 目标：tabBar 能切换，页面是空白但能跑

### 阶段 2：首页 + 概念列表（1-2 天）
- 首页 hero、进度卡、模块卡、翻译器入口
- 概念库列表 + 搜索 + 筛选
- localStorage → wx.setStorageSync（收藏、进度）
- 目标：能浏览概念、能搜索、能收藏、进度能保存

### 阶段 3：概念详情页（2-3 天）
- 详情页结构（人话解释、长什么样、什么时候用、真实场景、AI Prompt）
- 复制 Prompt → wx.setClipboardData
- 标记已学
- 目标：能看每个概念的完整内容，能复制 Prompt

### 阶段 4：交互 Demo（3-5 天，最重）
- 逐个移植 20 个概念的 Demo
- 重点：Flex / Grid / Spacing / Radius / Shadow / Modal / Drawer
- range 滑块 → slider 组件
- innerHTML → wxml 静态结构
- 目标：所有 Demo 可交互

### 阶段 5：Playground + 翻译器（2 天）
- CSS 实时调参页（slider + setData + style 绑定）
- 术语翻译器（输入框 + 关键词匹配 + 结果列表）
- 目标：功能对齐 H5

**总预估：个人开发 9-13 个工作日**（假设熟悉小程序；不熟悉要加 2-3 天学习成本）

---

## 结论

| 维度 | H5（当前） | 小程序 |
|------|-----------|--------|
| 部署成本 | 已完成，零代码改动 | 9-13 天重写 |
| 微信体验 | 在微信里打开网页，可收藏/加桌面 | 原生体验，可分享卡片 |
| 更新便利 | 改代码重新部署即可 | 要提交审核（1-7 天） |
| 离线使用 | 不支持 | 支持本地缓存 |
| 数据存储 | localStorage（按域名隔离） | wx.storage（按小程序隔离） |

**建议：现阶段保持 H5。** 除非有以下需求之一，再考虑迁移：
- 需要分享到微信群带卡片封面
- 需要离线使用
- 需要更好的原生滚动/手势体验
- 需要接入微信登录 / 支付

否则 H5 + 微信打开 + 加到桌面，已经覆盖 95% 的个人学习场景。
