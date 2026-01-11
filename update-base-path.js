// 更新所有HTML文件中的动态基础路径脚本
const fs = require('fs');
const path = require('path');

// 新的基础路径脚本
const newBasePathScript = '  <!-- 动态设置基础路径，适应 GitHub Pages 和本地开发 -->\n  <script>\n    // 自动检测基础路径 - 修复GitHub Pages路径问题\n    let basePath = \'/\';\n    \n    // 获取当前URL的路径部分和主机名\n    const currentPath = window.location.pathname;\n    const hostname = window.location.hostname;\n    \n    // 检查是否在GitHub Pages上（通过主机名判断）\n    if (hostname.endsWith(\'.github.io\')) {\n      // GitHub Pages URL结构：https://username.github.io/repository-name/\n      // 所以路径中第一个非空部分是仓库名称\n      const pathParts = currentPath.split(\'/\').filter(Boolean);\n      if (pathParts.length > 0) {\n        basePath = \'/\' + pathParts[0] + \'/\';\n      }\n    }\n    \n    // 调试信息，可在浏览器控制台查看\n    console.log(\'Dynamic base path set to:\', basePath, \'Hostname:\', hostname, \'Current path:\', currentPath);\n    \n    // 创建并添加 base 标签\n    const base = document.createElement(\'base\');\n    base.href = basePath;\n    document.head.insertBefore(base, document.head.firstChild);\n  </script>';

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