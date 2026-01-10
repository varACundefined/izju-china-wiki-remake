const fs = require('fs');
const path = require('path');

// Source: izju-china site_copy wiki pages
const SRC_DIR = path.join('d:/igem/izju-china/site_copy/wiki/pages');
// Target: wiki-remake pages
const DST_DIR = path.join('d:/igem/wiki-remake/public/pages');

function readPageTitleBlock(filePath) {
  try {
    const txt = fs.readFileSync(filePath, 'utf8');
    const m = txt.match(/\{%\s*block\s*page_title\s*%\}([\s\S]*?)\{%\s*endblock\s*%\}/i);
    if (m) return m[1].trim();
    // Fallback: use block title or first H1
    const m2 = txt.match(/\{%\s*block\s*title\s*%\}([\s\S]*?)\{%\s*endblock\s*%\}/i);
    if (m2) return m2[1].trim();
    const h1 = txt.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    if (h1) return h1[1].trim();
  } catch (e) {}
  return null;
}

function findAllSourceTitles() {
  const srcFiles = fs.readdirSync(SRC_DIR).filter(n => n.endsWith('.html'));
  const map = new Map();
  for (const fname of srcFiles) {
    const title = readPageTitleBlock(path.join(SRC_DIR, fname));
    if (title) map.set(fname.toLowerCase(), title);
  }
  return map;
}

function getAllTargetHtml(dir) {
  let out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out = out.concat(getAllTargetHtml(full));
    else if (entry.isFile() && entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

function injectHeroTitle(filePath, newTitle) {
  let html = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1) 永远在内容区顶部插入一个巨大标题块（不替换原始 h1）
  const heroBlock = `\n<div class=\"pagecontainer\"><div class=\"title2\"><span>${newTitle}</span></div></div>\n`;
  if (/(<main[^>]*class=\"content\"[^>]*>)/i.test(html)) {
    html = html.replace(/(<main[^>]*class=\"content\"[^>]*>)/i, `$1${heroBlock}`);
    changed = true;
  } else {
    // 兜底：插入到 body 开始处
    html = html.replace(/(<body[^>]*>)/i, `$1${heroBlock}`);
    changed = true;
  }

  // 2) 如果之前误把首个 h1 替换成了页面标题，则尝试从源文件恢复首个 h1 文本
  const srcName = path.basename(filePath).toLowerCase();
  const srcPath = path.join(SRC_DIR, srcName);
  if (fs.existsSync(srcPath)) {
    const src = fs.readFileSync(srcPath, 'utf8');
    const srcH1Match = src.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    if (srcH1Match) {
      const originalH1 = srcH1Match[1].trim();
      // 如果目标文件中的第一个 h1 内容恰好等于 newTitle，则用 originalH1 覆盖它
      html = html.replace(/(<h1)([^>]*)>([\s\S]*?)(<\/h1>)/i, (m, open, attrs, inner, close) => {
        const current = (inner || '').trim();
        if (current === newTitle) {
          changed = true;
          return `${open}${attrs}>${originalH1}${close}`;
        }
        return m;
      });
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, html, 'utf8');
    console.log('Inserted hero block:', filePath, '->', newTitle);
  }
}

function main() {
  const titleMap = findAllSourceTitles();
  if (!titleMap.size) {
    console.error('No page titles found from source.');
    process.exit(1);
  }
  const targets = getAllTargetHtml(DST_DIR);
  for (const t of targets) {
    const fname = path.basename(t).toLowerCase();
    if (titleMap.has(fname)) {
      injectHeroTitle(t, titleMap.get(fname));
    }
  }
}

if (require.main === module) {
  main();
}
