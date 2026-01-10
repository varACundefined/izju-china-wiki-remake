(function(){
  const ENABLE_PAGING = true; // 可切换
  if (!ENABLE_PAGING) return;

  const byId = (id)=>document.getElementById(id);
  const anchors = [
    'title',
    'rising-title',
    'stats-container',
    'failing-title',
    'transmission-title',
    'transmission-block',
    'spread-title',
    'eskape-title',
    'eskape-image',
    'mrsa-title',
    'mrsa-content',
    'focas-title',
    'focas-content',
    'four-component-title',
    'four-component-image',
    'five-module-title',
    'five-module-image',
    'application-title',
    'application-image',
    'application-method',
    'procedure-title',
    'procedure-image',
    'procedure-steps',
    'subtitle-video',
    'video-container'
  ].map(id=>byId(id)).filter(Boolean);

  if (!anchors.length) return;

  const getY = el => {
    const r = el.getBoundingClientRect();
    return r.top + window.scrollY;
  };

  let isAnimating = false;
  const cooldown = 650; // ms 每次翻页的最小间隔

  const snapTo = (targetY) => {
    isAnimating = true;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
    setTimeout(()=>{ isAnimating = false; }, cooldown);
  };

  const nextIndex = (dir) => {
    const pos = window.scrollY + 1; // 避免恰好等于锚点产生抖动
    const list = anchors.map(getY);
    const idx = list.findIndex(y => y - 2 <= pos && pos < y + 2);
    if (idx >= 0) {
      const ni = Math.min(Math.max(idx + dir, 0), list.length - 1);
      return ni;
    }
    // 若当前不在精确锚点附近，则找到离当前最近的锚点
    let nearest = 0, best = Infinity;
    list.forEach((y,i)=>{
      const d = Math.abs(y - pos);
      if (d < best) { best = d; nearest = i; }
    });
    const ni = Math.min(Math.max(nearest + dir, 0), list.length - 1);
    return ni;
  };

  const shouldBypass = (e)=>{
    // 在侧边栏或可滚动容器内操作时，不劫持
    const scroller = e.target.closest('.sidebar, .site-nav, textarea, input, select');
    if (scroller) return true;
    // 如果 Cmd/Ctrl/Alt/Shift 按下，保留默认行为
    if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return true;
    return false;
  };

  const onWheel = (e) => {
    if (isAnimating || shouldBypass(e)) return;
    const dy = e.deltaY;
    if (Math.abs(dy) < 8) return; // 忽略极小滚动
    e.preventDefault();
    const dir = dy > 0 ? 1 : -1;
    const ni = nextIndex(dir);
    const y = getY(anchors[ni]);
    snapTo(y);
  };

  const onKey = (e) => {
    if (isAnimating || shouldBypass(e)) return;
    const keysNext = ['PageDown','ArrowDown','Space'];
    const keysPrev = ['PageUp','ArrowUp','Shift+Space'];
    let dir = 0;
    if (e.key === 'PageDown' || e.key === 'ArrowDown' || (e.key === ' ' && !e.shiftKey)) dir = 1;
    if (e.key === 'PageUp' || e.key === 'ArrowUp' || (e.key === ' ' && e.shiftKey)) dir = -1;
    if (!dir) return;
    e.preventDefault();
    const ni = nextIndex(dir);
    const y = getY(anchors[ni]);
    snapTo(y);
  };

  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('keydown', onKey, { passive: false });
})();
