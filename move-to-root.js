// 将public目录下的所有文件移动到根目录，这是GitHub Pages的默认配置
const fs = require('fs');
const path = require('path');

// 源目录和目标目录
const publicDir = path.join(__dirname, 'public');
const rootDir = __dirname;

console.log('=== 准备将public目录文件移动到根目录 ===\n');

// 检查是否已存在同名文件
const publicFiles = fs.readdirSync(publicDir);
let existingFiles = [];

publicFiles.forEach(file => {
  const targetPath = path.join(rootDir, file);
  if (fs.existsSync(targetPath)) {
    existingFiles.push(file);
  }
});

if (existingFiles.length > 0) {
  console.log('警告：根目录已存在以下文件，将被覆盖：');
  existingFiles.forEach(file => console.log(`   📄 ${file}`));
  console.log('\n按任意键继续...');
}

// 移动文件
publicFiles.forEach(file => {
  const sourcePath = path.join(publicDir, file);
  const targetPath = path.join(rootDir, file);
  
  try {
    // 检查是文件还是目录
    const stats = fs.statSync(sourcePath);
    if (stats.isDirectory()) {
      // 如果是目录，递归复制
      copyDirectory(sourcePath, targetPath);
      console.log(`   📁 移动目录: ${file}`);
    } else {
      // 如果是文件，直接移动
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`   📄 移动文件: ${file}`);
    }
  } catch (error) {
    console.error(`   ❌ 移动失败: ${file} - ${error.message}`);
  }
});

console.log('\n=== 移动完成 ===\n');
console.log('GitHub Pages现在应该可以正常工作了！');
console.log('请确保GitHub Pages源设置为根目录（root）。');

// 递归复制目录
function copyDirectory(source, target) {
  // 如果目标目录不存在，创建它
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }
  
  // 获取源目录中的所有文件和子目录
  const files = fs.readdirSync(source);
  
  // 遍历所有文件和子目录
  files.forEach(file => {
    const sourcePath = path.join(source, file);
    const targetPath = path.join(target, file);
    
    // 检查是文件还是目录
    const stats = fs.statSync(sourcePath);
    if (stats.isDirectory()) {
      // 递归复制子目录
      copyDirectory(sourcePath, targetPath);
    } else {
      // 复制文件
      fs.copyFileSync(sourcePath, targetPath);
    }
  });
}