# 动态基础路径设置的HTML代码
$basePathScript = @'
  <!-- 动态设置基础路径，适应 GitHub Pages 和本地开发 -->
  <script>
    // 自动检测基础路径 - 更健壮的实现
    let basePath = '/';
    
    // 获取当前URL的路径部分
    const currentPath = window.location.pathname;
    
    // 检查是否在GitHub Pages上，匹配用户名和仓库名
    const githubPagesMatch = currentPath.match(/^\/(\w+)\/(\w+)\//);
    if (githubPagesMatch) {
      // 如果是GitHub Pages，使用仓库路径作为基础路径
      basePath = `/${githubPagesMatch[1]}/${githubPagesMatch[2]}/`;
    }
    
    // 创建并添加 base 标签
    const base = document.createElement('base');
    base.href = basePath;
    document.head.insertBefore(base, document.head.firstChild);
    
    // 调试信息，可在浏览器控制台查看
    console.log('Dynamic base path set to:', basePath);
  </script>
'@

# 获取所有HTML文件
$htmlFiles = Get-ChildItem -Path public -Filter *.html -Recurse | Select-Object -ExpandProperty FullName

# 遍历每个HTML文件
foreach ($file in $htmlFiles) {
    Write-Host "Processing $file..."
    
    # 读取文件内容
    $content = Get-Content -Path $file -Raw
    
    # 检查是否已经包含基础路径设置
    if ($content -notmatch '动态设置基础路径') {
        # 在<head>标签内添加基础路径设置
        $newContent = $content -replace '<head>', "<head>$basePathScript"
        
        # 保存修改后的内容
        Set-Content -Path $file -Value $newContent -Encoding UTF8
        Write-Host "Added base path script to $file"
    } else {
        Write-Host "Base path script already exists in $file"
    }
}

Write-Host "All HTML files processed!"