// 检查GitHub Pages配置和文件结构
const fs = require('fs');
const path = require('path');

console.log('=== GitHub Pages配置检查 ===\n');

// 检查仓库结构
const publicDir = path.join(__dirname, 'public');
const files = fs.readdirSync(publicDir);

console.log('1. Public目录内容:');
files.forEach(file => {
  const filePath = path.join(publicDir, file);
  const stats = fs.statSync(filePath);
  const type = stats.isDirectory() ? '📁' : '📄';
  console.log(`   ${type} ${file}`);
});

console.log('\n2. 检查必要文件:');

// 检查index.html
const indexPath = path.join(publicDir, 'index.html');
if (fs.existsSync(indexPath)) {
  console.log('   ✅ index.html 存在');
} else {
  console.log('   ❌ index.html 不存在');
}

// 检查基本资源目录
const assetsPath = path.join(publicDir, 'assets');
if (fs.existsSync(assetsPath)) {
  console.log('   ✅ assets目录 存在');
  const assetsFiles = fs.readdirSync(assetsPath);
  console.log(`      包含: ${assetsFiles.join(', ')}`);
} else {
  console.log('   ❌ assets目录 不存在');
}

// 检查pages目录
const pagesPath = path.join(publicDir, 'pages');
if (fs.existsSync(pagesPath)) {
  console.log('   ✅ pages目录 存在');
} else {
  console.log('   ❌ pages目录 不存在');
}

// 检查样式文件
const cssPath = path.join(assetsPath, 'css', 'styles.css');
if (fs.existsSync(cssPath)) {
  console.log('   ✅ styles.css 存在');
} else {
  console.log('   ❌ styles.css 不存在');
}

// 检查脚本文件
const jsPath = path.join(assetsPath, 'js', 'main.js');
if (fs.existsSync(jsPath)) {
  console.log('   ✅ main.js 存在');
} else {
  console.log('   ❌ main.js 不存在');
}

// 检查第一个子页面
const firstPagePath = path.join(pagesPath, '1Project', '1background.html');
if (fs.existsSync(firstPagePath)) {
  console.log('   ✅ 子页面 存在');
} else {
  console.log('   ❌ 子页面 不存在');
}

console.log('\n3. GitHub Pages部署建议:');
console.log('   - 确保GitHub Pages源设置为GitHub Actions');
console.log('   - 确保workflow文件正确指向public目录');
console.log('   - 确保所有路径使用相对路径');
console.log('   - 部署后等待几分钟再访问');
console.log('   - 检查浏览器控制台是否有错误');

console.log('\n=== 检查完成 ===');
