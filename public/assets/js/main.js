document.addEventListener('DOMContentLoaded', function(){
  // 侧边栏高亮当前页面链接
  function highlightCurrentPage() {
    const navLinks = document.querySelectorAll('.site-nav a');
    const currentPath = decodeURIComponent(location.pathname);
    
    navLinks.forEach(a => {
      const linkPath = decodeURIComponent(a.getAttribute('href'));
      
      // 精确匹配当前路径
      if (linkPath === currentPath) {
        a.classList.add('active');
        return;
      }
      
      // 处理 /index.html 的情况
      if (currentPath.endsWith('/index.html')) {
        const dirPath = currentPath.replace(/\/index\.html$/, '/');
        if (linkPath === dirPath || linkPath === currentPath.replace('/index.html', '')) {
          a.classList.add('active');
          return;
        }
      }
      
      // 处理根路径
      if (currentPath === '/' && (linkPath === '/' || linkPath === '/index.html')) {
        a.classList.add('active');
        return;
      }
    });
  }

  // 侧边栏分组折叠/展开
  function setupSidebarGroups() {
    const navGroups = document.querySelectorAll('.site-nav li > span');
    
    navGroups.forEach(span => {
      const subUl = span.nextElementSibling;
      if(subUl && subUl.tagName === 'UL'){
        // 默认全部折叠
        subUl.classList.add('collapsed');
        span.classList.add('collapsed');
        span.style.cursor = 'pointer';
        
        span.addEventListener('click', function(){
          const isOpen = !subUl.classList.contains('collapsed');
          
          if(isOpen){
            // 折叠动画
            subUl.style.maxHeight = subUl.scrollHeight + 'px';
            subUl.offsetHeight; // 强制reflow
            subUl.classList.add('collapsing');
            subUl.classList.add('collapsed');
            subUl.style.maxHeight = '0';
            setTimeout(()=>{
              subUl.classList.remove('collapsing');
              subUl.style.maxHeight = '';
            }, 350);
          }else{
            // 展开动画
            subUl.classList.add('collapsing');
            subUl.classList.remove('collapsed');
            subUl.style.maxHeight = subUl.scrollHeight + 'px';
            setTimeout(()=>{
              subUl.classList.remove('collapsing');
              subUl.style.maxHeight = '';
            }, 350);
          }
          
          span.classList.toggle('collapsed', isOpen);
        });
      }
    });
  }

  // 自动展开包含当前页面链接的分组
  function expandCurrentGroup() {
    const currentPath = decodeURIComponent(location.pathname);
    const navGroups = document.querySelectorAll('.site-nav li > span');
    
    navGroups.forEach(span => {
      const subUl = span.nextElementSibling;
      if(subUl && subUl.tagName === 'UL'){
        const links = subUl.querySelectorAll('a');
        let hasCurrent = false;
        
        links.forEach(a => {
          const linkPath = decodeURIComponent(a.getAttribute('href'));
          
          // 检查是否是当前页面
          if (linkPath === currentPath) {
            hasCurrent = true;
            return;
          }
          
          // 处理 /index.html 的情况
          if (currentPath.endsWith('/index.html')) {
            const dirPath = currentPath.replace(/\/index\.html$/, '/');
            if (linkPath === dirPath || linkPath === currentPath.replace('/index.html', '')) {
              hasCurrent = true;
              return;
            }
          }
          
          // 处理根路径
          if (currentPath === '/' && (linkPath === '/' || linkPath === '/index.html')) {
            hasCurrent = true;
            return;
          }
        });
        
        if(hasCurrent){
          // 展开当前分组
          subUl.classList.remove('collapsed');
          span.classList.remove('collapsed');
        }else{
          // 其余分组保持折叠
          subUl.classList.add('collapsed');
          span.classList.add('collapsed');
        }
      }
    });
  }

  // 初始化侧边栏
  highlightCurrentPage();
  setupSidebarGroups();
  expandCurrentGroup();

  // 回到顶部功能
  const back = document.querySelector('.back-to-top');
  if(back){
    back.addEventListener('click', function(e){
      e.preventDefault();
      window.scrollTo({top:0, behavior:'smooth'});
    });
  }

  // 生成右侧 TOC（如果页面包含 #toc）
  const tocEl = document.getElementById('toc');
  if(tocEl){
    tocEl.innerHTML = '';
    // 收集 H1–H6 作为目录来源，支持任意层级，包括human practice页面的特殊容器
    const headings = Array.from(document.querySelectorAll('.content h1, .content h2, .content h3, .content h4, .content h5, .content h6, #auto-ihp-content h1, #auto-ihp-content h2, #auto-ihp-content h3, #auto-ihp-content h4, #auto-ihp-content h5, #auto-ihp-content h6, #auto-page-content h1, #auto-page-content h2, #auto-page-content h3, #auto-page-content h4, #auto-page-content h5, #auto-page-content h6'));
    if(headings.length){
      // 生成唯一 id，避免同名冲突
      const idMap = {};
      headings.forEach(h => {
        // 如果已有 id 则保留，否则按文本生成
        if(!h.id){
          let baseId = h.textContent.trim().toLowerCase().replace(/[^a-z0-9\-]+/g, '-').replace(/^-+|-+$/g, '');
          if(!baseId) baseId = 'section';
          let id = baseId;
          let idx = 2;
          while(idMap[id]) { id = baseId + '-' + idx++; }
          idMap[id] = true;
          h.id = id;
        } else {
          idMap[h.id] = true;
        }
      });

      // 构建嵌套 UL 树（基于 heading 等级）
      const rootUl = document.createElement('ul');
      const stack = [{ level: 1, ul: rootUl, li: null }]; // level=1 对应虚拟根

      const levelOf = (h) => parseInt(h.tagName.substring(1), 10);
      const levels = headings.map(levelOf);
      const baseLevel = Math.min.apply(null, levels); // 以页面中出现的最浅级别为根（可为 H1/H2/...）

      headings.forEach(h => {
        const level = Math.max(baseLevel, Math.min(6, levelOf(h)));
        const depth = level - baseLevel + 1; // H2->1, H3->2, ...

        // 调整栈深度
        while(stack.length > depth) stack.pop();
        while(stack.length < depth) {
          // 为上一层 li 创建子 ul
          const parent = stack[stack.length - 1];
          let parentLi = parent.li;
          if(!parentLi) {
            // 若缺 li（例如第一个 H2 前），在父 UL 下创建一个占位 li
            parentLi = document.createElement('li');
            parent.ul.appendChild(parentLi);
            parent.li = parentLi;
          }
          const subUl = document.createElement('ul');
          subUl.className = 'toc-group-list collapsed';
          parentLi.appendChild(subUl);
          stack.push({ level: parent.level + 1, ul: subUl, li: null });
        }

        // 在当前层添加 li>a
        const cur = stack[stack.length - 1];
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#' + h.id;
        a.textContent = h.textContent;
        a.classList.add('toc-depth-' + depth);
        li.appendChild(a);
        cur.ul.appendChild(li);
        cur.li = li;
      });

      // 为有子列表的 li 标记分组标题（让 H2/H3 等父节点可折叠且可点击跳转）
      rootUl.querySelectorAll('li').forEach(li => {
        const a = li.querySelector(':scope > a');
        const childUl = li.querySelector(':scope > ul');
        if(a && childUl){
          a.classList.add('toc-group-title');
          // 默认折叠
          childUl.classList.add('collapsed');
        }
      });

      tocEl.appendChild(rootUl);

      // 折叠/展开：点击拥有子列表的标题时，既跳转也展开
      tocEl.querySelectorAll('.toc-group-title').forEach(titleLink => {
        const subUl = titleLink.nextElementSibling;
        titleLink.style.cursor = 'pointer';
        titleLink.addEventListener('click', function(){
          // 跳转逻辑由统一锚点处理；此处仅控制展开/折叠
          const isOpen = !subUl.classList.contains('collapsed');
          if(isOpen){
            subUl.style.maxHeight = subUl.scrollHeight + 'px';
            subUl.offsetHeight;
            subUl.classList.add('collapsing');
            subUl.classList.add('collapsed');
            subUl.style.maxHeight = '0';
            setTimeout(()=>{ subUl.classList.remove('collapsing'); subUl.style.maxHeight = ''; }, 350);
          }else{
            subUl.classList.add('collapsing');
            subUl.classList.remove('collapsed');
            subUl.style.maxHeight = subUl.scrollHeight + 'px';
            setTimeout(()=>{ subUl.classList.remove('collapsing'); subUl.style.maxHeight = ''; }, 350);
          }
          titleLink.classList.toggle('collapsed', isOpen);
        });
      });

      // 统一的锚点平滑滚动（避免过头）
      tocEl.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', function(e){
          const href = a.getAttribute('href');
          if(href && href.startsWith('#')){
            const target = document.getElementById(href.slice(1));
            if(target){
              e.preventDefault();
              const y = target.getBoundingClientRect().top + window.scrollY - 70;
              window.scrollTo({top: y, behavior: 'smooth'});
              history.replaceState(null, '', href);
            }
          }
        });
      });

      // 高亮当前节（最深层）并自动展开其所有祖先分组
      const onScroll = () => {
        let current = null;
        headings.forEach(h => {
          const rect = h.getBoundingClientRect();
          if(rect.top <= 80) current = h; // 最靠上的且不超出顶部的最后一个
        });

        // 清除高亮
        tocEl.querySelectorAll('a').forEach(a => a.classList.remove('active'));

        if(current){
          const link = tocEl.querySelector('a[href="#'+current.id+'"]');
          if(link) link.classList.add('active');

          // 折叠全部子列表（保持初始折叠行为）
          tocEl.querySelectorAll('ul ul').forEach(ul => {
            if(!ul.classList.contains('collapsed')){
              ul.style.maxHeight = ul.scrollHeight + 'px';
              ul.offsetHeight;
              ul.classList.add('collapsing');
              ul.classList.add('collapsed');
              ul.style.maxHeight = '0';
              setTimeout(()=>{ ul.classList.remove('collapsing'); ul.style.maxHeight=''; }, 350);
            }
          });

          // 展开当前项的所有祖先
          let node = link.parentElement; // li
          while(node && node !== tocEl){
            if(node.tagName && node.tagName.toLowerCase() === 'li'){
              const childUl = node.querySelector(':scope > ul');
              const title = node.querySelector(':scope > a.toc-group-title');
              if(childUl){
                childUl.classList.remove('collapsed');
                childUl.classList.add('collapsing');
                childUl.style.maxHeight = childUl.scrollHeight + 'px';
                setTimeout(()=>{ childUl.classList.remove('collapsing'); childUl.style.maxHeight=''; }, 350);
              }
              if(title){ title.classList.remove('collapsed'); }
            }
            // 展开上层 ul
            if(node.tagName && node.tagName.toLowerCase() === 'ul'){
              node.classList.remove('collapsed');
            }
            node = node.parentElement;
          }
        }
      };

      onScroll();
      window.addEventListener('scroll', onScroll);
    }
  }

  // 创建遮罩层（用于移动端侧边栏 / TOC）
  let overlay = document.querySelector('.overlay');
  if(!overlay){
    overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);
  }

  // 侧边栏切换（移动端）
  const sidebar = document.querySelector('.sidebar');
  const sidebarToggle = document.querySelector('.sidebar-toggle');
  if(sidebar && sidebarToggle){
    sidebarToggle.addEventListener('click', function(){
      sidebar.classList.toggle('open');
      overlay.classList.toggle('show');
      sidebarToggle.setAttribute('aria-expanded', sidebar.classList.contains('open'));
      
      // 当侧边栏打开时，隐藏TOC按钮
      if(sidebar.classList.contains('open') && tocToggle){
        tocToggle.style.opacity = '0';
        tocToggle.style.pointerEvents = 'none';
      } else if(tocToggle){
        tocToggle.style.opacity = '1';
        tocToggle.style.pointerEvents = 'auto';
      }
    });

    // 点击遮罩关闭
    overlay.addEventListener('click', function(){
      sidebar.classList.remove('open');
      tocEl && tocEl.classList.remove('open');
      overlay.classList.remove('show');
      sidebarToggle && sidebarToggle.setAttribute('aria-expanded', 'false');
      tocToggle && tocToggle.setAttribute('aria-expanded', 'false');
      
      // 遮罩关闭时，显示所有按钮
      sidebarToggle.style.opacity = '1';
      sidebarToggle.style.pointerEvents = 'auto';
      if(tocToggle){
        tocToggle.style.opacity = '1';
        tocToggle.style.pointerEvents = 'auto';
      }
    });

    // 点击导航链接后自动关闭移动端侧边栏
    sidebar.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', function(){
        if(window.innerWidth <= 900){
          sidebar.classList.remove('open');
          overlay.classList.remove('show');
          sidebarToggle && sidebarToggle.setAttribute('aria-expanded', 'false');
          
          // 侧边栏关闭后，显示TOC按钮
          if(tocToggle){
            tocToggle.style.opacity = '1';
            tocToggle.style.pointerEvents = 'auto';
          }
        }
      });
    });
  }

  // 右侧 TOC 切换（移动端） - 如果存在
  let tocToggle;
  if(tocEl){
    // 启用 TOC 内部滚动隔离，避免滚动穿透到页面
    (function setupTocScrollIsolation(toc){
      try{
        // 强化 CSS 行为
        toc.style.overscrollBehavior = 'contain';
        toc.style.touchAction = 'pan-y';

        // 仅在到达顶部/底部边界时阻止滚动穿透，正常情况下让浏览器原生滚动
        const wheelHandler = (e) => {
          if (e.ctrlKey) return; // 允许浏览器缩放手势
          const line = 16;
          const page = toc.clientHeight || window.innerHeight;
          let dy = e.deltaY;
          if (e.deltaMode === 1) dy *= line;       // DOM_DELTA_LINE
          else if (e.deltaMode === 2) dy *= page;  // DOM_DELTA_PAGE

          const atTop = toc.scrollTop <= 0;
          const atBottom = (toc.scrollTop + toc.clientHeight) >= (toc.scrollHeight - 1);

          if ((dy < 0 && atTop) || (dy > 0 && atBottom)) {
            e.preventDefault();
            e.stopPropagation();
          }
        };
        toc.addEventListener('wheel', wheelHandler, { passive: false });

        // 触摸滚动隔离（移动端）
        let lastY = null;
        toc.addEventListener('touchstart', (e)=>{
          if (e.touches && e.touches.length === 1){
            lastY = e.touches[0].clientY;
          }
        }, { passive: true });
        toc.addEventListener('touchmove', (e)=>{
          if (!(e.touches && e.touches.length === 1)) return;
          const y = e.touches[0].clientY;
          if (lastY == null) { lastY = y; return; }
          const dy = lastY - y; // 手势上移为正（内容向下滚）
          lastY = y;
          const atTop = toc.scrollTop <= 0;
          const atBottom = (toc.scrollTop + toc.clientHeight) >= (toc.scrollHeight - 1);

          if ((dy < 0 && atTop) || (dy > 0 && atBottom)) {
            e.preventDefault();
            e.stopPropagation();
          }
          // 其余情况交给浏览器原生滚动，保持顺滑与惯性
        }, { passive: false });
      }catch(err){ console.warn('setupTocScrollIsolation failed:', err); }
    })(tocEl);

    // 检查当前页面是否是首页，如果是首页则不创建目录按钮
    if (!document.body.classList.contains('home-page')) {
      tocToggle = document.createElement('button');
      tocToggle.className = 'toc-toggle';
      tocToggle.type = 'button';
      tocToggle.setAttribute('aria-expanded', 'false');
      tocToggle.textContent = '';
      document.body.appendChild(tocToggle);
    }

    // 只有在非首页才添加TOC切换事件监听器
    if (tocToggle) {
      tocToggle.addEventListener('click', function(){
        tocEl.classList.toggle('open');
        overlay.classList.toggle('show');
        const open = tocEl.classList.contains('open');
        tocToggle.setAttribute('aria-expanded', open);
        
        // 当TOC打开时，隐藏侧边栏按钮
        if(open && sidebarToggle){
          sidebarToggle.style.opacity = '0';
          sidebarToggle.style.pointerEvents = 'none';
        } else if(sidebarToggle){
          sidebarToggle.style.opacity = '1';
          sidebarToggle.style.pointerEvents = 'auto';
        }
      });

      // 点击 TOC 内链接后关闭移动端 TOC
      tocEl.addEventListener('click', function(e){
        if(e.target.tagName.toLowerCase() === 'a' && window.innerWidth <= 900){
          tocEl.classList.remove('open');
          overlay.classList.remove('show');
          tocToggle.setAttribute('aria-expanded', 'false');
          
          // TOC关闭后，显示侧边栏按钮
          if(sidebarToggle){
            sidebarToggle.style.opacity = '1';
            sidebarToggle.style.pointerEvents = 'auto';
          }
        }
      });
    }
  }

  // Esc 键关闭弹层
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){
      sidebar && sidebar.classList.remove('open');
      tocEl && tocEl.classList.remove('open');
      overlay && overlay.classList.remove('show');
      
      // Esc键关闭时，显示所有按钮
      sidebarToggle && (sidebarToggle.style.opacity = '1');
      sidebarToggle && (sidebarToggle.style.pointerEvents = 'auto');
      tocToggle && (tocToggle.style.opacity = '1');
      tocToggle && (tocToggle.style.pointerEvents = 'auto');
    }
  });

  // 动态测量 sidebar/toc/footer 并设置 CSS 变量
  function updateLayoutVars(){
    const doc = document.documentElement;
    const sidebarEl = document.querySelector('.sidebar');
    const tocElLocal = document.querySelector('.toc');
    const footer = document.querySelector('.site-footer');
    const sidebarWidth = sidebarEl ? Math.min(sidebarEl.offsetWidth, 480) : 0;
    const tocWidth = (tocElLocal && window.getComputedStyle(tocElLocal).display !== 'none') ? Math.min(tocElLocal.offsetWidth, 480) : 0;
    const footerHeight = footer ? footer.offsetHeight : 0;
    doc.style.setProperty('--sidebar-width', sidebarWidth + 'px');
    doc.style.setProperty('--toc-width', tocWidth + 'px');
    doc.style.setProperty('--footer-height', footerHeight + 'px');
  }

  // 在重要时刻触发测量
  updateLayoutVars();
  window.addEventListener('resize', updateLayoutVars);
  window.addEventListener('load', updateLayoutVars);
  document.querySelectorAll('img').forEach(img => {
    if(!img.complete) img.addEventListener('load', updateLayoutVars);
  });

  // 在侧边栏切换时刷新变量
  if(sidebar && sidebarToggle){
    sidebarToggle.addEventListener('click', function(){
      setTimeout(updateLayoutVars, 240);
    });
  }

  // === TOC 遮挡来源探针（仅在 URL 含 tocProbe=1 时启用） ===
  try {
    const params = new URLSearchParams(location.search);
    if (params.get('tocProbe') === '1') {
      const probeBadge = document.createElement('div');
      probeBadge.style.cssText = 'position:fixed; right:12px; bottom:12px; z-index:99999; background:rgba(0,0,0,0.6); color:#fff; padding:8px 10px; border-radius:6px; font:12px/1.4 system-ui,Segoe UI,Roboto,Arial; max-width:46vw; pointer-events:none;';
      probeBadge.textContent = 'TOC Probe running…';
      document.body.appendChild(probeBadge);

      let lastKey = '';
      let highlighted;

      const runProbe = () => {
        const toc = document.getElementById('toc');
        if (!toc) return;
        const r = toc.getBoundingClientRect();
        // 取 TOC 右下角稍往内的一个采样点
        const sx = Math.min(window.innerWidth - 4, Math.max(4, r.right - 10));
        const sy = Math.min(window.innerHeight - 4, Math.max(4, r.bottom - 10));
        const el = document.elementFromPoint(sx, sy);
        if (!el) return;
        const cs = getComputedStyle(el);
        const info = {
          tag: el.tagName,
          id: el.id || '',
          className: (el.className && typeof el.className === 'string') ? el.className : '',
          position: cs.position,
          zIndex: cs.zIndex,
          bg: cs.backgroundColor,
        };
        const key = `${info.tag}#${info.id}.${info.className}|pos=${info.position}|z=${info.zIndex}|bg=${info.bg}`;
        if (key !== lastKey) {
          lastKey = key;
          // 更新徽标信息
          probeBadge.textContent = `Covering @ (${sx},${sy}) -> ${info.tag}${info.id?('#'+info.id):''}${info.className?('.'+info.className.replace(/\s+/g,'.')):''} | pos=${info.position} z=${info.zIndex} bg=${info.bg}`;
          // 高亮该元素的边框
          if (highlighted) highlighted.style.outline = highlighted.__oldOutline || '';
          el.__oldOutline = el.style.outline;
          el.style.outline = '2px dashed #ff6';
          highlighted = el;
          // 控制台详细输出
          console.log('[TOC-Probe] covering element:', info, el);
        }
      };

      window.addEventListener('scroll', runProbe, { passive: true });
      window.addEventListener('resize', runProbe);
      setInterval(runProbe, 500);
      setTimeout(runProbe, 200);
    }
  } catch (e) {
    console.warn('TOC probe init failed:', e);
  }
});