// 调试脚本，用于测试动态基础路径逻辑
const url = 'https://varACundefined.github.io/izju-china-wiki-remake/pages/1Project/1background.html';
const urlObj = new URL(url);
const currentPath = urlObj.pathname;

console.log('Current URL:', url);
console.log('Current Path:', currentPath);

// 测试当前脚本逻辑
const basePath1 = currentPath.startsWith('/izju-china-wiki-remake/') 
  ? '/izju-china-wiki-remake/' 
  : '/';
console.log('Current logic result:', basePath1);

// 测试改进后的正则逻辑
const githubPagesMatch = currentPath.match(/^\/(\w+)\/(\w+)\//);
let basePath2 = '/';
if (githubPagesMatch) {
  basePath2 = `/${githubPagesMatch[1]}/${githubPagesMatch[2]}/`;
}
console.log('Regex logic result:', basePath2);

// 测试另一种方法：获取仓库名称部分
const pathParts = currentPath.split('/').filter(Boolean);
if (pathParts.length >= 2) {
  const basePath3 = `/${pathParts[0]}/${pathParts[1]}/`;
  console.log('Path parts result:', basePath3);
}

// 测试完整的URL解析
console.log('Origin:', urlObj.origin);
console.log('Hostname:', urlObj.hostname);
console.log('Pathname:', urlObj.pathname);
console.log('Search:', urlObj.search);
console.log('Hash:', urlObj.hash);