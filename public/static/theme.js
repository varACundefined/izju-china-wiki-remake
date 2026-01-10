(function () {
  const key = 'theme';
  const root = document.documentElement;
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Theme options configuration
  const modeOptions = {
    light: {
      '--default-color-10': 'rgba(135, 206, 235, 1)',  // Sky blue
      '--default-color-9': 'rgba(135, 206, 235, .9)',
      '--default-color-8': 'rgba(135, 206, 235, .8)',
      '--default-color-7': 'rgba(135, 206, 235, .7)',
      '--default-color-6': 'rgba(135, 206, 235, .6)',
      '--default-color-5': 'rgba(135, 206, 235, .5)',
      '--default-color-4': 'rgba(135, 206, 235, .4)',
      '--default-color-3': 'rgba(135, 206, 235, .3)',
      '--default-color-2': 'rgba(135, 206, 235, .2)',
      '--default-color-1': 'rgba(135, 206, 235, .1)',
      '--background-color': '#87CEEB',  // Sky blue
      '--box-shadow': '0 1px 8px 0 rgba(0, 100, 200, 0.15)',
      '--box-shadow-hover': '0 2px 16px 0 rgba(0, 100, 200, 0.25)',
      '--text-color': '#1a365d',  // Deep blue text
      '--text-color-sub': '#4a5568',
      '--text': '#1a365d',  // Dropdown menu text color
      '--border-color': '#bee3f8',
      '--code-color': 'rgba(26, 54, 93, 0.05)',
      '--mask-color': '#4a5568',
      '--see-more-bg-color': '#bee3f8',
      // Navbar related variables
      '--nav-bg': '#e6f3ff',  // Light sky blue navbar
      '--nav-text': '#1a365d',
      '--nav-link': '#1a365d',
      '--nav-link-hover': '#2b6cb0',
      '--nav-bg-alpha': 'rgba(230, 243, 255, 0.9)',
      '--nav-border': 'rgba(26, 54, 93, 0.1)',
      '--nav-shadow': 'rgba(0, 100, 200, 0.1)',
      // Sidebar related variables
      '--bg': '#FFF9E9',  // Sidebar background
      '--lg': '#D5E5CA',  // Light green
      '--mg': '#6D966B',  // Medium green
      '--dg': '#006C62',  // Dark green
      '--y': '#FFC570',   // Yellow
      '--shy': '#EAF6E8', // Softer green highlight for active items
      '--font': '#402C1A', // Font color
      '--disc': '#A9C09E', // Disc color
    },
    dark: {
      '--default-color-10': 'rgba(25, 25, 112, 1)',  
      '--default-color-9': 'rgba(25, 25, 112, .9)',
      '--default-color-8': 'rgba(25, 25, 112, .8)',
      '--default-color-7': 'rgba(25, 25, 112, .7)',
      '--default-color-6': 'rgba(25, 25, 112, .6)',
      '--default-color-5': 'rgba(25, 25, 112, .5)',
      '--default-color-4': 'rgba(25, 25, 112, .4)',
      '--default-color-3': 'rgba(25, 25, 112, .3)',
      '--default-color-2': 'rgba(25, 25, 112, .2)',
      '--default-color-1': 'rgba(25, 25, 112, .1)',
      '--background-color': '#191970',  // Deep blue background (midnight blue)
      '--box-shadow': '0 1px 8px 0 rgba(0, 0, 50, .6)',
      '--box-shadow-hover': '0 2px 16px 0 rgba(0, 0, 50, .7)',
      '--text-color': 'rgba(230, 243, 255, .9)',  
      '--text-color-sub': '#a0aec0',
      '--text': '#e6f3ff',  // Dropdown menu text color
      '--border-color': '#4a5568',
      '--code-color': 'rgba(0, 0, 50, .3)',
      '--mask-color': '#000',
      '--see-more-bg-color': '#2d3748',
      // Navbar related variables
      '--nav-bg': '#1a202c',  
      '--nav-text': '#e6f3ff',
      '--nav-link': '#e6f3ff',
      '--nav-link-hover': '#90cdf4',
      '--nav-bg-alpha': 'rgba(26, 32, 44, 0.8)',
      '--nav-border': 'rgba(230, 243, 255, 0.1)',
      '--nav-shadow': 'rgba(0, 0, 50, 0.4)',
      // Sidebar related variables (dark theme)
      '--bg': '#1a202c',  // Dark sidebar background
      '--lg': '#2d3748',  // Dark light green
      '--mg': '#90cdf4',  // Light blue for medium green
      '--dg': '#63b3ed',  // Lighter blue for dark green
      '--y': '#fbd38d',   // Light yellow
      '--shy': '#2d3748', // Dark shy yellow (darker background)
      '--font': '#e6f3ff', // Light font color for dark theme
      '--disc': '#4a5568', // Dark disc color
    }
  };

  function render(mode) {
    const options = modeOptions[mode];
    const opposite = mode === 'dark' ? 'light' : 'dark';

    for (const k in options) {
      root.style.setProperty(k, options[k]);
    }

    root.classList.remove(opposite);
    root.classList.add(mode);
    root.setAttribute('data-theme', mode);
  }

  function applyMode(mode) {
    // 网站仅使用暗色模式
    render('dark');
  }

  function init() {
    const saved = localStorage.getItem(key) || 'dark';
    applyMode('dark');
    updateModePicker('dark');
  }

  function updateModePicker(mode) {
    const modeItems = document.querySelectorAll('.color-mode-options li');
    modeItems.forEach(item => {
      item.classList.remove('active');
      if (item.dataset.mode === mode) {
        item.classList.add('active');
      }
    });
  }

  init();

  // auto
  // 媒体查询事件不再改变模式（固定暗色）

  
  document.addEventListener('DOMContentLoaded', function() {
    const themePicker = document.getElementById('theme-picker');
    const themeMenu = document.getElementById('theme-menu');
    const themeToggle = document.getElementById('theme-toggle');
    const modeItems = document.querySelectorAll('.color-mode-options li');

    
    themeToggle?.addEventListener('click', (e) => {
      e.preventDefault();
      themeMenu.style.display = themeMenu.style.display === 'none' ? 'block' : 'none';
    });

    
    modeItems.forEach(item => {
      item.addEventListener('click', () => {
        const mode = item.dataset.mode;
        localStorage.setItem(key, mode);
        applyMode(mode);
        updateModePicker(mode);
        themeMenu.style.display = 'none';
      });
    });

    
    document.addEventListener('click', (e) => {
      if (!themePicker?.contains(e.target)) {
        themeMenu.style.display = 'none';
      }
    });
  });
})();