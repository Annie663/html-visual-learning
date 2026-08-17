# HTML Visual Learning

**AI 前端术语可视化学习工具**

## Purpose（这个工具是做什么的？）

当你用 AI Coding Agent（Codex、Trae、Zcode 等）开发 HTML 小工具时，AI 经常说 Flex、Grid、Modal、Drawer、Sticky 这些术语——看不懂它们，就很难向 AI 准确描述需求、审查 AI 的方案。

这个工具帮你：

- 看懂 AI 使用的前端术语
- 直观看到每个术语对应的视觉效果（真实可交互的 Demo）
- 学会把页面拆成组件
- 一键复制可以直接发给 AI 的需求描述（Prompt）
- 在手机上利用碎片时间学习

## Run（如何运行）

**方式一（最简单）：** 直接双击 `index.html`，用 Chrome 或 Safari 打开即可。本项目没有使用 ES Module，双击打开不会有跨域问题。

**方式二（可选）：** 如果你想用本地服务器：

```bash
cd html-visual-learning
python3 -m http.server 8000
# 浏览器打开 http://localhost:8000
```

## Structure（每个文件是什么？）

完全没有前端基础也没关系，把一个网页想象成一个人：

| 文件 | 比喻 | 作用 |
|------|------|------|
| `index.html` | 骨架 | 定义页面上"有哪东西"：标题、按钮、导航栏。双击打开的就是它 |
| `css/style.css` | 衣服 | 决定每个东西"长什么样"：颜色、大小、间距、圆角 |
| `js/data.js` | 教材 | 存放 20 个概念的文字内容（解释、使用场景、AI Prompt），想加新概念改这里 |
| `js/app.js` | 大脑 | 页面的行为：点击后发生什么、交互 Demo、收藏、搜索 |
| `assets/` | 素材 | 放图片、图标等资源（目前为空） |

## Features

- 4 个 Tab：学习 / 组件 / Playground / 收藏
- 20 个概念，每个都有：一句话解释、可视化 Demo、实时代码、使用场景、可复制的 AI Prompt
- 重点交互 Demo：Flex Playground、Grid Playground、Margin/Padding 盒子图、圆角/阴影滑块、真实 Modal 和 Drawer
- Visual CSS Playground：滑块调卡片样式，实时生成 CSS 并可复制
- AI 术语翻译器：粘贴 AI 说的话，本地关键词识别并解释
- 收藏与学习进度：保存在浏览器 localStorage，刷新不丢失
- 搜索与分类筛选
- Mobile First，适配 iPhone 安全区（Home Indicator 不遮挡）

## 添加新概念

打开 `js/data.js`，在 `CONCEPTS` 数组里照着现有格式加一项即可，页面会自动展示。
