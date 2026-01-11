(function() {
  // Search functionality
  class SearchBox {
    constructor() {
      this.searchInput = document.getElementById('search-input');
      this.suggestions = document.getElementById('search-suggestions');
      this.query = '';
      this.focused = false;
      this.focusIndex = 0;
      this.searchData = [];
      this.debounceTimer = null;
      
      this.init();
    }

    init() {
      if (!this.searchInput || !this.suggestions) return;
      
      this.loadSearchData();
      this.bindEvents();
    }

    loadSearchData() {
      // Dynamically collect links from menu, automatically reflect additions/deletions/changes
      const collected = [];
      const seen = new Set();

      const normalizePath = (href) => {
        try {
          // If href is already an absolute URL with a different origin, return as-is
          if (href.startsWith('http://') || href.startsWith('https://')) {
            const u = new URL(href);
            if (u.origin !== window.location.origin) {
              return href;
            }
            // Same origin, use the pathname
            return u.pathname.replace(/\/index\.html$/, '/');
          }
          
          // Handle relative paths: resolve against current page location
          const u = new URL(href, window.location.href);
          return u.pathname.replace(/\/index\.html$/, '/');
        } catch (e) {
          return href || '';
        }
      };

      // 1) Prioritize collection from top menu
      const menuLinks = document.querySelectorAll('#my-navbar a[href]');
      menuLinks.forEach((a) => {
        const rawHref = a.getAttribute('href') || '';
        if (!rawHref || rawHref.startsWith('#') || rawHref.startsWith('javascript:')) return;
        const path = normalizePath(rawHref);
        // Limit to internal links
        if (!path.startsWith('/')) return;
        // Use data-search-title if available, otherwise use text content
        const title = (a.getAttribute('data-search-title') || a.textContent || '').trim();
        if (!title) return;
        const key = `${title}@@${path}`;
        if (seen.has(key)) return;
        seen.add(key);
        collected.push({ title, path });
      });

      // 2) Fallback: other internal links on the page
      if (collected.length === 0) {
        const pageLinks = document.querySelectorAll('a[href]');
        pageLinks.forEach((a) => {
          const rawHref = a.getAttribute('href') || '';
          if (!rawHref || rawHref.startsWith('#') || rawHref.startsWith('javascript:')) return;
          const path = normalizePath(rawHref);
          if (!path.startsWith('/')) return;
          const title = (a.textContent || '').trim();
          if (!title) return;
          const key = `${title}@@${path}`;
          if (seen.has(key)) return;
          seen.add(key);
          collected.push({ title, path });
        });
      }

      // 3) Final assignment
      this.searchData = collected;
    }

    bindEvents() {
      this.searchInput.addEventListener('input', (e) => {
        this.query = e.target.value;
        if (this.debounceTimer) clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => this.updateSuggestions(), 120);
      });

      this.searchInput.addEventListener('focus', () => {
        this.focused = true;
        this.updateSuggestions();
      });

      this.searchInput.addEventListener('blur', () => {
        // Delay hiding to allow click events to trigger
        setTimeout(() => {
          this.focused = false;
          this.hideSuggestions();
        }, 200);
      });

      this.searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          this.onDown();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          this.onUp();
        } else if (e.key === 'Enter') {
          e.preventDefault();
          this.go(this.focusIndex);
        } else if (e.key === 'Escape') {
          this.hideSuggestions();
        }
      });
    }

    updateSuggestions() {
      if (!this.focused || !this.query.trim()) {
        this.hideSuggestions();
        return;
      }

      const query = this.query.trim().toLowerCase();
      const scored = this.searchData
        .map(item => {
          const title = item.title.toLowerCase();
          const path = item.path.toLowerCase();
          let score = -1;
          if (title === query) score = 100;
          else if (title.startsWith(query)) score = 80;
          else if (title.includes(query)) score = 60;
          else if (path.includes(query)) score = 40;
          return { item, score };
        })
        .filter(x => x.score >= 0)
        .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
        .slice(0, 8)
        .map(x => x.item);

      this.showSuggestions(scored, query);
    }

    showSuggestions(matches, query) {
      if (matches.length === 0) {
        this.hideSuggestions();
        return;
      }

      this.suggestions.innerHTML = '';
      this.focusIndex = 0;

      matches.forEach((match, index) => {
        const li = document.createElement('li');
        li.className = 'suggestion';
        if (index === 0) li.classList.add('focused');

        const a = document.createElement('a');
        a.href = match.path;
        const safeTitle = match.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const reg = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig');
        const highlighted = safeTitle.replace(reg, '<mark>$1</mark>');
        a.innerHTML = `<span class="page-title">${highlighted}</span>`;
        
        li.appendChild(a);
        this.suggestions.appendChild(li);

        // Bind click events
        li.addEventListener('click', (e) => {
          e.preventDefault();
          this.go(index);
        });

        // Bind mouse hover events
        li.addEventListener('mouseenter', () => {
          this.focus(index);
        });
      });

      this.suggestions.style.display = 'block';
    }

    hideSuggestions() {
      this.suggestions.style.display = 'none';
      this.focusIndex = 0;
    }

    onUp() {
      const suggestions = this.suggestions.querySelectorAll('.suggestion');
      if (suggestions.length === 0) return;

      suggestions[this.focusIndex]?.classList.remove('focused');
      this.focusIndex = this.focusIndex > 0 ? this.focusIndex - 1 : suggestions.length - 1;
      suggestions[this.focusIndex]?.classList.add('focused');
    }

    onDown() {
      const suggestions = this.suggestions.querySelectorAll('.suggestion');
      if (suggestions.length === 0) return;

      suggestions[this.focusIndex]?.classList.remove('focused');
      this.focusIndex = this.focusIndex < suggestions.length - 1 ? this.focusIndex + 1 : 0;
      suggestions[this.focusIndex]?.classList.add('focused');
    }

    focus(index) {
      const suggestions = this.suggestions.querySelectorAll('.suggestion');
      suggestions[this.focusIndex]?.classList.remove('focused');
      this.focusIndex = index;
      suggestions[this.focusIndex]?.classList.add('focused');
    }

    go(index) {
      const suggestions = this.suggestions.querySelectorAll('.suggestion');
      if (suggestions[index]) {
        const link = suggestions[index].querySelector('a');
        if (link) {
          window.location.href = link.href;
        }
      }
      this.query = '';
      this.searchInput.value = '';
      this.hideSuggestions();
    }
  }

  // Initialize search functionality
  document.addEventListener('DOMContentLoaded', function() {
    new SearchBox();
  });
})();
