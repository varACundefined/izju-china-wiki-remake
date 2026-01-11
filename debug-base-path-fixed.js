// 调试脚本，测试修复后的动态基础路径逻辑

// 测试不同的GitHub Pages URL
const testUrls = [
  'https://varACundefined.github.io/izju-china-wiki-remake/',
  'https://varACundefined.github.io/izju-china-wiki-remake/index.html',
  'https://varACundefined.github.io/izju-china-wiki-remake/pages/1Project/1background.html',
  'https://varACundefined.github.io/izju-china-wiki-remake/pages/2Dry%20Lab/1design.html',
  'http://localhost:7000/',
  'http://localhost:7000/index.html',
  'http://localhost:7000/pages/1Project/1background.html'
];

testUrls.forEach(url => {
  console.log('\n=== Testing:', url);
  const urlObj = new URL(url);
  const currentPath = urlObj.pathname;
  
  console.log('Current Path:', currentPath);
  
  // 修复后的逻辑
  let basePath = '/';
  const pathParts = currentPath.split('/').filter(Boolean);
  if (pathParts.length > 0) {
    basePath = '/' + pathParts[0] + '/';
  }
  
  if (currentPath === '/' || currentPath === '/index.html') {
    basePath = '/';
  }
  
  console.log('Fixed logic result:', basePath);
});