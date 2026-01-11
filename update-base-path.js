// 更新所有HTML文件中的动态基础路径脚本
const fs = require('fs');
const path = require('path');

// 新的基础路径脚本
const newBasePathScript = '  <!-- 动态设置基础路径，适应 GitHub Pages 和本地开发 -->\n  <script>\n    // 自动检测基础路径 - 更健壮的实现\n    let basePath = \'/\';\n    \n    // 获取当前URL的路径部分\n    const currentPath = window.location.pathname;\n    \n    // 检查是否在GitHub Pages上，匹配用户名和仓库名\n    const githubPagesMatch = currentPath.match(/^\/(\\w+)\/(\\w+)\//);\n    if (githubPagesMatch) {\n      // 如果是GitHub Pages，使用仓库路径作为基础路径\n      basePath = \'/\' + githubPagesMatch[1] + \'/\' + githubPagesMatch[2] + \'/\';\n    }\n    \n    // 创建并添加 base 标签\n    const base = document.createElement(\'base\');\n    base.href = basePath;\n    document.head.insertBefore(base, document.head.firstChild);\n    \n    // 调试信息，可在浏览器控制台查看\n    console.log(\'Dynamic base path set to:\', basePath);\n  </script>';

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

// 更新单个HTML文件
function updateHtmlFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 检查是否已经包含基础路径脚本
    if (content.includes('动态设置基础路径')) {
      // 替换旧脚本
      content = content.replace(/<!-- 动态设置基础路径[\s\S]*?<\/script>/, newBasePathScript);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated: ${filePath}`);
    } else {
      // 添加新脚本
      content = content.replace('<head>', `<head>${newBasePathScript}`);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Added: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error updating ${filePath}: ${error.message}`);
  }
}

// 获取所有HTML文件并更新
const publicDir = path.join(__dirname, 'public');
const htmlFiles = getAllHtmlFiles(publicDir);

console.log(`Found ${htmlFiles.length} HTML files`);
htmlFiles.forEach(updateHtmlFile);
console.log('All files updated successfully!');