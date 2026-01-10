(function () {
  let isNormalizingIcons = false;
  let scheduleNormalizeTimer = null;
  function getContentRoot() {
    const ids = [
      'auto-background-content',
      'auto-wetlab-content',
      'auto-safety-content',
      'auto-implementation-content',
      'auto-description-content',
      'auto-collaboration-content',
      'auto-ihp-content',
      'auto-entrepreneurship-content',
      'auto-future-content',
      'auto-parts-content',
      'auto-page-content',
      'content'
    ];
    for (let i = 0; i < ids.length; i++) {
      const el = document.getElementById(ids[i]);
      if (el) return el;
    }
    return null;
  }

  function slugify(text) {
    return (text || '')
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5\s\.-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  }

  function ensureHeadingIds(root) {
    const allHeadings = Array.from(root.querySelectorAll('h1, h2, h3'));
    allHeadings.forEach((heading) => {
      if (!heading.id) {
        const text = (heading.textContent || '').trim();
        heading.id = slugify(text);
      }
    });
  }

  function normalizeIcons() {
    if (isNormalizingIcons) return;
    isNormalizingIcons = true;

    const items = document.querySelectorAll('#menu .t1, #menu .t2');
    items.forEach((item) => {
      const isT1 = item.classList.contains('t1');
      const next = item.nextElementSibling;
      const hasChildren = isT1
        ? (next && next.classList.contains('h2-sec') && next.children.length > 0)
        : (next && next.classList.contains('h3-sec') && next.children.length > 0);

      let icon = item.querySelector('.expand-icon');
      if (hasChildren) {
        if (!icon) {
          icon = document.createElement('span');
          icon.className = 'expand-icon';
          item.appendChild(icon);
        }
        const expected = item.classList.contains('unfold') ? '▼' : '▶';
        if (icon.innerHTML !== expected) icon.innerHTML = expected;
      } else if (icon) {
        icon.remove();
      }
    });

    isNormalizingIcons = false;
  }

  function scrollToHeadingById(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const nav = document.querySelector('.my-nav');
    const navHeight = nav ? nav.getBoundingClientRect().height : 0;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 800;
    const dynamicOffset = Math.floor(viewportHeight * 0.3) + navHeight;
    const rect = el.getBoundingClientRect();
    const top = rect.top + window.pageYOffset;
    const target = Math.max(0, top - dynamicOffset);
    window.scrollTo({ top: target, behavior: 'smooth' });
  }

  function attachMenuHandlers() {
    const menu = document.getElementById('menu');
    if (!menu) return;

    menu.addEventListener('click', function (e) {
      const t1 = e.target.closest('.t1');
      const t2 = e.target.closest('.t2');
      const t3 = e.target.closest('.t3');

      if (t1 && menu.contains(t1)) {
        const isUnfold = t1.classList.contains('unfold');

        document.querySelectorAll('#menu .t1').forEach((item) => {
          item.classList.remove('unfold');
          const icon = item.querySelector('.expand-icon');
          if (icon) icon.innerHTML = '▶';
        });
        document.querySelectorAll('#menu .t2').forEach((item) => {
          item.classList.remove('unfold');
          const icon = item.querySelector('.expand-icon');
          if (icon) icon.innerHTML = '▶';
        });

        if (!isUnfold) {
          t1.classList.add('unfold');
          const icon = t1.querySelector('.expand-icon');
          if (icon) icon.innerHTML = '▼';
        }

        const targetId = t1.getAttribute('tid');
        if (targetId) scrollToHeadingById(targetId);

        window.userManualNavigation = true;
        setTimeout(() => {
          if (typeof window.updateActiveSection === 'function') window.updateActiveSection();
          window.userManualNavigation = false;
        }, 100);
        return;
      }

      if (t2 && menu.contains(t2)) {
        const icon = t2.querySelector('.expand-icon');
        const h3Container = t2.nextElementSibling;
        if (icon && h3Container && h3Container.classList.contains('h3-sec')) {
          const isUnfold = t2.classList.contains('unfold');
          if (isUnfold) {
            t2.classList.remove('unfold');
            icon.innerHTML = '▶';
          } else {
            t2.classList.add('unfold');
            icon.innerHTML = '▼';
          }
        }

        const targetId = t2.getAttribute('tid');
        if (targetId) scrollToHeadingById(targetId);

        window.userManualNavigation = true;
        setTimeout(() => {
          if (typeof window.updateActiveSection === 'function') window.updateActiveSection();
          window.userManualNavigation = false;
        }, 100);
        return;
      }

      if (t3 && menu.contains(t3)) {
        const targetId = t3.getAttribute('tid');
        if (targetId) scrollToHeadingById(targetId);
        window.userManualNavigation = true;
        setTimeout(() => {
          if (typeof window.updateActiveSection === 'function') window.updateActiveSection();
          window.userManualNavigation = false;
        }, 100);
        return;
      }
    });
  }

  function initScrollHighlight(root) {
    const sections = root.querySelectorAll('h1, h2, h3');
    const menuItems = {
      t1: document.querySelectorAll('#menu .t1'),
      t2: document.querySelectorAll('#menu .t2'),
      t3: document.querySelectorAll('#menu .t3')
    };

    window.updateActiveSection = function () {
      if (window.userManualNavigation) return;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const nav = document.querySelector('.my-nav');
      const navHeight = nav ? nav.getBoundingClientRect().height : 0;
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 800;
      const dynamicOffset = Math.floor(viewportHeight * 0.3) + navHeight;
      const currentViewPosition = scrollTop + dynamicOffset;

      let activeHeading = null;
      let minDistance = Infinity;
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top + scrollTop;
        if (sectionTop <= currentViewPosition) {
          const distance = currentViewPosition - sectionTop;
          if (distance < minDistance) {
            minDistance = distance;
            activeHeading = section;
          }
        }
      });

      menuItems.t1.forEach((item) => item.classList.remove('active', 'show'));
      menuItems.t2.forEach((item) => item.classList.remove('active', 'show'));
      menuItems.t3.forEach((item) => item.classList.remove('active', 'show'));

      if (!activeHeading) return;
      const level = activeHeading.tagName;
      const id = activeHeading.id;

      if (level === 'H1') {
        const activeT1 = document.querySelector(`#menu .t1[tid="${id}"]`);
        if (activeT1) {
          activeT1.classList.add('active', 'show', 'unfold');
          const icon = activeT1.querySelector('.expand-icon');
          if (icon) icon.innerHTML = '▼';
        }
      } else if (level === 'H2') {
        const activeT2 = document.querySelector(`#menu .t2[tid="${id}"]`);
        if (activeT2) {
          activeT2.classList.add('active', 'show', 'unfold');
          const icon2 = activeT2.querySelector('.expand-icon');
          if (icon2) icon2.innerHTML = '▼';
          const parentH2Sec = activeT2.closest('.h2-sec');
          if (parentH2Sec) {
            const parentT1 = parentH2Sec.previousElementSibling;
            if (parentT1 && parentT1.classList.contains('t1')) {
              parentT1.classList.add('active', 'show', 'unfold');
              const icon1 = parentT1.querySelector('.expand-icon');
              if (icon1) icon1.innerHTML = '▼';
            }
          }
        }
      } else if (level === 'H3') {
        const activeT3 = document.querySelector(`#menu .t3[tid="${id}"]`);
        if (activeT3) {
          activeT3.classList.add('active', 'show');
          const parentH3Sec = activeT3.closest('.h3-sec');
          if (parentH3Sec) {
            const parentT2 = parentH3Sec.previousElementSibling;
            if (parentT2 && parentT2.classList.contains('t2')) {
              parentT2.classList.add('active', 'show', 'unfold');
              const icon2 = parentT2.querySelector('.expand-icon');
              if (icon2) icon2.innerHTML = '▼';
              const parentH2Sec = parentT2.closest('.h2-sec');
              if (parentH2Sec) {
                const parentT1 = parentH2Sec.previousElementSibling;
                if (parentT1 && parentT1.classList.contains('t1')) {
                  parentT1.classList.add('active', 'show', 'unfold');
                  const icon1 = parentT1.querySelector('.expand-icon');
                  if (icon1) icon1.innerHTML = '▼';
                }
              }
            }
          }
        }
      }
    };

    let scrollTimeout;
    window.addEventListener('scroll', function () {
      if (window.userManualNavigation) return;
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(window.updateActiveSection, 10);
    }, { passive: true });

    setTimeout(window.updateActiveSection, 100);
  }

  document.addEventListener('DOMContentLoaded', function () {
    try {
      const root = getContentRoot();
      const menu = document.getElementById('menu');
      if (!root || !menu) return;

      ensureHeadingIds(root);
      normalizeIcons();
      attachMenuHandlers();
      initScrollHighlight(root);

      // Re-normalize icons if the page script rebuilds the #menu later
      const observer = new MutationObserver(function (mutations) {
        let shouldNormalize = false;
        for (let i = 0; i < mutations.length; i++) {
          if (mutations[i].type === 'childList') {
            shouldNormalize = true;
            break;
          }
        }
        if (!shouldNormalize) return;
        if (scheduleNormalizeTimer) {
          clearTimeout(scheduleNormalizeTimer);
        }
        scheduleNormalizeTimer = setTimeout(() => {
          normalizeIcons();
          scheduleNormalizeTimer = null;
        }, 0);
      });
      observer.observe(menu, { childList: true, subtree: true });
    } catch (e) {
      // Initialization failed silently
    }
  });
})();


