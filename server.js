const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 7000;
const repoName = 'izju-china-wiki-remake';

// 处理包含仓库名称的路径，重定向到正确的静态文件
app.use(`/${repoName}`, express.static(path.join(__dirname, 'public')));

// 同时支持直接访问根路径
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
console.log(`GitHub Pages compatible paths enabled for repo: ${repoName}`);
