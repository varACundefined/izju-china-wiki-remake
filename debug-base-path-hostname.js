// 调试脚本，测试修复后的动态基础路径逻辑（使用主机名判断）

// 测试不同的URL
const testUrls = [
  'https://varACundefined.github.io/izju-china-wiki-remake/',
  'https://varACundefined.github.io/izju-china-wiki-remake/index.html',
  'https://varACundefined.github.io/izju-china-wiki-remake/pages/1Project/1background.html',
  'https://varACundefined.github.io/izju-china-wiki-remake/pages/2Dry%20Lab/1design.html',
  'http://localhost:7000/',
  'http://localhost:7000/index.html',
  'http://localhost:7000/pages/1Project/1background.html',
  'http://127.0.0.1:7000/',
  'http://127.0.0.1:7000/pages/1Project/1background.html'
];

testUrls.forEach(url => {
  console.log('\n=== Testing:', url);
  const urlObj = new URL(url);
  const currentPath = urlObj.pathname;
  const hostname = urlObj.hostname;
  
  console.log('Hostname:', hostname);
  console.log('Current Path:', currentPath);
  
  // 修复后的逻辑：使用主机名判断
  let basePath = '/';
  if (hostname.endsWith('.github.io')) {
    const pathParts = currentPath.split('/').filter(Boolean);
    if (pathParts.length > 0) {
      basePath = '/' + pathParts[0] + '/';
    }
  }
  
  console.log('Fixed logic result:', basePath);
});

// 测试特定的仓库名称情况
console.log('\n=== Testing specific repository name handling:');
const repoName = 'izju-china-wiki-remake';
const testPaths = [
  '/',
  '/index.html',
  '/pages/1Project/1background.html'
];

testPaths.forEach(path => {
  const fullPath = `/${repoName}${path}`;
  console.log(`\nPath: ${fullPath}`);
  
  // 修复后的逻辑
  let basePath = '/';
  if ('varacundefined.github.io'.endsWith('.github.io')) {
    const pathParts = fullPath.split('/').filter(Boolean);
    if (pathParts.length > 0) {
      basePath = '/' + pathParts[0] + '/';
    }
  }
  
  console.log('Base path:', basePath);
  console.log('Expected:', `/${repoName}/`);
  console.log('Match:', basePath === `/${repoName}/` ? '✅' : '❌');
});