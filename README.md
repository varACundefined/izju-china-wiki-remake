# Wiki Remake (静态网站)

这是一个使用 Node.js（Express）托管的静态网站示例，包含：左侧固定侧边栏（左上角有首页图片按钮、左下角有回到顶部图片按钮）、底部图片、以及所有下属页面右侧的目录（TOC）。

## 快速开始

1. 安装依赖：

```bash
cd d:\igem\wiki-remake
npm install
```

2. 启动服务器：

```bash
npm start
# 或者开发时： npm run dev
```

3. 打开浏览器访问 http://localhost:3000

## 编辑网站内容

- 页面位置：`public/`。
  - 主页：`public/index.html`。
  - 下属页面：`public/pages/*.html`。
- 侧边栏导航：每个页面中有 `<nav class="site-nav">`，在这里添加或移除链接来更新导航。
- 页面右侧目录（TOC）：只需在页面中使用 `h2`/`h3` 标题，脚本会自动根据标题生成目录（页面中必须有 `<aside id="toc"></aside>` 才会启用）。
- 样式/脚本：`public/assets/css/styles.css` 与 `public/assets/js/main.js`。
- 响应式支持：在小屏幕上侧边栏会折叠为可切换的汉堡按钮（`.sidebar-toggle`），右侧 TOC 会变为可弹出的面板（`.toc.open`），可通过上述 CSS/JS 调整其行为。
- 图片：放在 `public/assets/images` 下，`home.svg` 为首页图标，`top.svg` 为回到顶部图标，`footer.svg` 为底部图片。
- 响应式图片：站点样式会使图片在容器变窄时按比例缩放。站点会根据侧边栏/TOC/页脚的实际尺寸动态调整内容容器（通过 JS 测量元素并设置 CSS 变量 `--sidebar-width`, `--toc-width`, `--footer-height`），因此不需要手动调整容器宽度。若要为不同分辨率提供不同资源，请使用 `srcset` 与 `sizes`，示例：

```html
<img src="/assets/images/footer-1x.png" srcset="/assets/images/footer-1x.png 1x, /assets/images/footer-2x.png 2x" alt="页脚图片" class="responsive-img" />
```

- 推荐：图标使用 SVG（缩放清晰），内容图像添加 `class="responsive-img"` 或直接使用 `<img>`（默认样式已使其自适应）。

## 新增页面建议

- 复制 `public/pages/page1.html`，修改标题和内容，确保页面包含 `<main>` 内的标题（`h2`/`h3`）以生成右侧 TOC。
- 在所有页面的侧边栏导航（`<nav class="site-nav">`）中为新页面添加链接。

---

如果需要我为你添加更多示例页面或把站点改为模版化（例如用 EJS 或其他静态生成器），告诉我你的偏好。