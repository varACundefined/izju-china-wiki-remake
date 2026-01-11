// 使用相对路径修复GitHub Pages问题
const fs = require('fs');
const path = require('path');

// 递归获取所有HTML文件
function getAllHtmlFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];
  
  files.forEach(function(file) {
    if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
      arrayOfFiles = getAllHtmlFiles(path.join(dirPath, file), arrayOfFiles);
    } else if (file.endsWith('.html')) {
      arrayOfFiles.push(path.join(dirPath, file));
    }
  });
  
  return arrayOfFiles;
}

// 更新单个HTML文件，使用相对路径
function updateHtmlFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    
    // 移除所有动态base脚本
    const baseScriptRegex = /<!-- 动态设置基础路径[\s\S]*?<\/script>/;
    if (baseScriptRegex.test(content)) {
      content = content.replace(baseScriptRegex, '');
      changed = true;
    }
    
    // 替换为相对路径
    // 将 /assets/ 替换为 ./assets/
    if (content.includes('/assets/')) {
      content = content.replace(/\/assets\//g, './assets/');
      changed = true;
    }
    
    // 将 /static/ 替换为 ./static/
    if (content.includes('/static/')) {
      content = content.replace(/\/static\//g, './static/');
      changed = true;
    }
    
    // 将 /pages/ 替换为 ./pages/
    if (content.includes('/pages/')) {
      content = content.replace(/\/pages\//g, './pages/');
      changed = true;
    }
    
    // 将 href="/" 替换为 href="./"
    if (content.includes('href="/"')) {
      content = content.replace(/href=\"\/\"/g, 'href="./"');
      changed = true;
    }
    
    // 将 href="/index.html" 替换为 href="./index.html"
    if (content.includes('href="/index.html"')) {
      content = content.replace(/href=\"\/index\.html\"/g, 'href="./index.html"');
      changed = true;
    }
    
    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ Updated: ${filePath}`);
    } else {
      console.log(`✓ No changes needed: ${filePath}`);
    }
  } catch (error) {
    console.error(`✗ Error updating ${filePath}: ${error.message}`);
  }
}

// 获取所有HTML文件并更新
const publicDir = path.join(__dirname, 'public');
const htmlFiles = getAllHtmlFiles(publicDir);

console.log(`Found ${htmlFiles.length} HTML files`);
console.log('Replacing all absolute paths with relative paths');
console.log('='.repeat(60));

htmlFiles.forEach(updateHtmlFile);

console.log('\n' + '='.repeat(60));
console.log('All files updated successfully!');
