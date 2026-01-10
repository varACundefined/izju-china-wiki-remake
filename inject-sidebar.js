// 自动为所有 public/pages 下的 html 网页补全侧边栏和目录容器（如没有则插入标准结构）
function ensureSidebarAndToc(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  // 0. 确保样式与视口
  if (!/<link[^>]+href=["'][^"']*\/assets\/css\/styles\.css["'][^>]*>/.test(html)) {
    html = html.replace(/(<\/head>)/i, `  <link rel="stylesheet" href="/assets/css/styles.css">\n$1`);
    changed = true;
  }
  if (!/<meta[^>]+name=["']viewport["'][^>]*>/.test(html)) {
    html = html.replace(/(<head[^>]*>)/i, `$1\n  <meta name="viewport" content="width=device-width, initial-scale=1">`);
    changed = true;
  }
  // 1. 检查并插入 <aside class="sidebar"> ... </aside>
  if (!/<aside class="sidebar">[\s\S]*?<\/aside>/.test(html)) {
    // 插入到 <body> 后
    html = html.replace(/(<body[^>]*>)/i, `$1\n  <button class="sidebar-toggle" aria-label="切换导航" aria-expanded="false">☰</button>\n  <aside class="sidebar">\n    <a class="home" href="/">` +
      `<img src="/assets/images/menu.webp" alt="主页"></a>\n    <!--SIDEBAR-START-->\n    <!-- 侧边栏内容将由 inject-sidebar.js 自动注入 -->\n    <!--SIDEBAR-END-->\n    <a class="back-to-top" href="#" title="回到顶部"><img src="/assets/images/uptotop.webp" alt="回到顶部"></a>\n  </aside>`);
    changed = true;
  } else if (!/<!--SIDEBAR-START-->[\s\S]*?<!--SIDEBAR-END-->/.test(html)) {
    // 已有 aside 但无注入标记
    html = html.replace(/(<aside class="sidebar">[\s\S]*?<a class="home"[\s\S]*?<\/a>)/,
      `$1\n    <!--SIDEBAR-START-->\n    <!-- 侧边栏内容将由 inject-sidebar.js 自动注入 -->\n    <!--SIDEBAR-END-->`);
    changed = true;
  }
  // 1.1 确保存在侧边栏切换按钮
  if (!/<button[^>]*class=["'][^"']*sidebar-toggle[^"']*["'][^>]*>/.test(html)) {
    html = html.replace(/(<body[^>]*>)/i, `$1\n  <button class="sidebar-toggle" aria-label="切换导航" aria-expanded="false">☰</button>`);
    changed = true;
  }
  // 2. 检查并插入 <aside id="toc" class="toc"></aside>
  if (!/<aside[^>]*id=["']toc["'][^>]*class=["'][^"']*toc[^"']*["'][^>]*><\/aside>/.test(html)) {
    // 插入到 </body> 前
    html = html.replace(/(<\/body>)/i, `  <aside id="toc" class="toc"></aside>\n$1`);
    changed = true;
  }
  // 3. 检查并插入页脚（site-footer）
  if (!/<footer[^>]*class=["']site-footer["'][^>]*>/.test(html)) {
    html = html.replace(/(<\/body>)/i, `  <footer class="site-footer">\n    <img src="/assets/images/logo6.webp" alt="页脚图片">\n  </footer>\n$1`);
    changed = true;
  }
  // 4. 检查并插入 main.js 脚本引用
  if (!/src=["'][^"']*main\.js["']/.test(html)) {
    html = html.replace(/(<\/body>)/i, `  <script src="/assets/js/main.js"></script>\n$1`);
    changed = true;
  }
  if (changed) {
    fs.writeFileSync(filePath, html, 'utf8');
    console.log('已补全侧边栏/目录:', filePath);
  }
}

// 用法：node inject-sidebar.js
// 自动为 public/pages/*.html 插入/更新侧边栏导航
const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'public/pages');
const sidebarPath = path.join(__dirname, 'public/assets/sidebar.generated.html');

const sidebarStart = '<!--SIDEBAR-START-->';
const sidebarEnd = '<!--SIDEBAR-END-->';

// 自动生成 sidebar.generated.html
function getTitleFromFile(filePath, fallback) {
  // 读取文件内容，提取 <h1> 或 <title> 作为标题
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    // 优先使用巨大标题块（pagecontainer/title2/span）
    const heroSpan = content.match(/<div\s+class=("|')pagecontainer\1>[\s\S]*?<div\s+class=("|')title2\2>[\s\S]*?<span>([\s\S]*?)<\/span>/i);
    if (heroSpan && heroSpan[3]) return heroSpan[3].trim();
    const h1Match = content.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    if(h1Match) return h1Match[1].trim();
    const titleMatch = content.match(/<title[^>]*>([^<]+)<\/title>/i);
    if(titleMatch) return titleMatch[1].trim();
  } catch(e) {}
  return fallback;
}

function stripLeadingIndex(name) {
  const stripped = name.replace(/^\d+[\s._-]*/, '');
  return stripped.length ? stripped : name;
}

// 递归生成分级菜单
function buildSidebarTree(dir, baseUrl) {
  const items = fs.readdirSync(dir, { withFileTypes: true })
    .filter(entry => !entry.name.startsWith('.'));
  let html = '';
  let fileList = [];
  items.forEach(entry => {
    if (entry.isDirectory()) {
      // 文件夹递归
      const subTree = buildSidebarTree(path.join(dir, entry.name), baseUrl + entry.name + '/');
      if (subTree) {
        const displayName = stripLeadingIndex(entry.name);
        html += `<li><span>${displayName}</span>\n  <ul>\n${subTree}  </ul>\n</li>\n`;
      }
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      const filePath = path.join(dir, entry.name);
      const title = getTitleFromFile(filePath, entry.name.replace(/\.html$/, ''));
      fileList.push(`<li><a href=\"${baseUrl}${entry.name}\">${title}</a></li>`);
    }
  });
  if (fileList.length > 0) html += fileList.join('\n');
  return html;
}
const sidebarTree = buildSidebarTree(pagesDir, '/pages/');
// 在最前面加一个 Home 返回主页项
const homeItem = '<li><a href="/" class="home-link">Home</a></li>';
const sidebarGenerated = `<!-- 本文件由 inject-sidebar.js 自动生成 -->\n<nav class=\"site-nav\">\n  <ul>\n    ${homeItem}\n    ${sidebarTree}\n  </ul>\n</nav>\n`;
fs.writeFileSync(sidebarPath, sidebarGenerated, 'utf8');
console.log('已生成:', sidebarPath);

// 保证 sidebarHtml 始终为最新生成内容
const sidebarHtml = sidebarGenerated.trim();

// 需要处理的页面，包括首页和所有子目录下的 html
function getAllHtmlFiles(dir) {
  let files = [];
  fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getAllHtmlFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  });
  return files;
}
const targets = [
  path.join(__dirname, 'public/index.html'),
  ...getAllHtmlFiles(pagesDir)
];

// 先为所有页面补全侧边栏和目录容器
targets.forEach(filePath => {
  ensureSidebarAndToc(filePath);
});

// 生成带图片的首页按钮HTML
const homeHtml = '<a class="home" href="/">'
  + '<img src="/assets/images/menu.webp" alt="主页">'
  + '</a>';

targets.forEach(filePath => {
  let html = fs.readFileSync(filePath, 'utf8');

  // 匹配 <aside class="sidebar"> ... </aside>
  html = html.replace(/<aside class="sidebar">([\s\S]*?)<\/aside>/, match => {
    // 保留 aside 头尾，替换中间内容
    // 保证所有页面都用统一的带图片首页按钮
    let backHtml = '';
    const backMatch = match.match(/(<a class="back-to-top"[\s\S]*?<\/a>)/);
    if (backMatch) backHtml = backMatch[1];
    else backHtml = '<a class="back-to-top" href="#" title="回到顶部"><img src="/assets/images/uptotop.webp" alt="回到顶部"></a>';
    // 重新组装 aside 内容
    return `<aside class="sidebar">\n${homeHtml}\n${sidebarStart}\n${sidebarHtml}\n${sidebarEnd}\n${backHtml}\n</aside>`;
  });

  // 如果没有匹配到，则尝试插入到 aside 内部 home 链接后
  if (!html.includes(sidebarStart)) {
    html = html.replace(/(<aside class="sidebar">[\s\S]*?<a class="home"[\sS]*?<\/a>)/,
      `$1\n${sidebarStart}\n${sidebarHtml}\n${sidebarEnd}`);
  }

  fs.writeFileSync(filePath, html, 'utf8');
  console.log('已更新:', filePath);
});
