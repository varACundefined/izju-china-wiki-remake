// 直接替换所有HTML文件中的绝对路径，添加仓库名称前缀
const fs = require('fs');
const path = require('path');

// 仓库名称
const repoName = 'izju-china-wiki-remake';

// 需要替换的路径模式
const pathReplacements = [
  { from: '/assets/', to: `/${repoName}/assets/` },
  { from: '/pages/', to: `/${repoName}/pages/` },
  { from: '/static/', to: `/${repoName}/static/` },
  { from: 'href="/"', to: `href="/${repoName}/"` },
  { from: 'src="/favicon', to: `src="/${repoName}/favicon` }
];

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
    let changed = false;
    
    // 替换所有路径
    pathReplacements.forEach(replacement => {
      const oldCount = (content.match(new RegExp(replacement.from, 'g')) || []).length;
      if (oldCount > 0) {
        content = content.replace(new RegExp(replacement.from, 'g'), replacement.to);
        changed = true;
        console.log(`  Replaced ${oldCount} instances of '${replacement.from}' with '${replacement.to}'`);
      }
    });
    
    // 删除之前的动态base路径脚本
    const baseScriptRegex = /<!-- 动态设置基础路径[\s\S]*?<\/script>/;
    if (baseScriptRegex.test(content)) {
      content = content.replace(baseScriptRegex, '');
      changed = true;
      console.log('  Removed old dynamic base path script');
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
console.log(`Replacing all absolute paths with GitHub Pages compatible paths (repo: ${repoName})`);
console.log('='.repeat(60));

htmlFiles.forEach(updateHtmlFile);

console.log('\n' + '='.repeat(60));
console.log('All files updated successfully!');
