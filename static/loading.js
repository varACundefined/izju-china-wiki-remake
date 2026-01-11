/**
 * Loading page management script
 * Handle loading effect during page transitions
 */

class LoadingManager {
  constructor() {
    this.loadingContainer = null;
    this.isLoading = false;
    this.progress = 0;
    this.percentageElement = null;
    this.progressBar = null;
    this.init();
  }

  init() {
    // Create loading container
    this.createLoadingContainer();
    
    // Listen for page navigation
    this.bindNavigationEvents();
    
    // Listen for page load completion
    this.bindPageLoadEvents();
  }

  createLoadingContainer() {
    // Check if loading container already exists
    if (document.querySelector('.loading-container')) {
      this.loadingContainer = document.getElementById('loadingContainer');
      this.percentageElement = document.getElementById('loadingPercentage');
      this.progressBar = document.querySelector('.loading-progress-bar');
      return;
    }

    const loadingHTML = `
      <div class="loading-container" id="loadingContainer" style="display: none;">
        <!-- Background animation elements -->
        <div class="loading-bg">
          <div class="loading-bg-circle"></div>
          <div class="loading-bg-circle"></div>
          <div class="loading-bg-circle"></div>
          <div class="loading-bg-circle"></div>
        </div>
        
        <!-- Main content -->
        <div class="loading-content">
          <div class="loading-logo">
            <img src="/static/_downloaded/static.igem.wiki/teams/5913/picture/menu.webp" alt="IZJU-CHINA Logo">
          </div>
          
          <h1 class="loading-title">IZJU-CHINA</h1>
          <p class="loading-subtitle">Loading amazing content...</p>
          
          <div class="loading-spinner"></div>
          
          <div class="loading-progress">
            <div class="loading-progress-bar"></div>
          </div>
          
          <div class="loading-percentage" id="loadingPercentage">0%</div>
          
          <div class="loading-dots">
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
          </div>
        </div>
      </div>
    `;

    // Add loading container to body
    document.body.insertAdjacentHTML('afterbegin', loadingHTML);
    
    this.loadingContainer = document.getElementById('loadingContainer');
    this.percentageElement = document.getElementById('loadingPercentage');
    this.progressBar = document.querySelector('.loading-progress-bar');
  }

  bindNavigationEvents() {
    // Listen to all navigation link clicks
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link && this.shouldShowLoading(link)) {
        e.preventDefault();
        this.showLoading(link.href);
      }
    });

    // Listen to browser forward/backward navigation
    // Note: Don't show loading on popstate, just let the browser handle it naturally
    // The page will reload and hideLoading will be called on the 'load' event
  }

  bindPageLoadEvents() {
    // Hide loading after page load completes
    window.addEventListener('load', () => {
      this.hideLoading();
    });

    // DOM
    document.addEventListener('DOMContentLoaded', () => {
      if (this.isLoading) {
        this.startProgressAnimation();
      } else {
        // If not loading, make sure loading container is hidden
        // This handles the case when navigating via browser back/forward
        if (this.loadingContainer && this.loadingContainer.style.display !== 'none') {
          this.loadingContainer.style.display = 'none';
        }
      }
    });

    // Handle browser back/forward button navigation (bfcache)
    // This event fires when page is restored from browser cache
    window.addEventListener('pageshow', (event) => {
      // If page was restored from bfcache (browser back/forward cache)
      if (event.persisted) {
        // Force hide loading immediately
        if (this.loadingContainer) {
          this.loadingContainer.style.display = 'none';
          this.loadingContainer.classList.add('hidden');
          this.loadingContainer.classList.remove('fade-out');
        }
        this.isLoading = false;
      }
    });
  }

  shouldShowLoading(link) {
    // loading
    if (!link || !link.href) return false;
    
    
    if (link.closest('#theme-picker') || link.id === 'theme-toggle') return false;
    
    // href #javascript: 
    const rawHref = (link.getAttribute('href') || '').trim();
    if (!rawHref) return false;
    
    //  JS 
    if (rawHref.startsWith('#')) return false;
    if (rawHref.toLowerCase().startsWith('javascript:')) return false;
    
    
    const target = (link.getAttribute('target') || '').toLowerCase();
    if (target === '_blank') return false;
    if (link.hasAttribute('download')) return false;
    const rel = (link.getAttribute('rel') || '').toLowerCase();
    if (rel.includes('external') || rel.includes('nofollow')) return false;
    
    
    if (link.hostname !== window.location.hostname) return false;
    
    
    const samePath = link.pathname === window.location.pathname;
    if (samePath) return false;
    
    return true;
  }

  showLoading(targetUrl) {
    this.show(targetUrl);
  }

  hideLoading() {
    // Always hide loading container regardless of isLoading state
    // This ensures it's hidden even when navigating via browser back/forward buttons
    this.isLoading = false;
    
    if (this.loadingContainer) {
      // Check if loading container is actually visible before hiding
      const isVisible = this.loadingContainer.style.display !== 'none' && 
                       window.getComputedStyle(this.loadingContainer).display !== 'none';
      
      if (!isVisible) return; // Already hidden, no need to do anything
      
      this.loadingContainer.classList.add('fade-out');
      
      setTimeout(() => {
        this.loadingContainer.classList.add('hidden');
        this.loadingContainer.style.display = 'none';
        this.loadingContainer.classList.remove('fade-out');
      }, 500);
    }
  }

  startProgressAnimation() {
    if (!this.percentageElement || !this.progressBar) {
      return;
    }
    
    
    this.progress = 0;
    this.percentageElement.textContent = '0%';
    this.progressBar.style.width = '0%';
    
    const updateProgress = () => {
      if (!this.isLoading) {
        return;
      }
      
      
      this.progress += Math.random() * 8 + 2; // 2-10
      if (this.progress > 100) this.progress = 100;
      
      this.percentageElement.textContent = Math.round(this.progress) + '%';
      this.progressBar.style.width = this.progress + '%';
      
      if (this.progress < 100) {
        setTimeout(updateProgress, 80 + Math.random() * 120);
      }
    };
    
    
    setTimeout(updateProgress, 50);
    
    // 1.5
    setTimeout(() => {
      if (this.progress < 100) {
        this.progress = 100;
        this.percentageElement.textContent = '100%';
        this.progressBar.style.width = '100%';
      }
    }, 1500);
  }

  // loading
  show(targetUrl = null) {
    if (this.isLoading) {
      return;
    }
    
    this.isLoading = true;
    this.progress = 0;
    
    // loading
    if (this.loadingContainer) {
      this.loadingContainer.style.display = 'flex';
      this.loadingContainer.style.opacity = '1';
      this.loadingContainer.style.transform = 'scale(1)';
    }
    
    
    this.startProgressAnimation();
    
    // URL
    if (targetUrl) {
      setTimeout(() => {
        if (this.isLoading) {
          window.location.href = targetUrl;
        }
      }, 2000); 
    }
  }

  // loading
  hide() {
    this.hideLoading();
  }
}

// loading
window.loadingManager = new LoadingManager();


if (typeof module !== 'undefined' && module.exports) {
  module.exports = LoadingManager;
}
